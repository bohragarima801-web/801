import axios from 'axios'
import sharp from 'sharp'
import { getLLM } from '@/lib/ai'
import { uploadToSupabase } from '@/lib/supabase/storage-helpers'

export interface BlogVisualConcept {
  primarySubject: string
  secondarySubject: string
  deityOrEntity: string
  ritualOrEvent: string
  environment: string
  lighting: string
  cameraShot: string
  mood: string
  cinematicPrompt: string
  altText: string
  seoFilename: string
  imageDescription: string
}

export interface ContentAwareImageResult {
  coverImage: string
  coverImageAlt: string
  seoFilename: string
  visualConcept: BlogVisualConcept
  source: 'ai_generated' | 'fallback_curated'
}

// ── Curated high-resolution sacred artwork fallback catalog (all bright, authentic 16:9 WebP)
const CURATED_SACRED_FALLBACKS: Record<string, { image: string; altText: string }> = {
  lakshmi: {
    image: '/ashta_lakshmi_16days.webp',
    altText: 'मां अष्टलक्ष्मी एवं कनकधारा समृद्धि महापूजा'
  },
  shiva: {
    image: '/mahamrityunjaya_hawan.webp',
    altText: 'भगवान शिव महामृत्युंजय जाप एवं रुद्राभिषेक हवन'
  },
  bagalamukhi: {
    image: '/bagalamukhi_kavach_yagya.webp',
    altText: 'मां बगलामुखी पीतांबरा शत्रु बाधा निवारण महायज्ञ'
  },
  durga: {
    image: '/durga_saptashati_yagya_1.webp',
    altText: 'मां दुर्गा सप्तशती महायज्ञ एवं शक्ति अनुष्ठान'
  },
  kalsarp: {
    image: '/kalsarp_dosh_nivaran_banner.webp',
    altText: 'नाग पंचमी एवं कालसर्प दोष शांति महापूजा'
  },
  shani: {
    image: '/shani_dosh_yagya.webp',
    altText: 'शनि साढ़ेसाती एवं ढैय्या दोष शांति महापूजा'
  },
  pitra: {
    image: '/pitra_shanti_tarpan.webp',
    altText: 'सर्वपितृ मोक्ष अमावस्या एवं नारायण बलि तर्पण'
  },
  vivah: {
    image: '/katyayani_yagya_hero.webp',
    altText: 'मां कात्यायनी शीघ्र विवाह एवं मांगलिक दोष निवारण महायज्ञ'
  },
  navgrah: {
    image: '/navgrah_shanti_yagya.webp',
    altText: 'नवग्रह शांति महापूजा एवं ग्रहदोष निवारण'
  },
  vastu: {
    image: '/vastu_dosh_yagya.webp',
    altText: 'गृह शांति एवं वास्तु दोष निवारण महापूजा'
  },
  bhoomi: {
    image: '/varahi_land_yagya.webp',
    altText: 'मां वाराही भूमि विवाद एवं संपत्ति लाभ महायज्ञ'
  },
  protection: {
    image: '/pratyangira_tantrok_hawan.webp',
    altText: 'प्रत्यंगिरा शक्ति हवन एवं नकारात्मक ऊर्जा निवारण'
  },
  generic_yagya: {
    image: '/durga_saptashati_yagya_2.webp',
    altText: 'वैदिक पूजा, संकल्प एवं पावन हवन अनुष्ठान'
  }
}

/**
 * Clean & slugify strings for SEO-compliant filenames
 */
function createSeoFilename(text: string): string {
  const cleaned = text
    .toLowerCase()
    .replace(/\.(webp|jpg|jpeg|png)$/i, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50)
  return `${cleaned || 'divyayagyam-vedic-puja'}.webp`
}

/**
 * Deterministic variation selector based on seed string to ensure diverse visual styles
 */
function getStyleVariations(seedStr: string) {
  let hash = 0
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i)
    hash |= 0
  }
  const absHash = Math.abs(hash)

  const cameraShots = [
    'cinematic eye-level medium shot with sharp focal clarity and shallow depth of field',
    'dramatic wide-angle landscape shot capturing the sacred ritual and architectural grandeur',
    'atmospheric three-quarters perspective highlighting the sacred altar offerings and rising incense smoke',
    'intimate medium-close composition with beautiful bokeh and luminous divine reflections',
    'majestic low-angle perspective looking towards the consecrated altar and glowing halo'
  ]

  const environments = [
    'ancient hand-carved Indian stone temple sanctum with intricate Sanskrit relief carvings and hanging brass bells',
    'sacred holy river ghat at dawn with water reflections, floating orange marigold blossoms, and morning mist',
    'traditional Vedic yagya shala with thatched wooden rafters, brass lamps, and consecrated hawan fire altar',
    'ornate sanctum sanctorum illuminated by radiant golden halos and hundreds of consecrated ghee diyas',
    'peaceful sacred hermitage courtyard shaded by ancient banyan and peepal trees'
  ]

  const lightings = [
    'Brahma Muhurta sunrise dawn with ethereal soft golden mist and volumetric god-rays',
    'golden hour late afternoon with rich warm amber sunlight streaming across the sacred floor',
    'sacred evening twilight illuminated by warm glowing brass diyas and dancing holy flames',
    'radiant morning temple courtyard with crystal-clear soft diffused natural daylight and divine golden aura'
  ]

  const compositions = [
    'rule-of-thirds composition with ceremonial offerings in crisp foreground and majestic sanctum background',
    'central sacred focal point with balanced divine symmetry and uncluttered negative space',
    'dynamic diagonal framing emphasizing the consecrated holy flames, sacred flowers, and spiritual grandeur'
  ]

  return {
    cameraShot: cameraShots[absHash % cameraShots.length],
    environment: environments[(absHash >> 2) % environments.length],
    lighting: lightings[(absHash >> 4) % lightings.length],
    composition: compositions[(absHash >> 6) % compositions.length]
  }
}

/**
 * Rule-based fallback extractor if LLM call is unavailable or times out
 */
function extractFallbackVisualConcept(title: string, content: string, categoryName = ''): BlogVisualConcept {
  const combined = `${title} ${categoryName} ${content}`.toLowerCase()
  const variations = getStyleVariations(title)

  // 1. Nag Panchami / Kalsarp Dosh
  if (combined.includes('नाग') || combined.includes('कालसर्प') || combined.includes('सर्प') || combined.includes('kaalsarp') || combined.includes('naga')) {
    return {
      primarySubject: 'Sacred Nag Devta serpent deity idol and holy Shiva Lingam',
      secondarySubject: 'Fresh bilva leaves, fragrant white datura flowers, brass jaladhari dripping holy Ganga water, and sacred black sesame',
      deityOrEntity: 'Nag Devta and Lord Shiva',
      ritualOrEvent: 'Kalsarp dosh shanti puja and Nag Panchami milk abhishek',
      environment: variations.environment,
      lighting: variations.lighting,
      cameraShot: variations.cameraShot,
      mood: 'Reverent, mysterious, deeply spiritual, protective and sacred',
      cinematicPrompt: `Award-winning cinematic editorial photograph of sacred Nag Devta serpent idol and holy Shiva Lingam adorned with fresh bilva leaves, fragrant white flowers, and holy Ganga water, traditional Indian stone temple sanctum, glowing brass oil lamps, burning camphor and dhoop, deep spiritual atmosphere, ${variations.lighting}, ${variations.cameraShot}, 16:9 landscape aspect ratio, 8k resolution, photorealistic Indian devotional aesthetic, no text, no letters, no watermark, no logo, no cartoon, no 3D render`,
      altText: 'नाग पंचमी एवं कालसर्प दोष शांति पूजा - दिव्ययज्ञम्',
      seoFilename: createSeoFilename('naga-panchami-kaalsarp-dosh-shanti-puja'),
      imageDescription: 'Sacred Nag Devta and Shiva Lingam with bilva leaves and brass lamps in ancient Indian temple'
    }
  }

  // 2. Lord Rama / Dussehra / Vijayadashami
  if (combined.includes('राम') || combined.includes('दशहरा') || combined.includes('विजयादशमी') || combined.includes('रावण') || combined.includes('dussehra') || combined.includes('rama')) {
    return {
      primarySubject: 'Lord Rama with divine glowing Kodanda bow and heroic serene expression',
      secondarySubject: 'Traditional Indian Dussehra victory celebration in background, glowing twilight sky, marigold flower garlands, sacred flags',
      deityOrEntity: 'Lord Rama (Shri Ram)',
      ritualOrEvent: 'Vijayadashami victory festival celebration and prayer',
      environment: 'Sacred open ground under an expansive glowing twilight sky with distant temple spires',
      lighting: 'Atmospheric evening twilight with rich crimson and golden sky reflections and illuminated lamps',
      cameraShot: variations.cameraShot,
      mood: 'Heroic, divine, triumphant, inspiring, serene and righteous',
      cinematicPrompt: `Cinematic editorial photograph of Lord Rama in divine traditional attire holding majestic bow, serene and noble countenance, glowing golden aura, Indian Vijayadashami festival celebration in background with distant illuminated temple, glowing twilight sky, 16:9 landscape, photorealistic, 8k resolution, award-winning Indian devotional art, no text, no watermark, no typography, no logo`,
      altText: 'विजयादशमी एवं श्रीराम विजयोत्सव - दिव्ययज्ञम्',
      seoFilename: createSeoFilename('vijayadashami-shri-ram-vijayotsav'),
      imageDescription: 'Lord Rama during Vijayadashami celebration under glowing evening sky'
    }
  }

  // 3. Maa Baglamukhi / Peetambari / Shatru Badha
  if (combined.includes('बगलामुखी') || combined.includes('पीतांबरा') || combined.includes('शत्रु') || combined.includes('bagalamukhi') || combined.includes('peetambara')) {
    return {
      primarySubject: 'Goddess Baglamukhi sacred golden idol and luminous divine halo',
      secondarySubject: 'Vedic hawan kund with consecrated yellow mustard and turmeric offerings, glowing sacred holy fire, brass puja thali with pure ghee',
      deityOrEntity: 'Maa Baglamukhi',
      ritualOrEvent: 'Tantrik Baglamukhi hawan and kavach anushthan',
      environment: 'Ancient stone temple courtyard draped with yellow silk canopies and brass lamps',
      lighting: 'Vibrant golden hour glow combined with warm orange flames from the hawan kunda',
      cameraShot: variations.cameraShot,
      mood: 'Fiercely protective, deeply authoritative, intensely sacred and victorious',
      cinematicPrompt: `Cinematic editorial photograph of Goddess Baglamukhi sanctum, glowing golden and yellow aura, sacred hawan kund with consecrated holy fire offerings, yellow flowers, turmeric, traditional Indian stone temple architecture, rich warm divine lighting, spiritual atmosphere, 16:9 landscape, 8k resolution, award-winning devotional photography, no text, no watermark, no logo`,
      altText: 'मां बगलामुखी पीतांबरा महायज्ञ एवं शत्रु बाधा निवारण हवन',
      seoFilename: createSeoFilename('maa-bagalamukhi-peetambara-mahayagya'),
      imageDescription: 'Goddess Baglamukhi temple sanctum with golden aura and sacred hawan kund'
    }
  }

  // 4. Karz Mukti / Lakshmi / Kanakadhara / Wealth / Prosperity
  if (combined.includes('कर्ज') || combined.includes('लक्ष्मी') || combined.includes('कनकधारा') || combined.includes('धन') || combined.includes('अष्टलक्ष्मी') || combined.includes('दीपावली') || combined.includes('lakshmi') || combined.includes('wealth')) {
    return {
      primarySubject: 'Goddess Ashta Lakshmi seated gracefully on a consecrated pink lotus',
      secondarySubject: 'Cascading golden coins from abhaya mudra, glowing brass diyas, sacred red and gold silk drapery, fresh lotus blossoms, sincere devotee praying in humility',
      deityOrEntity: 'Maa Lakshmi',
      ritualOrEvent: 'Kanakadhara stotra path and Ashta Lakshmi karz mukti sadhana',
      environment: 'Luminous royal temple mandap with polished marble floors reflecting warm lamp light',
      lighting: 'Rich divine golden illumination with soft heavenly radiance',
      cameraShot: variations.cameraShot,
      mood: 'Abundant, peaceful, uplifting, filled with hope and auspicious grace',
      cinematicPrompt: `Cinematic editorial photograph of Goddess Lakshmi sanctum, golden lotus flower, radiant divine gold aura, consecrated brass oil lamps, devotee in reverent prayer, fresh red and pink lotuses, authentic Vedic temple setting, warm golden light, 16:9 landscape aspect ratio, 8k resolution, ultra-detailed photorealistic Indian devotional aesthetic, no text, no letters, no watermark, no logo`,
      altText: 'कर्ज मुक्ति कनकधारा स्तोत्र एवं अष्टलक्ष्मी महापूजा',
      seoFilename: createSeoFilename('karz-mukti-kanakadhara-ashta-lakshmi-sadhana'),
      imageDescription: 'Goddess Lakshmi golden sanctum with lotuses and consecrated oil lamps'
    }
  }

  // 5. Shiva / Mahamrityunjaya / Rudrabhishek / Sawan
  if (combined.includes('शिव') || combined.includes('रुद्र') || combined.includes('महामृत्युंजय') || combined.includes('सावन') || combined.includes('सोमवार') || combined.includes('भोलेनाथ') || combined.includes('shiva') || combined.includes('rudra')) {
    return {
      primarySubject: 'Sacred black stone Shiva Lingam adorned with chandan tripundra and fresh bilva leaves',
      secondarySubject: 'Pure Ganga water flowing from silver vessel, smoking dhoop cones, copper trishul with damru, white lotuses',
      deityOrEntity: 'Lord Shiva (Mahadev)',
      ritualOrEvent: 'Mahamrityunjaya jaap and Rudrabhishekam hawan',
      environment: 'Ancient Himalayan stone shrine with majestic mountain peaks visible in distance',
      lighting: 'Mystic Brahma Muhurta dawn light with soft heavenly blue and golden hues',
      cameraShot: variations.cameraShot,
      mood: 'Deeply tranquil, eternal, meditative, healing and transcendent',
      cinematicPrompt: `Cinematic editorial photograph of sacred ancient Shiva Lingam adorned with fresh bilva leaves, white lotus flowers, and chandan, consecrated copper trishul, sacred hawan fire in foreground, holy Ganga water abhishek, ancient Indian stone sanctum, 16:9 landscape aspect ratio, 8k photorealistic, warm divine lighting, no text, no typography, no watermark, no logo`,
      altText: 'महामृत्युंजय जाप एवं रुद्राभिषेक महापूजा - दिव्ययज्ञम्',
      seoFilename: createSeoFilename('mahamrityunjaya-jaap-rudrabhishek-puja'),
      imageDescription: 'Sacred Shiva Lingam with bilva leaves and holy hawan flames in ancient temple'
    }
  }

  // 6. Shani Dev / Saadesati / Dhaiya
  if (combined.includes('शनि') || combined.includes('साढ़ेसाती') || combined.includes('ढैय्या') || combined.includes('shani')) {
    return {
      primarySubject: 'Lord Shani Dev sacred black stone idol in serene meditative posture',
      secondarySubject: 'Brass diya with pure mustard oil flame, black sesame seeds, iron rings, blue aparajita flowers, sacred peepal tree leaves',
      deityOrEntity: 'Lord Shani Dev',
      ritualOrEvent: 'Shani dosh nivaran shanti yagya and mustard oil deep daan',
      environment: 'Sacred open-air stone temple courtyard under an ancient peepal tree',
      lighting: 'Solemn twilight hour with glowing warm orange mustard oil flame providing luminous focal contrast',
      cameraShot: variations.cameraShot,
      mood: 'Solemn, disciplined, justice-giving, protective, serene and deep',
      cinematicPrompt: `Cinematic editorial photograph of sacred Lord Shani Dev stone shrine under ancient holy peepal tree, glowing mustard oil brass diya, black sesame offerings, blue flowers, authentic Indian temple atmosphere at twilight, 16:9 landscape aspect ratio, 8k resolution, photorealistic, rich warm lighting, no text, no watermark, no logo`,
      altText: 'शनि साढ़ेसाती एवं ढैय्या शांति महापूजा - दिव्ययज्ञम्',
      seoFilename: createSeoFilename('shani-saadesati-dhaiya-dosh-shanti'),
      imageDescription: 'Lord Shani Dev shrine with mustard oil diya and peepal leaves at twilight'
    }
  }

  // 7. Pitra Dosh / Shradh / Tarpan / Amavasya
  if (combined.includes('पितृ') || combined.includes('तर्पण') || combined.includes('श्राद्ध') || combined.includes('अमावस्या') || combined.includes('नारायण बलि') || combined.includes('pitra') || combined.includes('tarpan')) {
    return {
      primarySubject: 'Devotee hands in reverent anjali posture offering holy water with black sesame and kusha grass',
      secondarySubject: 'Ganga river sacred water ripples, brass kalash, white fragrant flowers, sacred pinda offerings, morning river ghat',
      deityOrEntity: 'Pitra Devatas and Lord Vishnu',
      ritualOrEvent: 'Pitra tarpan, Shradh anushthan, and Narayan Bali puja',
      environment: 'Sacred Indian river ghat at dawn with ancient stone steps leading into holy water',
      lighting: 'Ethereal morning sunrise rays reflecting off the sacred river with soft golden fog',
      cameraShot: variations.cameraShot,
      mood: 'Deeply peaceful, grateful, purifying, ancestral blessing and serene closure',
      cinematicPrompt: `Cinematic editorial photograph of sacred Pitra Tarpan ritual on holy Indian river ghat at dawn, brass kalash offering water with kusha grass and sesame seeds, white flowers floating on sacred river, morning sunrays through soft mist, 16:9 landscape aspect ratio, 8k photorealistic, warm golden light, no text, no letters, no watermark, no logo`,
      altText: 'पितृ दोष शांति तर्पण एवं नारायण बलि अनुष्ठान - दिव्ययज्ञम्',
      seoFilename: createSeoFilename('pitra-dosh-shanti-tarpan-vidhi'),
      imageDescription: 'Pitra tarpan ritual on sacred river ghat at dawn with water offerings'
    }
  }

  // 8. Katyayani / Vivah / Marriage / Manglik
  if (combined.includes('विवाह') || combined.includes('कात्यायनी') || combined.includes('शादी') || combined.includes('मांगलिक') || combined.includes('katyayani') || combined.includes('vivah')) {
    return {
      primarySubject: 'Goddess Katyayani adorned with sacred red vermilion and fragrant flower garlands',
      secondarySubject: 'Traditional Indian vivah mandap decorated with yellow marigolds, turmeric, holy coconuts, auspicious sacred kalash, red silk',
      deityOrEntity: 'Maa Katyayani',
      ritualOrEvent: 'Katyayani vivah badha nivaran and manglik dosh shanti yagya',
      environment: 'Auspicious Vedic temple mandap decorated with fresh flowers and festive brass lamps',
      lighting: 'Warm celebratory golden light with sparkling divine reflections',
      cameraShot: variations.cameraShot,
      mood: 'Auspicious, joyful, blessed, romantic sanctity, filled with marital harmony',
      cinematicPrompt: `Cinematic editorial photograph of Goddess Katyayani sanctum and decorated Vedic wedding puja altar, auspicious turmeric, red kumkum, fresh marigold garlands, sacred brass kalash, glowing oil lamps, authentic Indian temple setting, 16:9 landscape, 8k resolution, photorealistic, warm golden divine lighting, no text, no watermark, no logo`,
      altText: 'मां कात्यायनी शीघ्र विवाह एवं मांगलिक दोष निवारण महायज्ञ',
      seoFilename: createSeoFilename('maa-katyayani-shighra-vivah-yagya'),
      imageDescription: 'Goddess Katyayani sanctum with auspicious Vedic wedding altar and marigold garlands'
    }
  }

  // 9. Durga / Navratri / Chandi
  if (combined.includes('दुर्गा') || combined.includes('नवरात्रि') || combined.includes('चंडी') || combined.includes('सप्तशती') || combined.includes('durga') || combined.includes('navratri')) {
    return {
      primarySubject: 'Goddess Durga in radiant warrior-mother form adorned with red silk and gold ornaments',
      secondarySubject: 'Sacred hawan kund with offerings, red hibiscus flowers, brass trishul, glowing earthen lamps, sacred kalash with coconut',
      deityOrEntity: 'Maa Durga',
      ritualOrEvent: 'Durga Saptashati Chandi path and Navratri mahapuja',
      environment: 'Majestic temple sanctum with red festive drapes and glowing oil lamps',
      lighting: 'Powerful divine golden-red radiant aura and flickering sacred hawan flames',
      cameraShot: variations.cameraShot,
      mood: 'Victorious, maternal protection, magnificent power, auspicious celebration',
      cinematicPrompt: `Cinematic editorial photograph of Goddess Durga sanctum during Navratri, glowing sacred hawan kund in foreground, red hibiscus flowers, brass puja thali, consecrated oil lamps, authentic Indian temple architecture, 16:9 landscape aspect ratio, 8k photorealistic, rich warm lighting, no text, no watermark, no logo`,
      altText: 'मां दुर्गा सप्तशती महायज्ञ एवं नवरात्रि पावन पूजा',
      seoFilename: createSeoFilename('maa-durga-saptashati-navratri-yagya'),
      imageDescription: 'Goddess Durga temple sanctum with sacred hawan kund and red hibiscus flowers'
    }
  }

  // 10. Default High-Converting Vedic Hawan & Yagya
  return {
    primarySubject: 'Consecrated Vedic Hawan Kund with pure cow ghee sacred holy flames',
    secondarySubject: 'Vedic pandits in saffron dhotis chanting mantras, brass puja vessels, holy coconut, fresh mango leaves, sacred chandan',
    deityOrEntity: 'Agni Dev and Vedic Deities',
    ritualOrEvent: 'Authentic Vedic Mahayagya and consecrated anushthan',
    environment: variations.environment,
    lighting: variations.lighting,
    cameraShot: variations.cameraShot,
    mood: 'Deeply reverent, purifying, divine golden radiance, spiritually uplifting',
    cinematicPrompt: `Cinematic editorial photograph of authentic Vedic hawan ceremony, glowing sacred fire flames rising from consecrated hawan kund, brass puja vessels, fresh flowers, fragrant incense smoke, traditional Indian stone temple courtyard, 16:9 landscape aspect ratio, 8k photorealistic, warm golden divine lighting, no text, no letters, no watermark, no logo, no cartoon`,
    altText: 'सनातन वैदिक पूजा एवं पावन हवन अनुष्ठान - दिव्ययज्ञम्',
    seoFilename: createSeoFilename('sanatan-vedic-puja-hawan-anushthan'),
    imageDescription: 'Authentic Vedic hawan with sacred fire and brass puja vessels in stone temple'
  }
}

/**
 * Intelligent Content-Aware Entity & Visual Concept Extractor using Gemini LLM
 */
export async function extractBlogVisualConcept({
  title,
  categoryName = 'Vedic Pujas & Anushthan',
  contentMarkdown,
  tags = []
}: {
  title: string
  categoryName?: string
  contentMarkdown: string
  tags?: string[]
}): Promise<BlogVisualConcept> {
  const fallback = extractFallbackVisualConcept(title, contentMarkdown, categoryName)

  try {
    const llm = await getLLM()
    const contentExcerpt = contentMarkdown.slice(0, 3500) // First 3500 chars contains all key deities, rituals and context

    const systemPrompt = `You are the Chief Art Director & Vedic Iconography Specialist for DivyaYagyam.com.
Analyze the provided blog title, category, and article text to design an authentic, specific, content-relevant visual concept for a 16:9 landscape blog cover image.

STRICT VISUAL RULES:
1. IDENTIFY THE EXACT SUBJECT:
   - If the article discusses "नाग पंचमी और कालसर्प दोष", the subject MUST be Nag Devta + Shiva Lingam.
   - If "विजयादशमी / राम", Lord Rama + Dussehra celebration.
   - If "मां बगलामुखी", Goddess Baglamukhi + yellow hawan kund.
   - If "कर्ज मुक्ति / लक्ष्मी", Goddess Lakshmi / devotee in sincere prayer with prosperity symbolism.
   - If about a specific deity, festival, vrat, or dosha, the primary visual MUST center on that EXACT subject.
2. NEVER introduce an unrelated deity or random modern objects.
3. DIVYAYAGYAM EDITORIAL STYLE:
   - Photorealistic / cinematic editorial photography
   - Premium Indian devotional aesthetic
   - Rich, natural warm golden lighting, soft volumetric god-rays
   - Authentic traditional Indian temple / river ghat / yagya shala setting
   - Sharp clean focal composition suitable for 16:9 thumbnail/hero banner
4. STRICT NEGATIVES:
   - Absolutely NO text, NO typography, NO watermark, NO logo inside the image
   - NO cartoons, NO 3D CGI renders, NO distorted anatomy, NO modern western items
5. DYNAMIC VARIATION:
   - Vary the cameraShot (medium wide, atmospheric 3/4 view, eye-level focus, low-angle)
   - Vary environment and lighting to match the mood of the specific topic

Respond ONLY with valid JSON with this exact structure:
{
  "primarySubject": "Detailed main entity/deity/subject strictly from the article",
  "secondarySubject": "Supporting ritual elements, offerings, flowers, lamps, implements",
  "deityOrEntity": "Name of the main deity or entity",
  "ritualOrEvent": "Name of the specific ritual or festival",
  "environment": "Authentic Indian temple or sacred setting",
  "lighting": "Atmospheric lighting (e.g. Brahma Muhurta sunrise, golden hour, twilight lamps)",
  "cameraShot": "Camera angle and framing (e.g. cinematic eye-level medium shot)",
  "mood": "Emotional and spiritual atmosphere",
  "cinematicPrompt": "Complete 60-80 word English prompt for photorealistic image generator following all rules above, ending with: '16:9 landscape aspect ratio, 8k resolution, award-winning devotional photography, no text, no watermark, no logo'",
  "altText": "Meaningful Hindi SEO alt text under 80 chars",
  "seoFilename": "clean-english-slug-name.webp",
  "imageDescription": "Short 1-2 sentence English description of the scene"
}`

    const userPrompt = `Blog Title: ${title}
Category: ${categoryName}
Tags: ${tags.join(', ')}
Article Content Excerpt:
${contentExcerpt}`

    const completion = await llm.chat.completions.create({
      model: 'gemini-3.5-flash-lite',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1024,
      temperature: 0.6
    })

    const raw = completion.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(raw)

    if (parsed.cinematicPrompt && parsed.primarySubject) {
      return {
        primarySubject: parsed.primarySubject,
        secondarySubject: parsed.secondarySubject || fallback.secondarySubject,
        deityOrEntity: parsed.deityOrEntity || fallback.deityOrEntity,
        ritualOrEvent: parsed.ritualOrEvent || fallback.ritualOrEvent,
        environment: parsed.environment || fallback.environment,
        lighting: parsed.lighting || fallback.lighting,
        cameraShot: parsed.cameraShot || fallback.cameraShot,
        mood: parsed.mood || fallback.mood,
        cinematicPrompt: parsed.cinematicPrompt,
        altText: parsed.altText || fallback.altText,
        seoFilename: createSeoFilename(parsed.seoFilename || fallback.seoFilename),
        imageDescription: parsed.imageDescription || fallback.imageDescription
      }
    }
  } catch (err: any) {
    console.warn('[BlogImageGen] AI visual concept extraction fallback:', err?.message || err)
  }

  return fallback
}

/**
 * Find safe curated fallback image if generation encounters a network error
 */
function getCuratedFallback(visualConcept: BlogVisualConcept, categoryName = ''): { image: string; altText: string } {
  const combined = `${visualConcept.deityOrEntity} ${visualConcept.primarySubject} ${categoryName}`.toLowerCase()

  if (combined.includes('lakshmi') || combined.includes('wealth') || combined.includes('karz')) {
    return CURATED_SACRED_FALLBACKS.lakshmi
  }
  if (combined.includes('shiva') || combined.includes('rudra') || combined.includes('mahamrityunjaya')) {
    return CURATED_SACRED_FALLBACKS.shiva
  }
  if (combined.includes('bagalamukhi') || combined.includes('peetambara')) {
    return CURATED_SACRED_FALLBACKS.bagalamukhi
  }
  if (combined.includes('durga') || combined.includes('chandi') || combined.includes('navratri')) {
    return CURATED_SACRED_FALLBACKS.durga
  }
  if (combined.includes('nag') || combined.includes('kalsarp') || combined.includes('serpent')) {
    return CURATED_SACRED_FALLBACKS.kalsarp
  }
  if (combined.includes('shani') || combined.includes('saadesati')) {
    return CURATED_SACRED_FALLBACKS.shani
  }
  if (combined.includes('pitra') || combined.includes('tarpan') || combined.includes('shradh')) {
    return CURATED_SACRED_FALLBACKS.pitra
  }
  if (combined.includes('vivah') || combined.includes('katyayani') || combined.includes('marriage')) {
    return CURATED_SACRED_FALLBACKS.vivah
  }
  if (combined.includes('navgrah') || combined.includes('planet')) {
    return CURATED_SACRED_FALLBACKS.navgrah
  }
  if (combined.includes('vastu') || combined.includes('home')) {
    return CURATED_SACRED_FALLBACKS.vastu
  }
  if (combined.includes('bhoomi') || combined.includes('property') || combined.includes('varahi')) {
    return CURATED_SACRED_FALLBACKS.bhoomi
  }
  return CURATED_SACRED_FALLBACKS.generic_yagya
}

/**
 * 🚀 Master Content-Aware Blog Image Generation Pipeline
 *
 * PIPELINE:
 * BLOG CONTENT
 * → Title + Category + पूरा Article Content
 * → Important entities/topics extract करो
 * → Main subject identify करो
 * → Article का visual concept तय करो
 * → Specific cinematic image prompt बनाओ
 * → Relevant image generate करो & Supabase CDN पर upload करो
 */
export async function generateContentAwareBlogImage({
  title,
  categoryName = 'Vedic Pujas & Anushthan',
  contentMarkdown,
  tags = [],
  slug,
}: {
  title: string
  categoryName?: string
  contentMarkdown: string
  tags?: string[]
  slug?: string
}): Promise<ContentAwareImageResult> {
  // Step 1: Extract Entities & Visual Concept from Content
  console.log(`[BlogImageGen] Analyzing article content for "${title.slice(0, 50)}..."`)
  const visualConcept = await extractBlogVisualConcept({
    title,
    categoryName,
    contentMarkdown,
    tags
  })

  console.log(`[BlogImageGen] Identified Subject: "${visualConcept.primarySubject}" | Deity: "${visualConcept.deityOrEntity}"`)

  // Step 2: Assemble Prompt & Generation Parameters
  const seed = Math.floor(Math.random() * 1000000)
  const cleanPrompt = encodeURIComponent(visualConcept.cinematicPrompt)
  const genUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1200&height=675&nologo=true&enhance=false&seed=${seed}`

  // Step 3: Fetch Image with Timeout & Safe Fallback
  try {
    console.log(`[BlogImageGen] Generating content-specific image...`)
    const res = await axios.get(genUrl, {
      responseType: 'arraybuffer',
      timeout: 25000 // 25s timeout for serverless resilience
    })

    if (res.status === 200 && res.data && res.data.length > 5000) {
      console.log(`[BlogImageGen] Image generated successfully (${res.data.length} bytes). Optimizing to WebP...`)

      // Step 4: Optimize with Sharp (1200x675 16:9 Landscape WebP under 100KB)
      const webpBuffer = await sharp(res.data)
        .resize({ width: 1200, height: 675, fit: 'cover' })
        .webp({ quality: 84, effort: 4 })
        .toBuffer()

      // Step 5: Upload to Supabase Storage with Meaningful SEO Filename
      const seoFileName = visualConcept.seoFilename || createSeoFilename(slug || title)
      const uploadResult = await uploadToSupabase(webpBuffer, seoFileName, 'image/webp')

      console.log(`[BlogImageGen] Uploaded to Supabase CDN: ${uploadResult.publicUrl}`)

      return {
        coverImage: uploadResult.publicUrl,
        coverImageAlt: visualConcept.altText,
        seoFilename: seoFileName,
        visualConcept,
        source: 'ai_generated'
      }
    }
  } catch (genError: any) {
    console.error(`[BlogImageGen] Image generation failed or timed out: ${genError?.message}. Applying safe curated fallback...`)
  }

  // Step 6: Safe Curated Fallback (Context-Aware Deity/Puja Image)
  const curated = getCuratedFallback(visualConcept, categoryName)
  return {
    coverImage: curated.image,
    coverImageAlt: visualConcept.altText || curated.altText,
    seoFilename: visualConcept.seoFilename,
    visualConcept,
    source: 'fallback_curated'
  }
}

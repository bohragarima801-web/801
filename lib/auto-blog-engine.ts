import { getLLM, getPreferredModel, MODELS } from '@/lib/ai'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'
import { getUpcomingRealFestivals } from '@/lib/real-festival-engine'

export interface AutoBlogOptions {
  forceTopic?: string
  status?: 'PUBLISHED' | 'DRAFT'
  authorId?: string
}

const AVAILABLE_PUJA_LINKS = `
DIVYAYAGYAM PUJA BOOKING DIRECTORY (Internal Contextual Links):
1. Maa Baglamukhi Mirchi Hawan & Kavach (बगलामुखी शत्रु बाधा एवं तंत्र बाधा निवारण): /pujas/maa-bagalamukhi-mirchi-hawan
2. Maa Ashta Lakshmi 16 Days Karz Mukti Mahayagya (अष्टलक्ष्मी कर्ज मुक्ति पूजा): /pujas/maa-ashta-lakshmi-karz-mukti-puja
3. Mahamrityunjaya Jaap & Rudrabhishekam (दिव्य प्राचीन स्थान पर महामृत्युंजय जाप एवं रुद्राभिषेक): /pujas/mahamrityunjaya-jaap-rudrabhishekam
4. Shani Saadesati Dhaiya Dosh Nivaran Yagya (शनि दोष शांति महापूजा): /pujas/shani-saadesati-dhaiya-dosh-nivaran-yagya
`

const DEFAULT_SACRED_COVER_IMAGES = [
  '/ashta_lakshmi_16days.webp',
  '/bagalamukhi_kavach_yagya.webp',
  '/mahamrityunjaya_hawan.webp',
  '/shani_dosh_yagya.webp',
  '/katyayani_yagya_hero.webp'
]

export async function generateAutoBlog(options: AutoBlogOptions = {}) {
  try {
    // 0. Enforce Strict Daily Limit (Max 2-3 blogs per day)
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const todayCount = await prisma.blog.count({
      where: {
        createdAt: {
          gte: startOfToday
        }
      }
    })

    const dbMaxLimit = parseInt(await getSetting('autoblog.max_daily_limit', '3'), 10) || 3

    if (!options.bypassLimit && todayCount >= dbMaxLimit) {
      return {
        ok: true,
        skipped: true,
        message: `आज का डेली ब्लॉग लिमिट पूरा हो चुका है (आज ${todayCount}/${dbMaxLimit} ब्लॉग बन चुके हैं)। नया ब्लॉग कल ऑटो-जनरेट होगा।`
      }
    }

    const llm = await getLLM()
    const aiModel = getPreferredModel(llm.apiKey)

    // 1. Fetch REAL published Pujas directly from database for 100% genuine internal links
    const realPujas = await prisma.puja.findMany({
      where: { status: 'PUBLISHED' },
      select: { name: true, slug: true },
      orderBy: { createdAt: 'desc' },
      take: 15
    })

    const realPujaDirectory = realPujas.length > 0
      ? realPujas.map((p, i) => `${i + 1}. ${p.name}: /pujas/${p.slug}`).join('\n')
      : `1. मां बगलामुखी मिर्ची हवन: /pujas/maa-bagalamukhi-mirchi-hawan\n2. अष्टलक्ष्मी कर्ज मुक्ति पूजा: /pujas/maa-ashta-lakshmi-karz-mukti-puja\n3. महामृत्युंजय जाप एवं रुद्राभिषेक: /pujas/mahamrityunjaya-jaap-rudrabhishekam\n4. शनि दोष शांति महापूजा: /pujas/shani-saadesati-dhaiya-dosh-nivaran-yagya`

    // 2. Fetch REAL UPCOMING FESTIVALS from Drik Panchang Master Engine for exact date accuracy
    const upcomingFestivals = getUpcomingRealFestivals(10)
    const upcomingFestivalsText = upcomingFestivals.map(f => `- ${f.festivalHi} (Date: ${f.date.slice(0, 10)}): ${f.significanceHi}`).join('\n')
    const todayFormatted = new Date().toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    const todayIsoStr = new Date().toISOString().slice(0, 10)

    // 3. Fetch recent existing blog titles to avoid duplicate topics
    const existingBlogs = await prisma.blog.findMany({
      select: { title: true, slug: true },
      orderBy: { createdAt: 'desc' },
      take: 30
    })

    const existingTitles = existingBlogs.map(b => b.title).join(', ')

    // 4. Determine target publish mode (default from database settings or options)
    const dbPublishMode = await getSetting('autoblog.publish_mode', 'PUBLISHED')
    const targetStatus = options.status || (dbPublishMode === 'DRAFT' ? 'DRAFT' : 'PUBLISHED')

    // 5. Construct System & User Prompt
    const systemPrompt = `You are "Acharya DivyaYagyam AI", an esteemed Senior Vedic Scholar, Puranic Historian, and Master Technical SEO Specialist for DivyaYagyam (divyayagyam.com).

YOUR CORE MISSION:
Research and compose a 100% human-like, deeply reverent, authoritative, 1500+ word Hindi blog post.

REAL CALENDAR CONTEXT:
TODAY'S ACTUAL REAL SYSTEM DATE IS: ${todayFormatted} (${todayIsoStr})

UPCOMING VERIFIED DRIK PANCHANG FESTIVALS FOR THE NEXT 30 DAYS:
${upcomingFestivalsText}

CRITICAL BOUNDARY & SANCTITY RULES:
1. NICHE BOUNDARY: Strictly stay within Sanatan Dharma, Vedic Pujas, Hawan, Shastra Remedies, Upcoming Festivals (आगामी पर्व/त्यौहार), Temple Traditions, Mantras, Astrology & Graha Dosh Remedies.
2. DYNAMIC TOPIC SELECTION (FESTIVALS + HOT SEARCHING SPIRITUAL KEYWORDS):
   - TOPIC OPTION A (Upcoming Festivals): Target upcoming festivals from the Drik Panchang list above happening on or after TODAY (${todayIsoStr}). STRICTLY FORBIDDEN to write about past/completed festivals (गए हुए त्यौहारों पर ब्लॉग कभी न बनाएं).
   - TOPIC OPTION B (High-Search Authentic Shastra & Astrology Keywords): Target high-search-volume, high-intent Sanatan & Shastra queries currently searched by millions of devotees on Google (e.g., "कर्ज मुक्ति कनकधारा स्तोत्र पाठ व अष्टलक्ष्मी साधना", "शनि ढैय्या एवं साढ़ेसाती के अचूक शास्त्रोक्त शांति उपाय", "कालसर्प दोष लक्षण एवं प्रामाणिक निवारण विधि", "पितृ दोष शांति हेतु तर्पण व नारायण बलि का पौराणिक महत्व", "मां बगलामुखी शत्रु बाधा एवं तंत्र निवारण हवन विधि", "महामृत्युंजय जाप के 10 सिद्ध लाभ व रुद्राभिषेक नियम", "घर की समृद्धि हेतु वास्तु दोष निवारण के अचूक उपाय").
3. 100% SHASTRA AUTHENTICITY (NO FAKE / SUPERSTITIOUS FLUFF): All mantras, stotrams, Puranic references (Shiva Purana, Shrimad Bhagavat, Garuda Purana, Jyotish Shastra), and ritual procedures MUST be 100% authentic and reverent. STRICTLY FORBIDDEN to write unauthentic, fake, superstitious, or baseless clickbait fluff.
4. NO HARDCODED SPECIFIC LOCATION NAMES: NEVER automatically add specific city or temple location names like "काशी", "हरिद्वार", "मथुरा", "उज्जैन", "त्र्यंबकेश्वर", "वृंदावन" anywhere in the blog title or body. ALWAYS use generic reverent terms like **"दिव्य प्राचीन स्थानों पर (Divya Prachin Sthano Pe)"**, **"पवित्र सिद्ध पीठों पर"**, or **"सिद्ध तीर्थ क्षेत्रों में"**.
5. HIGH-SEARCH MAIN & LONG-TAIL KEYWORDS: Target high-volume Main Focus Keywords combined with high-intent Long-Tail Keywords currently being searched by Indian devotees on Google.
6. ZERO ROBOTIC JARGON: NEVER use robotic phrases like "इस आधुनिक दौर में", "डिजिटल युग में", "संक्षेप में कहें तो", "निष्कर्षतः", "आज के समय में". Write in natural, warm, authoritative Hindi by a respected Acharya.
7. ABSOLUTE SPIRITUAL SANCTITY: Every word must be respectful, accurate to Shastras, uplifting, and divine.
8. REAL INTERNAL PUJA LINKING ONLY: Seamlessly integrate contextual links to our REAL live Pujas dynamically fetched from DB in the body and Call-To-Action sections:
${realPujaDirectory}

Format internal links in standard Markdown link format [Anchor Text](URL) using the EXACT slug from directory:
"👉 [**ऑनलाइन संकल्प लें — मां बगलामुखी मिर्ची हवन**](/pujas/maa-bagalamukhi-mirchi-hawan)"

9. AVOID DUPLICATES: Do NOT generate articles on these topics already published:
[${existingTitles}]

MUST RETURN VALID JSON ONLY with this structure:
{
  "seoTitle": "Under 60 chars Hindi SEO title with main & long-tail keyword",
  "metaDescription": "Under 155 chars meta description with high-intent keywords",
  "slug": "url-friendly-hindi-english-slug",
  "primaryKeyword": "main focus keyword",
  "h1": "Main Engaging H1 Title",
  "excerpt": "Short 2-3 line captivating summary for blog cards",
  "contentMarkdown": "Full 1500+ word detailed Markdown text with H2, H3 headings, bullet points, mantras, ritual steps, and internal Puja booking links",
  "imagePrompt": "Detailed prompt for 4K sacred temple visual, focusing on modest traditional Indian silk clothing, brass diya lamps, hawan kund, lotus flowers, divine ancient temple architecture, strictly zero nudity and fully clothed reverent atmosphere",
  "coverImageAlt": "SEO Alt text for cover image",
  "categoryName": "Vedic Pujas & Anushthan",
  "tags": ["व्रत कथा", "वैदिक पूजा", "ज्योतिष उपाय"],
  "faqs": [
    { "question": "प्रश्न 1", "answer": "उत्तर 1" }
  ]
}`

    const userPrompt = options.forceTopic
      ? `कृपया इस विशिष्ट विषय पर एक संपूर्ण 1500+ शब्दों का ब्लॉग तैयार करें: "${options.forceTopic}"`
      : `आज की तिथि (${todayIsoStr}) के ठीक आगे आने वाले निकटतम पौराणिक पर्व/त्यौहार (जैसे हरियाली तीज, नाग पंचमी, रक्षाबंधन) अथवा गूगल पर अत्यधिक सर्च किए जा रहे प्रामाणिक सनातन ज्योतिषीय/शास्त्रोक्त उपाय (जैसे कर्ज मुक्ति कनकधारा स्तोत्र, शनि ढैय्या शांति, कालसर्प दोष निवारण, महामृत्युंजय जाप लाभ) पर ट्रेंडिंग लॉन्ग-टेल एवं मेन कीवर्ड्स के साथ एक 100% प्रामाणिक, भव्य एवं 1500+ शब्दों का SEO-फ्रेंडली ब्लॉग लिखें। स्थान के लिए केवल 'दिव्य प्राचीन स्थानों पर' शब्द का ही प्रयोग करें।`

    // Helper function with retry for 503/500 transient errors
    const callAIWithRetry = async (client: any, model: string, maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await client.chat.completions.create({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 8192,
            temperature: 0.7,
            response_format: { type: 'json_object' }
          })
        } catch (retryErr: any) {
          if ((retryErr?.status === 503 || retryErr?.status === 500) && attempt < maxRetries) {
            console.warn(`AI Server ${retryErr.status} transient error (attempt ${attempt}/${maxRetries}), retrying in 2 seconds...`)
            await new Promise(res => setTimeout(res, 2000))
            continue
          }
          throw retryErr
        }
      }
    }

    // 4. Call LLM (Gemini / OpenAI with auto-fallback)
    let completion: any
    try {
      completion = await callAIWithRetry(llm, aiModel)
    } catch (err: any) {
      if (
        err?.status === 429 ||
        err?.status === 401 ||
        err?.message?.toLowerCase().includes('invalid') ||
        err?.message?.toLowerCase().includes('credits') ||
        err?.message?.toLowerCase().includes('billing')
      ) {
        console.warn('AI Provider error (401/429). Automatically falling back to Gemini Key...')
        const fallbackLlm = await getLLM({ preferGemini: true })
        completion = await callAIWithRetry(fallbackLlm, 'gemini-flash-latest')
      } else {
        throw err
      }
    }

    const rawResponse = completion.choices[0]?.message?.content || '{}'
    const firstBrace = rawResponse.indexOf('{')
    const lastBrace = rawResponse.lastIndexOf('}')
    let jsonCandidate = (firstBrace !== -1 && lastBrace > firstBrace)
      ? rawResponse.substring(firstBrace, lastBrace + 1)
      : rawResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()

    let blogData: any
    try {
      blogData = JSON.parse(jsonCandidate)
    } catch (parseErr) {
      // Auto-repair truncated JSON by attempting to close open quotes/brackets
      try {
        let repairedStr = jsonCandidate
        if (!repairedStr.endsWith('}')) {
          if ((repairedStr.match(/"/g) || []).length % 2 !== 0) repairedStr += '"'
          repairedStr += '\n}'
        }
        blogData = JSON.parse(repairedStr)
      } catch {
        console.error('Raw LLM Response parsing error:', rawResponse.slice(0, 300))
        throw new Error('Failed to parse AI blog JSON output')
      }
    }

    if (!blogData.title && !blogData.h1) {
      throw new Error('AI returned incomplete blog content')
    }

    const title = blogData.h1 || blogData.seoTitle
    const baseSlug = (blogData.slug || title.toLowerCase()).replace(/[^a-zA-Z0-9\u0900-\u097F]+/g, '-').replace(/^-+|-+$/g, '')
    const uniqueSlug = `${baseSlug}-${Date.now()}`.toLowerCase()

    // 5. Ensure Category Exists
    let category = await prisma.blogCategory.findFirst({
      where: { name: blogData.categoryName || 'Vedic Pujas & Anushthan' }
    })

    if (!category) {
      category = await prisma.blogCategory.create({
        data: {
          name: blogData.categoryName || 'Vedic Pujas & Anushthan',
          slug: (blogData.categoryName || 'Vedic Pujas').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
        }
      })
    }

    // 6. Generate a BRAND NEW Unique Sacred AI Image with fallback to Clean Saffron/Maroon Logo & Title Banner
    const seed = Math.floor(Math.random() * 1000000)
    let coverImage = ''

    try {
      const rawImagePrompt = blogData.imagePrompt || `Sacred Sanatan temple ritual for ${title}, warm golden lighting, authentic brass diya lamps, fresh lotus flowers and Vedic hawan kund`
      const sacredSafetyFilter = "modest traditional Indian silk clothing, fully clothed reverent devotees, sacred brass diya lamps, hawan fire, fresh lotus flowers, ancient temple architecture, warm golden divine aura, 8k resolution photorealistic 16:9 aspect ratio, zero nudity, zero inappropriate content, highly respectful Sanatan aesthetic"
      const cleanPrompt = encodeURIComponent(`Divine Sacred Temple Ritual: ${rawImagePrompt}, ${sacredSafetyFilter}`)
      coverImage = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1200&height=675&seed=${seed}&nologo=true&enhance=true`
    } catch {
      // Elegant Fallback: Clean Royal Saffron/Maroon background with DivyaYagyam Golden Lotus Emblem & Title Heading
      const bannerTitlePrompt = encodeURIComponent(`Simple elegant royal saffron and maroon background with golden DivyaYagyam lotus emblem logo and title header for ${title}, clean sacred banner, 16:9, no humans, zero nudity, ultra high quality`)
      coverImage = `https://image.pollinations.ai/prompt/${bannerTitlePrompt}?width=1200&height=675&seed=${seed}&nologo=true`
    }

    // Append FAQs to content Markdown if present
    let fullMarkdown = blogData.contentMarkdown || ''
    if (blogData.faqs && Array.isArray(blogData.faqs) && blogData.faqs.length > 0) {
      fullMarkdown += '\n\n---\n\n## ❓ अक्सर पूछे जाने वाले प्रश्न (Frequently Asked Questions)\n\n'
      blogData.faqs.forEach((faq: any, idx: number) => {
        fullMarkdown += `### Q${idx + 1}. ${faq.question}\n${faq.answer}\n\n`
      })
    }

    // 6. Save new Blog to Database
    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug: uniqueSlug,
        excerpt: blogData.excerpt || blogData.metaDescription,
        content: fullMarkdown,
        coverImage,
        coverImageAlt: blogData.coverImageAlt || title,
        status: targetStatus,
        seoTitle: blogData.seoTitle || title,
        seoDescription: blogData.metaDescription || blogData.excerpt,
        seoKeywords: Array.isArray(blogData.tags) ? blogData.tags.join(', ') : (blogData.primaryKeyword || 'सनातन पूजा'),
        categoryId: category.id,
        publishedAt: targetStatus === 'PUBLISHED' ? new Date() : null,
      }
    })

    // 7. On-Demand Next.js Cache Revalidation
    try {
      const { revalidateTag, revalidatePath } = await import('next/cache')
      revalidateTag('blogs')
      revalidateTag('blog')
      revalidatePath('/blogs')
      revalidatePath(`/blogs/${newBlog.slug}`)
      revalidatePath('/')
    } catch {
      // Revalidation error non-fatal
    }

    return { ok: true, data: newBlog }
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to generate auto blog' }
  }
}

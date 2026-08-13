import { getLLM, getPreferredModel, MODELS } from '@/lib/ai'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

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
    const llm = await getLLM()
    const aiModel = getPreferredModel(llm.apiKey)

    // 1. Fetch recent existing blog titles to avoid duplicate topics
    const existingBlogs = await prisma.blog.findMany({
      select: { title: true, slug: true },
      orderBy: { createdAt: 'desc' },
      take: 30
    })

    const existingTitles = existingBlogs.map(b => b.title).join(', ')

    // 2. Determine target publish mode (default from database settings or options)
    const dbPublishMode = await getSetting('autoblog.publish_mode', 'PUBLISHED')
    const targetStatus = options.status || (dbPublishMode === 'DRAFT' ? 'DRAFT' : 'PUBLISHED')

    // 3. Construct System & User Prompt
    const systemPrompt = `You are "Acharya DivyaYagyam AI", an esteemed Senior Vedic Scholar, Puranic Historian, and Master Technical SEO Specialist for DivyaYagyam (divyayagyam.com).

YOUR CORE MISSION:
Research and compose a 100% human-like, deeply reverent, authoritative, 1500+ word Hindi blog post.

CRITICAL BOUNDARY & SANCTITY RULES:
1. NICHE BOUNDARY: Strictly stay within Sanatan Dharma, Vedic Pujas, Hawan, Shastra Remedies, Upcoming Festivals (आगामी पर्व/त्यौहार), Temple Traditions, Mantras, Astrology & Graha Dosh Remedies.
2. NO HARDCODED SPECIFIC LOCATION NAMES: NEVER automatically add specific city or temple location names like "काशी", "हरिद्वार", "मथुरा", "उज्जैन", "त्र्यंबकेश्वर", "वृंदावन" anywhere in the blog title or body. ALWAYS use generic reverent terms like **"दिव्य प्राचीन स्थानों पर (Divya Prachin Sthano Pe)"**, **"पवित्र सिद्ध पीठों पर"**, or **"सिद्ध तीर्थ क्षेत्रों में"**.
3. UPCOMING FESTIVALS ONLY: Target ONLY upcoming/future festivals (निकटतम आने वाले पर्व एवं त्यौहार) based on current date. STRICTLY FORBIDDEN to write blogs on past or completed festivals (गए हुए/बीते हुए त्यौहारों पर ब्लॉग कभी न बनाएं).
4. HIGH-SEARCH MAIN & LONG-TAIL KEYWORDS: Perform real keyword strategy. Target high-volume Main Focus Keywords combined with high-intent Long-Tail Keywords currently being searched by Indian devotees on Google (e.g. "माघ गुप्त नवरात्रि घटस्थापना शुभ मुहूर्त", "कर्ज मुक्ति कनकधारा स्तोत्र पाठ विधि", "शनि ढैय्या शांति पूजा के अचूक उपाय").
5. ZERO ROBOTIC JARGON: NEVER use robotic phrases like "इस आधुनिक दौर में", "डिजिटल युग में", "संक्षेप में कहें तो", "निष्कर्षतः", "आज के समय में". Write in natural, warm, authoritative Hindi by a respected Acharya.
6. ABSOLUTE SPIRITUAL SANCTITY: Every word must be respectful, accurate to Shastras (Purana/Vedas), uplifting, and divine. Zero offensive, crude, or inaccurate claims.
7. INTERNAL PUJA LINKING: Seamlessly integrate contextual links to our Pujas in the body and Call-To-Action sections:
${AVAILABLE_PUJA_LINKS}

Format internal links in Markdown naturally:
"👉 **[पूजा सेवा का नाम]** का ऑनलाइन संकल्प लेने हेतु यहाँ क्लिक करें: [/pujas/slug]"

8. AVOID DUPLICATES: Do NOT generate articles on these topics already published:
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
  "imagePrompt": "Detailed Gemini image prompt for 4K sacred visual",
  "coverImageAlt": "SEO Alt text for cover image",
  "categoryName": "Vedic Pujas & Anushthan",
  "tags": ["व्रत कथा", "वैदिक पूजा", "ज्योतिष उपाय"],
  "faqs": [
    { "question": "प्रश्न 1", "answer": "उत्तर 1" }
  ]
}`

    const userPrompt = options.forceTopic
      ? `कृपया इस विशिष्ट विषय पर एक संपूर्ण 1500+ शब्दों का ब्लॉग तैयार करें: "${options.forceTopic}"`
      : `आज की तिथि से आगे आने वाले निकटतम पौराणिक पर्व/त्यौहार या मुख्य ग्रह दोष निवारण उपाय पर ट्रेंडिंग लॉन्ग-टेल एवं मेन कीवर्ड्स के साथ एक अत्यंत प्रामाणिक, भव्य एवं 1500+ शब्दों का SEO-फ्रेंडली ब्लॉग लिखें। स्थान के लिए केवल 'दिव्य प्राचीन स्थानों पर' शब्द का ही प्रयोग करें।`

    // 4. Call LLM (OpenAI gpt-4o-mini with fallback to Gemini if OpenAI credits are 0)
    let completion: any
    try {
      completion = await llm.chat.completions.create({
        model: aiModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    } catch (err: any) {
      if (err?.status === 429 || err?.message?.toLowerCase().includes('credits') || err?.message?.toLowerCase().includes('billing')) {
        console.warn('OpenAI Key has 0 credits / 429. Automatically falling back to Gemini Key...')
        const fallbackLlm = await getLLM({ preferGemini: true })
        completion = await fallbackLlm.chat.completions.create({
          model: 'gemini-flash-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' }
        })
      } else {
        throw err
      }
    }

    const rawResponse = completion.choices[0]?.message?.content || '{}'
    const firstBrace = rawResponse.indexOf('{')
    const lastBrace = rawResponse.lastIndexOf('}')
    const jsonCandidate = (firstBrace !== -1 && lastBrace > firstBrace)
      ? rawResponse.substring(firstBrace, lastBrace + 1)
      : rawResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()

    let blogData: any
    try {
      blogData = JSON.parse(jsonCandidate)
    } catch (parseErr) {
      console.error('Raw LLM Response parsing error:', rawResponse.slice(0, 300))
      throw new Error('Failed to parse AI blog JSON output')
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

    // 6. Generate a BRAND NEW Unique Sacred AI Image for this specific Blog Topic
    const seed = Math.floor(Math.random() * 1000000)
    const rawImagePrompt = blogData.imagePrompt || `Ultra realistic 8k resolution divine sacred Sanatan temple ritual for ${title}, warm golden lighting, authentic Vedic hawan and flowers`
    const cleanPrompt = encodeURIComponent(`Divine Sanatan Vedic Sacred Temple Ritual: ${rawImagePrompt}, 8k resolution, photorealistic, warm golden divine aura, 16:9 aspect ratio, high quality`)
    const coverImage = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1200&height=675&seed=${seed}&nologo=true&enhance=true`

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

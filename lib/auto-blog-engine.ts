import { getLLM, MODELS } from '@/lib/ai'
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
3. Kashi Vishwanath Mahamrityunjaya Jaap & Rudrabhishekam (महामृत्युंजय जाप एवं रुद्राभिषेक): /pujas/mahamrityunjaya-jaap-rudrabhishekam
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
1. NICHE BOUNDARY: Strictly stay within Sanatan Dharma, Vedic Pujas, Hawan, Shastra Remedies, Upcoming Festivals (निकटतम व्रत/पर्व/त्यौहार), Temple Traditions, Mantras, Astrology & Graha Dosh Remedies.
2. ZERO ROBOTIC JARGON: NEVER use robotic phrases like "इस आधुनिक दौर में", "डिजिटल युग में", "संक्षेप में कहें तो", "निष्कर्षतः", "आज के समय में". Write in natural, warm, authoritative Hindi by a respected Acharya.
3. ABSOLUTE SPIRITUAL SANCTITY: Every word must be respectful, accurate to Shastras (Purana/Vedas), uplifting, and divine. Zero offensive, crude, or inaccurate claims.
4. INTERNAL PUJA LINKING: Seamlessly integrate contextual links to our Pujas in the body and Call-To-Action sections:
${AVAILABLE_PUJA_LINKS}

Format internal links in Markdown naturally:
"👉 **[पूजा सेवा का नाम]** का ऑनलाइन संकल्प लेने हेतु यहाँ क्लिक करें: [/pujas/slug]"

5. AVOID DUPLICATES: Do NOT generate articles on these topics already published:
[${existingTitles}]

MUST RETURN VALID JSON ONLY with this structure:
{
  "seoTitle": "Under 60 chars Hindi SEO title",
  "metaDescription": "Under 155 chars meta description",
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
      : `आज की तिथि एवं निकटतम आने वाले पौराणिक पर्व/त्यौहार या मुख्य ग्रह दोष निवारण उपाय पर एक अत्यंत प्रामाणिक, भव्य एवं 1500+ शब्दों का SEO-फ्रेंडली ब्लॉग लिखें।`

    // 4. Call Gemini LLM
    const completion = await llm.chat.completions.create({
      model: MODELS.FLASH,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const rawResponse = completion.choices[0]?.message?.content || '{}'
    const cleanedJson = rawResponse.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()

    let blogData: any
    try {
      blogData = JSON.parse(cleanedJson)
    } catch {
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
          slug: (blogData.categoryName || 'Vedic Pujas').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
          description: 'वैदिक अनुष्ठान, व्रत-त्यौहार एवं सनातन धर्म ग्रन्थ मार्गदर्शिका'
        }
      })
    }

    // Pick cover image from default high-res assets
    const coverImage = DEFAULT_SACRED_COVER_IMAGES[Math.floor(Math.random() * DEFAULT_SACRED_COVER_IMAGES.length)]

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

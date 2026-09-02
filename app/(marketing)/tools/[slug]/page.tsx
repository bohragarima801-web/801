import { notFound, permanentRedirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  Lock,
  Sparkles,
  Wrench,
  ChevronRight,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Star,
  ArrowRight,
  Compass
} from 'lucide-react'
import { ToolMapper } from '@/components/tools/ToolMapper'
import { PaywallOverlay } from '@/components/tools/PaywallOverlay'
import { Metadata } from 'next'
import { BASE_URL, generatePageMeta } from '@/lib/seo'
import { slugify } from '@/lib/slugify'

export const revalidate = 3600 // ISR: Instant CDN responses for SEO crawlers

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim()

  const tool = await prisma.spiritualTool.findFirst({
    where: {
      OR: [{ slug: slug }, { slug: normalizedSlug }, { id: slug }]
    },
    select: { name: true, description: true, slug: true, isFree: true, price: true }
  })

  if (!tool) return generatePageMeta({ title: 'Vedic Tools | DivyaYagyam', description: 'Redirecting to authentic Vedic tools at DivyaYagyam.', path: `/tools`, noIndex: true })

  return generatePageMeta({
    title: `${tool.name} — Free Online Vedic Tool`,
    description: tool.description
      ? `${tool.description} 100% Authentic Vedic calculations & predictions online at DivyaYagyam.`
      : `Calculate and check ${tool.name} online with accurate Vedic astrology algorithms, instant predictions & dosha remedies at DivyaYagyam.`,
    path: `/tools/${tool.slug}`,
    keywords: [
      tool.name,
      `${tool.name} online`,
      `${tool.name} calculator`,
      'vedic astrology tools',
      'free kundli online',
      'kundli milan',
      'panchang online',
      'shubh muhurat',
      'divyayagyam astro tools',
      'jyotish tool online',
      'vedic horoscope'
    ]
  })
}

export default async function ToolViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const normalizedSlug = decodeURIComponent(slug).toLowerCase().trim()

  // 1. Try exact slug match
  let tool = await prisma.spiritualTool.findFirst({
    where: {
      OR: [{ slug: slug }, { slug: normalizedSlug }, { id: slug }]
    }
  })

  // 2. Fallback: case-insensitive search
  if (!tool) {
    tool = await prisma.spiritualTool.findFirst({
      where: {
        slug: { equals: normalizedSlug, mode: 'insensitive' }
      }
    })
  }

  // 3. Fallback: match by name slugified or transliterated
  if (!tool) {
    const allTools = await prisma.spiritualTool.findMany()
    tool =
      allTools.find(
        (t) =>
          t.slug.toLowerCase().trim() === normalizedSlug ||
          slugify(t.slug) === normalizedSlug ||
          slugify(t.name) === normalizedSlug
      ) || null
  }

  if (!tool) {
    permanentRedirect('/tools')
  }

  // Fetch other related tools for recommendations
  const relatedTools = await prisma.spiritualTool.findMany({
    where: {
      isActive: true,
      id: { not: tool.id }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

  let allowed = tool.isFree

  if (!allowed) {
    // Check if there is a valid free trial for this IP
    const trialLog = await prisma.toolUsageLog.findFirst({
      where: {
        toolId: tool.id,
        ipAddress: ip
      }
    })
    if (trialLog && tool.trialDays > 0) {
      const daysSinceTrial = Math.floor((Date.now() - new Date(trialLog.usedAt).getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceTrial < tool.trialDays) {
        allowed = true
      }
    }
  }

  if (!allowed) {
    try {
      const { getCurrentUser } = await import('@/lib/auth')
      const user = await getCurrentUser()
      if (user) {
        if (user.role === 'super_admin' || user.role === 'store_manager') {
          allowed = true
        } else {
          const userOrder = await prisma.order.findFirst({
            where: {
              userId: user.id,
              paymentStatus: 'SUCCESS',
              items: {
                some: {
                  OR: [{ name: { contains: tool.name } }, { productId: `tool-${tool.id}` }]
                }
              }
            }
          })
          if (userOrder) {
            allowed = true
          }
        }
      }
    } catch (err) {
      allowed = false
    }
  }

  // Generate JSON-LD Structured Data for Google Rich Snippets
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    url: `${BASE_URL}/tools/${tool.slug}`,
    description:
      tool.description || `Calculate and check ${tool.name} online with accurate Vedic astrology algorithms at DivyaYagyam.`,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'All',
    inLanguage: ['hi', 'en'],
    offers: {
      '@type': 'Offer',
      price: tool.isFree ? '0' : Number(tool.price).toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock'
    },
    provider: {
      '@type': 'Organization',
      name: 'DivyaYagyam',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1420',
      bestRating: '5',
      worstRating: '1'
    }
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Vedic Tools',
        item: `${BASE_URL}/tools`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `${BASE_URL}/tools/${tool.slug}`
      }
    ]
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `${tool.name} का उपयोग कैसे करें? (How to use ${tool.name}?)`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `इस टूल का उपयोग करने के लिए ऊपर दिए गए फॉर्म में आवश्यक जानकारी दर्ज करें और परिणाम प्राप्त करने के लिए बटन पर क्लिक करें। यह टूल तुरंत वैदिक गणना के अनुसार सटीक परिणाम प्रदान करता है।`
        }
      },
      {
        '@type': 'Question',
        name: `क्या DivyaYagyam का ${tool.name} सटीक और प्रामाणिक है?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `हाँ, यह टूल 27+ वर्षों के प्रामाणिक वैदिक ज्योतिषीय सिद्धांतों, काल-गणना और सटीक गृह-नक्षत्र स्थिति पर आधारित है।`
        }
      },
      {
        '@type': 'Question',
        name: `क्या ${tool.name} उपयोग करने के लिए मुफ्त है?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: tool.isFree
            ? `हाँ, ${tool.name} सभी उपयोगकर्ताओं के लिए पूरी तरह से मुफ्त है।`
            : `यह टूल ₹${Number(tool.price)} के न्यूनतम शुल्क पर उपलब्ध है जिसमें संपूर्ण विस्तृत विश्लेषण दिया जाता है।`
        }
      }
    ]
  }

  return (
    <div className="bg-[#FFFBF7] min-h-screen py-8 md:py-12">
      {/* ── JSON-LD Structured Data for Google Ranking */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* ── Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link href="/" className="hover:text-orange-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link href="/tools" className="hover:text-orange-600 transition-colors">
            Vedic Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate">{tool.name}</span>
        </nav>

        {/* ── Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#F3E8DE] shadow-xs">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-orange-50 border border-orange-200 text-[#FF7A00] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Vedic Astro Algorithm
              </span>
              {!tool.isFree && (
                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-600 text-amber-600" /> Premium Tool
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#111827] tracking-tight">
              {tool.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {tool.description || 'वैदिक ज्योतिष एवं खगोलीय गणनाओं पर आधारित सटीक एवं प्रामाणिक ऑनलाइन टूल।'}
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="shrink-0 rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Link href="/tools">Explore All Tools ➔</Link>
          </Button>
        </div>

        {/* ── Interactive Tool Container */}
        <section className="relative">
          <div
            className={
              !allowed ? 'max-h-[400px] overflow-hidden blur-[2px] opacity-60 pointer-events-none select-none relative' : ''
            }
          >
            <ToolMapper tool={tool} isPremiumUnlocked={allowed} />
          </div>

          {/* Paywall Overlay */}
          {!allowed && <PaywallOverlay tool={tool} />}
        </section>

        {/* ── HIGH-CONVERTING CRO PUJA UPSELL & REMEDY SECTION ── */}
        <section className="bg-gradient-to-b from-[#FFF3E8]/80 via-white to-[#FFF3E8]/50 rounded-3xl border-2 border-[#FFD2B0] p-5 sm:p-7 shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFE4D6] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#7A1521] text-white text-[11px] font-bold shadow-2xs">
                <span>🪔</span>
                <span>दोष निवारण एवं शास्त्रोक्त उपाय</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1C1614] tracking-tight">
                कुंडली दोष, साढ़ेसाती या जीवन बाधा निवारण हेतु पावन अनुष्ठान
              </h2>
              <p className="text-xs sm:text-sm text-[#6B5E57]">
                यदि आपकी गणना या कुंडली में कोई दोष (मांगलिक, कालसर्प, साढ़ेसाती, पितृ दोष) है, तो अपने नाम से सिद्ध पीठों में संकल्प करवाएं।
              </p>
            </div>

            <a
              href={`https://wa.me/919530401984?text=${encodeURIComponent(`प्रणाम पंडित जी, मैंने दिव्ययज्ञम् पर ${tool.name} देखा है। मुझे अपनी कुंडली के अनुसार उचित पूजा व दोष निवारण का मार्गदर्शन चाहिए।`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all shrink-0"
            >
              <span>💬 पंडित जी से मुफ्त सलाह</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "शनि साढ़ेसाती व नवग्रह शांति यज्ञ",
                desc: "शनि महादशा, ढैय्या एवं नवग्रह दोष शांति हेतु 9 समिधा वेदोक्त हवन।",
                price: "₹901",
                badge: "ग्रह दोष शांति",
                href: "/pujas/shani-saadesati-dhaiya-dosh-nivaran-yagya"
              },
              {
                title: "माँ बगलामुखी मिर्ची हवन व रक्षा कवच",
                desc: "शत्रु बाधा, कोर्ट-कचहरी, नजर दोष व व्यापारिक अवरोध मुक्ति हेतु महायज्ञ।",
                price: "₹1,100",
                badge: "महाविद्या अनुष्ठान",
                href: "/pujas/maa-bagalamukhi-mirchi-hawan"
              },
              {
                title: "महामृत्युंजय जाप एवं रुद्राभिषेक",
                desc: "स्वास्थ्य रक्षा, असाध्य रोग निवारण, दीर्घायु एवं मानसिक शांति हेतु शिव आराधना।",
                price: "₹2,100",
                badge: "स्वास्थ्य व दीर्घायु",
                href: "/pujas/mahamrityunjaya-jaap-rudrabhishekam"
              }
            ].map((remedy, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EFE4D6] p-4 flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md hover:border-[#FF6600] transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF3E8] text-[#FF6600] border border-[#FFD2B0]">
                      {remedy.badge}
                    </span>
                    <span className="text-xs font-extrabold text-[#1C1614]">
                      {remedy.price} <span className="text-[10px] font-normal text-[#6B5E57]">से शुरू</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1C1614] group-hover:text-[#FF6600] transition-colors line-clamp-1">
                    {remedy.title}
                  </h3>

                  <p className="text-[11px] text-[#6B5E57] line-clamp-2 leading-relaxed">
                    {remedy.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EFE4D6] flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold text-emerald-700">✓ लाइव वीडियो प्रमाण</span>
                  <Link
                    href={remedy.href}
                    className="px-3 py-1.5 rounded-lg bg-[#FF6600] hover:bg-[#E65C00] text-white text-[11px] font-bold shadow-2xs transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>संकल्प करें</span>
                    <span>➔</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#FAF8F5] rounded-xl p-3 border border-[#EFE4D6] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4A3E39]">
            <div className="flex items-center gap-2">
              <span className="text-base">📜</span>
              <span><strong>नाम-गोत्र संकल्प:</strong> सभी अनुष्ठान 27+ वर्षों के अनुभवी आचार्यों द्वारा विधि-विधान से संपन्न होते हैं।</span>
            </div>
            <Link href="/pujas" className="text-[#FF6600] font-bold hover:underline shrink-0">
              सभी 12+ वैदिक पूजाएं देखें ➔
            </Link>
          </div>
        </section>

        {/* ── Rich Crawlable Server-Side Content for Google SEO Indexing */}
        <section className="space-y-6 pt-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Features & Vedic Accuracy Card */}
            <article className="bg-white rounded-2xl border border-[#F3E8DE] p-6 space-y-4 shadow-xs">
              <h2 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                मुख्य विशेषताएं एवं प्रामाणिकता
              </h2>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>100% प्रामाणिक गणना:</strong> प्राचीन पराशर एवं वैदिक ज्योतिषीय नियमों पर आधारित।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>तुरंत एवं सटीक परिणाम:</strong> किसी भी अतिरिक्त देरी के बिना रीयल-टाइम में गणना।
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>गोपनीय एवं सुरक्षित:</strong> आपका डेटा पूरी तरह से सुरक्षित और निजी रहता है।
                  </span>
                </li>
              </ul>
            </article>

            {/* How to use Step-by-Step Card */}
            <article className="bg-white rounded-2xl border border-[#F3E8DE] p-6 space-y-4 shadow-xs">
              <h2 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600" />
                उपयोग करने का सरल तरीका (How to Use)
              </h2>
              <ol className="space-y-2.5 text-xs sm:text-sm text-slate-600 list-decimal list-inside">
                <li>ऊपर दिए गए टूल में अपना विवरण या इनपुट भरें।</li>
                <li>गणना या सर्च बटन पर क्लिक करें।</li>
                <li>अपनी विस्तृत वैदिक रिपोर्ट व सटीक गणना देखें।</li>
              </ol>
            </article>
          </div>

          {/* Frequently Asked Questions (FAQs) for Rich Google FAQ Schema */}
          <article className="bg-white rounded-2xl border border-[#F3E8DE] p-6 md:p-8 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="text-xl font-heading font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-orange-600" />
                अक्सर पूछे जाने वाले सवाल (FAQs)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {tool.name} से संबंधित महत्वपूर्ण प्रश्न व उनके सटीक उत्तर।
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  1. {tool.name} का उपयोग कैसे करें?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  इस टूल का उपयोग करने के लिए ऊपर दिए गए फॉर्म में आवश्यक जानकारी दर्ज करें और परिणाम प्राप्त करने के लिए बटन पर क्लिक करें। यह टूल तुरंत वैदिक गणना के अनुसार सटीक परिणाम प्रदान करता है।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  2. क्या DivyaYagyam का {tool.name} सटीक और प्रामाणिक है?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  हाँ, यह टूल 27+ वर्षों के प्रामाणिक वैदिक ज्योतिषीय सिद्धांतों, काल-गणना और सटीक गृह-नक्षत्र स्थिति पर आधारित है।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 space-y-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  3. क्या {tool.name} उपयोग करने के लिए मुफ्त है?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {tool.isFree
                    ? `हाँ, ${tool.name} सभी श्रद्धालुओं एवं उपयोगकर्ताओं के लिए पूरी तरह से मुफ्त है।`
                    : `यह टूल ₹${Number(tool.price)} के न्यूनतम शुल्क पर उपलब्ध है जिसमें संपूर्ण विस्तृत विश्लेषण दिया जाता है।`}
                </p>
              </div>
            </div>
          </article>

          {/* Related Tools Recommendation Section */}
          {relatedTools.length > 0 && (
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2">
                  <Compass className="h-5 w-5 text-orange-600" />
                  अन्य उपयोगी वैदिक टूल्स (Explore Related Tools)
                </h3>
                <Link href="/tools" className="text-xs font-bold text-orange-600 hover:text-orange-700">
                  View All Tools ➔
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {relatedTools.map((rt) => (
                  <Link
                    key={rt.id}
                    href={`/tools/${rt.slug}`}
                    className="p-4 bg-white rounded-2xl border border-[#F3E8DE] hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                          {rt.isFree ? 'FREE' : `₹${Number(rt.price)}`}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                        {rt.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{rt.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-xs font-bold text-orange-600">
                      <span>Open Tool</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </section>
      </div>
    </div>
  )
}

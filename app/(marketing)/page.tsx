import Script from 'next/script'
import Link from 'next/link'
import Image from 'next/image'
import { generatePageMeta } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles, Star, ArrowRight, MapPin, Calendar, ShieldCheck, Video, Truck, Lock,
  Phone, MessageCircle, CheckCircle2, Award, Heart, HelpCircle, Eye, ChevronRight
} from 'lucide-react'
import { MediaCarousel } from '@/components/ui/media-carousel'
import { HeroPujaSlider } from '@/components/hero-puja-slider'
import { SacredVideoGallery } from '@/components/sacred-video-gallery'
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube'
import { SacredAstroTools } from '@/components/sacred-astro-tools'
import { SacredTrustTestimonials } from '@/components/sacred-trust-testimonials'
import { SacredFaqAccordion } from '@/components/sacred-faq-accordion'
import { getDynamicSiteConfig } from '@/lib/settings'
import { SafeImage } from '@/components/ui/safe-image'
import {
  getCachedPujas,
  getCachedProducts,
  getCachedTestimonials,
  getCachedHeroSlides,
  getCachedHomePageMedia
} from '@/lib/cache'

export function generateMetadata() {
  return generatePageMeta({
    title: 'DivyaYagyam — भारत की सबसे भरोसेमंद ऑनलाइन पूजा बुकिंग सेवा',
    description: 'काशी विश्वनाथ, महाकालेश्वर, त्र्यंबकेश्वर आदि सिद्ध मंदिरों से ऑनलाइन पूजा बुक करें। नाम-गोत्र संकल्प, लाइव वीडियो व्हाट्सएप प्रूफ एवं घर पर पावन प्रसाद डिलीवरी।',
    path: '/',
    isAbsoluteTitle: true,
    keywords: ['online puja booking', 'ऑनलाइन पूजा', 'kashi vishwanath puja', 'mahakaleshwar puja online', 'vedic puja booking', 'divyayagyam'],
  })
}

function getMediaDisplaySrc(url: string | null | undefined): { isVideo: boolean; thumbUrl: string | null } {
  if (!url) return { isVideo: false, thumbUrl: null }
  const ytId = getYouTubeId(url)
  if (ytId) {
    return { isVideo: true, thumbUrl: getYouTubeThumbnail(url) }
  }
  const lower = url.toLowerCase()
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov') || lower.startsWith('data:video/')) {
    return { isVideo: true, thumbUrl: url }
  }
  return { isVideo: false, thumbUrl: url }
}

export const revalidate = 30

// Fallback Pujas if DB has few items
const fallbackPujas = [
  {
    id: 'fp-1',
    slug: 'maa-bagalamukhi-mirchi-hawan',
    name: 'माँ बगलामुखी मिर्ची हवन व विशेष शत्रुनिवारण अनुष्ठान',
    shortDescription: 'कोर्ट-कचहरी मुकदमों में विजय, शत्रु स्तंभन, तंत्र बाधा एवं व्यापारिक रुकावटों के सर्वनाश हेतु विशेष तीक्ष्ण मिर्ची महायज्ञ।',
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    price: 1100,
    badge: 'Most Booked',
    category: { name: 'महाविद्या अनुष्ठान' },
    isEvergreen: true,
    coverImage: '/bagalamukhi_mirchi_hawan_2.jpg'
  },
  {
    id: 'fp-2',
    slug: 'shani-saadesati-dhaiya-dosh-nivaran-yagya',
    name: 'शनि साढ़ेसाती, ढैय्या व शनि दोष निवारण महापूजा एवं शांति यज्ञ',
    shortDescription: 'शनि साढ़ेसाती, अष्टम ढैय्या, शनि महादशा, व्यापारिक घाटा व वात रोगों के शमन हेतु विशेष तैलभिषेक व शमी पत्र यज्ञ।',
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    price: 901,
    badge: 'Special',
    category: { name: 'नवग्रह शांति' },
    isEvergreen: true,
    coverImage: '/shani_dosh_yagya.jpg'
  },
  {
    id: 'fp-3',
    slug: 'navgrah-shanti-sarva-graha-dosh-nivaran-puja',
    name: 'नवग्रह शांति व सर्व ग्रह दोष निवारण महापूजा',
    shortDescription: 'सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु एवं केतु की अशुभ दशा व ग्रह पीड़ा के सर्वथा शमन हेतु 9 समिधा हवन।',
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    price: 901,
    badge: 'Vedic',
    category: { name: 'नवग्रह शांति' },
    isEvergreen: true,
    coverImage: '/navgrah_shanti_yagya.jpg'
  },
  {
    id: 'fp-4',
    slug: 'pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
    name: 'पितृ शांति विशेष एवं सर्व पितृ तर्पण महापूजा',
    shortDescription: 'पितृ दोष शांति, पूर्वजों की तृप्ति, वंश वृद्धि व पारिवारिक सुख-शांति हेतु कुशा जल, काले तिल व जौ द्वारा सर्व पितृ तर्पण, पिंड दान एवं ब्राह्मण भोजन संकल्प।',
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    price: 901,
    badge: 'Pitra Shanti',
    category: { name: 'पितृ दोष शांति' },
    isEvergreen: true,
    coverImage: '/pitra_shanti_tarpan.jpg'
  }
]

export default async function HomePage() {
  const siteData = await getDynamicSiteConfig()
  
  const [products, dbPujas, dbTestimonials, heroSlides, mediaData] = await Promise.all([
    getCachedProducts(),
    getCachedPujas(),
    getCachedTestimonials(),
    getCachedHeroSlides(),
    getCachedHomePageMedia()
  ])

  const { pastPujas, customerReviews, dbVideosRaw, dbGalleries } = mediaData

  // Filter all uploaded items that are videos or contain video links
  const allMediaVideos = dbVideosRaw.filter((m: any) => {
    if (!m.url) return false
    const url = m.url.toLowerCase()
    return m.type === 'VIDEO' || 
      url.includes('youtube.com') || 
      url.includes('youtu.be') || 
      url.includes('vimeo.com') || 
      url.endsWith('.mp4') || 
      url.endsWith('.webm') || 
      url.endsWith('.mov') ||
      ['Home Video', 'Live Darshan', 'Past Puja', 'Aarti & Bhajan', 'Customer Review', 'Video Gallery'].includes(m.folder || '')
  })

  const galleryVideos = dbGalleries.filter((g: any) => {
    if (!g.coverImage) return false
    const url = g.coverImage.toLowerCase()
    return g.type === 'VIDEO' || url.includes('youtube.com') || url.includes('youtu.be') || url.endsWith('.mp4')
  }).map((g: any) => ({
    id: g.id,
    url: g.coverImage,
    filename: g.title,
    folder: 'Live Darshan',
    type: 'VIDEO',
    createdAt: g.createdAt
  }))

  const dbVideos = [...allMediaVideos, ...galleryVideos].slice(0, 6)

  // Pujas to render: strictly normal DB pujas (non-VIP) created via Admin Panel
  const activeDbPujas = dbPujas.filter((p: any) => {
    if (p.isVip) return false
    if (p.isEvergreen) return true
    if (p.pujaDate) {
      const pDate = new Date(p.pujaDate)
      pDate.setHours(0, 0, 0, 0)
      return pDate.getTime() >= new Date().setHours(0,0,0,0)
    }
    return true
  })

  const displayPujas = activeDbPujas

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://divyayagyam.com/#organization",
        "name": "DivyaYagyam",
        "url": "https://divyayagyam.com",
        "logo": siteData.logo || "https://divyayagyam.com/logo.jpg",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": siteData.contact?.phone || "+91-95871-71984",
          "contactType": "customer service",
          "areaServed": "IN",
          "availableLanguage": ["en", "hi"]
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://divyayagyam.com/#website",
        "url": "https://divyayagyam.com",
        "name": "DivyaYagyam",
        "description": "India's Most Trusted Online Temple Puja & Vedic Sanatan Platform"
      }
    ]
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1E120A]">
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============================================================
          SECTION B: HERO SECTION — BRIGHT SANATANI LIGHT GOLD
          ============================================================ */}
      <section className="relative w-full bg-gradient-to-b from-[#FFF8EB] via-[#FFF3D6] to-[#FFFDF7] py-14 md:py-24 overflow-hidden border-b border-[#F5E2B8]">
        {/* Om watermark */}
        <div aria-hidden="true" className="absolute right-0 top-0 text-[30vw] font-serif text-[rgba(212,155,0,0.06)] leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        {/* Warm golden radial glows */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[rgba(242,169,0,0.12)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-32 w-[400px] h-[400px] bg-[rgba(139,26,33,0.08)] rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-5xl">
          {/* Label badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5D6] border border-[#F2C94C] shadow-xs mb-4">
            <Sparkles className="h-4 w-4 text-[#B37B00] fill-[#B37B00]" />
            <span className="text-[#8B5A00] text-xs font-extrabold uppercase tracking-[0.12em]">🪔 Sri Sanatan Seva & Anushthan</span>
          </div>

          {/* H1 Headline (Sri Mandir Style) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-[#2A1508] leading-[1.18] tracking-tight mb-4">
            Perform Puja as per Vedic Rituals at{' '}
            <span className="bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] bg-clip-text text-transparent">
              Famous Hindu Temples in India
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-[#4A2D1B] font-medium leading-relaxed max-w-3xl mx-auto mb-6">
            भारत के सुप्रसिद्ध शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे ऑनलाइन वैदिक पूजा। अपने नाम व गोत्र से संकल्प करवाएं — व्हाट्सएप पर लाइव वीडियो प्रमाण एवं घर द्वार सिद्ध प्रसाद।
          </p>

          {/* 4 trust features */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto mb-8">
            {[
              { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: 'अनुभवी वेदाचार्य' },
              { icon: <MapPin className="h-3.5 w-3.5" />, label: 'Pan-India Sacred Dham' },
              { icon: <Video className="h-3.5 w-3.5" />, label: 'WhatsApp Video Proof' },
              { icon: <CheckCircle2 className="h-3.5 w-3.5" />, label: '100% Transparent Seva' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 px-3.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-[#F0D695] shadow-xs">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#8B1A21] to-[#D49B00] text-white flex items-center justify-center shrink-0">{f.icon}</div>
                <span className="text-xs font-bold text-[#2A1508]">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Full Width Sri Mandir Auto-Sliding Banner Slider */}
          <div className="w-full max-w-6xl mx-auto">
            <HeroPujaSlider slides={heroSlides} />
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION C: UPCOMING PUJAS GRID
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="premium-badge">
              <Sparkles className="h-3.5 w-3.5" /> Upcoming Sacred Pujas
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-[#1E120A] dark:text-white tracking-tight">
              आगामी दिव्य पूजाएँ{' '}
              <span className="sacred-gradient-text font-normal">& Anushthans</span>
            </h2>
            <p className="text-sm md:text-base text-[#5A4030] dark:text-[rgba(245,235,220,0.55)] font-medium max-w-2xl">
              Choose from a curated list of authentic Veda-compliant pujas, homas, and temple offerings performed by experienced priests.
            </p>
          </div>

          <Link
            href="/pujas"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(139,26,33,0.25)] text-[#8B1A21] dark:text-[#E06070] hover:bg-[rgba(139,26,33,0.05)] font-bold text-sm transition-colors shrink-0"
          >
            View All Pujas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Responsive Grid of Puja Cards */}
        {displayPujas.length === 0 ? (
          <div className="text-center py-16 px-6 bg-gradient-to-b from-[rgba(139,26,33,0.04)] to-[rgba(168,124,40,0.03)] dark:from-[rgba(139,26,33,0.08)] dark:to-transparent rounded-3xl border border-[rgba(139,26,33,0.10)] dark:border-[rgba(139,26,33,0.20)] space-y-5 max-w-2xl mx-auto">
            <div className="h-16 w-16 mx-auto rounded-full bg-[rgba(139,26,33,0.08)] text-[#8B1A21] flex items-center justify-center text-3xl">🪔</div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#1E120A] dark:text-white">शीघ्र आ रही हैं दिव्य पूजाएँ एवं विशेष अनुष्ठान</h3>
            <p className="text-sm md:text-base text-[#5A4030] dark:text-[rgba(245,235,220,0.55)] max-w-lg mx-auto font-medium leading-relaxed">
              संस्थान के वेदाचार्य शीघ्र ही नए सिद्ध मंदिरों की विशेष पूजाएँ एवं महायज्ञ यहाँ उपलब्ध करा रहे हैं।
            </p>
            <a
              href="https://wa.me/919587171984?text=Namaste!%20I%20want%20to%20know%20more%20about%20upcoming%20pujas%20and%20rituals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              💬 WhatsApp par Puja Paraamarsh →
            </a>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayPujas.map((p: any, idx: number) => {
            const mediaInfo = getMediaDisplaySrc(p.coverImage)
            const isFallback = p.id.startsWith('fp-')
            const pujaHref = isFallback ? '/pujas' : `/pujas/${p.slug}`
            const categoryName = p.category?.name || 'Vedic Puja'
            const badgeTag = p.badge || (p.isEvergreen ? 'Evergreen' : 'Popular')

            return (
              <article key={p.id} className={`puja-card-premium reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}>

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[rgba(168,124,40,0.06)] rounded-t-[18px]">
                  {p.coverImage ? (
                    mediaInfo.isVideo && !getYouTubeId(p.coverImage) ? (
                      <video src={p.coverImage} className="h-full w-full object-cover" muted loop autoPlay playsInline />
                    ) : (
                      <SafeImage
                        src={mediaInfo.thumbUrl || p.coverImage}
                        alt={p.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                    )
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-[rgba(139,26,33,0.05)] text-[#8B1A21]">
                      <Sparkles className="h-10 w-10 opacity-30" />
                    </div>
                  )}
                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,4,2,0.65)] via-transparent to-transparent pointer-events-none" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-[10px] font-bold shadow-md">{badgeTag}</span>
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-[rgba(12,4,2,0.65)] backdrop-blur-sm text-[rgba(245,235,220,0.85)] text-[10px] font-semibold px-2.5 py-1 rounded-md border border-[rgba(255,255,255,0.10)]">{categoryName}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-[#1E120A] dark:text-[#F5EBDC] line-clamp-2 leading-snug">
                      <Link href={pujaHref}>{p.name}</Link>
                    </h3>
                    {p.location && (
                      <p className="text-xs text-[#8B7355] dark:text-[rgba(245,235,220,0.50)] flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-[#A87C28] shrink-0" />
                        {p.location}
                      </p>
                    )}
                    <p className="text-xs text-[#5A4030] dark:text-[rgba(245,235,220,0.55)] line-clamp-2 leading-relaxed">
                      {(p.shortDescription || p.description || 'Participate in this sacred ceremony for divine blessings.').replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>

                  {/* Price + CTA */}
                  <div className="pt-3 border-t border-[rgba(168,124,40,0.12)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8B7355] font-medium block">Booking Amount</span>
                      <span className="text-xl font-black text-[#8B1A21] dark:text-[#E06070]">
                        ₹{Number(p.price || 1100).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Link
                      href={pujaHref}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
                    >
                      Book Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

              </article>
            )
          })}
        </div>
        )}
      </section>

      {/* ============================================================
          SECTION D: DIVYA DARSHAN VIDEO GALLERY
          ============================================================ */}
      <section className="w-full bg-[#FFFBF5] dark:bg-[#0A0302] py-4 border-t border-[rgba(168,124,40,0.10)]">
        <SacredVideoGallery videos={dbVideos} />
      </section>

      {/* ============================================================
          SECTION E: JYOTISH & VEDIC TOOLS
          ============================================================ */}
      <section className="w-full bg-[#FFFBF5] dark:bg-[#0A0302] py-4">
        <SacredAstroTools />
      </section>

      {/* ============================================================
          SECTION F: TESTIMONIALS & TRUST SECTION
          ============================================================ */}
      <SacredTrustTestimonials testimonials={dbTestimonials} />

      {/* ============================================================
          SECTION G: FAQ SECTION
          ============================================================ */}
      <SacredFaqAccordion />

    </div>
  )
}

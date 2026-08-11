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

function getPujaBadgeInfo(p: any) {
  if (p.isVip) {
    return { text: '👑 VIP ANUSHTHAN', bg: 'bg-gradient-to-r from-[#3D0408] via-[#8B1A21] to-[#3D0408] text-[#FFD700] border border-[#F5B800]/60 shadow-lg' }
  }
  if (p.badge) {
    return { text: p.badge, bg: 'bg-gradient-to-r from-[#8B1A21] via-[#B84430] to-[#8B1A21] text-white shadow-md font-extrabold border border-[#FFD700]/30' }
  }
  return null
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
    title: g.title,
    url: g.coverImage,
    folder: 'Gallery Video'
  }))

  const dbVideos = [...allMediaVideos, ...galleryVideos]

  // Deduplicate Pujas & ensure fallback pujas show if db is sparse
  const displayPujas = dbPujas.length >= 3 ? dbPujas : [...dbPujas, ...fallbackPujas.filter(fp => !dbPujas.some((dp: any) => dp.slug === fp.slug))]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DivyaYagyam',
    url: 'https://divyayagyam.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://divyayagyam.com/pujas?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#111827] font-sans">
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============================================================
          SECTION B: HERO SECTION — KUNDLIAPI STYLE CLEAN & VIBRANT
          ============================================================ */}
      <section className="relative w-full bg-gradient-to-b from-[#FFFBF7] via-[#FFF8F2] to-[#FFFBF7] py-16 md:py-24 overflow-hidden border-b border-[#F3E8DE] text-[#111827]">
        {/* Om watermark subtle pulse */}
        <div aria-hidden="true" className="absolute right-0 top-0 text-[32vw] font-heading text-orange-500/5 leading-none pointer-events-none select-none overflow-hidden animate-om-pulse">ॐ</div>
        {/* Soft orange radial glows */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -right-32 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-5xl">
          {/* Category pill badge */}
          <div className="kundli-badge-orange mb-6 shadow-sm inline-flex">
            <Sparkles className="h-4 w-4 text-[#FF7A00] fill-[#FF7A00]" />
            <span className="font-bold tracking-wide uppercase text-xs">☸ SRI SANATAN SEVA & ANUSHTHAN</span>
          </div>

          {/* H1 Headline in Outfit / Plus Jakarta Sans */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-[#111827] leading-[1.15] tracking-tight mb-5">
            Perform Authentic Vedic Pujas at{' '}
            <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] bg-clip-text text-transparent">
              Sacred Temples in India
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg text-[#4B5563] font-medium leading-relaxed max-w-3xl mx-auto mb-8">
            भारत के सुप्रसिद्ध शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे ऑनलाइन वैदिक पूजा। अपने नाम व गोत्र से संकल्प करवाएं — व्हाट्सएप पर लाइव वीडियो प्रमाण एवं घर द्वार सिद्ध प्रसाद।
          </p>

          {/* 4 trust features — Modern crisp white cards */}
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-10">
            {[
              { icon: <ShieldCheck className="h-4 w-4 text-[#FF7A00]" />, label: 'अनुभवी वेदाचार्य' },
              { icon: <MapPin className="h-4 w-4 text-[#FF7A00]" />, label: 'Pan-India Sacred Dham' },
              { icon: <Video className="h-4 w-4 text-[#FF7A00]" />, label: 'WhatsApp Video Proof' },
              { icon: <CheckCircle2 className="h-4 w-4 text-[#FF7A00]" />, label: '100% Transparent Seva' },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-[#F3E8DE] shadow-sm">
                <div className="h-5 w-5 rounded-full bg-[#FFF3E0] text-[#FF7A00] flex items-center justify-center shrink-0">{f.icon}</div>
                <span className="text-xs font-semibold text-[#111827]">{f.label}</span>
              </div>
            ))}
          </div>

          {/* Full Width Auto-Sliding Banner Slider */}
          <div className="w-full max-w-6xl mx-auto">
            <HeroPujaSlider slides={heroSlides} />
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION C: UPCOMING PUJAS GRID — KUNDLIAPI WHITE CARDS
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#F3E8DE] pb-6">
          <div className="space-y-3">
            <div className="kundli-badge-orange inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-[#FF7A00]" /> Upcoming Sacred Pujas
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">
              आगामी दिव्य पूजाएँ{' '}
              <span className="text-[#FF7A00] font-bold">& Anushthans</span>
            </h2>
            <p className="text-sm md:text-base text-[#4B5563] font-medium max-w-2xl">
              Choose from a curated list of authentic Veda-compliant pujas, homas, and temple offerings performed by certified priests.
            </p>
          </div>

          <Link
            href="/pujas"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white text-xs md:text-sm font-bold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg hover:shadow-[#FF7A00]/25 transition-all shrink-0"
          >
            View All Pujas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Responsive Grid of Puja Cards */}
        {displayPujas.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-3xl border border-[#F3E8DE] space-y-5 max-w-2xl mx-auto shadow-sm">
            <div className="h-16 w-16 mx-auto rounded-full bg-[#FFF3E0] text-[#FF7A00] flex items-center justify-center text-3xl">🪔</div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-[#111827]">शीघ्र आ रही हैं दिव्य पूजाएँ एवं विशेष अनुष्ठान</h3>
            <p className="text-sm md:text-base text-[#4B5563] max-w-lg mx-auto font-medium leading-relaxed">
              संस्थान के वेदाचार्य शीघ्र ही नए सिद्ध मंदिरों की विशेष पूजाएँ एवं महायज्ञ यहाँ उपलब्ध करा रहे हैं।
            </p>
            <a
              href="https://wa.me/919530401984?text=Namaste!%20I%20want%20to%20know%20more%20about%20upcoming%20pujas%20and%20rituals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs py-3 px-6 rounded-full shadow-md"
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

            return (
              <Link key={p.id} href={pujaHref} className={`group relative bg-white rounded-2xl border border-[#F3E8DE] hover:border-[#FF7A00]/40 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl flex flex-col overflow-hidden cursor-pointer reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}>

                {/* Clean Light Image Frame with Object Cover */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#FFF8F2] dark:bg-neutral-900/40 rounded-t-2xl flex items-center justify-center">
                  {p.coverImage ? (
                    mediaInfo.isVideo && !getYouTubeId(p.coverImage) ? (
                      <video src={p.coverImage} className="h-full w-full object-cover" muted loop autoPlay playsInline />
                    ) : (
                      <SafeImage
                        src={mediaInfo.thumbUrl || p.coverImage}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-orange-50 text-[#FF7A00]">
                      <Sparkles className="h-10 w-10 opacity-40" />
                    </div>
                  )}

                  {/* Admin Configured Card Badge */}
                  {(() => {
                    const badgeInfo = getPujaBadgeInfo(p)
                    if (!badgeInfo) return null
                    return (
                      <div className="absolute top-3 left-3 z-20 flex gap-1.5 flex-wrap">
                        <span className="kundli-badge-orange shadow-sm">
                          {badgeInfo.text}
                        </span>
                      </div>
                    )
                  })()}

                  {/* Category */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <span className="bg-[#111827]/90 backdrop-blur-md text-white text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-sm">{categoryName}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-heading font-bold text-lg text-[#111827] group-hover:text-[#FF7A00] transition-colors line-clamp-2 leading-snug">
                      {p.name}
                    </h3>
                    {p.location && (
                      <p className="text-xs text-[#4B5563] flex items-center gap-1.5 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-[#FF7A00] shrink-0" />
                        {p.location}
                      </p>
                    )}
                    <p className="text-xs text-[#4B5563] line-clamp-2 leading-relaxed font-normal">
                      {(p.shortDescription || p.description || 'Participate in this sacred ceremony for divine blessings.').replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>

                  {/* Price + CTA */}
                  <div className="pt-3 border-t border-[#F3E8DE] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#4B5563] font-medium block">Booking Amount</span>
                      <span className="text-xl font-extrabold text-[#FF7A00]">
                        ₹{Number(p.price || 1100).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md group-hover:shadow-lg group-hover:shadow-[#FF7A00]/25 transition-all inline-flex items-center gap-1">
                      Book Now <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>

              </Link>
            )
          })}
        </div>
        )}
      </section>

      {/* ============================================================
          SECTION C2: ABHIMANTRIT PRODUCTS & STORE — KUNDLIAPI CARDS
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20 border-t border-[#F3E8DE]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#F3E8DE] pb-6">
          <div className="space-y-3">
            <div className="kundli-badge-orange inline-flex">
              <Sparkles className="h-3.5 w-3.5 text-[#FF7A00]" /> Abhimantrit Store & Samagri
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">
              अभिमंत्रित सामग्री{' '}
              <span className="text-[#FF7A00] font-bold">& Spiritual Products</span>
            </h2>
            <p className="text-sm md:text-base text-[#4B5563] font-medium max-w-2xl">
              100% अभिमंत्रित सिद्ध रुद्राक्ष, पावन भस्म, शंख, पूजा थाली व प्रामाणिक सामग्री — सीधे सिद्ध पीठों से आपके घर द्वार।
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white text-xs md:text-sm font-bold py-2.5 px-6 rounded-full shadow-md hover:shadow-lg hover:shadow-[#FF7A00]/25 transition-all shrink-0"
          >
            Explore Store <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-3xl border border-[#F3E8DE] space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="h-14 w-14 mx-auto rounded-full bg-[#FFF3E0] text-[#FF7A00] flex items-center justify-center text-2xl">🛍️</div>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-[#111827]">शीघ्र आ रही है अभिमंत्रित सामग्री</h3>
            <p className="text-xs md:text-sm text-[#4B5563]">संस्थान की वैदिक स्टोर सामग्री जल्द ही यहाँ उपलब्ध होगी।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p: any) => {
              const price = Number(p.price || 501)
              const imgSrc = p.coverImage || '/product_fallback.jpg'
              return (
                <Link key={p.id} href={`/products/${p.slug}`} className="group relative bg-white rounded-2xl border border-[#F3E8DE] hover:border-[#FF7A00]/40 transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl flex flex-col overflow-hidden cursor-pointer reveal">
                  <div className="relative aspect-square overflow-hidden bg-[#FFF8F2] dark:bg-neutral-900/40 flex items-center justify-center">
                    <SafeImage
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 kundli-badge-orange text-[9px] px-2 py-0.5 z-20 shadow-sm">
                      ⚡ अभिमंत्रित
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#FF7A00] tracking-wider block">
                        {p.category?.name || 'Vedic Product'}
                      </span>
                      <h3 className="font-heading font-bold text-base text-[#111827] group-hover:text-[#FF7A00] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-[#F3E8DE] flex items-center justify-between">
                      <span className="text-lg font-black text-[#FF7A00]">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white text-xs font-bold py-1.5 px-3.5 rounded-lg shadow-sm group-hover:shadow-md transition-all inline-flex items-center gap-1">
                        Buy Now &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* ============================================================
          SECTION: WHY CHOOSE US (KundliAPI Clean White Pillars)
          ============================================================ */}
      <section className="relative py-16 md:py-24 bg-white text-[#111827] overflow-hidden border-y border-[#F3E8DE]">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="kundli-badge-orange inline-flex">
              <ShieldCheck className="h-4 w-4 text-[#FF7A00]" /> Why Choose DivyaYagyam
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-[#111827] leading-tight">
              Why 50,000+ Devotees Trust{' '}
              <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] bg-clip-text text-transparent">
                DivyaYagyam
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#4B5563] font-medium max-w-2xl mx-auto leading-relaxed">
              शुद्ध सनातन परंपरा, 27+ वर्षों का आध्यात्मिक अनुभव, प्रत्यक्ष नाम-गोत्र संकल्प एवं दिव्य सामग्री प्रसाद — आपकी हर पूजा को बनाती है 100% सिद्ध व फलदायी।
            </p>
          </div>

          {/* 6 High-Converting Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: "🕉️",
                title: "27+ वर्षों की शुद्ध वैदिक परंपरा",
                subtitle: "Vedic Lineage & Pandits",
                desc: "27 से अधिक वर्षों के अनुभवी वरिष्ठ आचार्यों एवं उनकी योग्य विद्वान टीम द्वारा पूर्ण शास्त्रोक्त विधि से पूजन संपन्न किया जाता है।"
              },
              {
                icon: "📜",
                title: "व्यक्तिगत नाम व गोत्र संकल्प",
                subtitle: "100% Personalized Sankalp",
                desc: "पूजा आरंभ में मुख्य आचार्य द्वारा आपके तथा आपके परिवार के सदस्यों का स्पष्ट नाम व गोत्र बोलकर संकल्प कराया जाता है।"
              },
              {
                icon: "🎥",
                title: "HD लाइव वीडियो व व्हाट्सएप प्रमाण",
                subtitle: "Live WhatsApp Video Proof",
                desc: "पूजा संकल्प एवं मुख्य आहुति का स्पष्ट HD वीडियो व्हाट्सएप पर भेजा जाता है ताकि आप घर बैठे लाइव दर्शन कर सकें।"
              },
              {
                icon: "🎁",
                title: "दिव्य सामग्री व सिद्ध प्रसाद",
                subtitle: "Blessed Prasad Doorstep Courier",
                desc: "विशेष आशीर्वाद स्वरूप सिद्ध पीठों से पावन अक्षत, रक्षासूत्र, भस्म, रुद्राक्ष एवं दिव्य सामग्री आपके घर प्रसाद के रूप में भेजी जाती है।"
              },
              {
                icon: "🏛️",
                title: "भारत के प्रसिद्ध सिद्ध शक्तिपीठ",
                subtitle: "Authentic Sacred Dham",
                desc: "काशी विश्वनाथ, माँ बगलामुखी धाम दतिया, महाकालेश्वर, कामाख्या एवं सिद्ध मंदिरों से सीधे प्रामाणिक अनुष्ठान।"
              },
              {
                icon: "🤝",
                title: "100% पारदर्शी एवं विश्वस्त सेवा",
                subtitle: "100% Transparent Seva",
                desc: "कोई गुप्त शुल्क नहीं। 24/7 आचार्य मार्गदर्शन एवं सहायता उपलब्ध — सनातन धर्म की मर्यादा के साथ अटूट विश्वास।"
              }
            ].map((item) => (
              <div
                key={item.title}
                className="group relative p-6 sm:p-7 rounded-2xl bg-[#FFFBF7] border border-[#F3E8DE] hover:border-[#FF7A00]/40 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between reveal"
              >
                <div className="space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-[#FFF3E0] border border-[#FF7A00]/20 flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF7A00] block mb-1">
                      {item.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-[#111827] group-hover:text-[#FF7A00] transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#F3E8DE] flex items-center justify-between text-xs font-extrabold text-[#FF7A00]">
                  <span>100% Authentic Seva</span>
                  <span className="text-emerald-600 font-bold">⚡ Verified</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Trust Stat Bar */}
          <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-[#FFFBF7] border border-[#F3E8DE] grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-sm">
            {[
              { val: "50,000+", label: "संतुष्ट यजमान (Happy Devotees)" },
              { val: "27+ Years", label: "वैदिक अनुभव (Vedic Lineage)" },
              { val: "100%", label: "नाम-गोत्र संकल्प (Personalized)" },
              { val: "4.9 ★", label: "भक्त रेटिंग (User Rating)" }
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-[#FF7A00] tracking-tight">{stat.val}</div>
                <div className="text-xs font-bold text-[#111827] opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION D: DIVYA DARSHAN VIDEO GALLERY
          ============================================================ */}
      <section className="w-full bg-[#FFFBF7] py-8 border-t border-[#F3E8DE]">
        <SacredVideoGallery videos={dbVideos} />
      </section>

      {/* ============================================================
          SECTION E: JYOTISH & VEDIC TOOLS (3 ITEMS DISPLAYED)
          ============================================================ */}
      <section className="w-full bg-[#FFFBF7] py-8 border-t border-[#F3E8DE]">
        <SacredAstroTools limit={3} />
      </section>

      {/* ============================================================
          SECTION F: TESTIMONIALS & TRUST SECTION
          ============================================================ */}
      <section className="w-full bg-[#FFFBF7] border-t border-[#F3E8DE]">
        <SacredTrustTestimonials testimonials={dbTestimonials} />
      </section>

      {/* ============================================================
          SECTION G: FAQ SECTION
          ============================================================ */}
      <section className="w-full bg-[#FFFBF7] border-t border-[#F3E8DE] pb-16">
        <SacredFaqAccordion />
      </section>

    </div>
  )
}

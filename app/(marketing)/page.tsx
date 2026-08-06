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
    slug: 'kashi-vishwanath-rudrabhishekam',
    name: 'काशी विश्वनाथ महादेव रुद्राभिषेक (Kashi Vishwanath Rudrabhishekam)',
    shortDescription: 'भगवान शिव के पावन ज्योतिर्लिंग काशी में सुख-शांति, समृद्धि एवं आरोग्यता हेतु विशेष रुद्राभिषेक।',
    location: 'Kashi Vishwanath Temple, Varanasi',
    price: 1100,
    badge: 'Most booked',
    category: { name: 'ज्योतिर्लिंग पूजा' },
    isEvergreen: true,
    coverImage: 'https://images.unsplash.com/photo-1609345635867-03f565b9dfd1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fp-2',
    slug: 'mahakaleshwar-kalsarp-dosh-shanti',
    name: 'महाकालेश्वर कालसर्प दोष शांति पूजा (Mahakaleshwar Kalsarp Shanti)',
    shortDescription: 'उज्जैन महाकाल धाम में वैदिक विधि द्वारा कालसर्प एवं राहु-केतु दोष निवारण महापूजा।',
    location: 'Mahakaleshwar Temple, Ujjain',
    price: 2100,
    badge: 'Recommended',
    category: { name: 'दोष निवारण' },
    isEvergreen: true,
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fp-3',
    slug: 'trimbakeshwar-pitra-dosh-nivaran',
    name: 'त्र्यंबकेश्वर नारायण नागबली व पितृदोष (Pitra Dosh Nivaran Homa)',
    shortDescription: 'पितृ शांति एवं वंश वृद्धि हेतु नासिक त्र्यंबकेश्वर में सर्व दोष शांति यज्ञ एवं पूजा।',
    location: 'Trimbakeshwar Temple, Nashik',
    price: 2500,
    badge: 'Popular',
    category: { name: 'पितृ दोष शांति' },
    isEvergreen: true,
    coverImage: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fp-4',
    slug: 'maa-baglamukhi-shatru-badha-homa',
    name: 'माँ बगलामुखी शत्रु बाधा एवं तंत्र निवारण अनुष्ठान',
    shortDescription: 'कोर्ट-कचहरी मुकदमों में विजय, शत्रु शांति एवं व्यापार वृद्धि हेतु सिद्ध पीठ बगलामुखी महायज्ञ।',
    location: 'Baglamukhi Peeth, Datia / Nalkheda',
    price: 3100,
    badge: 'Special',
    category: { name: 'महाविद्या अनुष्ठान' },
    isEvergreen: true,
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fp-5',
    slug: 'maha-mrityunjaya-jaap-yagya',
    name: 'महामृत्युंजय मंत्र जाप एवं दीर्घायु होम',
    shortDescription: 'असाध्य रोगों से मुक्ति, दुर्घटना सुरक्षा एवं उत्तम स्वास्थ्य हेतु 1,25,000 मंत्र जाप अनुष्ठान।',
    location: 'Haridwar / Rishikesh Holy Ghats',
    price: 5100,
    badge: 'Recommended',
    category: { name: 'आरोग्य पूजा' },
    isEvergreen: true,
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'fp-6',
    slug: 'siddhivinayak-ganpati-puja',
    name: 'सिद्धिविनायक गणपति पूजन एवं मोदक अर्पण',
    shortDescription: 'कार्य सिद्धि, बुद्धि, नया व्यापार प्रारंभ एवं विघ्न विनाश हेतु प्रथम पूज्य श्री गणेश पूजा।',
    location: 'Siddhivinayak Temple, Mumbai',
    price: 1500,
    badge: 'New',
    category: { name: 'गणेश पूजा' },
    isEvergreen: true,
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'
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

  // Pujas to render: strictly DB pujas created via Admin Panel
  const activeDbPujas = dbPujas.filter((p: any) => {
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
    <div className="min-h-screen bg-[#FFFBF5] dark:bg-[#0A0302] text-[#1E120A] dark:text-[#F5EBDC]">
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============================================================
          SECTION B: HERO SECTION (ABOVE THE FOLD)
          ============================================================ */}
      <section className="relative w-full bg-gradient-to-b from-[#FFF7EB] via-amber-50/50 to-white dark:from-slate-900 dark:to-slate-950 py-12 md:py-20 overflow-hidden border-b border-amber-100/60 dark:border-slate-800">
        {/* Background Subtle Mandala / Glow Accent */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Side */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300/80 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 text-xs md:text-sm font-extrabold tracking-wide shadow-xs">
                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 fill-amber-400" />
                <span>Verified Temples & Puja Booking</span>
              </div>

              {/* Main Headline H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                India’s Most Trusted Temples.{' '}
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
                  One Sacred Booking Away.
                </span>
              </h1>

              {/* Subheading (1-2 lines) */}
              <p className="text-base sm:text-lg md:text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Book authentic Vedic pujas and temple offerings from verified priests across India, with transparent pricing, live WhatsApp video proof, and home-delivered sacred prasad.
              </p>

              {/* 4 Benefit Pills / Bullets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-2xl mx-auto lg:mx-0">
                <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-slate-800 shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Verified Priests</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-slate-800 shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Pan-India Temples</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-slate-800 shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Video className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">WhatsApp Video</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-200/80 dark:border-slate-800 shadow-xs">
                  <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">100% Transparent</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <Button size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-base" asChild>
                  <Link href="/pujas">
                    Book a Divine Puja (पूजा बुक करें) <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline" className="border-amber-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-amber-50/60 font-bold px-6 py-6 rounded-xl text-base shadow-xs" asChild>
                  <a href={`https://wa.me/${(siteData.contact?.whatsapp || '919587171984').replace(/[^0-9]/g, '')}?text=Namaste!%20I%20want%20to%20know%20more%20about%20DivyaYagyam%20Puja%20Services.`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5 text-emerald-600" /> Chat on WhatsApp
                  </a>
                </Button>
              </div>

              {/* Thin Trust Strip Metrics */}
              <div className="pt-6 border-t border-amber-200/60 dark:border-slate-800 grid grid-cols-3 gap-4 text-center lg:text-left max-w-xl">
                <div>
                  <p className="text-xl md:text-2xl font-black text-amber-700 dark:text-amber-400">10,000+</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Devotee Bookings</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-black text-amber-700 dark:text-amber-400">100+</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Verified Temples</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-black text-amber-700 dark:text-amber-400">24/7</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Devotee Assistance</p>
                </div>
              </div>

            </div>

            {/* Right Visual Card Side */}
            <div className="lg:col-span-5 w-full">
              {heroSlides.length > 0 ? (
                <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-amber-200/70 dark:border-slate-800 bg-white">
                  <HeroPujaSlider slides={heroSlides} />
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-orange-100/60 dark:from-slate-900 dark:to-slate-800 p-6 md:p-8 text-center space-y-6">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                    <Image 
                      src="https://images.unsplash.com/photo-1609345635867-03f565b9dfd1?auto=format&fit=crop&w=800&q=80" 
                      alt="Kashi Vishwanath Temple Puja" 
                      fill 
                      priority
                      className="object-cover hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4 text-left">
                      <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider">🌟 Featured Sacred Puja</span>
                      <h3 className="text-lg font-bold text-white leading-tight">Kashi Vishwanath Mahadev Rudrabhishekam</h3>
                      <p className="text-xs text-slate-200 mt-0.5">Live Video Sankalp & Temple Prasad</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-left bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200/80 shadow-xs">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Starting Price</p>
                      <p className="text-lg font-extrabold text-amber-700 dark:text-amber-400">₹1,100 <span className="text-xs font-normal text-slate-500">(All inclusive)</span></p>
                    </div>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg" asChild>
                      <Link href="/pujas">Book Now &rarr;</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

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

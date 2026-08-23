import Link from 'next/link'
import { generatePageMeta } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles, Star, ArrowRight, MapPin, Calendar, ShieldCheck, Video, Truck, Lock,
  Phone, MessageCircle, CheckCircle2, Award, Heart, HelpCircle, Eye, ChevronRight, BookOpen
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
import { PujaCard } from '@/components/puja-card'
import {
  getCachedPujas,
  getCachedProducts,
  getCachedTestimonials,
  getCachedHeroSlides,
  getCachedHomePageMedia,
  getCachedBlogs
} from '@/lib/cache'

export function generateMetadata() {
  return generatePageMeta({
    title: 'DivyaYagyam — भारत की सबसे भरोसेमंद ऑनलाइन पूजा बुकिंग सेवा',
    description: 'काशी विश्वनाथ, महाकालेश्वर, त्र्यंबकेश्वर आदि सिद्ध मंदिरों से ऑनलाइन पूजा बुक करें। नाम-गोत्र संकल्प, लाइव वीडियो व्हाट्सएप प्रूफ एवं घर पर पावन प्रसाद डिलीवरी।',
    path: '/',
    isAbsoluteTitle: true,
    keywords: [
      'online puja booking', 'ऑनलाइन पूजा बुकिंग', 'kashi vishwanath puja online',
      'mahakaleshwar puja online', 'vedic puja booking india', 'divyayagyam',
      'rudrabhishek online booking', 'kalsarp dosh nivaran puja', 'navgrah shanti puja',
      'pitra shanti puja online', 'bagalamukhi puja online', 'online havan booking',
      'temple puja booking', 'pandit booking online india', 'prasad home delivery',
      'online puja whatsapp video proof', 'naam gotra sankalp puja',
      'divyayagyam.com', 'ऑनलाइन हवन बुकिंग', 'पूजा ऑनलाइन भारत',
    ],
  })
}

function formatBlogDate(date: string | Date | null | undefined): string {
  if (!date) return ''
  try {
    const d = new Date(date)
    return d.toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

export const revalidate = 30

// Fallback Pujas if DB has few items
const fallbackPujas = [
  {
    id: 'fp-1',
    slug: 'maa-bagalamukhi-mirchi-hawan',
    name: 'माँ बगलामुखी मिर्ची हवन व विशेष विघ्न शांति अनुष्ठान',
    shortDescription: 'मानसिक शांति, कार्य सिद्धि, व्यापारिक प्रगति, पारिवारिक सुरक्षा व सकारात्मक ऊर्जा हेतु विशेष शास्त्रोक्त महायज्ञ।',
    location: 'माँ बगलामुखी धाम, दतिया',
    price: 1100,
    badge: 'सर्वाधिक लोकप्रिय',
    category: { name: 'महाविद्या अनुष्ठान' },
    isEvergreen: true,
    coverImage: '/bagalamukhi_mirchi_hawan_2.jpg'
  },
  {
    id: 'fp-2',
    slug: 'mahamrityunjaya-jaap-rudrabhishekam',
    name: 'काशी विश्वनाथ महामृत्युंजय सवा लाख मंत्र जाप एवं रुद्राभिषेक',
    shortDescription: 'स्वास्थ्य रक्षा, दीर्घायु, मानसिक शांति एवं शिव कृपा प्राप्ति हेतु काशी के विद्वान ब्राह्मणों द्वारा सवा लाख महामृत्युंजय जाप।',
    location: 'काशी विश्वनाथ, वाराणसी',
    price: 2100,
    badge: 'विशेष अनुष्ठान',
    category: { name: 'शिव अनुष्ठान' },
    isEvergreen: true,
    coverImage: '/mahamrityunjaya_hawan.webp'
  },
  {
    id: 'fp-3',
    slug: 'shani-saadesati-dhaiya-dosh-nivaran-yagya',
    name: 'शनि साढ़ेसाती, ढैय्या व शनि दोष निवारण महापूजा एवं शांति यज्ञ',
    shortDescription: 'शनि साढ़ेसाती, अष्टम ढैय्या, शनि महादशा में शांति, सुख-समृद्धि व अनुकूलता हेतु विशेष तैलभिषेक व शमी पत्र यज्ञ।',
    location: 'माँ कात्यायनी शक्तिपीठ, जोधपुर',
    price: 901,
    badge: 'नवग्रह शांति',
    category: { name: 'नवग्रह शांति' },
    isEvergreen: true,
    coverImage: '/shani_dosh_yagya.jpg'
  },
  {
    id: 'fp-4',
    slug: 'navgrah-shanti-sarva-graha-dosh-nivaran-puja',
    name: 'नवग्रह शांति व सर्व ग्रह दोष निवारण महापूजा',
    shortDescription: 'सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु एवं केतु की अनुकूलता व ग्रह शांति हेतु 9 समिधा वेदोक्त हवन।',
    location: 'माँ कात्यायनी शक्तिपीठ, जोधपुर',
    price: 901,
    badge: 'ग्रह शांति',
    category: { name: 'नवग्रह शांति' },
    isEvergreen: true,
    coverImage: '/navgrah_shanti_yagya.jpg'
  },
  {
    id: 'fp-5',
    slug: 'pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
    name: 'पितृ शांति विशेष एवं सर्व पितृ तर्पण महापूजा',
    shortDescription: 'पितृ दोष शांति, पूर्वजों का आशीर्वाद, वंश वृद्धि व पारिवारिक सुख-शांति हेतु कुशा जल, काले तिल व जौ द्वारा सर्व पितृ तर्पण एवं ब्राह्मण भोजन।',
    location: 'माँ कात्यायनी शक्तिपीठ, जोधपुर',
    price: 901,
    badge: 'पितृ दोष शांति',
    category: { name: 'पितृ शांति' },
    isEvergreen: true,
    coverImage: '/pitra_shanti_tarpan.jpg'
  }
]

export default async function HomePage() {
  const siteData = await getDynamicSiteConfig()
  
  const [products, dbPujas, dbTestimonials, heroSlides, mediaData, latestBlogs] = await Promise.all([
    getCachedProducts(),
    getCachedPujas(),
    getCachedTestimonials(),
    getCachedHeroSlides(),
    getCachedHomePageMedia(),
    getCachedBlogs(4)
  ])

  const { dbVideosRaw, dbGalleries } = mediaData

  // Filter video links
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

  const galleryMediaItems = dbGalleries.filter((g: any) => !!g.coverImage).map((g: any) => ({
    id: g.id,
    filename: g.title || 'पावन पूजा दर्शन',
    url: g.coverImage,
    folder: g.type === 'PHOTO' ? 'Past Puja' : 'Live Darshan',
    type: g.type === 'VIDEO' ? 'VIDEO' : 'IMAGE'
  }))

  const dbVideos = [...allMediaVideos, ...galleryMediaItems]

  // Exclude VIP pujas from standard homepage grid
  const nonVipDbPujas = dbPujas.filter((p: any) => !p.isVip)
  const displayPujas = nonVipDbPujas.length >= 3 ? nonVipDbPujas : [...nonVipDbPujas, ...fallbackPujas.filter(fp => !nonVipDbPujas.some((dp: any) => dp.slug === fp.slug))]

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1614] font-sans selection:bg-[#FF6600]/20 notranslate" translate="no">

      {/* ============================================================
          SECTION 1: CINEMATIC HERO (Two-Part Composition & Slider)
          ============================================================ */}
      <section className="relative w-full bg-gradient-to-b from-[#FAF8F5] via-[#FFF3E8]/40 to-[#FAF8F5] pt-6 pb-10 md:pt-12 md:pb-20 border-b border-[#EFE4D6]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center max-w-7xl mx-auto">
            
            {/* Left Content Area */}
            <div className="lg:col-span-6 space-y-4 md:space-y-5 text-left">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600] shadow-xs">
                <span className="text-[#D4AF37]">ॐ</span>
                <span>शास्त्रों के अनुसार वैदिक सेवा</span>
              </div>

              {/* High-Contrast Devanagari Main Heading */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#1C1614] leading-[1.3] notranslate" translate="no">
                पवित्र पूजा • प्रामाणिक विधि •{' '}
                <span className="text-[#FF6600]">
                  सच्चे परिणाम
                </span>
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-xs sm:text-base text-[#4A3E39] font-medium leading-[1.8] max-w-xl notranslate" translate="no">
                भारत के प्रमुख शक्तिपीठों एवं सिद्ध धामों में विद्वान पंडितों द्वारा आपके नाम और गोत्र से विधिपूर्वक पूजा, जाप, हवन एवं अनुष्ठान।
              </p>

              {/* 4 Trust Badges Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 max-w-lg">
                {[
                  { icon: <ShieldCheck className="h-4 w-4 text-[#FF6600]" />, label: '100% शास्त्रोक्त विधि' },
                  { icon: <Award className="h-4 w-4 text-[#FF6600]" />, label: 'अनुभवी विद्वान पंडित' },
                  { icon: <MapPin className="h-4 w-4 text-[#FF6600]" />, label: 'प्रमुख सिद्ध शक्तिपीठ' },
                  { icon: <CheckCircle2 className="h-4 w-4 text-[#FF6600]" />, label: '27+ वर्षों का विश्वास' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-white rounded-xl border border-[#EFE4D6] shadow-2xs">
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg bg-[#FFF3E8] flex items-center justify-center shrink-0">{f.icon}</div>
                    <span className="text-[11px] sm:text-xs font-bold text-[#1C1614] truncate">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Dual CTA Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3.5">
                <Link
                  href="/pujas"
                  className="px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-1.5 active:scale-[0.98] text-center cursor-pointer"
                >
                  <span>पूजा बुक करें</span>
                  <span className="text-sm">➔</span>
                </Link>
                <Link
                  href="/pujas"
                  className="px-4 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all duration-200 inline-flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <span>पूजा देखें</span>
                </Link>
              </div>
            </div>

            {/* Right Slider / Visual Presentation Area */}
            <div className="lg:col-span-6 w-full">
              <HeroPujaSlider slides={heroSlides} />
            </div>

          </div>

          {/* Floating 4-Column Trust Stats Card */}
          <div className="mt-10 md:mt-14 p-5 sm:p-7 rounded-2xl bg-white border border-[#EFE4D6] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center shadow-[0_8px_30px_rgba(80,50,20,0.06)] max-w-6xl mx-auto">
            {[
              { val: "27+ वर्ष", label: "पावन सेवा (1997 से)", sub: "Vedic Experience" },
              { val: "100%", label: "शास्त्रोक्त संकल्प", sub: "Name & Gotra Sankalp" },
              { val: "HD Video", label: "व्हाट्सएप लाइव प्रमाण", sub: "Live WhatsApp Proof" },
              { val: "100%", label: "सुरक्षित भुगतान", sub: "Razorpay Encrypted" }
            ].map((stat, i) => (
              <div key={i} className="space-y-0.5 border-r last:border-r-0 border-[#EFE4D6]/60 pr-2">
                <div className="text-xl sm:text-3xl font-black text-[#FF6600] tracking-tight">{stat.val}</div>
                <div className="text-xs sm:text-sm font-bold text-[#1C1614]">{stat.label}</div>
                <div className="text-[10px] text-[#6B5E57] hidden sm:block">{stat.sub}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 2: "पूजा कैसे होती है?" 4-STEP PROCESS FLOW
          ============================================================ */}
      <section className="w-full bg-[#FAF8F5] py-14 md:py-20 border-b border-[#EFE4D6]">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <span>🪔</span>
              <span>सरल एवं शास्त्रोक्त प्रक्रिया</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614]">
              पूजा कैसे होती है?
            </h2>
            <p className="text-sm text-[#6B5E57]">
              घर बैठे 4 सरल चरणों में अपनी पूजा संपन्न कराएं एवं लाइव संकल्प वीडियो प्राप्त करें।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: "🪔",
                title: "अपनी पूजा चुनें",
                desc: "काशी, उज्जैन, कामाख्या आदि सिद्ध पीठों में अपनी मनोकामना अनुसार पूजा चुनें।"
              },
              {
                step: "02",
                icon: "✍️",
                title: "जानकारी भरें",
                desc: "अपना व परिवार का नाम, गोत्र व विशेष संकल्प दर्ज करें।"
              },
              {
                step: "03",
                icon: "🔥",
                title: "पूजा सम्पन्न",
                desc: "विद्वान पंडितों द्वारा शास्त्रोक्त विधि से मंत्र जाप व हवन संपन्न होगा।"
              },
              {
                step: "04",
                icon: "📦",
                title: "प्रसाद एवं रिपोर्ट",
                desc: "व्हाट्सएप पर वीडियो संकल्प व घर पर अभिमंत्रित पावन प्रसाद प्राप्त करें।"
              }
            ].map((st) => (
              <div
                key={st.step}
                className="relative bg-white p-6 rounded-2xl border border-[#EFE4D6] hover:border-[#FF6600] transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-[#FFF3E8] border border-[#EFE4D6] flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                    {st.icon}
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/20">
                    {st.step}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-[#1C1614] group-hover:text-[#FF6600] transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[#6B5E57] leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2.5: MEET PANDIT MUKESH BOHRA (Authentic Ashram Face)
          ============================================================ */}
      <section className="w-full bg-gradient-to-b from-[#FAF8F5] via-[#FFF3E8]/50 to-[#FAF8F5] py-14 md:py-20 border-b border-[#EFE4D6]">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="bg-white rounded-3xl border border-[#EFE4D6] p-6 sm:p-10 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Pandit Ji Photo */}
            <div className="lg:col-span-5 flex flex-col items-center text-center space-y-4">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-4 border-[#D4AF37]/40 shadow-xl bg-[#FFF3E8]">
                <img
                  src="/pandit_mukesh_bohra.jpg"
                  alt="पं. मुकेश बोहरा - मुख्य वेदाचार्य"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                  <p className="font-bold text-sm">पं. मुकेश बोहरा</p>
                  <p className="text-[11px] text-[#D4AF37] font-semibold">1997 से वैदिक सेवा • 27+ वर्ष अनुभव</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3E8] text-xs font-bold text-[#7A1521] border border-[#EFE4D6]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>मुख्य पीठाधीश्वर (माँ कात्यायनी शक्ति पीठ)</span>
              </div>
            </div>

            {/* Content & Story */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
                <Award className="h-3.5 w-3.5 text-[#FF6600]" />
                <span>व्यक्तिगत सान्निध्य व प्रामाणिक परंपरा</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1614] leading-tight">
                "हमारा आश्रम छोटा है, लेकिन हर पूजा मैं स्वयं विधिपूर्वक करवाता हूँ"
              </h2>

              <p className="text-xs sm:text-sm text-[#4A3E39] leading-relaxed font-medium">
                बड़ी अनाम वेबसाइटों पर जहाँ यह पता नहीं होता कि आपकी पूजा कौन कर रहा है, दिव्ययज्ञम् में प्रत्येक पूजा व संकल्प <strong>पं. मुकेश बोहरा जी (27+ वर्ष अनुभवी वेदाचार्य)</strong> के सान्निध्य में संपन्न होता है। 
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  { icon: "🕉️", title: "1997 से काशी परंपरा", desc: "शास्त्रोक्त मंत्रोच्चार व वैदिक विधि" },
                  { icon: "📹", title: "लाइव वीडियो प्रमाण", desc: "संकल्प का वीडियो सीधे व्हाट्सएप पर" },
                  { icon: "📿", title: "प्रत्यक्ष नाम-गोत्र संकल्प", desc: "कोई अनाम या ऑटोमेटेड कर्म नहीं" },
                  { icon: "📦", title: "अभिमंत्रित पावन प्रसाद", desc: "सुरक्षित होम डिलीवरी" },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EFE4D6] flex items-start gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#1C1614]">{item.title}</h4>
                      <p className="text-[10px] text-[#6B5E57]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-wrap gap-3 items-center">
                <Link
                  href="/about"
                  className="px-5 py-2.5 rounded-xl bg-[#7A1521] hover:bg-[#580E17] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                >
                  <span>पं. मुकेश जी एवं आश्रम की कथा पढ़ें</span>
                  <span>➔</span>
                </Link>
                <a
                  href="https://wa.me/919530401984?text=Namaste%20Pandit%20ji,%20mujhe%20puja%20ke%20bare%20me%20jankari%20chahiye"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-2xs transition-all inline-flex items-center gap-1.5"
                >
                  <span>💬 सीधे पंडित जी से बात करें</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: "लोकप्रिय पूजा एवं अनुष्ठान" (POPULAR PUJAS GRID)
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-[#EFE4D6]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EFE4D6]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <Sparkles className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>दिव्य अनुष्ठान</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              लोकप्रिय पूजा एवं अनुष्ठान
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              काशी विश्वनाथ, माँ बगलामुखी, महाकालेश्वर आदि सिद्ध शक्तिपीठों से प्रामाणिक वैदिक पूजा।
            </p>
          </div>

          <Link
            href="/pujas"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] hover:text-[#FF6600] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all shrink-0"
          >
            <span>सभी पूजा देखें</span>
            <span>➔</span>
          </Link>
        </div>

        {/* Responsive Grid of Puja Cards */}
        {displayPujas.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border border-[#EFE4D6] space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="h-14 w-14 mx-auto rounded-full bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center text-3xl">🪔</div>
            <h3 className="text-xl font-bold text-[#1C1614]">शीघ्र आ रही हैं दिव्य पूजाएँ</h3>
            <p className="text-xs text-[#6B5E57]">संस्थान द्वारा नई पूजाएँ जल्द ही उपलब्ध कराई जा रही हैं।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {displayPujas.slice(0, 6).map((p: any, idx: number) => (
              <PujaCard key={p.id} puja={p} idx={idx} hidePrice={false} />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================
          SECTION 4: "अभिमंत्रित सामग्री" (SACRED PRODUCTS & STORE)
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-[#EFE4D6]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EFE4D6]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <span>⚡</span>
              <span>सिद्ध एवं प्राण प्रतिष्ठित</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              अभिमंत्रित सामग्री एवं पावन स्टोर
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              100% अभिमंत्रित सिद्ध रुद्राक्ष, पावन भस्म, शंख, पूजा थाली व प्रामाणिक सामग्री सीधे आपके घर।
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] hover:text-[#FF6600] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all shrink-0"
          >
            <span>Explore Store</span>
            <span>➔</span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-2xl border border-[#EFE4D6] space-y-3 max-w-xl mx-auto shadow-xs">
            <div className="h-12 w-12 mx-auto rounded-full bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center text-2xl">🛍️</div>
            <h3 className="text-lg font-bold text-[#1C1614]">शीघ्र आ रही है अभिमंत्रित सामग्री</h3>
            <p className="text-xs text-[#6B5E57]">संस्थान की वैदिक स्टोर सामग्री जल्द ही उपलब्ध होगी।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.slice(0, 4).map((p: any) => {
              const price = Number(p.price || 501)
              const imgSrc = p.coverImage || '/product_fallback.jpg'
              return (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group relative bg-white rounded-2xl border border-[#EFE4D6] hover:border-[#FF6600] transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-lg flex flex-col overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#FFF3E8]/40 flex items-center justify-center">
                    <SafeImage
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md bg-[#7A1521] text-white border border-[#D4AF37]">
                      ⚡ अभिमंत्रित
                    </span>
                  </div>

                  <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between gap-2 sm:gap-3">
                    <div className="space-y-0.5 sm:space-y-1">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block truncate">
                        {p.category?.name || 'Vedic Product'}
                      </span>
                      <h3 className="font-bold text-xs sm:text-base text-[#1C1614] group-hover:text-[#FF6600] transition-colors line-clamp-1">
                        {p.name}
                      </h3>
                    </div>

                    <div className="pt-2 sm:pt-3 border-t border-[#EFE4D6] flex items-center justify-between gap-1">
                      <span className="text-xs sm:text-base font-black text-[#1C1614]">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="bg-[#FF6600] hover:bg-[#E65C00] text-white text-[10px] sm:text-xs font-bold py-1 px-2 sm:py-1.5 sm:px-3 rounded-lg shadow-2xs transition-all inline-flex items-center gap-0.5 shrink-0">
                        खरीदें ➔
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
          SECTION 5: "हमें क्यों चुनें?" (WHY CHOOSE DIVYAYAGYAM)
          ============================================================ */}
      <section className="relative py-14 md:py-20 bg-[#FFF3E8]/60 text-[#1C1614] overflow-hidden border-b border-[#EFE4D6]">
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>सनातन मर्यादा व विश्वास</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614]">
              हमें क्यों चुनें?
            </h2>
            <p className="text-sm text-[#6B5E57]">
              शुद्ध सनातन परंपरा, 27+ वर्षों का आध्यात्मिक अनुभव, प्रत्यक्ष नाम-गोत्र संकल्प एवं दिव्य सामग्री प्रसाद।
            </p>
          </div>

          {/* 6 Value Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🕉️",
                title: "शास्त्रोक्त एवं प्रमाणिक",
                desc: "सभी पूजाएँ वेदोक्त विधि एवं सनातन शास्त्रों के नियमों के अनुसार पूर्ण शुद्धता से संपन्न की जाती हैं।"
              },
              {
                icon: "📜",
                title: "व्यक्तिगत नाम व गोत्र संकल्प",
                desc: "पूजा आरंभ में मुख्य आचार्य द्वारा आपके तथा आपके परिवार के सदस्यों का स्पष्ट नाम व गोत्र बोलकर संकल्प कराया जाता है।"
              },
              {
                icon: "🎥",
                title: "HD लाइव वीडियो व व्हाट्सएप प्रमाण",
                desc: "पूजा संकल्प एवं मुख्य आहुति का स्पष्ट वीडियो व्हाट्सएप पर भेजा जाता है ताकि आप घर बैठे दर्शन कर सकें।"
              },
              {
                icon: "🎁",
                title: "अभिमंत्रित पावन प्रसाद",
                desc: "विशेष आशीर्वाद स्वरूप सिद्ध पीठों से पावन अक्षत, रक्षासूत्र, भस्म एवं दिव्य प्रसाद आपके घर कोरियर से।"
              },
              {
                icon: "🏛️",
                title: "प्रमुख सिद्ध शक्तिपीठ",
                desc: "काशी विश्वनाथ, माँ बगलामुखी धाम, महाकालेश्वर, कामाख्या एवं सिद्ध मंदिरों से सीधे प्रामाणिक अनुष्ठान।"
              },
              {
                icon: "🤝",
                title: "100% पारदर्शी एवं सुरक्षित सेवा",
                desc: "कोई गुप्त शुल्क नहीं। 24/7 आचार्य मार्गदर्शन एवं सहायता उपलब्ध — सनातन धर्म की मर्यादा के साथ अटूट विश्वास।"
              }
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-[#EFE4D6] hover:border-[#FF6600] transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-12 w-12 rounded-xl bg-[#FFF3E8] border border-[#EFE4D6] flex items-center justify-center text-2xl shadow-2xs">
                    {item.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1C1614]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5E57] leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#EFE4D6] flex items-center justify-between text-xs font-bold text-[#FF6600]">
                  <span>100% प्रामाणिक सेवा</span>
                  <span className="text-[#7A1521] font-extrabold">✓ Verified</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 6: "श्रद्धालुओं के अनुभव" (TESTIMONIALS)
          ============================================================ */}
      <section className="w-full bg-[#FAF8F5] border-b border-[#EFE4D6]">
        <SacredTrustTestimonials testimonials={dbTestimonials} />
      </section>

      {/* ============================================================
          SECTION 7: "नवीनतम लेख" (LATEST BLOG ARTICLES)
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-[#EFE4D6]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EFE4D6]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <BookOpen className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>सनातन ज्ञान व पंचांग</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              नवीनतम लेख एवं आध्यात्मिक ज्ञान
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              पूजा विधि, व्रत त्योहार, ज्योतिष ज्ञान एवं वैदिक अनुष्ठानों का प्रामाणिक मार्गदर्शन।
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] hover:text-[#FF6600] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all shrink-0"
          >
            <span>सभी लेख देखें</span>
            <span>➔</span>
          </Link>
        </div>

        {latestBlogs.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-2xl border border-[#EFE4D6] space-y-3 max-w-xl mx-auto shadow-xs">
            <div className="h-12 w-12 mx-auto rounded-full bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center text-2xl">📚</div>
            <h3 className="text-lg font-bold text-[#1C1614]">शीघ्र आ रहे हैं आध्यात्मिक लेख</h3>
            <p className="text-xs text-[#6B5E57]">हमारे विद्वान आचार्य नए वैदिक लेख शीघ्र यहाँ प्रकाशित कर रहे हैं।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestBlogs.slice(0, 4).map((b: any) => {
              const formattedDate = formatBlogDate(b.publishedAt || b.createdAt)
              return (
                <Link
                  key={b.id}
                  href={`/blog/${b.slug}`}
                  className="group bg-white rounded-2xl border border-[#EFE4D6] hover:border-[#FF6600] transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-lg flex flex-col overflow-hidden cursor-pointer"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                    <SafeImage
                      src={b.coverImage || '/blog-placeholder.webp'}
                      alt={b.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {b.category?.name && (
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded bg-[#1C1614]/85 text-[#FAF8F5] border border-white/10 backdrop-blur-xs">
                        {b.category.name}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      {formattedDate && (
                        <div className="text-[11px] text-[#6B5E57] font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-[#D4AF37]" />
                          <span>{formattedDate}</span>
                        </div>
                      )}
                      <h3 className="font-bold text-sm sm:text-base text-[#1C1614] group-hover:text-[#FF6600] transition-colors line-clamp-2 leading-snug">
                        {b.title}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[#EFE4D6] text-xs font-bold text-[#FF6600] flex items-center gap-1">
                      <span>पढ़ें</span>
                      <span>➔</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* ============================================================
          SECTION 8: FINAL HIGH-CONVERTING BOOKING CTA BANNER
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1C1614] via-[#3D302B] to-[#1C1614] text-white p-8 md:p-14 overflow-hidden border border-[#D4AF37]/40 shadow-2xl text-center max-w-5xl mx-auto">
          {/* Subtle gold decorative glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FF6600]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E1917] border border-[#D4AF37]/50 text-xs font-bold text-[#FAF8F5]">
              <span className="text-[#D4AF37]">🪔</span>
              <span>शुभ संकल्प व मंगल कामना</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug">
              आज ही अपनी पूजा बुक करें
            </h2>

            <p className="text-xs sm:text-sm text-[#EFE4D6] leading-relaxed font-normal">
              हमारे विद्वान पंडित आपके नाम और गोत्र से पूर्ण शास्त्रोक्त विधि से पूजा संपन्न करेंगे एवं लाइव वीडियो प्रमाण आपके व्हाट्सएप पर भेजेंगे।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-sm mx-auto sm:flex sm:items-center sm:justify-center sm:max-w-none">
              <Link
                href="/pujas"
                className="px-7 py-3.5 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer text-center"
              >
                <span>पूजा बुक करें</span>
                <span className="text-base">➔</span>
              </Link>

              <a
                href="https://wa.me/919530401984?text=Namaste!%20I%20want%20to%20consult%20about%20puja%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 text-center"
              >
                <span>💬 हमसे संपर्क करें</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: DIVYA DARSHAN VIDEO GALLERY & JYOTISH TOOLS
          ============================================================ */}
      <section className="w-full bg-[#FAF8F5] py-8 border-t border-[#EFE4D6]">
        <SacredVideoGallery videos={dbVideos} />
      </section>

      <section className="w-full bg-[#FAF8F5] py-8 border-t border-[#EFE4D6]">
        <SacredAstroTools limit={6} />
      </section>

      {/* ============================================================
          SECTION 10: FAQ SECTION
          ============================================================ */}
      <section className="w-full bg-[#FAF8F5] border-t border-[#EFE4D6] pb-16">
        <SacredFaqAccordion />
      </section>

    </div>
  )
}

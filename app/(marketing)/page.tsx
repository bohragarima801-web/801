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
          SECTION 1: FULL-WIDTH CINEMATIC HERO SLIDER & QUICK SERVICES
          ============================================================ */}
      <section className="relative w-full bg-gradient-to-b from-[#FAF8F5] via-[#FFF3E8]/30 to-[#FAF8F5] pt-3 sm:pt-5 pb-8 md:pb-14 border-b border-[#EFE4D6]">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl space-y-6 md:space-y-8">
          
          {/* Full-Width Top Banner Slider */}
          <div className="w-full">
            <HeroPujaSlider slides={heroSlides} />
          </div>

          {/* Quick Action Spiritual Services Grid (InstaAstro Style) */}
          {/* Quick Action Spiritual Services Grid (InstaAstro Style) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3.5 max-w-5xl mx-auto pt-1">
            {[
              {
                title: "ऑनलाइन पूजाएं",
                subtitle: "वेदोक्त महायज्ञ",
                icon: "🪔",
                href: "/pujas",
                badge: "प्रमुख",
                badgeColor: "bg-[#7A1521] text-white"
              },
              {
                title: "चढ़ावा सेवा",
                subtitle: "शीघ्र अर्पण",
                icon: "🌸",
                href: "/book-chadhawa",
                badge: "नवीन",
                badgeColor: "bg-[#FF6600] text-white"
              },
              {
                title: "पं. मुकेश बोहरा",
                subtitle: "27+ वर्ष अनुभव",
                icon: "🙏",
                href: "/about",
                badge: "आचार्य",
                badgeColor: "bg-[#D4AF37] text-[#1C1614]"
              },
              {
                title: "मार्गदर्शन लें",
                subtitle: "व्हाट्सएप परामर्श",
                icon: "💬",
                href: "https://wa.me/919530401984?text=%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A3%E0%A4%BE%E0%A4%AE%20%E0%A4%AA%E0%A4%82%E0%A4%A1%E0%A4%BF%E0%A4%A4%20%E0%A4%9C%E0%A5%80%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9B%E0%A5%87%20%E0%A4%85%E0%A4%AA%E0%A4%A8%E0%A5%80%20%E0%A4%B8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%AF%E0%A4%BE%20%E0%A4%85%E0%A4%A8%E0%A5%81%E0%A4%B8%E0%A4%BE%E0%A4%B0%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%B8%E0%A4%82%E0%A4%95%E0%A4%B2%E0%A5%8D%E0%A4%AA%20%E0%A4%95%E0%A4%BE%20%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%97%E0%A4%A6%E0%A4%B0%E0%A5%8D%E0%A4%B6%E0%A4%A8%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4",
                badge: "24x7",
                badgeColor: "bg-emerald-600 text-white"
              },
              {
                title: "वैदिक टूल्स",
                subtitle: "कुंडली व पंचांग",
                icon: "🔮",
                href: "/tools",
                badge: "मुफ्त",
                badgeColor: "bg-[#7A1521] text-white"
              },
              {
                title: "VIP अनुष्ठान",
                subtitle: "व्यक्तिगत महायज्ञ",
                icon: "👑",
                href: "/vip-pujas",
                badge: "1-on-1",
                badgeColor: "bg-[#D4AF37] text-[#1C1614]"
              },
            ].map((service, i) => (
              <Link
                key={i}
                href={service.href}
                className="flex flex-col items-center justify-between p-2.5 sm:p-3.5 bg-white rounded-2xl border border-[#EFE4D6] shadow-xs hover:border-[#FF6600] hover:shadow-md hover:-translate-y-0.5 transition-all text-center group relative overflow-hidden"
              >
                {service.badge && (
                  <span className={`absolute top-1.5 right-1.5 text-[8px] font-black px-1.5 py-0.2 rounded-full ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                )}
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-[#FFF3E8] border border-[#FFD2B0] text-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#FF6600] group-hover:text-white transition-all shadow-2xs">
                  <span>{service.icon}</span>
                </div>
                <div className="mt-2 space-y-0.5 w-full">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1C1614] group-hover:text-[#FF6600] transition-colors truncate">
                    {service.title}
                  </h4>
                  <p className="text-[10px] text-[#6B5E57] truncate hidden sm:block">
                    {service.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Floating 4-Column Authentic Trust Stats */}
          <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#EFE4D6] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center shadow-[0_8px_30px_rgba(28,22,20,0.05)] max-w-5xl mx-auto">
            {[
              { val: "27+ वर्ष", label: "वैदिक परंपरा (1997 से)", sub: "शास्त्रोक्त आचार्यों द्वारा" },
              { val: "100%", label: "व्यक्तिगत नाम-गोत्र संकल्प", sub: "विद्वान ब्राह्मणों द्वारा" },
              { val: "HD वीडियो", label: "व्हाट्सएप लाइव प्रमाण", sub: "संकल्प व आहुति वीडियो" },
              { val: "100%", label: "सुरक्षित व पावन सेवा", sub: "रेज़रपे व UPI द्वारा" }
            ].map((stat, i) => (
              <div key={i} className="space-y-0.5 border-r last:border-r-0 border-[#EFE4D6] pr-2">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#FF6600] tracking-tight">{stat.val}</div>
                <div className="text-xs sm:text-sm font-bold text-[#1C1614]">{stat.label}</div>
                <div className="text-[10px] text-[#6B5E57] hidden sm:block">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* ============================================================
              PROBLEM-BASED NAVIGATION CHIPS (Instant High-CRO Situation Filter)
              ============================================================ */}
          <div className="pt-2 max-w-5xl mx-auto space-y-3">
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs sm:text-sm font-bold text-[#1C1614] flex items-center gap-1.5">
                <span>🎯</span>
                <span>अपनी समस्या अनुसार पावन अनुष्ठान चुनें:</span>
              </span>
              <Link href="/pujas" className="text-xs font-bold text-[#FF6600] hover:underline flex items-center gap-0.5">
                <span>सभी पूजाएं</span>
                <span>➔</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none sm:grid sm:grid-cols-5 sm:overflow-visible">
              {[
                { label: "विवाह व दांपत्य बाधा", sub: "शीघ्र विवाह व शांति", icon: "🌸", href: "/pujas?category=vivah", color: "hover:border-[#FF6600]" },
                { label: "शत्रु, कोर्ट व नजर दोष", sub: "माँ बगलामुखी रक्षा", icon: "🛡️", href: "/pujas?category=bagalamukhi", color: "hover:border-[#7A1521]" },
                { label: "स्वास्थ्य व महामृत्युंजय", sub: "रोग मुक्ति व दीर्घायु", icon: "🌿", href: "/pujas?category=health", color: "hover:border-emerald-600" },
                { label: "धन, व्यापार व समृद्धि", sub: "लक्ष्मी-कुबेर महायज्ञ", icon: "💰", href: "/pujas?category=wealth", color: "hover:border-[#D4AF37]" },
                { label: "ग्रह शांति व शनि दोष", sub: "नवग्रह व कालसर्प शांति", icon: "🪐", href: "/pujas?category=graha", color: "hover:border-indigo-600" }
              ].map((chip, idx) => (
                <Link
                  key={idx}
                  href={chip.href}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 bg-white rounded-2xl border border-[#EFE4D6] shadow-2xs hover:shadow-md transition-all group ${chip.color}`}
                >
                  <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{chip.icon}</span>
                  <div className="text-left whitespace-nowrap sm:whitespace-normal">
                    <p className="text-xs font-bold text-[#1C1614] group-hover:text-[#FF6600] transition-colors leading-tight">{chip.label}</p>
                    <p className="text-[10px] text-[#6B5E57] font-normal leading-tight mt-0.5">{chip.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 2: "HOW ONLINE PUJA WORKS" (4-STEP PROCESS FLOW)
          ============================================================ */}
      <section className="w-full bg-[#FAF8F5] py-14 md:py-20 border-b border-[#EFE4D6]">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <span>🪔</span>
              <span>सरल, पारदर्शी एवं शास्त्रोक्त प्रक्रिया</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614]">
              ऑनलाइन पूजा कैसे संपन्न होती है?
            </h2>
            <p className="text-sm text-[#6B5E57]">
              घर बैठे 4 सरल चरणों में अपनी पावन पूजा संपन्न करवाएं एवं व्हाट्सएप पर लाइव वीडियो प्रमाण प्राप्त करें।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: "🪔",
                title: "पूजा व संकल्प का चयन",
                desc: "अपनी मनोकामना अनुसार काशी, उज्जैन, कामाख्या व सिद्ध शक्तिपीठों के पावन अनुष्ठान चुनें।"
              },
              {
                step: "02",
                icon: "✍️",
                title: "नाम व गोत्र संकल्प विवरण",
                desc: "अपना नाम, गोत्र व प्रार्थना दर्ज करें ताकि मुख्य आचार्य आपके नाम से व्यक्तिगत संकल्प लें।"
              },
              {
                step: "03",
                icon: "🔥",
                title: "वेदोक्त पूजा व महाहवन",
                desc: "27+ वर्षों के विद्वान वैदिक आचार्यों द्वारा विधि-विधान से महामंत्र जाप एवं आहुतियां समर्पित की जाती हैं।"
              },
              {
                step: "04",
                icon: "📦",
                title: "व्हाट्सएप वीडियो व पावन प्रसाद",
                desc: "आपके नाम-गोत्र के संकल्प का HD वीडियो व्हाट्सएप पर भेजा जाता है एवं अभिमंत्रित प्रसाद घर पहुंचता है।"
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
                  alt="Pt. Mukesh Bohra - Head Acharya"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
                  <p className="font-bold text-sm">Pt. Mukesh Bohra</p>
                  <p className="text-[11px] text-[#D4AF37] font-semibold">Vedic Service Since 1997 • 27+ Yrs Exp</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF3E8] text-xs font-bold text-[#7A1521] border border-[#EFE4D6]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Head Acharya (Maa Katyayani Peeth)</span>
              </div>
            </div>

            {/* Content & Story */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
                <Award className="h-3.5 w-3.5 text-[#FF6600]" />
                <span>Personal Guidance & Sacred Tradition</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1614] leading-tight">
                "Our ashram is humble, but every puja is performed with pure Vedic sanctity."
              </h2>

              <p className="text-xs sm:text-sm text-[#4A3E39] leading-relaxed font-medium">
                Unlike impersonal online platforms where you don't know who is performing your ritual, at DivyaYagyam every puja and sankalp is personally guided by <strong>Pt. Mukesh Bohra (27+ years Vedic experience)</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {[
                  { icon: "🕉️", title: "Vedic Parampara Since 1997", desc: "Authentic mantra chanting and Vedic rituals" },
                  { icon: "📹", title: "Live Video Proof", desc: "Personalized sankalp video sent on WhatsApp" },
                  { icon: "📿", title: "Direct Name & Gotra Sankalp", desc: "No automated or simulated ceremonies" },
                  { icon: "📦", title: "Consecrated Sacred Prasad", desc: "Safe home delivery to your address" },
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
                  <span>Read About Pandit Ji & Ashram</span>
                  <span>➔</span>
                </Link>
                <a
                  href="https://wa.me/919530401984?text=Namaste%20Pandit%20ji,%20I%20want%20to%20consult%20about%20puja%20booking"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-2xs transition-all inline-flex items-center gap-1.5"
                >
                  <span>💬 Talk to Pandit Ji Directly</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: "POPULAR PUJAS & ANUSHTHANS" (PUJAS GRID)
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-[#EFE4D6]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EFE4D6]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <Sparkles className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>शास्त्रोक्त अनुष्ठान</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              लोकप्रिय पावन पूजाएं एवं महाहवन
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              काशी विश्वनाथ, माँ बगलामुखी, महाकालेश्वर एवं सिद्ध शक्तिपीठों से 100% प्रामाणिक वैदिक पूजाएं।
            </p>
          </div>

          <Link
            href="/pujas"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] hover:text-[#FF6600] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all shrink-0"
          >
            <span>सभी पूजाएं देखें</span>
            <span>➔</span>
          </Link>
        </div>

        {/* Responsive Grid of Puja Cards */}
        {displayPujas.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border border-[#EFE4D6] space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="h-14 w-14 mx-auto rounded-full bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center text-3xl">🪔</div>
            <h3 className="text-xl font-bold text-[#1C1614]">पावन पूजाएं शीघ्र प्रारंभ हो रही हैं</h3>
            <p className="text-xs text-[#6B5E57]">आश्रम द्वारा आगामी शुभ तिथियों के अनुष्ठान जोड़े जा रहे हैं।</p>
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
          SECTION 4: "SANCTIFIED STORE & SAMAGRI" (Rendered ONLY when products exist)
          ============================================================ */}
      {products && products.length > 0 && (
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-[#EFE4D6]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EFE4D6]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <span>⚡</span>
              <span>सिद्ध एवं अभिमंत्रित सामग्री</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              अभिमंत्रित सामग्री एवं पावन स्टोर
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              100% अभिमंत्रित रुद्राक्ष, सिद्ध भस्म, शंख, पूजा थाली एवं पावन सामग्री आपके घर पर।
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] hover:text-[#FF6600] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all shrink-0"
          >
            <span>सभी सामग्री देखें</span>
            <span>➔</span>
          </Link>
        </div>

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
                      {p.category?.name || 'वैदिक सामग्री'}
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
                      ऑर्डर करें ➔
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
      )}

      {/* ============================================================
          SECTION 5: "WHY CHOOSE US?" (VALUE PROPOSITIONS)
          ============================================================ */}
      <section className="relative py-14 md:py-20 bg-[#FFF3E8]/60 text-[#1C1614] overflow-hidden border-b border-[#EFE4D6]">
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>परम विश्वास एवं वैदिक शुचिता</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614]">
              दिव्ययज्ञम् का चयन क्यों करें?
            </h2>
            <p className="text-sm text-[#6B5E57]">
              शुद्ध वैदिक परंपरा, 27+ वर्षों का आध्यात्मिक अनुभव, व्यक्तिगत नाम-गोत्र संकल्प एवं अभिमंत्रित प्रसाद घर डिलीवरी।
            </p>
          </div>

          {/* 6 Value Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🕉️",
                title: "शास्त्रोक्त एवं प्रामाणिक विधि",
                desc: "सभी पूजाएं पूर्णतः वेदोक्त कर्मकांड, शुद्ध संस्कृत मंत्रोच्चार एवं शास्त्रीय मर्यादा के अनुसार संपन्न होती हैं।"
              },
              {
                icon: "📜",
                title: "व्यक्तिगत नाम-गोत्र संकल्प",
                desc: "मुख्य आचार्य जी पूजा प्रारंभ करते समय स्वयं आपके और आपके परिवार के नाम एवं गोत्र का स्पष्ट संकल्प लेते हैं।"
              },
              {
                icon: "🎥",
                title: "व्हाट्सएप पर लाइव HD वीडियो प्रमाण",
                desc: "आपके संकल्प एवं मुख्य हवन आहुति का स्पष्ट HD वीडियो सीधे आपके व्हाट्सएप नंबर पर भेजा जाता है।"
              },
              {
                icon: "🎁",
                title: "अभिमंत्रित पावन प्रसाद",
                desc: "हवन भस्म, रक्षासूत्र, अक्षत एवं अभिमंत्रित पावन प्रसाद सुरक्षित आपके घर पर स्पीड पोस्ट से पहुंचाया जाता है।"
              },
              {
                icon: "🏛️",
                title: "सिद्ध तीर्थ एवं शक्तिपीठ",
                desc: "काशी विश्वनाथ, महाकालेश्वर, माँ बगलामुखी एवं जाग्रत शक्तिपीठों के पावन धामों में अनुष्ठान।"
              },
              {
                icon: "🤝",
                title: "100% पारदर्शी व निःस्वार्थ सेवा",
                desc: "कोई छुपा हुआ शुल्क नहीं। पूजा से पहले एवं बाद में 24/7 सहायता व आध्यात्मिक मार्गदर्शन उपलब्ध।"
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
                  <span>100% Authentic Service</span>
                  <span className="text-[#7A1521] font-extrabold">✓ Verified</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================
          SECTION 6: "DEVOTEE REVIEWS & TRUST"
          ============================================================ */}
      <section className="w-full bg-[#FAF8F5] border-b border-[#EFE4D6]">
        <SacredTrustTestimonials testimonials={dbTestimonials} />
      </section>

      {/* ============================================================
          SECTION 7: "LATEST ARTICLES & BLOGS"
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-[#EFE4D6]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EFE4D6]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <BookOpen className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>वैदिक ज्ञान एवं आध्यात्मिक ब्लॉग</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              नवीनतम लेख एवं पावन अंतर्दृष्टि
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              पूजा विधि, व्रत-त्योहार, वैदिक ज्योतिष एवं ग्रह शांति पर प्रामाणिक आलेख।
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] hover:text-[#FF6600] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all shrink-0"
          >
            <span>सभी लेख पढ़ें</span>
            <span>➔</span>
          </Link>
        </div>

        {latestBlogs.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-2xl border border-[#EFE4D6] space-y-3 max-w-xl mx-auto shadow-xs">
            <div className="h-12 w-12 mx-auto rounded-full bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center text-2xl">📚</div>
            <h3 className="text-lg font-bold text-[#1C1614]">आध्यात्मिक लेख शीघ्र प्रकाशित हो रहे हैं</h3>
            <p className="text-xs text-[#6B5E57]">आश्रम के विद्वान आचार्य नए वैदिक आलेख तैयार कर रहे हैं।</p>
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
                      <span>पूरा लेख पढ़ें</span>
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
              <span>पावन आशीर्वाद एवं वैदिक संकल्प</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug">
              आज ही अपने नाम से संकल्प बुक करें
            </h2>

            <p className="text-xs sm:text-sm text-[#EFE4D6] leading-relaxed font-normal">
              हमारे पूज्य विद्वान आचार्य आपके नाम और गोत्र का व्यक्तिगत वेदोक्त संकल्प लेंगे तथा पूजा व आहुति का लाइव वीडियो आपके व्हाट्सएप पर भेजेंगे।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-sm mx-auto sm:flex sm:items-center sm:justify-center sm:max-w-none">
              <Link
                href="/pujas"
                className="px-7 py-3.5 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer text-center"
              >
                <span>पूजा संकल्प चुनें</span>
                <span className="text-base">➔</span>
              </Link>

              <a
                href="https://wa.me/919530401984?text=%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%A3%E0%A4%BE%E0%A4%AE%20%E0%A4%AA%E0%A4%82%E0%A4%A1%E0%A4%BF%E0%A4%A4%20%E0%A4%9C%E0%A5%80%2C%20%E0%A4%AE%E0%A5%81%E0%A4%9B%E0%A5%87%20%E0%A4%AA%E0%A5%82%E0%A4%9C%E0%A4%BE%20%E0%A4%B8%E0%A4%82%E0%A4%95%E0%A4%B2%E0%A5%8D%E0%A4%AA%20%E0%A4%95%E0%A5%87%20%E0%A4%AC%E0%A4%BE%E0%A4%B0%E0%A5%87%20%E0%A4%AE%E0%A5%87%E0%A4%82%20%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A5%8D%E0%A4%97%E0%A4%A6%E0%A4%B0%E0%A5%8D%E0%A4%B6%E0%A4%A8%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%8F%E0%A5%A4"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 text-center"
              >
                <span>💬 पंडित जी से व्हाट्सएप पर बात करें</span>
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

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
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3.5 max-w-5xl mx-auto pt-1">
            {[
              {
                title: "Online Pujas",
                subtitle: "Vedic Anushthan",
                icon: "🪔",
                href: "/pujas",
                badge: "Popular",
                badgeColor: "bg-[#7A1521] text-white"
              },
              {
                title: "Chadhawa",
                subtitle: "Direct Offering",
                icon: "🌸",
                href: "/book-chadhawa",
                badge: "New",
                badgeColor: "bg-[#FF6600] text-white"
              },
              {
                title: "Pt. Mukesh Bohra",
                subtitle: "27+ Yrs Experience",
                icon: "🙏",
                href: "/about",
                badge: "Acharya",
                badgeColor: "bg-[#D4AF37] text-[#1C1614]"
              },
              {
                title: "Get Guidance",
                subtitle: "24x7 WhatsApp",
                icon: "💬",
                href: "https://wa.me/919530401984?text=Namaste%20Pandit%20ji,%20I%20need%20guidance%20for%20puja%20booking",
                badge: "24x7",
                badgeColor: "bg-emerald-600 text-white"
              },
              {
                title: "Vedic Tools",
                subtitle: "Kundali & Muhurat",
                icon: "🔮",
                href: "/tools",
                badge: "Free",
                badgeColor: "bg-[#7A1521] text-white"
              },
              {
                title: "Puja Store",
                subtitle: "Prasad & Samagri",
                icon: "🛍️",
                href: "/products",
                badge: "Store",
                badgeColor: "bg-[#FF6600] text-white"
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
              { val: "27+ Years", label: "Vedic Experience (Since 1997)", sub: "Authentic Tradition" },
              { val: "100%", label: "Name & Gotra Sankalp", sub: "Individual Recitation" },
              { val: "HD Video", label: "WhatsApp Live Proof", sub: "Direct Video Update" },
              { val: "100%", label: "Secure Payment", sub: "Razorpay Encrypted" }
            ].map((stat, i) => (
              <div key={i} className="space-y-0.5 border-r last:border-r-0 border-[#EFE4D6] pr-2">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-[#FF6600] tracking-tight">{stat.val}</div>
                <div className="text-xs sm:text-sm font-bold text-[#1C1614]">{stat.label}</div>
                <div className="text-[10px] text-[#6B5E57] hidden sm:block">{stat.sub}</div>
              </div>
            ))}
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
              <span>Simple & Authentic Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614]">
              How Online Puja Works
            </h2>
            <p className="text-sm text-[#6B5E57]">
              Participate in sacred Vedic pujas in 4 simple steps and receive live video proof on WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: "🪔",
                title: "Select Your Puja",
                desc: "Choose from authentic pujas at Kashi, Ujjain, Jodhpur and renowned Shaktipeeths."
              },
              {
                step: "02",
                icon: "✍️",
                title: "Submit Sankalp Details",
                desc: "Provide devotee name, family gotra, and specific prayer intentions for sankalp."
              },
              {
                step: "03",
                icon: "🔥",
                title: "Vedic Puja Performed",
                desc: "Revered Vedic Pandits perform sacred mantras, hawan and personalized sankalp recitation."
              },
              {
                step: "04",
                icon: "📦",
                title: "Video Proof & Prasad",
                desc: "Receive HD video proof of your sankalp on WhatsApp and sanctified prasad at your doorstep."
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
              <span>Sacred Anushthans</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              Popular Pujas & Sacred Hawan
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              Authentic Vedic rituals from Kashi Vishwanath, Maa Baglamukhi, Mahakaleshwar and sacred peeths.
            </p>
          </div>

          <Link
            href="/pujas"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] hover:text-[#FF6600] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all shrink-0"
          >
            <span>View All Pujas</span>
            <span>➔</span>
          </Link>
        </div>

        {/* Responsive Grid of Puja Cards */}
        {displayPujas.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border border-[#EFE4D6] space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="h-14 w-14 mx-auto rounded-full bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center text-3xl">🪔</div>
            <h3 className="text-xl font-bold text-[#1C1614]">Sacred Pujas Coming Soon</h3>
            <p className="text-xs text-[#6B5E57]">New authentic pujas are being scheduled by the Ashram.</p>
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
          SECTION 4: "SANCTIFIED STORE & SAMAGRI"
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-[#EFE4D6]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#EFE4D6]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <span>⚡</span>
              <span>Consecrated & Energized</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              Sanctified Items & Spiritual Store
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              100% energized Rudraksha, sacred bhasma, shankh, puja thali & authentic items delivered to your home.
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
            <h3 className="text-lg font-bold text-[#1C1614]">Sacred Store Coming Soon</h3>
            <p className="text-xs text-[#6B5E57]">Authentic Vedic store items will be available shortly.</p>
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
                      ⚡ Consecrated
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
                        Buy Now ➔
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
          SECTION 5: "WHY CHOOSE US?" (VALUE PROPOSITIONS)
          ============================================================ */}
      <section className="relative py-14 md:py-20 bg-[#FFF3E8]/60 text-[#1C1614] overflow-hidden border-b border-[#EFE4D6]">
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EFE4D6] text-xs font-bold text-[#FF6600]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>Sacred Trust & Sanctity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614]">
              Why Choose DivyaYagyam?
            </h2>
            <p className="text-sm text-[#6B5E57]">
              Pure Vedic tradition, 27+ years spiritual experience, direct sankalp & consecrated prasad delivery.
            </p>
          </div>

          {/* 6 Value Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🕉️",
                title: "Shastrokta & Authentic",
                desc: "All pujas are conducted strictly in accordance with Vedic scriptures and shastrokta traditions."
              },
              {
                icon: "📜",
                title: "Personal Name & Gotra Sankalp",
                desc: "The head acharya personally chants your name and gotra at the commencement of your puja."
              },
              {
                icon: "🎥",
                title: "HD Video Proof on WhatsApp",
                desc: "Clear HD video recording of your sankalp and main aahuti is sent directly to your WhatsApp."
              },
              {
                icon: "🎁",
                title: "Consecrated Sacred Prasad",
                desc: "Blessed prasad, sacred rakshasutra, bhasma and akshat are dispatched to your doorstep."
              },
              {
                icon: "🏛️",
                title: "Revered Sacred Peeths",
                desc: "Pujas organized at Kashi Vishwanath, Maa Baglamukhi, Mahakaleshwar and renowned ashrams."
              },
              {
                icon: "🤝",
                title: "100% Transparent & Secure",
                desc: "No hidden charges. 24/7 support and guidance available — upholding complete sanctity."
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
              <span>Vedic Knowledge & Insights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1614] tracking-tight">
              Latest Articles & Spiritual Insights
            </h2>
            <p className="text-sm text-[#6B5E57] max-w-xl">
              Authentic guidance on puja vidhi, festivals, Vedic astrology, and sacred anushthans.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-[#FFF3E8] text-[#1C1614] hover:text-[#FF6600] font-bold text-xs sm:text-sm border border-[#EFE4D6] shadow-2xs transition-all shrink-0"
          >
            <span>Explore All Articles</span>
            <span>➔</span>
          </Link>
        </div>

        {latestBlogs.length === 0 ? (
          <div className="text-center py-12 px-6 bg-white rounded-2xl border border-[#EFE4D6] space-y-3 max-w-xl mx-auto shadow-xs">
            <div className="h-12 w-12 mx-auto rounded-full bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center text-2xl">📚</div>
            <h3 className="text-lg font-bold text-[#1C1614]">Spiritual Articles Coming Soon</h3>
            <p className="text-xs text-[#6B5E57]">Our revered acharyas are publishing new insights shortly.</p>
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
                      <span>Read More</span>
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
              <span>Auspicious Blessings & Sankalp</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug">
              Book Your Sacred Puja Today
            </h2>

            <p className="text-xs sm:text-sm text-[#EFE4D6] leading-relaxed font-normal">
              Our revered pandits will perform your personalized name and gotra sankalp with complete Vedic sanctity and deliver live video proof to your WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-sm mx-auto sm:flex sm:items-center sm:justify-center sm:max-w-none">
              <Link
                href="/pujas"
                className="px-7 py-3.5 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer text-center"
              >
                <span>Book Puja</span>
                <span className="text-base">➔</span>
              </Link>

              <a
                href="https://wa.me/919530401984?text=Namaste!%20I%20want%20to%20consult%20about%20puja%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 text-center"
              >
                <span>💬 Talk to Us on WhatsApp</span>
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

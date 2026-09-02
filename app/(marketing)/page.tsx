import Link from 'next/link'
import { generatePageMeta } from '@/lib/seo'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles, Star, ArrowRight, MapPin, Calendar, ShieldCheck, Video, Truck, Lock,
  Phone, MessageCircle, CheckCircle2, Award, Heart, HelpCircle, Eye, ChevronRight,
  BookOpen, Flame, Clock, Check, ArrowUpRight
} from 'lucide-react'
import { CinematicHero } from '@/components/cinematic-hero'
import { SacredVideoGallery } from '@/components/sacred-video-gallery'
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
    title: 'दिव्ययज्ञम् — भारत की सबसे भरोसेमंद ऑनलाइन पूजा एवं संकल्प सेवा',
    description: 'काशी विश्वनाथ, महाकालेश्वर, त्र्यंबकेश्वर एवं प्रमुख सिद्ध शक्तिपीठों से ऑनलाइन वैदिक पूजा, महायज्ञ एवं नाम-गोत्र संकल्प। लाइव WhatsApp वीडियो प्रमाण एवं घर पर पावन प्रसाद डिलीवरी।',
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
    name: 'माँ बगलामुखी मिर्ची हवन व विशेष शत्रुनिवारण अनुष्ठान',
    shortDescription: 'कोर्ट केस, कानूनी विवाद, शत्रु बाधा एवं व्यापारिक रुकावटों के निवारण हेतु माँ पीताम्बरा का अत्यंत उग्र व प्रभावी तंत्रोक्त महायज्ञ।',
    location: 'माँ बगलामुखी धाम, दतिया / जोधपुर',
    price: 901,
    badge: 'सर्वाधिक लोकप्रिय',
    category: { name: 'महाविद्या अनुष्ठान' },
    isEvergreen: true,
    coverImage: '/bagalamukhi_mirchi_hawan_2.jpg'
  },
  {
    id: 'fp-2',
    slug: 'mahamrityunjaya-jaap-rudrabhishekam',
    name: '11,000 महामृत्युंजय मंत्र जाप एवं महारुद्राभिषेक',
    shortDescription: 'अकाल मृत्यु भय, असाध्य रोग, ग्रह पीड़ा से रक्षा एवं दीर्घायु हेतु काशी के विद्वान वेदपाठियों द्वारा विधिपूर्वक रुद्राभिषेक एवं जाप।',
    location: 'काशी विश्वनाथ ज्योतिर्लिंग, वाराणसी',
    price: 901,
    badge: 'विशेष अनुष्ठान',
    category: { name: 'शिव अनुष्ठान' },
    isEvergreen: true,
    coverImage: '/mahamrityunjaya_hawan.webp'
  },
  {
    id: 'fp-3',
    slug: 'kalsarp-dosh-nivaran-puja',
    name: 'कालसर्प दोष शांति व राहु-केतु निवारण महापूजा',
    shortDescription: 'जन्मकुंडली में कालसर्प दोष, राहु-केतु पीड़ा, विवाह विलंब व आर्थिक अस्थिरता के शमन हेतु नाग-नागिन व संपूर्ण वैदिक शांति यज्ञ।',
    location: 'सिद्ध शक्तिपीठ, भारत',
    price: 901,
    badge: 'दोष निवारण',
    category: { name: 'दोष निवारण' },
    isEvergreen: true,
    coverImage: '/kalsarp_dosh_nivaran_banner.jpg'
  },
  {
    id: 'fp-4',
    slug: 'pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
    name: 'पितृ शांति विशेष एवं सर्व पितृ तर्पण महापूजा',
    shortDescription: 'कुश जल, श्वेत तिल-जौ से संपूर्ण पितृ तर्पण एवं ब्राह्मण भोजन द्वारा पितृ दोष शांति, संतान सुख व कुल-वंश की वृद्धि।',
    location: 'माँ कात्यायनी शक्तिपीठ, जोधपुर',
    price: 901,
    badge: 'पितृ दोष शांति',
    category: { name: 'पितृ शांति' },
    isEvergreen: true,
    coverImage: '/pitra_shanti_tarpan.jpg'
  },
  {
    id: 'fp-5',
    slug: 'shani-saadesati-dhaiya-dosh-nivaran-yagya',
    name: 'शनि साढ़ेसाती, ढैय्या व शनि दोष निवारण महापूजा एवं शांति यज्ञ',
    shortDescription: 'शनि साढ़ेसाती, अष्टम ढैय्या, महादशा के प्रकोप व शारीरिक-मानसिक कष्टों की शांति हेतु विशेष तेलाभिषेक व शमी पत्र महायज्ञ।',
    location: 'माँ कात्यायनी शक्तिपीठ, जोधपुर',
    price: 901,
    badge: 'नवग्रह शांति',
    category: { name: 'नवग्रह शांति' },
    isEvergreen: true,
    coverImage: '/shani_dosh_yagya.jpg'
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
    filename: g.title || 'Sacred Puja Darshan',
    url: g.coverImage,
    folder: g.type === 'PHOTO' ? 'Past Puja' : 'Live Darshan',
    type: g.type === 'VIDEO' ? 'VIDEO' : 'IMAGE'
  }))

  const dbVideos = [...allMediaVideos, ...galleryMediaItems]

  // Exclude VIP pujas from standard homepage grid
  const nonVipDbPujas = dbPujas.filter((p: any) => !p.isVip)
  const displayPujas = nonVipDbPujas.length >= 3 ? nonVipDbPujas : [...nonVipDbPujas, ...fallbackPujas.filter(fp => !nonVipDbPujas.some((dp: any) => dp.slug === fp.slug))]

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#E58A16]/20 notranslate" translate="no">

      {/* ============================================================
          SECTION 1: CINEMATIC MASTER HERO (Prompt Section 9-15)
          ============================================================ */}
      <CinematicHero />

      {/* ============================================================
          SECTION 2: SACRED TRUST STRIP (Immediate Reassurance)
          ============================================================ */}
      <div className="w-full bg-zinc-50 border-b border-zinc-200 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 items-center text-center">
          <div className="flex items-center justify-center gap-2 py-1 px-2">
            <span className="text-lg">🕉️</span>
            <span className="text-xs font-extrabold text-zinc-900">शास्त्रसम्मत वैदिक विधि</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1 px-2">
            <span className="text-lg">📜</span>
            <span className="text-xs font-extrabold text-zinc-900">व्यक्तिगत नाम-गोत्र संकल्प</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1 px-2">
            <span className="text-lg">🪔</span>
            <span className="text-xs font-extrabold text-zinc-900">25+ वर्ष अनुभवी वेदाचार्य</span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1 px-2">
            <span className="text-lg">📹</span>
            <span className="text-xs font-extrabold text-zinc-900">WhatsApp वीडियो प्रमाण</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-1 px-2">
            <span className="text-lg">📦</span>
            <span className="text-xs font-extrabold text-zinc-900">घर तक पावन प्रसाद</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTION 3: "आपकी श्रद्धा, आपका संकल्प" (PUJA DISCOVERY BY PURPOSE)
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-zinc-200">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-zinc-200 text-xs font-black text-amber-700">
            <Sparkles className="h-3.5 w-3.5 text-[#E58A16]" />
            <span>उद्देश्य अनुसार पूजा चयन</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
            आपकी श्रद्धा, आपका संकल्प
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
            अपने उद्देश्य एवं जीवन की आवश्यकता के अनुसार उपयुक्त वैदिक पूजा, हवन और अनुष्ठान चुनें।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {[
            {
              title: "आरोग्य, दीर्घायु एवं स्वास्थ्य रक्षा",
              deity: "भगवान शिव कृपा",
              desc: "महामृत्युंजय मंत्र जाप एवं महारुद्राभिषेक द्वारा रोग-व्याधि, अकाल भय व शारीरिक कष्टों से मुक्ति।",
              href: "/pujas/mahamrityunjaya-jaap-rudrabhishekam",
              badge: "आरोग्य",
              icon: "🔱"
            },
            {
              title: "शत्रु बाधा, कोर्ट विवाद व विजय अनुष्ठान",
              deity: "माँ पीताम्बरा बगलामुखी",
              desc: "विशेष तंत्रोक्त मिर्ची हवन एवं अमोघ कवच पाठ से कानूनी मुकदमों में विजय व नकारात्मक ऊर्जा शमन।",
              href: "/pujas/maa-bagalamukhi-mirchi-hawan",
              badge: "विजय",
              icon: "🔥"
            },
            {
              title: "कालसर्प दोष, राहु-केतु व अदृश्य बाधा",
              deity: "नाग-नागिन व नवनाग शांति",
              desc: "कुंडली के कालसर्प दोष, राहु-केतु के अशुभ प्रभाव से मुक्ति एवं करियर-विवाह में आ रही बाधाओं का निवारण।",
              href: "/pujas/kalsarp-dosh-nivaran-puja",
              badge: "दोष निवारण",
              icon: "🐍"
            },
            {
              title: "पितृ दोष शांति, तर्पण व कुल कल्याण",
              deity: "श्रीमद्भागवत गीता पाठ",
              desc: "कुश जल व श्वेत तिल से वैदिक तर्पण, पितरों की तृप्ति, संतान सुख व कुल-वंश की निरंतर उन्नति।",
              href: "/pujas/pitra-shanti-vishesh-sarva-pitra-tarpan-puja",
              badge: "पितृ शांति",
              icon: "🙏"
            },
            {
              title: "शनि साढ़ेसाती, ढैय्या व कर्म बाधा",
              deity: "शनि देव शांति",
              desc: "तेलाभिषेक, शमी पत्र अर्पण व शांति महायज्ञ द्वारा शनि प्रकोप, आर्थिक संकट व मानसिक तनाव से राहत।",
              href: "/pujas/shani-saadesati-dhaiya-dosh-nivaran-yagya",
              badge: "ग्रह शांति",
              icon: "🪐"
            },
            {
              title: "विशिष्ट VIP एकल महा अनुष्ठान",
              deity: "1-on-1 विशेष संकल्प",
              desc: "मुख्य आचार्यों द्वारा केवल आपके परिवार हेतु समर्पित विशेष 1-on-1 महा अनुष्ठान व विस्तृत वैदिक विधि।",
              href: "/vip-pujas",
              badge: "VIP अनुष्ठान",
              icon: "👑"
            }
          ].map((cat, i) => (
            <Link
              key={i}
              href={cat.href}
              className="group p-6 rounded-2xl bg-white border border-zinc-200 hover:border-[#E58A16] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl h-11 w-11 rounded-xl bg-amber-50 border border-zinc-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#E58A16]/10 text-[#E58A16] border border-[#E58A16]/20">
                    {cat.badge}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-amber-700 block mb-0.5">{cat.deity}</span>
                  <h3 className="font-black text-base sm:text-lg text-zinc-900 group-hover:text-[#E58A16] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  {cat.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-200 flex items-center justify-between text-xs font-extrabold text-[#E58A16] group-hover:translate-x-1 transition-transform">
                <span>पूजा देखें एवं संकल्प करें</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 4: "अभी उपलब्ध विशेष पूजाएँ" (FEATURED PUJAS GRID)
          ============================================================ */}
      <section id="featured-pujas" className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-zinc-200 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-zinc-200">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-zinc-200 text-xs font-black text-amber-700">
              <Sparkles className="h-3.5 w-3.5 text-[#E58A16]" />
              <span>आगामी सिद्ध अनुष्ठान</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              अभी उपलब्ध विशेष पूजाएँ
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
              काशी विश्वनाथ, माँ बगलामुखी, महाकालेश्वर एवं सिद्ध धामों में विद्वान पंडितों द्वारा संपन्न होने वाली आगामी वैदिक पूजाएँ।
            </p>
          </div>

          <Link
            href="/pujas"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-zinc-900 hover:text-[#E58A16] font-bold text-xs sm:text-sm border border-zinc-200 shadow-2xs transition-all shrink-0"
          >
            <span>सभी पूजाएँ देखें</span>
            <span>➔</span>
          </Link>
        </div>

        {/* Dynamic Puja Cards Grid */}
        {displayPujas.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-2xl border border-zinc-200 space-y-4 max-w-2xl mx-auto shadow-sm">
            <div className="h-14 w-14 mx-auto rounded-full bg-amber-50 text-[#E58A16] flex items-center justify-center text-3xl">🪔</div>
            <h3 className="text-xl font-bold text-zinc-900">पूजा विवरण शीघ्र उपलब्ध होगा</h3>
            <p className="text-xs text-zinc-500">कृपया कुछ समय पश्चात पुनः देखें।</p>
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
          SECTION 5: SACRED EXPERIENCE & 4-STEP "HOW IT WORKS"
          ============================================================ */}
      <section className="w-full bg-zinc-50/80 py-14 md:py-20 border-b border-zinc-200">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-black text-amber-700">
              <span>🪔</span>
              <span>पूजा केवल बुकिंग नहीं — एक संकल्प है</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              सरल एवं प्रामाणिक 4-चरण प्रक्रिया
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              घर बैठे 4 सरल चरणों में वैदिक पूजा का पुण्य लाभ और संकल्प प्रमाण प्राप्त करें।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: "01",
                icon: "🪔",
                title: "पूजा एवं तीर्थ चुनें",
                desc: "अपनी मनोकामना या दोष निवारण के अनुरूप तीर्थ और उपयुक्त वैदिक पूजा का चयन करें।"
              },
              {
                step: "02",
                icon: "✍️",
                title: "संकल्प विवरण दर्ज करें",
                desc: "यजमान का नाम, गोत्र, WhatsApp नंबर एवं विशेष मनोकामना की जानकारी प्रदान करें।"
              },
              {
                step: "03",
                icon: "🔥",
                title: "शास्त्रोक्त अनुष्ठान",
                desc: "निर्धारित शुभ मुहूर्त पर वरिष्ठ आचार्यों द्वारा विधि-विधान से मंत्र जाप व हवन आहुति।"
              },
              {
                step: "04",
                icon: "📦",
                title: "वीडियो प्रमाण व प्रसाद",
                desc: "WhatsApp पर संकल्प का स्पष्ट वीडियो प्रमाण प्राप्त करें और सिद्ध प्रसाद आपके घर पहुँचेगा।"
              }
            ].map((st) => (
              <div
                key={st.step}
                className="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-[#E58A16] transition-all duration-300 flex flex-col justify-between shadow-2xs hover:shadow-md group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-50 border border-zinc-200 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                    {st.icon}
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#E58A16]/10 text-[#E58A16] border border-[#E58A16]/20 font-mono">
                    {st.step}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-black text-base text-zinc-900 group-hover:text-[#E58A16] transition-colors">
                    {st.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: REAL PUJA PROOF & VIDEO GLIMPSES (Elevated Higher)
          ============================================================ */}
      <section className="w-full bg-white py-14 md:py-20 border-b border-zinc-200">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-zinc-200 text-xs font-black text-amber-700">
              <Video className="h-3.5 w-3.5 text-[#E58A16]" />
              <span>प्रत्यक्ष दर्शन एवं प्रमाण</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
              वास्तविक पूजा एवं यज्ञ के पावन दर्शन
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              जहाँ संकल्प होता है, वहाँ विश्वास बनता है। हमारे विद्वान आचार्यों द्वारा सिद्ध धामों में संपन्न पूजा व हवन की पावन झलकियां।
            </p>
          </div>

          <SacredVideoGallery videos={dbVideos} />
        </div>
      </section>

      {/* ============================================================
          SECTION 7: TRUST & ACHARYA SECTION ("परंपरा से सेवा तक")
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-5 text-center sm:text-left">
              <div className="relative mx-auto md:mx-0 w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-[#F7EBD7] shadow-md">
                <SafeImage
                  src="/pandit_mukesh_bohra.jpg"
                  alt="पं. मुकेश बोहरा - मुख्य पीठाधीश्वर व वेदाचार्य"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold py-1 px-2 rounded-lg text-center border border-white/20">
                  ✓ प्रमाणित मुख्य आचार्य
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-zinc-200 text-xs font-black text-amber-700">
                <Award className="h-3.5 w-3.5 text-[#E58A16]" />
                <span>परंपरा से सेवा तक — हमारे पूज्य आचार्य</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-zinc-900">
                  पं. मुकेश बोहरा (Pt. Mukesh Bohra)
                </h3>
                <p className="text-xs sm:text-sm font-bold text-amber-700 mt-0.5">
                  मुख्य पीठाधीश्वर व वरिष्ठ वेदाचार्य (माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर)
                </p>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                25 से अधिक वर्षों का वैदिक कर्मकांड, तंत्र शास्त्र एवं यज्ञ अनुष्ठान का प्रामाणिक अनुभव। आपके नाम-गोत्र से किए जाने वाले प्रत्येक संकल्प को शास्त्रों के कठोर नियमों और शुद्ध भाव से सम्पादित किया जाता है।
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-center">
                  <div className="text-lg sm:text-xl font-black text-[#E58A16]">25+ वर्ष</div>
                  <div className="text-[11px] font-bold text-zinc-900">वैदिक अनुभव</div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-center">
                  <div className="text-lg sm:text-xl font-black text-[#E58A16]">100%</div>
                  <div className="text-[11px] font-bold text-zinc-900">शास्त्रसम्मत विधि</div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/919530401984?text=जय%20श्री%20राम!%20मुझे%20पंडित%20जी%20से%20पूजा%20परामर्श%20चाहिए।"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#E58A16] hover:underline"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-600 fill-emerald-100" />
                  <span>पंडित जी सेवा डेस्क से WhatsApp पर परामर्श करें ➔</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: WHY DIVYAYAGYAM (4 Focused Sacred Pillars)
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-zinc-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-zinc-200 text-xs font-black text-amber-700">
            <ShieldCheck className="h-3.5 w-3.5 text-[#E58A16]" />
            <span>सनातन धर्म निष्ठा</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
            दिव्ययज्ञम् ही क्यों चुनें?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            हम केवल पूजा आयोजित नहीं करते — हम आपकी आस्था को शास्त्रों की शुद्धता से जोड़ते हैं।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            {
              icon: "🕉️",
              title: "शुद्ध वैदिक परंपरा",
              desc: "ऋग्वेद, यजुर्वेद एवं तंत्र शास्त्रों के विधान अनुसार केवल प्रमाणित वेदाचार्यों द्वारा मंत्रोच्चार।"
            },
            {
              icon: "📹",
              title: "पारदर्शी सेवा व प्रमाण",
              desc: "बिना किसी भ्रामक दावे के, 24 से 48 घंटे के भीतर नाम-गोत्र उच्चारण का मुख्य वीडियो प्रमाण WhatsApp पर।"
            },
            {
              icon: "📜",
              title: "व्यक्तिगत नाम-गोत्र संकल्प",
              desc: "सामूहिक दिखावा नहीं — आपके और आपके परिवार के नाम-गोत्र से समर्पित रूप से आहुति।"
            },
            {
              icon: "📦",
              title: "घर तक सिद्ध प्रसाद",
              desc: "यज्ञ में अभिमंत्रित रक्षासूत्र, भस्म व पवित्र प्रसाद सुरक्षित कूरियर से 3-5 दिनों में आपके द्वार।"
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-[#E58A16] transition-all duration-300 hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-xl bg-amber-50 border border-zinc-200 flex items-center justify-center text-2xl shadow-2xs">
                  {item.icon}
                </div>
                <h3 className="text-base font-black text-zinc-900">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-zinc-200 flex items-center justify-between text-[11px] font-bold text-[#E58A16]">
                <span>100% प्रामाणिक सेवा</span>
                <span className="text-emerald-700 font-extrabold">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 9: DEVOTEE EXPERIENCES / SOCIAL PROOF
          ============================================================ */}
      <section className="w-full bg-white border-b border-zinc-200">
        <SacredTrustTestimonials testimonials={dbTestimonials} />
      </section>

      {/* ============================================================
          SECTION 10: SECONDARY ECOSYSTEM (Consecrated Store & Tools)
          ============================================================ */}
      {products.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-14 md:py-20 border-b border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-4 border-b border-zinc-200">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-zinc-200 text-xs font-black text-amber-700">
                <span>⚡</span>
                <span>सिद्ध एवं अभिमंत्रित सामग्री</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                पावन प्रसादम एवं अभिमंत्रित वस्तुएं
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-zinc-900 hover:text-[#E58A16] font-bold text-xs border border-zinc-200 shadow-2xs transition-all shrink-0"
            >
              <span>संपूर्ण स्टोर देखें</span>
              <span>➔</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.slice(0, 4).map((p: any) => {
              const price = Number(p.price || 501)
              const imgSrc = p.coverImage || '/product_fallback.jpg'
              return (
                <Link
                  key={p.id}
                  href={'/products/' + p.slug}
                  className="group bg-white rounded-2xl border border-zinc-200 hover:border-[#E58A16] transition-all duration-300 hover:shadow-md flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-square overflow-hidden bg-amber-50/30 flex items-center justify-center">
                    <SafeImage
                      src={imgSrc}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded bg-[#6B2635] text-white border border-[#C99A3D]">
                      ⚡ अभिमंत्रित
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between gap-2">
                    <h3 className="font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-[#E58A16] transition-colors line-clamp-1">
                      {p.name}
                    </h3>
                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                      <span className="text-xs sm:text-sm font-black text-zinc-900">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-[#E58A16]">
                        देखें ➔
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Vedic Astrology & Panchang Tools Strip */}
      <section className="w-full bg-zinc-50/60 py-10 border-b border-zinc-200">
        <SacredAstroTools limit={6} />
      </section>

      {/* ============================================================
          SECTION 11: FAQ SECTION (Concise & Clear Answers)
          ============================================================ */}
      <section className="w-full bg-white border-b border-zinc-200">
        <SacredFaqAccordion />
      </section>

      {/* ============================================================
          SECTION 12: FINAL HIGH-CONVERTING BOOKING CTA BANNER
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#0B0D11] via-[#161B22] to-[#0B0D11] text-white p-8 md:p-14 overflow-hidden border border-[#C99A3D]/40 shadow-2xl text-center max-w-5xl mx-auto">
          {/* Subtle antique gold glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#E58A16]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#C99A3D]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#C99A3D]/50 text-xs font-black text-[#FFD700]">
              <span className="text-sm">🪔</span>
              <span>पावन संकल्प एवं ईश्वरीय कृपा</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-snug">
              अपने संकल्प को आज ही प्रारंभ करें
            </h2>

            <p className="text-xs sm:text-sm text-[#E6D6BE] leading-relaxed font-normal max-w-lg mx-auto">
              अपनी श्रद्धा और आवश्यकता के अनुरूप वैदिक पूजा चुनें और घर बैठे वरिष्ठ वेदपाठियों द्वारा विधिपूर्वक संकल्प का पुण्य लाभ प्राप्त करें।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 max-w-sm mx-auto sm:flex sm:items-center sm:justify-center sm:max-w-none">
              <Link
                href="/pujas"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#E58A16] to-[#C99A3D] hover:from-[#d4790e] hover:to-[#b8680c] text-white font-black text-sm shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer text-center"
              >
                <span>🔱 पूजा बुक करें</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://wa.me/919530401984?text=जय%20श्री%20राम!%20मुझे%20पूजा%20बुकिंग%20हेतु%20जानकारी%20चाहिए।"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp पर पूछें</span>
              </a>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#E6D6BE]/90 font-semibold">
              <span>✓ 100% वैदिक विधि</span>
              <span>•</span>
              <span>✓ नाम-गोत्र संकल्प</span>
              <span>•</span>
              <span>✓ लाइव वीडियो प्रमाण</span>
              <span>•</span>
              <span>✓ सुरक्षित पेमेंट</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

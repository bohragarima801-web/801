'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, Calendar, CheckCircle2, Video, Gift, Sparkles, ShieldCheck, 
  Star, User, HandHeart, Clock, ThumbsUp, ArrowRight, ArrowDown, Play, PhoneCall, Award, Flame,
  ChevronLeft, ChevronRight 
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, getSafeImageUrl } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PaymentTrustBadge } from '@/components/payment-trust-badge'
import { ProFormattedDescription } from '@/components/pro-formatted-description'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { DevoteeSocialProof } from '@/components/ui/devotee-social-proof'
import { CustomHtmlViewer } from '@/components/ui/custom-html-viewer'
import { VipPujaSingleView } from '@/components/vip-puja-single-view'

// Smart Helper: Calculates 100% authentic real-time target timestamp and formatted date
function getPujaTargetDate(puja: any): { targetTime: number; formattedDate: string } {
  const now = new Date()
  const rawDate = puja?.pujaDate
  
  if (rawDate) {
    const parsedObj = new Date(rawDate)
    const parsedTime = parsedObj.getTime()
    if (!isNaN(parsedTime) && parsedTime > now.getTime()) {
      return {
        targetTime: parsedTime,
        formattedDate: parsedObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      }
    }
  }

  // Fallback: 7 days from today if date is missing or past
  const defaultTargetObj = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000))
  defaultTargetObj.setHours(23, 59, 59, 0)

  return {
    targetTime: defaultTargetObj.getTime(),
    formattedDate: defaultTargetObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  }
}

// Real-time Date-based Urgency Countdown Timer Component
function PujaCountdownTimer({ targetTime }: { targetTime: number }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const diff = Math.max(0, targetTime - now)

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [targetTime])

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] text-[#292321] shadow-2xs">
      <Clock className="w-4 h-4 text-[#E58A16] animate-spin" style={{ animationDuration: '8s' }} />
      <span className="text-[11px] sm:text-xs font-bold text-[#E58A16] uppercase tracking-wider">Puja Starts In:</span>
      <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black text-white">
        <span className="bg-[#292321] px-1.5 py-0.5 rounded border border-[#665E58]/40">{String(timeLeft.days).padStart(2, '0')}d</span>:
        <span className="bg-[#292321] px-1.5 py-0.5 rounded border border-[#665E58]/40">{String(timeLeft.hours).padStart(2, '0')}h</span>:
        <span className="bg-[#292321] px-1.5 py-0.5 rounded border border-[#665E58]/40">{String(timeLeft.minutes).padStart(2, '0')}m</span>:
        <span className="bg-[#292321] px-1.5 py-0.5 rounded border border-[#665E58]/40">{String(timeLeft.seconds).padStart(2, '0')}s</span>
      </div>
    </div>
  )
}

// Smart Dynamic Helper: Generates Puja-specific "Why perform this Puja?" benefits tailored to any puja
function getDynamicPujaBenefits(puja: any) {
  const name = puja?.name || ''
  const desc = (puja?.shortDescription || puja?.description || '').toLowerCase()

  // 1. If Kalsarp / Rahu Ketu / Dosha Puja
  if (name.includes('कालसर्प') || name.includes('Kaal Sarp') || desc.includes('kalsarp') || desc.includes('rahu')) {
    return [
      { icon: ShieldCheck, title: 'Relief from Kaal Sarp Dosh and Life Obstacles', desc: 'Kaal Sarp Dosh causes repeated obstacles and failures in life. This special puja helps remove these barriers.' },
      { icon: HandHeart, title: 'Family Peace and Marital Harmony', desc: 'Kaal Sarp Dosh leads to marriage delays, conflicts, and child-related issues. This puja provides effective solutions.' },
      { icon: Sparkles, title: 'Relief from Financial Crisis and Debt', desc: 'Kaal Sarp Dosh creates financial instability. This puja brings stability, prosperity, and financial balance.' },
      { icon: Award, title: 'Karmic Purification and Spiritual Growth', desc: 'This puja frees one from past-life karmic debts and Pitru Dosh, purifying the soul and opening the path to spiritual upliftment.' },
      { icon: Flame, title: 'Protection from Negative Energies', desc: 'The puja removes negativity from the environment and protects against evil eye, tantric obstacles, and negative forces.' }
    ]
  }

  // 2. If Baglamukhi / Shatru Samhara / Victory Puja
  if (name.includes('बगलामुखी') || name.includes('Bagalamukhi') || name.includes('शत्रु') || desc.includes('court') || desc.includes('enemy')) {
    return [
      { icon: ShieldCheck, title: 'Court Case Victory & Legal Dispute Defense', desc: 'Neutralizes enemy actions, legal disputes, court cases, and workplace harassment through Maa Baglamukhi divine shield.' },
      { icon: HandHeart, title: 'Protection from Evil Eye & Negative Badha', desc: 'Destroys unseen dark energies, black magic, jealousy obstacles, and protects family peace and reputation.' },
      { icon: Sparkles, title: 'Business Triumph & Financial Dominance', desc: 'Removes severe trade stagnation, competitor hostility, and grants overwhelming victory in business ventures.' },
      { icon: Award, title: 'Courage, Focus & Speech Mastery', desc: 'Empowers internal courage, clarity of thought, and persuasive speech during crucial life confrontations.' },
      { icon: Flame, title: 'Maha Kavach for Family Security', desc: 'Establishes an impenetrable protective Kavach over your home, assets, and family members.' }
    ]
  }

  // 3. If Shiv / Rudrabhishek / Mahamrityunjaya Puja
  if (name.includes('विश्वनाथ') || name.includes('महामृत्युंजय') || name.includes('रुद्राभिषेक') || desc.includes('health') || desc.includes('shiv')) {
    return [
      { icon: ShieldCheck, title: 'Divine Health, Longevity & Healing', desc: 'Invocation of Bhagwan Shiv Mahamrityunjaya mantra bestows physical healing, disease resistance, and longevity.' },
      { icon: HandHeart, title: 'Removal of Planetary Doshas & Graha Peeda', desc: 'Pacifies adverse planetary transits including Shani Sade Sati, Rahu Mahadasha, and birth chart afflictions.' },
      { icon: Sparkles, title: 'Mental Peace & Stress Alleviation', desc: 'Calms anxiety, depression, and mental restlessness by infusing pure sattvic divine energy into your consciousness.' },
      { icon: Award, title: 'Family Harmony & Domestic Peace', desc: 'Harmonizes family relations, cleanses domestic environment, and attracts continuous divine grace.' },
      { icon: Flame, title: 'Spiritual Purification & Moksha Blessings', desc: 'Purifies past karmic impressions and connects your soul directly with Mahadev divine consciousness.' }
    ]
  }

  // 4. Default Universal Vedic Puja Benefits
  return [
    { icon: ShieldCheck, title: 'Removal of Unseen Barriers & Obstacles', desc: 'Clears karmic blockages and unexpected hurdles hindering career, education, and life progress.' },
    { icon: HandHeart, title: 'Family Unity & Peace of Mind', desc: 'Restores warmth, harmony, and mutual respect among family members while relieving emotional distress.' },
    { icon: Sparkles, title: 'Financial Stability & Prosperity', desc: 'Attracts auspicious opportunities, steady income, and relieves burdensome debt cycles.' },
    { icon: Award, title: 'Personalized Name & Gotra Vedic Sankalp', desc: 'Senior Veda Pandits chant your exact name and gotra with 108 auspicious Vedic mantras.' },
    { icon: Flame, title: 'HD Video Proof & Sacred Prasad Delivery', desc: 'Receive personalized video proof of your sankalp on WhatsApp and blessed prasad delivered to your home.' }
  ]
}

export function PujaClientView({ puja }: { puja: any }) {
  const router = useRouter()
  const basePrice = Number(puja?.price || 951)

  const packages = (() => {
    if (puja?.packages && Array.isArray(puja.packages) && puja.packages.length > 0) {
      return puja.packages
    }
    // If Admin defined NO custom packages, build clean packages strictly from Admin's Base Price & VIP Price
    const list: any[] = [
      { 
        id: '1', 
        name: `${puja.name || 'पूजा संकल्प'} — 1 यजमान संकल्प`, 
        price: basePrice, 
        popular: true,
        image: puja.coverImage || '/package-1.jpg',
        desc: 'संकल्प में 1 मुख्य व्यक्ति/यजमान का नाम व गोत्र पुकारा जाएगा। विशेष हवन आहुति एवं मन्त्र जप। व्हाट्सएप पर पूजा संकल्प वीडियो प्राप्त करें। शुद्ध शक्तिपीठ प्रसाद आपके घर पर डिलीवरी।' 
      }
    ]

    if (puja.vipPrice && Number(puja.vipPrice) > 0) {
      list.push({ 
        id: 'vip-pack', 
        name: '👑 VIP विशेष अनुष्ठान संकल्प', 
        price: Number(puja.vipPrice), 
        popular: false,
        image: '/package-4.jpg',
        desc: 'मुख्य आचार्यों द्वारा VIP यजमान विशेष संकल्प, व्यक्तिगत 108 आहुति हवन, प्राथमिकता वीडियो रिकॉर्डिंग एवं सिद्ध प्रसाद डिलीवरी।' 
      })
    }

    return list
  })()

  const [selectedPackage, setSelectedPackage] = useState<string>(packages[0]?.id || '1')
  const [activeTab, setActiveTab] = useState('packages')
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  if (!puja) return <div className="py-20 text-center text-slate-600 font-bold">Puja details loading or not found...</div>

  // Business Logic & Visual Mapping:
  // 1-to-1 Puja (single exclusive package or marked VIP) -> VIP Puja (.vip-puja-theme)
  // Multiple Packages (Individual, Couple, Family) -> Simple Puja (.simple-puja-theme)
  const isVip1to1 = packages.length === 1 || puja.isVip;

  if (isVip1to1) {
    return (
      <div className="vip-puja-theme">
        <VipPujaSingleView puja={{ ...puja, packages }} />
      </div>
    )
  }

  const fallbackImage = puja?.coverImage || '/katyayani_yagya_hero.jpg'
  const rawImages = [
    ...(puja?.coverImage ? [puja.coverImage] : []),
    ...(puja?.images || []).map((img: any) => typeof img === 'string' ? img : img?.url),
    ...(puja?.temple?.coverImage ? [puja.temple.coverImage] : [])
  ].filter((img: any) => Boolean(img) && typeof img === 'string' && !img.includes('package-'))
  
  const mediaList = Array.from(new Set(rawImages.length > 0 ? rawImages : [fallbackImage]))
  const currentMedia = mediaList[activeMediaIndex] || fallbackImage
  const activeImage = currentMedia
  const minSwipeDistance = 40

  const isVideoUrl = (url: string) => {
    if (!url) return false
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.includes('youtube') || url.includes('youtu.be')
  }

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null
  }

  const handlePrevMedia = () => {
    setActiveMediaIndex(prev => (prev === 0 ? mediaList.length - 1 : prev - 1))
  }

  const handleNextMedia = () => {
    setActiveMediaIndex(prev => (prev === mediaList.length - 1 ? 0 : prev + 1))
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNextMedia()
    } else if (isRightSwipe) {
      handlePrevMedia()
    }
  }

  // Auto slide images every 4 seconds if not video
  useEffect(() => {
    if (mediaList.length <= 1) return
    if (isVideoUrl(currentMedia)) return

    const interval = setInterval(() => {
      setActiveMediaIndex(prev => (prev === mediaList.length - 1 ? 0 : prev + 1))
    }, 4500)

    return () => clearInterval(interval)
  }, [mediaList.length, currentMedia])

  const handleBookNow = (overridePkgId?: string) => {
    const pkgId = overridePkgId || selectedPackage
    const pkg = packages.find((p: any) => p.id === pkgId)
    if (pkg) {
      router.push(`/bookings/new?pujaId=${puja.id}&package=${pkgId}`)
    }
  }

  const handleScrollTo = (id: string) => {
    setActiveTab(id)
    const element = document.getElementById(id)
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 110
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['packages', 'benefits', 'process', 'temple', 'media', 'faqs']
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveTab(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentSelectedPkgObj = packages.find((p: any) => p.id === selectedPackage) || packages[0]

  let showPanditChoice = false
  let assignedPandit: any = null
  if (puja?.customHtml) {
    try {
      const parsed = JSON.parse(puja.customHtml)
      showPanditChoice = !!parsed.showPanditChoice
      if (parsed.assignedPandit && parsed.assignedPandit.name) {
        assignedPandit = parsed.assignedPandit
      }
    } catch (e) {}
  }

  const { targetTime, formattedDate } = getPujaTargetDate(puja)

  return (
    <div className="simple-puja-theme relative bg-[#FFF9EF] pb-28 sm:pb-32 font-sans antialiased text-[#292321] min-h-screen notranslate" translate="no">
      
      {/* 1. Hero Section (Simple Puja Light & Clean Saffron Theme) */}
      <section className="relative w-full py-10 sm:py-16 lg:py-20 flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-[#FFF9EF] via-[#FDF4E9] to-[#FFF9EF] text-[#292321] border-b border-[#E6D6BE]">
        
        {/* Subtle Ambient Pattern */}
        <div aria-hidden="true" className="absolute right-0 top-0 text-[26vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Main Title & Details */}
          <div className="flex-1 space-y-4 text-center lg:text-left">
            
            {/* Countdown Timer & Category Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] text-xs font-bold uppercase tracking-widest shadow-2xs">
                ✦ {puja.category?.name || 'वैदिक पूजा अनुष्ठान'}
              </span>

              {/* Real-time Ticking Countdown Timer */}
              <PujaCountdownTimer targetTime={targetTime} />
            </div>
            
            <div className="space-y-2">
              <h1 className={cn(
                "font-black text-[#292321] tracking-tight leading-snug font-heading py-1",
                puja.name.length > 50 ? "text-2xl sm:text-3xl lg:text-4xl" : "text-3xl sm:text-4xl lg:text-5xl"
              )}>
                {puja.name}
              </h1>

              <p className="text-[#4A403C] text-xs sm:text-sm font-normal leading-relaxed max-w-2xl">
                {puja.shortDescription || '27+ वर्षों के अनुभवी वैदिक आचार्यों द्वारा नाम-गोत्र संकल्प, वेदोक्त मंत्रोच्चार, लाइव वीडियो प्रमाण एवं घर पर पावन प्रसाद डिलीवरी।'}
              </p>
            </div>

            {/* Location & Date Details Card Container */}
            <div className="p-4 rounded-2xl bg-white border border-[#E6D6BE] space-y-2.5 text-xs sm:text-sm shadow-2xs">
              <div className="flex items-center gap-2 text-[#292321] font-medium">
                <MapPin className="h-4 w-4 text-[#E58A16] shrink-0" />
                <span className="font-semibold">{puja.location || 'माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#E58A16] font-bold border-t border-[#E6D6BE] pt-2">
                <Calendar className="h-4 w-4 text-[#E58A16] shrink-0" />
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* 3 Verified Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs font-bold text-[#292321] pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-[#E6D6BE] flex items-center justify-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>वेरीफाइड आचार्य</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#E6D6BE] flex items-center justify-center gap-1.5 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#E58A16] shrink-0" />
                <span>नाम-गोत्र संकल्प</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#E6D6BE] flex items-center justify-center gap-1.5 shadow-2xs">
                <Video className="w-4 h-4 text-[#E58A16] shrink-0" />
                <span>वीडियो प्रमाण</span>
              </div>
            </div>

            {/* Devotee Social Proof & CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <DevoteeSocialProof pujaId={puja.id} pujaName={puja.name} />

              <button
                onClick={() => handleScrollTo('packages')}
                className="w-full sm:w-auto px-8 py-3.5 text-sm sm:text-base bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold shadow-md hover:shadow-lg transition-all uppercase tracking-wider rounded-full border border-emerald-400/50 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
              >
                <span>पूजा पैकेज चुनें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Hero Media / Banner Showcase Card */}
          <div className="w-full lg:w-[430px] shrink-0">
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E6D6BE] bg-white group">
              
              {/* Main Media Viewer */}
              <div 
                className="aspect-[4/3] relative overflow-hidden bg-[#F7EBD7]/40 flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {isVideoUrl(currentMedia) ? (
                  getYouTubeEmbedUrl(currentMedia) ? (
                    <iframe 
                      src={getYouTubeEmbedUrl(currentMedia)!} 
                      className="w-full h-full" 
                      title={puja.name} 
                      allowFullScreen 
                    />
                  ) : (
                    <video src={currentMedia} controls autoPlay muted loop className="w-full h-full object-contain" />
                  )
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#F7EBD7]/30">
                    <img 
                      src={currentMedia} 
                      alt="" 
                      aria-hidden="true" 
                      className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-30 scale-110 pointer-events-none" 
                    />
                    <img 
                      src={currentMedia} 
                      alt={puja.name} 
                      className="relative z-10 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                    />
                  </div>
                )}
                
                <Badge className="absolute top-3.5 left-3.5 bg-gradient-to-r from-[#8B1A21] to-[#E58A16] text-white font-extrabold border-none px-3.5 py-1 text-xs shadow-md z-10 rounded-full">
                  100% वैदिक विधान
                </Badge>

                {/* Slide Counter Badge */}
                {mediaList.length > 1 && (
                  <Badge className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md text-white font-bold border border-white/20 px-2.5 py-0.5 text-xs shadow-md z-10 rounded-full">
                    {activeMediaIndex + 1} / {mediaList.length}
                  </Badge>
                )}

                {/* Prev / Next Slide Arrows */}
                {mediaList.length > 1 && (
                  <>
                    <button 
                      type="button" 
                      onClick={handlePrevMedia}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#E58A16] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md z-20 cursor-pointer"
                      aria-label="Previous Media"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextMedia}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#E58A16] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-md z-20 cursor-pointer"
                      aria-label="Next Media"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Pagination Dots */}
                {mediaList.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                    {mediaList.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all cursor-pointer",
                          activeMediaIndex === idx ? "w-5 bg-[#E58A16]" : "w-2 bg-black/30 hover:bg-black/50"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Horizontal Thumbnails Carousel */}
              {mediaList.length > 1 && (
                <div className="flex gap-2 p-2.5 bg-[#F7EBD7] overflow-x-auto scrollbar-hide border-t border-[#E6D6BE]">
                  {mediaList.map((mediaUrl, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveMediaIndex(idx)}
                      className={cn(
                        "relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border transition-all p-0.5 bg-white cursor-pointer",
                        activeMediaIndex === idx ? "border-[#E58A16] ring-2 ring-[#E58A16]/50 scale-105 shadow-xs" : "border-[#E6D6BE] opacity-75 hover:opacity-100"
                      )}
                    >
                      {isVideoUrl(mediaUrl) ? (
                        <div className="w-full h-full bg-[#292321] text-[#E58A16] flex items-center justify-center font-bold">
                          <Play className="w-4 h-4 fill-current" />
                        </div>
                      ) : (
                        <img src={mediaUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-xs" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Booking Summary Box */}
              <div className="p-5 bg-[#FFF9EF] border-t border-[#E6D6BE] space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-[#E6D6BE] pb-3">
                  <span className="text-[#665E58] font-semibold">न्यूनतम दक्षिणा शुल्क:</span>
                  <span className="text-2xl font-black text-[#292321] font-heading">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                
                <button 
                  onClick={() => handleScrollTo('packages')}
                  className="w-full py-3.5 text-base bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold shadow-md hover:shadow-lg transition-all rounded-full uppercase tracking-wider border border-emerald-400/50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>पूजा पैकेज चुनें (BOOK NOW)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-xs text-[#665E58] flex items-center justify-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  अनुभवी वेदपाठी आचार्यों द्वारा संकल्पित
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 1.5. How This Works Bar (Clean Saffron Cream Strip) */}
      <div className="w-full bg-[#FDF4E9] border-b border-[#E6D6BE] py-4 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-[#E6D6BE] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1A21] to-[#E58A16] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">1</div>
            <div className="text-left min-w-0"><p className="text-xs font-bold text-[#292321] truncate">पैकेज चुनें</p><p className="text-[10px] text-[#665E58] truncate">Select Package</p></div>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-[#E6D6BE] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1A21] to-[#E58A16] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">2</div>
            <div className="text-left min-w-0"><p className="text-xs font-bold text-[#292321] truncate">नाम व गोत्र दर्ज करें</p><p className="text-[10px] text-[#665E58] truncate">Name & Gotra</p></div>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-[#E6D6BE] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1A21] to-[#E58A16] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">3</div>
            <div className="text-left min-w-0"><p className="text-xs font-bold text-[#292321] truncate">व्हाट्सएप लाइव वीडियो</p><p className="text-[10px] text-[#665E58] truncate">Live Video Proof</p></div>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-[#E6D6BE] shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B1A21] to-[#E58A16] text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">4</div>
            <div className="text-left min-w-0"><p className="text-xs font-bold text-[#292321] truncate">सिद्ध प्रसाद डिलीवरी</p><p className="text-[10px] text-[#665E58] truncate">Prasad at Doorstep</p></div>
          </div>
        </div>
      </div>

      {/* 2. Sticky Sub-Header Anchor Menu */}
      <div className="sticky top-[58px] sm:top-[68px] z-40 w-full bg-[#FFF9EF]/95 backdrop-blur-md border-b border-[#E6D6BE] shadow-xs overflow-x-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto flex items-center justify-start md:justify-center gap-6 sm:gap-8 px-4 py-3 min-w-max">
          {[
            { id: 'packages', label: 'विकल्प (PACKAGES)' },
            { id: 'benefits', label: 'लाभ (BENEFITS)' },
            { id: 'process', label: 'प्रक्रिया (PROCESS)' },
            { id: 'temple', label: 'मंदिर एवं धाम (TEMPLE)' },
            { id: 'faqs', label: 'सामान्य प्रश्न (FAQS)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleScrollTo(tab.id)}
              className={cn(
                "font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 pb-1.5 px-2 tracking-wide uppercase cursor-pointer",
                activeTab === tab.id 
                  ? "border-[#E58A16] text-[#E58A16]" 
                  : "border-transparent text-[#665E58] hover:text-[#292321]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 space-y-12 lg:space-y-16">

        {/* DevPunya Style: 4-Step "How This Works" Visual Horizontal Flow Bar */}
        <div id="process" className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-[#F3E8DE] dark:border-gray-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-b border-[#F3E8DE] dark:border-gray-800 pb-4">
            <h3 className="text-xl md:text-2xl font-heading font-extrabold text-[#111827] dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FF7A00]" />
              <span>How this works (अनुष्ठान प्रक्रिया)</span>
            </h3>
            <span className="text-xs text-[#6B7280] font-semibold">4 सरल चरणों में वैदिक अनुष्ठान</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-[#FFFBF7] dark:bg-slate-800/60 border border-[#F3E8DE] dark:border-gray-700 space-y-2 group hover:border-[#FF7A00] transition-all">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-amber-900/40 text-[#FF7A00] flex items-center justify-center mx-auto text-2xl font-bold shadow-xs group-hover:scale-110 transition-transform">
                📋
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white">1. Members & Gotra Details</div>
              <p className="text-[11px] text-[#4B5563] dark:text-gray-400 font-medium">नाम व गोत्र दर्ज करें</p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-[#FFFBF7] dark:bg-slate-800/60 border border-[#F3E8DE] dark:border-gray-700 space-y-2 group hover:border-[#FF7A00] transition-all">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-amber-900/40 text-[#FF7A00] flex items-center justify-center mx-auto text-2xl font-bold shadow-xs group-hover:scale-110 transition-transform">
                💳
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white">2. Confirm Puja Booking</div>
              <p className="text-[11px] text-[#4B5563] dark:text-gray-400 font-medium">सुरक्षित दक्षिणा भुगतान करें</p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-[#FFFBF7] dark:bg-slate-800/60 border border-[#F3E8DE] dark:border-gray-700 space-y-2 group hover:border-[#FF7A00] transition-all">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-amber-900/40 text-[#FF7A00] flex items-center justify-center mx-auto text-2xl font-bold shadow-xs group-hover:scale-110 transition-transform">
                🔔
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white">3. Mantra & Puja Update</div>
              <p className="text-[11px] text-[#4B5563] dark:text-gray-400 font-medium">व्हाट्सएप लाइव अपडेट प्राप्त करें</p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-[#FFFBF7] dark:bg-slate-800/60 border border-[#F3E8DE] dark:border-gray-700 space-y-2 group hover:border-[#FF7A00] transition-all">
              <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-amber-900/40 text-[#FF7A00] flex items-center justify-center mx-auto text-2xl font-bold shadow-xs group-hover:scale-110 transition-transform">
                📹
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#111827] dark:text-white">4. Puja Video & Prasad</div>
              <p className="text-[11px] text-[#4B5563] dark:text-gray-400 font-medium">HD वीडियो एवं शुद्ध प्रसाद डिलीवरी</p>
            </div>
          </div>
        </div>
        
        {/* Admin Decided: Pandit Ji Choice Feature Banner */}
        {showPanditChoice && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E6D6BE] space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border border-[#E6D6BE] shrink-0 shadow-xs bg-[#F7EBD7]">
                  <img 
                    src={getSafeImageUrl(assignedPandit?.photo || '/pandit_mukesh_bohra.jpg')} 
                    alt={assignedPandit?.name || 'पं. मुकेश बोहरा (Pt. Mukesh Bohra)'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/pandit_mukesh_bohra.jpg';
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-[#F7EBD7] text-[#E58A16] border border-[#E6D6BE] text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#E58A16]" /> पंडित जी चॉइस उपलब्ध (Pandit Ji Choice Enabled)
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#292321] font-heading">
                    {assignedPandit?.name || 'पं. मुकेश बोहरा (Pt. Mukesh Bohra)'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#665E58] font-medium">
                    {assignedPandit?.title || 'मुख्य पीठाधीश्वर व वेदाचार्य (माँ कात्यायनी शक्ति पीठ)'}
                  </p>
                  <p className="text-[11px] text-[#665E58]">
                    📍 {assignedPandit?.location || 'माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)'} • 📜 {assignedPandit?.experience || '25+ वर्ष अनुभव'}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-center sm:text-right">
                <Button 
                  onClick={() => handleScrollTo('packages')}
                  className="bg-[#292321] hover:bg-black text-white font-black px-5 py-3 rounded-xl shadow-md border-b-2 border-black/50 text-sm uppercase tracking-wide cursor-pointer"
                >
                  ✓ पंडित जी चॉइस के साथ बुक करें &rarr;
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Packages Section (Simple Puja Light & Clean Theme) */}
        <section id="packages" className="scroll-mt-32 bg-white border border-[#E6D6BE] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] text-xs font-bold uppercase tracking-widest">
              🌸 अपने परिवार की समृद्धि हेतु पवित्र संकल्प पैकेज चुनें
            </span>
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#292321] tracking-wide pt-1">
              पूजा सेवा पैकेज का चयन करें
            </h2>
            <p className="text-[#665E58] text-xs sm:text-sm leading-relaxed font-medium">
              आपके और आपके परिजनों के नाम व गोत्र से वेदमंत्रों द्वारा विशेष आहुतियाँ दी जाएंगी।
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#8B1A21] to-[#E58A16] mx-auto mt-3 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {packages.map((pkg: any) => {
              const isSelected = selectedPackage === pkg.id
              const pkgPrice = Number(pkg.price || 901)
              return (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={cn(
                    "relative rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1 group",
                    isSelected 
                      ? "bg-white border-2 border-[#E58A16] ring-2 ring-[#E58A16]/20 shadow-md" 
                      : "bg-[#FFFDF9] border border-[#E6D6BE] hover:border-[#E58A16] shadow-xs"
                  )}
                >
                  {/* Dynamic Popular Badges */}
                  {pkgPrice === 1501 && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#8B1A21] to-[#E58A16] text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md z-10 border border-white/20 whitespace-nowrap">
                      🔥 MOST POPULAR (दंपति संकल्प)
                    </div>
                  )}

                  {pkgPrice === 2501 && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md z-10 border border-white/20 whitespace-nowrap">
                      ⭐ POPULAR (4 सदस्य परिवार संकल्प)
                    </div>
                  )}

                  {pkgPrice === 3501 && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md z-10 border border-white/20 whitespace-nowrap">
                      👑 SERVA SAMRIDDHI (6 सदस्य संकल्प)
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Package Specific Image Frame */}
                    {pkg.image && (
                      <div className="relative w-full rounded-xl overflow-hidden border border-[#E6D6BE] bg-[#F7EBD7]/40 p-2 flex items-center justify-center min-h-[130px] max-h-[180px]">
                        <img 
                          src={pkg.image || '/package-1.jpg'} 
                          alt={pkg.name} 
                          className="w-full max-h-[160px] h-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-105" 
                          onError={(e) => {
                            e.currentTarget.src = '/package-1.jpg';
                          }}
                        />
                      </div>
                    )}

                    <div className="border-b border-[#E6D6BE] pb-3 text-center">
                      <h3 className="text-base font-bold text-[#292321] group-hover:text-[#E58A16] transition-colors leading-snug">
                        {pkg.name}
                      </h3>
                      <div className="mt-2 flex items-baseline justify-center gap-1">
                        <span className="text-xs text-[#665E58]">दक्षिणा शुल्क:</span>
                        <span className="text-2xl font-black text-[#292321] font-heading">₹{pkgPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2.5 text-xs text-[#4A403C]">
                      {pkg.desc ? pkg.desc.split('. ').map((feat: string, i: number) => feat.trim() && (
                        <li key={i} className="flex gap-2 items-start leading-relaxed font-medium">
                          <span className="text-[#E58A16] font-bold text-sm shrink-0">ॐ</span>
                          <span>{feat}</span>
                        </li>
                      )) : (
                        <li className="flex gap-2 items-start leading-relaxed font-medium">
                          <span className="text-[#E58A16] font-bold text-sm shrink-0">ॐ</span>
                          <span>वैदिक विधि-विधान से सम्पादित सम्पूर्ण पूजा अनुष्ठान</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Super Attractive BOOK PUJA Button */}
                  <div className="pt-4 mt-auto border-t border-[#E6D6BE]">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage(pkg.id);
                        handleBookNow(pkg.id);
                      }}
                      className="w-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border-none"
                    >
                      <span>BOOK PUJA NOW</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. Benefits & Importance Section */}
        <section id="benefits" className="scroll-mt-32">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6D6BE] shadow-xs space-y-8 text-[#292321]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E6D6BE] pb-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] text-xs font-bold uppercase tracking-widest">
                  ✨ महिमा एवं फलप्राप्ति
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#292321] tracking-wide">
                  पूजा अनुष्ठान का महत्व एवं लाभ
                </h2>
              </div>

              <div className="bg-[#F7EBD7] border border-[#E6D6BE] px-4 py-2 rounded-2xl text-center shrink-0">
                <p className="text-xl font-black text-[#8B1A21] font-heading">100%</p>
                <p className="text-[10px] text-[#665E58] uppercase font-bold tracking-wider">सिद्धि व शांतिप्रद</p>
              </div>
            </div>

            {/* Full Width Pro Premium Description Content */}
            <div className="w-full space-y-4">
              <ProFormattedDescription 
                content={puja.longDescription || puja.description || 'शास्त्रों के अनुसार इस महायज्ञ एवं पूजा अनुष्ठान से जातक के जीवन में आने वाली समस्त बाधायें, शत्रु बाधा, रोग, ऋण तथा मानसिक कष्टों का निवारण होता है। योग्य एवं विद्वान आचार्यों द्वारा नाम व गोत्र से सम्पादित इस पूजा से नवग्रह शांति तथा परिवार में सुख-समृद्धि का वास होता है।'} 
                type="puja" 
              />
            </div>

            {/* Why Perform This Puja? Dynamic Benefits Grid */}
            <div className="space-y-4 pt-4 border-t border-[#E6D6BE]">
              <h3 className="text-lg font-heading font-extrabold text-[#292321] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E58A16]" />
                <span>Why perform this Puja? (अनुष्ठान के दिव्य फल)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getDynamicPujaBenefits(puja).map((b, i) => (
                  <div key={i} className="bg-[#FFFDF9] p-5 rounded-2xl border border-[#E6D6BE] flex items-start gap-3.5 hover:border-[#E58A16] transition-all group shadow-2xs">
                    <div className="h-10 w-10 rounded-xl bg-[#F7EBD7] text-[#E58A16] border border-[#E6D6BE] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform">
                      <b.icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#292321] text-sm leading-snug">{b.title}</h4>
                      <p className="text-[#665E58] text-xs leading-relaxed font-normal">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Ritual Step-by-Step Process */}
        <section id="process" className="scroll-mt-32">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6D6BE] shadow-xs space-y-10 text-[#292321]">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] text-xs font-bold uppercase tracking-widest">
                ✨ सरल व पारदर्शी प्रक्रिया
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#292321] tracking-wide pt-1">
                पूजा सम्पादन प्रक्रिया (Step-by-Step Process)
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#8B1A21] to-[#E58A16] mx-auto mt-2 rounded-full"></div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {[
                { step: '01', title: 'पैकेज एवं संकल्प विवरण', desc: 'अपनी आवश्यकतानुसार पैकेज चुनें और मुख्य यजमान का नाम, गोत्र व पता दर्ज करें।' },
                { step: '02', title: 'वैदिक संकल्प एवं पूजन', desc: 'शुभ मुहूर्त में योग्य आचार्यों द्वारा आपके नाम से विशेष संकल्प लिया जाएगा।' },
                { step: '03', title: 'वीडियो/फोटो शेयरिंग', desc: 'पूजा सम्पादन एवं संकल्प का व्यक्तिगत वीडियो 24-48 घंटों में WhatsApp पर प्राप्त करें।' },
                { step: '04', title: 'पवित्र प्रसाद डिलीवरी', desc: 'मंत्राभिमंत्रित सिद्ध प्रसाद एवं रक्षा सूत्र आपके दिए गए पते पर कुरियर द्वारा भेजा जाएगा।' }
              ].map((item, index) => (
                <div key={index} className="relative bg-[#FFFDF9] p-6 rounded-2xl border border-[#E6D6BE] flex flex-col justify-between space-y-4 shadow-2xs hover:border-[#E58A16] transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-[#E6D6BE] font-heading">{item.step}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#E58A16] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#292321] text-base mb-1">{item.title}</h4>
                    <p className="text-[#665E58] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Temple Details */}
        <section id="temple" className="scroll-mt-32">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6D6BE] shadow-xs space-y-6 text-[#292321]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-[#E6D6BE] pb-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[#E58A16] font-bold text-xs tracking-widest uppercase">📍 पवित्र स्थान विवरण</span>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-[#292321]">
                  {puja.location || 'माँ कात्यायनी दुर्गा शक्ति पीठ, जोधपुर (राजस्थान)'}
                </h3>
                <p className="text-[#665E58] text-xs sm:text-sm">
                  संस्कृत विश्वविद्यालय एवं वेद पाठशाला से शिक्षित आचार्यों द्वारा अनुष्ठान
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-[#8B1A21] to-[#E58A16] text-white font-extrabold px-4 py-2 text-sm border-none shadow-md shrink-0 rounded-full">
                Verified Holy Temple
              </Badge>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6D6BE] space-y-1.5 shadow-2xs">
                <ShieldCheck className="w-6 h-6 text-[#E58A16] mx-auto mb-2" />
                <p className="font-bold text-sm text-[#292321]">शुद्ध वैदिक परम्परा</p>
                <p className="text-xs text-[#665E58]">मंत्रोच्चार एवं विधि-विधान की 100% शुद्धता</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6D6BE] space-y-1.5 shadow-2xs">
                <PhoneCall className="w-6 h-6 text-[#E58A16] mx-auto mb-2" />
                <p className="font-bold text-sm text-[#292321]">समर्पित सहायता</p>
                <p className="text-xs text-[#665E58]">पूजा सम्पादन तक लगातार WhatsApp अपडेट</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6D6BE] space-y-1.5 shadow-2xs">
                <Gift className="w-6 h-6 text-[#E58A16] mx-auto mb-2" />
                <p className="font-bold text-sm text-[#292321]">सुरक्षित प्रसाद पैकिंग</p>
                <p className="text-xs text-[#665E58]">हाईजीनिक एवं वाटरप्रूफ सुरक्षा बॉक्स</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Live Videos & Glimpses */}
        {puja.videos && puja.videos.length > 0 && (
          <section id="media" className="scroll-mt-32">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-[#E58A16] font-bold text-xs tracking-widest uppercase bg-[#F7EBD7] px-3 py-1 rounded-full border border-[#E6D6BE]">
                प्रत्यक्ष प्रमाण
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#292321] uppercase tracking-wide mt-2">
                पूजा एवं हवन की दिव्य झलकियां
              </h2>
              <div className="w-16 h-1 bg-[#E58A16] mx-auto mt-3 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {puja.videos.map((vid: any, idx: number) => {
                const embedUrl = getYouTubeEmbedUrl(vid.url) || vid.url;
                return (
                  <div key={vid.id || idx} className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-[#F7EBD7] bg-slate-900 relative">
                    <iframe 
                      src={embedUrl} 
                      className="w-full h-full" 
                      title={vid.title || `Divine Puja Havan Video ${idx + 1}`}
                      allowFullScreen
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 9. FAQs */}
        <section id="faqs" className="scroll-mt-32 mb-16">
          <FAQAccordion 
            faqs={
              puja?.faqs && Array.isArray(puja.faqs) && puja.faqs.length > 0
                ? puja.faqs
                : [
                    { question: 'क्या मैं पूजा का वीडियो देख सकूँगा/सकूँगी?', answer: 'हाँ, पूजा सम्पन्न होने के पश्चात 24 से 48 घंटे के भीतर आपके नाम एवं गोत्र उच्चारण का मुख्य संकल्प वीडियो आपके दिए गए WhatsApp एवं Email पर प्रेषित कर दिया जाएगा।' },
                    { question: 'प्रसाद घर पहुँचने में कितना समय लगता है?', answer: 'पूजा सम्पन्न होने के अगले कार्यदिवस पर प्रसाद कूरियर द्वारा प्रेषित किया जाता है। भारत में आमतौर पर 4 से 6 दिनों में प्रसाद आपके पते पर सुरक्षित पहुँच जाता है।' },
                    { question: 'क्या पूजा के समय मेरा व्यक्तिगत रूप से उपस्थित होना आवश्यक है?', answer: 'नहीं, शास्त्रानुसार संकल्प यजमान के नाम व गोत्र से लिया जाता है। आपकी अनुपस्थिति में भी आचार्यगण पूर्ण विधि-विधान से अनुष्ठान सम्पादित करते हैं।' },
                    { question: 'क्या बुकिंग राशि सुरक्षित है और रसीद मिलेगी?', answer: 'जी हाँ, आपकी बुकिंग 100% सुरक्षित है। भुगतान के तुरंत पश्चात आपको डिजिटल रसीद एवं बुकिंग कन्फर्मेशन WhatsApp व Email द्वारा प्राप्त हो जाएगी।' }
                  ]
            }
          />
        </section>

        {/* Dynamic Custom Embed HTML */}
        {(() => {
          if (!puja?.customHtml || !puja.customHtml.trim()) return null
          const raw = puja.customHtml.trim()
          let embedCode = raw
          if (raw.startsWith('{') && raw.endsWith('}')) {
            try {
              const parsed = JSON.parse(raw)
              if (parsed.assignedPandit && Object.keys(parsed).length === 1) {
                return null
              }
              embedCode = parsed.customHtml || parsed.html || parsed.customCode || ''
            } catch {
              embedCode = raw
            }
          }
          if (!embedCode || !embedCode.trim()) return null

          return (
            <section className="my-8">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-amber-100 pb-3 flex items-center gap-2">
                  <span>⚡ विशेष जानकारी एवं लाइव विजेट (Custom Embed)</span>
                </h3>
                <CustomHtmlViewer html={embedCode} />
              </div>
            </section>
          )
        })()}

        {/* 100% Secure Payment Trust Badge */}
        <PaymentTrustBadge className="my-8" />

      </div>

      {/* 10. Floating Sticky Mobile/Desktop Bottom Bar */}
      <div className="sticky-footer-bar fixed bottom-0 left-0 w-full p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-[#E6D6BE] shadow-[0_-6px_20px_rgba(0,0,0,0.08)] z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-sm font-extrabold text-[#292321] truncate max-w-md font-heading">{puja.name}</p>
            <p className="text-xs font-semibold text-[#665E58]">
              चयनित पैकेज: <span className="text-[#E58A16] font-black">{currentSelectedPkgObj?.name} (₹{Number(currentSelectedPkgObj?.price).toLocaleString('en-IN')})</span>
            </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-3 justify-between">
            <div className="md:hidden flex flex-col">
              <span className="text-[9px] text-[#665E58] uppercase font-extrabold">पूजा संकल्प शुल्क:</span>
              <span className="text-lg font-black text-[#292321] font-heading">
                ₹{Number(currentSelectedPkgObj?.price).toLocaleString('en-IN')}
              </span>
            </div>
            <button 
              onClick={() => handleBookNow()}
              className="w-full sm:w-auto px-7 sm:px-9 py-3 text-sm sm:text-base bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold shadow-md hover:shadow-lg transition-all uppercase tracking-wider rounded-full border border-emerald-400/50 shrink-0 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>पूजा बुक करें (BOOK NOW)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

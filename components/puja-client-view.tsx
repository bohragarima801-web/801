'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MapPin, Calendar, CheckCircle2, Video, Gift, Sparkles, ShieldCheck, 
  Star, User, HandHeart, Clock, ThumbsUp, ArrowRight, ArrowDown, Play, PhoneCall, Award,
  ChevronLeft, ChevronRight 
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn, getSafeImageUrl } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PaymentTrustBadge } from '@/components/payment-trust-badge'
import { ProFormattedDescription } from '@/components/pro-formatted-description'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { CustomHtmlViewer } from '@/components/ui/custom-html-viewer'
import { VipPujaSingleView } from '@/components/vip-puja-single-view'

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
  if (puja.isVip) {
    return <VipPujaSingleView puja={puja} />
  }

  const fallbackImage = process.env.NEXT_PUBLIC_URL_4684 || '/package-1.jpg'
  const rawImages = [
    ...(puja?.coverImage ? [puja.coverImage] : []),
    ...(puja?.images || []).map((img: any) => typeof img === 'string' ? img : img.url),
    ...(puja?.packages || []).map((pkg: any) => pkg.image).filter(Boolean),
    ...(puja?.temple?.coverImage ? [puja.temple.coverImage] : [])
  ].filter(Boolean)
  
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

  return (
    <div className="relative bg-[#FAF8F5] pb-28 sm:pb-32 font-sans antialiased text-slate-800">
      
      {/* 1. Hero Section (Vibrant Luxury Sanatan Saffron-Crimson & Royal Gold Theme) */}
      <section className="relative w-full py-12 sm:py-16 lg:py-20 flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-[#4A0D08] via-[#7B180F] to-[#360804] text-white">
        
        {/* Background Atmosphere Image with Warm Vignette & Ambient Glow */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
          {activeImage && (
            <img 
              src={activeImage} 
              alt={puja.name} 
              className="w-full h-full object-cover object-center scale-105 filter blur-sm transition-opacity duration-1000" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#360804] via-[#4A0D08]/85 to-[#7B180F]/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.28),transparent_70%)]"></div>
        </div>
        
        {/* Ambient Luminous Gold Particles Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-400/25 rounded-full blur-3xl pointer-events-none z-0"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Main Title & Details */}
          <div className="flex-1 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 border border-amber-400/40 bg-amber-500/20 backdrop-blur-xl px-4 py-1.5 rounded-full shadow-[0_4px_25px_rgba(245,158,11,0.25)]">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span className="text-amber-200 font-bold text-xs sm:text-sm tracking-widest uppercase">
                {puja.category?.name || 'दिव्य अनुष्ठान एवं महायज्ञ'}
              </span>
            </div>
            
            <div className="space-y-2">
              <p className="text-amber-300/90 text-sm sm:text-base md:text-lg font-bold font-devanagari tracking-wide italic">
                ✨ सर्व कार्य सिद्धि हेतु
              </p>
              <h1 className={cn(
                "font-extrabold text-amber-100 tracking-tight leading-normal drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] font-devanagari py-1",
                puja.name.length > 50 ? "text-2xl sm:text-3xl lg:text-4xl" : "text-3xl sm:text-4xl lg:text-5xl"
              )}>
                {puja.name}
              </h1>
            </div>

            {/* Location & Date Details */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-amber-100/90 font-medium text-xs sm:text-sm pt-1">
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-400/30 shadow-inner">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{puja.location || 'विशेष सिद्ध शक्तिपीठ / उज्जैन धाम'}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-xl border border-amber-400/30 shadow-inner">
                <Calendar className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  {puja.pujaDate 
                    ? new Date(puja.pujaDate).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }) 
                    : (puja.isEvergreen ? 'नियमित शुभ मुहूर्त' : 'आगामी शुभ मुहूर्त - बुकिंग चालू')}
                </span>
              </div>
            </div>

            {/* Key Assurance Feature Chips */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3 text-center">
              <div className="bg-black/30 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 shadow-lg group">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2 text-amber-300 group-hover:scale-110 transition-transform border border-amber-400/30">
                  <Video className="w-5 h-5" />
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-amber-100">लाइव वीडियो रिकॉर्डिंग</p>
              </div>
              <div className="bg-black/30 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 shadow-lg group">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2 text-amber-300 group-hover:scale-110 transition-transform border border-amber-400/30">
                  <Gift className="w-5 h-5" />
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-amber-100">घर पर शुद्ध प्रसाद</p>
              </div>
              <div className="bg-black/30 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-amber-400/30 hover:border-amber-400/50 transition-all duration-300 shadow-lg group">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center mx-auto mb-2 text-amber-300 group-hover:scale-110 transition-transform border border-amber-400/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-amber-100">नाम व गोत्र संकल्प</p>
              </div>
            </div>
          </div>

          {/* Hero Media / Banner Showcase Card */}
          <div className="w-full lg:w-[430px] shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(245,158,11,0.18)] border border-amber-400/30 bg-[#1A0A06]/95 backdrop-blur-xl group">
              
              {/* Main Media Viewer with Touch Swipe Support */}
              <div 
                className="aspect-[4/3] relative overflow-hidden bg-black flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
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
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#0A0302]">
                    <img 
                      src={currentMedia} 
                      alt="" 
                      aria-hidden="true" 
                      className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-40 scale-110 pointer-events-none" 
                    />
                    <img 
                      src={currentMedia} 
                      alt={puja.name} 
                      className="relative z-10 max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-[1.03]" 
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A06] via-transparent to-transparent pointer-events-none"></div>
                
                <Badge className="absolute top-3.5 left-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black border-none px-3.5 py-1 text-xs shadow-lg z-10 rounded-full">
                  100% वैदिक विधान
                </Badge>

                {/* Slide Counter Badge */}
                {mediaList.length > 1 && (
                  <Badge className="absolute top-3.5 right-3.5 bg-black/75 backdrop-blur-md text-amber-300 font-bold border border-amber-400/30 px-2.5 py-0.5 text-xs shadow-md z-10 rounded-full">
                    {activeMediaIndex + 1} / {mediaList.length}
                  </Badge>
                )}

                {/* Prev / Next Slide Arrows */}
                {mediaList.length > 1 && (
                  <>
                    <button 
                      type="button" 
                      onClick={handlePrevMedia}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg z-20 cursor-pointer"
                      aria-label="Previous Media"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={handleNextMedia}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-amber-500 text-white hover:text-black flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-lg z-20 cursor-pointer"
                      aria-label="Next Media"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Interactive Bullet Dots Indicator Overlay */}
                {mediaList.length > 1 && (
                  <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
                    {mediaList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all cursor-pointer",
                          activeMediaIndex === idx ? "w-5 bg-amber-400" : "w-2 bg-white/40 hover:bg-white/70"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Horizontal Thumbnails Carousel */}
              {mediaList.length > 1 && (
                <div className="flex gap-2 p-2.5 bg-[#120603] overflow-x-auto scrollbar-hide border-t border-amber-500/20">
                  {mediaList.map((mediaUrl, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveMediaIndex(idx)}
                      className={cn(
                        "relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border transition-all p-0.5 bg-black cursor-pointer",
                        activeMediaIndex === idx ? "border-amber-400 ring-2 ring-amber-400/50 scale-105 shadow-[0_0_12px_rgba(251,191,36,0.4)]" : "border-amber-900/40 opacity-65 hover:opacity-100"
                      )}
                    >
                      {isVideoUrl(mediaUrl) ? (
                        <div className="w-full h-full bg-slate-900 text-amber-300 flex items-center justify-center font-bold">
                          <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
                        </div>
                      ) : (
                        <img src={mediaUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover rounded-xs" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Booking Summary Box */}
              <div className="p-5 bg-gradient-to-b from-[#1F0C07] to-[#140603] space-y-4">
                <div className="flex justify-between items-center text-sm border-b border-amber-500/20 pb-3">
                  <span className="text-amber-200/80 font-medium">बुकिंग शुल्क प्रारम्भ:</span>
                  <span className="text-2xl font-black text-amber-300">₹{basePrice.toLocaleString()}</span>
                </div>
                
                <Button 
                  onClick={() => handleScrollTo('packages')}
                  className="w-full h-13 text-base sm:text-lg bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-[0_8px_25px_rgba(245,158,11,0.3)] transition-all rounded-xl uppercase tracking-wider border-b-4 border-amber-700 cursor-pointer"
                >
                  पूजा पैकेज चुनें (Book Now)
                </Button>

                <p className="text-center text-xs text-amber-200/80 flex items-center justify-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  अनुभवी वेदपाठी आचार्यों द्वारा संकल्पित
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Sticky Sub-Header Anchor Menu */}
      <div className="sticky top-[58px] sm:top-[68px] z-40 w-full bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-md overflow-x-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto flex items-center justify-start md:justify-center gap-6 sm:gap-8 px-4 py-3 min-w-max">
          {[
            { id: 'packages', label: 'विकल्प (Packages)' },
            { id: 'benefits', label: 'लाभ (Benefits)' },
            { id: 'process', label: 'प्रक्रिया (Process)' },
            { id: 'temple', label: 'मंदिर एवं धाम (Temple)' },
            ...(puja?.videos && puja.videos.length > 0 ? [{ id: 'media', label: 'वीडियो एवं झलकियां (Videos)' }] : []),
            { id: 'faqs', label: 'सामान्य प्रश्न (FAQs)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleScrollTo(tab.id)}
              className={cn(
                "font-bold text-xs sm:text-sm whitespace-nowrap transition-all border-b-2 pb-1.5 px-2 tracking-wide uppercase",
                activeTab === tab.id 
                  ? "border-rose-900 text-rose-900 font-extrabold" 
                  : "border-transparent text-slate-500 hover:text-rose-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 space-y-16 lg:space-y-20">
        
        {/* 3. Packages Section */}
        <section id="packages" className="scroll-mt-32">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-rose-900 font-bold text-xs tracking-widest uppercase bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
              शुभ संकल्प पैकेज
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-rose-950 uppercase tracking-wide mt-2">
              पूजा सेवा पैकेज का चयन करें
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              अपने परिवार की आवश्यकतानुसार पैकेज चुनें। आपके नाम और गोत्र से विशेष मंत्रोच्चार किया जाएगा।
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-rose-700 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg: any) => {
              const isSelected = selectedPackage === pkg.id
              return (
                <div 
                  key={pkg.id} 
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={cn(
                    "relative border-2 rounded-2xl p-5 sm:p-6 bg-white transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-xl group",
                    isSelected 
                      ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/10 shadow-lg scale-[1.02]" 
                      : "border-slate-200 hover:border-amber-300"
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md z-10">
                      ⭐ सर्वाधिक बुक किया गया
                    </div>
                  )}

                  <div className="space-y-5">
                    {/* Package Specific Custom Image — Never Cropped / Full Aspect */}
                    {pkg.image && (
                      <div className="relative w-full rounded-xl overflow-hidden border border-amber-200/70 bg-gradient-to-b from-amber-50/50 to-slate-100/50 mb-3 shadow-xs p-2 flex items-center justify-center min-h-[140px] max-h-[220px]">
                        <img 
                          src={pkg.image || '/package-1.jpg'} 
                          alt={pkg.name} 
                          className="w-full max-h-[200px] h-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]" 
                          onError={(e) => {
                            e.currentTarget.src = '/package-1.jpg';
                          }}
                        />
                      </div>
                    )}


                    <div className="border-b border-slate-100 pb-4 text-center">
                      <h3 className="text-lg font-black text-slate-800 group-hover:text-rose-900 transition-colors">
                        {pkg.name}
                      </h3>
                      <div className="mt-2 flex items-baseline justify-center gap-1">
                        <span className="text-xs text-slate-400">शुल्क:</span>
                        <span className="text-2xl font-black text-rose-900">₹{Number(pkg.price).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3">
                      {pkg.desc ? pkg.desc.split('. ').map((feat: string, i: number) => feat.trim() && (
                        <li key={i} className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                          <span className="text-rose-800 font-black text-base shrink-0 mt-0.5">ॐ</span>
                          <span>{feat}</span>
                        </li>
                      )) : (
                        <li className="flex gap-2.5 items-start text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                          <span className="text-rose-800 font-black text-base shrink-0 mt-0.5">ॐ</span>
                          <span>वैदिक विधि-विधान से सम्पादित सम्पूर्ण पूजा अनुष्ठान</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage(pkg.id);
                        handleBookNow(pkg.id);
                      }}
                      className={cn(
                        "w-full font-bold h-12 text-sm rounded-xl shadow-md transition-all uppercase tracking-wider border-b-4",
                        isSelected 
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white border-emerald-800" 
                          : "bg-slate-100 hover:bg-rose-900 hover:text-white text-slate-700 border-slate-300"
                      )}
                    >
                      बुक करें (Book Puja)
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. Significance / Benefits Section */}
        <section id="benefits" className="scroll-mt-32">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-amber-700 font-bold text-xs tracking-widest uppercase bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                महिमा एवं फलप्राप्ति
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-rose-950 uppercase tracking-wide mt-2">
                पूजा अनुष्ठान का महत्व एवं लाभ
              </h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg border-2 border-amber-500/20 relative bg-[#1E0C07] flex items-center justify-center">
                  <img src={activeImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-40 scale-110 pointer-events-none" />
                  <img src={activeImage} alt={puja.name} className="relative z-10 max-h-full max-w-full object-contain drop-shadow-md" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-rose-900 text-white p-4 rounded-xl shadow-xl hidden sm:block">
                  <p className="text-2xl font-black">100%</p>
                  <p className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">सिद्धि व शांतिप्रद</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <ProFormattedDescription 
                  content={puja.longDescription || puja.description || 'शास्त्रों के अनुसार इस महायज्ञ एवं पूजा अनुष्ठान से जातक के जीवन में आने वाली समस्त बाधायें, शत्रु बाधा, रोग, ऋण तथा मानसिक कष्टों का निवारण होता है। योग्य एवं विद्वान आचार्यों द्वारा नाम व गोत्र से सम्पादित इस पूजा से नवग्रह शांति तथा परिवार में सुख-समृद्धि का वास होता है।'} 
                  type="puja" 
                />
              </div>
            </div>

            {/* Highlighted Benefit Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              {[
                { icon: ShieldCheck, title: 'शत्रु व बाधा मुक्ति', desc: 'कोर्ट-कचहरी, शत्रु बाधा तथा नकारात्मक ऊर्जा से मुक्ति।' },
                { icon: HandHeart, title: 'सुख व समृद्धि', desc: 'व्यापार, नौकरी एवं धन-धान्य में निरंतर वृद्धि।' },
                { icon: Sparkles, title: 'आरोग्य व शांति', desc: 'दीर्घकालिक बीमारियों से राहत एवं मानसिक शांति।' },
                { icon: Award, title: 'वंश व कुल वृद्धि', desc: 'पारिवारिक सौहार्द एवं संतान सुख की प्राप्ति।' }
              ].map((b, i) => (
                <div key={i} className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-rose-900 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                    <p className="text-slate-600 text-xs mt-0.5 leading-snug">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Ritual Step-by-Step Process */}
        <section id="process" className="scroll-mt-32">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-rose-900 font-bold text-xs tracking-widest uppercase bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                सरल व पारदर्शी
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-rose-950 uppercase tracking-wide mt-2">
                पूजा सम्पादन प्रक्रिया (Step-by-Step Process)
              </h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {[
                { step: '01', title: 'पैकेज एवं संकल्प विवरण', desc: 'अपनी आवश्यकतानुसार पैकेज चुनें और मुख्य यजमान का नाम, गोत्र व पता दर्ज करें।' },
                { step: '02', title: 'वैदिक संकल्प एवं पूजन', desc: 'शुभ मुहूर्त में योग्य आचार्यों द्वारा आपके नाम से विशेष संकल्प लिया जाएगा।' },
                { step: '03', title: 'वीडियो/फोटो शेयरिंग', desc: 'पूजा सम्पादन एवं संकल्प का व्यक्तिगत वीडियो 24-48 घंटों में WhatsApp पर प्राप्त करें।' },
                { step: '04', title: 'पवित्र प्रसाद डिलीवरी', desc: 'मंत्राभिमंत्रित सिद्ध प्रसाद एवं रक्षा सूत्र आपके दिए गए पते पर कुरियर द्वारा भेजा जाएगा।' }
              ].map((item, index) => (
                <div key={index} className="relative bg-amber-50/40 p-6 rounded-xl border border-amber-200/70 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-black text-rose-900/20 font-serif">{item.step}</span>
                    <div className="w-8 h-8 rounded-full bg-rose-900 text-amber-300 flex items-center justify-center font-bold text-xs shadow-sm">
                      ✓
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">{item.title}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Temple / Pandits Details */}
        <section id="temple" className="scroll-mt-32">
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-100 pb-6">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-rose-900 font-bold text-xs tracking-widest uppercase">पवित्र स्थान व आचार्य</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {puja.location || 'विशेष सिद्ध शक्तिपीठ एवं मंदिर परिसर'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm">
                  संस्कृत विश्वविद्यालय एवं वेद पाठशाला से शिक्षित आचार्यों द्वारा अनुष्ठान
                </p>
              </div>
              <Badge className="bg-amber-500 text-slate-950 font-black px-4 py-2 text-sm border-none shadow-md shrink-0">
                Verified Vedic Gurus
              </Badge>
            </div>

            {/* Assigned Pandit Details Showcase Card with Uploaded Photo */}
            {(() => {
              let assignedPandit: any = null
              if (puja?.customHtml) {
                try {
                  const parsed = JSON.parse(puja.customHtml)
                  if (parsed.assignedPandit) assignedPandit = parsed.assignedPandit
                } catch (e) {}
              }
              if (!assignedPandit && puja.assignedPandit) assignedPandit = puja.assignedPandit

              if (!assignedPandit || (!assignedPandit.name && !assignedPandit.photo)) return null

              return (
                <div className="p-5 rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-amber-50/80 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-amber-500 bg-amber-100 shrink-0 shadow-md">
                    <img 
                      src={getSafeImageUrl(assignedPandit.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80')} 
                      alt={assignedPandit.name || 'मुख्य आचार्य'} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>

                  <div className="space-y-1 text-center sm:text-left flex-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                        मुख्य पीठाधीश्वर / आचार्य
                      </span>
                      {assignedPandit.experience && (
                        <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200">
                          {assignedPandit.experience}
                        </span>
                      )}
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-slate-900 pt-0.5">
                      {assignedPandit.name || 'पं. कन्हैया लाल दवे'}
                    </h4>

                    {assignedPandit.title && (
                      <p className="text-xs font-bold text-amber-800 font-serif">
                        {assignedPandit.title}
                      </p>
                    )}

                    {assignedPandit.location && (
                      <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-1 pt-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>{assignedPandit.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              )
            })()}

            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <ShieldCheck className="w-6 h-6 text-rose-900 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-800">शुद्ध वैदिक परम्परा</p>
                <p className="text-xs text-slate-500 mt-1">मंत्रोच्चार एवं विधि-विधान की 100% शुद्धता</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <PhoneCall className="w-6 h-6 text-rose-900 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-800">समर्पित सहायता</p>
                <p className="text-xs text-slate-500 mt-1">पूजा सम्पादन तक लगातार WhatsApp अपडेट</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Gift className="w-6 h-6 text-rose-900 mx-auto mb-2" />
                <p className="font-bold text-sm text-slate-800">सुरक्षित प्रसाद पैकिंग</p>
                <p className="text-xs text-slate-500 mt-1">हाईजीनिक एवं वाटरप्रूफ सुरक्षा बॉक्स</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Live Videos & Glimpses (Rendered dynamically if videos are attached) */}
        {puja.videos && puja.videos.length > 0 && (
          <section id="media" className="scroll-mt-32">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-rose-900 font-bold text-xs tracking-widest uppercase bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                प्रत्यक्ष प्रमाण
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-rose-950 uppercase tracking-wide mt-2">
                पूजा एवं हवन की दिव्य झलकियां
              </h2>
              <div className="w-16 h-1 bg-amber-500 mx-auto mt-3 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {puja.videos.map((vid: any, idx: number) => {
                const embedUrl = getYouTubeEmbedUrl(vid.url) || vid.url;
                return (
                  <div key={vid.id || idx} className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-rose-950/10 bg-slate-900 relative">
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

        {/* Custom HTML / JS / Embed Code Section (Rendered ONLY if user provided actual HTML/Embed code, never for raw assignedPandit JSON) */}
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

      {/* 10. Floating Sticky Mobile/Desktop Bottom Bar - Non-overlapping */}
      <div className="fixed bottom-0 left-0 w-full p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-base font-black text-slate-900 truncate max-w-md">{puja.name}</p>
            <p className="text-xs font-bold text-rose-900">
              चयनित पैकेज: <span className="text-emerald-700 font-extrabold">{currentSelectedPkgObj?.name} (₹{Number(currentSelectedPkgObj?.price).toLocaleString()})</span>
            </p>
          </div>
          <div className="w-full md:w-auto flex items-center gap-3 justify-between">
            <div className="md:hidden flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">पूजा संकल्प शुल्क:</span>
              <span className="text-lg font-black text-rose-900">
                ₹{Number(currentSelectedPkgObj?.price).toLocaleString()}
              </span>
            </div>
            <Button 
              onClick={() => handleBookNow()}
              className="w-auto px-6 sm:px-10 h-12 text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-black shadow-lg transition-transform active:scale-95 uppercase tracking-wider rounded-xl border-b-4 border-emerald-800 shrink-0"
            >
              पूजा बुक करें (Book Now)
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

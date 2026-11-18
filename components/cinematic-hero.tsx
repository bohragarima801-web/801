'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, ArrowRight, ChevronDown } from 'lucide-react'

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4'
const POSTER_URL = '/katyayani_yagya_hero.webp'

export function CinematicHero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoOpacity, setVideoOpacity] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop, { passive: true })
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  useEffect(() => {
    if (!isMounted || !isDesktop) return
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      try {
        if (!video.duration) return
        const timeLeft = video.duration - video.currentTime

        if (timeLeft <= 0.6) {
          setVideoOpacity(Math.max(0, timeLeft / 0.6))
        } else if (video.currentTime <= 0.5) {
          setVideoOpacity(Math.min(1, video.currentTime / 0.5))
        } else {
          setVideoOpacity(1)
        }
      } catch {}
    }

    const handleEnded = () => {
      try {
        setVideoOpacity(0)
        setTimeout(() => {
          if (video) {
            video.currentTime = 0
            video.play().catch(() => {})
            setVideoOpacity(1)
          }
        }, 120)
      } catch {}
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
    }
  }, [isMounted, isDesktop])

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#151311] text-[#F8F4EC] notranslate" translate="no">
      {/* ── 1. CINEMATIC VIDEO / FAST POSTER BACKGROUND ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Instant WebP Poster — Always rendered first to guarantee 0ms blank flash */}
        <Image
          src={POSTER_URL}
          alt="DivyaYagyam Sacred Vedic Pujas"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="object-cover object-center"
        />

        {/* Desktop-only Video stream — Prevents mobile 15MB bandwidth exhaustion & video stutter */}
        {isMounted && isDesktop && (
          <video
            ref={videoRef}
            src={VIDEO_URL}
            poster={POSTER_URL}
            autoPlay
            muted
            playsInline
            loop={false}
            preload="auto"
            className="hidden md:block absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-500 ease-out"
            style={{ opacity: videoOpacity }}
          />
        )}

        {/* ── 2. MULTI-LAYER CINEMATIC GRADIENT OVERLAYS ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#151311]/90 via-[#151311]/45 to-[#151311]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,92,36,0.18)_0%,rgba(21,19,17,0.75)_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-32 bg-gradient-to-t from-[#151311] to-transparent" />
      </div>

      {/* ── 3. HERO CONTENT CONTAINER (Optimized for Mobile Viewport) ── */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-10 sm:py-20 lg:py-28 text-center flex flex-col items-center justify-center">
        
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#7A1F2B]/40 border border-[#C89B3C]/50 text-[#E2C46B] text-[11px] sm:text-sm font-semibold tracking-wide backdrop-blur-md mb-4 sm:mb-6 shadow-sm">
          <span className="text-[#E2C46B] text-xs sm:text-sm">ॐ</span>
          <span>सनातन वैदिक परंपरा • सिद्ध शक्तिपीठ अनुष्ठान</span>
        </div>

        {/* Primary Hindi Master Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.18] sm:leading-[1.12] max-w-4xl mb-3 sm:mb-6 drop-shadow-lg" style={{ fontFamily: "'Cinzel', 'Noto Serif Devanagari', 'Georgia', serif" }}>
          शुद्ध मंत्रों से <br className="sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF9F1] via-[#E2C46B] to-[#C89B3C]">
            आपके संकल्प तक
          </span>
        </h1>

        {/* Supporting Concise Line */}
        <p className="text-xs sm:text-base md:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed mb-6 sm:mb-10 text-balance drop-shadow-sm px-2">
          शास्त्रोक्त विधि, अनुभवी आचार्यों और श्रद्धापूर्वक सम्पन्न वैदिक अनुष्ठानों के साथ अपने संकल्प को दिव्य सेवा से जोड़ें।
        </p>

        {/* Dual Primary CTA Buttons (Above the Fold on Mobile) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mb-6 sm:mb-10 px-2">
          {/* Primary CTA */}
          <Link
            href="#featured-pujas"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#7A1F2B] to-[#52131D] hover:from-[#52131D] hover:to-[#380b13] text-white font-bold text-xs sm:text-base border border-[#C89B3C]/50 shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all duration-200 shrink-0 tracking-wide min-h-[46px]"
          >
            <span>🔱 पूजा बुक करें</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Secondary WhatsApp Support CTA */}
          <a
            href="https://wa.me/919530401984?text=जय%20श्री%20राम!%20मुझे%20पूजा%20बुकिंग%20व%20संकल्प%20के%20विषय%20में%20जानकारी%20चाहिए।"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs sm:text-base backdrop-blur-md active:scale-[0.98] transition-all duration-200 shrink-0 min-h-[46px]"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <span>WhatsApp पर पूछें</span>
          </a>
        </div>

        {/* Micro-Trust Line */}
        <div className="flex flex-wrap items-center justify-center gap-x-3.5 sm:gap-x-6 gap-y-1.5 text-[11px] sm:text-sm text-zinc-400 font-medium px-2">
          <span className="flex items-center gap-1 sm:gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#C89B3C]" /> शास्त्रोक्त विधि
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#C89B3C]" /> अनुभवी आचार्य
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#C89B3C]" /> सुरक्षित ऑनलाइन भुगतान
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#C89B3C]" /> WhatsApp सहायता
          </span>
        </div>

      </div>

      {/* Subtle Scroll Indicator */}
      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-zinc-400 text-xs pointer-events-none opacity-80">
        <span>नीचे देखें</span>
        <ChevronDown className="h-4 w-4 animate-bounce text-[#C89B3C]" />
      </div>
    </section>
  )
}

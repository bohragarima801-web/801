'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, Sparkles } from 'lucide-react'

export interface HeroSlide {
  id: string
  title: string
  subtitle?: string | null
  image: string
  ctaText?: string | null
  ctaUrl?: string | null
  link?: string | null
  buttonText?: string | null
}

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    title: 'माँ अष्टलक्ष्मी 16 दिवसीय महा अनुष्ठान एवं सर्व कर्ज मुक्ति महायज्ञ',
    subtitle: 'Chamunda Mata Temple, Jodhpur',
    image: '/ashta_lakshmi_16days.webp',
    ctaText: 'Book Anushthan',
    ctaUrl: '/pujas/maa-ashta-lakshmi-karz-mukti-puja'
  },
  {
    id: 'slide-2',
    title: 'माँ बगलामुखी मिर्ची हवन एवं सर्व कार्य सिद्धि महायज्ञ',
    subtitle: 'Mata Baglamukhi Dham, Datia',
    image: '/bagalamukhi_kavach_yagya.webp',
    ctaText: 'Participate Now',
    ctaUrl: '/pujas/maa-bagalamukhi-mirchi-hawan'
  },
  {
    id: 'slide-3',
    title: 'काशी विश्वनाथ महामृत्युंजय सवा लाख मंत्र जाप एवं रुद्राभिषेक',
    subtitle: 'Kashi Vishwanath Temple, Varanasi',
    image: '/mahamrityunjaya_hawan.webp',
    ctaText: 'Book Puja',
    ctaUrl: '/pujas/mahamrityunjaya-jaap-rudrabhishekam'
  },
  {
    id: 'slide-4',
    title: 'शनि साढ़ेसाती, ढैय्या व शनि दोष निवारण महापूजा एवं शांति यज्ञ',
    subtitle: 'Sacred Dham Anushthan',
    image: '/shani_dosh_yagya.webp',
    ctaText: 'View Details',
    ctaUrl: '/pujas/shani-saadesati-dhaiya-dosh-nivaran-yagya'
  }
]

export function HeroPujaSlider({ slides = [] }: { slides?: HeroSlide[]; children?: React.ReactNode }) {
  const slideList = slides && slides.length > 0 ? slides : defaultHeroSlides
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  // Automatic slide rotation every 4 seconds
  useEffect(() => {
    if (slideList.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slideList.length, isPaused])

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentIndex((prev) => (prev + 1) % slideList.length)
  }

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentIndex((prev) => (prev - 1 + slideList.length) % slideList.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true)
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) {
      setIsPaused(false)
      return
    }
    const distance = touchStartX.current - touchEndX.current
    if (distance > 40) {
      setCurrentIndex((prev) => (prev + 1) % slideList.length)
    } else if (distance < -40) {
      setCurrentIndex((prev) => (prev - 1 + slideList.length) % slideList.length)
    }
    touchStartX.current = null
    touchEndX.current = null
    setIsPaused(false)
  }

  if (slideList.length === 0) return null

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full aspect-[16/10] sm:aspect-[21/9] md:aspect-[24/9] min-h-[220px] sm:min-h-[280px] overflow-hidden rounded-2xl md:rounded-3xl bg-slate-950 shadow-2xl border border-[#F3E8DE] dark:border-gray-800 select-none group"
    >
      {/* Slides Loop */}
      {slideList.map((slide, idx) => {
        const isActive = currentIndex === idx
        const targetUrl = slide.ctaUrl || slide.link || '/pujas'
        const buttonLabel = slide.ctaText || slide.buttonText || 'Book Puja'

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Link href={targetUrl} className="block w-full h-full relative group/link">
              {/* Background Banner Image */}
              <Image
                src={slide.image || '/katyayani_yagya_hero.webp'}
                alt={slide.title || 'Sacred Puja Banner'}
                fill
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
                unoptimized
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover/link:scale-105"
              />

              {/* ── 1. DARK SEMI-TRANSPARENT MULTI-LAYER GRADIENT OVERLAY ── */}
              {/* Dark Gradient Bottom-to-Top (Mobile & Desktop) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none z-10" />
              {/* Dark Gradient Left-to-Right Accent (Desktop) */}
              <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent pointer-events-none z-10" />

              {/* ── 2. HIGH-CONTRAST ALWAYS-VISIBLE TEXT OVERLAY CONTAINER ── */}
              {slide.title && (
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 md:p-6 z-20 flex flex-col justify-end">
                  <div className="max-w-2xl bg-black/65 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 text-white shadow-2xl space-y-2 text-left">
                    
                    {/* Subtitle / Location Badge */}
                    {slide.subtitle && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF7A00]/25 border border-[#FF7A00]/50 text-[#FF7A00] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
                        <MapPin className="h-3 w-3 text-[#FF7A00] shrink-0" />
                        <span className="line-clamp-1">{slide.subtitle}</span>
                      </div>
                    )}

                    {/* Main Title Heading (Explicit High Contrast White Text) */}
                    <h3 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-heading font-extrabold text-white leading-snug drop-shadow-md line-clamp-2">
                      {slide.title}
                    </h3>

                    {/* CTA Button Badge */}
                    <div className="pt-1 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white text-[11px] sm:text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-lg group-hover/link:brightness-110 transition-all">
                        <span>{buttonLabel}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>

                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-amber-300 font-bold">
                        <Sparkles className="h-3 w-3" /> Live Sankalp Seva
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </Link>
          </div>
        )
      })}

      {/* ── 3. NAVIGATION ARROWS (Z-INDEX 30) ── */}
      {slideList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/65 hover:bg-[#FF7A00] text-white flex items-center justify-center backdrop-blur-md transition-all z-30 border border-white/20 shadow-xl"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-black/65 hover:bg-[#FF7A00] text-white flex items-center justify-center backdrop-blur-md transition-all z-30 border border-white/20 shadow-xl"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* ── 4. INDICATOR DOTS (Z-INDEX 30) ── */}
      {slideList.length > 1 && (
        <div className="absolute top-3 right-3 sm:bottom-3 sm:top-auto sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-1.5 z-30 pointer-events-auto">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(idx)
              }}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-6 h-2 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] shadow-md'
                  : 'w-2 h-2 bg-white/70 hover:bg-white'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

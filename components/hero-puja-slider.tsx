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
      className="relative w-full aspect-[16/9] sm:aspect-[16/8] md:h-[440px] overflow-hidden rounded-2xl md:rounded-3xl bg-slate-950 shadow-2xl border border-[#F3E8DE] dark:border-gray-800 select-none group flex items-center"
    >
      {/* Slides Loop */}
      {slideList.map((slide, idx) => {
        const isActive = currentIndex === idx
        const targetUrl = slide.ctaUrl || slide.link || '/pujas'
        const buttonLabel = slide.ctaText || slide.buttonText || 'Book Puja'

        return (
          <div
            key={slide.id || idx}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out flex items-center justify-center ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Link href={targetUrl} className="block w-full h-full relative group/link">
              {/* Background Blur Fill (Eliminates black borders) */}
              <Image
                src={slide.image || '/katyayani_yagya_hero.webp'}
                alt=""
                fill
                aria-hidden="true"
                unoptimized
                className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-60 scale-110 pointer-events-none"
              />

              {/* Main Edge-to-Edge Banner Image */}
              <Image
                src={slide.image || '/katyayani_yagya_hero.webp'}
                alt={slide.title || 'Sacred Puja Banner'}
                fill
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
                unoptimized
                className="relative z-10 w-full h-full object-cover object-center transition-transform duration-1000 group-hover/link:scale-[1.02]"
              />

              {/* Subtle Bottom Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-10" />
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

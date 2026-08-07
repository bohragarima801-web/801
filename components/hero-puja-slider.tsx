'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

  // Automatic slide rotation every 3.5 seconds
  useEffect(() => {
    if (slideList.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length)
    }, 3500)
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
      className="relative w-full aspect-[16/8] sm:aspect-[21/9] md:aspect-[24/9] overflow-hidden rounded-2xl md:rounded-3xl bg-[#1E0C07] shadow-xl border border-[#F5E2B8] select-none group"
    >
      {/* Slides */}
      {slideList.map((slide, idx) => {
        const isActive = currentIndex === idx
        const targetUrl = slide.ctaUrl || slide.link || '/pujas'

        return (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <Link href={targetUrl} className="block w-full h-full relative">
              <Image
                src={slide.image || '/katyayani_yagya_hero.webp'}
                alt={slide.title || 'Sacred Puja Banner'}
                fill
                priority={idx === 0}
                loading={idx === 0 ? 'eager' : 'lazy'}
                unoptimized
                className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Bottom Subtle Shadow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

              {/* Optional Slide Content overlay */}
              {slide.title && (
                <div className="absolute bottom-6 left-6 right-6 z-20 hidden sm:block">
                  <div className="max-w-xl bg-black/40 backdrop-blur-md border border-amber-400/30 rounded-2xl p-4 text-white shadow-lg">
                    {slide.subtitle && (
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
                        📍 {slide.subtitle}
                      </span>
                    )}
                    <h3 className="text-lg md:text-xl font-bold font-heading line-clamp-1">
                      {slide.title}
                    </h3>
                  </div>
                </div>
              )}
            </Link>
          </div>
        )
      })}

      {/* Navigation Arrows */}
      {slideList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-[#8B1A21] text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30 border border-white/20 shadow-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-[#8B1A21] text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-30 border border-white/20 shadow-md"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Bottom Center Indicator Dots (Sri Mandir Style) */}
      {slideList.length > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 z-30 pointer-events-auto">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(idx)
              }}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-7 h-2.5 bg-[#D49B00] shadow-md'
                  : 'w-2.5 h-2.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

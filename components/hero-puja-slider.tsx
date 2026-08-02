'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react'

interface HeroSlide {
  id: string
  title: string
  subtitle?: string | null
  image: string
  ctaText?: string | null
  ctaUrl?: string | null
}

export function HeroPujaSlider({ slides, children }: { slides?: HeroSlide[], children?: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slideList = slides && slides.length > 0 ? slides : [
    {
      id: 'default-1',
      title: 'सावन महा रुद्राभिषेक पूजा - काशी विश्वनाथ मंदिर',
      subtitle: 'घर बैठे अपनी नाम और गोत्र से पवित्र मंदिर में करवाएं पूजा',
      image: 'https://srimandirweb.s3.ap-south-1.amazonaws.com/Hero_banner_4dd7f4c5aa.webp',
      ctaText: 'पूजा में भाग लें',
      ctaUrl: '/pujas',
    },
    {
      id: 'default-2',
      title: 'महाकालेश्वर भस्म आरती एवं विशेष जाप',
      subtitle: 'उज्जैन ज्योतिर्लिंग से लाइव संकल्प और वीडियो प्रसाद सेवा',
      image: 'https://srimandirweb.s3.ap-south-1.amazonaws.com/Web_Hero_3_88abdf752f.webp',
      ctaText: 'विशेष सेवा देखें',
      ctaUrl: '/pujas',
    },
  ]

  useEffect(() => {
    if (slideList.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length)
    }, 4500) // Optimal 4.5 seconds rotation speed
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

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/9] min-h-[260px] md:min-h-[380px] grid grid-cols-1 grid-rows-1 overflow-hidden bg-slate-950 select-none rounded-3xl group shadow-2xl border border-amber-500/20"
    >
      {/* Background Images Slider with smooth scale & crossfade */}
      {slideList.map((slide, idx) => {
        const isActive = currentIndex === idx
        const slideContent = (
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title || 'Sacred Banner'}
              fill
              priority={idx === 0}
              quality={90}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className={`w-full h-full object-cover object-center transition-transform duration-1000 ${
                isActive ? 'scale-100' : 'scale-105'
              }`}
            />
            {/* Subtle soft gradient overlay only behind text for maximum image clarity and zero blackness */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-10" />
          </div>
        )

        return (
          <div
            key={slide.id || idx}
            className={`col-start-1 row-start-1 w-full h-full transition-all duration-700 ease-in-out ${
              isActive
                ? 'opacity-100 z-10 pointer-events-auto scale-100'
                : 'opacity-0 z-0 pointer-events-none scale-102'
            }`}
          >
            {slide.ctaUrl ? (
              <Link href={slide.ctaUrl} prefetch={true} className="block w-full h-full relative group/slide">
                {slideContent}

                {/* Banner Text Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-8 md:p-12 max-w-2xl space-y-2">
                  {slide.subtitle && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-slate-950 backdrop-blur-md w-fit shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" /> {slide.subtitle}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">
                    {slide.title}
                  </h3>
                </div>
              </Link>
            ) : (
              <div className="relative w-full h-full">
                {slideContent}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-8 md:p-12 max-w-2xl space-y-2">
                  {slide.subtitle && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-slate-950 backdrop-blur-md w-fit shadow-sm">
                      <Sparkles className="h-3.5 w-3.5" /> {slide.subtitle}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl md:text-4xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">
                    {slide.title}
                  </h3>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Optional Children Overlay */}
      {children && (
        <div className="relative z-20 w-full pointer-events-none [&>*]:pointer-events-auto h-full flex items-center">
          {children}
        </div>
      )}

      {/* Left / Right Arrow Controls */}
      {slideList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/40 hover:bg-amber-600 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 z-30 border border-white/20 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/40 hover:bg-amber-600 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 z-30 border border-white/20 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Bottom Pagination Dots with Progress Bar styling */}
      {slideList.length > 1 && (
        <div className="absolute bottom-4 right-6 md:right-10 flex items-center gap-2 z-30">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(idx)
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentIndex === idx
                  ? 'w-8 bg-amber-400 shadow-md ring-2 ring-amber-400/50'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

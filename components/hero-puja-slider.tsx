'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

interface HeroSlide {
  id: string
  title: string
  subtitle?: string | null
  image: string
  ctaText?: string | null
  ctaUrl?: string | null
  link?: string | null
  buttonText?: string | null
}

export function HeroPujaSlider({ slides, children }: { slides?: HeroSlide[], children?: React.ReactNode }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  
  // Touch swipe handling
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const slideList: HeroSlide[] = slides && slides.length > 0 ? slides : []


  useEffect(() => {
    if (slideList.length <= 1 || isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideList.length)
    }, 4500)
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
    const isLeftSwipe = distance > 40
    const isRightSwipe = distance < -40

    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % slideList.length)
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + slideList.length) % slideList.length)
    }

    touchStartX.current = null
    touchEndX.current = null
    setIsPaused(false)
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/10] min-h-[260px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[440px] grid grid-cols-1 grid-rows-1 overflow-hidden bg-slate-950 select-none rounded-2xl md:rounded-3xl group shadow-2xl border border-amber-500/20"
    >
      {/* Background Images Slider with HD unoptimized rendering */}
      {slideList.map((slide, idx) => {
        const isActive = currentIndex === idx
        const targetUrl = slide.ctaUrl || slide.link
        const buttonLabel = slide.ctaText || slide.buttonText

        const slideContent = (
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={slide.title || 'Sacred Banner'}
              fill
              priority={idx === 0}
              unoptimized
              sizes="100vw"
              className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                isActive ? 'scale-100' : 'scale-105'
              }`}
            />
            {/* Soft gradient overlay for text readability without obscuring full image clarity */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent z-10" />
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
            {targetUrl ? (
              <Link href={targetUrl} prefetch={true} className="block w-full h-full relative group/slide">
                {slideContent}

                {/* Banner Text Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-8 md:p-12 max-w-2xl space-y-2 sm:space-y-3">
                  {slide.subtitle && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-500/90 text-slate-950 backdrop-blur-md w-fit shadow-md">
                      <Sparkles className="h-3.5 w-3.5" /> {slide.subtitle}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">
                    {slide.title}
                  </h3>
                  {buttonLabel && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg group-hover/slide:scale-105 transition-transform duration-300">
                        {buttonLabel} &rarr;
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="relative w-full h-full">
                {slideContent}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-8 md:p-12 max-w-2xl space-y-2 sm:space-y-3">
                  {slide.subtitle && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-500/90 text-slate-950 backdrop-blur-md w-fit shadow-md">
                      <Sparkles className="h-3.5 w-3.5" /> {slide.subtitle}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-extrabold text-white leading-tight drop-shadow-lg">
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

      {/* Left / Right Arrow Controls - Visible on touch & desktop hover */}
      {slideList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/50 hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-70 sm:opacity-0 group-hover:opacity-100 z-30 border border-white/20 shadow-xl"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/50 hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-70 sm:opacity-0 group-hover:opacity-100 z-30 border border-white/20 shadow-xl"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        </>
      )}

      {/* Bottom Pagination Indicators */}
      {slideList.length > 1 && (
        <div className="absolute bottom-4 right-4 sm:right-8 flex items-center gap-2 z-30">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(idx)
              }}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                currentIndex === idx
                  ? 'w-8 bg-amber-400 shadow-lg ring-2 ring-amber-400/50'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}


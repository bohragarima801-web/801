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
    }, 5000)
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

  if (slideList.length === 0) return null

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/10] min-h-[240px] sm:min-h-[320px] md:min-h-[380px] lg:min-h-[420px] grid grid-cols-1 grid-rows-1 overflow-hidden bg-slate-950 select-none rounded-2xl md:rounded-3xl group shadow-2xl border border-amber-500/20"
    >
      {/* Background Images Slider */}
      {slideList.map((slide, idx) => {
        const isActive = currentIndex === idx
        const targetUrl = slide.ctaUrl || slide.link
        const buttonLabel = slide.ctaText || slide.buttonText

        // Check if title is custom readable text (not raw filename or blank)
        const isRawFilename = slide.title && (slide.title.includes('.') || slide.title.includes('/') || /^\d+$/.test(slide.title.replace(/\D/g, '')))
        const hasTitle = slide.title && slide.title.trim().length > 0 && !isRawFilename && slide.title !== 'Special Event'
        const hasSubtitle = slide.subtitle && slide.subtitle.trim().length > 0 && slide.subtitle !== 'DivyaYagyam Special'
        const hasCustomText = hasTitle || hasSubtitle

        const slideContent = (
          <div className="relative w-full h-full">
            <Image
              src={slide.image}
              alt={hasTitle ? slide.title : 'DivyaYagyam Sacred Puja Banner'}
              fill
              priority={idx === 0}
              unoptimized
              sizes="100vw"
              className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                isActive ? 'scale-100' : 'scale-105'
              }`}
            />
            {/* Subtle bottom-only gradient overlay for text readability without darkening the whole image */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/25 to-transparent z-10 pointer-events-none" />
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
              <Link
                href={targetUrl}
                prefetch={true}
                className="block w-full h-full relative group/slide"
                aria-label={hasTitle ? slide.title : 'View Sacred Service'}
              >
                {slideContent}

                {/* Banner Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 md:p-8 max-w-xl">
                  {hasCustomText ? (
                    <div className="bg-slate-950/40 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-2xl space-y-2 shadow-2xl">
                      {hasSubtitle && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500 text-slate-950 shadow-sm w-fit">
                          <Sparkles className="h-3 w-3" /> {slide.subtitle}
                        </span>
                      )}
                      {hasTitle && (
                        <h3 className="text-base sm:text-xl md:text-2xl font-heading font-extrabold text-white leading-tight drop-shadow-md">
                          {slide.title}
                        </h3>
                      )}
                      {buttonLabel && (
                        <div>
                          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg group-hover/slide:scale-105 transition-transform duration-300">
                            {buttonLabel} &rarr;
                          </span>
                        </div>
                      )}
                    </div>
                  ) : buttonLabel ? (
                    <div>
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xl group-hover/slide:scale-105 transition-transform duration-300">
                        {buttonLabel} &rarr;
                      </span>
                    </div>
                  ) : null}
                </div>
              </Link>
            ) : (
              <div className="relative w-full h-full">
                {slideContent}
                {hasCustomText && (
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 md:p-8 max-w-xl">
                    <div className="bg-slate-950/40 backdrop-blur-md border border-white/10 p-3 sm:p-4 rounded-2xl space-y-2 shadow-2xl">
                      {hasSubtitle && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500 text-slate-950 shadow-sm w-fit">
                          <Sparkles className="h-3 w-3" /> {slide.subtitle}
                        </span>
                      )}
                      {hasTitle && (
                        <h3 className="text-base sm:text-xl md:text-2xl font-heading font-extrabold text-white leading-tight drop-shadow-md">
                          {slide.title}
                        </h3>
                      )}
                    </div>
                  </div>
                )}
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

      {/* Left / Right Navigation Arrows */}
      {slideList.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-slate-950/60 hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-80 sm:opacity-0 group-hover:opacity-100 z-30 border border-white/20 shadow-2xl"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-slate-950/60 hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center backdrop-blur-md transition-all duration-300 opacity-80 sm:opacity-0 group-hover:opacity-100 z-30 border border-white/20 shadow-2xl"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Bottom Pagination Indicators */}
      {slideList.length > 1 && (
        <div className="absolute bottom-3 right-4 sm:right-6 flex items-center gap-1.5 z-30">
          {slideList.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.preventDefault()
                setCurrentIndex(idx)
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentIndex === idx
                  ? 'w-7 bg-amber-400 shadow-md ring-1 ring-amber-400/50'
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

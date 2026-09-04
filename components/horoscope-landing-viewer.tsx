'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Sparkles, MessageCircle, ShieldCheck, ArrowRight, Compass } from 'lucide-react'
import type { HoroscopeCustomPage } from '@/lib/horoscope-pages'

export function HoroscopeLandingViewer({ page }: { page: HoroscopeCustomPage }) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Inject & safely process pasted code
  useEffect(() => {
    if (!containerRef.current || !page.customCode) return

    // 1. Inject HTML safely
    containerRef.current.innerHTML = page.customCode

    // 2. Make all iframes responsive and prevent layout breaking
    const iframes = containerRef.current.querySelectorAll('iframe')
    iframes.forEach((iframe) => {
      iframe.classList.add('w-full', 'max-w-full', 'rounded-2xl')
      if (!iframe.style.maxWidth) iframe.style.maxWidth = '100%'
      if (!iframe.getAttribute('loading')) {
        iframe.setAttribute('loading', 'lazy')
      }
    })

    // 3. Make all images responsive
    const images = containerRef.current.querySelectorAll('img')
    images.forEach((img) => {
      img.classList.add('max-w-full', 'h-auto', 'rounded-xl')
    })

    // 4. Wrap tables in responsive scroll wrapper so margins don't break
    const tables = containerRef.current.querySelectorAll('table')
    tables.forEach((table) => {
      if (!table.parentElement?.classList.contains('table-responsive-wrapper')) {
        const wrapper = document.createElement('div')
        wrapper.className = 'table-responsive-wrapper w-full overflow-x-auto my-4 rounded-xl border border-[#E8DDD0]'
        table.parentNode?.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      }
    })

    // 5. Re-execute any embedded <script> tags for dynamic forms/widgets
    const scripts = containerRef.current.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [page.customCode])

  const waPhone = page.whatsappNumber || '919530401984'
  const waText = encodeURIComponent(`प्रणाम, मुझे "${page.title}" के बारे में जानकारी व परामर्श चाहिए।`)
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`

  return (
    <div className="min-h-screen bg-[#FFF9F1] text-[#241A18] notranslate selection:bg-[#7A1F2B]/10 overflow-x-hidden" translate="no">

      {/* Optional Divine Header Banner */}
      {page.headerBanner && (
        <section className="relative bg-gradient-to-b from-white via-[#FFF9F1] to-[#FFF9F1] py-10 md:py-16 border-b border-[#E8DDD0] overflow-hidden">
          <div aria-hidden="true" className="absolute right-0 top-0 text-[24vw] font-serif text-[#C89B3C]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6ED] border border-[#E8DDD0] text-[#7A1F2B] text-xs font-black tracking-wide shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
              <span>DIVYAYAGYAM VEDIC ASTROLOGY & HOROSCOPE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#241A18] leading-tight font-heading">
              {page.title}
            </h1>

            {page.subtitle && (
              <p className="text-sm sm:text-base text-[#6F625D] max-w-2xl mx-auto font-medium leading-relaxed">
                {page.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-[#241A18]">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E8DDD0] shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% शास्त्रोक्त गणना
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E8DDD0] shadow-2xs">
                <Compass className="h-3.5 w-3.5 text-[#C89B3C]" /> प्रमाणित ज्योतिषाचार्य
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area — Layout-Aware & Margin-Protected */}
      <main className="w-full">
        {page.layout === 'container' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="bg-white rounded-3xl border border-[#E8DDD0] shadow-[0_4px_24px_rgba(36,26,24,0.04)] p-5 sm:p-8 md:p-12 space-y-6 overflow-hidden">
              <div ref={containerRef} className="w-full prose max-w-none text-[#241A18] leading-relaxed" />
            </div>
          </div>
        ) : page.layout === 'fullwidth' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div ref={containerRef} className="w-full text-[#241A18] leading-relaxed" />
          </div>
        ) : (
          <div className="w-full px-3 sm:px-6 py-6 md:py-10">
            <div ref={containerRef} className="w-full text-[#241A18] leading-relaxed" />
          </div>
        )}
      </main>

      {/* Optional Sticky WhatsApp Action Bar */}
      {page.showBookingBar && (
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DDD0] p-3 sm:p-4 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-[#241A18]">{page.title}</span>
              <span className="text-[11px] text-[#6F625D]">सीधे ज्योतिषाचार्य से WhatsApp पर मार्गदर्शन प्राप्त करें</span>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-95 ml-auto"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp पर परामर्श लें ➔</span>
            </a>
          </div>
        </div>
      )}

    </div>
  )
}

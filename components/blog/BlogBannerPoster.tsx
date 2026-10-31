import React from 'react'

interface BlogBannerPosterProps {
  title: string
  categoryName?: string
  excerpt?: string | null
  authorName?: string | null
  dateStr?: string | null
}

export function BlogBannerPoster({
  title,
  categoryName = 'वैदिक पूजा एवं अनुष्ठान',
  excerpt,
  authorName = 'आचार्य दिव्ययज्ञम्',
  dateStr,
}: BlogBannerPosterProps) {
  return (
    <div className="relative w-full max-w-4xl mx-auto my-8 rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-[#E2B765]/50 bg-[#0d0905]">
      {/* 16:9 Aspect Ratio Master Container */}
      <div className="relative w-full aspect-[16/9]">
        {/* Universal Brahma Muhurta Golden Temple Master 16:9 Image */}
        <img
          src="/blog-banner-template.webp"
          alt={title}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          loading="eager"
          decoding="async"
        />

        {/* Dynamic Title overlay precisely inside the top ornamental parchment box */}
        <div className="absolute top-[5%] sm:top-[6%] md:top-[7.5%] left-[22%] right-[22%] h-[18%] sm:h-[19%] md:h-[20%] flex items-center justify-center text-center px-2 sm:px-4 pointer-events-none">
          <h2 className="text-[#321808] font-serif font-black text-[11px] sm:text-sm md:text-lg lg:text-xl xl:text-2xl leading-tight sm:leading-snug drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] tracking-tight line-clamp-2 max-w-full">
            {title}
          </h2>
        </div>

        {/* Optional Category pill on bottom-left for extra context */}
        {categoryName && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-black/60 text-[#FFE28A] text-[9px] sm:text-xs font-semibold backdrop-blur-md border border-[#E5A638]/40 shadow-md">
              卐 {categoryName}
            </span>
          </div>
        )}

        {/* Date stamp on bottom-right */}
        {dateStr && (
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 pointer-events-none">
            <span className="px-2.5 py-1 rounded-full bg-black/60 text-white/80 text-[9px] sm:text-xs font-medium backdrop-blur-md border border-white/10 shadow-md">
              📅 {dateStr}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

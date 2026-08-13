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
    <div className="relative w-full max-w-2xl mx-auto my-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#E2B765]/40 bg-[#1A0B05]">
      {/* Aspect ratio container matching template 682x1024 (approx 2:3) */}
      <div className="relative w-full aspect-[682/1024]">
        {/* Base Template Image */}
        <img
          src="/blog-banner-template.webp"
          alt={title}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
          loading="eager"
          decoding="async"
        />

        {/* Dynamic Content Overlay in the empty bottom parchment frame */}
        <div className="absolute top-[47%] bottom-[7%] left-[8%] right-[8%] flex flex-col justify-between items-center text-center p-3 sm:p-5 md:p-6 overflow-hidden">
          
          {/* Top Decorative Header */}
          <div className="space-y-1 sm:space-y-1.5 w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-[#8B1A21]/10 border border-[#8B1A21]/25 text-[#8B1A21] text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider">
              <span>卐</span>
              <span>{categoryName}</span>
              <span>卐</span>
            </div>

            {/* Sacred Divider */}
            <div className="flex items-center justify-center gap-2 text-[#C47F00] text-[10px] sm:text-xs">
              <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-[#C47F00]" />
              <span>ॐ</span>
              <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-[#C47F00]" />
            </div>
          </div>

          {/* Main Blog Title */}
          <div className="my-auto px-1 sm:px-3">
            <h2 className="text-[#2A0E04] font-heading font-bold text-sm sm:text-lg md:text-xl lg:text-2xl leading-[1.3] line-clamp-4 drop-shadow-xs">
              {title}
            </h2>

            {excerpt && (
              <p className="mt-1.5 sm:mt-2.5 text-[#5A331A] text-[11px] sm:text-xs md:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 font-medium">
                {excerpt}
              </p>
            )}
          </div>

          {/* Bottom Footer Stamp */}
          <div className="w-full pt-1.5 sm:pt-2 border-t border-[#D4A843]/30 flex items-center justify-between text-[9px] sm:text-[11px] md:text-xs font-bold text-[#7A4B1A]">
            <span className="flex items-center gap-1">
              <span>🚩</span> {authorName || 'दिव्ययज्ञम्'}
            </span>
            {dateStr && (
              <span className="text-[#8B5A2B]">
                {dateStr}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { MapPin, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import { SacredImageFrame } from '@/components/ui/safe-image'

interface PujaCardProps {
  puja: {
    id: string
    name: string
    slug: string
    coverImage?: string | null
    location?: string | null
    pujaDate?: string | Date | null
    shortDescription?: string | null
    description?: string | null
    price?: number | string | null
    category?: { name: string } | null
    isVip?: boolean
    isSpecial?: boolean
    badge?: string | null
  }
  idx?: number
  hidePrice?: boolean
}

// Helper for date formatting
function formatPujaDate(rawDate?: string | Date | null): string {
  if (!rawDate) return 'Upcoming Auspicious Date'
  try {
    const d = new Date(rawDate)
    if (isNaN(d.getTime())) return 'Upcoming Auspicious Date'
    return d.toLocaleDateString('hi-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  } catch {
    return 'Upcoming Auspicious Date'
  }
}

export function PujaCard({ puja, idx = 0, hidePrice = false }: PujaCardProps) {
  const isFallback = puja.id.startsWith('fp-')
  const pujaHref = isFallback ? '/pujas' : `/pujas/${puja.slug}`
  const categoryName = puja.category?.name || 'Vedic Puja'
  const displayPrice = Number(puja.price || 1100).toLocaleString('en-IN')
  const formattedDate = formatPujaDate(puja.pujaDate)
  const cleanDescription = (puja.shortDescription || puja.description || 'Participate in this sacred ceremony for divine blessings.').replace(/<[^>]*>?/gm, '')

  const packagesList = (puja as any)?.packages
  const isVip1to1 = (packagesList && Array.isArray(packagesList) && packagesList.length === 1) || puja.isVip
  const themeClass = isVip1to1 ? 'vip-puja-theme' : 'simple-puja-theme'

  return (
    <article
      className={`group relative ${themeClass} bg-white rounded-card border border-[#E8DDD0] hover:border-[#7A1F2B]/60 transition-all duration-300 hover:-translate-y-1 shadow-card hover:shadow-medium flex flex-col justify-between overflow-hidden h-full reveal`}
    >
      {/* Top Image Frame (16:9 Ratio) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden shrink-0 bg-slate-900">
        <Link href={pujaHref} className="block relative w-full h-full overflow-hidden">
          <SacredImageFrame
            src={puja.coverImage || '/katyayani_yagya_hero.jpg'}
            alt={puja.name}
            aspectRatio="16/9"
            fitMode="cover"
            seoCategory="puja"
            className="p-0 border-none rounded-none w-full h-full bg-slate-900"
            imageClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Badge Tag */}
          {(puja.isVip || puja.isSpecial || puja.badge) && (
            <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wide uppercase backdrop-blur-md shadow-xs ${
                puja.isVip
                  ? 'bg-[#FAF6ED] text-[#9A7528] border border-[#C89B3C]'
                  : 'bg-[#7A1F2B] text-white border border-[#C89B3C]/40'
              }`}>
                {puja.isVip ? '👑 VIP अनुष्ठान' : puja.badge || '✨ विशेष सेवा'}
              </span>
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-[#241A18]/85 backdrop-blur-md text-[#FFF9F1] text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-white/15">
              {categoryName}
            </span>
          </div>
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-2">
          {/* Title in High Contrast Dark Charcoal */}
          <h3 className="font-bold text-base sm:text-lg text-[#241A18] line-clamp-2 leading-snug group-hover:text-[#7A1F2B] transition-colors font-heading">
            <Link href={pujaHref}>{puja.name}</Link>
          </h3>

          {/* Meta Details (Date & Location) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#6F625D]">
            {puja.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#C89B3C] shrink-0" />
                <span className="truncate max-w-[130px]">{puja.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#C89B3C] shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs text-[#6F625D] line-clamp-2 leading-relaxed font-normal">
            {cleanDescription}
          </p>
        </div>

        {/* Price & Primary Maroon CTA Button */}
        <div className="pt-3 border-t border-[#E8DDD0] space-y-2.5">
          {!hidePrice && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#6F625D] font-bold uppercase tracking-wide">प्रारंभिक दक्षिणा:</span>
              <span className="text-lg font-black text-[#241A18]">
                ₹{displayPrice}
              </span>
            </div>
          )}

          {/* Sacred Maroon CTA Button */}
          <Link
            href={pujaHref}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#7A1F2B] hover:bg-[#52131D] text-white font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm border border-[#C89B3C]/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>पूजा देखें एवं संकल्प करें</span>
            <span className="text-sm">➔</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

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
  if (!rawDate) return 'आगामी शुभ तिथि'
  try {
    const d = new Date(rawDate)
    if (isNaN(d.getTime())) return 'आगामी शुभ तिथि'
    return d.toLocaleDateString('hi-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  } catch {
    return 'आगामी शुभ तिथि'
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
      className={`group relative ${themeClass} bg-white rounded-2xl border border-[#E6D6BE] hover:border-[#E58A16] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_-2px_rgba(80,50,20,0.04)] hover:shadow-xl flex flex-col justify-between overflow-hidden h-full reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Badge Tag */}
          {(puja.isVip || puja.isSpecial || puja.badge) && (
            <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase backdrop-blur-md shadow-xs ${
                puja.isVip
                  ? 'bg-[#C99A3D] text-white border border-[#E6D6BE]'
                  : 'bg-[#6B2635] text-white border border-[#C99A3D]'
              }`}>
                {puja.isVip ? '👑 VIP अनुष्ठान' : puja.badge || '✨ विशेष सेवा'}
              </span>
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-[#292321]/80 backdrop-blur-md text-[#FFF9EF] text-[10px] font-bold px-2 py-0.5 rounded border border-white/10">
              {categoryName}
            </span>
          </div>
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 bg-white">
        <div className="space-y-2">
          {/* Title in High Contrast Dark Charcoal */}
          <h3 className="font-bold text-base sm:text-lg text-[#292321] line-clamp-2 leading-snug group-hover:text-[#E58A16] transition-colors">
            <Link href={pujaHref}>{puja.name}</Link>
          </h3>

          {/* Meta Details (Date & Location) */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#665E58]">
            {puja.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#C99A3D] shrink-0" />
                <span className="truncate max-w-[130px]">{puja.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#C99A3D] shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs text-[#665E58] line-clamp-2 leading-relaxed font-normal">
            {cleanDescription}
          </p>
        </div>

        {/* Price & Primary Saffron CTA Button */}
        <div className="pt-3 border-t border-[#E6D6BE] space-y-2.5">
          {!hidePrice && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#665E58] font-bold uppercase tracking-wide">न्यूनतम सहयोग:</span>
              <span className="text-lg font-black text-[#292321]">
                ₹{displayPrice}
              </span>
            </div>
          )}

          {/* Saffron CTA Button */}
          <Link
            href={pujaHref}
            className="w-full py-2.5 px-4 rounded-xl bg-[#E58A16] hover:bg-[#d4790e] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>पूजा विवरण देखें</span>
            <span className="text-sm">➔</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

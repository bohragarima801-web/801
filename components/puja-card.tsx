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
    <>
      {/* ── MOBILE COMPACT LIST CARD (< 640px) ─────────────────────────── */}
      <article
        className={`sm:hidden group relative ${themeClass} bg-white rounded-2xl border border-[#E6D6BE] hover:border-[#FF6600] shadow-xs active:scale-[0.98] transition-all duration-200 overflow-hidden p-2.5 flex items-center gap-3 w-full`}
      >
        {/* 80x80px Square Thumbnail */}
        <Link href={pujaHref} className="relative h-[80px] w-[80px] rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-[#EFE4D6] shadow-2xs">
          <img
            src={puja.coverImage || '/katyayani_yagya_hero.jpg'}
            alt={puja.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Micro VIP / Special Badge on Mobile Thumbnail */}
          {(puja.isVip || puja.isSpecial || puja.badge) && (
            <div className="absolute top-1 left-1">
              <span className={`px-1 py-0.2 rounded text-[8px] font-black tracking-tight uppercase ${
                puja.isVip ? 'bg-[#D4AF37] text-[#1C1614]' : 'bg-[#7A1521] text-white'
              }`}>
                {puja.isVip ? 'VIP' : 'विशेष'}
              </span>
            </div>
          )}
        </Link>

        {/* Center Details: Title clamped to 2 lines, Meta, Price */}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-black text-[13px] text-[#1C1614] leading-snug line-clamp-2 group-hover:text-[#FF6600] transition-colors">
            <Link href={pujaHref}>{puja.name}</Link>
          </h3>

          <div className="flex items-center gap-2 text-[10px] font-semibold text-[#6B5E57] truncate">
            {puja.location && (
              <span className="flex items-center gap-0.5 truncate">
                <MapPin className="h-3 w-3 text-[#D4AF37] shrink-0" />
                <span className="truncate">{puja.location}</span>
              </span>
            )}
            <span className="text-[#D4AF37]">•</span>
            <span>{formattedDate}</span>
          </div>

          {!hidePrice && (
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] text-[#6B5E57] font-bold">दक्षिणा:</span>
              <span className="text-xs font-black text-[#7A1521]">
                ₹{displayPrice} <span className="text-[9px] font-normal text-[#6B5E57]">से</span>
              </span>
            </div>
          )}
        </div>

        {/* Right: Compact "बुक करें" Saffron Button */}
        <Link
          href={pujaHref}
          className="h-9 px-3 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#FF8500] hover:from-[#E65C00] hover:to-[#FF6600] active:scale-95 text-white font-black text-[11px] shrink-0 flex items-center justify-center gap-1 shadow-xs transition-all whitespace-nowrap"
        >
          <span>बुक करें</span>
          <span className="text-xs">➔</span>
        </Link>
      </article>

      {/* ── DESKTOP & TABLET CINEMATIC CARD (>= 640px) ─────────────────── */}
      <article
        className={`hidden sm:flex group relative ${themeClass} bg-white rounded-2xl border border-[#E6D6BE] hover:border-[#FF6600] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_-2px_rgba(80,50,20,0.04)] hover:shadow-xl flex-col justify-between overflow-hidden h-full reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}
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
            <h3 className="font-bold text-base sm:text-lg text-[#292321] line-clamp-2 leading-snug group-hover:text-[#FF6600] transition-colors">
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

            {/* 3 High-Trust Micro-Bullets */}
            <div className="pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold text-[#7A1521]">
              <span className="inline-flex items-center gap-1 bg-[#FFF3E8] px-2 py-0.5 rounded-md border border-[#EFE4D6]">
                🕉️ नाम-गोत्र संकल्प
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FFF3E8] px-2 py-0.5 rounded-md border border-[#EFE4D6]">
                📹 व्हाट्सएप वीडियो
              </span>
              <span className="inline-flex items-center gap-1 bg-[#FFF3E8] px-2 py-0.5 rounded-md border border-[#EFE4D6]">
                📦 पावन प्रसाद
              </span>
            </div>
          </div>

          {/* Price & Primary Saffron CTA Button */}
          <div className="pt-3 border-t border-[#E6D6BE] space-y-2.5">
            {!hidePrice && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#665E58] font-bold">संकल्प दक्षिणा:</span>
                <span className="text-base sm:text-lg font-black text-[#292321]">
                  ₹{displayPrice} <span className="text-xs font-semibold text-[#665E58]">से शुरू</span>
                </span>
              </div>
            )}

            {/* High-Contrast Saffron CTA Button */}
            <Link
              href={pujaHref}
              className="w-full py-2.5 px-4 rounded-xl bg-[#FF6600] hover:bg-[#E65C00] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>पूजा व संकल्प देखें</span>
              <span className="text-sm">➔</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

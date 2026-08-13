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

export function PujaCard({ puja, idx = 0 }: PujaCardProps) {
  const isFallback = puja.id.startsWith('fp-')
  const pujaHref = isFallback ? '/pujas' : `/pujas/${puja.slug}`
  const categoryName = puja.category?.name || 'Vedic Puja'
  const displayPrice = Number(puja.price || 1100).toLocaleString('en-IN')
  const formattedDate = formatPujaDate(puja.pujaDate)
  const cleanDescription = (puja.shortDescription || puja.description || 'Participate in this sacred ceremony for divine blessings.').replace(/<[^>]*>?/gm, '')

  return (
    <article
      className={`group relative bg-white rounded-3xl border-2 border-[#F5E2B8] hover:border-[#FF6600] transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] hover:shadow-2xl flex flex-col justify-between overflow-hidden h-full reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}
    >
      {/* Top Image Frame with Rounded Aesthetics */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF9EE] p-2.5 shrink-0">
        <Link href={pujaHref} className="block relative w-full h-full rounded-2xl overflow-hidden shadow-inner">
          <SacredImageFrame
            src={puja.coverImage || '/katyayani_yagya_hero.jpg'}
            alt={puja.name}
            aspectRatio="4/3"
            seoCategory="puja"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C0604]/70 via-transparent to-transparent pointer-events-none" />

          {/* Badge Tag */}
          {(puja.isVip || puja.isSpecial || puja.badge) && (
            <div className="absolute top-2.5 left-2.5 z-10 flex gap-1.5 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase backdrop-blur-md shadow-md ${
                puja.isVip
                  ? 'bg-[#D49B00] text-[#2A1508] border border-[#F2C94C]'
                  : 'bg-[#8B1A21] text-white border border-[#D49B00]'
              }`}>
                {puja.isVip ? '👑 VIP ANUSHTHAN' : puja.badge || '✨ FEATURED SEVA'}
              </span>
            </div>
          )}

          {/* Category Tag */}
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="bg-[#2A1508]/85 backdrop-blur-md text-[#FFF3D6] text-[10px] font-bold px-2.5 py-1 rounded-lg border border-[#F5E2B8]/20 shadow-xs">
              {categoryName}
            </span>
          </div>
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4 bg-white">
        <div className="space-y-3">
          {/* Title in Prominent Serif Font + Dark Earthy Brown Color */}
          <h3 className="font-serif font-bold text-lg sm:text-xl text-[#2A1508] line-clamp-2 leading-snug group-hover:text-[#FF6600] transition-colors">
            <Link href={pujaHref}>{puja.name}</Link>
          </h3>

          {/* Meta Details (Date & Location) with Light Grey/Amber Icons */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-semibold text-[#6A4D3B]">
            {puja.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#FF6600] shrink-0" />
                <span className="truncate max-w-[140px]">{puja.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#FF6600] shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-xs text-[#5A4030] line-clamp-2 leading-relaxed font-medium">
            {cleanDescription}
          </p>
        </div>

        {/* Price & Solid Saffron-Orange Rectangular CTA Button */}
        <div className="pt-4 border-t border-[#F5E2B8] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#6A4D3B] font-extrabold uppercase tracking-wider">न्यूनतम सहयोग:</span>
            <span className="text-xl font-black text-[#8B1A21]">
              ₹{displayPrice}
            </span>
          </div>

          {/* Solid Vibrant Green Button taking full width */}
          <Link
            href={pujaHref}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-sm shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer active:scale-[0.98]"
          >
            <span>पूजा बुक करें (Book Now)</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </article>
  )
}


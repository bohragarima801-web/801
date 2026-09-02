'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Flame } from 'lucide-react'

export function MobileBottomNav() {
  const pathname = usePathname()

  // Hide sticky bottom bar on admin, checkout, or booking wizard pages to prevent form obstruction
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/bookings/new')
  ) {
    return null
  }

  // Pre-filled WhatsApp consultation message
  const waPrefill = encodeURIComponent(
    'प्रणाम पंडित जी, मुझे अपनी समस्या अनुसार पूजा संकल्प और शुभ अनुष्ठान के बारे में मार्गदर्शन चाहिए।'
  )
  const whatsappUrl = `https://wa.me/919530401984?text=${waPrefill}`

  // If on a specific puja page, book action links directly to packages or booking
  const isPujaDetail = pathname?.startsWith('/pujas/') && pathname !== '/pujas'
  const bookPujaHref = isPujaDetail ? '#packages' : '/pujas'

  return (
    <nav
      aria-label="Mobile Quick Conversion Bar"
      className="fixed bottom-0 left-0 right-0 z-[999] md:hidden bg-white/98 backdrop-blur-xl border-t border-[#EFE4D6] shadow-[0_-8px_32px_rgba(28,22,20,0.14)] px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] notranslate"
      translate="no"
    >
      <div className="flex items-center gap-2 max-w-md mx-auto h-[46px]">
        {/* Left Button (40% width): WhatsApp Assistance */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact WhatsApp Support"
          className="w-[40%] h-full flex items-center justify-center gap-1.5 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.97] text-white text-[12px] font-extrabold tracking-tight shadow-sm transition-all duration-150 shrink-0"
        >
          <MessageCircle className="h-4 w-4 fill-white/20 shrink-0" />
          <span className="truncate">WhatsApp सहायता</span>
        </a>

        {/* Right Button (60% width): Primary Puja Booking CTA */}
        <Link
          href={bookPujaHref}
          prefetch={true}
          aria-label="Book Vedic Puja Online"
          className="w-[60%] h-full flex items-center justify-center gap-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6F00] via-[#FF7E14] to-[#FF8C24] hover:from-[#E65C00] hover:to-[#FF6F00] active:scale-[0.97] text-white text-[13px] font-black tracking-wide shadow-[0_4px_16px_rgba(255,111,0,0.38)] transition-all duration-150 shrink-0 relative overflow-hidden"
        >
          {/* Pulsing Accent Dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300 shadow-xs" />
          </span>

          <Flame className="h-4 w-4 fill-white/20 shrink-0" />
          <span className="truncate">पूजा बुक करें</span>
          <span className="text-xs font-bold opacity-90">➔</span>
        </Link>
      </div>
    </nav>
  )
}

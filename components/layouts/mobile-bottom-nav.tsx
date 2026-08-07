'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sparkles, ShoppingBag, Flame, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  // Hide bottom nav on admin, checkout, or single puja detail pages where sticky booking bar exists
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/pujas/') || pathname?.startsWith('/checkout')) {
    return null
  }

  const navItems = [
    { label: 'मुख्य पृष्ठ', href: '/', icon: Home },
    { label: 'पूजाएं', href: '/pujas', icon: Flame },
    { label: 'स्टोर', href: '/products', icon: ShoppingBag },
    { label: 'ज्योतिष', href: '/tools', icon: Sparkles },
    { label: 'कार्ट', href: '/cart', icon: ShoppingCart, badge: totalItems },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FFFDF9]/95 dark:bg-[#120703]/95 backdrop-blur-xl border-t border-[#F5E2B8] dark:border-amber-900/30 shadow-[0_-4px_25px_rgba(42,21,8,0.12)] px-2 py-2 safe-area-padding">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`relative flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all duration-300 active:scale-95 ${

                isActive
                  ? 'text-[#8B1A21] dark:text-amber-400 font-black'
                  : 'text-[#6A4D3B]/80 dark:text-amber-200/60 hover:text-[#8B1A21] font-bold'
              }`}
            >
              {/* Active Tab Glow Indicator */}
              {isActive && (
                <span className="absolute -top-2 w-7 h-1 bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] rounded-full shadow-[0_2px_8px_rgba(139,26,33,0.5)]" />
              )}

              {/* Icon Container */}
              <div className="relative flex items-center justify-center h-6 w-6">
                <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110 text-[#8B1A21] dark:text-amber-400' : 'opacity-85'}`} />
                
                {/* Cart Badge Counter */}
                {typeof item.badge === 'number' && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-[9.5px] font-black h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span className={`text-[10.5px] leading-tight mt-1 tracking-tight text-center ${isActive ? 'font-extrabold text-[#8B1A21] dark:text-amber-400' : 'font-bold text-[#4A2D1B]'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

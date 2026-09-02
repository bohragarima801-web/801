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
    { label: 'Home', href: '/', icon: Home },
    { label: 'Pujas', href: '/pujas', icon: Flame },
    { label: 'Store', href: '/products', icon: ShoppingBag },
    { label: 'Tools', href: '/tools', icon: Sparkles },
    { label: 'Cart', href: '/cart', icon: ShoppingCart, badge: totalItems },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-xl border-t border-[#EFE4D6] shadow-[0_-4px_25px_rgba(28,22,20,0.08)] px-2 py-2 safe-area-padding notranslate" translate="no">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`relative flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-[#FF6600] font-black'
                  : 'text-[#6B5E57] hover:text-[#FF6600] font-bold'
              }`}
            >
              {/* Active Tab Indicator */}
              {isActive && (
                <span className="absolute -top-2 w-6 h-1 bg-gradient-to-r from-[#FF6600] to-[#FF8500] rounded-full shadow-[0_2px_8px_rgba(255,102,0,0.4)]" />
              )}

              {/* Icon Container */}
              <div className="relative flex items-center justify-center h-6 w-6">
                <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#FF6600]' : 'opacity-90'}`} />
                
                {/* Cart Badge Counter */}
                {typeof item.badge === 'number' && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#FF6600] to-[#FF8500] text-white text-[9px] font-black h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span className={`text-[10px] leading-tight mt-1 tracking-tight text-center ${isActive ? 'font-black text-[#FF6600]' : 'font-bold text-[#1C1614]'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Sparkles, ShoppingBag, Flame, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  // Hide bottom nav on admin routes
  if (pathname?.startsWith('/admin')) {
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
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-xl border-t border-border/80 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-2 py-1.5 safe-area-padding">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center w-full py-1.5 rounded-xl transition-all duration-300 active:scale-90 ${
                isActive
                  ? 'text-primary font-bold'
                  : 'text-muted-foreground hover:text-foreground font-medium'
              }`}
            >
              {/* Active Tab Glow Indicator */}
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-full shadow-[0_2px_8px_rgba(226,110,37,0.6)]" />
              )}

              {/* Icon Container */}
              <div className="relative flex items-center justify-center">
                <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110 text-primary' : 'opacity-80'}`} />
                
                {/* Cart Badge Counter */}
                {typeof item.badge === 'number' && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-primary text-primary-foreground text-[10px] font-black h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span className="text-[10px] leading-none mt-1 tracking-tight">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

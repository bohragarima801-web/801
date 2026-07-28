'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Calendar, ShoppingBag, Heart, MapPin, HeadphonesIcon,
  Bell, FileText, User as UserIcon, LogOut, Wallet, ScrollText, Home
} from 'lucide-react'

const items = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { title: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
  { title: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { title: 'Payments', href: '/dashboard/payments', icon: Wallet },
  { title: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { title: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { title: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { title: 'Support', href: '/dashboard/support', icon: HeadphonesIcon },
  { title: 'Profile', href: '/dashboard/profile', icon: UserIcon },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/60 bg-sidebar min-h-[calc(100vh-4rem)] sticky top-16">
      {/* Profile Quick Link */}
      <div className="p-4 border-b border-slate-200/60">
        <Link href="/dashboard/profile" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-orange-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
            👤
          </div>
          <span>My Account</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                active
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-200'
                  : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-slate-200/60 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Website
        </Link>
        <form action="/auth/signout" method="post">
          <button
            className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}

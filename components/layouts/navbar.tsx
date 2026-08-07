'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingBag, User, ChevronDown, Languages, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

const languages = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
]

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Pujas', href: '/pujas' },
  { title: 'VIP Pujas', href: '/vip-pujas' },
  { title: 'Products', href: '/products' },
  { title: 'BhaktiSeva', href: '/bhaktiseva' },
  { title: 'Blog', href: '/blog' },
]

const toolsMenu = [
  { title: 'Kundali', href: '/tools#kundali', desc: 'Birth chart & analysis', icon: '♑' },
  { title: 'Kundali Milan', href: '/tools#milan', desc: 'Marriage compatibility', icon: '♥' },
  { title: 'Panchang', href: '/tools#panchang', desc: 'Daily Hindu calendar', icon: '📅' },
  { title: 'Muhurat', href: '/tools#muhurat', desc: 'Auspicious timings', icon: '⏰' },
  { title: 'Numerology', href: '/tools#numerology', desc: 'Number-based insights', icon: '🔢' },
  { title: 'Ratna', href: '/tools#ratna', desc: 'Gemstone suggestion', icon: '💎' },
  { title: 'Mala Counter', href: '/tools#mala', desc: 'Digital jaap tracker', icon: '📿' },
]

export function Navbar({ user: initialUser, siteData }: { user?: any, siteData?: any } = {}) {
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(initialUser || null)
  const [userLoaded, setUserLoaded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)
  const { items } = useCart()
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  // Scroll detection for navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/profile')
      .then(res => {
        if (!res.ok) { setUserLoaded(true); return null }
        return res.json()
      })
      .then(data => {
        if (data?.ok && data.user) setUser(data.user)
        setUserLoaded(true)
      })
      .catch(() => setUserLoaded(true))
  }, [])

  useState(() => {
    if (typeof window !== 'undefined') {
      setCurrentLang(localStorage.getItem('lang') || 'en')
    }
  })

  const changeLang = (code: string) => {
    localStorage.setItem('lang', code)
    setCurrentLang(code)
    setLangOpen(false)
    window.location.reload()
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'navbar-scrolled' : 'navbar-spiritual'
      )}
    >
      {/* Top gold accent strip */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#A87C28]/50 to-transparent" />

      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className="nav-link-spiritual"
            >
              {item.title}
            </Link>
          ))}


          {/* Tools mega dropdown */}
          <div
            ref={toolsRef}
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <Link
              href="/tools"
              className="nav-link-spiritual flex items-center gap-1"
            >
              Tools
              <ChevronDown
                className={cn('h-3.5 w-3.5 opacity-50 transition-transform duration-200', toolsOpen && 'rotate-180')}
              />
            </Link>

            <div
              className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72 z-50 transition-all duration-200',
                toolsOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              )}
            >
              <div className="bg-white dark:bg-[#1A0B05] border border-[rgba(168,124,40,0.18)] rounded-2xl shadow-2xl p-2 ring-1 ring-black/5">
                {/* Gold top accent */}
                <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#A87C28]/40 to-transparent mb-2" />
                <div className="grid grid-cols-1 gap-0.5">
                  {toolsMenu.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[rgba(139,26,33,0.06)] dark:hover:bg-white/5 transition-colors group"
                    >
                      <span className="text-base w-6 text-center shrink-0 opacity-80">{t.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-[#1E120A] dark:text-[#F5EBDC] group-hover:text-[#8B1A21] dark:group-hover:text-[#E06070] transition-colors">{t.title}</div>
                        <div className="text-[11px] text-[#8B7355] dark:text-[rgba(245,235,220,0.55)] mt-0.5">{t.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            asChild
            className="relative rounded-full text-[#2A1508]/70 hover:text-[#8B1A21] hover:bg-[rgba(139,26,33,0.06)] transition-all"
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#8B1A21] to-[#B84430] text-[9px] font-bold text-white shadow-md ring-2 ring-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </Button>

          <ThemeToggle />

          {/* Language */}
          <div className="relative hidden sm:block">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-2.5 h-8 text-[#2A1508]/70 hover:text-[#8B1A21] hover:bg-[rgba(139,26,33,0.06)] rounded-lg text-xs font-semibold uppercase tracking-wide"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Languages className="h-3.5 w-3.5" />
              {currentLang}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-[#1A0B05] border border-[rgba(168,124,40,0.18)] rounded-xl shadow-xl p-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[rgba(139,26,33,0.06)] transition-colors',
                      currentLang === l.code ? 'text-[#8B1A21] font-bold' : 'text-[#2A1508]/80 dark:text-[rgba(245,235,220,0.80)]'
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* "Book Puja" CTA — premium pill */}
          <Link
            href="/pujas"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-xs font-bold tracking-wide shadow-[0_4px_16px_rgba(139,26,33,0.30)] hover:shadow-[0_6px_24px_rgba(139,26,33,0.40)] hover:scale-[1.02] transition-all duration-200"
          >
            <Flame className="h-3.5 w-3.5 opacity-90" />
            Book Puja
          </Link>

          {/* User / Account */}
          {userLoaded ? (
            user ? (
              <div className="hidden lg:flex items-center gap-1.5">
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="rounded-full text-[#2A1508]/70 hover:text-[#8B1A21] hover:bg-[rgba(139,26,33,0.06)] font-semibold text-xs gap-1.5"
                >
                  <Link href="/dashboard">
                    <User className="h-3.5 w-3.5" />
                    {user.fullName?.split(' ')[0] || 'Account'}
                  </Link>
                </Button>
                <form action="/auth/signout" method="post">
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="text-[#2A1508]/50 hover:text-red-600 hover:bg-red-50 rounded-full text-xs font-medium px-2"
                  >
                    Logout
                  </Button>
                </form>
              </div>
            ) : (
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="hidden lg:inline-flex rounded-full border border-[rgba(139,26,33,0.20)] text-[#8B1A21] hover:bg-[rgba(139,26,33,0.06)] font-semibold text-xs"
              >
                <Link href="/login">
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  Login
                </Link>
              </Button>
            )
          ) : (
            <div className="hidden lg:flex h-8 w-20 bg-[rgba(139,26,33,0.06)] rounded-full animate-pulse" />
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            className="lg:hidden rounded-full text-[#2A1508]/70 hover:text-[#8B1A21] hover:bg-[rgba(139,26,33,0.06)]"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 bg-[#FFFBF5] dark:bg-[#0C0402] shadow-2xl border-b border-[rgba(168,124,40,0.15)] overflow-hidden transition-all duration-300',
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="container py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-semibold text-[#2A1508]/80 dark:text-[rgba(245,235,220,0.80)] hover:text-[#8B1A21] hover:bg-[rgba(139,26,33,0.05)] transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <Link
            href="/tools"
            prefetch={true}
            onClick={() => setOpen(false)}
            className="px-4 py-3 rounded-xl text-sm font-semibold text-[#2A1508]/80 dark:text-[rgba(245,235,220,0.80)] hover:text-[#8B1A21] hover:bg-[rgba(139,26,33,0.05)] transition-colors"
          >
            Tools
          </Link>
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(168,124,40,0.25)] to-transparent my-2 mx-4" />

          {/* Book Puja CTA — mobile */}
          <Link
            href="/pujas"
            prefetch={true}
            onClick={() => setOpen(false)}
            className="mx-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-center shadow-md"
          >

            🔥 Book a Puja Now
          </Link>

          <div className="h-px bg-[rgba(168,124,40,0.12)] my-2 mx-4" />

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-[#2A1508] dark:text-[rgba(245,235,220,0.80)] bg-[rgba(139,26,33,0.05)] flex items-center gap-2"
              >
                <User className="h-4 w-4 text-[#8B1A21]" /> My Dashboard
              </Link>
              <form action="/auth/signout" method="post" className="w-full">
                <button
                  type="submit"
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4 pt-2 pb-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#8B1A21] bg-[rgba(139,26,33,0.08)] border border-[rgba(139,26,33,0.20)] text-center"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-center shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

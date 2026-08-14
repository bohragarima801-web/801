'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingBag, User, ChevronDown, Languages, Flame, Sun, Moon, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'
import { useTheme } from 'next-themes'

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
  { title: 'मुख्य पृष्ठ', href: '/' },
  { title: 'पूजा सेवा', href: '/pujas' },
  { title: 'VIP अनुष्ठान', href: '/vip-pujas' },
  { title: 'सिद्ध स्टोर', href: '/products' },
  { title: 'भक्ति सेवा', href: '/bhaktiseva' },
  { title: 'ब्लॉग', href: '/blog' },
]

const toolsMenu = [
  { title: '🤖 AI पंडित जी', href: '/ask-a-pandit', desc: 'तुरंत वैदिक मार्गदर्शन व सहायता', icon: '🤖' },
  { title: '♑ वैदिक जन्म कुंडली', href: '/tools', desc: 'निःशुल्क जन्मपत्रिका व फलादेश', icon: '♑' },
  { title: '📅 दैनिक पंचांग', href: '/panchang', desc: 'तिथि, नक्षत्र व चौघड़िया', icon: '📅' },
  { title: '⏰ शुभ मुहूर्त खोजक', href: '/muhurat', desc: 'विवाह, गृह प्रवेश व वाहन मुहूर्त', icon: '⏰' },
  { title: '🔮 ज्योतिष परामर्श', href: '/astro', desc: 'विद्वान ज्योतिषियों से सीधी बात', icon: '🔮' },
  { title: '🖼️ सिद्ध फोटो गैलरी', href: '/gallery', desc: 'मंदिर दर्शन व पावन चित्र', icon: '🖼️' },
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
  const { theme, setTheme } = useTheme()
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  // Scroll detection & Accessibility keyboard/scroll lock handlers
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setToolsOpen(false)
        setLangOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

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
        'sticky top-0 z-50 w-full transition-all duration-300 notranslate',
        scrolled ? 'bg-[#FFF9EF]/95 backdrop-blur-md shadow-md border-b border-[#E6D6BE]' : 'bg-[#FFF9EF] border-b border-[#E6D6BE]'
      )}
      translate="no"
    >
      {/* Top Announcement Bar — Locked Brand Strip */}
      <div className="w-full bg-[#6B2635] text-white py-1.5 px-3 sm:px-4 text-center text-[11px] sm:text-xs font-semibold flex items-center justify-between shadow-xs notranslate" translate="no">
        <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs">
          <span className="text-[#C99A3D]">ॐ</span>
          <span>सनातन धर्म की सेवा में समर्पित</span>
        </div>
        <div className="flex-1 text-center font-medium truncate px-1">
          <span>शुद्ध मंत्र, शास्त्रोक्त विधि और पूर्ण श्रद्धा के साथ हर पूजा</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium">
          <a href="tel:+919530401984" className="text-white/90 hover:text-[#C99A3D] transition-colors flex items-center gap-1">
            <span>📞</span> {siteData?.contact?.phone || '+91 95304 01984'}
          </a>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between gap-2 px-3 sm:px-4 md:px-6">
        <div className="shrink-0 max-w-[200px] sm:max-w-none">
          <Logo />
        </div>

        {/* Desktop navigation (hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className="px-3.5 py-2 rounded-xl text-sm font-bold text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7]/60 transition-all"
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
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all',
                toolsOpen ? 'text-[#E58A16] bg-[#F7EBD7]' : 'text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7]/60'
              )}
            >
              <span>ज्योतिष व टूल्स</span>
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', toolsOpen && 'rotate-180 text-[#E58A16]')} />
            </button>

            {/* Desktop dropdown */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 top-full mt-1 w-80 rounded-2xl bg-white border border-[#E6D6BE] shadow-2xl p-2.5 transition-all duration-200 z-50',
                toolsOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
              )}
            >
              <div className="grid grid-cols-1 gap-1">
                {toolsMenu.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setToolsOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F7EBD7]/70 transition-colors group"
                  >
                    <span className="text-base w-6 text-center shrink-0 opacity-90">{t.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-[#292321] group-hover:text-[#E58A16] transition-colors">{t.title}</div>
                      <div className="text-[11px] text-[#665E58] mt-0.5">{t.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Cart Icon (Desktop & Tablet) */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            asChild
            className="hidden sm:inline-flex relative rounded-full text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] transition-all h-9 w-9"
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E58A16] text-[9px] font-bold text-white shadow-md ring-2 ring-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* Theme Toggle (Desktop only, available in mobile drawer) */}
          <div className="hidden sm:inline-flex">
            <ThemeToggle />
          </div>

          {/* Language Switcher (Desktop only, available in mobile drawer) */}
          <div className="hidden sm:inline-flex relative">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-2.5 h-8 text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] rounded-full text-xs font-bold uppercase tracking-wide border border-[#E6D6BE]"
              onClick={() => setLangOpen(!langOpen)}
              title="Change Language"
            >
              <Languages className="h-3.5 w-3.5 text-[#E58A16]" />
              <span>{currentLang === 'hi' ? 'HI' : 'EN'}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-[#E6D6BE] rounded-xl shadow-xl p-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[#F7EBD7] transition-colors font-medium',
                      currentLang === l.code ? 'text-[#E58A16] font-bold bg-[#F7EBD7]/70' : 'text-[#292321]'
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* "Book Puja" CTA — Saffron Button matching Mockup (Desktop) */}
          <Link
            href="/pujas"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E58A16] hover:bg-[#d4790e] text-white text-xs font-extrabold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 shrink-0 whitespace-nowrap active:scale-[0.98]"
          >
            <span>पूजा बुक करें</span>
            <span className="text-sm">➔</span>
          </Link>

          {/* User Profile / Account Icon (Desktop) */}
          <div className="hidden sm:flex items-center">
            {userLoaded ? (
              user ? (
                <div className="flex items-center gap-1">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] font-bold text-xs gap-1.5 px-3 h-9 border border-[#E6D6BE] bg-white shadow-xs"
                  >
                    <Link href="/dashboard" title="My Account">
                      <User className="h-4 w-4 text-[#E58A16]" />
                      <span className="hidden md:inline">{user.fullName?.split(' ')[0] || 'Account'}</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="rounded-xl border border-[#E6D6BE] text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] font-bold text-xs px-3 h-9 bg-white shadow-xs"
                >
                  <Link href="/login" title="Login / Register">
                    <User className="h-4 w-4 mr-1 text-[#E58A16]" />
                    <span>लॉगिन</span>
                  </Link>
                </Button>
              )
            ) : null}
          </div>

          {/* Mobile Hamburger Menu Button — ALWAYS PROMINENT ON MOBILE */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
            className="lg:hidden shrink-0 rounded-xl bg-white text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] h-10 w-10 border border-[#E6D6BE] shadow-xs active:scale-95"
          >
            {open ? <X className="h-6 w-6 text-[#E58A16]" /> : <Menu className="h-6 w-6 text-[#292321]" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu drawer — Full Screen & Scrollable */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-[calc(40px+4rem)] bottom-0 bg-[#FFF9EF] z-40 overflow-y-auto transition-all duration-300 flex flex-col justify-between border-t border-[#E6D6BE]',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="container px-4 py-4 flex flex-col gap-1.5 max-w-md mx-auto">
          {/* Main Navigation Links */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-[#292321] hover:text-[#E58A16] bg-white border border-[#E6D6BE]/60 shadow-2xs transition-colors"
            >
              <span>{item.title}</span>
              <span className="text-xs text-[#C99A3D]">➔</span>
            </Link>
          ))}

          {/* Astro & Tools Submenu */}
          <div className="pt-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#C99A3D] px-2 block mb-1.5">
              ज्योतिष व वैदिक टूल्स
            </span>
            <div className="grid grid-cols-2 gap-2">
              {toolsMenu.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  onClick={() => setOpen(false)}
                  className="p-2.5 bg-white rounded-xl border border-[#E6D6BE]/60 text-xs font-bold text-[#292321] hover:text-[#E58A16] flex items-center gap-2 shadow-2xs"
                >
                  <span className="text-base">{t.icon}</span>
                  <span className="truncate">{t.title.replace(/^[^\s]+\s/, '')}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#E6D6BE] my-2" />

          {/* Language Selection Row */}
          <div className="bg-white p-3 rounded-xl border border-[#E6D6BE]/60 space-y-2">
            <span className="text-[11px] font-bold text-[#665E58] flex items-center gap-1">
              <Languages className="h-3.5 w-3.5 text-[#E58A16]" /> भाषा चुनें (Language)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                    currentLang === l.code
                      ? 'bg-[#E58A16] text-white shadow-xs'
                      : 'bg-[#F7EBD7] text-[#292321] hover:bg-[#E6D6BE]'
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Account / Login Section */}
          <div className="pt-1 pb-4">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#292321] bg-[#F7EBD7] border border-[#E6D6BE] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#E58A16]" />
                    <span>मेरा डैशबोर्ड ({user.fullName?.split(' ')[0]})</span>
                  </div>
                  <span>➔</span>
                </Link>
                <form action="/auth/signout" method="post" className="w-full">
                  <button
                    type="submit"
                    onClick={() => setOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors text-center"
                  >
                    लॉगआउट (Logout)
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-bold text-[#292321] bg-white border border-[#E6D6BE] text-center shadow-xs"
                >
                  लॉगिन (Login)
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#E58A16] text-center shadow-sm"
                >
                  रजिस्टर (Sign Up)
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Drawer Bottom Helpline */}
        <div className="p-4 bg-[#F7EBD7] border-t border-[#E6D6BE] text-center text-xs text-[#665E58] safe-area-padding">
          <a href="tel:+919530401984" className="font-bold text-[#292321] hover:text-[#E58A16] inline-flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-[#E58A16]" /> सहायता: +91 95304 01984
          </a>
        </div>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingBag, User, ChevronDown, Languages, Flame, Sun, Moon, Phone, Sparkles, Bot, Calendar, Heart, Clock, Zap, Gem, ArrowRight } from 'lucide-react'
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
  {
    title: 'AI पंडित जी',
    href: '/ask-a-pandit',
    desc: 'पूजा विधि व ज्योतिष संबंधी तुरंत समाधान',
    icon: Bot,
    badge: 'LIVE FREE',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    title: 'मुफ्त जन्म कुंडली',
    href: '/tools/kundali',
    desc: 'वैदिक जन्म पत्रिका, ग्रह स्थिति व फल',
    icon: Sun,
    badge: '100% FREE',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    title: 'दैनिक पंचांग',
    href: '/panchang',
    desc: 'तिथि, नक्षत्र, योग व चौघड़िया मुहूर्त',
    icon: Calendar,
    badge: 'DAILY',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    title: 'कुंडली गुण मिलान',
    href: '/tools/milan',
    desc: 'विवाह हेतु 36 गुण मिलान विश्लेषण',
    icon: Heart,
    badge: '36 GUNA',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    title: 'शुभ मुहूर्त खोजक',
    href: '/muhurat',
    desc: 'विवाह, वाहन व गृह प्रवेश का शुभ समय',
    icon: Clock,
    badge: 'MUHURAT',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    title: 'श्री गणेश प्रश्नावली',
    href: '/tools/shree-ganesh-siddha-prashnavali',
    desc: 'सिद्ध कोष्ठकों से अपनी शंका का समाधान',
    icon: Flame,
    badge: 'ORACLE',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    title: 'डिजिटल जाप माला',
    href: '/tools/mala',
    desc: '108 मंत्र जाप हेतु डिजिटल काउंटर',
    icon: Zap,
    badge: '108 JAPA',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    title: 'रत्न व अंक ज्योतिष',
    href: '/tools/numerology',
    desc: 'मूलांक, भाग्यांक व शुभ रत्न परामर्श',
    icon: Gem,
    badge: 'NUMBERS',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
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
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#EFE4D6]' : 'bg-white border-b border-[#EFE4D6]'
      )}
      translate="no"
    >
      {/* Top Announcement Bar — Royal Vedic Maroon Strip */}
      <div className="w-full bg-gradient-to-r from-[#7A1521] via-[#901323] to-[#7A1521] text-white py-1.5 px-3 sm:px-4 text-center text-[11px] sm:text-xs font-semibold flex items-center justify-between shadow-xs notranslate" translate="no">
        <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs">
          <span className="text-[#F5C542]">ॐ</span>
          <span>सनातन धर्म की सेवा में समर्पित</span>
        </div>
        <div className="flex-1 text-center font-medium truncate px-1 text-[#FFE8CC]">
          <span>शुद्ध मंत्र, शास्त्रोक्त विधि और पूर्ण श्रद्धा के साथ हर पूजा</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium">
          <a href="tel:+919530401984" className="text-white hover:text-[#F5C542] transition-colors flex items-center gap-1">
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
              className="px-3.5 py-2 rounded-xl text-sm font-bold text-[#1C1614] hover:text-[#FF6600] hover:bg-[#FFF3E8] transition-all"
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
                toolsOpen ? 'text-[#FF6600] bg-[#FFF3E8]' : 'text-[#1C1614] hover:text-[#FF6600] hover:bg-[#FFF3E8]'
              )}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>टूल्स</span>
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', toolsOpen && 'rotate-180 text-[#FF6600]')} />
            </button>

            {/* Desktop dropdown — High Aesthetic 2-Column Mega Menu */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-[560px] lg:w-[600px] rounded-2xl bg-white border border-[#EFE4D6] shadow-[0_20px_50px_rgba(28,22,20,0.12)] p-3 transition-all duration-200 z-50',
                toolsOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
              )}
            >
              <div className="grid grid-cols-2 gap-2">
                {toolsMenu.map((t) => {
                  const IconComp = t.icon
                  return (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FFF3E8] border border-transparent hover:border-[#FFD2B0] transition-all group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center shrink-0 border border-[#FFD2B0] group-hover:bg-[#FF6600] group-hover:text-white transition-all shadow-2xs">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-bold text-[#1C1614] group-hover:text-[#FF6600] transition-colors truncate">
                            {t.title}
                          </span>
                          <span className={cn('text-[9px] font-black px-1.5 py-0.5 rounded border shrink-0', t.badgeColor)}>
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6B5E57] truncate font-normal mt-0.5">
                          {t.desc}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Bottom Explore All Bar */}
              <div className="mt-2.5 pt-2.5 border-t border-[#EFE4D6] flex items-center justify-between px-2">
                <span className="text-[11px] font-semibold text-[#6B5E57] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF6600]" /> 100% प्रामाणिक वैदिक काल-गणना टूल्स
                </span>
                <Link
                  href="/tools"
                  onClick={() => setToolsOpen(false)}
                  className="text-xs font-extrabold text-[#FF6600] hover:text-[#E65C00] flex items-center gap-1 hover:gap-1.5 transition-all bg-[#FFF3E8] hover:bg-[#FFE6D0] px-3 py-1 rounded-lg border border-[#FFD2B0]"
                >
                  <span>सभी टूल्स देखें ({toolsMenu.length}+)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
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
            className="hidden sm:inline-flex relative rounded-full text-[#1C1614] hover:text-[#FF6600] hover:bg-[#FFF3E8] transition-all h-9 w-9"
          >
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF6600] text-[9px] font-bold text-white shadow-md ring-2 ring-white">
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
              className="gap-1 px-2.5 h-8 text-[#1C1614] hover:text-[#FF6600] hover:bg-[#FFF3E8] rounded-full text-xs font-bold uppercase tracking-wide border border-[#EFE4D6]"
              onClick={() => setLangOpen(!langOpen)}
              title="Change Language"
            >
              <Languages className="h-3.5 w-3.5 text-[#FF6600]" />
              <span>{currentLang === 'hi' ? 'HI' : 'EN'}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-[#EFE4D6] rounded-xl shadow-xl p-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[#FFF3E8] transition-colors font-medium',
                      currentLang === l.code ? 'text-[#FF6600] font-bold bg-[#FFF3E8]' : 'text-[#1C1614]'
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* "Book Puja" CTA — Radiant Saffron Button (Desktop) */}
          <Link
            href="/pujas"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6600] to-[#FF8500] hover:from-[#E65C00] hover:to-[#FF7700] text-white text-xs font-extrabold tracking-wide shadow-[0_4px_14px_rgba(255,102,0,0.32)] hover:shadow-[0_6px_20px_rgba(255,102,0,0.45)] transition-all duration-200 shrink-0 whitespace-nowrap active:scale-[0.98]"
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
                    className="rounded-xl text-[#1C1614] hover:text-[#FF6600] hover:bg-[#FFF3E8] font-bold text-xs gap-1.5 px-3 h-9 border border-[#EFE4D6] bg-white shadow-2xs"
                  >
                    <Link href="/dashboard" title="My Account">
                      <User className="h-4 w-4 text-[#FF6600]" />
                      <span className="hidden md:inline">{user.fullName?.split(' ')[0] || 'Account'}</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="rounded-xl border border-[#EFE4D6] text-[#1C1614] hover:text-[#FF6600] hover:bg-[#FFF3E8] font-bold text-xs px-3 h-9 bg-white shadow-2xs"
                >
                  <Link href="/login" title="Login / Register">
                    <User className="h-4 w-4 mr-1 text-[#FF6600]" />
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
            className="lg:hidden shrink-0 rounded-xl bg-white text-[#1C1614] hover:text-[#FF6600] hover:bg-[#FFF3E8] h-10 w-10 border border-[#EFE4D6] shadow-2xs active:scale-95"
          >
            {open ? <X className="h-6 w-6 text-[#FF6600]" /> : <Menu className="h-6 w-6 text-[#1C1614]" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu drawer — Full Screen & Scrollable */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-[calc(40px+4rem)] bottom-0 bg-[#FAF8F5] z-40 overflow-y-auto transition-all duration-300 flex flex-col justify-between border-t border-[#EFE4D6]',
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
              className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold text-[#1C1614] hover:text-[#FF6600] bg-white border border-[#EFE4D6] shadow-2xs transition-colors"
            >
              <span>{item.title}</span>
              <span className="text-xs text-[#D4AF37]">➔</span>
            </Link>
          ))}

          {/* Vedic Tools Submenu */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] block">
                वैदिक टूल्स (Vedic Tools)
              </span>
              <Link
                href="/tools"
                onClick={() => setOpen(false)}
                className="text-[11px] font-bold text-[#FF6600] hover:underline flex items-center gap-1"
              >
                <span>सभी देखें</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {toolsMenu.map((t) => {
                const IconComp = t.icon
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className="p-2.5 bg-white rounded-xl border border-[#EFE4D6] text-xs font-bold text-[#1C1614] hover:text-[#FF6600] flex items-center gap-2.5 shadow-2xs group"
                  >
                    <div className="h-7 w-7 rounded-lg bg-[#FFF3E8] text-[#FF6600] flex items-center justify-center shrink-0 border border-[#FFD2B0]">
                      <IconComp className="h-3.5 w-3.5" />
                    </div>
                    <span className="truncate">{t.title}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="h-px bg-[#EFE4D6] my-2" />

          {/* Language Selection Row */}
          <div className="bg-white p-3 rounded-xl border border-[#EFE4D6] space-y-2">
            <span className="text-[11px] font-bold text-[#6B5E57] flex items-center gap-1">
              <Languages className="h-3.5 w-3.5 text-[#FF6600]" /> भाषा चुनें (Language)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                    currentLang === l.code
                      ? 'bg-[#FF6600] text-white shadow-xs'
                      : 'bg-[#FFF3E8] text-[#1C1614] hover:bg-[#EFE4D6]'
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
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#1C1614] bg-[#FFF3E8] border border-[#EFE4D6] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#FF6600]" />
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
                  className="py-3 px-4 rounded-xl text-sm font-bold text-[#1C1614] bg-white border border-[#EFE4D6] text-center shadow-xs"
                >
                  लॉगिन (Login)
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#FF6600] text-center shadow-sm"
                >
                  रजिस्टर (Sign Up)
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Drawer Bottom Helpline */}
        <div className="p-4 bg-[#FFF3E8] border-t border-[#EFE4D6] text-center text-xs text-[#6B5E57] safe-area-padding">
          <a href="tel:+919530401984" className="font-bold text-[#1C1614] hover:text-[#FF6600] inline-flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-[#FF6600]" /> सहायता: +91 95304 01984
          </a>
        </div>
      </div>
    </header>
  )
}

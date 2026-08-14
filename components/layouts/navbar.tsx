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
  { title: 'होम (Home)', href: '/' },
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
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'bg-[#FFF9EF]/95 backdrop-blur-md shadow-md border-b border-[#E6D6BE]' : 'bg-[#FFF9EF] border-b border-[#E6D6BE]'
      )}
    >
      {/* Top Announcement Bar — Locked Brand Strip */}
      <div className="w-full bg-[#6B2635] text-white py-1.5 px-4 text-center text-[11px] sm:text-xs font-semibold flex items-center justify-between shadow-xs notranslate" translate="no">
        <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs">
          <span className="text-[#C99A3D]">ॐ</span>
          <span>सनातन धर्म की सेवा में समर्पित</span>
        </div>
        <div className="flex-1 text-center font-medium">
          <span>शुद्ध मंत्र, शास्त्रोक्त विधि और पूर्ण श्रद्धा के साथ हर पूजा</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium">
          <a href="tel:+919530401984" className="text-white/90 hover:text-[#C99A3D] transition-colors flex items-center gap-1">
            <span>📞</span> {siteData?.contact?.phone || '+91 95304 01984'}
          </a>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        {/* Desktop navigation */}
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
            <Link
              href="/tools"
              className="px-3.5 py-2 rounded-xl text-sm font-bold text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7]/60 transition-all flex items-center gap-1"
            >
              <span>टूल्स</span>
              <ChevronDown
                className={cn('h-3.5 w-3.5 opacity-60 transition-transform duration-200', toolsOpen && 'rotate-180')}
              />
            </Link>

            <div
              className={cn(
                'absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72 z-50 transition-all duration-200',
                toolsOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
              )}
            >
              <div className="bg-white border border-[#E6D6BE] rounded-2xl shadow-xl p-2 ring-1 ring-black/5">
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C99A3D]/40 to-transparent mb-2" />
                <div className="grid grid-cols-1 gap-0.5">
                  {toolsMenu.map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F7EBD7] transition-colors group"
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
          </div>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            asChild
            className="relative rounded-full text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] transition-all h-9 w-9"
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

          <ThemeToggle />

          {/* Language Switcher */}
          <div className="relative">
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

          {/* "Book Puja" CTA — Saffron Button matching Mockup */}
          <Link
            href="/pujas"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E58A16] hover:bg-[#d4790e] text-white text-xs font-extrabold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 shrink-0 whitespace-nowrap active:scale-[0.98]"
          >
            <span>पूजा बुक करें</span>
            <span className="text-sm">➔</span>
          </Link>

          {/* User Profile / Account Icon */}
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
                    <span className="hidden sm:inline">{user.fullName?.split(' ')[0] || 'Account'}</span>
                  </Link>
                </Button>
                <form action="/auth/signout" method="post" className="hidden lg:block">
                  <Button
                    type="submit"
                    size="sm"
                    variant="ghost"
                    className="text-[#665E58] hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-medium px-2.5 h-9"
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
                className="rounded-xl border border-[#E6D6BE] text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] font-bold text-xs px-3 h-9 bg-white shadow-xs"
              >
                <Link href="/login" title="Login / Register">
                  <User className="h-4 w-4 mr-1 text-[#E58A16]" />
                  <span className="hidden sm:inline">लॉगिन</span>
                </Link>
              </Button>
            )
          ) : (
            <div className="h-8 w-8 rounded-full bg-[#F7EBD7] animate-pulse" />
          )}

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? "Close Navigation Menu" : "Open Navigation Menu"}
            className="lg:hidden rounded-xl text-[#292321] hover:bg-[#F7EBD7] h-10 w-10 border border-[#E6D6BE]"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 bg-[#FFF9EF] shadow-2xl border-b border-[#E6D6BE] overflow-hidden transition-all duration-300',
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
              className="px-4 py-3 rounded-xl text-sm font-bold text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] transition-colors"
            >
              {item.title}
            </Link>
          ))}
          <Link
            href="/tools"
            prefetch={true}
            onClick={() => setOpen(false)}
            className="px-4 py-3 rounded-xl text-sm font-bold text-[#292321] hover:text-[#E58A16] hover:bg-[#F7EBD7] transition-colors"
          >
            टूल्स (Tools)
          </Link>
          <div className="h-px bg-[#E6D6BE] my-2 mx-4" />

          {/* Book Puja CTA — mobile */}
          <Link
            href="/pujas"
            prefetch={true}
            onClick={() => setOpen(false)}
            className="mx-4 py-3 rounded-xl text-sm font-extrabold text-white bg-[#E58A16] hover:bg-[#d4790e] text-center shadow-md flex items-center justify-center gap-2"
          >
            <span>पूजा बुक करें (Book Puja)</span>
            <span>➔</span>
          </Link>

          <div className="h-px bg-[#E6D6BE] my-2 mx-4" />

          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-[#292321] bg-[#F7EBD7] flex items-center gap-2"
              >
                <User className="h-4 w-4 text-[#E58A16]" /> मेरा डैशबोर्ड (My Dashboard)
              </Link>
              <form action="/auth/signout" method="post" className="w-full">
                <button
                  type="submit"
                  onClick={() => setOpen(false)}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  लॉगआउट (Sign Out)
                </button>
              </form>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 px-4 pt-2 pb-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#292321] bg-white border border-[#E6D6BE] text-center shadow-xs"
              >
                लॉगिन
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#E58A16] text-center shadow-sm"
              >
                रजिस्टर
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ShoppingBag, User, ChevronDown, Languages, Flame, Sun, Moon, Phone, Sparkles, Bot, Calendar, Heart, Clock, Zap, Gem, ArrowRight, MessageCircle } from 'lucide-react'
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
  { title: 'Home', href: '/' },
  { title: 'Book Puja', href: '/pujas' },
  { title: 'Horoscope', href: '/horoscope' },
  { title: 'Chadhawa', href: '/book-chadhawa' },
  { title: 'VIP Puja', href: '/vip-pujas' },
  { title: 'Store', href: '/products' },
  { title: 'About Us', href: '/about' },
  { title: 'Blogs', href: '/blog' },
]

const toolsMenu = [
  {
    title: 'AI Pandit Ji',
    href: '/ask-a-pandit',
    desc: 'Instant Vedic Astrology & Puja Guidance',
    icon: Bot,
    badge: 'LIVE FREE',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    title: 'Free Kundali',
    href: '/tools/kundali',
    desc: 'Vedic Birth Chart & Planetary Analysis',
    icon: Sun,
    badge: '100% FREE',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    title: 'Daily Panchang',
    href: '/panchang',
    desc: 'Tithi, Nakshatra, Yoga & Choghadiya',
    icon: Calendar,
    badge: 'DAILY',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    title: 'Kundali Milan',
    href: '/tools/milan',
    desc: '36 Guna Horoscope Matching for Marriage',
    icon: Heart,
    badge: '36 GUNA',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    title: 'Shubh Muhurat',
    href: '/muhurat',
    desc: 'Auspicious Timings for Events & Griha Pravesh',
    icon: Clock,
    badge: 'MUHURAT',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    title: 'Ganesh Prashnavali',
    href: '/tools/shree-ganesh-siddha-prashnavali',
    desc: 'Divine Answers to Your Questions',
    icon: Flame,
    badge: 'ORACLE',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    title: 'Digital Jaap Mala',
    href: '/tools/mala',
    desc: '108 Sacred Mantra Digital Counter',
    icon: Zap,
    badge: '108 JAPA',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    title: 'Numerology & Gems',
    href: '/tools/numerology',
    desc: 'Life Path Number & Gemstone Suggestions',
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

  const [showAnnouncement, setShowAnnouncement] = useState(true)
  const lastScrollY = useRef(0)

  // Scroll detection & Accessibility keyboard/scroll lock handlers
  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 10)

      if (currentScrollY > 50 && currentScrollY > lastScrollY.current) {
        // Scrolling down -> smoothly collapse announcement bar
        setShowAnnouncement(false)
      } else {
        // Scrolling up or top -> reveal announcement bar
        setShowAnnouncement(true)
      }
      lastScrollY.current = currentScrollY
    }
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Always initialize to clean English by default unless explicitly chosen
      localStorage.setItem('lang', 'en')
      setCurrentLang('en')
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname
    }
  }, [])

  const changeLang = (code: string) => {
    localStorage.setItem('lang', code)
    setCurrentLang(code)
    setLangOpen(false)
    window.location.reload()
  }

  // Pre-filled WhatsApp consultation URL
  const waHeaderUrl = `https://wa.me/919530401984?text=${encodeURIComponent('प्रणाम पंडित जी, मुझे दिव्ययज्ञम् सेवा के बारे में जानकारी चाहिए।')}`

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 notranslate',
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-[#EFE4D6]' : 'bg-white border-b border-[#EFE4D6]'
      )}
      translate="no"
    >
      {/* 1. Compact Announcement Bar — Collapses on scroll down, reveals on scroll up */}
      <div
        className={cn(
          'w-full bg-gradient-to-r from-[#52131D] via-[#7A1F2B] to-[#52131D] text-white text-[11px] font-semibold flex items-center justify-between shadow-xs transition-all duration-300 overflow-hidden notranslate border-b border-[#C89B3C]/30',
          showAnnouncement ? 'max-h-[26px] py-0.5 px-3 sm:px-4 opacity-100' : 'max-h-0 py-0 opacity-0 border-none'
        )}
        translate="no"
      >
        <div className="hidden sm:flex items-center gap-2 text-white/90 text-xs notranslate" translate="no">
          <span className="text-[#E2C46B]">ॐ</span>
          <span>सनातन वैदिक परंपरा • शास्त्रोक्त पूजा एवं संकल्प सेवा</span>
        </div>
        <div className="flex-1 text-center font-medium truncate px-1 text-[#F7F0E6] notranslate" translate="no">
          <span>शुद्ध मंत्रोच्चार, नाम-गोत्र संकल्प एवं लाइव WhatsApp वीडियो प्रमाण</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-medium notranslate" translate="no">
          <a href="tel:+919530401984" className="text-white hover:text-[#E2C46B] transition-colors flex items-center gap-1">
            <span>📞</span> {siteData?.contact?.phone || '+91 95304 01984'}
          </a>
        </div>
      </div>

      {/* 2. Main Header Bar — Strictly 56px on Mobile (h-[56px]), 64px on Desktop */}
      <div className="w-full max-w-7xl mx-auto flex h-[56px] md:h-16 items-center justify-between gap-2 px-3 sm:px-4 md:px-6 notranslate" translate="no">
        
        {/* Left Item on Mobile: Clean Hamburger Icon Button (Touch-optimized 44px min target) */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open Navigation Menu"
            className="shrink-0 rounded-xl bg-[#FDF4F5] text-[#7A1F2B] hover:bg-[#F9E5E7] h-10 w-10 border border-[#E8DDD0] shadow-xs active:scale-95 transition-transform"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Center Logo on Mobile, Left on Desktop */}
        <div className="shrink-0 flex items-center justify-center max-w-[180px] sm:max-w-none notranslate" translate="no">
          <Logo />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center header-nav notranslate" translate="no">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              translate="no"
              className="py-1 transition-colors notranslate"
            >
              {item.title}
            </Link>
          ))}

          {/* Tools Mega Dropdown on Desktop */}
          <div
            ref={toolsRef}
            className="relative notranslate"
            translate="no"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              translate="no"
              className={cn(
                'flex items-center gap-1.5 py-1 font-medium transition-colors notranslate',
                toolsOpen ? 'text-[#8b1d24]' : 'text-[#333333] hover:text-[#8b1d24]'
              )}
              style={{
                fontFamily: "'Inter', 'Poppins', sans-serif",
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.2px',
              }}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
              <span className="notranslate" translate="no">Tools</span>
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', toolsOpen && 'rotate-180 text-[#7A1F2B]')} />
            </button>

            {/* Desktop dropdown — High Aesthetic 2-Column Mega Menu */}
            <div
              className={cn(
                'absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-[560px] lg:w-[600px] rounded-2xl bg-white border border-[#E8DDD0] shadow-[0_12px_32px_rgba(36,26,24,0.08)] p-3 transition-all duration-200 z-50',
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
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FDF4F5] border border-transparent hover:border-[#E8DDD0] transition-all group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-[#FAF6ED] text-[#C89B3C] flex items-center justify-center shrink-0 border border-[#E2C46B]/40 group-hover:bg-[#7A1F2B] group-hover:text-white transition-all shadow-2xs">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-xs font-bold text-[#241A18] group-hover:text-[#7A1F2B] transition-colors truncate">
                            {t.title}
                          </span>
                          <span className={cn('text-[9px] font-black px-1.5 py-0.5 rounded border shrink-0', t.badgeColor)}>
                            {t.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6F625D] truncate font-normal mt-0.5">
                          {t.desc}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Bottom Explore All Bar */}
              <div className="mt-2.5 pt-2.5 border-t border-[#E8DDD0] flex items-center justify-between px-2">
                <span className="text-[11px] font-semibold text-[#6F625D] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" /> 100% प्रामाणिक वैदिक गणना टूल्स
                </span>
                <Link
                  href="/tools"
                  onClick={() => setToolsOpen(false)}
                  className="text-xs font-bold text-[#7A1F2B] hover:text-[#52131D] flex items-center gap-1 hover:gap-1.5 transition-all bg-[#FDF4F5] hover:bg-[#F9E5E7] px-3 py-1.5 rounded-lg border border-[#E8DDD0]"
                >
                  <span>Explore All Tools ({toolsMenu.length}+)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Right controls: Zero Button Stacking on Mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Mobile WhatsApp Quick Icon (Visible on screens < 768px) */}
          <a
            href={waHeaderUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Direct WhatsApp Consultation"
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 shadow-xs transition-all active:scale-95 shrink-0"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
          </a>

          {/* Cart Icon Button (Mobile & Desktop) */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            asChild
            className="relative rounded-xl text-[#241A18] bg-[#FDF4F5] md:bg-transparent hover:text-[#7A1F2B] hover:bg-[#F9E5E7] border border-[#E8DDD0] md:border-transparent transition-all h-10 w-10 active:scale-95 shrink-0"
          >
            <Link href="/cart">
              <ShoppingBag className="h-4 w-4 text-[#7A1F2B] md:h-5 md:w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#7A1F2B] text-[9px] font-black text-white shadow-xs ring-1 ring-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
          </Button>

          {/* Desktop Language Switcher */}
          <div className="hidden sm:inline-flex relative">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 px-2.5 h-8 text-[#241A18] hover:text-[#7A1F2B] hover:bg-[#FDF4F5] rounded-full text-xs font-bold uppercase tracking-wide border border-[#E8DDD0]"
              onClick={() => setLangOpen(!langOpen)}
              title="Change Language"
            >
              <Languages className="h-3.5 w-3.5 text-[#C89B3C]" />
              <span>{currentLang === 'hi' ? 'HI' : 'EN'}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-[#E8DDD0] rounded-xl shadow-xl p-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[#FDF4F5] transition-colors font-medium',
                      currentLang === l.code ? 'text-[#7A1F2B] font-bold bg-[#FDF4F5]' : 'text-[#241A18]'
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* "Book Puja" Button — Hidden on Mobile to prevent button stacking */}
          <Link
            href="/pujas"
            className="hidden lg:inline-flex items-center gap-2 header-cta-btn bg-[#8b1d24] hover:bg-[#70161c] text-white shadow-sm hover:shadow-md border border-[#C89B3C]/40 transition-all duration-200 shrink-0 whitespace-nowrap active:scale-[0.98]"
          >
            <span>Book Puja</span>
            <span className="text-sm">➔</span>
          </Link>

          {/* Desktop User Profile / Account Button */}
          <div className="hidden sm:flex items-center">
            {userLoaded ? (
              user ? (
                <div className="flex items-center gap-1">
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-[#241A18] hover:text-[#7A1F2B] hover:bg-[#FDF4F5] font-bold text-xs gap-1.5 px-3 h-9 border border-[#E8DDD0] bg-white shadow-2xs"
                  >
                    <Link href="/dashboard" title="My Account">
                      <User className="h-4 w-4 text-[#7A1F2B]" />
                      <span className="hidden md:inline">{user.fullName?.split(' ')[0] || 'Account'}</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="rounded-xl border border-[#E8DDD0] text-[#241A18] hover:text-[#7A1F2B] hover:bg-[#FDF4F5] font-bold text-xs px-3 h-9 bg-white shadow-2xs"
                >
                  <Link href="/login" title="Login / Register">
                    <User className="h-4 w-4 mr-1 text-[#7A1F2B]" />
                    <span>Login</span>
                  </Link>
                </Button>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* 3. Slide-Over Mobile Drawer (85% Viewport Width Max, Sleek & Compact) */}
      {/* Backdrop */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-[9998] transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Slide Drawer Panel */}
      <aside
        aria-label="Mobile Navigation Drawer"
        className={cn(
          'lg:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-[340px] bg-white z-[9999] shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ease-in-out border-r border-[#EFE4D6]',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Top Bar: Pinned User Profile + Close Button */}
        <div className="p-4 bg-gradient-to-b from-[#FDF4F5] to-white border-b border-[#E8DDD0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#7A1F2B] text-white flex items-center justify-center font-black text-sm shadow-xs">
              {user ? (user.fullName?.[0]?.toUpperCase() || 'U') : 'ॐ'}
            </div>
            <div className="leading-tight">
              <p className="text-xs font-black text-[#241A18]">
                {user ? user.fullName || 'Devotee' : 'दिव्ययज्ञम् सनातन सेवा'}
              </p>
              <p className="text-[10px] text-[#6F625D] font-semibold">
                {user ? user.email : 'स्वागतम् • प्रामाणिक पूजा सेवा'}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            aria-label="Close Drawer"
            className="h-8 w-8 rounded-full hover:bg-black/5 text-[#6F625D] hover:text-[#241A18]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="p-3.5 space-y-4 flex-1 overflow-y-auto">
          
          {/* Main Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#7A1F2B] px-2 block">
              मुख्य पृष्ठ व सेवाएं
            </span>
            <div className="grid grid-cols-1 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-[#241A18] hover:text-[#7A1F2B] hover:bg-[#FDF4F5] transition-colors border border-transparent hover:border-[#E8DDD0]"
                >
                  <span>{item.title}</span>
                  <span className="text-xs text-[#C89B3C]">➔</span>
                </Link>
              ))}
            </div>
          </div>

          {/* 4. Vedic Tools: 4-Column Compact Icon Tile Grid (Specification #4) */}
          <div className="space-y-2 pt-1 border-t border-[#E8DDD0]">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7A1F2B] flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#C89B3C]" /> वैदिक टूल्स ग्रिड
              </span>
              <Link
                href="/tools"
                onClick={() => setOpen(false)}
                className="text-[10px] font-extrabold text-[#7A1F2B] hover:underline"
              >
                सभी 8+ टूल्स ➔
              </Link>
            </div>

            {/* 4-Column Tile Grid: 44x44px icon container + 11px label */}
            <div className="grid grid-cols-4 gap-1.5">
              {toolsMenu.map((t) => {
                const IconComp = t.icon
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-[#FFF9F1] hover:bg-[#FDF4F5] border border-[#E8DDD0] active:scale-95 transition-all text-center group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white text-[#C89B3C] group-hover:bg-[#7A1F2B] group-hover:text-white flex items-center justify-center shadow-2xs border border-[#E8DDD0] transition-colors mb-1">
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#241A18] leading-tight line-clamp-1 w-full">
                      {t.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Language Selector in Drawer */}
          <div className="p-2.5 rounded-xl bg-[#FFF9F1] border border-[#E8DDD0] space-y-1.5">
            <span className="text-[10px] font-bold text-[#6F625D] flex items-center gap-1">
              <Languages className="h-3.5 w-3.5 text-[#C89B3C]" /> भाषा चुनें / Select Language
            </span>
            <div className="flex gap-1.5">
              {languages.slice(0, 4).map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLang(l.code)}
                  className={cn(
                    'flex-1 py-1 rounded-lg text-[11px] font-black transition-all text-center',
                    currentLang === l.code
                      ? 'bg-[#7A1F2B] text-white shadow-xs'
                      : 'bg-white text-[#241A18] border border-[#E8DDD0]'
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Action in Drawer */}
          <div className="pt-1">
            {user ? (
              <div className="space-y-1.5">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#7A1F2B] to-[#52131D] flex items-center justify-between shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" /> मेरी पूजा व संकल्प डैशबोर्ड
                  </span>
                  <span>➔</span>
                </Link>
                <form action="/auth/signout" method="post" className="w-full">
                  <button
                    type="submit"
                    onClick={() => setOpen(false)}
                    className="w-full py-2 px-3 rounded-xl text-[11px] font-bold text-[#B42318] bg-red-50 hover:bg-red-100 border border-red-200 transition-colors text-center"
                  >
                    खाते से लॉगआउट
                  </button>
                </form>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-[#241A18] bg-[#FDF4F5] border border-[#E8DDD0] text-center shadow-2xs"
                >
                  लॉगिन करें
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-[#7A1F2B] hover:bg-[#52131D] text-center shadow-sm"
                >
                  साइन अप
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Bottom Helpline in Drawer */}
        <div className="p-3 bg-[#FDF4F5] border-t border-[#E8DDD0] text-center text-xs text-[#6F625D] shrink-0">
          <a
            href="tel:+919530401984"
            className="font-bold text-[#7A1F2B] hover:text-[#52131D] inline-flex items-center gap-1.5 text-xs"
          >
            <Phone className="h-3.5 w-3.5 text-[#FF6600]" /> सहायता हेल्पलाइन: +91 95304 01984
          </a>
        </div>
      </aside>
    </header>
  )
}

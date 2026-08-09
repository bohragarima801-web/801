'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import {
  Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, ArrowRight,
  ShieldCheck, Video, PackageCheck, Star, Award, Lock, CheckCircle2, Send, Languages, Clock
} from 'lucide-react'
import { usePathname } from 'next/navigation'

interface FooterProps {
  mapUrl?: string
  siteData?: any
  isDark?: boolean
}

export function Footer({ mapUrl, siteData, isDark }: FooterProps) {
  const pathname = usePathname()
  const isDarkTheme = isDark !== undefined ? isDark : (pathname === '/' || pathname?.startsWith('/vip-pujas'))
  const [subInput, setSubInput] = useState('')
  const [subSuccess, setSubSuccess] = useState(false)
  const [currentLang, setCurrentLang] = useState('hi')

  const socials = siteData?.socials || siteConfig.socials
  const contact = siteData?.contact || siteConfig.contact

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subInput.trim()) return
    setSubSuccess(true)
    setTimeout(() => {
      setSubInput('')
      setSubSuccess(false)
    }, 4000)
  }

  const toggleLanguage = (lang: string) => {
    setCurrentLang(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang)
    }
  }

  // Footer styling tokens (Premium Dark Theme #0C1017 for 100% high contrast across all pages including /blog)
  const bgClass = 'bg-[#0C1017] text-white border-t border-[#D4AF37]/30'
  const textBodyClass = 'text-[#D1D5DB]'
  const headingClass = 'text-[#FBBF24] font-heading font-extrabold text-xs uppercase tracking-[0.14em] drop-shadow-sm'
  const linkHoverClass = 'hover:text-[#FBBF24]'
  const iconBgClass = 'bg-[#1C160F] text-[#F3E5AB] border border-[#D4AF37]/40'

  return (
    <footer className={`relative z-10 transition-colors ${bgClass} pb-28 md:pb-12`}>
      {/* ── 1. GRADIENT TOP BORDER (Golden Strip) ── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#D4AF37] via-[#FF7A00] to-[#D4AF37] shadow-sm" />

      {/* ── BACKGROUND SPIRITUAL WATERMARK OVERLAY ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-5"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FF7A00' fill-opacity='0.15'%3E%3Cpath d='M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="container relative z-10 pt-10 md:pt-14 pb-8">
        
        {/* ============================================================
            SECTION 1: TRUST BANNER (Top 4-Column Strip)
            ============================================================ */}
        <div className="mb-12 p-6 rounded-2xl bg-[#141B26] border border-[#D4AF37]/30 shadow-md grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0F0C08] border border-[#D4AF37]/40 text-[#F3E5AB] flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="h-5 w-5 text-[#FBBF24]" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white">100% Verified Pandits</div>
              <div className="text-[11px] text-[#9CA3AF]">शास्त्रोक्त विधि व शुद्ध संकल्प</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0F0C08] border border-[#D4AF37]/40 text-[#F3E5AB] flex items-center justify-center shrink-0 font-bold">
              <Video className="h-5 w-5 text-[#FBBF24]" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white">Live Video Proof</div>
              <div className="text-[11px] text-[#9CA3AF]">व्हाट्सएप पर लाइव प्रमाण</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0F0C08] border border-[#D4AF37]/40 text-[#F3E5AB] flex items-center justify-center shrink-0 font-bold">
              <PackageCheck className="h-5 w-5 text-[#FBBF24]" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white">Abhimantrit Prasad</div>
              <div className="text-[11px] text-[#9CA3AF]">घर द्वार पावन डिलीवरी</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0F0C08] border border-[#D4AF37]/40 text-[#F3E5AB] flex items-center justify-center shrink-0 font-bold">
              <Star className="h-5 w-5 fill-[#FBBF24] text-[#FBBF24]" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white">4.9 / 5 Rating</div>
              <div className="text-[11px] text-[#9CA3AF]">50,000+ संतुष्ट यजमान</div>
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 2: MAIN FOOTER GRID (5 Columns)
            ============================================================ */}
        <div className="grid gap-8 lg:grid-cols-12 pb-12 border-b border-[#F3E8DE] dark:border-gray-800">
          
          {/* Col 1: Brand & Belief */}
          <div className="lg:col-span-3 space-y-5">
            <Logo />
            <p className={`text-xs leading-relaxed max-w-xs font-medium ${textBodyClass}`}>
              {siteData?.description || 'India\'s most trusted online platform for authentic Vedic pujas, VIP temple darshan, and sacred abhimantrit prasad home delivery.'}
            </p>

            {/* Certification Badges */}
            <div className="space-y-2 pt-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFF3E0] dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-[#FF7A00] text-xs font-bold">
                <Award className="h-4 w-4" />
                <span>ISO Certified & Veda Compliant Seva</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Made with Sanatan Devotion in Bharat 🇮🇳</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2.5 pt-2">
              {socials?.facebook && socials.facebook !== '#' && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-[#F3E8DE] dark:border-gray-700 flex items-center justify-center text-[#4B5563] dark:text-gray-300 hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00] transition-all"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
              )}
              {socials?.instagram && socials.instagram !== '#' && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-[#F3E8DE] dark:border-gray-700 flex items-center justify-center text-[#4B5563] dark:text-gray-300 hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00] transition-all"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              )}
              {socials?.youtube && socials.youtube !== '#' && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-[#F3E8DE] dark:border-gray-700 flex items-center justify-center text-[#4B5563] dark:text-gray-300 hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00] transition-all"
                >
                  <Youtube className="h-3.5 w-3.5" />
                </a>
              )}
              {socials?.twitter && socials.twitter !== '#' && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-[#F3E8DE] dark:border-gray-700 flex items-center justify-center text-[#4B5563] dark:text-gray-300 hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00] transition-all"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Puja Booking */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className={headingClass}>QUICK BOOKING</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { label: 'रुद्राभिषेक महापूजा', href: '/pujas' },
                { label: 'बगलामुखी मिर्ची हवन', href: '/pujas' },
                { label: 'पितृ शांति तर्पण पूजा', href: '/pujas' },
                { label: 'कालसर्प दोष शांति', href: '/pujas' },
                { label: 'नवग्रह शांति अनुष्ठान', href: '/pujas' },
                { label: 'VIP सिद्ध महापूजा', href: '/vip-pujas' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className={`${textBodyClass} ${linkHoverClass} transition-all flex items-center gap-1.5 group`}
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0 text-[#FF7A00]" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Spiritual Tools */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className={headingClass}>SPIRITUAL TOOLS</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { label: '🤖 AI पंडित जी', href: '/ask-a-pandit' },
                { label: '♑ मुफ्त जन्म कुंडली', href: '/tools' },
                { label: '📅 दैनिक पंचांग', href: '/panchang' },
                { label: '⏰ शुभ मुहूर्त खोजक', href: '/muhurat' },
                { label: '🔮 ज्योतिष परामर्श', href: '/astro' },
                { label: '🖼️ सिद्ध फोटो गैलरी', href: '/gallery' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className={`${textBodyClass} ${linkHoverClass} transition-all flex items-center gap-1.5 group`}
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0 text-[#FF7A00]" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Support & Location */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className={headingClass}>SUPPORT & LOCATION</h4>
            <div className="space-y-2.5 text-xs font-medium">
              <a
                href={`tel:${(contact?.phone || '').replace(/[^0-9+]/g, '').split(',')[0]}`}
                className={`${textBodyClass} ${linkHoverClass} transition-colors flex items-center gap-2`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <Phone className="h-3 w-3" />
                </div>
                <span className="font-bold">{contact?.phone || '+91-95871-71984'}</span>
              </a>

              <a
                href={`mailto:${contact?.email || 'seva@divyayagyam.com'}`}
                className={`${textBodyClass} ${linkHoverClass} transition-colors flex items-center gap-2`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <Mail className="h-3 w-3" />
                </div>
                <span className="font-bold truncate">{contact?.email || 'seva@divyayagyam.com'}</span>
              </a>

              <div className={`flex items-center gap-2 ${textBodyClass}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <MapPin className="h-3 w-3" />
                </div>
                <span>Jodhpur, Rajasthan • India</span>
              </div>

              <div className={`flex items-center gap-2 ${textBodyClass}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <Clock className="h-3 w-3" />
                </div>
                <span className="text-[11px]">9:00 AM - 8:00 PM IST</span>
              </div>

              {/* Direct WhatsApp Chat Button */}
              <a
                href="https://wa.me/919587171984?text=Namaste!%20I%20need%20help%20with%20puja%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm transition-all"
              >
                💬 WhatsApp Direct Chat
              </a>
            </div>
          </div>

          {/* Col 5: Newsletter & Panchang Updates */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className={headingClass}>PANCHANG UPDATES</h4>
            <p className={`text-xs leading-relaxed font-medium ${textBodyClass}`}>
              दैनिक पंचांग, शुभ मुहूर्त व सिद्ध त्योहार अपडेट्स सीधे व्हाट्सएप पर पाएं:
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="अपना व्हाट्सएप / ईमेल दर्ज करें"
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 rounded-xl text-xs bg-white dark:bg-[#1E222A] border border-[#F3E8DE] dark:border-gray-700 text-[#111827] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white rounded-lg text-xs font-bold hover:brightness-105 transition-all flex items-center justify-center"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {subSuccess && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  ✓ धन्यवाद! आप पंचांग अपडेट्स से जुड़ चुके हैं।
                </p>
              )}
            </form>
          </div>

        </div>

        {/* ============================================================
            SECTION 3: SEO, LEGAL & SECURITY FOOTER (Bottom Bar)
            ============================================================ */}
        <div className="pt-8 space-y-6">
          {/* Keyword Rich Tagline */}
          <div className="text-center text-xs font-semibold text-[#FF7A00] tracking-wide">
            India's Most Trusted Online Vedic Puja & Abhimantrit Samagri Platform
          </div>

          {/* Payment & Security Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-[#F3E8DE]/60 dark:border-gray-800/60 text-center md:text-left">
            {/* Payment Logos */}
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap text-xs">
              <span className="font-bold text-gray-500 text-[11px] uppercase tracking-wider">Payments:</span>
              <div className="px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-bold text-blue-600">
                Razorpay
              </div>
              <div className="px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-extrabold text-[#111827] dark:text-white">
                UPI / GPay
              </div>
              <div className="px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-bold text-[#111827] dark:text-white">
                PhonePe
              </div>
              <div className="px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-bold text-[#111827] dark:text-white">
                Cards & NetBanking
              </div>
              <div className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center justify-center gap-2">
              <Languages className="h-3.5 w-3.5 text-[#FF7A00]" />
              <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[11px] font-bold">
                <button
                  onClick={() => toggleLanguage('hi')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${currentLang === 'hi' ? 'bg-[#FF7A00] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${currentLang === 'en' ? 'bg-[#FF7A00] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Legal Links & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F3E8DE]/60 dark:border-gray-800/60 text-xs font-medium text-gray-500 text-center md:text-left">
            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
              <Link href="/terms" className="hover:text-[#FF7A00] transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-[#FF7A00] transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link href="/refunds" className="hover:text-[#FF7A00] transition-colors">Refund Policy</Link>
              <span>•</span>
              <Link href="/shipping" className="hover:text-[#FF7A00] transition-colors">Shipping Policy</Link>
              <span>•</span>
              <Link href="/register" className="text-[#FF7A00] font-bold hover:underline">Pandit / Temple Registration</Link>
            </div>

            <div className="text-center md:text-right">
              © {new Date().getFullYear()} DivyaYagyam. All rights reserved. • हरि ॐ 🙏
            </div>
          </div>

        </div>

      </div>
    </footer>
  )
}

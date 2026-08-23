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

  // Locked Brand Theme Match: Dark Charcoal (#292321) + Antique Gold Headings (#C99A3D) + High Contrast Light Ivory Text (#FFF9EF)
  const bgClass = 'bg-[#292321] text-[#FFF9EF] border-t border-[#C99A3D]/30'
  const textBodyClass = 'text-[#E6D6BE]'
  const headingClass = 'text-[#C99A3D] font-heading font-extrabold text-xs uppercase tracking-[0.14em]'
  const linkHoverClass = 'hover:text-[#E58A16] transition-colors duration-200 hover:underline'
  const iconBgClass = 'bg-[#1E1917] text-[#C99A3D] border border-[#C99A3D]/30'

  return (
    <footer className={`divyayagyam-footer relative z-10 transition-colors ${bgClass} pb-28 md:pb-12 notranslate`} translate="no">
      {/* ── 1. GRADIENT TOP BORDER (Sacred Antique Gold / Saffron Strip) ── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#C99A3D] via-[#E58A16] to-[#C99A3D] shadow-sm" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-10 md:pt-14 pb-8">
        
        {/* ============================================================
            SECTION 1: TRUST BANNER (Top 4-Column Strip)
            ============================================================ */}
        <div className="mb-12 p-6 rounded-2xl bg-[#1E1917] border border-[#C99A3D]/25 shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#292321] border border-[#C99A3D]/30 text-[#C99A3D] flex items-center justify-center shrink-0 font-bold">
              <ShieldCheck className="h-5 w-5 text-[#C99A3D]" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white">100% प्रामाणिक पंडित</div>
              <div className="text-[11px] text-[#E6D6BE]">शास्त्रोक्त विधि व शुद्ध संकल्प</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#292321] border border-[#C99A3D]/30 text-[#C99A3D] flex items-center justify-center shrink-0 font-bold">
              <Video className="h-5 w-5 text-[#C99A3D]" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white">Live Video Proof</div>
              <div className="text-[11px] text-[#E6D6BE]">व्हाट्सएप पर लाइव प्रमाण</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#292321] border border-[#C99A3D]/30 text-[#C99A3D] flex items-center justify-center shrink-0 font-bold">
              <PackageCheck className="h-5 w-5 text-[#C99A3D]" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white">अभिमंत्रित प्रसाद</div>
              <div className="text-[11px] text-[#E6D6BE]">घर द्वार पावन डिलीवरी</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#292321] border border-[#C99A3D]/30 text-[#C99A3D] flex items-center justify-center shrink-0 font-bold">
              <Award className="h-5 w-5 text-[#C99A3D]" />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold text-white">27+ वर्ष पावन सेवा</div>
              <div className="text-[11px] text-[#E6D6BE]">1997 से काशी व शक्तिपीठ परंपरा</div>
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 2: MAIN FOOTER GRID (5 Columns)
            ============================================================ */}
        <div className="grid gap-8 lg:grid-cols-12 pb-12 border-b border-[#C99A3D]/20">
          
          {/* Col 1: Brand & Belief */}
          <div className="lg:col-span-3 space-y-5">
            <Logo />
            <p className={`text-xs leading-relaxed max-w-xs font-medium ${textBodyClass}`}>
              {siteData?.description || 'भारत का सबसे भरोसेमंद ऑनलाइन वैदिक पूजा एवं अभिमंत्रित सामग्री संस्थान। शास्त्रोक्त विधि, नाम-गोत्र संकल्प एवं प्रामाणिक सेवा।'}
            </p>

            {/* Certification Badges */}
            <div className="space-y-2 pt-1">
              <div className="footer-badge-box inline-flex items-center gap-2 bg-[#1E1917] border border-[#C99A3D]/40 px-3.5 py-2 rounded-xl text-[#FFF9EF] text-xs font-semibold shadow-sm">
                <span>🛡️</span> 100% वेद सम्मत वैदिक सेवा
              </div>
              <div className="flex items-center gap-2 text-[11px] font-semibold text-[#E6D6BE]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>सनातन सेवा ॐ — दिव्ययज्ञम् पहल 🇮🇳</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2.5 pt-2">
              {socials?.facebook && socials.facebook !== '#' && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#1E1917] border border-[#C99A3D]/30 flex items-center justify-center text-[#E6D6BE] hover:bg-[#E58A16] hover:text-white hover:border-[#E58A16] transition-all"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
              )}
              {socials?.instagram && socials.instagram !== '#' && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-[#1E1917] border border-[#C99A3D]/30 flex items-center justify-center text-[#E6D6BE] hover:bg-[#E58A16] hover:text-white hover:border-[#E58A16] transition-all"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              )}
              {socials?.youtube && socials.youtube !== '#' && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#1E1917] border border-[#C99A3D]/30 flex items-center justify-center text-[#E6D6BE] hover:bg-[#E58A16] hover:text-white hover:border-[#E58A16] transition-all"
                >
                  <Youtube className="h-3.5 w-3.5" />
                </a>
              )}
              {socials?.twitter && socials.twitter !== '#' && (
                <a
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-[#1E1917] border border-[#C99A3D]/30 flex items-center justify-center text-[#E6D6BE] hover:bg-[#E58A16] hover:text-white hover:border-[#E58A16] transition-all"
                >
                  <Twitter className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Puja Booking */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className={headingClass}>पूजा सेवाएँ</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { label: 'रुद्राभिषेक महापूजा', href: '/pujas/mahamrityunjaya-jaap-rudrabhishekam' },
                { label: 'बगलामुखी मिर्ची हवन', href: '/pujas/maa-bagalamukhi-mirchi-hawan' },
                { label: 'पितृ शांति तर्पण पूजा', href: '/pujas/pitra-shanti-vishesh-sarva-pitra-tarpan-puja' },
                { label: 'कालसर्प दोष शांति', href: '/pujas/kalsarp-dosh-shanti-puja' },
                { label: 'नवग्रह शांति अनुष्ठान', href: '/pujas/navgrah-shanti-sarva-graha-dosh-nivaran-puja' },
                { label: 'VIP सिद्ध महापूजा', href: '/vip-pujas' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className={`${textBodyClass} ${linkHoverClass} transition-all flex items-center gap-1.5 group`}
                  >
                    <ArrowRight className="h-3 w-3 text-[#E58A16] opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Spiritual Tools */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className={headingClass}>वैदिक टूल्स</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { label: '🤖 AI पंडित जी', href: '/ask-a-pandit' },
                { label: '☀️ मुफ्त जन्म कुंडली', href: '/tools/kundali' },
                { label: '📅 दैनिक पंचांग', href: '/panchang' },
                { label: '💖 कुंडली गुण मिलान', href: '/tools/milan' },
                { label: '⏰ शुभ मुहूर्त खोजक', href: '/muhurat' },
                { label: '🕉️ श्री गणेश प्रश्नावली', href: '/tools/shree-ganesh-siddha-prashnavali' },
                { label: '📿 डिजिटल जाप माला', href: '/tools/mala' },
                { label: '🌟 सभी वैदिक टूल्स (All)', href: '/tools' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className={`${textBodyClass} ${linkHoverClass} transition-all flex items-center gap-1.5 group`}
                  >
                    <ArrowRight className="h-3 w-3 text-[#E58A16] opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Support & Location */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className={headingClass}>सहायता व संपर्क</h4>
            <div className="space-y-2.5 text-xs font-medium">
              <a
                href={`tel:${(contact?.phone || '').replace(/[^0-9+]/g, '').split(',')[0]}`}
                className={`${textBodyClass} ${linkHoverClass} transition-colors flex items-center gap-2`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <Phone className="h-3 w-3" />
                </div>
                <span className="font-bold">{contact?.phone || '+91 95304 01984'}</span>
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
                <span>जोधपुर, राजस्थान • भारत</span>
              </div>

              <div className={`flex items-center gap-2 ${textBodyClass}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <Clock className="h-3 w-3" />
                </div>
                <span className="text-[11px]">9:00 AM - 8:00 PM IST</span>
              </div>

              {/* Direct WhatsApp Chat Button */}
              <a
                href="https://wa.me/919530401984?text=Namaste!%20I%20need%20help%20with%20puja%20booking"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>💬 WhatsApp सहायता</span>
              </a>
            </div>
          </div>

          {/* Col 5: Newsletter & Panchang Updates */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className={headingClass}>पंचांग व मुहूर्त अपडेट्स</h4>
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
                  className="w-full pl-3 pr-10 py-2.5 rounded-xl text-xs bg-[#1E1917] border border-[#C99A3D]/40 text-white placeholder:text-[#E6D6BE]/60 focus:outline-none focus:ring-2 focus:ring-[#E58A16]"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#E58A16] hover:bg-[#d4790e] text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
              {subSuccess && (
                <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  ✓ धन्यवाद! आप पंचांग अपडेट्स से जुड़ चुके हैं।
                </p>
              )}
            </form>
          </div>

        </div>

        {/* ============================================================
            SECTION 3: SEO, LEGAL & SECURITY FOOTER
            ============================================================ */}
        <div className="divyayagyam-footer-bottom bg-[#1E1917] rounded-2xl mt-8 p-6 space-y-6 border border-[#C99A3D]/25 shadow-lg">
          {/* Keyword Rich Tagline */}
          <div className="text-center text-xs font-bold text-[#C99A3D] tracking-wider uppercase">
            India's Most Trusted Online Vedic Puja & Abhimantrit Samagri Platform
          </div>

          {/* Payment & Security Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-[#C99A3D]/20 text-center md:text-left">
            {/* Payment Logos */}
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap text-xs">
              <span className="font-bold text-[#E6D6BE] text-[11px] uppercase tracking-wider">Payments:</span>
              <div className="px-2.5 py-1 rounded bg-[#292321] border border-[#C99A3D]/30 text-[11px] font-bold text-[#E6D6BE]">
                Razorpay
              </div>
              <div className="px-2.5 py-1 rounded bg-[#292321] border border-[#C99A3D]/30 text-[11px] font-bold text-white">
                UPI / GPay
              </div>
              <div className="px-2.5 py-1 rounded bg-[#292321] border border-[#C99A3D]/30 text-[11px] font-bold text-white">
                PhonePe
              </div>
              <div className="px-2.5 py-1 rounded bg-[#292321] border border-[#C99A3D]/30 text-[11px] font-bold text-white">
                Cards & NetBanking
              </div>
              <div className="px-2.5 py-1 rounded bg-[#292321] border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center justify-center gap-2">
              <Languages className="h-3.5 w-3.5 text-[#E58A16]" />
              <div className="inline-flex rounded-lg p-0.5 bg-[#292321] border border-[#C99A3D]/30 text-[11px] font-bold">
                <button
                  onClick={() => toggleLanguage('hi')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${currentLang === 'hi' ? 'bg-[#E58A16] text-white font-bold shadow-sm' : 'text-[#E6D6BE] hover:text-white'}`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => toggleLanguage('en')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${currentLang === 'en' ? 'bg-[#E58A16] text-white font-bold shadow-sm' : 'text-[#E6D6BE] hover:text-white'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Directory & Internal Links */}
          <div className="pt-4 border-t border-[#C99A3D]/20 text-xs font-medium text-[#E6D6BE] space-y-3">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center md:justify-start">
              <Link href="/about" className="hover:text-[#E58A16] hover:underline">हमारे बारे में (About)</Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-[#E58A16] hover:underline">संपर्क करें (Contact)</Link>
              <span>•</span>
              <Link href="/faq" className="hover:text-[#E58A16] hover:underline">सामान्य प्रश्न (FAQ)</Link>
              <span>•</span>
              <Link href="/support" className="hover:text-[#E58A16] hover:underline">सहायता केंद्र (Support)</Link>
              <span>•</span>
              <Link href="/careers" className="hover:text-[#E58A16] hover:underline">करियर (Careers)</Link>
              <span>•</span>
              <Link href="/blog" className="hover:text-[#E58A16] hover:underline">वैदिक ब्लॉग (Blog)</Link>
              <span>•</span>
              <Link href="/festivals" className="hover:text-[#E58A16] hover:underline">त्योहार कैलेंडर (Festivals)</Link>
              <span>•</span>
              <Link href="/events" className="hover:text-[#E58A16] hover:underline">धार्मिक उत्सव (Events)</Link>
              <span>•</span>
              <Link href="/bhaktiseva" className="hover:text-[#E58A16] hover:underline">भक्ति सेवा (Offerings)</Link>
              <span>•</span>
              <Link href="/sitemap" className="hover:text-[#E58A16] hover:underline">साइटमैप (HTML Sitemap)</Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start text-[11px] text-[#A89F91]">
              <Link href="/terms" className="hover:text-[#E58A16] hover:underline">Terms of Service</Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-[#E58A16] hover:underline">Privacy Policy</Link>
              <span>•</span>
              <Link href="/refunds" className="hover:text-[#E58A16] hover:underline">Refund Policy</Link>
              <span>•</span>
              <Link href="/shipping" className="hover:text-[#E58A16] hover:underline">Shipping Policy</Link>
              <span>•</span>
              <Link href="/register" className="text-white font-extrabold hover:text-[#E58A16] hover:underline">अपना खाता बनाएं</Link>
            </div>
            <div className="text-center md:text-right text-[#E6D6BE] pt-2 border-t border-[#C99A3D]/20">
              © {new Date().getFullYear()} Divya Yagyam. All rights reserved. • सनातन सेवा ॐ 🙏
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

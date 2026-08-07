'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

import { usePathname } from 'next/navigation'

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Sacred Services',
    links: [
      { label: 'Online Puja Booking', href: '/pujas' },
      { label: 'VIP Temple Darshan', href: '/vip-pujas' },
      { label: 'BhaktiSeva', href: '/bhaktiseva' },
      { label: 'Jyotish & Astrology', href: '/astro' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Sacred Gallery', href: '/gallery' },
      { label: 'Festivals & Events', href: '/events' },
      { label: 'Vedic Blog', href: '/blog' },
      { label: 'Spiritual Products', href: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Support Desk', href: '/support' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refunds' },
      { label: 'Shipping Policy', href: '/shipping' },
    ],
  },
]

interface FooterProps {
  mapUrl?: string
  siteData?: any
  isDark?: boolean
}

export function Footer({ mapUrl, siteData, isDark }: FooterProps) {
  const pathname = usePathname()
  const isDarkTheme = isDark !== undefined ? isDark : (pathname === '/' || pathname?.startsWith('/vip-pujas'))

  const socials = siteData?.socials || siteConfig.socials
  const contact = siteData?.contact || siteConfig.contact

  const bgClass = isDarkTheme ? 'bg-[#0D0704] text-[#F5F0E6] border-t-2 border-[#D4AF37]/40' : 'bg-[#F5EBDD] text-[#3E2723] border-t-2 border-[#C9A227]/30'
  const textBodyClass = isDarkTheme ? 'text-[#C9C0B3]' : 'text-[#5A4A42]'
  const headingClass = isDarkTheme ? 'text-[#F4C430] font-heading font-bold' : 'text-[#7A1F2B] font-heading font-bold'
  const linkHoverClass = isDarkTheme ? 'hover:text-[#F4C430]' : 'hover:text-[#E85D04]'
  const iconBgClass = isDarkTheme ? 'bg-[rgba(212,175,55,0.15)] text-[#F4C430]' : 'bg-[#EAD9C4] text-[#7A1F2B]'

  return (
    <footer className={`relative transition-colors ${bgClass}`}>
      {/* Gold divider line top */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

      {/* Om background watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-20"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="container relative z-10 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="opacity-100">
              <Logo />
            </div>

            <p className={`text-sm leading-relaxed max-w-xs font-medium ${textBodyClass}`}>
              {siteData?.description || 'India\'s most trusted online portal for authentic Vedic pujas, VIP temple darshan, and sacred prasad home delivery.'}
            </p>

            {/* Gold divider */}
            <div className="h-0.5 w-16 bg-gradient-to-r from-[#D4AF37] to-transparent" />

            {/* Contact info */}
            <div className="space-y-3 text-sm font-medium">
              <a
                href={`tel:${(contact?.phone || '').replace(/[^0-9+]/g, '').split(',')[0]}`}
                className={`flex items-center gap-3 ${textBodyClass} ${linkHoverClass} transition-colors group`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-semibold">{contact?.phone || '+91-95871-71984'}</span>
              </a>
              <a
                href={`mailto:${contact?.email || 'seva@divyayagyam.com'}`}
                className={`flex items-center gap-3 ${textBodyClass} ${linkHoverClass} transition-colors group`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-semibold">{contact?.email || 'seva@divyayagyam.com'}</span>
              </a>
              <div className={`flex items-center gap-3 ${textBodyClass}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBgClass}`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="font-semibold text-xs">Jodhpur, Rajasthan • India</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="space-y-3">
              <p className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-[#D4AF37]' : 'text-[#7A1F2B]'}`}>Follow Our Journey</p>
              <div className="flex gap-3">
                {socials?.facebook && socials.facebook !== '#' && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${isDark ? 'border-[#D4AF37]/40 text-[#F5F0E6] hover:bg-[#D4AF37]/20 hover:text-[#F4C430]' : 'border-[#C9A227]/40 text-[#3E2723] hover:bg-[#E85D04] hover:text-white'}`}
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {socials?.instagram && socials.instagram !== '#' && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${isDark ? 'border-[#D4AF37]/40 text-[#F5F0E6] hover:bg-[#D4AF37]/20 hover:text-[#F4C430]' : 'border-[#C9A227]/40 text-[#3E2723] hover:bg-[#E85D04] hover:text-white'}`}
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {socials?.youtube && socials.youtube !== '#' && (
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${isDark ? 'border-[#D4AF37]/40 text-[#F5F0E6] hover:bg-[#D4AF37]/20 hover:text-[#F4C430]' : 'border-[#C9A227]/40 text-[#3E2723] hover:bg-[#E85D04] hover:text-white'}`}
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
                {socials?.twitter && socials.twitter !== '#' && (
                  <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${isDark ? 'border-[#D4AF37]/40 text-[#F5F0E6] hover:bg-[#D4AF37]/20 hover:text-[#F4C430]' : 'border-[#C9A227]/40 text-[#3E2723] hover:bg-[#E85D04] hover:text-white'}`}
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-2">
            {columns.slice(0, 2).map((col) => (
              <div key={col.title}>
                <h4 className={`text-xs font-bold uppercase tracking-[0.14em] mb-4 ${headingClass}`}>
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={`text-sm ${textBodyClass} ${linkHoverClass} transition-colors flex items-center gap-1.5 group font-medium`}
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-2">
            {columns.slice(2).map((col) => (
              <div key={col.title}>
                <h4 className={`text-xs font-bold uppercase tracking-[0.14em] mb-4 ${headingClass}`}>
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className={`text-sm ${textBodyClass} ${linkHoverClass} transition-colors flex items-center gap-1.5 group font-medium`}
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges strip */}
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-[#D4AF37]/30' : 'border-[#C9A227]/30'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span className={`text-xs font-bold uppercase tracking-widest hidden sm:block ${isDark ? 'text-[#D4AF37]' : 'text-[#7A1F2B]'}`}>Secure Payments</span>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#C9A227]/30 text-[#3E2723]'}`}>
                <div className="w-4 h-4 rounded-sm bg-[#2D72D9] flex items-center justify-center">
                  <span className="text-[7px] text-white font-black">R</span>
                </div>
                <span className="text-xs font-bold">Razorpay</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#C9A227]/30 text-[#3E2723]'}`}>
                <span className="text-xs font-black">UPI / GPay</span>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-[#C9A227]/30 text-[#3E2723]'}`}>
                <span className="text-xs font-bold">Cards & NetBanking</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-800">
                <span className="text-xs font-bold">🔒 100% SSL Secured</span>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <p className={`text-xs font-medium ${textBodyClass}`}>
                © {new Date().getFullYear()} DivyaYagyam. All rights reserved.
              </p>
              <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-[#F4C430]' : 'text-[#7A1F2B]'}`}>
                Made with devotion in Bharat 🇮🇳 &nbsp;• &nbsp;हरि ॐ 🙏
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin } from 'lucide-react'

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
}

export function Footer({ mapUrl, siteData }: FooterProps) {
  const socials = siteData?.socials || siteConfig.socials
  const contact = siteData?.contact || siteConfig.contact

  return (
    <footer className="footer-spiritual relative z-10 overflow-hidden">
      
      {/* Sacred Top Sanatani Banner Strip */}
      <div className="bg-gradient-to-r from-[#8B1A21] via-[#B84430] to-[#8B1A21] text-[#FFF7E6] py-2.5 px-4 text-center border-b-2 border-[#D49B00] shadow-sm">
        <div className="container mx-auto flex items-center justify-center gap-3 text-xs sm:text-sm font-extrabold tracking-wider uppercase">
          <span className="text-[#F5C842]">🌸</span>
          <span>सनातन धर्म • 100% प्रामाणिक वैदिक पूजा संस्थान • हरि ॐ</span>
          <span className="text-[#F5C842]">🪷</span>
        </div>
      </div>

      <div className="container relative z-10 py-10 md:py-12">
        
        {/* Main Grid — Compact 12 Cols */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Left Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Logo />
            </div>
            <p className="text-xs sm:text-sm text-[#4A2D1B] leading-relaxed max-w-xs font-semibold">
              {siteData?.description || 'भारत का सबसे भरोसेमंद सनातन संस्थान — 100% प्रामाणिक वैदिक पूजा, शक्तिपीठ अनुष्ठान एवं सिद्ध प्रसाद सेवा।'}
            </p>

            {/* Sacred Om & Contact Row */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col gap-2 text-xs font-extrabold text-[#2A1508]">
                <a
                  href={`tel:${(contact?.phone || '').replace(/[^0-9+]/g, '').split(',')[0]}`}
                  className="inline-flex items-center gap-2 text-[#8B1A21] hover:text-[#B84430] transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#8B1A21]" />
                  <span>संपर्क: {contact?.phone || '+91-95871-71984'}</span>
                </a>
                <a
                  href={`mailto:${contact?.email || 'seva@divyayagyam.com'}`}
                  className="inline-flex items-center gap-2 text-[#8B1A21] hover:text-[#B84430] transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#8B1A21]" />
                  <span>ईमेल: {contact?.email || 'seva@divyayagyam.com'}</span>
                </a>
              </div>

              {/* Compact Socials */}
              <div className="flex gap-2.5 pt-1">
                {socials?.facebook && socials.facebook !== '#' && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-[#FFFBF0] border-2 border-[#D49B00]/40 flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white transition-all text-xs shadow-xs"
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
                    className="w-8 h-8 rounded-full bg-[#FFFBF0] border-2 border-[#D49B00]/40 flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white transition-all text-xs shadow-xs"
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
                    className="w-8 h-8 rounded-full bg-[#FFFBF0] border-2 border-[#D49B00]/40 flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white transition-all text-xs shadow-xs"
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
                    className="w-8 h-8 rounded-full bg-[#FFFBF0] border-2 border-[#D49B00]/40 flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white transition-all text-xs shadow-xs"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Links — Compact 4 Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-black text-[#8B1A21] uppercase tracking-wider mb-3 flex items-center gap-1">
                  <span>🚩</span> {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-xs sm:text-sm text-[#4A2D1B] hover:text-[#8B1A21] transition-colors font-bold hover:underline"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-5 border-t-2 border-[#E5C16C]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4A2D1B]">
          
          {/* Trust Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="px-2.5 py-1 rounded-lg bg-[#FFFDF5] border border-[#D49B00]/40 text-[11px] font-black text-[#8B1A21] shadow-2xs">Razorpay Secure</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FFFDF5] border border-[#D49B00]/40 text-[11px] font-black text-[#2A1508] shadow-2xs">BHIM UPI</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FFFDF5] border border-[#D49B00]/40 text-[11px] font-black text-[#2A1508] shadow-2xs">Cards & NetBanking</span>
            <span className="px-2.5 py-1 rounded-lg bg-[#FFFDF5] border border-[#D49B00]/40 text-[11px] font-black text-emerald-800 shadow-2xs">🔒 256-bit SSL</span>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-right font-extrabold text-[#8B1A21]">
            © {new Date().getFullYear()} DivyaYagyam • मेड इन भारत 🇮🇳 • सर्व भवन्तु सुखिनः 🙏
          </div>

        </div>

      </div>
    </footer>
  )
}

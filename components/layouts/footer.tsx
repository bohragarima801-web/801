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
    <footer className="footer-spiritual border-t border-[#E5D5A5]">
      <div className="container relative z-10 py-8 md:py-10">
        
        {/* Main Grid — Compact 12 Cols */}
        <div className="grid gap-8 lg:grid-cols-12 items-start">

          {/* Left Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <Logo />
            <p className="text-xs text-[#5C4233] leading-relaxed max-w-xs font-medium">
              {siteData?.description || 'India\'s most trusted online portal for authentic Vedic pujas, VIP darshan, and sacred prasad.'}
            </p>

            {/* Quick Contact & Socials Row */}
            <div className="pt-1 space-y-2">
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#2C1810]">
                <a
                  href={`tel:${(contact?.phone || '').replace(/[^0-9+]/g, '').split(',')[0]}`}
                  className="flex items-center gap-1.5 hover:text-[#8B1A21] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-[#8B1A21]" />
                  <span>{contact?.phone || '+91-95871-71984'}</span>
                </a>
                <a
                  href={`mailto:${contact?.email || 'seva@divyayagyam.com'}`}
                  className="flex items-center gap-1.5 hover:text-[#8B1A21] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-[#8B1A21]" />
                  <span>{contact?.email || 'seva@divyayagyam.com'}</span>
                </a>
              </div>

              {/* Compact Socials */}
              <div className="flex gap-2 pt-1">
                {socials?.facebook && socials.facebook !== '#' && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-7 h-7 rounded-full bg-white border border-[#D8C28A] flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white transition-all text-xs shadow-2xs"
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
                    className="w-7 h-7 rounded-full bg-white border border-[#D8C28A] flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white transition-all text-xs shadow-2xs"
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
                    className="w-7 h-7 rounded-full bg-white border border-[#D8C28A] flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white transition-all text-xs shadow-2xs"
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
                    className="w-7 h-7 rounded-full bg-white border border-[#D8C28A] flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white transition-all text-xs shadow-2xs"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Links — Compact 4 Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-[11px] font-extrabold text-[#8B1A21] uppercase tracking-wider mb-2.5">
                  {col.title}
                </h4>
                <ul className="space-y-1.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-xs text-[#4A3225] hover:text-[#8B1A21] transition-colors font-medium hover:underline"
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

        {/* Compact Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-[#E8D49E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5C4233]">
          
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="px-2 py-0.5 rounded bg-white border border-[#E0CE95] text-[10px] font-bold text-[#8B1A21]">Razorpay</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E0CE95] text-[10px] font-bold text-[#2C1810]">UPI</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E0CE95] text-[10px] font-bold text-[#2C1810]">Cards & NetBanking</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#E0CE95] text-[10px] font-bold text-emerald-700">🔒 SSL</span>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-right font-medium">
            © {new Date().getFullYear()} DivyaYagyam • Made in Bharat 🇮🇳 • हरि ॐ 🙏
          </div>

        </div>

      </div>
    </footer>
  )
}

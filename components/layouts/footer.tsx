'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'

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
}

export function Footer({ mapUrl, siteData }: FooterProps) {
  const socials = siteData?.socials || siteConfig.socials
  const contact = siteData?.contact || siteConfig.contact

  return (
    <footer className="footer-spiritual border-t-2 border-[#F2C94C]">
      {/* Om watermark pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none opacity-40"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B37B00' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="container relative z-10 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo */}
            <div>
              <Logo />
            </div>

            <p className="text-sm text-[#4A2D1B] leading-relaxed max-w-xs font-medium">
              {siteData?.description || 'India\'s most trusted online portal for authentic Vedic pujas, VIP temple darshan, and sacred prasad home delivery.'}
            </p>

            {/* Gold divider */}
            <div className="h-0.5 w-16 bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-transparent rounded-full" />

            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${(contact?.phone || '').replace(/[^0-9+]/g, '').split(',')[0]}`}
                className="flex items-center gap-3 text-[#2A1508] hover:text-[#8B1A21] transition-colors group font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-[#FFF5D6] border border-[#F2C94C] flex items-center justify-center shrink-0 group-hover:bg-[#8B1A21] group-hover:text-white transition-all">
                  <Phone className="h-4 w-4 text-[#8B1A21] group-hover:text-white" />
                </div>
                <span>{contact?.phone || '+91-95871-71984'}</span>
              </a>
              <a
                href={`mailto:${contact?.email || 'seva@divyayagyam.com'}`}
                className="flex items-center gap-3 text-[#2A1508] hover:text-[#8B1A21] transition-colors group font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-[#FFF5D6] border border-[#F2C94C] flex items-center justify-center shrink-0 group-hover:bg-[#8B1A21] group-hover:text-white transition-all">
                  <Mail className="h-4 w-4 text-[#8B1A21] group-hover:text-white" />
                </div>
                <span>{contact?.email || 'seva@divyayagyam.com'}</span>
              </a>
              <div className="flex items-center gap-3 text-[#5A3C29] font-medium">
                <div className="w-8 h-8 rounded-full bg-[#FFF5D6] border border-[#F2C94C] flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-[#8B1A21]" />
                </div>
                <span className="text-xs font-bold">Jodhpur, Rajasthan • India</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold text-[#8B5A00] uppercase tracking-widest">Follow Our Journey</p>
              <div className="flex gap-3">
                {socials?.facebook && socials.facebook !== '#' && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full bg-white border border-[#E6B800] flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white hover:border-[#8B1A21] shadow-xs transition-all duration-200"
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
                    className="w-9 h-9 rounded-full bg-white border border-[#E6B800] flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white hover:border-[#8B1A21] shadow-xs transition-all duration-200"
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
                    className="w-9 h-9 rounded-full bg-white border border-[#E6B800] flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white hover:border-[#8B1A21] shadow-xs transition-all duration-200"
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
                    className="w-9 h-9 rounded-full bg-white border border-[#E6B800] flex items-center justify-center text-[#8B1A21] hover:bg-[#8B1A21] hover:text-white hover:border-[#8B1A21] shadow-xs transition-all duration-200"
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
                <h4 className="text-[11px] font-extrabold text-[#8B1A21] uppercase tracking-[0.14em] mb-4 font-heading">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-[#3D2314] hover:text-[#8B1A21] transition-colors flex items-center gap-1.5 group font-medium"
                      >
                        <ArrowRight className="h-3 w-3 text-[#D49B00] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
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
                <h4 className="text-[11px] font-extrabold text-[#8B1A21] uppercase tracking-[0.14em] mb-4 font-heading">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-[#3D2314] hover:text-[#8B1A21] transition-colors flex items-center gap-1.5 group font-medium"
                      >
                        <ArrowRight className="h-3 w-3 text-[#D49B00] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
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
        <div className="mt-12 pt-8 border-t border-[#E6C868]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Payment trust badges */}
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span className="text-[10px] text-[#8B5A00] uppercase tracking-widest font-extrabold hidden sm:block">Secure Payments</span>
              {/* Razorpay badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#E6C868] shadow-xs">
                <div className="w-4 h-4 rounded-sm bg-[#2D72D9] flex items-center justify-center">
                  <span className="text-[7px] text-white font-black">R</span>
                </div>
                <span className="text-[11px] text-[#2A1508] font-bold">Razorpay</span>
              </div>
              {/* UPI badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#E6C868] shadow-xs">
                <span className="text-[11px] font-black text-[#8B1A21]">UPI</span>
              </div>
              {/* Cards badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#E6C868] shadow-xs">
                <span className="text-[11px] text-[#2A1508] font-bold">Cards & NetBanking</span>
              </div>
              {/* SSL badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#E6C868] shadow-xs">
                <span className="text-[10px] text-emerald-700 font-extrabold">🔒 SSL Secured</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center sm:text-right">
              <p className="text-[11px] text-[#5A3C29] font-bold">
                © {new Date().getFullYear()} DivyaYagyam. All rights reserved.
              </p>
              <p className="text-[11px] text-[#8B1A21] font-extrabold mt-0.5">
                Made with devotion in Bharat 🇮🇳 &nbsp;• &nbsp;हरि ॐ 🙏
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

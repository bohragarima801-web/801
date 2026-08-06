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
    <footer className="footer-spiritual">
      {/* Om watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A87C28' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="container relative z-10 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Logo on dark */}
            <div className="opacity-95">
              <Logo />
            </div>

            <p className="text-sm text-[rgba(245,235,220,0.60)] leading-relaxed max-w-xs font-light">
              {siteData?.description || 'India\'s most trusted online portal for authentic Vedic pujas, VIP temple darshan, and sacred prasad home delivery.'}
            </p>

            {/* Gold divider */}
            <div className="h-px w-16 bg-gradient-to-r from-[#A87C28] to-transparent" />

            {/* Contact info */}
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${(contact?.phone || '').replace(/[^0-9+]/g, '').split(',')[0]}`}
                className="flex items-center gap-3 text-[rgba(245,235,220,0.65)] hover:text-[#D4A843] transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-[rgba(168,124,40,0.15)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(168,124,40,0.25)] transition-colors">
                  <Phone className="h-3.5 w-3.5 text-[#D4A843]" />
                </div>
                <span className="font-medium">{contact?.phone || '+91-95871-71984'}</span>
              </a>
              <a
                href={`mailto:${contact?.email || 'seva@divyayagyam.com'}`}
                className="flex items-center gap-3 text-[rgba(245,235,220,0.65)] hover:text-[#D4A843] transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-[rgba(168,124,40,0.15)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(168,124,40,0.25)] transition-colors">
                  <Mail className="h-3.5 w-3.5 text-[#D4A843]" />
                </div>
                <span className="font-medium">{contact?.email || 'seva@divyayagyam.com'}</span>
              </a>
              <div className="flex items-center gap-3 text-[rgba(245,235,220,0.55)]">
                <div className="w-7 h-7 rounded-full bg-[rgba(168,124,40,0.15)] flex items-center justify-center shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-[#D4A843]" />
                </div>
                <span className="font-medium text-xs">Jodhpur, Rajasthan • India</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-[rgba(245,235,220,0.35)] uppercase tracking-widest">Follow Our Journey</p>
              <div className="flex gap-3">
                {socials?.facebook && socials.facebook !== '#' && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-9 h-9 rounded-full border border-[rgba(168,124,40,0.25)] flex items-center justify-center text-[rgba(245,235,220,0.50)] hover:text-[#D4A843] hover:border-[rgba(168,124,40,0.55)] hover:bg-[rgba(168,124,40,0.10)] transition-all duration-200"
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
                    className="w-9 h-9 rounded-full border border-[rgba(168,124,40,0.25)] flex items-center justify-center text-[rgba(245,235,220,0.50)] hover:text-[#D4A843] hover:border-[rgba(168,124,40,0.55)] hover:bg-[rgba(168,124,40,0.10)] transition-all duration-200"
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
                    className="w-9 h-9 rounded-full border border-[rgba(168,124,40,0.25)] flex items-center justify-center text-[rgba(245,235,220,0.50)] hover:text-[#D4A843] hover:border-[rgba(168,124,40,0.55)] hover:bg-[rgba(168,124,40,0.10)] transition-all duration-200"
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
                    className="w-9 h-9 rounded-full border border-[rgba(168,124,40,0.25)] flex items-center justify-center text-[rgba(245,235,220,0.50)] hover:text-[#D4A843] hover:border-[rgba(168,124,40,0.55)] hover:bg-[rgba(168,124,40,0.10)] transition-all duration-200"
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
                <h4 className="text-[10px] font-bold text-[#D4A843] uppercase tracking-[0.14em] mb-4 font-display">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-[rgba(245,235,220,0.55)] hover:text-[rgba(245,235,220,0.90)] transition-colors flex items-center gap-1.5 group font-light"
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
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
                <h4 className="text-[10px] font-bold text-[#D4A843] uppercase tracking-[0.14em] mb-4 font-display">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-[rgba(245,235,220,0.55)] hover:text-[rgba(245,235,220,0.90)] transition-colors flex items-center gap-1.5 group font-light"
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
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
        <div className="mt-12 pt-8 border-t border-[rgba(168,124,40,0.15)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Payment trust badges */}
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <span className="text-[10px] text-[rgba(245,235,220,0.30)] uppercase tracking-widest font-bold hidden sm:block">Secure Payments</span>
              {/* Razorpay badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)]">
                <div className="w-4 h-4 rounded-sm bg-[#2D72D9] flex items-center justify-center">
                  <span className="text-[7px] text-white font-black">R</span>
                </div>
                <span className="text-[11px] text-[rgba(245,235,220,0.50)] font-semibold">Razorpay</span>
              </div>
              {/* UPI badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)]">
                <span className="text-[11px] font-black text-[rgba(245,235,220,0.60)]">UPI</span>
              </div>
              {/* Cards badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)]">
                <span className="text-[11px] text-[rgba(245,235,220,0.50)] font-semibold">Cards & NetBanking</span>
              </div>
              {/* SSL badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)]">
                <span className="text-[10px] text-emerald-400 font-bold">🔒 SSL Secured</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center sm:text-right">
              <p className="text-[11px] text-[rgba(245,235,220,0.30)]">
                © {new Date().getFullYear()} DivyaYagyam. All rights reserved.
              </p>
              <p className="text-[11px] text-[rgba(245,235,220,0.22)] mt-0.5">
                Made with devotion in Bharat 🇮🇳 &nbsp;• &nbsp;हरि ॐ 🙏
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

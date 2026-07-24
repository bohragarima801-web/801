'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react'

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Services',
    links: [
      { label: 'Online Puja', href: '/pujas' },
      { label: 'VIP Puja', href: '/vip-pujas' },
      { label: 'BhaktiSeva', href: '/bhaktiseva' },
      { label: 'Astrology', href: '/astro' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Gallery', href: '/gallery' },
      { label: 'Events', href: '/events' },
      { label: 'Blog', href: '/blog' },
      { label: 'Products', href: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Support', href: '/support' },
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
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
]

interface FooterProps {
  mapUrl?: string
}

export function Footer({ mapUrl }: FooterProps) {
  return (
    <footer className="footer-spiritual">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              {siteConfig.description}
            </p>
            
            {/* Newsletter Subscription (Archived) */}

            <div className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {siteConfig.contact.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {siteConfig.contact.phone}</div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <a href={siteConfig.socials.facebook} className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href={siteConfig.socials.instagram} className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href={siteConfig.socials.youtube} className="text-muted-foreground hover:text-primary"><Youtube className="h-5 w-5" /></a>
              <a href={siteConfig.socials.twitter} className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dynamic Google Map Section */}
        {mapUrl && (
          <div className="mt-10 rounded-3xl overflow-hidden border shadow-sm h-64 md:h-80 w-full relative">
            <iframe
              src={mapUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DivyaYagyam. All rights reserved. • हरि ओम् 🙏
          </p>
          <p className="text-xs text-muted-foreground">Made with devotion in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}

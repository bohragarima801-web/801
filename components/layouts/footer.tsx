'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import {
  Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, ArrowRight,
  ShieldCheck, Lock, CheckCircle2, MessageCircle
} from 'lucide-react'

interface FooterProps {
  mapUrl?: string
  siteData?: any
  isDark?: boolean
}

export function Footer({ siteData }: FooterProps) {
  const socials = siteData?.socials || siteConfig.socials
  const contact = siteData?.contact || siteConfig.contact

  return (
    <footer className="relative z-10 bg-[#0B0D11] text-zinc-300 border-t border-amber-500/20 pt-12 pb-24 md:pb-10 notranslate" translate="no">
      {/* ── Subtitle hairline gold glow ── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* ============================================================
            MAIN 4-COLUMN PRO-LEVEL GRID
            ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 border-b border-zinc-800">
          
          {/* Col 1: Brand & Credibility (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Logo />
            
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-sm font-normal">
              भारत का प्रामाणिक ऑनलाइन वैदिक पूजा, महायज्ञ एवं पावन संकल्प मंच। काशी, उज्जैन व सिद्ध शक्तिपीठों से वरिष्ठ वेदाचार्यों द्वारा शास्त्रसम्मत अनुष्ठान व WhatsApp वीडियो प्रमाण।
            </p>

            {/* Micro-Trust Highlights */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-amber-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>100% वैदिक विधि</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>नाम-गोत्र संकल्प</span>
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socials?.facebook && (
                <a
                  href={socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition-all"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socials?.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition-all"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socials?.youtube && (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-amber-600 hover:border-amber-600 transition-all"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: मुख्य पूजा सेवाएँ (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">
              पवित्र पूजा सेवाएँ
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-400">
              {[
                { label: 'महामृत्युंजय मंत्र जाप व रुद्राभिषेक', href: '/pujas/mahamrityunjaya-jaap-rudrabhishekam' },
                { label: 'माँ बगलामुखी मिर्ची हवन', href: '/pujas/maa-bagalamukhi-mirchi-hawan' },
                { label: 'कालसर्प दोष शांति पूजा (₹901)', href: '/pujas/kalsarp-dosh-nivaran-puja' },
                { label: 'पितृ शांति विशेष एवं तर्पण महापूजा', href: '/pujas/pitra-shanti-vishesh-sarva-pitra-tarpan-puja' },
                { label: 'शनि साढ़ेसाती व ढैय्या शांति यज्ञ', href: '/pujas/shani-saadesati-dhaiya-dosh-nivaran-yagya' },
                { label: 'विशिष्ट VIP एकल महा अनुष्ठान', href: '/vip-pujas' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="h-3 w-3 text-amber-500/60 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: वैदिक साधन व सेवाएँ (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">
              साधन व सेवाएँ
            </h4>
            <ul className="space-y-2 text-xs font-medium text-zinc-400">
              {[
                { label: '🤖 AI पंडित जी (फ्री)', href: '/ask-a-pandit' },
                { label: '☀️ निःशुल्क जन्म कुंडली', href: '/tools/kundali' },
                { label: '📅 दैनिक पंचांग', href: '/panchang' },
                { label: '💖 कुंडली मिलान', href: '/tools/milan' },
                { label: '⏰ शुभ मुहूर्त', href: '/muhurat' },
                { label: '⚡ अभिमंत्रित सामग्री स्टोर', href: '/products' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="h-3 w-3 text-amber-500/60 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                    <span>{l.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: संपर्क एवं सहायता (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">
              सहायता एवं संपर्क
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <a
                href="tel:+919530401984"
                className="hover:text-amber-400 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0 text-amber-400">
                  <Phone className="h-3 w-3" />
                </div>
                <span className="font-bold text-white">+91 95304 01984</span>
              </a>

              <a
                href="mailto:seva@divyayagyam.com"
                className="hover:text-amber-400 transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0 text-amber-400">
                  <Mail className="h-3 w-3" />
                </div>
                <span className="truncate">seva@divyayagyam.com</span>
              </a>

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700/60 flex items-center justify-center shrink-0 text-amber-400">
                  <MapPin className="h-3 w-3" />
                </div>
                <span className="text-[11px]">माँ कात्यायनी शक्तिपीठ, जोधपुर (राज.)</span>
              </div>

              {/* Direct WhatsApp Button */}
              <div className="pt-1">
                <a
                  href="https://wa.me/919530401984?text=जय%20श्री%20राम!%20मुझे%20पूजा%20हेतु%20सहायता%20चाहिए।"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5 fill-white" />
                  <span>WhatsApp सहायता</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* ============================================================
            BOTTOM BAR: TRUST + LEGAL + COPYRIGHT
            ============================================================ */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-zinc-500">
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-zinc-400">
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">Razorpay Verified</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300">UPI / Cards / NetBanking</span>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-900 border border-emerald-900/60 text-emerald-400 inline-flex items-center gap-1">
              <Lock className="h-3 w-3" /> 256-Bit SSL
            </span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <Link href="/about" className="hover:text-amber-400 transition-colors">हमारे बारे में</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">नियम व शर्तें</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">प्राइवेसी पॉलिसी</Link>
            <span>•</span>
            <Link href="/refunds" className="hover:text-amber-400 transition-colors">रिफंड पॉलिसी</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-amber-400 transition-colors">संपर्क</Link>
          </div>

          {/* Copyright */}
          <div className="text-[11px] text-zinc-500">
            © {new Date().getFullYear()} DivyaYagyam. All rights reserved. • सनातन सेवा ॐ 🙏
          </div>
        </div>

      </div>
    </footer>
  )
}

'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import {
  Facebook, Instagram, Youtube, Twitter, Mail, Phone, MapPin, ArrowRight,
  Lock, MessageCircle
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
    <footer
      className="divyayagyam-footer relative z-10 bg-[#0F1115] text-zinc-300 border-t border-zinc-800/80 pt-10 pb-28 md:pb-10 notranslate font-sans"
      translate="no"
    >
      {/* Subtle Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E58A16] to-transparent opacity-80" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        
        {/* 1. COMPACT 1-LINE TRUST STRIP */}
        <div className="pb-7 mb-8 border-b border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="text-base sm:text-lg">🕉️</span>
            <div>
              <p className="text-xs font-bold text-white leading-tight">शास्त्रसम्मत विधि</p>
              <p className="text-[11px] text-zinc-400 leading-tight">वैदिक परंपरा व कर्मकांड</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="text-base sm:text-lg">📜</span>
            <div>
              <p className="text-xs font-bold text-white leading-tight">नाम-गोत्र संकल्प</p>
              <p className="text-[11px] text-zinc-400 leading-tight">समर्पित व्यक्तिगत आहुति</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="text-base sm:text-lg">📹</span>
            <div>
              <p className="text-xs font-bold text-white leading-tight">वीडियो प्रमाण</p>
              <p className="text-[11px] text-zinc-400 leading-tight">WhatsApp पर संकल्प दर्शन</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <span className="text-base sm:text-lg">📦</span>
            <div>
              <p className="text-xs font-bold text-white leading-tight">पावन प्रसाद</p>
              <p className="text-[11px] text-zinc-400 leading-tight">सुरक्षित घर तक डिलीवरी</p>
            </div>
          </div>
        </div>

        {/* 2. MAIN 4-COLUMN FOOTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10">
          
          {/* Col 1: Brand & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="brightness-110">
              <Logo />
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              भारत की सबसे भरोसेमंद ऑनलाइन वैदिक पूजा एवं संकल्प सेवा। काशी, महाकाल व सिद्ध शक्तिपीठों के विद्वान आचार्यों द्वारा विधिपूर्वक संपन्न अनुष्ठान।
            </p>

            <div className="space-y-2 pt-1 text-xs text-zinc-300">
              <a
                href={`tel:${(contact?.phone || '+919530401984').replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="font-semibold">{contact?.phone || '+91 95304 01984'}</span>
              </a>

              <a
                href={`mailto:${contact?.email || 'seva@divyayagyam.com'}`}
                className="flex items-center gap-2 text-zinc-300 hover:text-amber-400 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{contact?.email || 'seva@divyayagyam.com'}</span>
              </a>

              <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>माँ कात्यायनी शक्तिपीठ, जोधपुर (राजस्थान)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919530401984?text=जय%20श्री%20राम!%20मुझे%20पूजा%20बुकिंग%20हेतु%20जानकारी%20चाहिए।"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="h-3.5 w-3.5 fill-white" />
                <span>WhatsApp सहायता</span>
              </a>

              <div className="flex items-center gap-2">
                {socials?.facebook && socials.facebook !== '#' && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    aria-label="Facebook"
                    className="w-7 h-7 rounded-lg bg-zinc-800/80 hover:bg-amber-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
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
                    className="w-7 h-7 rounded-lg bg-zinc-800/80 hover:bg-amber-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
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
                    className="w-7 h-7 rounded-lg bg-zinc-800/80 hover:bg-amber-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
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
                    className="w-7 h-7 rounded-lg bg-zinc-800/80 hover:bg-amber-600 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Twitter className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: सिद्ध अनुष्ठान व पूजाएं (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider font-heading">
              सिद्ध अनुष्ठान व पूजाएं
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'माँ बगलामुखी मिर्ची हवन', href: '/pujas/maa-bagalamukhi-mirchi-hawan' },
                { label: 'महारुद्राभिषेक व मृत्युंजय जाप', href: '/pujas/mahamrityunjaya-jaap-rudrabhishekam' },
                { label: 'कालसर्प दोष शांति पूजा', href: '/pujas/kalsarp-dosh-shanti-puja' },
                { label: 'पितृ शांति व सर्व पितृ तर्पण', href: '/pujas/pitra-shanti-vishesh-sarva-pitra-tarpan-puja' },
                { label: 'नवग्रह शांति महायज्ञ', href: '/pujas/navgrah-shanti-sarva-graha-dosh-nivaran-puja' },
                { label: '👑 VIP विशिष्ट 1-on-1 अनुष्ठान', href: '/vip-pujas' },
              ].map((p) => (
                <li key={p.label}>
                  <Link
                    href={p.href}
                    className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-amber-500/70 text-[10px]">›</span>
                    <span>{p.label}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/pujas"
                  className="text-amber-400 hover:text-amber-300 font-bold text-xs inline-flex items-center gap-1"
                >
                  <span>सभी पूजाएं देखें</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: ज्योतिष व पंचांग टूल्स (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider font-heading">
              वैदिक ज्योतिष व टूल्स
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'दैनिक पंचांग व चौघड़िया', href: '/panchang' },
                { label: 'निःशुल्क जन्मकुंडली', href: '/tools/kundali' },
                { label: 'शुभ मुहूर्त व तिथि', href: '/muhurat' },
                { label: 'कुंडली मिलान (गुण मिलान)', href: '/tools/milan' },
                { label: 'गणेश सिद्ध प्रश्नवाली', href: '/tools/shree-ganesh-siddha-prashnavali' },
                { label: 'डिजिटल जाप माला', href: '/tools/mala' },
                { label: '🤖 AI पंडित जी परामर्श', href: '/ask-a-pandit' },
              ].map((t) => (
                <li key={t.label}>
                  <Link
                    href={t.href}
                    className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-amber-500/70 text-[10px]">›</span>
                    <span>{t.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: संस्थान व सहायता (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider font-heading">
              सहायता व जानकारी
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'हमारे बारे में', href: '/about' },
                { label: 'संपर्क करें', href: '/contact' },
                { label: 'अक्सर पूछे जाने वाले सवाल', href: '/faq' },
                { label: 'पावन ब्लॉग व ज्ञान', href: '/blog' },
                { label: 'त्योहार कैलेंडर', href: '/festivals' },
                { label: 'भक्ति सेवा', href: '/bhaktiseva' },
                { label: 'सत्यापित प्रमाण गैलरी', href: '/gallery' },
              ].map((info) => (
                <li key={info.label}>
                  <Link
                    href={info.href}
                    className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-amber-500/70 text-[10px]">›</span>
                    <span>{info.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 3. REFINED BOTTOM BAR (1 Single Sleek Row) */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 text-center md:text-left">
          
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} दिव्ययज्ञम् (DivyaYagyam)</span>
            <span>•</span>
            <span className="text-zinc-400">सनातन सेवा ॐ</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <Lock className="h-3 w-3 text-emerald-400 shrink-0" />
            <span>100% सुरक्षित भुगतान: Razorpay • UPI • 256-Bit SSL</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-zinc-400 flex-wrap justify-center">
            <Link href="/terms" className="hover:text-zinc-200 transition-colors">नियम व शर्तें</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors">गोपनीयता</Link>
            <span>•</span>
            <Link href="/refunds" className="hover:text-zinc-200 transition-colors">रिफंड नीति</Link>
            <span>•</span>
            <Link href="/shipping" className="hover:text-zinc-200 transition-colors">शिपिंग</Link>
          </div>

        </div>

      </div>
    </footer>
  )
}


import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { getSafeImageUrl } from '@/lib/utils'
import { MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { getCachedPujas } from '@/lib/cache'
import { SacredImageFrame } from '@/components/ui/safe-image'

import { PujaCard } from '@/components/puja-card'

export function generateMetadata() {
  return generatePageMeta({
    title: 'Online Puja Booking – Rudrabhishek, Havan & Dosh Nivaran | DivyaYagyam',
    description: '100+ वैदिक पूजा अनुष्ठान ऑनलाइन बुक करें। रुद्राभिषेक, कालसर्प दोष निवारण, नवग्रह शांति — विद्वान आचार्यों द्वारा नाम व गोत्र संकल्प।',
    path: '/pujas',
  })
}

export const revalidate = 3600

export default async function PujasPage() {
  const pujas = await getCachedPujas()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Sacred Online Vedic Pujas',
        itemListElement: pujas.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.name,
          url: `${BASE_URL}/pujas/${p.slug}`,
        })),
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Pujas', url: `${BASE_URL}/pujas` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-pujas-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner (Bright Sanatani Gold) */}
      <section className="relative bg-gradient-to-b from-[#FFF8EB] via-[#FFF3D6] to-[#FFFDF7] py-16 md:py-24 overflow-hidden border-b border-[#F5E2B8]">
        {/* Om watermark */}
        <div aria-hidden="true" className="absolute right-0 top-0 text-[30vw] font-serif text-[rgba(212,155,0,0.06)] leading-none pointer-events-none select-none overflow-hidden">ॐ</div>

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5D6] border border-[#F2C94C] shadow-xs mb-6">
            <span className="text-[#8B5A00] text-[11px] font-extrabold uppercase tracking-[0.14em]">🪔 Sacred Vedic Rituals (वैदिक अनुष्ठान)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#2A1508] leading-[1.15] mb-4">
            Sacred Pujas &{' '}
            <span className="bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] bg-clip-text text-transparent">Vedic Anushthans</span>
          </h1>

          <p className="text-base sm:text-lg text-[#4A2D1B] max-w-2xl mx-auto leading-relaxed font-medium">
            भारत के सुप्रसिद्ध शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे लाइव-स्ट्रीम पूजा। अपने नाम व गोत्र से संकल्प करवाएं — प्रसाद घर द्वार।
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {['Verified Pandits', 'Name-Gotra Sankalp', 'WhatsApp Video Proof', 'Prasad Home Delivery'].map((t) => (
              <span key={t} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-full border border-[#F0D695] text-xs font-bold text-[#2A1508] shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-[#8B1A21] shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Puja Cards Grid */}
      <section className="bg-[#FFFBF5] dark:bg-[#0C0402] py-14 md:py-20">
        <div className="container px-4 md:px-6">
          {pujas.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[rgba(139,26,33,0.08)] flex items-center justify-center mx-auto mb-5">
                <Sparkles className="h-9 w-9 text-[#8B1A21]" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-[#1E120A] dark:text-[#F5EBDC] mb-2">
                Pujas Coming Soon
              </h3>
              <p className="text-[#8B7355] dark:text-[rgba(245,235,220,0.55)] text-sm leading-relaxed">
                Our team is preparing sacred puja schedules. Check back soon or contact us for a custom ritual.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Contact for Custom Puja <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {pujas.map((p, idx) => (
                <PujaCard key={p.id} puja={p} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

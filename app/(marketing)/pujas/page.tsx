import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck, Crown } from 'lucide-react'
import { getCachedPujas } from '@/lib/cache'
import { PujaCard } from '@/components/puja-card'

export function generateMetadata() {
  return generatePageMeta({
    title: 'ऑनलाइन पूजा अनुष्ठान एवं महायज्ञ',
    description: '100+ प्रामाणिक वैदिक पूजा अनुष्ठान ऑनलाइन बुक करें। रुद्राभिषेक, कालसर्प दोष निवारण, नवग्रह शांति — विद्वान आचार्यों द्वारा नाम व गोत्र संकल्प।',
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
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-pujas-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner (Warm Ivory × Saffron) ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-14 md:py-20 overflow-hidden border-b border-[#E6D6BE]">
        {/* Subtle Om watermark */}
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E6D6BE] shadow-2xs mb-4">
            <span className="text-[#E58A16] text-xs font-black uppercase tracking-wider">🪔 प्रामाणिक वैदिक पूजा एवं महायज्ञ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-3">
            पवित्र पूजा एवं <span className="text-[#E58A16]">वैदिक अनुष्ठान</span>
          </h1>

          <p className="text-sm sm:text-base text-[#4A403C] max-w-2xl mx-auto leading-relaxed font-medium">
            भारत के सुप्रसिद्ध शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे लाइव-स्ट्रीम पूजा। अपने नाम व गोत्र से संकल्प करवाएं — प्रसाद घर द्वार।
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center mt-7">
            {['वेद प्रमाणित पंडित', 'नाम-गोत्र संकल्प', 'व्हाट्सएप वीडियो प्रमाण', 'सिद्ध प्रसाद घर डिलीवरी'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white rounded-full border border-[#E6D6BE] text-xs font-bold text-[#292321] shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-[#E58A16] shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Puja Cards Grid ── */}
      <section className="bg-[#FFF9EF] py-12 md:py-16">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          {pujas.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-[#E6D6BE] p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#F7EBD7] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-[#E58A16]" />
              </div>
              <h3 className="text-xl font-bold text-[#292321] mb-2">
                पूजा अनुष्ठान शीघ्र उपलब्ध होंगे
              </h3>
              <p className="text-xs text-[#4A403C] leading-relaxed">
                हमारी टीम नवीन पूजा तिथियां निर्धारित कर रही है। कृपया कुछ समय पश्चात देखें अथवा विशिष्ट अनुष्ठान हेतु संपर्क करें।
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-xl bg-[#E58A16] text-white text-xs font-bold shadow-md hover:bg-[#d4790e] transition-all"
              >
                विशिष्ट पूजा हेतु संपर्क करें <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pujas.map((p, idx) => (
                <PujaCard key={p.id} puja={p} idx={idx} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

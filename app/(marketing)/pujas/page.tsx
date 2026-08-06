
import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { getSafeImageUrl } from '@/lib/utils'
import { MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { getCachedPujas } from '@/lib/cache'
import { SacredImageFrame } from '@/components/ui/safe-image'

export function generateMetadata() {
  return generatePageMeta({
    title: 'ऑनलाइन पूजा बुकिंग — काशी, महाकाल, उज्जैन | DivyaYagyam',
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

      {/* ── Hero Banner */}
      <section className="relative bg-gradient-to-b from-[#0C0402] via-[#16070A] to-[#0C0402] py-16 md:py-24 overflow-hidden">
        {/* Om watermark */}
        <div aria-hidden="true" className="absolute right-0 top-0 text-[30vw] font-serif text-[rgba(168,124,40,0.04)] leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        {/* Gold gradient overlay bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FFFBF5] dark:from-[#0A0302] to-transparent pointer-events-none" />

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[rgba(168,124,40,0.12)] border border-[rgba(168,124,40,0.25)] mb-6">
            <span className="text-[#D4A843] text-[10px] font-bold uppercase tracking-[0.14em] font-display">🔥 Sacred Vedic Rituals</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-[1.15] mb-4">
            Sacred Pujas &{' '}
            <span className="gold-gradient-text">Vedic Anushthans</span>
          </h1>

          <p className="text-base sm:text-lg text-[rgba(245,235,220,0.65)] max-w-2xl mx-auto leading-relaxed font-light">
            भारत के सुप्रसिद्ध शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे लाइव-स्ट्रीम पूजा। अपने नाम व गोत्र से संकल्प करवाएं — प्रसाद घर द्वार।
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {['Verified Pandits', 'Name-Gotra Sankalp', 'WhatsApp Video Proof', 'Prasad Home Delivery'].map((t) => (
              <span key={t} className="stat-badge stat-badge-dark text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-[#D4A843] shrink-0" />
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pujas.map((p, idx) => (
                <article
                  key={p.id}
                  className={`puja-card-premium reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}
                >
                  {/* Image */}
                  <Link href={`/pujas/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                    <SacredImageFrame
                      src={p.coverImage}
                      alt={p.name}
                      aspectRatio="4/3"
                      seoCategory="puja"
                    />
                    {/* Dark gradient over image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,4,2,0.65)] via-[rgba(12,4,2,0.10)] to-transparent pointer-events-none" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      {p.isVip && (
                        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-[10px] font-bold shadow-md">
                          ⭐ VIP
                        </span>
                      )}
                      {p.badge && (
                        <span className="px-2.5 py-1 rounded-full bg-[rgba(168,124,40,0.85)] text-white text-[10px] font-bold backdrop-blur-sm">
                          {p.badge}
                        </span>
                      )}
                    </div>

                    {/* Category on image bottom */}
                    {p.category?.name && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-[rgba(12,4,2,0.65)] backdrop-blur-sm text-[rgba(245,235,220,0.85)] text-[10px] font-semibold border border-[rgba(245,235,220,0.12)]">
                          {p.category.name}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-lg text-[#1E120A] dark:text-[#F5EBDC] line-clamp-2 leading-snug group-hover:text-[#8B1A21] transition-colors">
                        <Link href={`/pujas/${p.slug}`}>{p.name}</Link>
                      </h3>

                      {p.location && (
                        <p className="text-xs text-[#8B7355] dark:text-[rgba(245,235,220,0.50)] flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#A87C28] shrink-0" />
                          {p.location}
                        </p>
                      )}

                      <p className="text-xs text-[#5A4030] dark:text-[rgba(245,235,220,0.55)] line-clamp-2 leading-relaxed">
                        {(p.shortDescription || 'Participate in this sacred puja for peace, health, and prosperity.').replace(/<[^>]*>?/gm, '')}
                      </p>
                    </div>

                    {/* Price + CTA */}
                    <div className="pt-3 border-t border-[rgba(168,124,40,0.12)] flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-[#8B7355] dark:text-[rgba(245,235,220,0.40)] font-medium">Starting from</p>
                        <p className="text-xl font-black text-[#8B1A21] dark:text-[#E06070]">
                          ₹{(p.price || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <Link
                        href={`/pujas/${p.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
                      >
                        Book Now <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

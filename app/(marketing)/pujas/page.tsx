
import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { getSafeImageUrl } from '@/lib/utils'
import { MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'
import { getCachedNormalPujas } from '@/lib/cache'
import { SacredImageFrame } from '@/components/ui/safe-image'

export function generateMetadata() {
  return generatePageMeta({
    title: 'ऑनलाइन पूजा बुकिंग — काशी, महाकाल, उज्जैन | DivyaYagyam',
    description: '100+ वैदिक पूजा अनुष्ठान ऑनलाइन बुक करें। रुद्राभिषेक, कालसर्प दोष निवारण, नवग्रह शांति — विद्वान आचार्यों द्वारा नाम व गोत्र संकल्प।',
    path: '/pujas',
  })
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

const fallbackNormalPujas = [
  {
    id: 'fp-1',
    slug: 'maa-bagalamukhi-mirchi-hawan',
    name: 'माँ बगलामुखी मिर्ची हवन व विशेष शत्रुनिवारण अनुष्ठान',
    shortDescription: 'कोर्ट-कचहरी मुकदमों में विजय, शत्रु स्तंभन, तंत्र बाधा एवं व्यापारिक रुकावटों के सर्वनाश हेतु विशेष तीक्ष्ण मिर्ची महायज्ञ।',
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    price: 1100,
    badge: 'Most Booked',
    category: { name: 'महाविद्या अनुष्ठान' },
    isEvergreen: true,
    isVip: false,
    coverImage: '/bagalamukhi_mirchi_hawan_2.jpg'
  },
  {
    id: 'fp-2',
    slug: 'shani-saadesati-dhaiya-dosh-nivaran-yagya',
    name: 'शनि साढ़ेसाती, ढैय्या व शनि दोष निवारण महापूजा एवं शांति यज्ञ',
    shortDescription: 'शनि साढ़ेसाती, अष्टम ढैय्या, शनि महादशा, व्यापारिक घाटा व वात रोगों के शमन हेतु विशेष तैलभिषेक व शमी पत्र यज्ञ।',
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    price: 901,
    badge: 'Special',
    category: { name: 'नवग्रह शांति' },
    isEvergreen: true,
    isVip: false,
    coverImage: '/shani_dosh_yagya.jpg'
  },
  {
    id: 'fp-3',
    slug: 'navgrah-shanti-sarva-graha-dosh-nivaran-puja',
    name: 'नवग्रह शांति व सर्व ग्रह दोष निवारण महापूजा',
    shortDescription: 'सूर्य, चंद्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु एवं केतु की अशुभ दशा व ग्रह पीड़ा के सर्वथा शमन हेतु 9 समिधा हवन।',
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    price: 901,
    badge: 'Vedic',
    category: { name: 'नवग्रह शांति' },
    isEvergreen: true,
    isVip: false,
    coverImage: '/navgrah_shanti_yagya.jpg'
  },
  {
    id: 'fp-4',
    slug: 'pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
    name: 'पितृ शांति विशेष एवं सर्व पितृ तर्पण महापूजा',
    shortDescription: 'पितृ दोष शांति, पूर्वजों की तृप्ति, वंश वृद्धि व पारिवारिक सुख-शांति हेतु कुशा जल, काले तिल व जौ द्वारा सर्व पितृ तर्पण, पिंड दान एवं ब्राह्मण भोजन संकल्प।',
    location: 'Maa Katyayani Durga Shakti Peeth, Jodhpur, Rajasthan',
    price: 901,
    badge: 'Pitra Shanti',
    category: { name: 'पितृ दोष शांति' },
    isEvergreen: true,
    isVip: false,
    coverImage: '/pitra_shanti_tarpan.jpg'
  }
]

export default async function PujasPage() {
  const pujas = await getCachedNormalPujas()
  const displayPujas = pujas.length > 0 ? pujas : fallbackNormalPujas

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
            {['Experienced Pandits (अनुभवी वेदाचार्य)', 'Name-Gotra Sankalp', 'WhatsApp Video Proof', 'Prasad Home Delivery'].map((t) => (
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayPujas.map((p, idx) => (
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
        </div>
      </section>
    </>
  )
}

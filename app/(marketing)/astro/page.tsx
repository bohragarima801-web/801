import { PublicPageShell } from '@/components/public-page-shell'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'ज्योतिष परामर्श (Vedic Astrology) — Horoscope Guidance',
    description: 'वैदिक ज्योतिष परामर्श — कुण्डली विश्लेषण, ग्रह दोष निवारण, शुभ मुहूर्त एवं रत्न परामर्श। विद्वान ज्योतिषियों द्वारा ऑनलाइन मार्गदर्शन।',
    path: '/astro',
  })
}

export const revalidate = 3600; // ISR: Revalidate every 3600s

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Astrology', url: `${BASE_URL}/astro` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-astro-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPageShell
        badge="🔮 Astrology"
        title="Astro Reports"
        subtitle="Kundali • Milan • Numerology • Panchang"
        cta={{ label: 'Explore Tools', href: '/tools' }}
      />
    </>
  )
}

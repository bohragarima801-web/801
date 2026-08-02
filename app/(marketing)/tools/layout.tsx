import { generatePageMeta, BASE_URL } from '@/lib/seo'
import { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = generatePageMeta({
  title: 'निःशुल्क वैदिक ज्योतिष टूल — Spiritual & Astro Tools',
  description: 'कुण्डली मिलान, दैनिक पंचांग, शुभ मुहूर्त, रुद्राक्ष परामर्श, नामकरण एवं AI पंडित जी से ज्योतिष मार्गदर्शन बिल्कुल मुफ्त प्राप्त करें।',
  path: '/tools',
})

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Spiritual & Astro Tools | DivyaYagyam',
    description: 'Vedic Kundali Matching, Panchang, Shubh Muhurat, Rudraksha Suggestion & AI Astro Guidance.',
    url: `${BASE_URL}/tools`,
    publisher: {
      '@type': 'Organization',
      name: 'DivyaYagyam',
      url: BASE_URL,
    },
  }

  return (
    <>
      <Script
        id="schema-tools-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}

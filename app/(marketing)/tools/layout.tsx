import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'आध्यात्मिक वैदिक टूल्स — कुंडली, पंचांग, मुहूर्त | DivyaYagyam',
    description: 'मुफ्त वैदिक टूल्स। कुंडली, पंचांग, गुण मिलान, शुभ मुहूर्त और ज्योतिष टूल्स का उपयोग करें।',
    path: '/tools',
  })
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Tools', url: `${BASE_URL}/tools` },
      ]),
    ],
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

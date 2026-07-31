import { PublicPageShell } from '@/components/public-page-shell'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600; // ISR: Revalidate every 3600s

export function generateMetadata() {
  return generatePageMeta({
    title: 'संपर्क करें (Contact Us) — दिव्य यज्ञम | DivyaYagyam',
    description: 'दिव्य यज्ञम सहायता केंद्र। ऑनलाइन पूजा बुकिंग, संकल्प, या ज्योतिष परामर्श हेतु संपर्क करें। Email: seva@divyayagyam.com, Phone: +91-95871-71984.',
    path: '/contact',
  })
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: 'Contact DivyaYagyam',
        description: 'Get in touch with DivyaYagyam for online puja booking, spiritual guidance, and support.',
        url: `${BASE_URL}/contact`,
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Contact', url: `${BASE_URL}/contact` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-contact-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPageShell
        badge="📞 Contact"
        title="Get in Touch"
        subtitle="We're here to help"
        description="Email: seva@divyayagyam.com • Phone: +91-95871-71984, +91-95320-11984 • Website: Divyayagyam.com"
        cta={{ label: 'Send us a message', href: '/support' }}
      />
    </>
  )
}

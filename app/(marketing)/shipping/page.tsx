import { PublicPageShell } from '@/components/public-page-shell'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600; // ISR: Revalidate every 3600s

export function generateMetadata() {
  return generatePageMeta({
    title: 'Shipping Policy | DivyaYagyam',
    description: 'Abhimantrit prasad & spiritual products delivered across India (3-7 days) and worldwide.',
    path: '/shipping',
  })
}

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Shipping Policy', url: `${BASE_URL}/shipping` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-shipping-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPageShell
        title="Shipping Policy"
        description="Abhimantrit prasad delivered within 3–7 business days across India. International shipping available for select products."
      />
    </>
  )
}

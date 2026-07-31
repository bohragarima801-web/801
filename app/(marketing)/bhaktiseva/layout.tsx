import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'भक्ति सेवा (Bhakti Seva) — ऑनलाइन पुष्प, भोग व गौ सेवा | DivyaYagyam',
    description: 'सिद्ध मंदिरों में ऑनलाइन पुष्प अर्पण, भोग सेवा, दीप दान व गौ सेवा अर्पित करें। दिव्य यज्ञम भक्ति सेवा।',
    path: '/bhaktiseva',
  })
}

export default function BhaktiSevaLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Bhakti Seva', url: `${BASE_URL}/bhaktiseva` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-bhaktiseva-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}

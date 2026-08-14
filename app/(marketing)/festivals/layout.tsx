import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'सनातन व्रत एवं त्योहार कैलेंडर — सम्पूर्ण पर्व सूची',
  description: 'वर्ष के सभी प्रमुख हिंदू त्योहार, एकादशी, प्रदोष, पूर्णिमा, अमावस्या एवं जयंती तिथियों की प्रामाणिक वैदिक जानकारी।',
  path: '/festivals',
})

export default function FestivalsLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'सनातन व्रत एवं त्योहार कैलेंडर - Divyayagyam',
    description: 'प्रमुख हिंदू त्योहार, एकादशी, व्रत तिथियां एवं धार्मिक महत्व।',
    url: 'https://divyayagyam.com/festivals',
    inLanguage: ['hi', 'en'],
    publisher: {
      '@type': 'Organization',
      name: 'Divyayagyam',
      url: 'https://divyayagyam.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}

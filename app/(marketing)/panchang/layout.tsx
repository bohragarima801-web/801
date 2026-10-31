import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'आज का पंचांग — तिथि, नक्षत्र, राहुकाल, शुभ मुहूर्त',
  description: 'आज का वैदिक पंचांग (Aaj Ka Panchang): आज के वार, तिथि, नक्षत्र, योग, करण, राहुकाल, अभिजित मुहूर्त, शुभ मुहूर्त आज का 100% सटीक जानकारी',
  path: '/panchang',
})

export default function PanchangLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'आज का पंचांग (Aaj Ka Panchang) - Divyayagyam',
    description: 'सटीक वैदिक पंचांग, वार, तिथि, नक्षत्र, योग, करण, राहुकाल, अभिजित मुहूर्त',
    url: 'https://divyayagyam.com/panchang',
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

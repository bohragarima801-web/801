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
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'आज का पंचांग क्या है? (What is today Panchang?)',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'पंचांग वैदिक समय-गणना का 5 अंगों वाला शास्त्र है जिसमें वार, तिथि, नक्षत्र, योग और करण की जानकारी होती है।',
          },
        },
        {
          '@type': 'Question',
          name: 'आज का अभिजित मुहूर्त कब है? (When is today Abhijit Muhurat?)',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'अभिजित मुहूर्त दिन का सबसे शुभ मुहूर्त होता है, जो सामान्यतः दोपहर 11:55 AM से 12:45 PM तक रहता है।',
          },
        },
        {
          '@type': 'Question',
          name: 'आज का राहुकाल कब है? (When is today Rahu Kaal?)',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'राहुकाल प्रत्येक दिन अलग होता है जिसमें शुभ कार्यों का आरम्भ वर्जित माना जाता है, अतः आज का पंचांग से जानकारी लें।',
          },
        },
      ],
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

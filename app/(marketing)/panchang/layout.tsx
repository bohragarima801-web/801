import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'आज का पंचांग — तिथि, नक्षत्र व शुभ मुहूर्त',
  description: 'आज का सम्पूर्ण वैदिक पंचांग: दैनिक तिथि, नक्षत्र, योग, करण, सूर्योदय-सूर्यास्त, अभिजीत मुहूर्त एवं राहुकाल की 100% सटीक जानकारी।',
  path: '/panchang',
})

export default function PanchangLayout({ children }: { children: React.ReactNode }) {
  // Google Rich Snippets / FAQ & WebPage JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'आज का पंचांग (Aaj Ka Panchang) - Divyayagyam',
    description: 'सटीक वैदिक पंचांग, तिथि, नक्षत्र, योग, करण, सूर्योदय, सूर्यास्त व शुभ मुहूर्त।',
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
            text: 'पंचांग वैदिक हिन्दू कैलेंडर के 5 मुख्य अंगों (तिथि, नक्षत्र, योग, करण और वार) की खगोलीय गणना को कहते हैं।',
          },
        },
        {
          '@type': 'Question',
          name: 'आज का अभिजीत मुहूर्त कब है? (When is today Abhijit Muhurat?)',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'अभिजीत मुहूर्त दिन का सबसे शुभ मुहूर्त माना जाता है, जो मध्याह्न काल में लगभग 11:55 AM से 12:45 PM तक रहता है।',
          },
        },
        {
          '@type': 'Question',
          name: 'आज का राहुकाल कब है? (When is today Rahu Kaal?)',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'राहुकाल अशुभ समय होता है जिसमें नए व शुभ कार्य वर्जित होते हैं। इसकी सटीक समय सारणी आज के पंचांग में देखें।',
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

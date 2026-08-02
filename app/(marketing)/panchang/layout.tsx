import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'आज का पंचांग (Aaj Ka Panchang) | हिन्दू कैलेंडर, तिथि, नक्षत्र व मुहूर्त | Divyayagyam',
  description:
    'आज का सम्पूर्ण पंचांग (Aaj Ka Panchang Online): दैनिक तिथि, नक्षत्र, योग, करण, सूर्योदय-सूर्यास्त समय, अभिजीत मुहूर्त एवं राहुकाल की 100% सटीक वैदिक जानकारी।',
  keywords: [
    'आज का पंचांग',
    'aaj ka panchang',
    'panchang',
    'panchang today',
    'aaj ki tithi',
    'aaj ka rahu kaal',
    'abhijit muhurat today',
    'drik panchang',
    'vedic panchang',
    'hindu calendar',
    'आज का नक्षत्र',
    'आज का शुभ मुहूर्त',
    'दिव्ययज्ञम् पंचांग',
  ],
  alternates: {
    canonical: 'https://divyayagyam.com/panchang',
  },
  openGraph: {
    title: 'आज का सम्पूर्ण पंचांग | Aaj Ka Panchang Online | Divyayagyam',
    description:
      'दैनिक वैदिक पंचांग, तिथि, नक्षत्र, योग, करण, सूर्योदय-सूर्यास्त व शुभ-अशुभ मुहूर्त की प्रामाणिक जानकारी।',
    url: 'https://divyayagyam.com/panchang',
    siteName: 'Divyayagyam',
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'आज का पंचांग (Aaj Ka Panchang) | Divyayagyam',
    description: 'सटीक वैदिक पंचांग, तिथि, नक्षत्र व अभिजीत मुहूर्त।',
  },
}

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

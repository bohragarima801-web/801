import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'सनातन व्रत एवं त्योहार कैलेंडर (Hindu Festival Calendar) | Divyayagyam',
  description:
    'वर्ष के सभी प्रमुख हिंदू त्योहार, एकादशी, व्रत, जयंती एवं उनका प्रामाणिक धार्मिक महत्व। मकर संक्रांति, महाशिवरात्रि, होली, दीपावली, छठ पूजा तिथि कैलेंडर।',
  keywords: [
    'हिंदू त्योहार कैलेंडर',
    'vrat tyohar calendar',
    'festivals calendar',
    'aaj ka tyohar',
    'ekadashi date',
    'diwali 2026 date',
    'holi 2026 date',
    'navratri 2026 date',
    'shivratri date',
    'karwa chauth date',
    'सनातन पर्व एवं व्रत',
  ],
  alternates: {
    canonical: 'https://divyayagyam.com/festivals',
  },
  openGraph: {
    title: 'सनातन व्रत एवं त्योहार कैलेंडर | Hindu Festival Calendar | Divyayagyam',
    description:
      'संपूर्ण हिंदू पर्व, व्रत, एकादशी व धार्मिक महत्व की प्रामाणिक जानकारी।',
    url: 'https://divyayagyam.com/festivals',
    siteName: 'Divyayagyam',
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'हिंदू त्योहार एवं व्रत कैलेंडर | Divyayagyam',
    description: 'प्रमुख हिंदू त्योहार, एकादशी व व्रत तिथियां।',
  },
}

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

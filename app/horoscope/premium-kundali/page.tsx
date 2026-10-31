import type { Metadata } from 'next'
import { KaramKundaliClient } from './karam-kundali-client'

export const metadata: Metadata = {
  title: 'Karam Kundali (कर्म कुंडली) | DivyaYagyam',
  description:
    'DivyaYagyam Karam Kundali — आपकी जन्मतिथि, समय और स्थान के आधार पर करियर, धन, विवाह और जीवन की 40+ पन्नों की सटीक वैदिक रिपोर्ट।',
  openGraph: {
    title: 'Karam Kundali (कर्म कुंडली) | DivyaYagyam',
    description:
      'DivyaYagyam Karam Kundali — आपकी जन्मतिथि, समय और स्थान के आधार पर करियर, धन, विवाह और जीवन की 40+ पन्नों की सटीक वैदिक रिपोर्ट।',
    images: ['https://drive.google.com/thumbnail?id=1hd4BfRO5auKwmlwFO59RKx491cG77xFU&sz=w1000'],
  },
}

export default function PremiumKundaliPage() {
  return <KaramKundaliClient />
}

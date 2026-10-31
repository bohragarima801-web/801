import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'वैदिक ज्योतिष रिपोर्ट एवं भविष्यफल — दिव्ययज्ञम्',
  description: 'करियर, विवाह, स्वास्थ्य, व्यापार एवं जीवन की संपूर्ण वैदिक जन्मकुंडली एवं दशाफल रिपोर्ट ऑनलाइन प्राप्त करें।',
  path: '/horoscope',
})

export default function HoroscopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

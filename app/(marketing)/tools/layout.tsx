import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'मुफ्त कुण्डली, पंचांग एवं वैदिक टूल्स',
  description: 'कुण्डली मिलान, दैनिक पंचांग, शुभ मुहूर्त, रुद्राक्ष परामर्श, नामकरण एवं AI पंडित जी से ज्योतिष मार्गदर्शन बिल्कुल मुफ्त प्राप्त करें।',
  path: '/tools',
})

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'लॉगिन (Sign In) — भक्त खाता लॉगिन',
  description: 'दिव्ययज्ञम् खाते में लॉगिन करें। अपनी ऑनलाइन पूजा बुकिंग, संकल्प वीडियो और प्रसाद ट्रैकिंग स्थिति देखें।',
  path: '/login',
  noIndex: true,
})

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

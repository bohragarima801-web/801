import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'खाता बनाएं (Register) — नया भक्त पंजीकरण',
  description: 'दिव्ययज्ञम् पर नया भक्त खाता बनाएं और प्रामाणिक ऑनलाइन पूजा एवं वैदिक अनुष्ठान सेवाओं से जुड़ें।',
  path: '/register',
  noIndex: true,
})

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

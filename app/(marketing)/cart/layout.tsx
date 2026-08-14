import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'आपकी टोकरी (Cart)',
  description: 'View your selected online pujas, prasad, and spiritual offerings in your shopping cart.',
  path: '/cart',
  noIndex: true,
})

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

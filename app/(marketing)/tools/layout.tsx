import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'Free Kundali, Panchang & Sacred Vedic Tools — DivyaYagyam',
  description: 'Access Kundali matching, daily panchang, shubh muhurat, rudraksha guidance, and AI Pandit Ji astrology consultation online 100% free.',
  path: '/tools',
})

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'भक्ति सेवा (Bhakti Seva) — Sacred Temple Offerings & Bhog',
  description: 'काशी, महाकाल व सिद्ध मंदिरों में पुष्प माला, भोग, दीप दान एवं गौ सेवा अर्पित करें। नाम-गोत्र संकल्प, लाइव वीडियो दर्शन एवं अभिमंत्रित प्रसाद।',
  path: '/bhaktiseva',
})

export default function BhaktiSevaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

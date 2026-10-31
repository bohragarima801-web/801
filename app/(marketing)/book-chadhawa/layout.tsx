import { generatePageMeta } from '@/lib/seo'
import { Metadata } from 'next'

export const metadata: Metadata = generatePageMeta({
  title: 'ऑनलाइन चढ़ावा एवं सेवा अर्पण — दिव्ययज्ञम्',
  description: 'सिद्ध मंदिरों व शक्तिपीठों पर अपनी मनोकामना अनुसार फूलमाला, श्रीफल, भोग, चुनरी व दीपदान का ऑनलाइन चढ़ावा संकल्प बुक करें।',
  path: '/book-chadhawa',
})

export default function BookChadhawaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

import Script from 'next/script'
import { generatePujaGraphSchema } from '@/lib/seo'

interface PujaSchemaProps {
  puja: {
    id: string
    name: string
    slug: string
    shortDescription?: string | null
    description?: string | null
    coverImage?: string | null
    price: number | string
    pujaDate?: string | Date | null
    temple?: { name?: string | null; city?: string | null } | null
    location?: string | null
  }
  faqs: { question: string; answer: string }[]
}

export function PujaSchema({ puja, faqs }: PujaSchemaProps) {
  const jsonLd = generatePujaGraphSchema({ puja, faqs })

  return (
    <Script
      id={`schema-puja-${puja.id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

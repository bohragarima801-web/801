import { notFound } from 'next/navigation'
import { generatePageMeta, BASE_URL } from '@/lib/seo'
import { getAstroReportByIdOrSlug, ALL_ASTRO_REPORTS } from '@/lib/astro-data'
import { HoroscopeReportClientView } from './horoscope-report-client-view'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = []
  for (const report of ALL_ASTRO_REPORTS) {
    slugs.push({ slug: report.slug })
    slugs.push({ slug: report.numericId })
  }
  return slugs
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const report = getAstroReportByIdOrSlug(slug)

  if (!report) {
    return {
      title: 'Horoscope Report Not Found — DivyaYagyam',
    }
  }

  return generatePageMeta({
    title: `${report.title} (₹${report.price}) — Vedic Horoscope Report | DivyaYagyam`,
    description: report.description,
    path: `/horoscope/${report.slug}`,
  })
}

export default async function HoroscopeReportPage({ params }: PageProps) {
  const { slug } = await params
  const report = getAstroReportByIdOrSlug(slug)

  if (!report) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: report.title,
    description: report.description,
    image: `${BASE_URL}/logo.jpg`,
    offers: {
      '@type': 'Offer',
      price: report.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: report.rating,
      reviewCount: report.reviewCount,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HoroscopeReportClientView report={report} />
    </>
  )
}

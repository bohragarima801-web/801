import { notFound } from 'next/navigation'
import { generatePageMeta, BASE_URL } from '@/lib/seo'
import { getAstroReportByIdOrSlug, ALL_ASTRO_REPORTS } from '@/lib/astro-data'
import { getHoroscopePageBySlug } from '@/lib/horoscope-pages'
import { HoroscopeReportClientView } from './horoscope-report-client-view'
import { HoroscopeLandingViewer } from '@/components/horoscope-landing-viewer'

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

  if (report) {
    return generatePageMeta({
      title: `${report.title} (₹${report.price}) — Vedic Horoscope Report | DivyaYagyam`,
      description: report.description,
      path: `/horoscope/${report.slug}`,
    })
  }

  const customPage = await getHoroscopePageBySlug(slug)
  if (customPage) {
    return generatePageMeta({
      title: `${customPage.title} — Vedic Horoscope | DivyaYagyam`,
      description: customPage.subtitle || customPage.title,
      path: `/horoscope/${customPage.slug}`,
    })
  }

  return {
    title: 'Horoscope Report Not Found — DivyaYagyam',
  }
}

export default async function HoroscopeReportPage({ params }: PageProps) {
  const { slug } = await params
  
  // 1. Check built-in report
  const report = getAstroReportByIdOrSlug(slug)
  if (report) {
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

  // 2. Check custom landing page created from backend
  const customPage = await getHoroscopePageBySlug(slug)
  if (customPage) {
    return <HoroscopeLandingViewer page={customPage} />
  }

  // 3. Fallback 404
  notFound()
}

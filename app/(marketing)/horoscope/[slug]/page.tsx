import { notFound } from 'next/navigation'
import { generatePageMeta, BASE_URL } from '@/lib/seo'
import { getAstroReportByIdOrSlug, ALL_ASTRO_REPORTS, type AstroReportDetail } from '@/lib/astro-data'
import { getHoroscopePageBySlug, getAllHoroscopePages } from '@/lib/horoscope-pages'
import { HoroscopeReportClientView } from './horoscope-report-client-view'
import { HoroscopeLandingViewer } from '@/components/horoscope-landing-viewer'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = []
  try {
    const pages = await getAllHoroscopePages()
    for (const p of pages) {
      slugs.push({ slug: p.slug })
    }
  } catch (e) {}

  for (const report of ALL_ASTRO_REPORTS) {
    if (!slugs.some(s => s.slug === report.slug)) {
      slugs.push({ slug: report.slug })
    }
    slugs.push({ slug: report.numericId })
  }
  return slugs
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  
  // 1. Check custom backend page first
  const customPage = await getHoroscopePageBySlug(slug)
  if (customPage) {
    return generatePageMeta({
      title: `${customPage.title} (₹${customPage.price || 199}) — Vedic Horoscope | DivyaYagyam`,
      description: customPage.subtitle || customPage.description || customPage.title,
      path: `/horoscope/${customPage.slug}`,
    })
  }

  // 2. Check built-in report
  const report = getAstroReportByIdOrSlug(slug)
  if (report) {
    return generatePageMeta({
      title: `${report.title} (₹${report.price}) — Vedic Horoscope Report | DivyaYagyam`,
      description: report.description,
      path: `/horoscope/${report.slug}`,
    })
  }

  return {
    title: 'Horoscope Report Not Found — DivyaYagyam',
  }
}

export default async function HoroscopeReportPage({ params }: PageProps) {
  const { slug } = await params
  
  // 1. Check backend page (covers both custom landing pages AND standard reports managed via admin)
  const customPage = await getHoroscopePageBySlug(slug)
  if (customPage) {
    // If custom landing page HTML/code is provided, render the landing viewer
    if (customPage.customCode && customPage.customCode.trim().length > 0) {
      return <HoroscopeLandingViewer page={customPage} />
    }

    // Otherwise render standard high-converting Vedic Report client view
    const builtinFallback = getAstroReportByIdOrSlug(slug)
    const activeReport: AstroReportDetail = {
      id: customPage.id,
      numericId: builtinFallback?.numericId || customPage.id,
      slug: customPage.slug,
      title: customPage.title,
      subtitle: customPage.subtitle || builtinFallback?.subtitle || '',
      tagline: customPage.tagline || builtinFallback?.tagline || customPage.subtitle || '',
      categories: customPage.categories || builtinFallback?.categories || ['All', 'Life'],
      badge: customPage.badge || builtinFallback?.badge,
      badgeColor: customPage.badgeColor || builtinFallback?.badgeColor,
      price: customPage.price !== undefined ? customPage.price : (builtinFallback?.price || 199),
      originalPrice: customPage.originalPrice !== undefined ? customPage.originalPrice : (builtinFallback?.originalPrice || 499),
      pages: customPage.pages !== undefined ? customPage.pages : (builtinFallback?.pages || 24),
      rating: customPage.rating || builtinFallback?.rating || 4.9,
      reviewCount: customPage.reviewCount || builtinFallback?.reviewCount || 1200,
      description: customPage.description || customPage.subtitle || builtinFallback?.description || customPage.title,
      coverArtwork: customPage.coverArtwork || builtinFallback?.coverArtwork || 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
      samplePages: customPage.samplePages?.length ? customPage.samplePages : (builtinFallback?.samplePages || []),
      chapters: customPage.chapters?.length ? customPage.chapters : (builtinFallback?.chapters || []),
      highlights: customPage.highlights?.length ? customPage.highlights : (builtinFallback?.highlights || []),
      faqs: customPage.faqs?.length ? customPage.faqs : (builtinFallback?.faqs || [])
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: activeReport.title,
      description: activeReport.description,
      image: `${BASE_URL}/logo.jpg`,
      offers: {
        '@type': 'Offer',
        price: activeReport.price,
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: activeReport.rating,
        reviewCount: activeReport.reviewCount,
      },
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <HoroscopeReportClientView report={activeReport} />
      </>
    )
  }

  // 2. Fallback to built-in report if not found in custom list
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

  // 3. 404
  notFound()
}

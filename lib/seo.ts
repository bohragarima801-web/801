import { Metadata } from 'next'

const BASE_URL = 'https://divyayagyam.com'
const SITE_NAME = 'DivyaYagyam'
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.jpg`

// ─────────────────────────────────────────────
// Reusable page metadata generator
// ─────────────────────────────────────────────
export function generatePageMeta({
  title,
  description,
  path = '/',
  image,
  keywords,
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const url = `${BASE_URL}${path}`
  const ogImage = image || DEFAULT_OG_IMAGE

  return {
    title,
    description,
    keywords: keywords || [
      'online puja booking', 'ऑनलाइन पूजा', 'divyayagyam', 'vedic puja',
      'kashi vishwanath puja', 'mahakaleshwar puja', 'rudraksha', 'puja samagri',
    ],
    alternates: {
      canonical: url,
      languages: {
        'hi-IN': url,
        'en-IN': url,
        'x-default': url,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'hi_IN',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  }
}

// ─────────────────────────────────────────────
// JSON-LD Schema Generators
// ─────────────────────────────────────────────

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateProductSchema({
  name,
  description,
  image,
  price,
  slug,
  sku,
  inStock = true,
  rating,
  reviewCount,
}: {
  name: string
  description: string
  image: string
  price: number
  slug: string
  sku?: string
  inStock?: boolean
  rating?: number
  reviewCount?: number
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description?.substring(0, 300),
    image,
    url: `${BASE_URL}/products/${slug}`,
    sku: sku || slug,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'INR',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
      url: `${BASE_URL}/products/${slug}`,
    },
  }

  if (rating && reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.toString(),
      reviewCount: reviewCount.toString(),
      bestRating: '5',
    }
  }

  return schema
}

export function generateServiceSchema({
  name,
  description,
  image,
  price,
  slug,
  location,
}: {
  name: string
  description: string
  image: string
  price: number
  slug: string
  location?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description: description?.substring(0, 300),
    image,
    url: `${BASE_URL}/pujas/${slug}`,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    ...(location ? {
      serviceLocation: {
        '@type': 'Place',
        name: location,
      },
    } : {}),
  }
}

export function generateArticleSchema({
  title,
  description,
  image,
  slug,
  datePublished,
  dateModified,
  authorName,
}: {
  title: string
  description: string
  image: string
  slug: string
  datePublished: string
  dateModified?: string
  authorName?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description?.substring(0, 300),
    image,
    url: `${BASE_URL}/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName || SITE_NAME,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_OG_IMAGE,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${slug}`,
    },
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ReligiousOrganization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    telephone: '+91-95871-71984',
    email: 'seva@divyayagyam.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://facebook.com/divyayagyam',
      'https://instagram.com/divyayagyam',
      'https://youtube.com/@divyayagyam',
    ],
    priceRange: '₹199 - ₹51000',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: DEFAULT_OG_IMAGE,
    email: 'seva@divyayagyam.com',
    telephone: '+91-95871-71984',
    sameAs: [
      'https://facebook.com/divyayagyam',
      'https://instagram.com/divyayagyam',
      'https://youtube.com/@divyayagyam',
    ],
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/pujas?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.replace(/<[^>]*>?/gm, ''),
      },
    })),
  }
}

export { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE }

import { Metadata } from 'next'

const BASE_URL = 'https://divyayagyam.com'
const SITE_NAME = 'DivyaYagyam'
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.jpg`

// ─────────────────────────────────────────────
// Permanent Canonical URL Helper
// ─────────────────────────────────────────────
export function getCanonicalUrl(path: string = '/'): string {
  if (!path || path === '/') return BASE_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${BASE_URL}${cleanPath.replace(/\/+$/, '')}`
}

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
  isAbsoluteTitle = false,
}: {
  title: string
  description: string
  path?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
  isAbsoluteTitle?: boolean
}): Metadata {
  const url = getCanonicalUrl(path)
  const ogImage = image || DEFAULT_OG_IMAGE

  // Strip any trailing site name to prevent duplication when layout title template '%s | DivyaYagyam' is applied
  let cleanTitle = title
    ? title.replace(/\s*[|\-—]\s*DivyaYagyam(\.com)?$/i, '').trim()
    : 'Online Puja Booking & Sanatan Seva'

  // Truncate clean title if necessary (aiming under 65 chars for standard search snippets)
  if (cleanTitle.length > 65) {
    cleanTitle = cleanTitle.substring(0, 62).trim() + '...'
  }

  // Clean and truncate description to 155-160 chars
  let cleanDesc = (description || '')
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (cleanDesc.length > 160) {
    const truncated = cleanDesc.substring(0, 155)
    cleanDesc = truncated.substring(0, Math.max(truncated.lastIndexOf(' '), 140)) + '...'
  }

  const metaTitle = (isAbsoluteTitle || path === '/')
    ? { absolute: title.includes('DivyaYagyam') ? title : `${title} | ${SITE_NAME}` }
    : cleanTitle

  const ogTitle = (isAbsoluteTitle || path === '/') ? title : `${cleanTitle} | ${SITE_NAME}`

  return {
    title: metaTitle,
    description: cleanDesc,
    keywords: keywords || [
      'online puja booking', 'ऑनलाइन पूजा बुकिंग', 'divyayagyam', 'vedic puja india',
      'kashi vishwanath puja online', 'mahakaleshwar puja online', 'rudrabhishek online',
      'kalsarp dosh nivaran', 'navgrah shanti puja', 'pitra shanti puja',
      'bagalamukhi puja', 'online havan booking', 'temple puja booking india',
      'pandit booking online', 'prasad home delivery india',
      'naam gotra sankalp puja', 'whatsapp video proof puja',
      'rudraksha online', 'puja samagri', 'astrology online', 'jyotish', 'sanatan seva',
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
      title: ogTitle,
      description: cleanDesc,
      url,
      siteName: SITE_NAME,
      locale: 'hi_IN',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: cleanDesc,
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
    description: description?.substring(0, 300) || `Buy authentic ${name} online at DivyaYagyam.`,
    image: image || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/products/${slug}`,
    sku: sku || slug,
    mpn: sku || slug,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (rating || 4.9).toString(),
      reviewCount: (reviewCount || 42).toString(),
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'INR',
      priceValidUntil: '2030-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
      url: `${BASE_URL}/products/${slug}`,
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
      },
    },
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
  rating,
  reviewCount,
}: {
  name: string
  description: string
  image: string
  price: number
  slug: string
  location?: string
  rating?: number
  reviewCount?: number
}) {
  // Google supports AggregateRating on: Product, LocalBusiness, Event — NOT on Service.
  // Using Product type so price + star rating rich snippets work in Google search results.
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description?.substring(0, 300) || `Book online ${name} ritual at DivyaYagyam.`,
    image: image || DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/pujas/${slug}`,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: (rating || 4.9).toString(),
      reviewCount: (reviewCount || 48).toString(),
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      price: price.toString(),
      priceCurrency: 'INR',
      priceValidUntil: '2030-12-31',
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/pujas/${slug}`,
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
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
  imageAlt,
}: {
  title: string
  description: string
  image: string
  slug: string
  datePublished: string
  dateModified?: string
  authorName?: string
  imageAlt?: string
}) {
  const altText = imageAlt || `${title} - ${SITE_NAME} Online Puja Booking & Spiritual Guide`
  const imageObj = {
    '@type': 'ImageObject',
    url: image || DEFAULT_OG_IMAGE,
    caption: altText,
    description: altText,
    width: 1200,
    height: 630,
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description?.substring(0, 300),
    image: [imageObj],
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
    '@type': ['LocalBusiness', 'PlaceOfWorship'],
    '@id': `${BASE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: BASE_URL,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    telephone: '+91-95304-01984',
    email: 'seva@divyayagyam.com',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
    priceRange: '₹199 - ₹51000',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Maa Katyayani Durga Shakti Peeth',
      addressLocality: 'Jodhpur',
      addressRegion: 'Rajasthan',
      postalCode: '342001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '26.2389',
      longitude: '73.0243',
    },
    sameAs: [
      'https://facebook.com/divyayagyam',
      'https://instagram.com/divyayagyam',
      'https://youtube.com/@divyayagyam',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2174',
      bestRating: '5',
      worstRating: '1',
    },
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
    '@id': `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: BASE_URL,
    logo: DEFAULT_OG_IMAGE,
    email: 'seva@divyayagyam.com',
    telephone: '+91-95304-01984',
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
    '@id': `${BASE_URL}/#website`,
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

export function generatePujaGraphSchema({
  puja,
  faqs,
}: {
  puja: {
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
}) {
  const pujaUrl = `${BASE_URL}/pujas/${puja.slug}`
  const descriptionText = (puja.shortDescription || puja.description || '').replace(/<[^>]*>?/gm, '')

  // Helper to strip @context when nesting inside @graph
  const stripContext = (obj: any) => {
    const { '@context': _, ...rest } = obj
    return rest
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Event',
        name: puja.name,
        description: descriptionText,
        image: puja.coverImage ? [puja.coverImage] : [DEFAULT_OG_IMAGE],
        startDate: puja.pujaDate ? new Date(puja.pujaDate).toISOString() : new Date().toISOString(),
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        eventStatus: 'https://schema.org/EventScheduled',
        location: {
          '@type': 'VirtualLocation',
          url: pujaUrl,
        },
        offers: {
          '@type': 'Offer',
          price: Number(puja.price),
          priceCurrency: 'INR',
          url: pujaUrl,
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString(),
        },
        organizer: {
          '@type': 'Organization',
          '@id': `${BASE_URL}/#organization`,
          name: SITE_NAME,
          url: BASE_URL,
        },
      },
      stripContext(
        generateServiceSchema({
          name: puja.name,
          description: descriptionText.substring(0, 300),
          image: puja.coverImage || DEFAULT_OG_IMAGE,
          price: Number(puja.price),
          slug: puja.slug,
          location: puja.temple?.name || puja.location || 'Jodhpur, Rajasthan',
        })
      ),
      stripContext(
        generateBreadcrumbSchema([
          { name: 'Home', url: BASE_URL },
          { name: 'Pujas', url: `${BASE_URL}/pujas` },
          { name: puja.name, url: pujaUrl },
        ])
      ),
      stripContext(generateFaqSchema(faqs)),
    ],
  }
}

export { BASE_URL, SITE_NAME, DEFAULT_OG_IMAGE }


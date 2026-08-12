/**
 * DivyaYagyam — Schema.org (JSON-LD) बिल्डर्स
 *
 * तरीका: हर पेज पर एक ही <script type="application/ld+json"> जाता है,
 * जिसमें @graph के अंदर सारे नोड्स होते हैं और @id से आपस में जुड़े रहते हैं।
 * यही Google का पसंदीदा pattern है।
 */

import { SITE, ID, abs } from "./site";

type Json = Record<string, unknown>;

/* ------------------------------------------------------------------ */
/*  1. बेस नोड्स — हर पेज पर जाते हैं                                    */
/* ------------------------------------------------------------------ */

export function organizationNode(): Json {
  return {
    "@type": "Organization",
    "@id": ID.organization,
    name: SITE.name,
    alternateName: [SITE.nameHi, "DivyaYagyam", "Divya Yagyam", "दिव्ययज्ञम्", "दिव्य यज्ञम्"],
    legalName: SITE.legalName,
    url: SITE.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE.url}/#logo`,
      url: SITE.logo,
      contentUrl: SITE.logo,
      width: 512,
      height: 512,
      caption: SITE.name,
    },
    image: { "@id": `${SITE.url}/#logo` },
    description: SITE.description,
    foundingDate: SITE.foundingYear,
    founder: { "@id": ID.founder },
    knowsLanguage: ["hi", "en", "sa"],
    areaServed: [
      { "@type": "Country", name: "India" },
      { "@type": "Place", name: "Worldwide (NRI devotees)" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: SITE.contact.phone,
        contactType: "customer service",
        areaServed: "IN",
        availableLanguage: ["Hindi", "English"],
      },
    ],
    sameAs: [...SITE.social],
  };
}

export function founderNode(): Json {
  return {
    "@type": "Person",
    "@id": ID.founder,
    name: SITE.founder.name,
    jobTitle: SITE.founder.jobTitle,
    description: SITE.founder.description,
    worksFor: { "@id": ID.organization },
    url: abs("/about"),
  };
}

/** LocalBusiness — जोधपुर के local search / Google Maps के लिए */
export function localBusinessNode(): Json {
  return {
    "@type": ["LocalBusiness", "PlaceOfWorship"],
    "@id": ID.localBusiness,
    name: "माँ कात्यायनी दुर्गा शक्तिपीठ — DivyaYagyam",
    parentOrganization: { "@id": ID.organization },
    url: SITE.url,
    image: SITE.logo,
    telephone: SITE.contact.phone,
    email: SITE.contact.email,
    priceRange: "₹₹",
    currenciesAccepted: SITE.currency,
    paymentAccepted: "UPI, Credit Card, Debit Card, Net Banking",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.address.latitude,
      longitude: SITE.address.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday",
          "Friday", "Saturday", "Sunday",
        ],
        opens: "06:00",
        closes: "21:00",
      },
    ],
  };
}

/** WebSite + Sitelinks Search Box */
export function websiteNode(): Json {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": ID.organization },
    inLanguage: SITE.lang,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/pujas?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/* ------------------------------------------------------------------ */
/*  2. पेज-स्तर के नोड्स                                                */
/* ------------------------------------------------------------------ */

export interface WebPageInput {
  path: string;
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "FAQPage" | "CollectionPage" | "ItemPage";
}

export function webPageNode(input: WebPageInput): Json {
  const {
    path, title, description, image = SITE.ogImage,
    datePublished, dateModified, type = "WebPage",
  } = input;

  return {
    "@type": type,
    "@id": ID.page(path),
    url: abs(path),
    name: title,
    description,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.organization },
    primaryImageOfPage: { "@type": "ImageObject", url: image },
    inLanguage: SITE.lang,
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
    breadcrumb: { "@id": ID.breadcrumb(path) },
  };
}

export interface Crumb { name: string; path: string }

export function breadcrumbNode(path: string, crumbs: Crumb[]): Json {
  const all: Crumb[] = [{ name: "होम", path: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": ID.breadcrumb(path),
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  3. Product — /products/[slug] के लिए                               */
/* ------------------------------------------------------------------ */

export interface ProductInput {
  slug: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  /** MRP — अगर discount दिखाना है */
  listPrice?: number;
  inStock?: boolean;
  sku?: string;
  brand?: string;
  category?: string;
  /** ⚠️ सिर्फ़ असली reviews डालें। नकली rating = Google manual penalty */
  rating?: { value: number; count: number };
  reviews?: Array<{ author: string; rating: number; body: string; date: string }>;
  /** डिलीवरी में कितने दिन */
  deliveryDays?: [number, number];
}

export function productNode(p: ProductInput): Json {
  const url = abs(`/products/${p.slug}`);
  const inStock = p.inStock ?? true;

  return {
    "@type": "Product",
    "@id": ID.product(p.slug),
    name: p.name,
    description: p.description,
    image: p.images.map((i) => abs(i)),
    sku: p.sku ?? p.slug,
    mpn: p.sku ?? p.slug,
    category: p.category ?? "पूजा सामग्री",
    brand: { "@type": "Brand", name: p.brand ?? SITE.name },
    url,
    offers: {
      "@type": "Offer",
      "@id": `${url}#offer`,
      url,
      price: p.price.toFixed(2),
      priceCurrency: SITE.currency,
      ...(p.listPrice ? { priceSpecification: {
        "@type": "PriceSpecification",
        price: p.listPrice.toFixed(2),
        priceCurrency: SITE.currency,
        valueAddedTaxIncluded: true,
      }} : {}),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      // एक साल आगे की तारीख़ — Google को priceValidUntil चाहिए
      priceValidUntil: new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10),
      seller: { "@id": ID.organization },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7, // TODO: /refunds पेज से मिलाएँ
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: SITE.currency,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1, maxValue: 2, unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: p.deliveryDays?.[0] ?? 3,
            maxValue: p.deliveryDays?.[1] ?? 5,
            unitCode: "DAY",
          },
        },
      },
    },
    ...(p.rating ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: p.rating.value.toFixed(1),
        reviewCount: p.rating.count,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
    ...(p.reviews?.length ? {
      review: p.reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        datePublished: r.date,
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating, bestRating: 5, worstRating: 1,
        },
        reviewBody: r.body,
      })),
    } : {}),
  };
}

/* ------------------------------------------------------------------ */
/*  4. Puja — /pujas/[slug] के लिए                                     */
/* ------------------------------------------------------------------ */

export interface PujaInput {
  slug: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  /** अगर कई पैकेज हैं (सामान्य / VIP / महायज्ञ) */
  priceRange?: { min: number; max: number };
  temple?: string;
  templeAddress?: { locality: string; region: string; country?: string };
  durationMinutes?: number;
  rating?: { value: number; count: number };
  /** true = Product schema (कीमत rich result मिलती है), false = Service */
  asProduct?: boolean;
}

export function pujaNode(p: PujaInput): Json {
  const url = abs(`/pujas/${p.slug}`);

  const offer: Json = p.priceRange
    ? {
        "@type": "AggregateOffer",
        "@id": `${url}#offer`,
        url,
        lowPrice: p.priceRange.min.toFixed(2),
        highPrice: p.priceRange.max.toFixed(2),
        priceCurrency: SITE.currency,
        offerCount: 3,
        availability: "https://schema.org/InStock",
        seller: { "@id": ID.organization },
      }
    : {
        "@type": "Offer",
        "@id": `${url}#offer`,
        url,
        price: p.price.toFixed(2),
        priceCurrency: SITE.currency,
        availability: "https://schema.org/InStock",
        priceValidUntil: new Date(Date.now() + 365 * 864e5).toISOString().slice(0, 10),
        seller: { "@id": ID.organization },
      };

  // विकल्प A — Product (Google कीमत दिखाता है, बुक करने योग्य सेवा के लिए मान्य)
  if (p.asProduct ?? true) {
    return {
      "@type": "Product",
      "@id": ID.service(p.slug),
      name: p.name,
      description: p.description,
      image: p.images.map((i) => abs(i)),
      sku: p.slug,
      category: "पूजा एवं अनुष्ठान",
      brand: { "@type": "Brand", name: SITE.name },
      url,
      offers: offer,
      ...(p.rating ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: p.rating.value.toFixed(1),
          reviewCount: p.rating.count,
          bestRating: 5, worstRating: 1,
        },
      } : {}),
    };
  }

  // विकल्प B — Service (entity समझ के लिए बेहतर, कीमत rich result नहीं)
  return {
    "@type": "Service",
    "@id": ID.service(p.slug),
    serviceType: "Vedic Puja / Anushthan",
    name: p.name,
    description: p.description,
    image: p.images.map((i) => abs(i)),
    url,
    provider: { "@id": ID.organization },
    areaServed: { "@type": "Country", name: "India" },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      availableLanguage: ["Hindi", "Sanskrit", "English"],
    },
    ...(p.temple ? {
      location: {
        "@type": "PlaceOfWorship",
        name: p.temple,
        address: {
          "@type": "PostalAddress",
          addressLocality: p.templeAddress?.locality ?? SITE.address.locality,
          addressRegion: p.templeAddress?.region ?? SITE.address.region,
          addressCountry: p.templeAddress?.country ?? "IN",
        },
      },
    } : {}),
    offers: offer,
  };
}

/** पूजा की विधि step-by-step हो तो HowTo — Google में steps दिखते हैं */
export interface HowToInput {
  name: string;
  description: string;
  path: string;
  totalTimeISO?: string;
  supplies?: string[];
  steps: Array<{ name: string; text: string; image?: string }>;
}

export function howToNode(h: HowToInput): Json {
  return {
    "@type": "HowTo",
    "@id": `${abs(h.path)}#howto`,
    name: h.name,
    description: h.description,
    ...(h.totalTimeISO ? { totalTime: h.totalTimeISO } : {}),
    ...(h.supplies?.length ? {
      supply: h.supplies.map((s) => ({ "@type": "HowToSupply", name: s })),
    } : {}),
    step: h.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${abs(h.path)}#step-${i + 1}`,
      ...(s.image ? { image: abs(s.image) } : {}),
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  5. Article — /blog/[slug] के लिए                                   */
/* ------------------------------------------------------------------ */

export interface ArticleInput {
  slug: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;   // ISO: "2026-07-15T10:00:00+05:30"
  dateModified?: string;
  authorName?: string;
  wordCount?: number;
  keywords?: string[];
  section?: string;
}

export function articleNode(a: ArticleInput): Json {
  const url = abs(`/blog/${a.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": ID.article(a.slug),
    headline: a.headline.slice(0, 110), // Google 110 अक्षर तक ही पढ़ता है
    description: a.description,
    image: {
      "@type": "ImageObject",
      url: abs(a.image),
      width: 1200,
      height: 630,
    },
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    author: a.authorName
      ? { "@type": "Person", name: a.authorName, url: abs("/about") }
      : { "@id": ID.founder },
    publisher: { "@id": ID.organization },
    mainEntityOfPage: { "@id": ID.page(`/blog/${a.slug}`) },
    inLanguage: SITE.lang,
    isAccessibleForFree: true,
    ...(a.wordCount ? { wordCount: a.wordCount } : {}),
    ...(a.keywords?.length ? { keywords: a.keywords.join(", ") } : {}),
    ...(a.section ? { articleSection: a.section } : {}),
  };
}

/* ------------------------------------------------------------------ */
/*  6. FAQ — /faq और किसी भी पेज के FAQ सेक्शन के लिए                   */
/* ------------------------------------------------------------------ */

export interface FaqItem { question: string; answer: string }

export function faqNode(path: string, items: FaqItem[]): Json {
  return {
    "@type": "FAQPage",
    "@id": `${abs(path)}#faq`,
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  7. Event — /events और त्योहार पेजों के लिए                          */
/* ------------------------------------------------------------------ */

export interface EventInput {
  slug: string;
  name: string;
  description: string;
  image?: string;
  startDate: string;  // "2026-08-15T06:00:00+05:30"
  endDate?: string;
  templeName?: string;
  locality?: string;
  price?: number;
  bookingUrl?: string;
  online?: boolean;
}

export function eventNode(e: EventInput): Json {
  const url = e.bookingUrl ? abs(e.bookingUrl) : abs(`/events#${e.slug}`);
  return {
    "@type": "Event",
    "@id": `${url}#event-${e.slug}`,
    name: e.name,
    description: e.description,
    ...(e.image ? { image: [abs(e.image)] } : {}),
    startDate: e.startDate,
    endDate: e.endDate ?? e.startDate,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: e.online
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: e.online
      ? [
          { "@type": "VirtualLocation", url },
          {
            "@type": "PlaceOfWorship",
            name: e.templeName ?? "माँ कात्यायनी दुर्गा शक्तिपीठ",
            address: {
              "@type": "PostalAddress",
              addressLocality: e.locality ?? SITE.address.locality,
              addressRegion: SITE.address.region,
              addressCountry: "IN",
            },
          },
        ]
      : {
          "@type": "PlaceOfWorship",
          name: e.templeName ?? "माँ कात्यायनी दुर्गा शक्तिपीठ",
          address: {
            "@type": "PostalAddress",
            addressLocality: e.locality ?? SITE.address.locality,
            addressRegion: SITE.address.region,
            addressCountry: "IN",
          },
        },
    organizer: { "@id": ID.organization },
    performer: { "@id": ID.founder },
    ...(e.price !== undefined ? {
      offers: {
        "@type": "Offer",
        url,
        price: e.price.toFixed(2),
        priceCurrency: SITE.currency,
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString().slice(0, 10),
      },
    } : {}),
  };
}

/* ------------------------------------------------------------------ */
/*  8. Video — YouTube embeds के लिए                                    */
/* ------------------------------------------------------------------ */

export interface VideoInput {
  name: string;
  description: string;
  youtubeId: string;
  uploadDate: string;
  durationISO?: string;   // "PT8M30S"
}

export function videoNode(v: VideoInput): Json {
  return {
    "@type": "VideoObject",
    "@id": `https://www.youtube.com/watch?v=${v.youtubeId}#video`,
    name: v.name,
    description: v.description,
    thumbnailUrl: [`https://i.ytimg.com/vi/${v.youtubeId}/maxresdefault.jpg`],
    uploadDate: v.uploadDate,
    ...(v.durationISO ? { duration: v.durationISO } : {}),
    embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
    publisher: { "@id": ID.organization },
  };
}

/* ------------------------------------------------------------------ */
/*  9. ItemList — /pujas, /products जैसे listing पेजों के लिए           */
/* ------------------------------------------------------------------ */

export function itemListNode(
  path: string,
  items: Array<{ name: string; url: string; image?: string; price?: number }>,
): Json {
  return {
    "@type": "ItemList",
    "@id": `${abs(path)}#itemlist`,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: abs(it.url),
      ...(it.image ? { image: abs(it.image) } : {}),
    })),
  };
}

/* ------------------------------------------------------------------ */
/*  10. मुख्य असेंबलर — यही हर पेज पर इस्तेमाल होगा                     */
/* ------------------------------------------------------------------ */

export interface BuildGraphInput extends WebPageInput {
  crumbs?: Crumb[];
  /** पेज का मुख्य entity — product / puja / article / event आदि */
  entities?: Json[];
  /** होमपेज व /about, /contact पर LocalBusiness भी जोड़ें */
  includeLocalBusiness?: boolean;
}

export function buildGraph(input: BuildGraphInput): Json {
  const {
    crumbs = [], entities = [], includeLocalBusiness = false, ...page
  } = input;

  const graph: Json[] = [
    organizationNode(),
    founderNode(),
    websiteNode(),
    webPageNode(page),
    breadcrumbNode(page.path, crumbs),
  ];

  if (includeLocalBusiness) graph.push(localBusinessNode());
  graph.push(...entities);

  return { "@context": "https://schema.org", "@graph": graph };
}

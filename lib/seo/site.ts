/**
 * DivyaYagyam — Central SEO Config
 */

export const SITE = {
  url: "https://divyayagyam.com",
  name: "DivyaYagyam",
  nameHi: "दिव्य यज्ञम",
  legalName: "DivyaYagyam",
  tagline: "ऑनलाइन पूजा बुकिंग | Online Puja Booking India",
  description:
    "भारत के पवित्र शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे ऑनलाइन पूजा व यज्ञ अनुष्ठान बुक करें। नाम-गोत्र संकल्प, लाइव वीडियो दर्शन, 100% अभिमंत्रित प्रसाद डिलीवरी।",
  logo: "https://divyayagyam.com/logo.jpg",
  ogImage: "https://divyayagyam.com/logo.jpg",
  locale: "hi_IN",
  lang: "hi",
  currency: "INR",
  foundingYear: "2024",

  contact: {
    phone: "+91-95304-01984, +91-95304-01984",
    whatsapp: "+91-95304-01984, +91-95304-01984",
    email: "seva@divyayagyam.com",
  },

  // Maa Katyayni Durga Shaktipeeth, Jodhpur
  address: {
    street: "Maa Katyayni Durga Shaktipeeth",
    locality: "Jodhpur",
    region: "Rajasthan",
    postalCode: "342001",
    country: "IN",
    latitude: 26.2858799,
    longitude: 73.0021259,
  },

  founder: {
    name: "पं. मुकेश बोहरा",
    jobTitle: "मुख्य आचार्य",
    description: "35+ वर्षों के अनुभवी वैदिक आचार्य",
  },

  social: [
    "https://www.youtube.com/@divyayagyam",
    "https://www.instagram.com/divyayagyam",
    "https://www.facebook.com/divyayagyam",
  ],
} as const;

/** Creates absolute URL from relative path */
export const abs = (path = "/"): string =>
  path.startsWith("http") ? path : `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;

/** Persistent @id tags to link JSON-LD nodes */
export const ID = {
  organization: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
  localBusiness: `${SITE.url}/#localbusiness`,
  founder: `${SITE.url}/#founder`,
  page: (path: string) => `${abs(path)}#webpage`,
  breadcrumb: (path: string) => `${abs(path)}#breadcrumb`,
  product: (slug: string) => `${SITE.url}/products/${slug}#product`,
  service: (slug: string) => `${SITE.url}/pujas/${slug}#service`,
  article: (slug: string) => `${SITE.url}/blog/${slug}#article`,
} as const;

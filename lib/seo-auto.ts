/**
 * Auto SEO Engine for DivyaYagyam
 * Automatically generates Google #1 ranking optimized Titles, Meta Descriptions, 
 * Keywords, and Schema.org configurations for Pujas, Products, Blogs, and Tools 
 * whenever a new item is created or updated anywhere on the platform.
 */

export function autoGeneratePujaSeo(data: {
  name: string
  shortDescription?: string | null
  description?: string | null
  location?: string | null
  price?: number | string | null
  isVip?: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
}) {
  const cleanDesc = (data.shortDescription || data.description || '').replace(/<[^>]*>?/gm, '').trim()
  
  const seoTitle = data.seoTitle && data.seoTitle.trim().length > 0
    ? data.seoTitle.trim()
    : `${data.name} — ${data.isVip ? 'VIP' : 'ऑनलाइन'} पूजा बुकिंग एवं संकल्प | DivyaYagyam`

  const seoDescription = data.seoDescription && data.seoDescription.trim().length > 0
    ? data.seoDescription.trim()
    : (cleanDesc.length > 20
        ? `${cleanDesc.slice(0, 120)}... लाइव पूजा वीडियो और सिद्ध प्रसाद सीधे आपके घर।`
        : `भाग लें ${data.name} अनुष्ठान में। ${data.location ? `${data.location} से` : ''} विद्वान आचार्यों द्वारा नाम व गोत्र संकल्प, वीडियो प्रूफ व महाप्रसाद डिलीवरी।`
      ).slice(0, 160)

  const defaultKeywords = [
    data.name,
    `${data.name} Online Puja`,
    'ऑनलाइन पूजा बुकिंग',
    'DivyaYagyam',
    data.location ? `${data.location} Puja` : 'Vedic Puja',
    'Vedic Anusthan',
    'Prasad Delivery',
  ].filter(Boolean).join(', ')

  const seoKeywords = data.seoKeywords && data.seoKeywords.trim().length > 0
    ? data.seoKeywords.trim()
    : defaultKeywords

  return {
    seoTitle,
    seoDescription,
    seoKeywords,
  }
}

export function autoGenerateProductSeo(data: {
  name: string
  shortDescription?: string | null
  description?: string | null
  categoryName?: string | null
  isAbhimantrit?: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
}) {
  const cleanDesc = (data.shortDescription || data.description || '').replace(/<[^>]*>?/gm, '').trim()
  
  const seoTitle = data.seoTitle && data.seoTitle.trim().length > 0
    ? data.seoTitle.trim()
    : `${data.name} — ${data.isAbhimantrit ? '100% अभिमंत्रित' : 'सिद्ध'} वैदिक सामग्री | DivyaYagyam`

  const seoDescription = data.seoDescription && data.seoDescription.trim().length > 0
    ? data.seoDescription.trim()
    : (cleanDesc.length > 20
        ? `${cleanDesc.slice(0, 120)}... 100% प्रामाणिक सिद्ध सामग्री घर बैठे प्राप्त करें।`
        : `खरीदें 100% अभिमंत्रित ${data.name} ऑनलाइन। वैदिक मंत्रों से सिद्ध, 100% शुद्धता की गारंटी व फ़ास्ट होम डिलीवरी।`
      ).slice(0, 160)

  const defaultKeywords = [
    data.name,
    `Buy ${data.name} online`,
    `Abhimantrit ${data.name}`,
    'वैदिक पूजा सामग्री',
    'DivyaYagyam Store',
    data.categoryName || 'Spiritual Store',
  ].filter(Boolean).join(', ')

  const seoKeywords = data.seoKeywords && data.seoKeywords.trim().length > 0
    ? data.seoKeywords.trim()
    : defaultKeywords

  return {
    seoTitle,
    seoDescription,
    seoKeywords,
  }
}

export function autoGenerateBlogSeo(data: {
  title: string
  excerpt?: string | null
  content?: string | null
  categoryName?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
}) {
  const cleanContent = (data.excerpt || data.content || '').replace(/<[^>]*>?/gm, '').replace(/[#*`]/g, '').trim()

  const seoTitle = data.seoTitle && data.seoTitle.trim().length > 0
    ? data.seoTitle.trim()
    : `${data.title} — सनातन धर्म एवं वैदिक ज्ञान | DivyaYagyam`

  const seoDescription = data.seoDescription && data.seoDescription.trim().length > 0
    ? data.seoDescription.trim()
    : (cleanContent.length > 20
        ? `${cleanContent.slice(0, 140)}...`
        : `पढ़ें ${data.title} के बारे में संपूर्ण वैदिक जानकारी और विद्वान आचार्यों के आध्यात्मिक विचार।`
      ).slice(0, 160)

  const defaultKeywords = [
    data.title,
    'सनातन धर्म ब्लॉग',
    'वैदिक ज्ञान',
    'पूजा विधि',
    'DivyaYagyam Blog',
    data.categoryName || 'Spirituality',
  ].filter(Boolean).join(', ')

  const seoKeywords = data.seoKeywords && data.seoKeywords.trim().length > 0
    ? data.seoKeywords.trim()
    : defaultKeywords

  return {
    seoTitle,
    seoDescription,
    seoKeywords,
  }
}

export function autoGenerateToolSeo(data: {
  name: string
  description?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  seoKeywords?: string | null
}) {
  const seoTitle = data.seoTitle && data.seoTitle.trim().length > 0
    ? data.seoTitle.trim()
    : `${data.name} — ऑनलाइन वैदिक ज्योतिष टूल | DivyaYagyam`

  const seoDescription = data.seoDescription && data.seoDescription.trim().length > 0
    ? data.seoDescription.trim()
    : (data.description || `निःशुल्क उपयोग करें ${data.name} टूल का। सटीक वैदिक गणना और ज्योतिषीय परामर्श हेतु सर्वोत्तम टूल।`).slice(0, 160)

  const defaultKeywords = [
    data.name,
    'Vedic Tool',
    'Online Kundali Panchang',
    'DivyaYagyam Tools',
  ].join(', ')

  const seoKeywords = data.seoKeywords && data.seoKeywords.trim().length > 0
    ? data.seoKeywords.trim()
    : defaultKeywords

  return {
    seoTitle,
    seoDescription,
    seoKeywords,
  }
}

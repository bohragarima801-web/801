import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { getDynamicSiteConfig } from '@/lib/settings'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const config = await getDynamicSiteConfig()
  const rawBaseUrl = config.url || 'https://divyayagyam.com'
  const cleanBaseUrl = rawBaseUrl.includes('localhost') ? 'https://divyayagyam.com' : rawBaseUrl
  const baseUrl = cleanBaseUrl.replace(/\/+$/, '')

  const now = new Date()

  const sitemapEntries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/panchang`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/festivals`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/pujas`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },

    { url: `${baseUrl}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/vip-pujas`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/bhaktiseva`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/ask-a-pandit`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/astro`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/sitemap`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/shipping`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refunds`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  if (process.env.DATABASE_URL) {
    try {
      // 1. Pujas (Only Published & Published date <= now or null)
      const pujas = await prisma.puja.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { publishedAt: null },
            { publishedAt: { lte: now } }
          ]
        },
        select: { slug: true, updatedAt: true }
      })
      pujas.forEach(p => {
        if (p.slug && p.slug.trim()) {
          sitemapEntries.push({
            url: `${baseUrl}/pujas/${encodeURIComponent(p.slug.trim())}`,
            lastModified: p.updatedAt || now,
            changeFrequency: 'daily',
            priority: 0.95,
          })
        }
      })

      // 2. Products (Active or Out of Stock)
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { status: 'ACTIVE' },
            { status: 'OUT_OF_STOCK' }
          ]
        },
        select: { slug: true, updatedAt: true }
      })
      products.forEach(p => {
        if (p.slug && p.slug.trim()) {
          sitemapEntries.push({
            url: `${baseUrl}/products/${encodeURIComponent(p.slug.trim())}`,
            lastModified: p.updatedAt || now,
            changeFrequency: 'daily',
            priority: 0.95,
          })
        }
      })

      // 3. Puja Categories & Product Categories
      const [pujaCats, prodCats] = await Promise.all([
        prisma.pujaCategory.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
        prisma.productCategory.findMany({ where: { isActive: true }, select: { slug: true } }),
      ])
      pujaCats.forEach(c => {
        if (c.slug) {
          sitemapEntries.push({
            url: `${baseUrl}/pujas?category=${encodeURIComponent(c.slug.trim())}`,
            lastModified: c.updatedAt || now,
            changeFrequency: 'daily',
            priority: 0.85,
          })
        }
      })
      prodCats.forEach(c => {
        if (c.slug) {
          sitemapEntries.push({
            url: `${baseUrl}/products?category=${encodeURIComponent(c.slug.trim())}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.85,
          })
        }
      })

      // 4. Blog Posts (Only Published)
      const posts = await prisma.blog.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { publishedAt: null },
            { publishedAt: { lte: now } }
          ]
        },
        select: { slug: true, updatedAt: true }
      })
      posts.forEach(p => {
        if (p.slug && p.slug.trim()) {
          sitemapEntries.push({
            url: `${baseUrl}/blog/${encodeURIComponent(p.slug.trim())}`,
            lastModified: p.updatedAt || now,
            changeFrequency: 'weekly',
            priority: 0.8,
          })
        }
      })

      // 5. Spiritual Tools (Active tools)
      const tools = await prisma.spiritualTool.findMany({
        where: { isActive: true },
        select: { slug: true, createdAt: true }
      })
      tools.forEach(t => {
        if (t.slug && t.slug.trim()) {
          sitemapEntries.push({
            url: `${baseUrl}/tools/${encodeURIComponent(t.slug.trim())}`,
            lastModified: t.createdAt || now,
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      })

      // 5. Events: Update lastModified of static /events URL if active events exist, without creating duplicates
      const latestEvent = await prisma.event.findFirst({
        where: { isActive: true },
        orderBy: { startsAt: 'desc' },
        select: { startsAt: true }
      })
      if (latestEvent && latestEvent.startsAt) {
        const eventsEntry = sitemapEntries.find(e => e.url === `${baseUrl}/events`)
        if (eventsEntry) {
          eventsEntry.lastModified = latestEvent.startsAt
        }
      }
    } catch (error) {
      console.error('Error generating dynamic sitemap:', error)
    }
  }

  // Deduplicate entries by canonical URL to guarantee uniqueness
  const uniqueEntriesMap = new Map<string, MetadataRoute.Sitemap[number]>()
  sitemapEntries.forEach(entry => {
    if (!uniqueEntriesMap.has(entry.url)) {
      uniqueEntriesMap.set(entry.url, entry)
    }
  })

  return Array.from(uniqueEntriesMap.values())
}

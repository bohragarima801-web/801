import { MetadataRoute } from 'next'
import { getDynamicSiteConfig } from '@/lib/settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getDynamicSiteConfig()
  const rawBaseUrl = config.url || 'https://divyayagyam.com'
  const baseUrl = rawBaseUrl.includes('localhost') ? 'https://divyayagyam.com' : rawBaseUrl

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

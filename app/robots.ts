import { MetadataRoute } from 'next'
import { getDynamicSiteConfig } from '@/lib/settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getDynamicSiteConfig()
  const baseUrl = config.url || 'https://divyayagyam.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/admin/*',
          '/api/',
          '/api/*',
          '/checkout/',
          '/checkout/*',
          '/dashboard/',
          '/dashboard/*',
          '/forgot-password',
          '/test-payment'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/checkout/',
          '/dashboard/'
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap`
    ],
    host: baseUrl,
  }
}

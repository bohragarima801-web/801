import { MetadataRoute } from 'next'
import { getDynamicSiteConfig } from '@/lib/settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const config = await getDynamicSiteConfig()
  const rawBaseUrl = config.url || 'https://divyayagyam.com'
  const baseUrl = rawBaseUrl.includes('localhost') ? 'https://divyayagyam.com' : rawBaseUrl

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/dashboard/', '/cart', '/bookings/', '/auth/'],
      },
      {
        userAgent: [
          'Googlebot', 'Bingbot', 'AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot',
          'Screaming Frog SEO Spider', 'SiteAuditBot', 'rogerbot', 'DuckDuckBot',
          'YandexBot', 'Baiduspider', 'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
          'ClaudeBot', 'Claude-User', 'Claude-SearchBot',
          'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Bytespider',
          'Applebot', 'Applebot-Extended', 'Meta-ExternalAgent'
        ],
        allow: '/',
        disallow: ['/admin/', '/api/', '/checkout/', '/dashboard/', '/cart', '/bookings/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

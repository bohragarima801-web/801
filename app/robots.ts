import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // block admin and api routes
    },
    sitemap: 'https://divyayagyam.com/sitemap.xml',
  }
}

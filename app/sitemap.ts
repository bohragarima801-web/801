import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://divyayagyam.com'

  const staticRoutes = [
    '',
    '/pujas',
    '/products',
    '/bhaktiseva',
    '/astro',
    '/events',
    '/about',
    '/contact',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    const pujas = await prisma.puja.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true }
    });
    
    const products = await prisma.product.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true }
    });
    
    const blogs = await prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true }
    });

    const pujaRoutes = pujas.map((p) => ({
      url: `${baseUrl}/pujas/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    const productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    const blogRoutes = blogs.map((b) => ({
      url: `${baseUrl}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    return [...staticRoutes, ...pujaRoutes, ...productRoutes, ...blogRoutes];
  } catch (err) {
    console.error('Sitemap DB Error:', err);
    return staticRoutes;
  }
}

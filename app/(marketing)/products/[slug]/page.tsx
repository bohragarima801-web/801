import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { ProductClientView } from '@/components/product-client-view'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'
import { generateProductSchema, generateBreadcrumbSchema, generatePageMeta, BASE_URL } from '@/lib/seo'

export const revalidate = 3600; // ISR: Revalidate every 3600s (1 hour)

const fetchProductFromDb = async (slug: string) => {
  try {
    // 1. Try exact slug match
    let product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        inventory: true,
        images: {
          orderBy: { order: 'asc' }
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });

    // 2. Fallback: Check if slug is partial or old long slug (only active/out_of_stock)
    if (!product) {
      product = await prisma.product.findFirst({
        where: {
          AND: [
            {
              OR: [
                { id: slug },
                { name: { contains: slug.replace(/-/g, ' '), mode: 'insensitive' } }
              ]
            },
            {
              OR: [
                { status: 'ACTIVE' },
                { status: 'OUT_OF_STOCK' }
              ]
            }
          ]
        },
        include: {
          category: true,
          inventory: true,
          images: {
            orderBy: { order: 'asc' }
          },
          reviews: {
            orderBy: { createdAt: 'desc' },
            take: 10,
            include: { user: { select: { firstName: true, lastName: true } } }
          }
        }
      });
    }

    if (!product) return null;

    return JSON.parse(JSON.stringify(product));
  } catch (err) {
    console.error("Error fetching product by slug:", err);
    return null;
  }
}

// Global cross-request Data Cache for single Product Detail (1-hour TTL)
const getCachedProductBySlug = (slug: string) =>
  unstable_cache(
    async () => fetchProductFromDb(slug),
    [`product-detail-v2-${slug}`],
    { revalidate: 3600, tags: ['products', `product-${slug}`] }
  )()

// Per-request memoization wrapper
const getProductBySlugOrFallback = cache(async (slug: string) => {
  return getCachedProductBySlug(slug)
})

// Cached related products fetcher
const getCachedRelatedProducts = (excludeId: string) =>
  unstable_cache(
    async () => {
      const rawRelated = await prisma.product.findMany({
        where: {
          status: 'ACTIVE',
          id: { not: excludeId }
        },
        take: 4,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          coverImage: true,
          category: { select: { name: true } }
        }
      }).catch(() => [])

      return rawRelated.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        mrp: Math.round(Number(p.price) * 2.1),
        coverImage: p.coverImage || '/placeholder.jpg',
        category: p.category?.name || 'Sanatan Store'
      }))
    },
    [`related-products-v2-${excludeId}`],
    { revalidate: 3600, tags: ['products'] }
  )()

export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { status: 'ACTIVE' },
          { status: 'OUT_OF_STOCK' }
        ]
      },
      select: { slug: true },
      take: 50
    })
    return products.map((p) => ({ slug: p.slug }))
  } catch (e) {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugOrFallback(slug);
  
  if (!product) return generatePageMeta({ title: 'Product Not Found | DivyaYagyam', description: 'The requested product is unavailable.', path: `/products/${slug}` })
  
  const title = product.name || product.seoTitle || 'सिद्ध सामग्री'
  const description = (product.seoDescription || product.shortDescription || product.description || `Buy authentic ${product.name} online from sacred temples at DivyaYagyam.`).replace(/<[^>]*>?/gm, '')
  const keywords = product.seoKeywords ? product.seoKeywords.split(',').map(k => k.trim()) : undefined

  return generatePageMeta({
    title,
    description,
    path: `/products/${product.slug}`,
    image: product.coverImage || undefined,
    keywords,
  })
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlugOrFallback(slug);

  if (!product) {
    notFound()
  }

  // Redirect to canonical short slug if accessed via old long URL or ID
  if (slug !== product.slug) {
    redirect(`/products/${product.slug}`);
  }

  // Fetch cached active related products
  const relatedProducts = await getCachedRelatedProducts(product.id)

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      generateProductSchema({
        name: product.name,
        description: product.shortDescription || product.description?.substring(0, 200) || '',
        image: product.coverImage || '/logo.jpg',
        price: Number(product.salePrice || product.price),
        slug: product.slug,
        inStock: product.inventory ? product.inventory.quantity > 0 : true,
      }),
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Products', url: `${BASE_URL}/products` },
        { name: product.name, url: `${BASE_URL}/products/${product.slug}` },
      ]),
    ]
  }

  return (
    <>
      <Script
        id={`schema-product-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClientView product={product} relatedProducts={relatedProducts} />
    </>
  )
}


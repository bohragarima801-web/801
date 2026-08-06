import { prisma } from '@/lib/prisma'
import { ProductClientView } from '@/components/product-client-view'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'
import { generateProductSchema, generateBreadcrumbSchema, generatePageMeta, BASE_URL } from '@/lib/seo'

export const revalidate = 10; // Revalidate every 10s for fast admin updates

async function getProductBySlugOrFallback(slug: string) {
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
          include: { user: { select: { firstName: true, lastName: true } } }
        }
      }
    });

    // 2. Fallback: Check if slug is partial or old long slug
    if (!product) {
      product = await prisma.product.findFirst({
        where: {
          OR: [
            { id: slug },
            { slug: { contains: slug.slice(0, 15) } },
            { name: { contains: slug.replace(/-/g, ' '), mode: 'insensitive' } }
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugOrFallback(slug);
  
  if (!product) return generatePageMeta({ title: 'Product Not Found | DivyaYagyam', description: 'The requested product is unavailable.', path: `/products/${slug}` })
  
  const title = product.seoTitle || `${product.name} — Order Sacred Prasad | DivyaYagyam`
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
      <ProductClientView product={product} />
    </>
  )
}

import { prisma } from '@/lib/prisma'
import { ProductClientView } from '@/components/product-client-view'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'

export const revalidate = 3600; // ISR: Revalidate every 3600s

async function getProductBySlugOrFallback(slug: string) {
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

  return product;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugOrFallback(slug);
  
  if (!product) return { title: 'Product Not Found' }
  
  return {
    title: product.seoTitle || `${product.name} | DivyaYagyam`,
    description: product.seoDescription || product.shortDescription || `Buy ${product.name} at DivyaYagyam.`,
    keywords: product.seoKeywords || undefined,
    openGraph: {
      title: product.seoTitle || `${product.name} | DivyaYagyam`,
      description: product.seoDescription || product.shortDescription || `Buy ${product.name} at DivyaYagyam.`,
      images: product.coverImage ? [product.coverImage] : []
    }
  }
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

  return <ProductClientView product={product} />
}


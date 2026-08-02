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
  
  const cleanTitle = (product.seoTitle || product.name).replace(/\s*\|\s*DivyaYagyam/gi, '')

  return {
    title: cleanTitle,
    description: product.seoDescription || product.shortDescription || `Buy ${product.name} at DivyaYagyam.`,
    keywords: product.seoKeywords || undefined,
    openGraph: {
      title: cleanTitle,
      description: product.seoDescription || product.shortDescription || `Buy ${product.name} at DivyaYagyam.`,
      images: product.coverImage ? [product.coverImage] : []
    }
  }
}

import { buildGraph, productNode } from '@/lib/seo/schema'
import JsonLd from '@/components/JsonLd'

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

  const images = (product.images || []).map(i => i.url)
  if (product.coverImage && !images.includes(product.coverImage)) {
    images.unshift(product.coverImage)
  }

  const graph = buildGraph({
    path: `/products/${product.slug}`,
    type: 'ItemPage',
    title: product.seoTitle || product.name,
    description: product.shortDescription || product.description || '',
    image: images[0],
    crumbs: [
      { name: 'पूजा सामग्री', path: '/products' },
      { name: product.name, path: `/products/${product.slug}` },
    ],
    entities: [
      productNode({
        slug: product.slug,
        name: product.name,
        description: product.shortDescription || product.description || '',
        images: images,
        price: Number(product.salePrice || product.price),
        inStock: product.status === 'ACTIVE',
        sku: product.sku || product.id,
        category: product.category?.name,
      })
    ]
  })

  return (
    <>
      <JsonLd data={graph} />
      <ProductClientView product={product} />
    </>
  )
}




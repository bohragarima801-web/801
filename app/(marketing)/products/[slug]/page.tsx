import { prisma } from '@/lib/prisma'
import { ProductClientView } from '@/components/product-client-view'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'

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
  
  if (!product) return { title: 'Product Not Found | DivyaYagyam' }
  
  const pageUrl = `https://divyayagyam.com/products/${product.slug}`
  const title = product.seoTitle || `${product.name} — Order Sacred Prasad & Essentials | DivyaYagyam`
  const description = (product.seoDescription || product.shortDescription || product.description || `Buy authentic ${product.name} online from sacred temples at DivyaYagyam.`).replace(/<[^>]*>?/gm, '').slice(0, 160)

  return {
    title,
    description,
    keywords: product.seoKeywords || `${product.name}, Sacred Prasad, Puja Essentials, DivyaYagyam, ${product.category?.name || 'Sanatan Product'}`,
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      }
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'DivyaYagyam',
      locale: 'hi_IN',
      type: 'website',
      images: product.coverImage ? [{ url: product.coverImage, width: 1200, height: 630, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.coverImage ? [product.coverImage] : [],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": (product.shortDescription || product.description || '').replace(/<[^>]*>?/gm, ''),
    "image": product.coverImage ? [product.coverImage] : [],
    "sku": product.sku || product.id,
    "offers": {
      "@type": "Offer",
      "price": Number(product.salePrice || product.price),
      "priceCurrency": "INR",
      "url": `https://divyayagyam.com/products/${product.slug}`,
      "availability": product.inventory && product.inventory.quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "DivyaYagyam"
      }
    }
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


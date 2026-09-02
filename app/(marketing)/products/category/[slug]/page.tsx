import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { SacredImageFrame } from '@/components/ui/safe-image'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { Sparkles, ArrowLeft, ShieldCheck, Check } from 'lucide-react'
import { Metadata } from 'next'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const categories = await prisma.productCategory.findMany({ select: { slug: true } })
    return categories.filter(c => c.slug).map(c => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.productCategory.findFirst({
    where: { OR: [{ slug }, { id: slug }] }
  })

  if (!category) {
    return generatePageMeta({
      title: 'Spiritual Products | DivyaYagyam',
      description: 'Redirecting to authentic energized items at DivyaYagyam.',
      path: `/products`,
      noIndex: true
    })
  }

  return generatePageMeta({
    title: `${category.name} — Authentic Consecrated Store`,
    description: `Buy 100% authentic energized ${category.name} directly from sacred temples. Holy blessed items delivered to your home by DivyaYagyam.`,
    path: `/products/category/${category.slug}`
  })
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await prisma.productCategory.findFirst({
    where: { OR: [{ slug }, { id: slug }] }
  })

  if (!category) {
    permanentRedirect('/products')
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      OR: [
        { status: 'ACTIVE' },
        { status: 'OUT_OF_STOCK' }
      ]
    },
    include: { inventory: true },
    orderBy: { createdAt: 'desc' }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `${category.name} — Sacred Spiritual Products`,
        itemListElement: products.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.name,
          url: `${BASE_URL}/products/${p.slug}`
        }))
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Products', url: `${BASE_URL}/products` },
        { name: category.name, url: `${BASE_URL}/products/category/${category.slug}` }
      ])
    ]
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-product-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-12 md:py-16 border-b border-[#E6D6BE]">
        <div className="container relative z-10 max-w-5xl mx-auto px-4 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#E58A16] transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Products
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6D6BE] shadow-2xs mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#E58A16]" />
            <span className="text-[#E58A16] text-xs font-black uppercase tracking-wider">
              {category.name}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-3">
            {category.name} <span className="text-[#E58A16]">Collection</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            100% energized and consecrated sacred items delivered directly to your doorstep.
          </p>
        </div>
      </section>

      <main className="container max-w-6xl mx-auto px-4 py-10">
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E6D6BE] p-8 max-w-md mx-auto">
            <Sparkles className="h-10 w-10 text-[#E58A16] mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-800 mb-1">Items Coming Soon</h2>
            <p className="text-xs text-slate-500 mb-5">
              New energized items under {category.name} are arriving soon.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#E58A16] text-white font-bold text-xs shadow-md"
            >
              Explore All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => {
              const hasStock = p.status === 'ACTIVE' && (p.inventory?.quantity ?? 1) > 0
              return (
                <article
                  key={p.id}
                  className="bg-white rounded-2xl border border-[#E6D6BE] overflow-hidden flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-[#E58A16] transition-all duration-300 group"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[#FAF6F0]">
                    <SacredImageFrame
                      src={p.coverImage}
                      alt={p.name}
                      aspectRatio="square"
                      seoCategory="product"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
                    <div className="space-y-1">
                      <h3 className="font-bold text-xs sm:text-sm text-[#292321] line-clamp-2 leading-snug group-hover:text-[#E58A16] transition-colors">
                        <Link href={`/products/${p.slug}`}>{p.name}</Link>
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-[#E6D6BE] flex items-center justify-between gap-2">
                      <span className="text-sm sm:text-base font-black text-[#292321]">
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </span>
                      <AddToCartButton
                        product={{ id: p.id, name: p.name, price: Number(p.price), coverImage: p.coverImage }}
                        hasStock={hasStock}
                      />
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

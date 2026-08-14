import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { SacredImageFrame } from '@/components/ui/safe-image'

export function generateMetadata() {
  return generatePageMeta({
    title: 'अभिमंत्रित रुद्राक्ष, यंत्र एवं शुद्ध पूजा सामग्री | DivyaYagyam Store',
    description: '100% अभिमंत्रित वैदिक सामग्री। सिद्ध रुद्राक्ष, श्री यंत्र, पूजा थाली, जप माला — सिद्ध पीठों से सीधे आपके घर। ₹999+ पर निःशुल्क होम डिलीवरी।',
    path: '/products',
  })
}

export const revalidate = 30

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { status: 'ACTIVE' },
        { status: 'OUT_OF_STOCK' }
      ]
    },
    include: { category: true, inventory: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Sacred Spiritual Products & Samagri',
        itemListElement: products.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.name,
          url: `${BASE_URL}/products/${p.slug}`,
        })),
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Products', url: `${BASE_URL}/products` },
      ]),
    ],
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-products-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner (Warm Ivory × Saffron) ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-14 md:py-20 overflow-hidden border-b border-[#E6D6BE]">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E6D6BE] shadow-2xs mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[#E58A16]" />
            <span className="text-[#E58A16] text-xs font-black uppercase tracking-wider">🛍️ अभिमंत्रित दिव्य स्टोर एवं सामग्री</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-3">
            अभिमंत्रित प्रसाद एवं <span className="text-[#E58A16]">वैदिक सामग्री</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A403C] max-w-xl mx-auto font-medium leading-relaxed">
            पवित्र गंगाजल व वैदिक मंत्रों से अभिमंत्रित सिद्ध रुद्राक्ष, धूप-दीप, पूजन सामग्री एवं यंत्र।
          </p>
        </div>
      </section>

      {/* ── Products Grid (2-column on mobile, 4-column on desktop) ── */}
      <section className="bg-[#FFF9EF] py-10 md:py-16">
        <div className="container px-3 sm:px-6 max-w-7xl mx-auto">
          {products.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 bg-white rounded-3xl border border-[#E6D6BE] p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#F7EBD7] flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-[#E58A16]" />
              </div>
              <h3 className="text-xl font-bold text-[#292321] mb-2">स्टोर सामग्री शीघ्र उपलब्ध होगी</h3>
              <p className="text-xs text-[#4A403C]">हम पवित्र सामग्रियों का संग्रह तैयार कर रहे हैं। कृपया शीघ्र पुनः पधारें।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {products.map((p, idx) => {
                const hasStock = p.inventory ? p.inventory.quantity > 0 : true
                return (
                  <article 
                    key={p.id} 
                    className="group relative flex flex-col bg-white rounded-2xl border border-[#E6D6BE] hover:border-[#E58A16] transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-xl overflow-hidden justify-between"
                  >
                    <Link href={`/products/${p.slug}`} className="absolute inset-0 z-0" aria-label={`View ${p.name}`} />

                    {/* Image */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                      <SacredImageFrame
                        src={p.coverImage}
                        alt={p.name}
                        aspectRatio="square"
                        seoCategory="product"
                        className="p-0 border-none rounded-none w-full h-full"
                        imageClassName="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      
                      {p.isAbhimantrit && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#6B2635] text-white text-[9px] sm:text-[10px] font-black shadow-xs z-10 border border-[#C99A3D]">
                          🔥 अभिमंत्रित
                        </span>
                      )}
                      {!hasStock && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-gray-900/80 text-white text-[9px] font-bold z-10">
                          आउट ऑफ स्टॉक
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2.5 bg-white relative z-10 pointer-events-none">
                      <div className="space-y-1">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#E58A16] tracking-wider block truncate">
                          {p.category?.name || 'Sanatan Store'}
                        </span>
                        <h3 className="font-bold text-xs sm:text-base text-[#292321] line-clamp-2 leading-snug group-hover:text-[#E58A16] transition-colors pointer-events-auto">
                          <Link href={`/products/${p.slug}`}>{p.name}</Link>
                        </h3>
                      </div>
                      
                      <div className="pt-2 border-t border-[#E6D6BE] flex items-center justify-between pointer-events-auto gap-2">
                        <div>
                          <span className="text-[9px] sm:text-[10px] text-[#665E58] block font-medium">मूल्य:</span>
                          <span className="text-sm sm:text-lg font-black text-[#292321]">₹{Number(p.price).toLocaleString('en-IN')}</span>
                        </div>
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
        </div>
      </section>
    </div>
  )
}

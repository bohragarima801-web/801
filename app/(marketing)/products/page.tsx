import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { Sparkles, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { AddToCartButton } from '@/components/add-to-cart-button'
import { SacredImageFrame } from '@/components/ui/safe-image'

export function generateMetadata() {
  return generatePageMeta({
    title: 'वैदिक पूजा सामग्री — रुद्राक्ष, यंत्र, माला | DivyaYagyam',
    description: '100% अभिमंत्रित वैदिक सामग्री। रुद्राक्ष, यंत्र, पूजा थाली, माला — मंदिर से सीधे आपके घर। Free delivery on ₹999+.',
    path: '/products',
  })
}

const fallbackProducts = [
  {
    id: 'prod-1',
    slug: 'siddha-abhimantrit-rudraksha-mala',
    name: 'सिद्ध प्राण-प्रतिष्ठित चैतन्य रुद्राक्ष माला (Siddha Abhimantrit Rudraksha Mala)',
    price: 901,
    salePrice: 901,
    isAbhimantrit: true,
    coverImage: '/rudraksha_mala_product.jpg',
    category: { name: 'Rudraksha Mala' },
    inventory: { quantity: 500 }
  },
  {
    id: 'prod-2',
    slug: 'divya-shrikhand-chandan-puja-100g',
    name: 'दिव्य शुद्ध श्रीखण्ड मलयगिरि चन्दन (Divya Chandan for Puja & Tilak - 100g)',
    price: 200,
    salePrice: 200,
    isAbhimantrit: true,
    coverImage: '/divya_chandan_product.jpg',
    category: { name: 'Puja Samagri' },
    inventory: { quantity: 300 }
  },
  {
    id: 'prod-3',
    slug: 'divya-dhoop-special-negativity-remover-125g',
    name: 'दिव्य धूप स्पेशल - ३२ जड़ी-बूटी अभिमंत्रित सर्व दोष व नकारात्मक ऊर्जा नाशक (Divya Dhoop Special - 125g)',
    price: 599,
    salePrice: 599,
    isAbhimantrit: true,
    coverImage: '/divya_dhoop_product.jpg',
    category: { name: 'Puja Samagri' },
    inventory: { quantity: 600 }
  },
  {
    id: 'prod-4',
    slug: 'siddha-pure-copper-naag-naagin-pair-rahu-shanti',
    name: 'सिद्ध शुद्ध ताँबा नाग-नागिन जोड़ा - राहु-केतु व कालसर्प दोष शांति (Siddha Pure Copper Naag Naagin Pair - Small)',
    price: 599,
    salePrice: 599,
    isAbhimantrit: true,
    coverImage: '/naag_naagin_copper_product.jpg',
    category: { name: 'Rahu Shanti Items' },
    inventory: { quantity: 360 }
  },
  {
    id: 'prod-5',
    slug: 'siddha-9-abhimantrit-lakshmi-kaudi-set-free-gifts',
    name: 'सिद्ध अभिमंत्रित 9 महालक्ष्मी कौड़ी सेट - कर्ज मुक्ति व व्यापार बरकत (Siddha 9 Lakshmi Kaudi Set + FREE Gifts)',
    price: 899,
    salePrice: 899,
    isAbhimantrit: true,
    coverImage: '/laxmi_kaudi_set_product.jpg',
    category: { name: 'Lakshmi Wealth Items' },
    inventory: { quantity: 500 }
  }
]

export default async function ProductsPage() {
  const dbProducts = await prisma.product.findMany({
    where: {
      OR: [
        { status: 'ACTIVE' },
        { status: 'OUT_OF_STOCK' }
      ]
    },
    include: { category: true, inventory: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  const products = dbProducts.map(p => ({
    ...p,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null
  }))

  const displayProducts = products.length > 0 ? products : fallbackProducts

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
    <>
      <Script
        id="schema-products-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner (Bright Sanatani Gold) */}
      <section className="relative bg-gradient-to-b from-[#FFF8EB] via-[#FFF3D6] to-[#FFFDF7] py-14 md:py-20 overflow-hidden border-b border-[#F5E2B8]">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[rgba(212,155,0,0.06)] leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5D6] border border-[#F2C94C] shadow-xs mb-5">
            <Sparkles className="h-3.5 w-3.5 text-[#B37B00] fill-[#B37B00]" />
            <span className="text-[#8B5A00] text-[11px] font-extrabold uppercase tracking-[0.14em]">🛍️ Abhimantrit Store & Samagri</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#2A1508] leading-tight mb-4">
            Abhimantrit <span className="bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] bg-clip-text text-transparent">Prasad</span>
            <span className="block text-2xl md:text-3xl mt-2 text-[#8B1A21] font-semibold">(अभिमंत्रित सामग्री)</span>
          </h1>
          <p className="text-[#4A2D1B] text-base font-medium max-w-xl mx-auto">
            गंगाजल से अभिमंत्रित सिद्ध रुद्राक्ष माला, धूप-दीप, पूजन सामग्री और सिद्ध यंत्र।
          </p>
        </div>
      </section>

      {/* ── Products Grid */}
      <section className="bg-[#FFFDF7] py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {displayProducts.map((p, idx) => {
                const hasStock = p.inventory ? p.inventory.quantity > 0 : true
                return (
                  <article key={p.id} className={`puja-card-premium reveal reveal-delay-${Math.min(idx % 4 + 1, 5)} relative`}>
                    <Link href={`/products/${p.slug}`} className="absolute inset-0 z-0" aria-label={`View ${p.name}`} />

                    {/* Image */}
                    <div className="relative pointer-events-none aspect-square overflow-hidden">
                      <SacredImageFrame
                        src={p.coverImage}
                        alt={p.name}
                        aspectRatio="square"
                        seoCategory="product"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,4,2,0.40)] via-transparent to-transparent pointer-events-none" />
                      {p.isAbhimantrit && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white text-[10px] font-bold shadow-md z-10">
                          🔥 अभिमंत्रित
                        </span>
                      )}
                      {!hasStock && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[rgba(12,4,2,0.75)] text-[rgba(245,235,220,0.70)] text-[10px] font-bold z-10">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3 relative z-10 pointer-events-none">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#A87C28] dark:text-[#D4A843] tracking-wider">
                          {p.category?.name || 'Spiritual'}
                        </span>
                        <h3 className="font-heading font-bold text-base text-[#1E120A] dark:text-[#F5EBDC] line-clamp-2 leading-tight hover:text-[#8B1A21] transition-colors pointer-events-auto">
                          <Link href={`/products/${p.slug}`}>{p.name}</Link>
                        </h3>
                        <p className="text-xs text-[#5A4030] dark:text-[rgba(245,235,220,0.50)] line-clamp-2 mt-1 leading-snug">
                          {p.shortDescription || 'Blessed spiritual item prepared with Vedic rituals.'}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-[rgba(168,124,40,0.12)] flex items-center justify-between pointer-events-auto">
                        <div>
                          <span className="text-[10px] text-[#8B7355] dark:text-[rgba(245,235,220,0.40)]">Price</span>
                          <span className="block text-base font-black text-[#8B1A21] dark:text-[#E06070]">₹{Number(p.price).toLocaleString('en-IN')}</span>
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
        </div>
      </section>
    </>
  )
}

import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { prisma } from '@/lib/prisma'
import { PujaCard } from '@/components/puja-card'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const categories = await prisma.pujaCategory.findMany({ select: { slug: true } })
    return categories.filter(c => c.slug).map(c => ({ slug: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug }, { id: slug }] }
  })

  if (!category) {
    return generatePageMeta({
      title: 'Online Vedic Pujas | DivyaYagyam',
      description: 'Redirecting to authentic online puja rituals at DivyaYagyam.',
      path: `/pujas`,
      noIndex: true
    })
  }

  return generatePageMeta({
    title: `${category.name} — Online Vedic Puja & Anushthan`,
    description: `Book authentic online ${category.name} performed by learned Vedic priests at sacred temples. Name-Gotra Sankalp, live WhatsApp proof & prasad delivery.`,
    path: `/pujas/category/${category.slug}`
  })
}

export default async function PujaCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await prisma.pujaCategory.findFirst({
    where: { OR: [{ slug }, { id: slug }] }
  })

  if (!category) {
    permanentRedirect('/pujas')
  }

  const pujas = await prisma.puja.findMany({
    where: {
      categoryId: category.id,
      status: 'PUBLISHED',
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: new Date() } }
      ]
    },
    select: {
      id: true,
      name: true,
      slug: true,
      coverImage: true,
      price: true,
      isVip: true,
      isOnline: true,
      isEvergreen: true,
      isFestival: true,
      pujaDate: true,
      location: true,
      shortDescription: true,
      temple: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const serializedPujas = JSON.parse(JSON.stringify(pujas.map(p => ({
    ...p,
    price: Number(p.price)
  }))))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `${category.name} — Online Vedic Pujas`,
        itemListElement: serializedPujas.map((p: any, idx: number) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.name,
          url: `${BASE_URL}/pujas/${p.slug}`
        }))
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Pujas', url: `${BASE_URL}/pujas` },
        { name: category.name, url: `${BASE_URL}/pujas/category/${category.slug}` }
      ])
    ]
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-puja-category"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-12 md:py-16 border-b border-[#E6D6BE]">
        <div className="container relative z-10 max-w-5xl mx-auto px-4 text-center">
          <Link
            href="/pujas"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#E58A16] transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to All Pujas
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E6D6BE] shadow-2xs mb-3">
            <Sparkles className="h-3.5 w-3.5 text-[#E58A16]" />
            <span className="text-[#E58A16] text-xs font-black uppercase tracking-wider">
              {category.name}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-3">
            {category.name} <span className="text-[#E58A16]">Services</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Authentic Vedic rituals and anushthans in your name and gotra by learned priests across India's sacred temples.
          </p>
        </div>
      </section>

      <main className="container max-w-6xl mx-auto px-4 py-10">
        {serializedPujas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E6D6BE] p-8 max-w-md mx-auto">
            <Sparkles className="h-10 w-10 text-[#E58A16] mx-auto mb-3" />
            <h2 className="text-lg font-bold text-slate-800 mb-1">New Pujas Coming Soon</h2>
            <p className="text-xs text-slate-500 mb-5">
              Specialized rituals under {category.name} are being scheduled by our acharyas.
            </p>
            <Link
              href="/pujas"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#E58A16] text-white font-bold text-xs shadow-md"
            >
              Explore All Pujas
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serializedPujas.map((puja: any) => (
              <PujaCard key={puja.id} puja={puja} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

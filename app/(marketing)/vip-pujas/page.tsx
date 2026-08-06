import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { getCachedVipPujas } from '@/lib/cache'
import { VipPujasSection, VipPackageItem } from '@/components/vip-pujas-section'

export function generateMetadata() {
  return generatePageMeta({
    title: 'VIP Pujas — Exclusive, Personalized Vedic Rituals | DivyaYagyam',
    description: 'Experience priority scheduling, dedicated priests, extended Vedic rituals, detailed sankalp with your name and gotra, and personalized HD video & prasad delivery.',
    path: '/vip-pujas',
  })
}

export const revalidate = 10

export default async function VipPujasPage() {
  const dbPujas = await getCachedVipPujas()

  const mappedDbPackages: VipPackageItem[] = dbPujas.map((p: any) => ({
    id: p.id,
    name: p.name,
    shortDesc: p.shortDescription || p.description || 'Personalized VIP Vedic ritual.',
    location: p.location || 'Holy Temple, India',
    duration: 'Full-Day Special Ritual',
    priestsCount: '3 Senior Pandits',
    price: Number(p.vipPrice || p.price || 9500),
    categoryTag: p.category?.name || 'VIP Ritual',
    badgeTag: 'Exclusive',
    slug: p.slug,
    coverImage: p.coverImage || undefined
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'VIP Pujas', url: `${BASE_URL}/vip-pujas` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-vip-pujas-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VipPujasSection dbPackages={mappedDbPackages} />
    </>
  )
}

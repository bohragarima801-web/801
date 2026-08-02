
import Link from 'next/link'
import Image from 'next/image';
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { getAutoSeoAlt } from '@/lib/seo-auto'

import { getSafeImageUrl } from '@/lib/utils'

export function generateMetadata() {
  return generatePageMeta({
    title: 'ऑनलाइन पूजा बुकिंग — काशी, महाकाल, उज्जैन | DivyaYagyam',
    description: '100+ वैदिक पूजा अनुष्ठान ऑनलाइन बुक करें। रुद्राभिषेक, कालसर्प दोष निवारण, नवग्रह शांति — विद्वान आचार्यों द्वारा नाम व गोत्र संकल्प।',
    path: '/pujas',
  })
}
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Sparkles } from 'lucide-react'
import { getCachedPujas } from '@/lib/cache'

export const revalidate = 3600 // Cache public route on CDN Edge for up to 1 hour (revalidated on-demand)

export default async function PujasPage() {
  const pujas = await getCachedPujas()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'Sacred Online Vedic Pujas',
        itemListElement: pujas.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.name,
          url: `${BASE_URL}/pujas/${p.slug}`,
        })),
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Pujas', url: `${BASE_URL}/pujas` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-pujas-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-14 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="secondary" className="mb-3">🔥 Pujas</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Sacred Pujas (पूजा अनुष्ठान)</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          भारत के सुप्रसिद्ध शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे लाइव-स्ट्रीम पूजा। अपने नाम व गोत्र से संकल्प करवाएं।
        </p>
      </div>

      {pujas.length === 0 ? (
        <Card className="border-dashed max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="h-12 w-12 text-muted-foreground/60 mx-auto" />
            <h3 className="text-lg font-semibold">No Pujas Scheduled</h3>
            <p className="text-sm text-muted-foreground">Check back soon for available online Puja services or ask our AI Pandit.</p>
            
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pujas.map((p) => (
            <Card key={p.id} className="overflow-hidden group hover:shadow-xl transition-all border border-primary/10 flex flex-col justify-between">
              <Link href={`/pujas/${p.slug}`} className="relative aspect-[16/10] bg-slate-100 overflow-hidden block">
                {p.coverImage ? (
                  <Image src={getSafeImageUrl(p.coverImage)}
                    alt={getAutoSeoAlt(p.name, 'puja')}
                    fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-top transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-primary bg-[var(--secondary-color)]/10">
                    <Sparkles className="h-12 w-12 opacity-40" />
                  </div>
                )}
                {p.isVip && (
                  <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold border-none">
                    ⭐ VIP
                  </Badge>
                )}
              </Link>
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {p.category?.name || 'Sanatan Seva'}
                  </Badge>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-[var(--primary-color)] transition-colors">
                    <Link href={`/pujas/${p.slug}`}>{p.name}</Link>
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-[var(--primary-color)] shrink-0" />
                    {p.location || 'Any Holy Temple'}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">
                    {(p.shortDescription || 'Participate in this sacred puja for peace, health, and spiritual growth.').replace(/<[^>]*>?/gm, '')}
                  </p>
                </div>
                <div className="pt-3 border-t flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground">संकल्प मूल्य</span>
                      <span className="text-lg font-black text-[var(--primary-color)]">₹{p.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold shadow-sm" asChild>
                      <Link href={`/pujas/${p.slug}`}>View Details & Book</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </>
  )
}



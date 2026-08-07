import Link from 'next/link'
import Image from 'next/image';
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'Upcoming Hindu Puja, Yagya & Temple Events | DivyaYagyam',
    description: 'Upcoming Hindu temple events, Mahayagya, Mahashivratri, Navratri & festival Anushthan schedule. Join live or book online sankalp.',
    path: '/events',
  })
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Video, Sparkles, AlertCircle, ArrowRight, MessageCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const revalidate = 30

// Helper to get embeddable YouTube link if applicable
function getEmbedUrl(url: string | null) {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return url;
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { startsAt: 'asc' }
  }).catch(() => [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      ...events.map(e => ({
        '@type': 'Event',
        name: e.title,
        description: e.description || '',
        startDate: e.startsAt.toISOString(),
        location: {
          '@type': 'Place',
          name: e.location || 'DivyaYagyam Sanctuary',
        },
      })),
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Events', url: `${BASE_URL}/events` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-events-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-14 space-y-12">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold px-3 py-1 text-xs mb-2">
          🪔 Sacred Anushthan Schedule
        </Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Spiritual Events & Festivals</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          भारत के प्रमुख शक्तिपीठों एवं ज्योतिर्लिंगों से साक्षात उत्सव एवं पावन महायज्ञ सम्पादन।
        </p>
      </div>

      {/* SCHEDULE & UPCOMING EVENTS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-[var(--primary-color)] pl-3">
          आगामी उत्सव एवं अनुष्ठान (Upcoming Events & Rituals)
        </h2>

        {events.length === 0 ? (
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/50 p-8 md:p-12 border-2 border-amber-200 rounded-3xl text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-800 flex items-center justify-center mx-auto border border-amber-400">
              <Sparkles className="h-8 w-8 text-amber-700" />
            </div>
            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="text-2xl font-extrabold text-slate-900">
                आगामी पर्व एवं विशेष अनुष्ठान बुकिंग चालू है
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                महाशिवरात्रि, सावन सोमवार, एकादशी, प्रदोष व्रत एवं नवरात्रि विशेष अनुष्ठान हेतु विद्वान आचार्यों द्वारा नाम व गोत्र संकल्प बुकिंग खुली है।
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold h-12 px-6 rounded-xl shadow-md">
                <Link href="/pujas">
                  पूजा एवं अनुष्ठान सूची देखें (View Pujas) <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 font-bold h-12 px-6 rounded-xl">
                <a href="https://wa.me/919587171984?text=Namaste!%20I%20want%20information%20about%20upcoming%20puja%20events." target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4 text-green-600" /> WhatsApp पर इवेंट अलर्ट पाएं
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const startFormatted = new Date(e.startsAt).toLocaleDateString('hi-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })

              return (
                <Card key={e.id} className="overflow-hidden group hover:shadow-lg transition-all border border-slate-100 flex flex-col justify-between">
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {e.coverImage ? (
                      <Image src={e.coverImage} alt={e.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-primary bg-[var(--secondary-color)]/10">
                        <Sparkles className="h-10 w-10 opacity-30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs text-[var(--primary-color)] font-bold flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {startFormatted}
                      </div>
                      <h3 className="font-bold text-base text-slate-800 group-hover:text-[var(--primary-color)] transition-colors line-clamp-1">{e.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        {e.location || 'Holy Place'}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {e.description || 'Watch the sacred rituals and darshan.'}
                      </p>
                    </div>
                    <div className="pt-3 border-t">
                      <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs" asChild>
                        <Link href="/pujas">अनुष्ठान बुक करें (Book Puja)</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
    </>
  )
}


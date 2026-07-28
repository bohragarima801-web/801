'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Video, Flame } from 'lucide-react'
import Link from 'next/link'

function getEmbedUrl(url: string) {
  if (!url) return '';
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return url;
}

export default function Page() {
  const [offerings, setOfferings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/bhaktiseva')
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          // Show only active bhaktiSeva offerings on public page
          setOfferings((j.data || []).filter((o: any) => o.isActive))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container py-14 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="secondary" className="mb-3">🌼 Offerings</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">BhaktiSeva Seva</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Offer flowers, prasad, bhog, deep daan, or gau seva at India's most powerful, heritage temples.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : offerings.length === 0 ? (
        <Card className="border-dashed max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="h-12 w-12 text-muted-foreground/60 mx-auto" />
            <h3 className="text-lg font-semibold">No Offerings Active</h3>
            <p className="text-sm text-muted-foreground">Check back soon for available BhaktiSeva services.</p>
            <Button asChild size="sm">
              <Link href="/">Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((offering) => (
            <Card key={offering.id} className="overflow-hidden group hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-400 transition-all duration-500 border border-amber-200/60 bg-gradient-to-b from-amber-50/40 via-white to-white rounded-3xl relative">
              <div className="p-5 pb-0">
                {/* 3D Parallelogram Sacred Frame */}
                <div className="relative aspect-square w-full bg-gradient-to-tr from-amber-100/50 via-orange-50/30 to-amber-50 rounded-2xl overflow-hidden shadow-lg border border-amber-300/60 transition-transform duration-500 group-hover:scale-[1.02]"
                     style={{
                       clipPath: 'polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%)',
                       transform: 'perspective(1000px) rotateX(4deg) rotateY(-4deg)',
                       boxShadow: '0 20px 30px -10px rgba(234, 88, 12, 0.25), 0 10px 10px -5px rgba(245, 158, 11, 0.15)'
                     }}>
                  {offering.image ? (
                    <Image src={offering.image}
                      alt={offering.name}
                      fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="absolute inset-0 object-contain p-4 transition-transform duration-500 group-hover:scale-110 drop-shadow-xl"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-orange-400/40">
                      <Sparkles className="h-12 w-12" />
                    </div>
                  )}
                  {offering.videoUrl && (
                    <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5 shadow-md px-2.5 py-1 border-none font-bold text-[10px] z-10">
                      <Video className="h-3.5 w-3.5" /> Video
                    </Badge>
                  )}
                </div>
              </div>
              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{offering.name}</h3>
                  <div className="text-xl font-extrabold text-orange-600 mt-1">₹{Number(offering.price)}</div>
                </div>
                <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                  {offering.description || 'No description available for this sacred offering service.'}
                </p>
                {offering.isVideoEnabled && offering.videoUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden mt-4 border border-slate-200 bg-black shadow-sm ring-1 ring-black/5">
                    <iframe
                      src={getEmbedUrl(offering.videoUrl)}
                      className="h-full w-full"
                      allowFullScreen
                      title={offering.name}
                    />
                  </div>
                )}
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button size="sm" className="rounded-full px-6 bg-orange-600 hover:bg-orange-700 text-white shadow-sm hover:shadow-md transition-all" asChild>
                    <Link href={'/pujas'}>Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


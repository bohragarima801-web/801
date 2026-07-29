'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Calendar, Moon, Sun, Heart, Compass, Gem, ArrowRight, Bot, Repeat } from 'lucide-react'

export function SacredAstroTools() {
  const toolsList = [
    {
      title: 'AI पंडित जी (AI Pandit)',
      desc: 'सनातन धर्म, पूजा विधि व ज्योतिष संबंधी सवाल पूछें।',
      icon: Bot,
      slug: '/ask-a-pandit',
      tag: 'मुफ्त चैट',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      title: 'मुफ्त जन्म कुंडली (Kundali)',
      desc: 'अपनी सटीक वैदिक जन्म पत्रिका, ग्रह स्थिति व फल देखें।',
      icon: Sun,
      slug: '/tools/kundali',
      tag: 'फ्री सर्विस',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    {
      title: 'दैनिक पंचांग (Today Panchang)',
      desc: 'आज की तिथि, नक्षत्र, योग, करण व शुभ मुहूर्त।',
      icon: Calendar,
      slug: '/tools/panchang',
      tag: 'दैनिक अपडेट',
      color: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    },
    {
      title: 'कुंडली गुण मिलान (Kundali Milan)',
      desc: 'विवाह हेतु 36 गुण मिलान एवं अष्टकूट विश्लेषण।',
      icon: Heart,
      slug: '/tools/milan',
      tag: 'विवाह मिलान',
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    },
    {
      title: 'शुभ मुहूर्त (Shubh Muhurat)',
      desc: 'विवाह, वाहन क्रय, गृह प्रवेश के शुभ समय जानें।',
      icon: Compass,
      slug: '/tools/muhurat',
      tag: 'शुभ समय',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    },
    {
      title: 'जाप माला (Japa Mala Counter)',
      desc: '108 मंत्र जाप हेतु डिजिटल माला काउंटर।',
      icon: Repeat,
      slug: '/tools/mala',
      tag: 'भक्ति साधना',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    }
  ]

  return (
    <section className="container py-16 border-t border-border/40">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="sacred-subtitle text-primary inline-flex items-center gap-1.5 font-bold">
            <Sparkles className="h-4 w-4 text-amber-500" /> Vedic & Astro Tools
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight mt-1">
            🔮 पावन वैदिक <span className="sacred-gradient-text">एवं ज्योतिष टूल्स</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
            निःशुल्क जन्म कुंडली, पंचांग, विवाह मिलान एवं एआई पंडित जी से तुरंत सलाह प्राप्त करें।
          </p>
        </div>

        <Button variant="outline" className="border-border font-semibold shadow-sm rounded-xl shrink-0" asChild>
          <Link href="/tools" prefetch={true}>
            सभी टूल्स देखें <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolsList.map((t, idx) => {
          const IconComp = t.icon
          return (
            <Link href={t.slug} key={idx} prefetch={true} className="block group">
              <Card className="h-full border border-border/60 hover:border-amber-400/60 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card flex flex-col justify-between">
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center border ${t.color}`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="font-bold text-[10px]">
                      {t.tag}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      {t.desc}
                    </p>
                  </div>
                </CardContent>
                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <span>उपयोग करें &rarr;</span>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Calendar, Sun, Heart, Compass, ArrowRight, Bot, Repeat, ChevronRight } from 'lucide-react'

export function SacredAstroTools() {
  const toolsList = [
    {
      title: 'AI पंडित जी (AI Pandit)',
      desc: 'पूजा विधि व ज्योतिष संबंधी सवाल पूछें।',
      icon: Bot,
      slug: '/ask-a-pandit',
      tag: 'मुफ्त चैट',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      title: 'मुफ्त जन्म कुंडली (Kundali)',
      desc: 'वैदिक जन्म पत्रिका, ग्रह स्थिति व फल देखें।',
      icon: Sun,
      slug: '/tools/kundali',
      tag: 'फ्री सर्विस',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    {
      title: 'दैनिक पंचांग (Panchang)',
      desc: 'आज की तिथि, नक्षत्र व शुभ मुहूर्त।',
      icon: Calendar,
      slug: '/tools/panchang',
      tag: 'दैनिक अपडेट',
      color: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    },
    {
      title: 'कुंडली गुण मिलान (Milan)',
      desc: 'विवाह हेतु 36 गुण मिलान विश्लेषण।',
      icon: Heart,
      slug: '/tools/milan',
      tag: 'विवाह मिलान',
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    },
    {
      title: 'शुभ मुहूर्त (Shubh Muhurat)',
      desc: 'विवाह, वाहन व गृह प्रवेश का शुभ समय।',
      icon: Compass,
      slug: '/tools/muhurat',
      tag: 'शुभ समय',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    },
    {
      title: 'जाप माला (Japa Counter)',
      desc: '108 मंत्र जाप हेतु डिजिटल काउंटर।',
      icon: Repeat,
      slug: '/tools/mala',
      tag: 'भक्ति साधना',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    }
  ]

  return (
    <section className="container mx-auto px-4 md:px-6 py-8 md:py-12 border-t border-amber-100/60 dark:border-slate-800">
      {/* Compact Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200/80">
            <Sparkles className="h-3 w-3 text-amber-600 dark:text-amber-400" /> Astro & Vedic Tools
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            🔮 पावन वैदिक <span className="text-amber-600 dark:text-amber-400 font-bold">एवं ज्योतिष टूल्स</span>
          </h2>
        </div>

        <Button variant="ghost" size="sm" className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg px-3" asChild>
          <Link href="/tools" prefetch={true}>
            सभी टूल्स <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Sleek Compact Grid (2 cols mobile, 3 cols desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {toolsList.map((t, idx) => {
          const IconComp = t.icon
          return (
            <Link href={t.slug} key={idx} prefetch={true} className="block group">
              <Card className="p-3.5 border border-amber-200/60 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md hover:border-amber-400/80 transition-all duration-200 flex items-center justify-between gap-3 group-hover:-translate-y-0.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${t.color}`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs md:text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-700 transition-colors truncate">
                        {t.title}
                      </h3>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-extrabold text-amber-700 border-amber-200 bg-amber-50/50 shrink-0">
                        {t.tag}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                      {t.desc}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

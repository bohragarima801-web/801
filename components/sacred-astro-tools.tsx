'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Calendar, Sun, Heart, Compass, ArrowRight, Bot, Repeat, ChevronRight } from 'lucide-react'

export function SacredAstroTools({ limit = 6 }: { limit?: number }) {
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

  const displayTools = limit ? toolsList.slice(0, limit) : toolsList

  return (
    <section className="container mx-auto px-4 md:px-6 py-10 md:py-14 bg-[#FFF9EF] text-[#292321] notranslate" translate="no">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#E6D6BE] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F7EBD7] text-[#E58A16] font-bold text-xs border border-[#E6D6BE]">
            <Sparkles className="h-3 w-3" /> वैदिक ज्योतिष एवं पंचांग
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#292321] tracking-tight">
            🔮 पावन वैदिक <span className="text-[#E58A16]">एवं ज्योतिष टूल्स</span>
          </h2>
        </div>

        <Link
          href="/tools"
          prefetch={true}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#F7EBD7] text-[#292321] hover:text-[#E58A16] font-bold text-xs border border-[#E6D6BE] shadow-2xs transition-all self-start sm:self-auto"
        >
          <span>सभी टूल्स ({toolsList.length})</span>
          <span>➔</span>
        </Link>
      </div>

      {/* Sleek Compact Grid (1 col mobile, 2 cols tablet, 3 cols desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayTools.map((t, idx) => {
          const IconComp = t.icon
          return (
            <Link href={t.slug} key={idx} prefetch={true} className="block group">
              <Card className="p-3.5 border border-[#E6D6BE] rounded-2xl bg-white text-[#292321] shadow-2xs hover:shadow-md hover:border-[#E58A16] transition-all duration-200 flex items-center justify-between gap-3 group-hover:-translate-y-0.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center border border-[#E6D6BE] bg-[#F7EBD7] text-[#E58A16] shrink-0 font-bold">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-xs sm:text-sm text-[#292321] group-hover:text-[#E58A16] transition-colors line-clamp-1">
                        {t.title}
                      </h3>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold text-[#E58A16] border-[#E6D6BE] bg-[#F7EBD7] shrink-0">
                        {t.tag}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#665E58] font-normal leading-snug line-clamp-1">
                      {t.desc}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-[#E58A16] group-hover:translate-x-1 transition-all shrink-0" />
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

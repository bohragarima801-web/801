'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Calendar, Sun, Heart, Compass, ArrowRight, Bot, Repeat, ChevronRight, Flame, Gem } from 'lucide-react'

export function SacredAstroTools({ limit = 6 }: { limit?: number }) {
  const toolsList = [
    {
      title: 'एआई पंडित जी (AI Pandit Ji)',
      desc: 'पूजा विधि, व्रत नियम, मंत्र व कुंडली शंका का 24x7 सटीक समाधान।',
      icon: Bot,
      slug: '/ask-a-pandit',
      tag: '100% Free Chat',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    },
    {
      title: 'निःशुल्क जन्म कुंडली (Free Kundali)',
      desc: 'वैदिक लग्न चार्ट, नवमांश, ग्रह स्थिति, महादशा व भविष्य फल देखें।',
      icon: Sun,
      slug: '/tools/kundali',
      tag: 'वैदिक कुंडली',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    },
    {
      title: 'दैनिक पंचांग व चौघड़िया',
      desc: 'आज की तिथि, नक्षत्र, योग, करण, अभिजित मुहूर्त व राहुकाल समय।',
      icon: Calendar,
      slug: '/panchang',
      tag: 'दैनिक पंचांग',
      color: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    },
    {
      title: 'कुंडली मिलान (36 Guna Milan)',
      desc: 'वर-कन्या विवाह हेतु 36 गुण मिलान, नाड़ी दोष व मांगलिक विचार।',
      icon: Heart,
      slug: '/tools/kundali-milan',
      tag: 'विवाह मेलापक',
      color: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
    },
    {
      title: 'श्री गणेश सिद्ध प्रश्नावली',
      desc: 'मन में प्रश्न विचार कर गणपति बप्पा से कार्य सिद्धि का सटीक उत्तर जानें।',
      icon: Flame,
      slug: '/tools/shree-ganesh-siddha-prashnavali',
      tag: 'सिद्ध चौपड़',
      color: 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    },
    {
      title: 'श्री हनुमान प्रश्नावली',
      desc: 'संकटमोचन हनुमान जी का स्मरण कर तुरंत जानें मनोकामना व कार्य का फल।',
      icon: Flame,
      slug: '/tools/shree-hanuman-prashnavali',
      tag: 'संकटमोचन फल',
      color: 'bg-red-500/10 text-red-600 border-red-500/20'
    },
    {
      title: 'डिजिटल जाप माला (108 Japa Mala)',
      desc: '108 मनका डिजिटल काउंटर, ऑटो बीप व संकल्प ट्रैकर के साथ नाम सिमरन।',
      icon: Repeat,
      slug: '/tools/mala',
      tag: 'मंत्र साधना',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      title: 'शुभ मुहूर्त फाइंडर (Shubh Muhurat)',
      desc: 'विवाह, गृह प्रवेश, वाहन क्रय, नामकरण व व्यापार शुभारंभ के श्रेष्ठ मुहूर्त।',
      icon: Compass,
      slug: '/muhurat',
      tag: 'शुभ काल',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    },
    {
      title: 'अंक ज्योतिष (Numerology Calculator)',
      desc: 'जन्मतिथि से मूलांक, भाग्यांक, लकी नंबर व शुभ रंग तुरंत जानें।',
      icon: Gem,
      slug: '/tools/numerology',
      tag: 'अंक फल',
      color: 'bg-violet-500/10 text-violet-600 border-violet-500/20'
    }
  ]

  const displayTools = limit ? toolsList.slice(0, limit) : toolsList

  return (
    <section className="container mx-auto px-4 md:px-6 py-10 md:py-14 bg-white text-zinc-900 notranslate" translate="no">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-zinc-200 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200">
            <Sparkles className="h-3 w-3 text-amber-600" /> 100% प्रामाणिक वैदिक ज्योतिष टूल्स
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight font-heading">
            🔮 पावन वैदिक ज्योतिष <span className="text-amber-600">& पंचांग टूल्स</span>
          </h2>
        </div>

        <Link
          href="/tools"
          prefetch={true}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-zinc-900 hover:text-amber-600 font-bold text-xs border border-zinc-200 shadow-2xs transition-all self-start sm:self-auto"
        >
          <span>सभी टूल्स देखें ({toolsList.length})</span>
          <span>➔</span>
        </Link>
      </div>

      {/* Sleek Compact Grid (1 col mobile, 2 cols tablet, 3 cols desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayTools.map((t, idx) => {
          const IconComp = t.icon
          return (
            <Link href={t.slug} key={idx} prefetch={true} className="block group">
              <Card className="p-3.5 border border-zinc-200 rounded-2xl bg-white text-zinc-900 shadow-2xs hover:shadow-md hover:border-[#E58A16] transition-all duration-200 flex items-center justify-between gap-3 group-hover:-translate-y-0.5">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center border border-zinc-200 bg-amber-50 text-amber-600 shrink-0 font-bold">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {t.title}
                      </h3>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold text-amber-600 border-zinc-200 bg-amber-50 shrink-0">
                        {t.tag}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-normal leading-snug line-clamp-1">
                      {t.desc}
                    </p>
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-amber-600 group-hover:translate-x-1 transition-all shrink-0" />
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

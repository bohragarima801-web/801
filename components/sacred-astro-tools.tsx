'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Calendar, Moon, Sun, Heart, Compass, Gem, ArrowRight } from 'lucide-react'

export function SacredAstroTools() {
  const tools = [
    {
      title: 'आज का पंचांग (Daily Panchang)',
      description: 'सटीक तिथि, नक्षत्र, चौघड़िया, राहुकाल एवं शुभ मुहूर्त की जानकारी।',
      icon: Calendar,
      badge: 'लाइव पंचांग',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-300/40 text-amber-900 dark:text-amber-300',
      href: '/panchang',
    },
    {
      title: 'फ्री जन्म कुंडली (Free Kundali)',
      description: 'अपनी जन्म तिथि एवं समय दर्ज करके विस्तृत कुण्डली एवं ग्रह दशा देखें।',
      icon: Moon,
      badge: 'मुफ़्त कुण्डली',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-300/40 text-purple-900 dark:text-purple-300',
      href: '/astrology-calculator',
    },
    {
      title: 'दैनिक राशिफल (Daily Horoscope)',
      description: 'सभी 12 राशियों का आज का भाग्यफल, लव लाइफ एवं करियर भविष्यफल।',
      icon: Sun,
      badge: 'राशिफल',
      color: 'from-amber-400/20 to-yellow-500/10 border-yellow-300/40 text-yellow-900 dark:text-yellow-300',
      href: '/astrology-calculator',
    },
    {
      title: 'कुण्डली मिलान (Kundali Matching)',
      description: 'वर-वधू का 36 गुण मिलान, मंगल दोष एवं वैवाहिक जीवन विश्लेषण।',
      icon: Heart,
      badge: 'गुण मिलान',
      color: 'from-rose-500/20 to-pink-500/10 border-pink-300/40 text-pink-900 dark:text-pink-300',
      href: '/astrology-calculator',
    },
  ]

  return (
    <section className="container py-16 md:py-24 border-t border-border/40 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <span className="sacred-subtitle text-primary inline-flex items-center gap-1.5 font-bold">
            <Sparkles className="h-4 w-4 text-amber-500" /> Vedic Science & Astrology
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            🔮 सनातन एस्ट्रो <span className="sacred-gradient-text">एवं पंचांग टूल्स</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl font-medium">
            वैदिक ज्योतिष शास्त्र पर आधारित सटीक पंचांग, जन्म कुण्डली, राशिफल एवं गुण मिलान की सुविधा।
          </p>
        </div>

        <Button variant="outline" className="border-amber-300/60 text-foreground font-semibold hover:bg-amber-50 dark:hover:bg-slate-900" asChild>
          <Link href="/astrology-calculator">
            सभी ज्योतिष टूल्स देखें <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((t, idx) => {
          const Icon = t.icon
          return (
            <Link key={idx} href={t.href} className="block group">
              <Card className={`h-full border bg-gradient-to-br ${t.color} rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}>
                <CardContent className="p-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-white/90 dark:bg-slate-900 shadow-md flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="bg-white/80 dark:bg-slate-900 text-foreground font-bold text-[10px] px-2.5 py-1">
                      {t.badge}
                    </Badge>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors leading-tight">
                      {t.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">
                      {t.description}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                    अभी जांचें <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
  Sun,
  Moon,
  Calendar as CalendarIcon,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Flame,
  ShieldCheck,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function PublicPanchangPage() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi')
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(true)
  const [panchang, setPanchang] = useState<any>(null)

  const fetchPanchang = async (dateStr: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/panchang?date=${dateStr}`)
      const data = await res.json()
      if (data.success && data.panchang) {
        setPanchang(data.panchang)
      } else {
        setPanchang(null)
      }
    } catch (err) {
      toast.error('Failed to load Panchang data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPanchang(selectedDate)
  }, [selectedDate])

  const changeDateByDays = (days: number) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + days)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const t = {
    hi: {
      title: 'आज का सम्पूर्ण पंचांग',
      subTitle: 'सनातन वैदिक पंचांग, तिथि, नक्षत्र व शुभ-अशुभ मुहूर्त',
      today: 'आज',
      prevDay: 'पिछला दिन',
      nextDay: 'अगला दिन',
      tithi: 'तिथि (Tithi)',
      nakshatra: 'नक्षत्र (Nakshatra)',
      yog: 'योग (Yog)',
      karan: 'करण (Karan)',
      paksha: 'पक्ष व मास',
      day: 'वार (Day)',
      sunMoon: 'सूर्योदय व चंद्रोदय',
      shubhMuhurat: 'शुभ मुहूर्त (Auspicious Time)',
      ashubhMuhurat: 'अशुभ समय (Inauspicious Time)',
      abhijit: 'अभिजीत मुहूर्त',
      rahuKaal: 'राहुकाल',
      yamaganda: 'यमगंड काल',
      gulika: 'गुलिक काल',
      festival: 'विशेष व्रत एवं त्योहार',
      normalDay: 'सामान्य दिन',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      moonrise: 'चंद्रोदय',
      moonset: 'चंद्रास्त',
      share: 'शेयर करें',
    },
    en: {
      title: "Today's Vedic Panchang",
      subTitle: 'Sanatan Almanac, Tithi, Nakshatra & Auspicious Timings',
      today: 'Today',
      prevDay: 'Previous Day',
      nextDay: 'Next Day',
      tithi: 'Tithi',
      nakshatra: 'Nakshatra',
      yog: 'Yoga',
      karan: 'Karana',
      paksha: 'Paksha & Month',
      day: 'Day',
      sunMoon: 'Sun & Moon Timings',
      shubhMuhurat: 'Auspicious Timings',
      ashubhMuhurat: 'Inauspicious Timings',
      abhijit: 'Abhijit Muhurat',
      rahuKaal: 'Rahu Kaal',
      yamaganda: 'Yamaganda Kaal',
      gulika: 'Gulika Kaal',
      festival: 'Special Vrat & Festival',
      normalDay: 'Normal Day',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      moonrise: 'Moonrise',
      moonset: 'Moonset',
      share: 'Share',
    },
  }[lang]

  // Helper getters for language toggle
  const getVal = (hiField: string, enField: string) => {
    if (!panchang) return '--'
    if (lang === 'hi') {
      return panchang[hiField] || panchang[enField] || '--'
    }
    return panchang[enField] || panchang[hiField] || '--'
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t.title,
        text: `Panchang for ${selectedDate}: ${getVal('tithiHi', 'tithi')}, ${getVal('nakshatraHi', 'nakshatra')}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/70 via-orange-50/40 to-amber-100/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* --- Top Header & Controls --- */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
              वैदिक पंचांग | Sanatan Almanac
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-amber-950 tracking-tight">{t.title}</h1>
            <p className="text-xs md:text-sm text-amber-800/80 font-medium mt-0.5">{t.subTitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* Today Quick Button */}
            <Button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              variant="outline"
              className="border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 font-semibold text-xs rounded-xl h-9"
            >
              <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
              {t.today}
            </Button>

            {/* Date Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-amber-300 rounded-xl px-2.5 py-1 shadow-sm">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-amber-950 focus:outline-none cursor-pointer"
              />
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-xl transition"
              title={t.share}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- Day Navigation bar --- */}
        <div className="flex items-center justify-between bg-amber-100/60 border border-amber-200/80 rounded-xl px-4 py-2 text-xs font-bold text-amber-950">
          <button
            onClick={() => changeDateByDays(-1)}
            className="flex items-center gap-1 hover:text-amber-700 transition"
          >
            <ChevronLeft className="w-4 h-4" /> {t.prevDay}
          </button>
          <span className="font-mono text-amber-900 text-sm">
            {selectedDate} ({getVal('dayHi', 'day')})
          </span>
          <button
            onClick={() => changeDateByDays(1)}
            className="flex items-center gap-1 hover:text-amber-700 transition"
          >
            {t.nextDay} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* --- Hero Banner Date & Festival Card --- */}
        <div className="bg-gradient-to-br from-amber-700 via-amber-600 to-orange-700 rounded-2xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-amber-200 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span>{getVal('dayHi', 'day')}</span>
                <span>•</span>
                <span>{selectedDate}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold mt-1 tracking-tight">
                {getVal('hinduMonthHi', 'hinduMonth')} - {getVal('pakshaHi', 'paksha')}
              </h2>
              <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-xs md:text-sm font-semibold border border-white/30 shadow">
                <Flame className="w-4 h-4 text-amber-300" />
                <span>{t.festival}:</span>
                <span className="text-amber-100 font-bold">{getVal('specialFestivalHi', 'specialFestival')}</span>
              </div>
            </div>

            {/* Sun & Moon Quick Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-5 w-full md:w-auto">
              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-amber-300 animate-pulse" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-200">{t.sunrise} / {t.sunset}</div>
                  <div className="text-xs md:text-sm font-bold">
                    {panchang?.sunrise || '--'} - {panchang?.sunset || '--'}
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-white/20"></div>

              <div className="flex items-center gap-3">
                <Moon className="w-7 h-7 text-amber-100" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-200">{t.moonrise} / {t.moonset}</div>
                  <div className="text-xs md:text-sm font-bold">
                    {panchang?.moonrise || '--'} - {panchang?.moonset || '--'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Panchang 5 Main Anga Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tithi */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-200/80 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">📜 {t.tithi}</span>
              <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition"></div>
            </div>
            <div className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {getVal('tithiHi', 'tithi')}
            </div>
          </div>

          {/* Nakshatra */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-200/80 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">⭐ {t.nakshatra}</span>
              <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition"></div>
            </div>
            <div className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {getVal('nakshatraHi', 'nakshatra')}
            </div>
          </div>

          {/* Yog */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-200/80 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">🕉️ {t.yog}</span>
              <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition"></div>
            </div>
            <div className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {getVal('yogHi', 'yog')}
            </div>
          </div>

          {/* Karan */}
          <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-200/80 hover:shadow-lg transition group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">⚖️ {t.karan}</span>
              <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:scale-150 transition"></div>
            </div>
            <div className="text-base md:text-lg font-bold text-slate-900 leading-snug">
              {getVal('karanHi', 'karan')}
            </div>
          </div>
        </div>

        {/* --- Shubh & Ashubh Timings Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shubh Muhurat Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-base md:text-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {t.shubhMuhurat}
            </div>

            <div className="bg-white rounded-xl p-4 border border-emerald-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800 text-xs md:text-sm">{t.abhijit}</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 text-xs md:text-sm">
                {panchang?.abhijitMuhurat || '--'}
              </span>
            </div>
          </div>

          {/* Ashubh Timings Card */}
          <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-base md:text-lg">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              {t.ashubhMuhurat}
            </div>

            <div className="space-y-2">
              <div className="bg-white rounded-xl p-3 border border-rose-100 flex justify-between items-center shadow-sm">
                <span className="font-semibold text-slate-800 text-xs">{t.rahuKaal}</span>
                <span className="font-mono font-bold text-rose-700 text-xs">{panchang?.rahuKaal || '--'}</span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-rose-100 flex justify-between items-center shadow-sm">
                <span className="font-semibold text-slate-800 text-xs">{t.yamaganda}</span>
                <span className="font-mono font-bold text-rose-700 text-xs">{panchang?.yamagandaKaal || '--'}</span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-rose-100 flex justify-between items-center shadow-sm">
                <span className="font-semibold text-slate-800 text-xs">{t.gulika}</span>
                <span className="font-mono font-bold text-rose-700 text-xs">{panchang?.gulikaKaal || '--'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

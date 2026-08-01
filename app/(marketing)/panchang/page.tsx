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
  Flame,
  ShieldCheck,
  Share2,
  Sparkle,
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
      }
    } catch (err) {
      toast.error('Panchang loading failed')
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
      title: '🕉️ आज का सम्पूर्ण वैदिक पंचांग',
      subTitle: 'दिव्ययज्ञम् - तिथि, नक्षत्र, सूर्योदय एवं शुभ-अशुभ मुहूर्त',
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
      shubhMuhurat: 'शुभ मुहूर्त (Auspicious Timings)',
      ashubhMuhurat: 'अशुभ समय (Inauspicious Timings)',
      abhijit: 'अभिजीत मुहूर्त',
      rahuKaal: 'राहुकाल',
      yamaganda: 'यमगंड काल',
      gulika: 'गुलिक काल',
      festival: 'विशेष व्रत एवं त्योहार',
      normalDay: 'सामान्य शुभ दिन',
      sunrise: 'सूर्योदय',
      sunset: 'सूर्यास्त',
      moonrise: 'चंद्रोदय',
      moonset: 'चंद्रास्त',
      share: 'शेयर करें',
    },
    en: {
      title: "🕉️ Daily Vedic Panchang",
      subTitle: 'Divyayagyam - Tithi, Nakshatra, Sunrise & Auspicious Timings',
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
      normalDay: 'Auspicious Day',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      moonrise: 'Moonrise',
      moonset: 'Moonset',
      share: 'Share',
    },
  }[lang]

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
        text: `Divyayagyam Panchang for ${selectedDate}: ${getVal('tithiHi', 'tithi')}, ${getVal('nakshatraHi', 'nakshatra')}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-amber-100 to-amber-200 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative font-sans">
      
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* --- Top Bright Yellow & Sacred Red Header --- */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-yellow-400 text-red-950 border border-yellow-300 rounded-full text-xs font-black mb-2 shadow">
              <Sparkles className="w-4 h-4 text-red-700 animate-bounce" />
              दिव्ययज्ञम् | BRIGHT VEDIC PANCHANG
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-yellow-300 tracking-tight drop-shadow-md">
              {t.title}
            </h1>
            <p className="text-xs md:text-sm text-yellow-100 font-bold mt-0.5">{t.subTitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            {/* 3D Tactile Today Button */}
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="bg-gradient-to-b from-yellow-300 to-amber-400 hover:from-yellow-200 hover:to-amber-300 text-red-950 font-black text-xs px-4 py-2 rounded-xl border-b-4 border-amber-600 shadow-lg active:border-b-0 active:translate-y-1 transition-all flex items-center gap-1.5"
            >
              <CalendarIcon className="w-4 h-4 text-red-800" />
              {t.today}
            </button>

            {/* 3D Tactile Date Selector */}
            <div className="flex items-center gap-1.5 bg-white border-2 border-amber-500 rounded-xl px-3 py-1.5 shadow-inner">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-black text-red-900 focus:outline-none cursor-pointer"
              />
            </div>

            {/* 3D Tactile Language Switcher */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="bg-gradient-to-b from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-red-950 font-black px-4 py-2 rounded-xl border-b-4 border-amber-700 shadow-lg active:border-b-0 active:translate-y-1 transition-all flex items-center gap-1.5 text-xs"
            >
              <Globe className="w-4 h-4 text-red-900" />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {/* 3D Share Button */}
            <button
              onClick={handleShare}
              className="bg-gradient-to-b from-yellow-300 to-amber-400 text-red-950 p-2.5 rounded-xl border-b-4 border-amber-600 shadow-lg active:border-b-0 active:translate-y-1 transition-all"
              title={t.share}
            >
              <Share2 className="w-4 h-4 text-red-900" />
            </button>
          </div>
        </div>

        {/* --- 3D Date Navigation Bar --- */}
        <div className="flex items-center justify-between bg-white border-3 border-amber-400 rounded-2xl px-5 py-3 text-xs font-black text-red-900 shadow-xl">
          <button
            onClick={() => changeDateByDays(-1)}
            className="bg-gradient-to-b from-amber-400 to-amber-500 text-red-950 px-3 py-1.5 rounded-xl border-b-3 border-amber-700 shadow active:translate-y-0.5 transition flex items-center gap-1 font-extrabold"
          >
            <ChevronLeft className="w-4 h-4" /> {t.prevDay}
          </button>
          <span className="font-mono text-red-800 text-sm md:text-base font-black tracking-wide bg-amber-100 px-4 py-1 rounded-xl border border-amber-300">
            {selectedDate} ({getVal('dayHi', 'day')})
          </span>
          <button
            onClick={() => changeDateByDays(1)}
            className="bg-gradient-to-b from-amber-400 to-amber-500 text-red-950 px-3 py-1.5 rounded-xl border-b-3 border-amber-700 shadow active:translate-y-0.5 transition flex items-center gap-1 font-extrabold"
          >
            {t.nextDay} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* --- Bright Yellow & Red Special Festival Hero Card --- */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-orange-600 rounded-3xl p-6 md:p-8 border-4 border-yellow-400 shadow-2xl text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-yellow-300 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <span>{getVal('dayHi', 'day')}</span>
                <span>•</span>
                <span>{selectedDate}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black mt-1 text-yellow-300 tracking-tight drop-shadow-md">
                {getVal('hinduMonthHi', 'hinduMonth')} — {getVal('pakshaHi', 'paksha')}
              </h2>

              {/* 3D Highlighted Festival Badge */}
              <div className="mt-4 inline-flex items-center gap-2.5 bg-yellow-400 text-red-950 border-b-4 border-yellow-600 px-5 py-2.5 rounded-2xl text-xs md:text-sm font-black shadow-xl">
                <Flame className="w-5 h-5 text-red-700 animate-pulse" />
                <span className="text-red-900 uppercase font-black">{t.festival}:</span>
                <span className="text-red-950 font-black text-sm md:text-base">{getVal('specialFestivalHi', 'specialFestival')}</span>
              </div>
            </div>

            {/* Sun & Moon Times 3D Box */}
            <div className="bg-white text-red-950 border-3 border-amber-400 rounded-2xl p-4 flex items-center gap-5 w-full md:w-auto shadow-xl">
              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />
                <div>
                  <div className="text-[10px] uppercase font-black text-red-800">{t.sunrise} / {t.sunset}</div>
                  <div className="text-xs md:text-sm font-mono font-black text-red-950">
                    {panchang?.sunrise || '--'} - {panchang?.sunset || '--'}
                  </div>
                </div>
              </div>

              <div className="h-8 w-1 bg-amber-300 rounded"></div>

              <div className="flex items-center gap-3">
                <Moon className="w-7 h-7 text-indigo-600" />
                <div>
                  <div className="text-[10px] uppercase font-black text-red-800">{t.moonrise} / {t.moonset}</div>
                  <div className="text-xs md:text-sm font-mono font-black text-red-950">
                    {panchang?.moonrise || '--'} - {panchang?.moonset || '--'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Panchang 5 Main Anga 3D Cards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tithi */}
          <div className="bg-white border-3 border-amber-400 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-red-800 uppercase tracking-wider">📜 {t.tithi}</span>
              <div className="w-3 h-3 rounded-full bg-red-600 shadow-md"></div>
            </div>
            <div className="text-base font-black text-red-950 leading-snug">
              {getVal('tithiHi', 'tithi')}
            </div>
          </div>

          {/* Nakshatra */}
          <div className="bg-white border-3 border-amber-400 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-red-800 uppercase tracking-wider">⭐ {t.nakshatra}</span>
              <div className="w-3 h-3 rounded-full bg-red-600 shadow-md"></div>
            </div>
            <div className="text-base font-black text-red-950 leading-snug">
              {getVal('nakshatraHi', 'nakshatra')}
            </div>
          </div>

          {/* Yog */}
          <div className="bg-white border-3 border-amber-400 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-red-800 uppercase tracking-wider">🕉️ {t.yog}</span>
              <div className="w-3 h-3 rounded-full bg-red-600 shadow-md"></div>
            </div>
            <div className="text-base font-black text-red-950 leading-snug">
              {getVal('yogHi', 'yog')}
            </div>
          </div>

          {/* Karan */}
          <div className="bg-white border-3 border-amber-400 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition hover:-translate-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-red-800 uppercase tracking-wider">⚖️ {t.karan}</span>
              <div className="w-3 h-3 rounded-full bg-red-600 shadow-md"></div>
            </div>
            <div className="text-base font-black text-red-950 leading-snug">
              {getVal('karanHi', 'karan')}
            </div>
          </div>
        </div>

        {/* --- Shubh & Ashubh Muhurat Timings Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shubh Muhurat Card (Emerald Green 3D Box) */}
          <div className="bg-gradient-to-b from-emerald-500 to-emerald-700 border-4 border-emerald-300 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-2 font-black text-lg text-yellow-300">
              <CheckCircle2 className="w-6 h-6 text-yellow-300" />
              {t.shubhMuhurat}
            </div>

            <div className="bg-white text-slate-900 rounded-2xl p-4 border-2 border-emerald-400 flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="font-black text-emerald-950 text-xs md:text-sm">{t.abhijit}</span>
              </div>
              <span className="font-mono font-black text-emerald-700 text-xs md:text-sm bg-emerald-100 px-3 py-1 rounded-xl">
                {panchang?.abhijitMuhurat || '--'}
              </span>
            </div>
          </div>

          {/* Ashubh Timings Card (Red 3D Box) */}
          <div className="bg-gradient-to-b from-red-600 to-rose-700 border-4 border-red-400 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-2 font-black text-lg text-yellow-300">
              <AlertTriangle className="w-6 h-6 text-yellow-300" />
              {t.ashubhMuhurat}
            </div>

            <div className="space-y-2">
              <div className="bg-white text-slate-900 rounded-2xl p-3 border-2 border-red-300 flex justify-between items-center shadow-lg">
                <span className="font-black text-red-950 text-xs">{t.rahuKaal}</span>
                <span className="font-mono font-black text-red-700 text-xs bg-red-100 px-3 py-1 rounded-xl">{panchang?.rahuKaal || '--'}</span>
              </div>

              <div className="bg-white text-slate-900 rounded-2xl p-3 border-2 border-red-300 flex justify-between items-center shadow-lg">
                <span className="font-black text-red-950 text-xs">{t.yamaganda}</span>
                <span className="font-mono font-black text-red-700 text-xs bg-red-100 px-3 py-1 rounded-xl">{panchang?.yamagandaKaal || '--'}</span>
              </div>

              <div className="bg-white text-slate-900 rounded-2xl p-3 border-2 border-red-300 flex justify-between items-center shadow-lg">
                <span className="font-black text-red-950 text-xs">{t.gulika}</span>
                <span className="font-mono font-black text-red-700 text-xs bg-red-100 px-3 py-1 rounded-xl">{panchang?.gulikaKaal || '--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sacred Bright Yellow Footer */}
        <div className="pt-6 pb-4 text-center text-xs text-red-900 font-black tracking-widest">
          ❖ 🕉️ DIVYAYAGYAM BRIGHT VEDIC PANCHANG 🕉️ ❖
        </div>

      </div>
    </div>
  )
}

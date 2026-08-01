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
  Award,
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
      title: '🕉️ आज का सम्पूर्ण पंचांग',
      subTitle: 'दिव्ययज्ञम् - सनातन वैदिक पंचांग, तिथि, नक्षत्र एवं शुभ-अशुभ मुहूर्त',
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
      subTitle: 'Divyayagyam - Sanatan Almanac, Tithi, Nakshatra & Auspicious Timings',
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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-black text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Decorative Gold Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* --- Top Glass Header & Controls --- */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-amber-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              दिव्ययज्ञम् | Divyayagyam Panchang
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">{t.subTitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <Button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              variant="outline"
              className="border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/50 font-semibold text-xs rounded-xl h-9"
            >
              <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              {t.today}
            </Button>

            <div className="flex items-center gap-1.5 bg-slate-950/90 border border-amber-500/40 rounded-xl px-3 py-1.5 shadow-inner">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-900/30"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/50 rounded-xl transition shadow-sm"
              title={t.share}
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* --- Date Navigation Bar --- */}
        <div className="flex items-center justify-between bg-slate-900/90 border border-amber-500/20 rounded-xl px-4 py-2.5 text-xs font-bold text-amber-300 shadow-md">
          <button
            onClick={() => changeDateByDays(-1)}
            className="flex items-center gap-1 hover:text-amber-200 transition"
          >
            <ChevronLeft className="w-4 h-4" /> {t.prevDay}
          </button>
          <span className="font-mono text-amber-200 text-sm tracking-wide">
            {selectedDate} ({getVal('dayHi', 'day')})
          </span>
          <button
            onClick={() => changeDateByDays(1)}
            className="flex items-center gap-1 hover:text-amber-200 transition"
          >
            {t.nextDay} <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* --- Luxurious Special Festival Banner --- */}
        <div className="bg-gradient-to-r from-amber-950/90 via-orange-950/90 to-slate-900 rounded-2xl p-6 md:p-8 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-60 h-60 bg-amber-500/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition duration-700"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span>{getVal('dayHi', 'day')}</span>
                <span>•</span>
                <span>{selectedDate}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-extrabold mt-1 text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-200 tracking-tight">
                {getVal('hinduMonthHi', 'hinduMonth')} — {getVal('pakshaHi', 'paksha')}
              </h2>

              {/* Highlighted Festival Pill */}
              <div className="mt-4 inline-flex items-center gap-2.5 bg-amber-500/20 border border-amber-500/50 px-5 py-2.5 rounded-full text-xs md:text-sm font-extrabold text-amber-200 shadow-lg shadow-amber-950/40">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-amber-400">{t.festival}:</span>
                <span className="text-amber-100 font-black">{getVal('specialFestivalHi', 'specialFestival')}</span>
              </div>
            </div>

            {/* Sun & Moon Times Banner */}
            <div className="bg-slate-950/80 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 flex items-center gap-5 w-full md:w-auto shadow-inner">
              <div className="flex items-center gap-3">
                <Sun className="w-8 h-8 text-amber-400 animate-spin-slow" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-400/80">{t.sunrise} / {t.sunset}</div>
                  <div className="text-xs md:text-sm font-mono font-bold text-amber-100">
                    {panchang?.sunrise || '--'} - {panchang?.sunset || '--'}
                  </div>
                </div>
              </div>

              <div className="h-8 w-px bg-amber-500/30"></div>

              <div className="flex items-center gap-3">
                <Moon className="w-7 h-7 text-amber-200" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-400/80">{t.moonrise} / {t.moonset}</div>
                  <div className="text-xs md:text-sm font-mono font-bold text-amber-100">
                    {panchang?.moonrise || '--'} - {panchang?.moonset || '--'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Panchang 5 Main Anga Cards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tithi */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30 shadow-xl hover:border-amber-500/60 transition group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">📜 {t.tithi}</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50 group-hover:scale-150 transition"></div>
            </div>
            <div className="text-base font-bold text-amber-100 leading-snug">
              {getVal('tithiHi', 'tithi')}
            </div>
          </div>

          {/* Nakshatra */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30 shadow-xl hover:border-amber-500/60 transition group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">⭐ {t.nakshatra}</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50 group-hover:scale-150 transition"></div>
            </div>
            <div className="text-base font-bold text-amber-100 leading-snug">
              {getVal('nakshatraHi', 'nakshatra')}
            </div>
          </div>

          {/* Yog */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30 shadow-xl hover:border-amber-500/60 transition group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">🕉️ {t.yog}</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50 group-hover:scale-150 transition"></div>
            </div>
            <div className="text-base font-bold text-amber-100 leading-snug">
              {getVal('yogHi', 'yog')}
            </div>
          </div>

          {/* Karan */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30 shadow-xl hover:border-amber-500/60 transition group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">⚖️ {t.karan}</span>
              <div className="w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-500/50 group-hover:scale-150 transition"></div>
            </div>
            <div className="text-base font-bold text-amber-100 leading-snug">
              {getVal('karanHi', 'karan')}
            </div>
          </div>
        </div>

        {/* --- Shubh & Ashubh Muhurat Timings Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shubh Muhurat Card (Emerald Gold) */}
          <div className="bg-emerald-950/40 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-base md:text-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              {t.shubhMuhurat}
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-emerald-500/30 flex justify-between items-center shadow-inner">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-emerald-200 text-xs md:text-sm">{t.abhijit}</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-xs md:text-sm">
                {panchang?.abhijitMuhurat || '--'}
              </span>
            </div>
          </div>

          {/* Ashubh Timings Card (Soft Red Gold) */}
          <div className="bg-rose-950/40 backdrop-blur-xl border border-rose-500/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-base md:text-lg">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              {t.ashubhMuhurat}
            </div>

            <div className="space-y-2">
              <div className="bg-slate-950/80 rounded-xl p-3 border border-rose-500/30 flex justify-between items-center shadow-inner">
                <span className="font-bold text-rose-200 text-xs">{t.rahuKaal}</span>
                <span className="font-mono font-bold text-rose-400 text-xs">{panchang?.rahuKaal || '--'}</span>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-3 border border-rose-500/30 flex justify-between items-center shadow-inner">
                <span className="font-bold text-rose-200 text-xs">{t.yamaganda}</span>
                <span className="font-mono font-bold text-rose-400 text-xs">{panchang?.yamagandaKaal || '--'}</span>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-3 border border-rose-500/30 flex justify-between items-center shadow-inner">
                <span className="font-bold text-rose-200 text-xs">{t.gulika}</span>
                <span className="font-mono font-bold text-rose-400 text-xs">{panchang?.gulikaKaal || '--'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sacred Geometry Footer Motif */}
        <div className="pt-8 pb-4 text-center text-xs text-amber-500/60 font-mono tracking-widest">
          ❖ 🕉️ DIVYAYAGYAM SANATAN PANCHANG 🕉️ ❖
        </div>

      </div>
    </div>
  )
}

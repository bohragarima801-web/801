'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Globe,
  Sparkles,
  Search,
  BookOpen,
  Info,
  Flame,
  Star,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const MONTHS_HI = [
  'जनवरी (Jan)', 'फरवरी (Feb)', 'मार्च (Mar)', 'अप्रैल (Apr)',
  'मई (May)', 'जून (Jun)', 'जुलाई (Jul)', 'अगस्त (Aug)',
  'सितंबर (Sep)', 'अक्टूबर (Oct)', 'नवंबर (Nov)', 'दिसंबर (Dec)'
]

const MONTHS_EN = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

export default function PublicFestivalsPage() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi')
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [selectedMonth, setSelectedMonth] = useState<number>(8)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [search, setSearch] = useState<string>('')
  const [festivals, setFestivals] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchFestivals = async () => {
    setLoading(true)
    try {
      let url = `/api/festivals?year=${selectedYear}&month=${selectedMonth}`
      if (selectedCategory !== 'ALL') {
        url += `&category=${encodeURIComponent(selectedCategory)}`
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`
      }
      const res = await fetch(url)
      const data = await res.json()
      if (data.success && data.festivals) {
        setFestivals(data.festivals)
      }
    } catch (err) {
      toast.error('Failed to load festivals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFestivals()
  }, [selectedYear, selectedMonth, selectedCategory, search])

  const t = {
    hi: {
      title: '🕉️ सनातन व्रत एवं त्योहार तालिका',
      subTitle: 'दिव्ययज्ञम् - प्रमुख हिंदू त्योहार, एकादशी, व्रत एवं उनका पावन धार्मिक महत्व',
      all: 'सभी व्रत-त्योहार',
      major: 'मुख्य त्योहार',
      vrat: 'व्रत व उपवास',
      ekadashi: 'एकादशी',
      jayanti: 'जयंती',
      searchPlaceholder: 'त्योहार या व्रत खोजें...',
      noFestivals: 'इस महीने कोई प्रमुख त्योहार नहीं मिला।',
      significance: 'धार्मिक महत्व व महिमा',
      share: 'शेयर करें',
    },
    en: {
      title: '🕉️ Sanatan Festival & Vrat Calendar',
      subTitle: 'Divyayagyam - Major Hindu Festivals, Ekadashi, Fasting Dates & Significance',
      all: 'All Festivals',
      major: 'Major Festivals',
      vrat: 'Vrat & Fasts',
      ekadashi: 'Ekadashi',
      jayanti: 'Jayanti',
      searchPlaceholder: 'Search festival or vrat...',
      noFestivals: 'No festivals found for this month.',
      significance: 'Significance & Importance',
      share: 'Share',
    },
  }[lang]

  const getVal = (row: any, hiField: string, enField: string) => {
    if (lang === 'hi') return row[hiField] || row[enField] || '--'
    return row[enField] || row[hiField] || '--'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-300 via-amber-100 to-amber-200 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 relative font-sans">
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Top Bright Yellow & Sacred Red Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-orange-600 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-yellow-400 text-red-950 border border-yellow-300 rounded-full text-xs font-black mb-2 shadow">
              <Sparkles className="w-4 h-4 text-red-700 animate-bounce" />
              व्रत एवं पर्व तालिका | FESTIVAL DIRECTORY
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-yellow-300 tracking-tight drop-shadow-md">
              {t.title}
            </h1>
            <p className="text-xs md:text-sm text-yellow-100 font-bold mt-0.5">{t.subTitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* 3D Tactile Language Switcher */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="bg-gradient-to-b from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-red-950 font-black px-4 py-2.5 rounded-xl border-b-4 border-amber-700 shadow-lg active:border-b-0 active:translate-y-1 transition-all flex items-center gap-1.5 text-xs"
            >
              <Globe className="w-4 h-4 text-red-900" />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>
          </div>
        </div>

        {/* Controls Bar with 3D Tactile Buttons: Month / Year / Category / Search */}
        <div className="bg-white rounded-3xl p-5 border-4 border-amber-400 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-amber-50 border-2 border-amber-400 rounded-xl px-3.5 py-2 text-xs font-black text-red-950 focus:outline-none cursor-pointer shadow-inner"
              >
                {(lang === 'hi' ? MONTHS_HI : MONTHS_EN).map((m, idx) => (
                  <option key={idx} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-amber-50 border-2 border-amber-400 rounded-xl px-3 py-2 text-xs font-black text-red-950 focus:outline-none cursor-pointer shadow-inner"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-red-600" />
              <Input
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-amber-50 border-2 border-amber-400 text-red-950 text-xs font-bold rounded-xl focus:border-red-600"
              />
            </div>
          </div>

          {/* 3D Tactile Category Filter Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t-2 border-amber-200 text-xs">
            {[
              { id: 'ALL', label: t.all },
              { id: 'Major Festival', label: t.major },
              { id: 'Vrat', label: t.vrat },
              { id: 'Ekadashi', label: t.ekadashi },
              { id: 'Jayanti', label: t.jayanti },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl font-black transition-all border-b-4 shadow-md active:border-b-0 active:translate-y-1 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-b from-red-600 to-red-800 text-yellow-300 border-red-950 shadow-red-900/30'
                    : 'bg-gradient-to-b from-yellow-300 to-amber-400 text-red-950 border-amber-600 hover:brightness-105'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Festival Cards List */}
        {loading ? (
          <div className="p-12 text-center text-red-800 font-black animate-bounce text-base">Loading Festivals...</div>
        ) : festivals.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 space-y-2 border-4 border-amber-400 shadow-2xl">
            <Info className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="font-black text-red-950">{t.noFestivals}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {festivals.map((fest) => {
              const dateObj = new Date(fest.date)
              const formattedDate = dateObj.toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })

              return (
                <div
                  key={fest.id}
                  className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-amber-400 hover:border-red-600 transition space-y-4 relative overflow-hidden group hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* 3D Date Pill */}
                      <div className="bg-gradient-to-b from-red-600 to-red-800 border-b-4 border-red-950 text-yellow-300 font-black px-4 py-2.5 rounded-2xl text-center shadow-lg shrink-0">
                        <div className="text-2xl leading-none font-black">{dateObj.getDate()}</div>
                        <div className="text-[10px] uppercase tracking-wider mt-0.5 font-black text-white">
                          {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-red-700 font-black">{formattedDate}</div>
                        <h3 className="text-lg font-black text-red-950 mt-0.5 leading-snug">
                          {getVal(fest, 'festivalHi', 'festival')}
                        </h3>
                      </div>
                    </div>

                    <Badge variant="outline" className="bg-yellow-100 text-red-900 border-2 border-amber-400 shrink-0 font-black text-xs">
                      {getVal(fest, 'categoryHi', 'category')}
                    </Badge>
                  </div>

                  {/* Significance */}
                  {(fest.significanceHi || fest.significance) && (
                    <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-300 text-xs text-slate-800 font-bold leading-relaxed shadow-inner">
                      <div className="font-black text-red-900 mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-red-600" />
                        {t.significance}:
                      </div>
                      <p>{getVal(fest, 'significanceHi', 'significance')}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="pt-6 pb-4 text-center text-xs text-red-900 font-black tracking-widest">
          ❖ 🕉️ DIVYAYAGYAM BRIGHT FESTIVAL CALENDAR 🕉️ ❖
        </div>

      </div>
    </div>
  )
}

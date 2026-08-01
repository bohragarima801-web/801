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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950/20 to-black text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        
        {/* Top Glass Header */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-6 shadow-2xl shadow-amber-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              व्रत एवं पर्व तालिका | Divyayagyam Festival Directory
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 tracking-tight">
              {t.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium mt-0.5">{t.subTitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-900/30"
            >
              <Globe className="w-4 h-4" />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>
          </div>
        </div>

        {/* Controls Bar: Month / Year / Category / Search */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
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
                className="bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none cursor-pointer"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/60" />
              <Input
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-950 border-amber-500/30 text-amber-200 text-xs rounded-xl focus:border-amber-500"
              />
            </div>
          </div>

          {/* Category Filter Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-500/20 text-xs">
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
                className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-900/40 font-bold'
                    : 'bg-slate-950 text-amber-300 border border-amber-500/30 hover:bg-amber-950/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Festival Cards List */}
        {loading ? (
          <div className="p-12 text-center text-amber-400 font-semibold animate-pulse">Loading Festivals...</div>
        ) : festivals.length === 0 ? (
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-12 text-center text-slate-400 space-y-2 border border-amber-500/30 shadow-xl">
            <Info className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="font-bold text-amber-200">{t.noFestivals}</p>
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
                  className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-amber-500/30 hover:border-amber-500/60 transition space-y-4 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black px-3.5 py-2.5 rounded-xl text-center shadow-lg shrink-0">
                        <div className="text-xl leading-none">{dateObj.getDate()}</div>
                        <div className="text-[10px] uppercase tracking-wider mt-0.5 font-bold">
                          {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-amber-400 font-semibold">{formattedDate}</div>
                        <h3 className="text-lg font-bold text-amber-100 mt-0.5 leading-snug">
                          {getVal(fest, 'festivalHi', 'festival')}
                        </h3>
                      </div>
                    </div>

                    <Badge variant="outline" className="bg-amber-950/60 text-amber-300 border-amber-500/40 shrink-0 text-xs">
                      {getVal(fest, 'categoryHi', 'category')}
                    </Badge>
                  </div>

                  {/* Significance */}
                  {(fest.significanceHi || fest.significance) && (
                    <div className="bg-slate-950/90 rounded-xl p-4 border border-amber-500/20 text-xs text-slate-300 leading-relaxed shadow-inner">
                      <div className="font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
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

        <div className="pt-8 pb-4 text-center text-xs text-amber-500/60 font-mono tracking-widest">
          ❖ 🕉️ DIVYAYAGYAM FESTIVAL CALENDAR 🕉️ ❖
        </div>

      </div>
    </div>
  )
}

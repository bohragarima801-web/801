'use client'

import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Calendar as CalendarIcon,
  Globe,
  Search,
  Filter,
  BookOpen,
  Share2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const MONTHS_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
]

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function PublicFestivalsPage() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi')
  const [selectedYear, setSelectedYear] = useState<number>(2026)
  const [selectedMonth, setSelectedMonth] = useState<number>(8) // August
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
      if (data.success && data.festivals && data.festivals.length > 0) {
        setFestivals(data.festivals)
      } else {
        // Fallback sample festivals data if database has not been populated yet
        setFestivals([
          {
            id: 'sample-1',
            date: '2026-08-01T00:00:00.000Z',
            festival: 'Sankashti Chaturthi',
            festivalHi: 'संकष्टी श्री गणेश चतुर्थी व्रत',
            category: 'Vrat',
            categoryHi: 'व्रत व उपवास',
            significance: 'Dedicated to Lord Ganesha for removing obstacles and bringing prosperity.',
            significanceHi: 'भगवान श्री गणेश जी की विशेष पूजा व व्रत। विघ्न-बाधाओं के निवारण एवं सुख-समृद्धि के लिए संकष्टी चतुर्थी का व्रत रखा जाता है।',
          },
          {
            id: 'sample-2',
            date: '2026-08-08T00:00:00.000Z',
            festival: 'Kamada Ekadashi',
            festivalHi: 'कामिका एकादशी व्रत',
            category: 'Ekadashi',
            categoryHi: 'एकादशी व्रत',
            significance: 'Auspicious Ekadashi fast dedicated to Lord Vishnu for fulfillment of noble desires.',
            significanceHi: 'श्रावण/भाद्रपद मास की प्रसिद्ध एकादशी। भगवान श्री हरि विष्णु की पूजा करने से समस्त पापों का नाश होता है।',
          },
          {
            id: 'sample-3',
            date: '2026-08-15T00:00:00.000Z',
            festival: 'Nag Panchami',
            festivalHi: 'नाग पंचमी पर्व',
            category: 'Major Festival',
            categoryHi: 'मुख्य त्योहार',
            significance: 'Traditional festival worshipping Nag Devta for protection and cosmic harmony.',
            significanceHi: 'नाग देवों के पूजन का पावन पर्व। इस दिन नाग देव की पूजा करने से सर्प भय से मुक्ति व कालसर्प दोष में राहत मिलती है।',
          },
        ])
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
      title: 'सनातन त्योहार एवं व्रत कैलेंडर',
      subTitle: 'प्रमुख हिंदू त्योहार, एकादशी, व्रत एवं उनका धार्मिक महत्व',
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
      title: 'Sanatan Festival & Vrat Calendar',
      subTitle: 'Major Hindu Festivals, Ekadashi, Fasting Dates & Significance',
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/30 to-amber-100/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              व्रत एवं पर्व तालिका | Festival Directory
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-amber-950 tracking-tight">{t.title}</h1>
            <p className="text-xs md:text-sm text-amber-800/80 font-medium mt-0.5">{t.subTitle}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
            >
              <Globe className="w-4 h-4" />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>
          </div>
        </div>

        {/* Controls Bar: Month / Year / Category / Search */}
        <div className="bg-white rounded-2xl p-5 shadow-md border border-amber-200/80 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Month & Year Selectors */}
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950 focus:outline-none cursor-pointer"
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
                className="bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-amber-950 focus:outline-none cursor-pointer"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-50 border-amber-200 text-xs rounded-xl"
              />
            </div>
          </div>

          {/* Category Filter Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-xs">
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
                className={`px-3 py-1.5 rounded-full font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Festival Cards List */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-semibold">Loading Festivals...</div>
        ) : festivals.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500 space-y-2 border shadow-sm">
            <Info className="w-8 h-8 text-amber-500 mx-auto" />
            <p className="font-bold text-slate-700">{t.noFestivals}</p>
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
                  className="bg-white rounded-2xl p-6 shadow-md border border-amber-200/80 hover:shadow-xl transition space-y-4 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-900 font-extrabold px-3 py-2 rounded-xl text-center shadow-inner shrink-0">
                        <div className="text-lg leading-none">{dateObj.getDate()}</div>
                        <div className="text-[10px] uppercase tracking-wider mt-0.5">
                          {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-amber-700 font-semibold">{formattedDate}</div>
                        <h3 className="text-lg font-bold text-amber-950 mt-0.5 leading-snug">
                          {getVal(fest, 'festivalHi', 'festival')}
                        </h3>
                      </div>
                    </div>

                    <Badge variant="outline" className="bg-amber-50 text-amber-900 border-amber-300 shrink-0">
                      {getVal(fest, 'categoryHi', 'category')}
                    </Badge>
                  </div>

                  {/* Significance */}
                  {(fest.significanceHi || fest.significance) && (
                    <div className="bg-amber-50/60 rounded-xl p-3.5 border border-amber-100 text-xs text-slate-700 leading-relaxed">
                      <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
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
      </div>
    </div>
  )
}

'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Calendar,
  Clock,
  Sparkles,
  Filter,
  CheckCircle2,
  Share2,
  Building2,
  HeartHandshake,
  Car,
  Baby,
  Home,
  Briefcase,
  Grid,
  List,
  Copy,
  ChevronRight,
  ShieldCheck,
  Star,
} from 'lucide-react'
import {
  SHUBH_MUHURAT_DATA,
  MUHURAT_EVENT_TYPES,
  MUHURAT_YEARS,
  MUHURAT_MONTHS,
  MuhuratItem,
} from '@/lib/shubh-muhurat-data'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

export function ShubhMuhuratFinder() {
  const [search, setSearch] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('All')
  const [selectedYear, setSelectedYear] = useState<string | number>('All')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredMuhurats = useMemo(() => {
    return SHUBH_MUHURAT_DATA.filter((item) => {
      const matchSearch =
        search === '' ||
        item.event.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase()) ||
        item.nakshatra.toLowerCase().includes(search.toLowerCase()) ||
        item.tithi.toLowerCase().includes(search.toLowerCase()) ||
        item.specialNotes.toLowerCase().includes(search.toLowerCase()) ||
        item.month.toLowerCase().includes(search.toLowerCase())

      const matchEvent = selectedEvent === 'All' || item.event === selectedEvent
      const matchYear = selectedYear === 'All' || item.year === Number(selectedYear)
      const matchMonth = selectedMonth === 'All' || item.month === selectedMonth

      return matchSearch && matchEvent && matchYear && matchMonth
    })
  }, [search, selectedEvent, selectedYear, selectedMonth])

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'Vivah Muhurat':
        return <HeartHandshake className="w-5 h-5 text-amber-600 dark:text-amber-400" />
      case 'Griha Pravesh':
        return <Home className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      case 'Vahan Khareedi':
        return <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'Mundan Muhurat':
      case 'Naamkaran Muhurat':
        return <Baby className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      case 'Property Khareedi':
        return <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      default:
        return <Sparkles className="w-5 h-5 text-amber-500" />
    }
  }

  const getEventBadgeColor = (event: string) => {
    switch (event) {
      case 'Vivah Muhurat':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
      case 'Griha Pravesh':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
      case 'Vahan Khareedi':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
      case 'Mundan Muhurat':
      case 'Naamkaran Muhurat':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
      case 'Property Khareedi':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  const handleCopyDetails = (item: MuhuratItem) => {
    const text = `🕉️ ${item.event} (${item.date})\n📅 War: ${item.day}\n⏰ Timing: ${item.timing}\n✨ Nakshatra: ${item.nakshatra}\n🌙 Tithi: ${item.tithi}\n🚩 Special: ${item.specialNotes}\n- Divyayagyam Panchang`
    navigator.clipboard.writeText(text)
    toast.success('शुभ मुहूर्त विवरण कॉपी हो गया!')
  }

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/60 via-orange-50/40 to-white dark:from-slate-950 dark:via-amber-950/20 dark:to-slate-950 rounded-3xl border border-amber-200/60 dark:border-amber-900/40 shadow-xl my-10">
      <div className="max-w-7xl mx-mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/15 to-red-500/10 border border-amber-300/40 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>शुभ मुहूर्त खोजक एवं शोधकर्ता (2026 - 2030)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-amber-50 tracking-tight font-serif">
            सर्वश्रेष्ठ शुभ मुहूर्त खोजें (Shubh Muhurat Finder)
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            विवाह, गृह प्रवेश, वाहन खरीदी, मुंडन एवं नामकरण हेतु 2026 से 2030 तक के प्रमाणित शुभ मुहूर्त, सटीक समय, नक्षत्र एवं तिथि सहित खोजें।
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-amber-200/80 dark:border-amber-900/50 shadow-md mb-8 space-y-5">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 dark:text-amber-400" />
            <input
              type="text"
              placeholder="Search by event, nakshatra, tithi, yoga (e.g. Vivah, Rohini, Sarvartha Siddhi)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Event Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mr-1" />
            {MUHURAT_EVENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedEvent(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedEvent === type
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20 dark:bg-amber-500 dark:border-amber-500'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700'
                }`}
              >
                {type === 'All' ? 'सभी मुहूर्त (All)' : type}
              </button>
            ))}
          </div>

          {/* Dropdown Filters & View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-amber-100 dark:border-amber-900/30">
            <div className="flex flex-wrap items-center gap-3">
              {/* Year Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Year:
                </span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {MUHURAT_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr === 'All' ? 'All Years (2026-2030)' : yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Month:
                </span>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {MUHURAT_MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m === 'All' ? 'All Months' : m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count & View Switch */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                कुल मुहूर्त: <strong className="text-amber-600 dark:text-amber-400">{filteredMuhurats.length}</strong>
              </span>

              <div className="inline-flex rounded-lg border border-amber-200 dark:border-amber-800 p-0.5 bg-amber-50/50 dark:bg-slate-950">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                  }`}
                  title="Grid Cards View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewMode === 'table'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {filteredMuhurats.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-amber-300 dark:border-amber-800 p-8 space-y-3">
            <Sparkles className="w-10 h-10 text-amber-500 mx-auto opacity-60" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              कोई मुहूर्त नहीं मिला (No Muhurat Found)
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              कृपया सर्च फ़िल्टर बदलें या किसी अन्य वर्ष/महीने का चयन करें।
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('')
                setSelectedEvent('All')
                setSelectedYear('All')
                setSelectedMonth('All')
              }}
              className="mt-2 text-xs border-amber-500 text-amber-700 dark:text-amber-300"
            >
              Reset Filters
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMuhurats.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-amber-200/80 dark:border-amber-900/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Top Badge & Date */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getEventBadgeColor(
                        item.event
                      )}`}
                    >
                      {getEventIcon(item.event)}
                      <span>{item.event}</span>
                    </span>

                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-200/50 dark:border-amber-900/40">
                      {item.year}
                    </span>
                  </div>

                  {/* Main Date Display */}
                  <div className="mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-xl font-bold text-slate-900 dark:text-amber-50 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                    <div className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-1 pl-7">
                      {item.day} ({item.month})
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 mb-5">
                    <div className="flex items-center gap-2 bg-amber-50/50 dark:bg-slate-950/40 p-2 rounded-lg border border-amber-100/60 dark:border-amber-900/20">
                      <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        समय: {item.timing}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                          नक्षत्र
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.nakshatra}
                        </span>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                        <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                          तिथि
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.tithi}
                        </span>
                      </div>
                    </div>

                    {item.specialNotes && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300 pt-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                        <span className="font-medium">{item.specialNotes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
                  <button
                    onClick={() => handleCopyDetails(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800 text-xs font-semibold text-amber-900 dark:text-amber-300 hover:bg-amber-100 transition-colors"
                    title="Copy details"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <thead className="bg-amber-100/70 dark:bg-slate-800/80 text-amber-950 dark:text-amber-200 font-bold uppercase text-[11px] tracking-wider border-b border-amber-200 dark:border-amber-800">
                  <tr>
                    <th className="py-3.5 px-4">वर्ष & महीना</th>
                    <th className="py-3.5 px-4">मुहूर्त प्रकार</th>
                    <th className="py-3.5 px-4">दिनांक & वार</th>
                    <th className="py-3.5 px-4">शुभ समय (Timing)</th>
                    <th className="py-3.5 px-4">नक्षत्र</th>
                    <th className="py-3.5 px-4">तिथि</th>
                    <th className="py-3.5 px-4">विशेष योग / टिप्पणी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMuhurats.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 dark:hover:bg-slate-850/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {item.year}, {item.month}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getEventBadgeColor(
                            item.event
                          )}`}
                        >
                          {item.event}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-bold text-slate-900 dark:text-amber-50">
                        {item.date} ({item.day})
                      </td>
                      <td className="py-3 px-4 font-medium text-amber-700 dark:text-amber-300 whitespace-nowrap">
                        {item.timing}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {item.nakshatra}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {item.tithi}
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-amber-800 dark:text-amber-300 whitespace-nowrap">
                        {item.specialNotes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Note & Consultation Callout */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold flex items-center gap-2 justify-center sm:justify-start">
              <ShieldCheck className="w-5 h-5 text-amber-200" />
              <span>क्या आप अपने नाम एवं जन्म पत्रिका के अनुसार व्यक्तिगत मुहूर्त चाहते हैं?</span>
            </h4>
            <p className="text-amber-100 text-xs sm:text-sm">
              हमारे आचार्य जी से व्यक्तिगत नक्षत्र, लग्न एवं कुण्डली मिलान हेतु सम्पर्क करें।
            </p>
          </div>

          <Link
            href="/ask-a-pandit"
            className="px-5 py-2.5 rounded-xl bg-white text-amber-900 font-bold text-xs sm:text-sm shadow-md hover:bg-amber-50 transition-all shrink-0"
          >
            आचार्य जी से बात करें
          </Link>
        </div>
      </div>
    </section>
  )
}

'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Calendar,
  Clock,
  Sparkles,
  Filter,
  Building2,
  HeartHandshake,
  Car,
  Baby,
  Home,
  Grid,
  List,
  Copy,
  ShieldCheck,
  Star,
  Check,
  ArrowRight
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
  const [copiedId, setCopiedId] = useState<string | null>(null)

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
        return <HeartHandshake className="w-4 h-4 text-[#fbbf24]" />
      case 'Griha Pravesh':
        return <Home className="w-4 h-4 text-emerald-400" />
      case 'Vahan Khareedi':
        return <Car className="w-4 h-4 text-blue-400" />
      case 'Mundan Muhurat':
      case 'Naamkaran Muhurat':
        return <Baby className="w-4 h-4 text-purple-400" />
      case 'Property Khareedi':
        return <Building2 className="w-4 h-4 text-indigo-400" />
      default:
        return <Sparkles className="w-4 h-4 text-[#fbbf24]" />
    }
  }

  const handleCopyDetails = (item: MuhuratItem) => {
    const text = `🕉️ ${item.event} (${item.date})\n📅 War: ${item.day}\n⏰ Timing: ${item.timing}\n✨ Nakshatra: ${item.nakshatra}\n🌙 Tithi: ${item.tithi}\n🚩 Special: ${item.specialNotes}\n- DivyaYagyam Panchang`
    navigator.clipboard.writeText(text)
    setCopiedId(item.id)
    toast.success('शुभ मुहूर्त विवरण कॉपी हो गया!')
    setTimeout(() => setCopiedId(null), 3000)
  }

  return (
    <section className="w-full space-y-6">
      
      {/* ── 2. FILTER BAR & SEARCH BOX CONTAINER */}
      <div className="bg-[#141b26] border border-[#d4af37]/25 rounded-2xl p-5 md:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.4)] space-y-5">
        
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#fbbf24]" />
          <input
            type="text"
            placeholder="खोजें (e.g. Vivah, Rohini, Sarvartha Siddhi, 2026)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#d4af37]/30 bg-[#1f293d] text-white placeholder:text-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#fbbf24] transition-all shadow-inner"
          />
        </div>

        {/* Event Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-[#fbbf24] shrink-0 mr-1" />
          {MUHURAT_EVENT_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedEvent(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedEvent === type
                  ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white border-transparent shadow-md'
                  : 'bg-[#1f293d] text-[#d1d5db] border-[#d4af37]/20 hover:border-[#d4af37]/50 hover:text-white'
              }`}
            >
              {type === 'All' ? '🌟 सभी मुहूर्त (All)' : type}
            </button>
          ))}
        </div>

        {/* Dropdown Filters & View Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#d4af37]/20 text-xs font-semibold">
          <div className="flex flex-wrap items-center gap-3">
            {/* Year Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[#9ca3af] uppercase tracking-wider text-[11px]">Year:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-[#1f293d] border border-[#d4af37]/30 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              >
                {MUHURAT_YEARS.map((yr) => (
                  <option key={yr} value={yr} className="bg-[#141b26] text-white">
                    {yr === 'All' ? 'All Years (2026-2030)' : yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[#9ca3af] uppercase tracking-wider text-[11px]">Month:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-[#1f293d] border border-[#d4af37]/30 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              >
                {MUHURAT_MONTHS.map((m) => (
                  <option key={m} value={m} className="bg-[#141b26] text-white">
                    {m === 'All' ? 'All Months' : m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count & View Switch */}
          <div className="flex items-center gap-4">
            <span className="text-[#9ca3af]">
              कुल मुहूर्त: <strong className="text-[#fbbf24]">{filteredMuhurats.length}</strong>
            </span>

            <div className="inline-flex rounded-lg border border-[#d4af37]/30 p-0.5 bg-[#1f293d]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#f59e0b] text-white shadow-xs'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#f59e0b] text-white shadow-xs'
                    : 'text-[#9ca3af] hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. MUHURAT CARDS GRID / TABLE LAYOUT */}
      {filteredMuhurats.length === 0 ? (
        <div className="text-center py-16 bg-[#141b26] rounded-2xl border border-dashed border-[#d4af37]/30 p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-[#fbbf24] mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-white">
            कोई मुहूर्त नहीं मिला (No Muhurat Found)
          </h3>
          <p className="text-xs text-[#9ca3af]">
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
            className="mt-2 text-xs border-[#d4af37]/50 text-[#fbbf24] bg-[#1f293d] hover:bg-[#141b26]"
          >
            Reset Filters
          </Button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ── 4. INDIVIDUAL MUHURAT CARDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {filteredMuhurats.map((item) => (
            <article
              key={item.id}
              className="group relative bg-gradient-to-b from-[#141b26] to-[#101620] border border-[#d4af37]/25 hover:border-[#d4af37] rounded-2xl p-6 shadow-[0_6px_18px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_30px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                {/* 5. Header Badge & Year Tag */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#d4af37]/15 text-[#f6d860] border border-[#d4af37]/30 px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
                    {getEventIcon(item.event)}
                    <span>{item.event}</span>
                  </span>

                  <span className="text-xs font-bold text-[#fbbf24] bg-[#1f293d] px-2.5 py-1 rounded-lg border border-[#d4af37]/30">
                    {item.year}
                  </span>
                </div>

                {/* Date Display */}
                <div className="mb-3 pb-3 border-b border-[#d4af37]/15">
                  <h3 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#fbbf24] shrink-0" />
                    <span>{item.date}</span>
                  </h3>
                  <p className="text-xs font-semibold text-[#f6d860] mt-1 pl-7">
                    {item.day} ({item.month})
                  </p>
                </div>

                {/* 6. Details Box (Golden Left Border) */}
                <div className="bg-[#1a2230] rounded-xl p-3.5 my-3 border-l-3 border-[#d4af37] space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Clock className="w-4 h-4 text-[#fbbf24] shrink-0" />
                    <span>शुभ समय: <strong>{item.timing}</strong></span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 text-[#d1d5db] text-xs">
                    <div>
                      <span className="text-[#9ca3af] uppercase text-[10px] block">नक्षत्र</span>
                      <span className="font-semibold text-white">{item.nakshatra}</span>
                    </div>
                    <div>
                      <span className="text-[#9ca3af] uppercase text-[10px] block">तिथि</span>
                      <span className="font-semibold text-white">{item.tithi}</span>
                    </div>
                  </div>

                  {item.specialNotes && (
                    <div className="flex items-center gap-1.5 text-xs text-[#f6d860] pt-1 border-t border-[#d4af37]/15">
                      <Star className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24] shrink-0" />
                      <span className="font-semibold">{item.specialNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 7. Action Button Container (Fixed at Bottom) */}
              <div className="pt-4 border-t border-[#d4af37]/15 mt-auto w-full">
                <button
                  onClick={() => handleCopyDetails(item)}
                  className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>विवरण कॉपी हो गया!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Muhurat Details</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Table View (Dark Theme) */
        <div className="bg-[#141b26] rounded-2xl border border-[#d4af37]/25 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-[#d1d5db]">
              <thead className="bg-[#1f293d] text-[#fbbf24] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#d4af37]/30">
                <tr>
                  <th className="py-3.5 px-4">वर्ष & महीना</th>
                  <th className="py-3.5 px-4">मुहूर्त प्रकार</th>
                  <th className="py-3.5 px-4">दिनांक & वार</th>
                  <th className="py-3.5 px-4">शुभ समय (Timing)</th>
                  <th className="py-3.5 px-4">नक्षत्र</th>
                  <th className="py-3.5 px-4">तिथि</th>
                  <th className="py-3.5 px-4">विशेष योग / टिप्पणी</th>
                  <th className="py-3.5 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4af37]/15">
                {filteredMuhurats.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#1f293d]/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      {item.year}, {item.month}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-[#d4af37]/15 text-[#f6d860] border border-[#d4af37]/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        {item.event}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-white">
                      {item.date} ({item.day})
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#fbbf24] whitespace-nowrap">
                      {item.timing}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                      {item.nakshatra}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white whitespace-nowrap">
                      {item.tithi}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[#f6d860] whitespace-nowrap">
                      {item.specialNotes}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleCopyDetails(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#1f293d] border border-[#d4af37]/30 text-xs font-bold text-[#fbbf24] hover:bg-[#d4af37]/20 transition-all inline-flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 8. ACHARYA CONSULTATION BANNER */}
      <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#141b26] via-[#1f293d] to-[#141b26] border border-[#d4af37]/40 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center sm:text-left">
          <h4 className="text-lg font-heading font-extrabold text-white flex items-center gap-2 justify-center sm:justify-start">
            <ShieldCheck className="w-5 h-5 text-[#fbbf24]" />
            <span>क्या आप अपने नाम एवं जन्म पत्रिका के अनुसार व्यक्तिगत मुहूर्त चाहते हैं?</span>
          </h4>
          <p className="text-[#d1d5db] text-xs sm:text-sm font-medium">
            हमारे सिद्ध आचार्यों से व्यक्तिगत नक्षत्र, लग्न एवं कुण्डली मिलान हेतु सीधे परामर्श करें।
          </p>
        </div>

        <Link
          href="/ask-a-pandit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-110 transition-all shrink-0 inline-flex items-center gap-1.5"
        >
          <span>आचार्य जी से परामर्श करें</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search, ShieldCheck, CheckCircle2, Clock, Truck, FileText,
  MessageCircle, Phone, Sparkles, AlertCircle, ArrowRight, RefreshCw,
  Calendar, MapPin, User, ChevronRight, Package
} from 'lucide-react'

interface TrackItem {
  type: 'PUJA_BOOKING' | 'PRODUCT_ORDER'
  id: string
  number: string
  title: string
  temple?: string
  location?: string
  slug?: string
  image: string
  date: string
  scheduledAt?: string
  status: string
  paymentStatus: string
  total: number
  gotra?: string
  sankalpText?: string
  members?: Array<{ name: string; gotra?: string }>
  panditName?: string
  step: number
  pdfUrl?: string | null
  invoiceNumber?: string | null
  shippingProvider?: string | null
  trackingNumber?: string | null
  trackingUrl?: string | null
}

const PUJA_STEPS = [
  { step: 1, title: 'संकल्प दर्ज', desc: 'बुकिंग व नाम-गोत्र स्वीकार' },
  { step: 2, title: 'आचार्य व मुहूर्त', desc: 'पंडित जी व समय निर्धारित' },
  { step: 3, title: 'हवन व पूजा संपन्न', desc: 'शास्त्रसम्मत आहुति व जाप' },
  { step: 4, title: 'वीडियो व पावन प्रसाद', desc: 'WhatsApp दर्शन व प्रेषण' },
]

const ORDER_STEPS = [
  { step: 1, title: 'ऑर्डर दर्ज', desc: 'भुगतान सत्यापित' },
  { step: 2, title: 'पवित्रीकरण व पैकिंग', desc: 'वैदिक शुद्धता के साथ तैयार' },
  { step: 3, title: 'कूरियर रवाना', desc: 'डिस्पैच व ट्रैकिंग सक्रिय' },
  { step: 4, title: 'सफलतापूर्वक प्राप्त', desc: 'पावन प्रसाद घर पहुँचा' },
]

export default function TrackBookingPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{ bookings: TrackItem[]; orders: TrackItem[] } | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'bookings' | 'orders'>('all')

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const cleanQuery = query.trim()
    if (!cleanQuery || cleanQuery.length < 4) {
      setError('कृपया कम से कम 4 अक्षर या 10 अंकों का मोबाइल नंबर दर्ज करें।')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cleanQuery })
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.message || 'कोई विवरण नहीं मिला। कृपया अपना बुकिंग/ऑर्डर नंबर या मोबाइल नंबर जांचें।')
      } else {
        setResults(data.data)
      }
    } catch (err) {
      setError('सर्वर से संपर्क करने में समस्या आई। कृपया कुछ क्षण बाद पुनः प्रयास करें।')
    } finally {
      setLoading(false)
    }
  }

  const allItems: TrackItem[] = [
    ...(results?.bookings || []),
    ...(results?.orders || [])
  ]

  const displayedItems = activeTab === 'all'
    ? allItems
    : activeTab === 'bookings'
      ? (results?.bookings || [])
      : (results?.orders || [])

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1A1412] font-sans pb-20">
      
      {/* 1. HERO HEADER */}
      <section className="relative bg-[#0F1115] text-white py-14 md:py-20 px-4 overflow-hidden border-b border-amber-900/40">
        <div aria-hidden="true" className="absolute right-[-5%] top-[-10%] text-[30vw] font-serif text-[#D4AF37]/5 leading-none pointer-events-none select-none">
          ॐ
        </div>
        <div className="absolute inset-0 bg-radial-gradient from-amber-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>लाइव संकल्प व ऑर्डर ट्रैकिंग</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading text-white tracking-tight">
            अपनी <span className="bg-gradient-to-r from-[#FF8C21] via-[#FFD2B0] to-[#D4AF37] bg-clip-text text-transparent">पूजा व प्रसाद</span> की स्थिति जानें
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            अपना <strong>बुकिंग नंबर (Booking ID)</strong>, <strong>ऑर्डर नंबर</strong> या पंजीकृत <strong>मोबाइल नंबर</strong> दर्ज करके संकल्प, पंडित जी की नियुक्ति और प्रसाद प्रेषण की लाइव स्थिति देखें।
          </p>

          {/* SEARCH FORM */}
          <form onSubmit={handleSearch} className="pt-6 max-w-2xl mx-auto">
            <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-amber-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="उदा. BK-1204, ORD-5421 या 9530401984..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl text-zinc-900 placeholder-zinc-400 text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-gradient-to-r from-[#FF6A00] to-[#D4AF37] hover:from-[#E65C00] hover:to-[#B38F25] text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 cursor-pointer whitespace-nowrap text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>खोज रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <span>ट्रैक करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs text-zinc-400">
              <span>💡 सुझाव:</span>
              <button
                type="button"
                onClick={() => { setQuery('9530401984'); }}
                className="hover:text-amber-300 underline underline-offset-2 transition-colors"
              >
                मोबाइल नंबर से खोजें
              </button>
              <span>•</span>
              <span>100% सुरक्षित व गोपनीय डेटा</span>
            </div>
          </form>
        </div>
      </section>

      {/* 2. RESULTS CONTAINER */}
      <main className="container mx-auto max-w-4xl px-4 py-10">

        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-sm mb-8 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-sm sm:text-base">{error}</p>
              <p className="text-xs text-amber-800">
                यदि आपको बुकिंग नंबर नहीं मिला है, तो कृपया अपने WhatsApp या SMS संदेश देखें, या नीचे दिए गए सहायता नंबर पर तुरंत संपर्क करें।
              </p>
            </div>
          </div>
        )}

        {/* RESULTS FOUND */}
        {results && allItems.length > 0 && (
          <div className="space-y-8 animate-fadeIn">

            {/* TABS (If both bookings and orders exist) */}
            {(results.bookings.length > 0 && results.orders.length > 0) && (
              <div className="flex items-center justify-center gap-2 border-b border-zinc-200 pb-3">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#7A1521] text-white shadow-sm'
                      : 'bg-white text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  सभी ({allItems.length})
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'bookings'
                      ? 'bg-[#7A1521] text-white shadow-sm'
                      : 'bg-white text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  पूजा बुकिंग ({results.bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'orders'
                      ? 'bg-[#7A1521] text-white shadow-sm'
                      : 'bg-white text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  प्रसाद व सामग्री ({results.orders.length})
                </button>
              </div>
            )}

            {/* LIST OF ITEMS */}
            <div className="space-y-6">
              {displayedItems.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-3xl border border-[#EFE4D6] shadow-xl overflow-hidden transition-all hover:border-amber-300"
                >
                  {/* Top Bar */}
                  <div className="bg-[#FAF4EC] px-5 sm:px-7 py-4 border-b border-[#EFE4D6] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#7A1521]">
                        {item.type === 'PUJA_BOOKING' ? 'दिव्य पूजा व अनुष्ठान' : 'प्रसाद व आध्यात्मिक सामग्री'}
                      </span>
                      <span className="text-zinc-300">|</span>
                      <span className="text-xs font-mono font-bold text-zinc-700">
                        #{item.number}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-zinc-500">तारीख:</span>
                      <span className="font-bold text-zinc-800">
                        {new Date(item.date).toLocaleDateString('hi-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-7 space-y-6">
                    
                    {/* Item Title & Details */}
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <h2 className="text-lg sm:text-xl font-black text-[#1C1614] font-heading">
                          {item.title}
                        </h2>

                        {item.type === 'PUJA_BOOKING' && (
                          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                            {item.temple && (
                              <span className="inline-flex items-center gap-1 font-semibold text-[#7A1521]">
                                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                                {item.temple} ({item.location})
                              </span>
                            )}
                            {item.panditName && (
                              <span className="inline-flex items-center gap-1 font-medium text-zinc-600">
                                <User className="w-3.5 h-3.5 text-zinc-500" />
                                आचार्य: {item.panditName}
                              </span>
                            )}
                          </div>
                        )}

                        {item.gotra && (
                          <p className="text-xs font-semibold text-zinc-500 pt-1">
                            संकल्प गोत्र: <span className="text-zinc-900 font-bold">{item.gotra}</span>
                          </p>
                        )}
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-xs text-zinc-500 uppercase font-bold block">कुल दक्षिणा / शुल्क</span>
                        <span className="text-xl sm:text-2xl font-black text-[#FF6600] font-heading">
                          ₹{item.total.toLocaleString('en-IN')}
                        </span>
                        <span className="block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-0.5">
                          {item.paymentStatus === 'PAID' ? '✓ भुगतान सफल' : item.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* VISUAL 4-STEP TIMELINE */}
                    <div className="pt-4 pb-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>लाइव प्रगति (Current Progress):</span>
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
                        {(item.type === 'PUJA_BOOKING' ? PUJA_STEPS : ORDER_STEPS).map((s) => {
                          const isDone = item.step >= s.step
                          const isCurrent = item.step === s.step

                          return (
                            <div
                              key={s.step}
                              className={`p-3.5 rounded-2xl border transition-all relative ${
                                isCurrent
                                  ? 'bg-[#FFF8EE] border-[#FF8C21] ring-2 ring-[#FF8C21]/20 shadow-md'
                                  : isDone
                                    ? 'bg-emerald-50/60 border-emerald-200'
                                    : 'bg-zinc-50 border-zinc-200 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-zinc-300 text-zinc-700'
                                }`}>
                                  चरण {s.step}
                                </span>
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-zinc-400" />
                                )}
                              </div>

                              <p className={`text-xs font-bold ${
                                isCurrent ? 'text-[#7A1521]' : isDone ? 'text-zinc-900' : 'text-zinc-500'
                              }`}>
                                {s.title}
                              </p>
                              <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                                {s.desc}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Devotee Family Members (if Puja) */}
                    {item.members && item.members.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                        <p className="font-bold text-[#7A1521] mb-1">संकल्प में शामिल श्रद्धालु:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.members.map((m, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white rounded-md border border-amber-200 font-medium text-zinc-800">
                              {m.name} {m.gotra ? `(${m.gotra})` : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tracking details for Product / Prasad Courier */}
                    {item.trackingNumber && (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="font-bold text-emerald-900">
                              कूरियर पार्टनर: {item.shippingProvider || 'Speed Post / Bluedart'}
                            </p>
                            <p className="text-[11px] text-emerald-700 font-mono">
                              ट्रैकिंग नंबर: {item.trackingNumber}
                            </p>
                          </div>
                        </div>

                        {item.trackingUrl && (
                          <a
                            href={item.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                          >
                            <span>कूरियर ट्रैक करें</span>
                            <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Bottom Action Buttons */}
                    <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {item.pdfUrl ? (
                          <a
                            href={item.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-800 text-xs font-bold shadow-sm transition-all"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-600" />
                            <span>संकल्प पत्र / रसीद डाउनलोड</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-zinc-400 italic">
                            * संकल्प संपन्न होने के बाद रसीद व प्रमाण यहाँ उपलब्ध होगा।
                          </span>
                        )}
                      </div>

                      {/* WhatsApp Help for this exact order */}
                      <a
                        href={`https://wa.me/919530401984?text=${encodeURIComponent(
                          `जय श्री राम! मुझे मेरी बुकिंग #${item.number} (${item.title}) की स्थिति के बारे में जानकारी चाहिए।`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp पर सहायता लें</span>
                      </a>
                    </div>

                  </div>
                </article>
              ))}
            </div>

          </div>
        )}

        {/* 3. TRUST & FAQ HELPER SECTION */}
        <div className="mt-16 pt-10 border-t border-zinc-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="p-5 rounded-2xl bg-white border border-[#EFE4D6] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg mx-auto md:mx-0">
              📹
            </div>
            <h4 className="font-bold text-sm text-[#1C1614]">पूजा का वीडियो कैसे मिलेगा?</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              आपके नाम-गोत्र के साथ आहुति व संकल्प का वीडियो पूजा संपन्न होने के 24 से 48 घंटे के भीतर आपके WhatsApp पर भेजा जाता है।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EFE4D6] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg mx-auto md:mx-0">
              📦
            </div>
            <h4 className="font-bold text-sm text-[#1C1614]">पावन प्रसाद घर कब पहुँचेगा?</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              यज्ञ की पावन भस्म, रक्षासूत्र और सिद्ध प्रसाद 4 से 7 कार्यदिवसों के भीतर स्पीड पोस्ट या प्रीमियम कूरियर द्वारा आपके पते पर पहुँचता है।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EFE4D6] space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-lg mx-auto md:mx-0">
              📞
            </div>
            <h4 className="font-bold text-sm text-[#1C1614]">कोई सहायता चाहिए?</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              आप कभी भी हमारे पंडित सेवा केंद्र <strong>+91-95304-01984</strong> पर सीधे कॉल या WhatsApp कर सकते हैं।
            </p>
          </div>
        </div>

      </main>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles, Star, ShieldCheck, ArrowRight, Clock,
  FileText, Check, MessageCircle, HelpCircle, Lock,
  ArrowUp, Compass
} from 'lucide-react'
import { ALL_ASTRO_REPORTS } from '@/lib/astro-data'

const CATEGORIES = ['All', 'Life', 'Career', 'Marriage', 'Finance', 'Health']

export default function HoroscopeListingPage() {
  const [activeTab, setActiveTab] = useState<string>('All')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const filteredReports = activeTab === 'All'
    ? ALL_ASTRO_REPORTS
    : ALL_ASTRO_REPORTS.filter(r => r.categories.includes(activeTab))

  return (
    <div className="bg-[#F8F4EC] text-[#171513] min-h-screen notranslate selection:bg-[#B85C24]/20" translate="no">

      {/* ── 1. EDITORIAL HERO ── */}
      <section className="relative bg-gradient-to-b from-white via-[#F8F4EC] to-[#F8F4EC] py-14 sm:py-20 border-b border-[#E8E1D5] overflow-hidden">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[26vw] font-serif text-[#B08A45]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-[#B85C24] text-xs font-black tracking-wide shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-[#B85C24]" />
            <span>DIVYAYAGYAM VEDIC HOROSCOPE REPORTS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#171513] leading-tight tracking-tight">
            Authentic Vedic Horoscopes & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#B85C24] via-[#D97706] to-[#B08A45] bg-clip-text text-transparent">
              Birth Chart Reports
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#6E665D] max-w-2xl mx-auto font-medium leading-relaxed">
            Computed to the exact minute using classical Brihat Parashara texts, verified by senior Vedic astrologers, and delivered directly to your WhatsApp in minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-[#171513]">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E8E1D5] shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Confidential
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E8E1D5] shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#B85C24]" /> Verified by Senior Astrologers
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E8E1D5] shadow-2xs">
              <Clock className="h-3.5 w-3.5 text-[#B08A45]" /> Delivered on WhatsApp in Minutes
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. STICKY CATEGORY FILTER BAR ── */}
      <section id="reports-top" className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8E1D5] py-3.5 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#151311] text-[#F8F4EC] shadow-xs'
                      : 'bg-transparent text-[#6E665D] hover:text-[#171513] hover:bg-[#EFE7D8]'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-black text-[#6E665D] shrink-0 border-l border-[#E8E1D5] pl-4">
            <span>All Reports</span>
            <span className="w-5 h-5 rounded-full bg-[#151311] text-[#F8F4EC] text-[11px] flex items-center justify-center font-mono">
              {filteredReports.length}
            </span>
          </div>

        </div>
      </section>

      {/* ── 3. HOROSCOPE REPORTS 2-COLUMN LUXURY GRID ── */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredReports.map((report) => (
            <article
              key={report.id}
              className="bg-white rounded-2xl border border-[#E8E1D5] hover:border-[#B08A45] shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Artwork Top Header with Price & Badge */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5]/60 mb-5">
                  <div className="flex items-center gap-3">
                    {/* Simulated elegant report artwork thumbnail */}
                    <div
                      className="w-10 h-14 rounded-md shadow-xs border border-white/40 flex items-center justify-center text-white text-[10px] font-black shrink-0 relative overflow-hidden"
                      style={{ background: report.coverArtwork }}
                    >
                      <span className="text-white/80 font-serif">ॐ</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#6E665D] font-bold uppercase tracking-wider block">
                        {report.title} — report artwork
                      </span>
                      <span className="text-xl font-black text-[#171513]">
                        ₹{report.price}
                      </span>
                    </div>
                  </div>

                  {report.badge && (
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border tracking-wide uppercase ${report.badgeColor}`}>
                      {report.badge}
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <Link href={`/horoscope/${report.slug}`} className="block">
                  <h3 className="text-xl font-extrabold text-[#171513] mb-2 group-hover:text-[#B85C24] transition-colors leading-snug">
                    {report.title}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-[#6E665D] font-medium leading-relaxed mb-6">
                  {report.description}
                </p>
              </div>

              {/* Card Footer: Page Count & View Button */}
              <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#6E665D] font-bold">
                  <span className="text-base text-[#B08A45]">▤</span>
                  <span>{report.pages} pages</span>
                </div>

                <Link
                  href={`/horoscope/${report.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#171513] group-hover:text-[#B85C24] hover:underline transition-colors cursor-pointer"
                >
                  <span>View</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ── */}
      <section className="bg-white border-y border-[#E8E1D5] py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#B85C24]">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="space-y-3 relative text-left">
              <div className="w-10 h-10 rounded-xl bg-[#F8F4EC] border border-[#E8E1D5] flex items-center justify-center font-mono font-black text-base text-[#B85C24]">
                1
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#171513]">
                Enter your birth details
              </h3>
              <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
                Date, exact time, place — and the WhatsApp number your report should go to. No questionnaire.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 relative text-left">
              <div className="w-10 h-10 rounded-xl bg-[#F8F4EC] border border-[#E8E1D5] flex items-center justify-center font-mono font-black text-base text-[#B85C24]">
                2
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#171513]">
                Your chart is computed
              </h3>
              <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
                Sidereal calculation to the minute, then read against classical rules and checked before it is sent.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 relative text-left">
              <div className="w-10 h-10 rounded-xl bg-[#F8F4EC] border border-[#E8E1D5] flex items-center justify-center font-mono font-black text-base text-[#B85C24]">
                3
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#171513]">
                It arrives on WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
                A complete PDF on WhatsApp within minutes — and by email too if you add an address. Yours to keep.
              </p>
            </div>

          </div>

          {/* 4-Item Quick Stats Strip */}
          <div className="mt-14 pt-10 border-t border-[#E8E1D5] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#171513]">5 Lakh+</div>
              <div className="text-xs text-[#6E665D] font-bold mt-1">Devotees served</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#171513]">Minutes</div>
              <div className="text-xs text-[#6E665D] font-bold mt-1">Delivery time</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#171513]">2</div>
              <div className="text-xs text-[#6E665D] font-bold mt-1">Languages (English / Hindi)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#171513]">100%</div>
              <div className="text-xs text-[#6E665D] font-bold mt-1">Secure payment</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── 5. WHY DIVYAYAGYAM ── */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-16 sm:py-20">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-[#B85C24]">
            WHY DIVYAYAGYAM
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
            A different kind of spiritual practice.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-2xs">
            <span className="text-[#B08A45] text-lg font-bold">✦</span>
            <h3 className="text-base font-extrabold text-[#171513]">Authentic Vedic</h3>
            <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
              Calculations rooted in classical Brihat Parashara texts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-2xs">
            <span className="text-[#B08A45] text-lg font-bold">✦</span>
            <h3 className="text-base font-extrabold text-[#171513]">Personalized</h3>
            <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
              Built precisely from your birth date, time and place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-2xs">
            <span className="text-[#B08A45] text-lg font-bold">✦</span>
            <h3 className="text-base font-extrabold text-[#171513]">Easy to understand</h3>
            <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
              Translated from Sanskrit into clear, practical English.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E1D5] space-y-2 shadow-2xs">
            <span className="text-[#B08A45] text-lg font-bold">✦</span>
            <h3 className="text-base font-extrabold text-[#171513]">Practical remedies</h3>
            <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
              Daily practices that fit into a modern routine.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. DEVOTEES REVIEW ── */}
      <section className="bg-white border-y border-[#E8E1D5] py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              Devotees Review
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#F8F4EC] rounded-2xl border border-[#E8E1D5] space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-amber-500 text-sm font-bold mb-2">★★★★★</div>
                <p className="text-xs sm:text-sm text-[#171513] italic leading-relaxed">
                  "My Dosha Report was incredibly detailed and the remedies were easy to follow."
                </p>
              </div>
              <span className="text-xs font-bold text-[#6E665D] block pt-3 border-t border-[#E8E1D5]">
                — Ananya Sharma, Delhi
              </span>
            </div>

            <div className="p-6 bg-[#F8F4EC] rounded-2xl border border-[#E8E1D5] space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-amber-500 text-sm font-bold mb-2">★★★★★</div>
                <p className="text-xs sm:text-sm text-[#171513] italic leading-relaxed">
                  "Honest, calm, and unbelievably accurate. The yearly forecast helped me time a career switch."
                </p>
              </div>
              <span className="text-xs font-bold text-[#6E665D] block pt-3 border-t border-[#E8E1D5]">
                — Rohan Mehta, Mumbai
              </span>
            </div>

            <div className="p-6 bg-[#F8F4EC] rounded-2xl border border-[#E8E1D5] space-y-3 flex flex-col justify-between">
              <div>
                <div className="text-amber-500 text-sm font-bold mb-2">★★★★★</div>
                <p className="text-xs sm:text-sm text-[#171513] italic leading-relaxed">
                  "Clear, personal and rooted in real astrology — not vague guesses."
                </p>
              </div>
              <span className="text-xs font-bold text-[#6E665D] block pt-3 border-t border-[#E8E1D5]">
                — Priya Nair, Kochi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. WHY NOT JUST USE A FREE APP? ── */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
            Why Not Just Use A Free App?
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8E1D5] shadow-xs overflow-hidden">
          <div className="grid grid-cols-12 bg-[#F8F4EC] py-3.5 px-4 sm:px-6 border-b border-[#E8E1D5] text-xs font-black text-[#171513]">
            <div className="col-span-6 sm:col-span-8">What you get</div>
            <div className="col-span-3 sm:col-span-2 text-center text-[#B85C24]">DivyaYagyam</div>
            <div className="col-span-3 sm:col-span-2 text-center text-[#6E665D]">Free apps</div>
          </div>

          {[
            'Birth time used to the minute',
            'Sidereal (Vedic) calculation',
            'Divisional charts read individually',
            'Every dosh checked — and its cancellation',
            'Remedies matched to your chart',
            'Full sample readable before you pay'
          ].map((item, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 py-3.5 px-4 sm:px-6 text-xs font-semibold ${
                idx % 2 === 1 ? 'bg-[#F8F4EC]/40' : 'bg-white'
              } border-b border-[#E8E1D5] last:border-b-0 items-center`}
            >
              <div className="col-span-6 sm:col-span-8 text-[#171513]">{item}</div>
              <div className="col-span-3 sm:col-span-2 text-center font-bold text-emerald-600">✓</div>
              <div className="col-span-3 sm:col-span-2 text-center font-bold text-zinc-400">—</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. OUR PROMISE ── */}
      <section className="bg-white border-y border-[#E8E1D5] py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              Our Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2.5">
              <span className="text-2xl block">📖</span>
              <h3 className="font-extrabold text-base text-[#171513]">Read it all before you pay</h3>
              <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
                Every report has a complete sample — all pages, nothing locked. No other astrology site shows you the whole thing first.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-2xl block">🙏</span>
              <h3 className="font-extrabold text-base text-[#171513]">Checked by an astrologer</h3>
              <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
                The maths is computed so it is exact. The reading is verified by a person before it reaches you.
              </p>
            </div>

            <div className="space-y-2.5">
              <span className="text-2xl block">🔒</span>
              <h3 className="font-extrabold text-base text-[#171513]">Your details stay yours</h3>
              <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
                Birth details are used to compute your chart and nothing else. Never sold, never shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. COMMON QUESTIONS (FAQ ACCORDION) ── */}
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
            Common Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How accurate does my birth time need to be?',
              a: 'Within about 15 minutes is ideal. Most readings hold within an hour; the ascendant and the divisional charts are what shift if it is further out.'
            },
            {
              q: 'How soon will I receive the report?',
              a: 'Within minutes directly on your WhatsApp and email as a beautifully formatted PDF document. It is yours to keep forever.'
            },
            {
              q: 'Is this a computer-generated report?',
              a: 'The planetary mathematics and astronomical charts are sidereally computed to the exact second, then the astrological readings are verified by senior Vedic astrologers before delivery.'
            },
            {
              q: 'What if I do not know my birth time?',
              a: 'You can provide your approximate time of day (morning, afternoon, evening), or opt for Prashna Kundali / palmistry consultation with our Vedic Acharyas.'
            },
            {
              q: 'Can I read a full sample first?',
              a: 'Yes! You can view sample pages to see the depth and clarity of calculations, dashas, and remedies before purchasing.'
            }
          ].map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E8E1D5] overflow-hidden shadow-2xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left font-bold text-sm text-[#171513] flex items-center justify-between gap-3 hover:text-[#B85C24] transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <span className="text-base font-bold text-[#6E665D]">
                    {isOpen ? '–' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#6E665D] leading-relaxed border-t border-[#E8E1D5]/60 bg-[#F8F4EC]/30">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── 10. BOTTOM CALL TO ACTION ── */}
      <section className="bg-[#151311] text-[#F8F4EC] py-16 text-center border-t border-amber-500/20">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to choose your report?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Get your authentic sidereal Vedic horoscope delivered straight to your WhatsApp in minutes.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('reports-top')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B85C24] hover:bg-[#a04e1c] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <ArrowUp className="h-4 w-4" />
              <span>Back to all reports ↑</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}

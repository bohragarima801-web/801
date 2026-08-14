'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Sparkles, Sparkle, Calendar, Bot, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { processToolPurchase } from '@/lib/tool-purchase'

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [trialStatuses, setTrialStatuses] = useState<Record<string, boolean>>({})
  const [activatedStatuses, setActivatedStatuses] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/tools')
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          setTools(j.data || [])
          if (j.userPaidSlugs) {
            const paidMap: Record<string, boolean> = {}
            j.userPaidSlugs.forEach((s: string) => { paidMap[s] = true })
            setActivatedStatuses(paidMap)
          }
          if (j.activeTrialSlugs) {
            const trialMap: Record<string, boolean> = {}
            j.activeTrialSlugs.forEach((s: string) => { trialMap[s] = true })
            setTrialStatuses(trialMap)
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function startTrial(slug: string, trialDays: number, toolId: string) {
    try {
      const res = await fetch('/api/tools/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId })
      })
      const data = await res.json()
      if (data.ok) {
        setTrialStatuses((prev) => ({ ...prev, [slug]: true }))
        toast.success(`🎉 Your ${trialDays}-day Free Trial has been activated for this tool!`)
        window.location.href = `/tools/${slug}`
      } else {
        toast.error(data.error || 'Failed to start trial')
      }
    } catch {
      toast.error('Network error starting trial')
    }
  }

  async function buyActivation(slug: string, toolId: string, toolName: string) {
    await processToolPurchase({
      toolId,
      toolSlug: slug,
      toolName,
      onSuccess: () => {
        setActivatedStatuses((prev) => ({ ...prev, [slug]: true }))
        window.location.href = `/tools/${slug}`
      }
    })
  }

  return (
    <div className="bg-[#FFFBF7] text-[#111827] min-h-screen py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
        
        {/* ── Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="kundli-badge-orange inline-flex">
            <Sparkles className="h-3.5 w-3.5 text-[#FF7A00]" /> Sacred Vedic & AI Tools
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">
            पावन ज्योतिष <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] bg-clip-text text-transparent">एवं वैदिक टूल्स</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed font-medium">
            27+ वर्षों के प्रामाणिक वैदिक ज्ञान एवं आधुनिक AI तकनीक द्वारा आपकी आध्यात्मिक साधना, कुंडली व मुहूर्त हेतु।
          </p>
        </div>

        {/* ── Main Tools Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-[#FF7A00]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            
            {/* 1. AI Pandit Ji (Active & Free) */}
            <article className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#F3E8DE] hover:border-[#FF7A00]/40 p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-13 w-13 rounded-2xl bg-[#FFF3E0] border border-orange-200 text-[#FF7A00] flex items-center justify-center shadow-sm shrink-0">
                    <Bot className="h-7 w-7" />
                  </div>
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    ⚡ LIVE NOW • FREE
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-xl text-[#111827] group-hover:text-[#FF7A00] transition-colors leading-snug">
                    AI पंडित जी (Vedic AI Chat) ✨
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium line-clamp-3">
                    पूजा विधि, राशिफल, व्रत नियम व ज्योतिष संबंधी सवाल पूछें। हिंदी व अंग्रेजी दोनों में तुरंत सटीक समाधान।
                  </p>
                </div>
              </div>

              {/* Action Button Container (Fixed Baseline at Bottom) */}
              <div className="mt-auto pt-5 border-t border-[#F3E8DE] w-full">
                <Link
                  href="/ask-a-pandit"
                  className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] inline-flex items-center justify-center gap-2"
                >
                  <span>Chat Now for Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            {/* 2. Today's Panchang Tool */}
            <article id="panchang" className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#F3E8DE] hover:border-[#FF7A00]/40 p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-13 w-13 rounded-2xl bg-[#FFF3E0] border border-orange-200 text-[#FF7A00] flex items-center justify-center shadow-sm shrink-0">
                    <Calendar className="h-7 w-7" />
                  </div>
                  <span className="bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    📅 DAILY PANCHANG
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-xl text-[#111827] group-hover:text-[#FF7A00] transition-colors leading-snug">
                    आज का पंचांग (Vedic Panchang) 📅
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium line-clamp-3">
                    5-वर्षीय दैनिक पंचांग - तिथि, नक्षत्र, योग, करण, अभिजित मुहूर्त, राहुकाल, एवं सूर्योदय/सूर्यास्त सटीक समय।
                  </p>
                </div>
              </div>

              {/* Action Button Container */}
              <div className="mt-auto pt-5 border-t border-[#F3E8DE] w-full">
                <Link
                  href="/panchang"
                  className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] inline-flex items-center justify-center gap-2"
                >
                  <span>View Panchang Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            {/* 3. Festivals & Vrat Calendar Tool */}
            <article id="festivals" className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#F3E8DE] hover:border-[#FF7A00]/40 p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-13 w-13 rounded-2xl bg-[#FFF3E0] border border-orange-200 text-[#FF7A00] flex items-center justify-center shadow-sm shrink-0">
                    <Sparkle className="h-7 w-7" />
                  </div>
                  <span className="bg-orange-50 border border-orange-200 text-orange-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    🎉 FESTIVAL CALENDAR
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-xl text-[#111827] group-hover:text-[#FF7A00] transition-colors leading-snug">
                    व्रत व त्योहार (Festivals & Vrat) 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium line-clamp-3">
                    संपूर्ण हिंदू त्योहार कैलेंडर, मासिक फिल्टर, एकादशी, प्रदोष व्रत, जयंती तिथियां एवं पौराणिक महात्म्य।
                  </p>
                </div>
              </div>

              {/* Action Button Container */}
              <div className="mt-auto pt-5 border-t border-[#F3E8DE] w-full">
                <Link
                  href="/festivals"
                  className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] inline-flex items-center justify-center gap-2"
                >
                  <span>Explore Festivals</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>

            {/* Real Active Database Tools */}
            {tools
              .filter((t) => t.isActive && t.slug !== 'panchang' && t.slug !== 'festivals' && t.slug !== 'ask-a-pandit')
              .map((t) => {
                const trialActive = trialStatuses[t.slug]
                const premiumActive = activatedStatuses[t.slug]

                return (
                  <article key={t.id} className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#F3E8DE] hover:border-[#FF7A00]/40 p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
                    <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div className="h-13 w-13 rounded-2xl bg-[#FFF3E0] border border-orange-200 text-[#FF7A00] flex items-center justify-center shadow-sm shrink-0 font-bold">
                          <Sparkles className="h-7 w-7" />
                        </div>
                        {t.isFree ? (
                          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Free Access
                          </span>
                        ) : premiumActive ? (
                          <span className="bg-green-50 border border-green-200 text-green-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Premium Active
                          </span>
                        ) : trialActive ? (
                          <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Trial Active
                          </span>
                        ) : (
                          <span className="bg-orange-50 border border-orange-200 text-[#FF7A00] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            Premium (₹{Number(t.price)})
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-heading font-extrabold text-xl text-[#111827] group-hover:text-[#FF7A00] transition-colors leading-snug">
                          {t.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium line-clamp-3">
                          {t.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Button Container (Fixed Baseline at Bottom) */}
                    <div className="mt-auto pt-5 border-t border-[#F3E8DE] w-full">
                      {t.isFree || premiumActive || trialActive ? (
                        <Link
                          href={`/tools/${t.slug}`}
                          className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] inline-flex items-center justify-center gap-2"
                        >
                          <span>Open Tool</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2.5 w-full">
                          {t.trialDays > 0 && (
                            <button
                              type="button"
                              onClick={() => startTrial(t.slug, t.trialDays, t.id)}
                              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-bold text-xs py-3 px-3 rounded-xl transition-all min-h-[44px] inline-flex items-center justify-center"
                            >
                              {t.trialDays} Days Trial
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => buyActivation(t.slug, t.id, t.name)}
                            className="flex-1 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] inline-flex items-center justify-center gap-1.5"
                          >
                            <span>Activate (₹{Number(t.price)})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })}

          </div>
        )}

      </div>
    </div>
  )
}

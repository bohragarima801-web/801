'use client'

import { useEffect, useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Sparkles,
  Search,
  Bot,
  Calendar,
  Sparkle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  Star,
  Zap,
  HelpCircle,
  Gem,
  Flame,
  SunMedium
} from 'lucide-react'
import Link from 'next/link'
import { processToolPurchase } from '@/lib/tool-purchase'

// Category definitions with icons and matching keywords
const CATEGORIES = [
  { id: 'all', label: 'सभी टूल्स (All)', icon: Sparkles },
  { id: 'kundli', label: '🔮 कुंडली व ज्योतिष', icon: Compass },
  { id: 'oracle', label: '🕉️ सिद्ध प्रश्नावली', icon: Flame },
  { id: 'panchang', label: '📅 पंचांग व मुहूर्त', icon: Calendar },
  { id: 'sadhana', label: '📿 साधना व जाप', icon: Zap },
  { id: 'gemstone', label: '💎 रत्न व अंक', icon: Gem },
  { id: 'ai', label: '🤖 AI पंडित जी', icon: Bot }
]

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
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
            j.userPaidSlugs.forEach((s: string) => {
              paidMap[s] = true
            })
            setActivatedStatuses(paidMap)
          }
          if (j.activeTrialSlugs) {
            const trialMap: Record<string, boolean> = {}
            j.activeTrialSlugs.forEach((s: string) => {
              trialMap[s] = true
            })
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

  // Combine Core Portal Features with Database Dynamic Tools
  const allPortalTools = useMemo(() => {
    const staticPortalTools = [
      {
        id: 'static-ai-pandit',
        name: 'AI पंडित जी (Sacred Vedic AI Chat)',
        slug: 'ask-a-pandit',
        href: '/ask-a-pandit',
        description: 'पूजा विधि, कुंडली दोष, व्रत नियम व ज्योतिष संबंधी सवाल 24x7 पूछें। तुरंत सटीक शास्त्रीय उत्तर।',
        isFree: true,
        price: 0,
        trialDays: 0,
        category: 'ai',
        icon: Bot,
        badge: '⚡ AI LIVE • 100% FREE',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      },
      {
        id: 'static-panchang',
        name: 'आज का पंचांग (Dainik Panchang)',
        slug: 'panchang',
        href: '/panchang',
        description: '5-वर्षीय दैनिक पंचांग: तिथि, नक्षत्र, करण, योग, अभिजित मुहूर्त, राहुकाल एवं सूर्योदय/सूर्यास्त समय।',
        isFree: true,
        price: 0,
        trialDays: 0,
        category: 'panchang',
        icon: Calendar,
        badge: '📅 DAILY PANCHANG',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
      },
      {
        id: 'static-festivals',
        name: 'व्रत व त्योहार कैलेंडर (Festival Calendar)',
        slug: 'festivals',
        href: '/festivals',
        description: 'संपूर्ण हिंदू व्रत व त्योहार, एकादशी, प्रदोष, पूर्णिमा, अमावस्या तिथियां व पौराणिक महात्म्य।',
        isFree: true,
        price: 0,
        trialDays: 0,
        category: 'panchang',
        icon: Sparkle,
        badge: '🎉 FESTIVALS 2024-2030',
        badgeColor: 'bg-orange-50 text-orange-800 border-orange-200'
      },
      {
        id: 'static-muhurat',
        name: 'शुभ मुहूर्त फाइंडर (Shubh Muhurat Finder)',
        slug: 'muhurat',
        href: '/muhurat',
        description: 'विवाह, गृह प्रवेश, वाहन क्रय, नामकरण व व्यापार शुभारंभ हेतु सर्वश्रेष्ठ शुभ मुहूर्त व चौघड़िया।',
        isFree: true,
        price: 0,
        trialDays: 0,
        category: 'panchang',
        icon: Clock,
        badge: '⏳ SHUBH MUHURAT',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
      }
    ]

    // Map DB tools with categorized properties
    const dynamicDbTools = tools
      .filter((t) => t.isActive && t.slug !== 'panchang' && t.slug !== 'festivals' && t.slug !== 'muhurat' && t.slug !== 'ask-a-pandit')
      .map((t) => {
        const s = t.slug.toLowerCase()
        const n = t.name.toLowerCase()

        let cat = 'kundli'
        let IconComp = Compass

        if (s.includes('prashnavali') || n.includes('प्रश्नावली') || n.includes('गणेश') || s.includes('ganesh')) {
          cat = 'oracle'
          IconComp = Flame
        } else if (s.includes('mala') || n.includes('माला') || n.includes('जाप') || s.includes('japa')) {
          cat = 'sadhana'
          IconComp = Zap
        } else if (s.includes('samay') || s.includes('choghadiya') || s.includes('hora') || s.includes('muhurat') || n.includes('समय') || n.includes('चौघड़िया')) {
          cat = 'panchang'
          IconComp = SunMedium
        } else if (s.includes('ratna') || s.includes('gemstone') || s.includes('numerology') || n.includes('रत्न') || n.includes('अंक')) {
          cat = 'gemstone'
          IconComp = Gem
        } else if (s.includes('milan') || s.includes('kundali') || n.includes('कुंडली') || n.includes('मिलान')) {
          cat = 'kundli'
          IconComp = Compass
        }

        return {
          id: t.id,
          name: t.name,
          slug: t.slug,
          href: `/tools/${t.slug}`,
          description: t.description || 'वैदिक ज्योतिष एवं खगोलीय गणनाओं पर आधारित सटीक एवं प्रामाणिक ऑनलाइन टूल।',
          isFree: t.isFree,
          price: Number(t.price) || 0,
          trialDays: t.trialDays || 0,
          category: cat,
          icon: IconComp,
          badge: t.isFree ? '100% FREE' : `PREMIUM ₹${Number(t.price)}`,
          badgeColor: t.isFree ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
        }
      })

    return [...staticPortalTools, ...dynamicDbTools]
  }, [tools])

  // Filter tools by search and category
  const filteredTools = useMemo(() => {
    return allPortalTools.filter((t) => {
      const matchCat = selectedCategory === 'all' || t.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      const matchSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.slug.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))

      return matchCat && matchSearch
    })
  }, [allPortalTools, selectedCategory, searchQuery])

  return (
    <div className="bg-[#FFFBF7] text-[#111827] min-h-screen py-10 md:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 space-y-10">
        
        {/* ── Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100/70 border border-orange-200 text-[#FF7A00] text-xs font-black tracking-wide shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" /> 100% प्रामाणिक वैदिक एवं ज्योतिषीय टूल्स
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight leading-[1.15]">
            पावन ज्योतिष <span className="bg-gradient-to-r from-[#FF7A00] via-[#E65100] to-[#FF6B00] bg-clip-text text-transparent">एवं साधना टूल्स</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            27+ वर्षों के प्रामाणिक वैदिक ज्ञान, काल-गणना व आधुनिक AI तकनीक द्वारा आपकी कुंडली, पंचांग, साधना व शंका समाधान हेतु।
          </p>
        </div>

        {/* ── Search Bar & Category Filter Bar */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Live Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-400" />
            <Input
              type="text"
              placeholder="टूल खोजें... (जैसे: गणेश प्रश्नावली, कुंडली मिलान, पंचांग, शुभ समय, जाप माला)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-13 bg-white rounded-2xl border border-[#F3E8DE] shadow-xs text-sm sm:text-base font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar justify-start sm:justify-center">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#FF7A00] text-white shadow-md scale-102'
                      : 'bg-white text-slate-700 border border-[#F3E8DE] hover:bg-orange-50/60 hover:text-orange-700 shadow-2xs'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Main Tools Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <Loader2 className="h-10 w-10 animate-spin text-[#FF7A00]" />
            <p className="text-xs font-bold text-slate-500">वैदिक टूल्स लोड हो रहे हैं...</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#F3E8DE] p-8 max-w-lg mx-auto shadow-xs">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">कोई टूल नहीं मिला</h3>
            <p className="text-sm text-slate-500 mb-6">
              आपके खोज शब्द <strong>"{searchQuery}"</strong> से संबंधित कोई टूल उपलब्ध नहीं है। कृपया दूसरा कीवर्ड आज़माएँ।
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="px-6 py-2.5 bg-orange-600 text-white rounded-xl font-bold text-xs hover:bg-orange-700 transition-all shadow-md"
            >
              सभी टूल्स देखें (View All)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {filteredTools.map((t) => {
              const Icon = t.icon
              const trialActive = trialStatuses[t.slug]
              const premiumActive = activatedStatuses[t.slug]
              const isUnlocked = t.isFree || premiumActive || trialActive

              return (
                <article
                  key={t.id}
                  className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#F3E8DE] hover:border-[#FF7A00]/50 p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    {/* Top Icon & Status Pill */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="h-13 w-13 rounded-2xl bg-gradient-to-br from-[#FFF3E0] to-[#FFE0B2] border border-orange-200 text-[#FF7A00] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="h-7 w-7" />
                      </div>

                      {t.isFree ? (
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          ⚡ LIVE NOW • FREE
                        </span>
                      ) : premiumActive ? (
                        <span className="bg-green-50 border border-green-200 text-green-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          ✓ VIP ACTIVE
                        </span>
                      ) : trialActive ? (
                        <span className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          ⏳ TRIAL ACTIVE
                        </span>
                      ) : (
                        <span className="bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <Star className="h-2.5 w-2.5 fill-amber-600 text-amber-600" /> Premium ₹{t.price}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-[#111827] group-hover:text-[#FF7A00] transition-colors leading-snug">
                        {t.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed font-medium line-clamp-3">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button Container (Fixed Baseline at Bottom) */}
                  <div className="mt-auto pt-5 border-t border-[#F3E8DE] w-full">
                    {isUnlocked ? (
                      <Link
                        href={t.href}
                        className="w-full bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] inline-flex items-center justify-center gap-2 group-hover:gap-3"
                      >
                        <span>टूल खोलें (Open Tool)</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        {t.trialDays > 0 && (
                          <button
                            type="button"
                            onClick={() => startTrial(t.slug, t.trialDays, t.id)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs py-3 px-2 rounded-xl transition-all min-h-[44px] inline-flex items-center justify-center"
                          >
                            {t.trialDays} Days Trial
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => buyActivation(t.slug, t.id, t.name)}
                          className="flex-1 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs sm:text-sm py-3 px-3 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] inline-flex items-center justify-center gap-1.5"
                        >
                          <span>अनलॉक करें (₹{t.price})</span>
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* ── Vedic Authenticity Guarantee Banner */}
        <section className="bg-white rounded-3xl border border-[#F3E8DE] p-6 md:p-8 shadow-xs">
          <div className="grid sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                  100% प्रामाणिक वैदिक गणना
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  पराशर, वराहमिहिर एवं सूर्य सिद्धांत के मूल ज्योतिषीय सूत्रों पर आधारित।
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                  रीयल-टाइम तुरंत परिणाम
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  सटीक खगोलीय गणित द्वारा बिना किसी प्रतीक्षा के तुरंत विस्तृत रिपोर्ट।
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5">
              <div className="h-12 w-12 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-slate-900">
                  निजी व पूर्णतः सुरक्षित
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  आपकी जन्म जानकारी व इनपुट पूरी तरह गोपनीय और सुरक्षित रहते हैं।
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

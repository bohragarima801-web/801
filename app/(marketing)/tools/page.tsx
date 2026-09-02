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
  SunMedium,
  Lock,
  Crown,
  Play,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { processToolPurchase } from '@/lib/tool-purchase'

// Category definitions with icons and matching keywords
const CATEGORIES = [
  { id: 'all', label: 'All Tools', icon: Sparkles },
  { id: 'kundli', label: 'Kundali & Astrology', icon: Compass },
  { id: 'oracle', label: 'Sacred Oracle', icon: Flame },
  { id: 'panchang', label: 'Panchang & Muhurat', icon: Calendar },
  { id: 'sadhana', label: 'Sadhana & Japa', icon: Zap },
  { id: 'gemstone', label: 'Gems & Numerology', icon: Gem },
  { id: 'ai', label: 'AI Pandit Ji', icon: Bot }
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
        name: 'AI Pandit Ji — Sacred Vedic AI Chat',
        slug: 'ask-a-pandit',
        href: '/ask-a-pandit',
        description: 'Get instant answers on puja vidhi, kundali dosh, vrat niyam & astrology queries 24x7. Accurate scriptural guidance powered by AI.',
        isFree: true,
        price: 0,
        trialDays: 0,
        category: 'ai',
        icon: Bot,
        badge: 'AI LIVE',
        badgeColor: 'emerald',
        featured: true
      },
      {
        id: 'static-panchang',
        name: 'Daily Panchang — Dainik Panchang',
        slug: 'panchang',
        href: '/panchang',
        description: '5-year daily Panchang with Tithi, Nakshatra, Karan, Yoga, Abhijit Muhurat, Rahukaal & sunrise/sunset timings.',
        isFree: true,
        price: 0,
        trialDays: 0,
        category: 'panchang',
        icon: Calendar,
        badge: 'DAILY',
        badgeColor: 'amber',
        featured: false
      },
      {
        id: 'static-festivals',
        name: 'Festival Calendar — Vrat & Tyohar',
        slug: 'festivals',
        href: '/festivals',
        description: 'Complete Hindu festival & vrat calendar — Ekadashi, Pradosh, Purnima, Amavasya dates with detailed significance.',
        isFree: true,
        price: 0,
        trialDays: 0,
        category: 'panchang',
        icon: Sparkle,
        badge: '2024-2030',
        badgeColor: 'orange',
        featured: false
      },
      {
        id: 'static-muhurat',
        name: 'Shubh Muhurat Finder',
        slug: 'muhurat',
        href: '/muhurat',
        description: 'Find the most auspicious muhurats & Choghadiya for weddings, Griha Pravesh, vehicle purchase, Namkaran & business launches.',
        isFree: true,
        price: 0,
        trialDays: 0,
        category: 'panchang',
        icon: Clock,
        badge: 'MUHURAT',
        badgeColor: 'amber',
        featured: false
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
          description: t.description || 'Accurate & authentic online tool based on Vedic astrology and astronomical calculations.',
          isFree: t.isFree,
          price: Number(t.price) || 0,
          trialDays: t.trialDays || 0,
          category: cat,
          icon: IconComp,
          badge: t.isFree ? 'FREE' : `₹${Number(t.price)}`,
          badgeColor: t.isFree ? 'emerald' : 'amber',
          featured: false
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-orange-50/30">
      
      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── PREMIUM HERO SECTION ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-12 pb-16 md:pt-16 md:pb-20">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/5 rounded-full blur-3xl" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDItdjJoLTJ6TTAgMzRoMnYyaC0yek0zNiAwaDJ2MmgtMnpNMCAwaDJ2MmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-orange-300 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            <span>100% Authentic Vedic & Astrology Tools</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-white">Sacred Vedic</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
              & Astrology Tools
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl mx-auto font-medium">
            Powered by 27+ years of Vedic wisdom & modern AI — access Kundali, Panchang, Muhurat, Japa Mala & more, all in one place.
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 sm:gap-10 pt-2">
            {[
              { num: '8+', label: 'Vedic Tools' },
              { num: '100%', label: 'Free Access' },
              { num: '24/7', label: 'Available' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-white">{stat.num}</div>
                <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── SEARCH & FILTER BAR ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search tools... (e.g., Kundali, Panchang, Muhurat, Japa Mala)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-slate-50 rounded-xl border-slate-200 text-sm font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg font-semibold transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isSelected = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── TOOLS GRID ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="relative">
              <div className="h-14 w-14 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Loading Vedic Tools...</p>
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="h-20 w-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <Search className="h-9 w-9 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No tools found</h3>
            <p className="text-sm text-slate-500 mb-6">
              No tools match <strong>"{searchQuery}"</strong>. Try a different keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-orange-500/25 transition-all"
            >
              View All Tools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredTools.map((t, index) => {
              const Icon = t.icon
              const trialActive = trialStatuses[t.slug]
              const premiumActive = activatedStatuses[t.slug]
              const isUnlocked = t.isFree || premiumActive || trialActive
              const isFeatured = (t as any).featured

              // Dynamic gradient for icon backgrounds
              const iconGradients = [
                'from-orange-500 to-amber-500',
                'from-violet-500 to-purple-500',
                'from-emerald-500 to-teal-500',
                'from-blue-500 to-cyan-500',
                'from-rose-500 to-pink-500',
                'from-amber-500 to-yellow-500',
              ]
              const gradientClass = iconGradients[index % iconGradients.length]

              return (
                <article
                  key={t.id}
                  className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                    isFeatured
                      ? 'border-orange-200 shadow-lg shadow-orange-500/10 ring-1 ring-orange-100'
                      : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-orange-200/60'
                  }`}
                >
                  {/* Featured ribbon */}
                  {isFeatured && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
                  )}

                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    {/* Top: Icon + Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradientClass} text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                        <Icon className="h-6 w-6" />
                      </div>

                      {t.isFree ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                          <Zap className="h-2.5 w-2.5" />
                          Free
                        </span>
                      ) : premiumActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          Active
                        </span>
                      ) : trialActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                          <Clock className="h-2.5 w-2.5" />
                          Trial
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                          <Crown className="h-2.5 w-2.5" />
                          ₹{t.price}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2 flex-1">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-orange-600 transition-colors leading-snug line-clamp-2">
                        {t.name}
                      </h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 mt-auto">
                    {isUnlocked ? (
                      <Link
                        href={t.href}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-orange-500/20 transition-all inline-flex items-center justify-center gap-2 group/btn"
                      >
                        <Play className="h-4 w-4 fill-white" />
                        <span>Open Tool</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 w-full">
                        {t.trialDays > 0 && (
                          <button
                            type="button"
                            onClick={() => startTrial(t.slug, t.trialDays, t.id)}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs py-3 px-2 rounded-xl transition-all inline-flex items-center justify-center gap-1"
                          >
                            <Play className="h-3 w-3" />
                            {t.trialDays}d Trial
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => buyActivation(t.slug, t.id, t.name)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm py-3 px-3 rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-1.5"
                        >
                          <Lock className="h-3.5 w-3.5" />
                          <span>Unlock ₹{t.price}</span>
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


      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ── TRUST GUARANTEE SECTION ── */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-8 md:p-10 shadow-xl">
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-500/15 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">
                  100% Authentic Vedic Calculations
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Based on Parashar, Varahamihir & Surya Siddhant's core astronomical formulas.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">
                  Real-Time Instant Results
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Precise astronomical calculations deliver detailed reports without any wait.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-sky-500/15 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">
                  Private & Fully Secure
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your birth details and all inputs remain completely confidential and secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

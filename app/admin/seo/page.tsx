'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Sparkles, CheckCircle2, AlertTriangle, Save, RefreshCw, ExternalLink, Image as ImageIcon, Search, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

function SeoManager() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'alts'

  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [autoFixing, setAutoFixing] = useState(false)
  const [savingGlobal, setSavingGlobal] = useState(false)

  const [blogs, setBlogs] = useState<any[]>([])
  const [editedAlts, setEditedAlts] = useState<{ [key: string]: string }>({})

  // Global SEO state
  const [siteTitle, setSiteTitle] = useState('DivyaYagyam - Vedic Rituals, Puja Booking & Astrology Services')
  const [siteDesc, setSiteDesc] = useState('Book online pujas, order authentic pooja samagri, and consult verified Vedic pandits.')
  const [siteKeywords, setSiteKeywords] = useState('online puja, puja booking, vedic pandit, pooja samagri, astrology')

  async function loadData() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/seo')
      const data = await res.json()
      if (data.ok) {
        setBlogs(data.data.blogs || [])
        const initialAlts: { [key: string]: string } = {}
        ;(data.data.blogs || []).forEach((b: any) => {
          initialAlts[b.id] = b.coverImageAlt || ''
        })
        setEditedAlts(initialAlts)

        if (data.data.globalSeo) {
          const g = data.data.globalSeo
          if (g.title) setSiteTitle(g.title)
          if (g.desc) setSiteDesc(g.desc)
          if (g.keywords) setSiteKeywords(g.keywords)
        }
      }
    } catch {
      toast.error('Failed to load SEO & Alt data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSaveAlt(blogId: string) {
    try {
      setSavingId(blogId)
      const altValue = editedAlts[blogId] || ''
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_blog_alt',
          id: blogId,
          coverImageAlt: altValue,
        })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Live database updated: Image Alt Text saved!')
        loadData()
      } else {
        toast.error(data.error || 'Failed to update Alt text')
      }
    } catch {
      toast.error('Network error saving Alt text')
    } finally {
      setSavingId(null)
    }
  }

  async function handleAutoFixAll() {
    try {
      setAutoFixing(true)
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto_fix_all_alts',
        })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message)
        loadData()
      } else {
        toast.error(data.error || 'Failed to auto generate Alt texts')
      }
    } catch {
      toast.error('Network error auto generating Alt texts')
    } finally {
      setAutoFixing(false)
    }
  }

  async function handleSaveGlobalSeo(e: React.FormEvent) {
    e.preventDefault()
    try {
      setSavingGlobal(true)
      const res = await fetch('/api/admin/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_global_seo',
          seoData: {
            title: siteTitle,
            desc: siteDesc,
            keywords: siteKeywords,
          }
        })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Global site SEO settings saved live!')
      } else {
        toast.error(data.error || 'Failed to save Global SEO')
      }
    } catch {
      toast.error('Network error saving Global SEO')
    } finally {
      setSavingGlobal(false)
    }
  }

  const changeTab = (val: string) => {
    router.push(`/admin/seo?tab=${val}`)
  }

  const tabs = [
    { label: '📷 Live Image Alt Text Manager', value: 'alts' },
    { label: '🔍 Global Site SEO & Meta Titles', value: 'global' },
    { label: '🚀 Google Sitemap & Indexing', value: 'indexing' }
  ]

  const totalBlogs = blogs.length
  const missingAltBlogs = blogs.filter(b => b.hasMissingAlt).length
  const fullyOptimizedCount = totalBlogs - missingAltBlogs

  return (
    <div className="space-y-6">
      <PageHeader
        title="SEO & Live Image Alt Text Control Hub"
        description="Google Image Search और Google Search Console के लिए Alt Text और Meta Data लाइव अपडेट करें।"
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'SEO & Alt Manager' }]}
      />

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => changeTab(t.value)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${activeTab === t.value ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
        </div>
      ) : (
        <div>
          {activeTab === 'alts' && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="rounded-2xl bg-blue-50/50 border-blue-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-blue-700">Total Blog Posts</p>
                      <p className="text-2xl font-black text-blue-900">{totalBlogs}</p>
                    </div>
                    <ImageIcon className="h-8 w-8 text-blue-500 opacity-60" />
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-emerald-50/50 border-emerald-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-700">Fully SEO Alt Optimized</p>
                      <p className="text-2xl font-black text-emerald-900">{fullyOptimizedCount}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-amber-50/50 border-amber-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-amber-700">Missing Alt Tags</p>
                      <p className="text-2xl font-black text-amber-900">{missingAltBlogs}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-amber-500 opacity-60" />
                  </CardContent>
                </Card>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-orange-600 fill-orange-600" /> One-Click Auto SEO Alt Text Fixer
                  </h3>
                  <p className="text-xs text-slate-600">
                    जिन ब्लॉग पोस्ट का Cover Image Alt Text खाली है, उनका ऑटोमैटिक गूगल कीवर्ड-रिच ऑल्ट टेक्स्ट बनाकर डेटाबेस में सेव करें।
                  </p>
                </div>
                <Button
                  onClick={handleAutoFixAll}
                  disabled={autoFixing}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md gap-2"
                >
                  {autoFixing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Auto-Fix All Missing Alt Texts Live
                </Button>
              </div>

              {/* Blog List with Alt Input */}
              <Card className="rounded-3xl border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-slate-800">Live Blog Image Alt Manager</CardTitle>
                  <CardDescription className="text-xs">
                    हर पोस्ट का कवर इमेज ऑल्ट टेक्स्ट सीधे डेटाबेस (DB) में एडिट और सेव करें।
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blogs.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">No blogs found.</div>
                  ) : (
                    <div className="divide-y border rounded-2xl bg-white overflow-hidden">
                      {blogs.map((b) => {
                        const currentAlt = editedAlts[b.id] !== undefined ? editedAlts[b.id] : b.coverImageAlt
                        const isMissing = !currentAlt || !currentAlt.trim()

                        return (
                          <div key={b.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="h-16 w-24 shrink-0 rounded-xl overflow-hidden border bg-slate-100 flex items-center justify-center">
                                {b.coverImage ? (
                                  <img src={b.coverImage} alt={currentAlt || b.title} className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon className="h-6 w-6 text-slate-400" />
                                )}
                              </div>

                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-slate-900 truncate" title={b.title}>
                                    {b.title}
                                  </span>
                                  {isMissing ? (
                                    <Badge variant="destructive" className="text-[9px] font-bold">
                                      Missing Alt ⚠️
                                    </Badge>
                                  ) : (
                                    <Badge variant="success" className="text-[9px] font-bold">
                                      Live Alt ✅
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                  <span>Slug: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">{b.slug}</code></span>
                                  <Link href={`/blog/${b.slug}`} target="_blank" className="text-blue-600 font-bold hover:underline flex items-center gap-0.5">
                                    View Live <ExternalLink className="h-3 w-3" />
                                  </Link>
                                </div>
                              </div>
                            </div>

                            {/* Alt Text Input Form */}
                            <div className="flex items-center gap-2 md:w-1/2">
                              <div className="flex-1 space-y-1">
                                <Input
                                  value={currentAlt}
                                  onChange={(e) => setEditedAlts({ ...editedAlts, [b.id]: e.target.value })}
                                  placeholder="Type SEO Image Alt Text..."
                                  className="text-xs h-9 rounded-xl border-slate-300 bg-white"
                                />
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleSaveAlt(b.id)}
                                disabled={savingId === b.id}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-9 rounded-xl shrink-0 gap-1"
                              >
                                {savingId === b.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Save className="h-3.5 w-3.5" />
                                )}
                                Save DB
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'global' && (
            <Card className="rounded-3xl border shadow-sm max-w-2xl">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" /> Global Site SEO & Meta Information
                </CardTitle>
                <CardDescription className="text-xs">
                  वेबसाइट के मुख्य पेजों के लिए डिफ़ॉल्ट मेटा टाइटल, मेटा डिस्क्रिप्शन और कीवर्ड सेट करें।
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveGlobalSeo} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Default Site Meta Title (मुख्य टाइटल)</Label>
                    <Input
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      required
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Default Meta Description (साइट डिस्क्रिप्शन)</Label>
                    <Textarea
                      rows={3}
                      value={siteDesc}
                      onChange={(e) => setSiteDesc(e.target.value)}
                      required
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Main Target Keywords (मुख्य कीवर्ड्स - कॉमा से अलग करें)</Label>
                    <Input
                      value={siteKeywords}
                      onChange={(e) => setSiteKeywords(e.target.value)}
                      required
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <Button type="submit" disabled={savingGlobal} className="w-full bg-blue-600 hover:bg-blue-700 font-bold rounded-xl h-10 gap-2">
                    {savingGlobal ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Global SEO Settings Live
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'indexing' && (
            <Card className="rounded-3xl border shadow-sm max-w-2xl">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> Google Search Console & Live Sitemap Status
                </CardTitle>
                <CardDescription className="text-xs">
                  गूगल और AI सर्च बॉट्स के लिए लाइव साइटमैप और रोबोट्स फाइल की स्थिति देखें।
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border rounded-2xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">XML Sitemap (साइटमैप लिंक)</h4>
                      <p className="text-xs text-slate-500">Google Search Console में सबमिट करने के लिए लाइव साइटमैप</p>
                    </div>
                    <Link href="/sitemap.xml" target="_blank" className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm">
                      Open /sitemap.xml <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="p-4 border rounded-2xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Robots.txt (रोबोट्स फाइल)</h4>
                      <p className="text-xs text-slate-500">Google Bot और AI Crawlers के लिए अनुमतियाँ</p>
                    </div>
                    <Link href="/robots.txt" target="_blank" className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm">
                      Open /robots.txt <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <div className="p-4 border rounded-2xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">LLMs.txt (AI Search Optimization)</h4>
                      <p className="text-xs text-slate-500">ChatGPT, Perplexity और Gemini AI के लिए स्ट्रक्चर्ड डेटा</p>
                    </div>
                    <Link href="/llms.txt" target="_blank" className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-xs bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm">
                      Open /llms.txt <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default function SeoPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-orange-600" /></div>}>
      <SeoManager />
    </Suspense>
  )
}

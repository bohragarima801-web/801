'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Newspaper, FileText, MessageSquare, Eye, Trash2, Edit2, Loader2, Search, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function BlogManager() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'all'

  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Auto-Blog Control States
  const [autoBlogEnabled, setAutoBlogEnabled] = useState(true)
  const [publishMode, setPublishMode] = useState<'PUBLISHED' | 'DRAFT'>('PUBLISHED')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [customTopicInput, setCustomTopicInput] = useState('')

  async function loadPosts() {
    try {
      setLoading(true)
      const [blogRes, autoBlogRes] = await Promise.all([
        fetch('/api/admin/blog'),
        fetch('/api/admin/blogs/auto-generate')
      ])

      const blogData = await blogRes.json()
      if (blogData.ok) {
        setPosts(blogData.data || [])
      }

      const autoBlogData = await autoBlogRes.json()
      if (autoBlogData.ok) {
        setAutoBlogEnabled(autoBlogData.data?.enabled ?? true)
        setPublishMode(autoBlogData.data?.publishMode || 'PUBLISHED')
      }
    } catch {
      toast.error('Failed to load blog posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  async function handleToggleSetting(newEnabled: boolean, newMode: 'PUBLISHED' | 'DRAFT') {
    try {
      setIsSavingSettings(true)
      setAutoBlogEnabled(newEnabled)
      setPublishMode(newMode)

      const res = await fetch('/api/admin/blogs/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'settings',
          enabled: newEnabled,
          publishMode: newMode
        })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message || 'Auto-blog settings updated!')
      } else {
        toast.error(data.error || 'Failed to update settings')
      }
    } catch {
      toast.error('Failed to update auto-blog settings')
    } finally {
      setIsSavingSettings(false)
    }
  }

  async function handleGenerateInstantBlog() {
    try {
      setIsGenerating(true)
      toast.info('AI is researching topics, writing 1500+ word Vedic blog & linking Pujas... Please wait 10-15 seconds.')

      const res = await fetch('/api/admin/blogs/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate',
          publishMode,
          forceTopic: customTopicInput || undefined
        })
      })

      const data = await res.json()
      if (data.ok) {
        toast.success('🌸 Instant AI Blog Generated & Published Successfully!')
        setCustomTopicInput('')
        loadPosts()
      } else {
        toast.error(data.error || 'Failed to generate AI blog')
      }
    } catch {
      toast.error('Network error generating AI blog')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to permanently delete this post?')) return
    try {
      const res = await fetch(`/api/admin/blog?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Article deleted successfully')
        loadPosts()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Network error deleting post')
    }
  }

  // Filter based on active tab
  const filteredPosts = posts.filter((p) => {
    if (activeTab === 'published') return p.status === 'PUBLISHED'
    if (activeTab === 'drafts') return p.status === 'DRAFT'
    if (activeTab === 'archived') return p.status === 'ARCHIVED'
    return true
  })

  const tabs = [
    { label: 'All Articles', value: 'all' },
    { label: 'Published (लाइव)', value: 'published' },
    { label: 'Drafts (ड्राफ्ट)', value: 'drafts' }
  ]

  const changeTab = (val: string) => {
    router.push(`/admin/blog?tab=${val}`)
  }

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog & CMS Management"
        description="Manage articles, search tags, meta-keyword titles and page descriptions."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Blog' }]}
        action={{ label: 'New Post', href: '/admin/blog/new' }}
        secondaryAction={{ label: 'Categories', href: '/admin/blog/categories' }}
      />

      {/* Auto-Blog Control Center Card */}
      <div className="bg-gradient-to-r from-amber-900/90 via-orange-950 to-stone-900 border border-amber-500/40 rounded-3xl p-5 md:p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
              <h3 className="text-lg font-bold text-amber-300 font-heading">
                🤖 Auto AI Daily Blog Engine Control Center
              </h3>
            </div>
            <p className="text-xs text-amber-100/80 font-medium">
              100% Niche-Specific (Sanatan/Vedic Pujas), SEO-Optimized, 1500+ Words Humanized Blog Generator with Internal Puja Links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Auto-Blog ON/OFF Toggle */}
            <button
              type="button"
              disabled={isSavingSettings}
              onClick={() => handleToggleSetting(!autoBlogEnabled, publishMode)}
              className={`px-4 py-2 rounded-full text-xs font-black border transition-all flex items-center gap-1.5 shadow-md ${
                autoBlogEnabled
                  ? 'bg-emerald-600 border-emerald-400 text-white hover:bg-emerald-700'
                  : 'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-900'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${autoBlogEnabled ? 'bg-white animate-pulse' : 'bg-stone-400'}`} />
              {autoBlogEnabled ? '🟢 Daily Auto-Blog: ON' : '⚪ Daily Auto-Blog: OFF'}
            </button>

            {/* Direct Live vs Draft Mode Toggle */}
            <button
              type="button"
              disabled={isSavingSettings}
              onClick={() => handleToggleSetting(autoBlogEnabled, publishMode === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                publishMode === 'PUBLISHED'
                  ? 'bg-amber-600/90 border-amber-400 text-white hover:bg-amber-600'
                  : 'bg-blue-600/90 border-blue-400 text-white hover:bg-blue-600'
              }`}
            >
              {publishMode === 'PUBLISHED' ? '🚀 Mode: Direct Live' : '📝 Mode: Review Draft'}
            </button>
          </div>
        </div>

        {/* Instant Manual AI Generation Panel */}
        <div className="flex flex-col sm:flex-row gap-3 items-center pt-1">
          <input
            type="text"
            placeholder="Optional custom topic (e.g. प्रदोष व्रत विधि एवं कथा, कात्यायनी पूजा उपाय)..."
            value={customTopicInput}
            onChange={(e) => setCustomTopicInput(e.target.value)}
            className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-black/50 border border-amber-500/30 text-white placeholder-amber-200/50 text-xs focus:outline-none focus:border-amber-400"
          />
          <Button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerateInstantBlog}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-lg shrink-0 gap-2 cursor-pointer"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-amber-200" />}
            {isGenerating ? 'AI Writing 1500+ Word Blog…' : '⚡ 1-Click Generate Instant AI Blog'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Posts" value={posts.length.toString()} icon={Newspaper} />
        <KpiCard title="Published" value={posts.filter(p => p.status === 'PUBLISHED').length.toString()} icon={FileText} iconClass="text-green-600" />
        <KpiCard title="Total Views" value={totalViews.toString()} icon={Eye} iconClass="text-blue-500" />
        <KpiCard title="Feedback Comments" value="0" icon={MessageSquare} iconClass="text-orange-500" />
      </div>

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
        <DataTableShell
          columns={[
            { key: 'title', label: 'Article Title', render: (r) => <span className="font-bold text-slate-800">{r.title}</span> },
            { key: 'category', label: 'Category' },
            {
              key: 'seo',
              label: 'SEO Audit (Keywords & Tags)',
              render: (r) => (
                <div className="flex flex-col text-[10px] max-w-xs gap-0.5">
                  <span className="font-bold text-orange-600 truncate" title={r.seoTitle}>Meta Title: {r.seoTitle || 'Missing ⚠️'}</span>
                  <span className="text-slate-500 truncate" title={r.seoDescription}>Desc: {r.seoDescription || 'Missing ⚠️'}</span>
                </div>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <Badge variant={r.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                  {r.status}
                </Badge>
              )
            },
            { key: 'views', label: 'Views (👀)' },
            { key: 'publishedAt', label: 'Published On' },
            {
              key: 'actions',
              label: 'Actions',
              render: (r) => (
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" title="View Live Post" asChild>
                    <Link href={`/blog/${r.slug}`} target="_blank">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Edit Post" asChild>
                    <Link href={`/admin/blog/new?id=${r.id}`}>
                      <Edit2 className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete Post" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            }
          ]}
          rows={filteredPosts}
          searchPlaceholder="Search articles..."
        />
      )}
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    }>
      <BlogManager />
    </Suspense>
  )
}

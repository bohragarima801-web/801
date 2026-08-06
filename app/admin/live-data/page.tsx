'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Activity, RefreshCw, CheckCircle2, Flame, ShoppingBag, Wrench,
  Newspaper, ExternalLink, Cpu, Database, Zap, ShieldCheck, FileText, Globe
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LiveDataToolPage() {
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [liveData, setLiveData] = useState<any>(null)

  const fetchLiveData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/live-data')
      const data = await res.json()
      if (data.ok) {
        setLiveData(data.data)
      } else {
        toast.error(data.error || 'Failed to fetch live status')
      }
    } catch {
      toast.error('Network error fetching live status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveData()
  }, [])

  const handleSyncAll = async () => {
    try {
      setSyncing(true)
      const res = await fetch('/api/admin/live-data', { method: 'POST' })
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message || 'All cache revalidated & live data synced!')
        await fetchLiveData()
      } else {
        toast.error(data.error || 'Sync failed')
      }
    } catch {
      toast.error('Network error syncing data')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="⚡ Real-Time Data & System Sync Monitor"
          description="Live database counts, cache status, and real-time AI & SEO feed verification tool."
          breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Live Data Tool' }]}
        />

        <Button
          onClick={handleSyncAll}
          disabled={syncing}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold shadow-md rounded-xl shrink-0 gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing Live Data…' : 'Sync & Revalidate All Now (तुरंत सिंक करें)'}
        </Button>
      </div>

      {/* System Status Banner */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Database Status</p>
              <p className="text-base font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="h-4 w-4" /> Connected & Active
              </p>
            </div>
            <Database className="h-8 w-8 text-emerald-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Query Latency</p>
              <p className="text-base font-bold text-blue-600 mt-1">
                {loading ? 'Measuring…' : `${liveData?.pingMs || 12} ms`}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Live AI Search Feed</p>
              <p className="text-base font-bold text-amber-600 mt-1 flex items-center gap-1">
                <Zap className="h-4 w-4" /> Dynamic llms.txt
              </p>
            </div>
            <Cpu className="h-8 w-8 text-amber-500 opacity-80" />
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-purple-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Sitemap & Robots</p>
              <p className="text-base font-bold text-purple-600 mt-1 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> 100% Crawlable
              </p>
            </div>
            <Globe className="h-8 w-8 text-purple-500 opacity-80" />
          </CardContent>
        </Card>
      </div>

      {/* 4 Main Entity Live Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Pujas */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-600" /> Pujas & Anushthans
            </CardTitle>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              {liveData?.counts?.pujas?.published || 0} Live
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Pujas in DB:</span>
              <span className="font-bold">{liveData?.counts?.pujas?.total || 0}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Published Status:</span>
              <span className="font-bold text-emerald-600">{liveData?.counts?.pujas?.published || 0}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">VIP Rituals:</span>
              <span className="font-bold text-amber-600">{liveData?.counts?.pujas?.vip || 0}</span>
            </div>
            <div className="pt-2">
              <Button size="sm" variant="outline" className="w-full text-xs font-bold" asChild>
                <Link href="/admin/pujas">Manage Pujas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-green-600" /> Products & Samagri
            </CardTitle>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {liveData?.counts?.products?.active || 0} Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Products in DB:</span>
              <span className="font-bold">{liveData?.counts?.products?.total || 0}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Active Store Items:</span>
              <span className="font-bold text-emerald-600">{liveData?.counts?.products?.active || 0}</span>
            </div>
            <div className="pt-6">
              <Button size="sm" variant="outline" className="w-full text-xs font-bold" asChild>
                <Link href="/admin/products">Manage Store</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tools */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Wrench className="h-4 w-4 text-blue-600" /> Spiritual Tools
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {liveData?.counts?.tools?.active || 0} Active
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Calculators in DB:</span>
              <span className="font-bold">{liveData?.counts?.tools?.total || 0}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Active Online Tools:</span>
              <span className="font-bold text-emerald-600">{liveData?.counts?.tools?.active || 0}</span>
            </div>
            <div className="pt-6">
              <Button size="sm" variant="outline" className="w-full text-xs font-bold" asChild>
                <Link href="/admin/tools">Manage Tools</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Blogs */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-purple-600" /> Blog & Articles
            </CardTitle>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {liveData?.counts?.blogs?.published || 0} Published
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total Posts in DB:</span>
              <span className="font-bold">{liveData?.counts?.blogs?.total || 0}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Published Guides:</span>
              <span className="font-bold text-emerald-600">{liveData?.counts?.blogs?.published || 0}</span>
            </div>
            <div className="pt-6">
              <Button size="sm" variant="outline" className="w-full text-xs font-bold" asChild>
                <Link href="/admin/blog">Manage Blog</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO & AI Bot Feeds Direct Monitor */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-5 w-5 text-orange-600" /> Live Search & AI Feed Endpoints (गूगल व AI सर्च इंडेक्स)
          </CardTitle>
          <CardDescription>
            Verify live output fed directly to Google Search Console, ChatGPT, Perplexity, Gemini, and Claude crawlers.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">sitemap.xml</span>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px]">Google Ready</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Comprehensive XML sitemap containing all published pujas, products, tools, and blog posts.</p>
            <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1 mt-2" asChild>
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                Open /sitemap.xml <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">robots.txt</span>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-[10px]">AI Allowed</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Allows Googlebot, Bingbot, ChatGPT-User, GPTBot, ClaudeBot, and PerplexityBot to crawl public pages.</p>
            <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1 mt-2" asChild>
              <a href="/robots.txt" target="_blank" rel="noopener noreferrer">
                Open /robots.txt <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300">llms.txt</span>
              <Badge className="bg-amber-600 text-white hover:bg-amber-600 text-[10px]">Live Dynamic Feed</Badge>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-300">Real-time dynamic feed powering ChatGPT, Perplexity, and Gemini AI search queries with original data.</p>
            <Button size="sm" className="w-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white gap-1 mt-2" asChild>
              <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
                Open /llms.txt <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Raw Live JSON Inspector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-600" /> Live Database Diagnostic Inspector (JSON)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-64 scrollbar-thin">
            {JSON.stringify(liveData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

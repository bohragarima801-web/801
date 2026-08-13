'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Calendar, RefreshCw, Download, Globe, Shield, Eye, Users, 
  AlertTriangle, Clock, ArrowLeft, BarChart3, TrendingUp, Navigation
} from 'lucide-react'
import Link from 'next/link'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts'

interface AnalyticsStats {
  totalRawRequests: number
  countedUniqueViews: number
  uniqueVisitors: number
  last5Minutes: number
  last30Minutes: number
  todayViews: number
  botRequests: number
  filteredRequests: number
  viewsByPost: Array<{ title: string; slug: string; count: number }>
  viewsByReferrer: Array<{ referrer: string; count: number }>
  viewsByCountry: Array<{ country: string; count: number }>
}

export default function BlogAnalyticsDashboard() {
  const [filter, setFilter] = useState<'today' | '7days' | '30days' | 'custom'>('7days')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [pollingInterval, setPollingInterval] = useState<string>('30') // seconds
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = '/api/admin/analytics/blog?'
      
      if (filter === 'today') {
        const today = new Date()
        today.setUTCHours(0, 0, 0, 0)
        url += `startDate=${today.toISOString()}`
      } else if (filter === '7days') {
        const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        url += `startDate=${past.toISOString()}`
      } else if (filter === '30days') {
        const past = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        url += `startDate=${past.toISOString()}`
      } else if (filter === 'custom') {
        if (startDate) url += `startDate=${new Date(startDate).toISOString()}&`
        if (endDate) url += `endDate=${new Date(endDate).toISOString()}`
      }

      const res = await fetch(url)
      if (!res.ok) {
        if (res.status === 401) throw new Error('Unauthorized')
        throw new Error('Failed to fetch stats')
      }
      
      const body = await res.json()
      if (body.ok && body.data) {
        setStats(body.data)
        setLastUpdated(new Date())
        setError(null)
      } else {
        throw new Error(body.error || 'Server error')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Effect for fetching and polling
  useEffect(() => {
    fetchData()
    if (pollingInterval === 'manual') return
    
    const interval = setInterval(fetchData, Number(pollingInterval) * 1000)
    return () => clearInterval(interval)
  }, [filter, startDate, endDate, pollingInterval])

  const handleExport = () => {
    let url = `/api/admin/analytics/blog?export=true`
    if (filter === 'today') {
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)
      url += `&startDate=${today.toISOString()}`
    } else if (filter === '7days') {
      const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      url += `&startDate=${past.toISOString()}`
    } else if (filter === '30days') {
      const past = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      url += `&startDate=${past.toISOString()}`
    } else if (filter === 'custom') {
      if (startDate) url += `&startDate=${new Date(startDate).toISOString()}`
      if (endDate) url += `&endDate=${new Date(endDate).toISOString()}`
    }
    window.open(url, '_blank')
  }

  // Pre-defined colors for referrer pie chart
  const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280', '#06B6D4', '#EAB308']

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Link href="/admin/blog" className="hover:text-primary flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Blog Management
            </Link>
            <span>/</span>
            <span className="text-foreground">Analytics</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Blog Traffic Analytics</h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Privacy-conscious session-based views, bot filtering, and real-time visitor stats.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Polling Selector */}
          <div className="flex items-center gap-2 bg-background border border-border/80 rounded-xl px-3 py-1.5 shadow-sm text-sm">
            <Clock className="h-4 w-4 text-slate-400" />
            <select
              value={pollingInterval}
              onChange={(e) => setPollingInterval(e.target.value)}
              className="bg-transparent font-semibold focus:outline-none cursor-pointer border-none text-slate-700 dark:text-slate-200 text-xs"
            >
              <option value="15">Auto-refresh 15s</option>
              <option value="30">Auto-refresh 30s</option>
              <option value="60">Auto-refresh 60s</option>
              <option value="manual">Manual Refresh Only</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="rounded-xl border-border/80 h-9 font-semibold text-xs flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleExport}
            className="rounded-xl om-gradient hover:opacity-90 border-none h-9 font-bold text-xs flex items-center gap-1.5 text-white"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Date Filters & Status Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-border/40 p-4 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          {(['today', '7days', '30days', 'custom'] as const).map((t) => (
            <Button
              key={t}
              variant={filter === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(t)}
              className="rounded-xl text-xs font-bold px-4 h-8 capitalize"
            >
              {t === '7days' ? 'Last 7 Days' : t === '30days' ? 'Last 30 Days' : t}
            </Button>
          ))}

          {filter === 'custom' && (
            <div className="flex items-center gap-2 ml-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs rounded-lg max-w-[140px]"
              />
              <span className="text-xs font-semibold text-muted-foreground">to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs rounded-lg max-w-[140px]"
              />
            </div>
          )}
        </div>

        {/* Sync Info */}
        <div className="flex items-center justify-end gap-2 text-xs font-bold text-muted-foreground">
          {lastUpdated && (
            <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
          {error && (
            <span className="text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {error}</span>
          )}
        </div>
      </div>

      {/* Analytics Info Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Page Views (Raw) */}
        <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase text-slate-400 flex items-center justify-between">
              Page Views
              <Eye className="h-4 w-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-black text-slate-800 dark:text-white mt-1">
              {stats?.totalRawRequests ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">
              Every single page load & refresh recorded (raw counts)
            </p>
          </CardContent>
        </Card>

        {/* Counted Unique Views */}
        <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase text-slate-400 flex items-center justify-between">
              Unique Views
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-black text-slate-800 dark:text-white mt-1">
              {stats?.countedUniqueViews ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">
              Daily unique human views (counted in DB, limits to 1/session/day)
            </p>
          </CardContent>
        </Card>

        {/* Unique Visitors */}
        <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase text-slate-400 flex items-center justify-between">
              Unique Visitors
              <Users className="h-4 w-4 text-amber-500" />
            </CardDescription>
            <CardTitle className="text-3xl font-black text-slate-800 dark:text-white mt-1">
              {stats?.uniqueVisitors ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">
              Distinct anonymous sessions browsing your articles
            </p>
          </CardContent>
        </Card>

        {/* Active Visitors (5 Min / 30 Min) */}
        <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-extrabold uppercase text-slate-400 flex items-center justify-between">
              Real-Time Activity
              <Clock className="h-4 w-4 text-purple-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-black text-slate-800 dark:text-white mt-1 flex items-baseline gap-2">
              <span>{stats?.last5Minutes ?? 0}</span>
              <span className="text-xs font-semibold text-muted-foreground">5m</span>
              <span>/</span>
              <span>{stats?.last30Minutes ?? 0}</span>
              <span className="text-xs font-semibold text-muted-foreground">30m</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">
              Active sessions counted in the last 5 and 30 minutes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Bot / Filtered Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Views Today */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-lg">
            {stats?.todayViews ?? 0}
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Unique Views Today</h4>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">Sessions logged today (UTC)</p>
          </div>
        </div>

        {/* Filtered Bot requests */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Bot Requests Blocked</h4>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{stats?.botRequests ?? 0}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Googlebot, Bingbot, crawlers, spiders, curl</p>
          </div>
        </div>

        {/* Filtered Admin/Dev requests */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-border/60 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-500/10 text-slate-600 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Filtered Local / Admin</h4>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{stats?.filteredRequests ?? 0}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Localhost and logged-in admins excluded</p>
          </div>
        </div>
      </div>

      {/* Row 3: Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Posts Bar Chart */}
        <Card className="lg:col-span-2 rounded-3xl border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber-600" /> Top Performing Articles
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              Articles ranked by unique views counted in this time frame.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {stats?.viewsByPost && stats.viewsByPost.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.viewsByPost}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis 
                    dataKey="title" 
                    type="category" 
                    stroke="#888888" 
                    fontSize={10} 
                    tickFormatter={(value) => value.length > 25 ? `${value.substring(0, 25)}…` : value}
                    tickLine={false}
                    axisLine={false}
                    width={150}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    labelClassName="font-extrabold text-xs"
                    itemStyle={{ color: '#D97706', fontSize: '11px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
                No view data recorded for this time range.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Traffic Referrers Pie Chart */}
        <Card className="rounded-3xl border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Navigation className="h-5 w-5 text-emerald-600" /> Top Referrers
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              Traffic origin domain distributions.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex flex-col justify-between">
            {stats?.viewsByReferrer && stats.viewsByReferrer.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.viewsByReferrer}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="referrer"
                      >
                        {stats.viewsByReferrer.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin">
                  {stats.viewsByReferrer.map((entry, index) => (
                    <div key={entry.referrer} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="truncate font-semibold text-slate-700 dark:text-slate-300">{entry.referrer.replace(/^https?:\/\/(?:www\.)?/, '')}</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white shrink-0">{entry.count} views</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
                No referrer details available.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Country Breakdowns & Discrepancies Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Country Breakdown Card */}
        <Card className="rounded-3xl border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" /> Geographic Breakdown
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              Views by country (privacy-safe, server-header geoip).
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64 overflow-y-auto scrollbar-thin">
            {stats?.viewsByCountry && stats.viewsByCountry.length > 0 ? (
              <div className="space-y-3.5 pr-2">
                {stats.viewsByCountry.map((entry) => (
                  <div key={entry.country} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300 font-bold">{entry.country}</span>
                      <span className="text-slate-900 dark:text-white font-extrabold">{entry.count} views</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full" 
                        style={{ 
                          width: `${(entry.count / (stats.countedUniqueViews || 1)) * 100}%` 
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
                No geographical data logged.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cross-Check Analytics Guide Card */}
        <Card className="lg:col-span-2 rounded-3xl border-border/50 shadow-sm bg-slate-50/50 dark:bg-slate-950/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <Shield className="h-5 w-5 text-indigo-600" /> GA4 & Vercel Cross-Check Reference
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              Why do my dashboard stats differ from GA4 and Vercel Analytics?
            </CardDescription>
          </CardHeader>
          <CardContent className="text-xs space-y-3.5 leading-relaxed font-semibold text-slate-600 dark:text-slate-400">
            <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-r-xl">
              <span className="font-black text-amber-800 dark:text-amber-300 block mb-0.5">⚠️ Essential Rule: Labeling & Estimation</span>
              This database counts <strong>"Counted Unique Views"</strong> (maximum 1 view per session per post per UTC day). It strictly filters bots, crawler requests, local developers, and logged-in administrators.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">📊 Vercel Analytics (Page Views)</span>
                Vercel logs every single asset render/page refresh. If a human refreshes a page 5 times within a minute, Vercel reports 5 views, whereas this database records exactly <strong>1 Unique View</strong>.
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">🇬 Google Analytics 4 (GA4 Active Users)</span>
                GA4 reports estimates based on active usage over time. Furthermore, users running aggressive adblockers or rejecting cookie consent banners are completely missed by GA4 but are safely captured by our server-side anonymized tracker.
              </div>
            </div>

            <div className="pt-2 border-t text-[10px] text-muted-foreground flex items-center justify-between">
              <span>Security Method: Server-side HMAC-SHA256 IP Hashing</span>
              <span>Session Cookie: HttpOnly, Secure, SameSite=Lax</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Wallet, Calendar, Package, Users, Flame, Clock, CheckCircle2, TrendingUp,
  HandCoins, Activity, Zap, BarChart3, ArrowUpRight, Receipt, ShoppingBag,
  Plus, RefreshCw, XCircle, AlertCircle, Star, ArrowRight
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { toast } from 'sonner'

const COLORS = ['#ea580c', '#16a34a', '#2563eb', '#9333ea', '#ca8a04']

function StatCard({ title, value, sub, icon: Icon, iconClass, trend }: any) {
  return (
    <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
          <div className={`p-2 rounded-xl bg-slate-50 ${iconClass}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900">{value}</div>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
        {trend !== undefined && (
          <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            <TrendingUp className="h-3 w-3" />
            {trend >= 0 ? '+' : ''}{trend}% vs last period
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState(30)

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`)
      const json = await res.json()
      if (json.ok) setData(json.data)
      else toast.error('Analytics load failed: ' + json.error)
    } catch (e) {
      toast.error('Could not load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAnalytics() }, [period])

  const quickActions = [
    { label: 'Add Puja', href: '/admin/pujas', icon: Flame },
    { label: 'Add Product', href: '/admin/products', icon: ShoppingBag },
    { label: 'Add Tool', href: '/admin/tools', icon: Star },
    { label: 'Add Coupon', href: '/admin/marketing', icon: Plus },
    { label: 'Send Notif', href: '/admin/notifications', icon: Zap },
  ]

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            🗺 Sanatan Seva Control Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Real-time live overview of transactions, devotees, pujas and inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map(d => (
            <Button
              key={d}
              size="sm"
              variant={period === d ? 'default' : 'outline'}
              onClick={() => setPeriod(d)}
              className="text-xs font-bold"
            >
              {d}D
            </Button>
          ))}
          <Button size="sm" variant="outline" onClick={loadAnalytics} disabled={loading} className="gap-1">
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="rounded-2xl animate-pulse"><CardContent className="p-5 h-24 bg-slate-100 rounded-2xl" /></Card>
          ))}
        </div>
      ) : data ? (
        <>
          {/* Revenue KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={`₹ ${(data.revenue.total).toLocaleString('en-IN')}`}
              sub={`Last ${period} days`}
              icon={Wallet}
              iconClass="text-green-600"
            />
            <StatCard
              title="Avg Order Value"
              value={`₹ ${data.revenue.avgOrderValue.toLocaleString('en-IN')}`}
              sub={`Conversion: ${data.revenue.conversionRate}%`}
              icon={TrendingUp}
              iconClass="text-blue-600"
            />
            <StatCard
              title="Refunds Issued"
              value={`₹ ${(data.revenue.refunded).toLocaleString('en-IN')}`}
              sub="Total refunded amount"
              icon={XCircle}
              iconClass="text-red-500"
            />
            <StatCard
              title="New Customers"
              value={data.users.newThisPeriod}
              sub={`Total: ${data.users.total}`}
              icon={Users}
              iconClass="text-purple-600"
            />
          </div>

          {/* Booking & Order KPIs */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Bookings"
              value={data.bookings.total}
              sub={`Confirmed: ${data.bookings.confirmed}`}
              icon={Calendar}
              iconClass="text-orange-600"
            />
            <StatCard
              title="Pending Bookings"
              value={data.bookings.pending}
              sub={`Cancelled: ${data.bookings.cancelled}`}
              icon={Clock}
              iconClass="text-yellow-600"
            />
            <StatCard
              title="Total Orders"
              value={data.orders.total}
              sub={`Delivered: ${data.orders.completed}`}
              icon={Package}
              iconClass="text-teal-600"
            />
            <StatCard
              title="Payment Success"
              value={`${data.payments.successful}/${data.payments.total}`}
              sub={`Failed: ${data.payments.failed}`}
              icon={CheckCircle2}
              iconClass="text-green-600"
            />
          </div>

          {/* Revenue Chart */}
          {data.revenue.dailyChart?.length > 0 && (
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                  Daily Revenue (Last {period} Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.revenue.dailyChart}>
                      <defs>
                        <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
                      <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
                      <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                      <Area type="monotone" dataKey="amount" stroke="#ea580c" strokeWidth={2} fill="url(#colorAmt)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Pujas + Coupon Usage side by side */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Top Pujas */}
            {data.topPujas?.length > 0 && (
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-600" /> Top Performing Pujas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.topPujas.map((p: any, i: number) => (
                    <div key={p.pujaId} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs font-black flex items-center justify-center">{i + 1}</span>
                        <span className="font-medium text-slate-800 truncate max-w-[160px]">{p.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-slate-900">₹{p.revenue.toLocaleString('en-IN')}</div>
                        <div className="text-xs text-slate-500">{p.bookings} bookings</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Coupon Usage */}
            {data.couponUsage?.length > 0 && (
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <HandCoins className="h-4 w-4 text-yellow-600" /> Active Coupons Used
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.couponUsage.map((c: any) => (
                    <div key={c.code} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">{c.code}</Badge>
                        <span className="text-slate-600 text-xs">
                          {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                        </span>
                      </div>
                      <span className="font-bold text-green-700">{c.usedCount}x used</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Bookings + Recent Orders */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recent Bookings */}
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-600" /> Recent Bookings
                </CardTitle>
                <Link href="/admin/bookings" className="text-xs text-orange-600 font-bold flex items-center gap-1 hover:underline">
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.recentBookings?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No bookings yet</p>
                ) : data.recentBookings?.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{b.customer}</p>
                      <p className="text-[10px] text-slate-500">{b.puja} • {b.bookingNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">₹{Number(b.total).toLocaleString('en-IN')}</p>
                      <Badge
                        variant="outline"
                        className={`text-[9px] mt-0.5 ${
                          b.status === 'CONFIRMED' ? 'border-green-500 text-green-700' :
                          b.status === 'CANCELLED' ? 'border-red-500 text-red-600' :
                          b.status === 'REFUNDED' ? 'border-purple-500 text-purple-700' :
                          'border-yellow-500 text-yellow-700'
                        }`}
                      >
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="rounded-2xl border shadow-sm">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-teal-600" /> Recent Orders
                </CardTitle>
                <Link href="/admin/orders" className="text-xs text-orange-600 font-bold flex items-center gap-1 hover:underline">
                  View All <ArrowRight className="h-3 w-3" />
                </Link>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.recentOrders?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No orders yet</p>
                ) : data.recentOrders?.map((o: any) => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[180px]">{o.customer}</p>
                      <p className="text-[10px] text-slate-500">{o.orderNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">₹{Number(o.total).toLocaleString('en-IN')}</p>
                      <Badge
                        variant="outline"
                        className={`text-[9px] mt-0.5 ${
                          o.status === 'DELIVERED' ? 'border-green-500 text-green-700' :
                          o.status === 'CANCELLED' ? 'border-red-500 text-red-600' :
                          'border-yellow-500 text-yellow-700'
                        }`}
                      >
                        {o.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}

      {/* Quick Actions */}
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500 animate-pulse" /> Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon
              return (
                <Button key={a.href} variant="outline" asChild className="h-auto py-4 flex flex-col gap-2 rounded-2xl hover:bg-orange-50 hover:border-orange-300">
                  <Link href={a.href}>
                    <Icon className="h-5 w-5 text-orange-600" />
                    <span className="text-xs font-bold text-slate-700">{a.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Compass, Clock, CheckCircle2, MessageCircle, Phone,
  User, Calendar, MapPin, Eye, FileText, RefreshCw, Send
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import type { HoroscopeOrderData } from '@/lib/horoscope-orders'

export default function AdminHoroscopeOrdersPage() {
  const [orders, setOrders] = useState<HoroscopeOrderData[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'SENT' | 'COMPLETED'>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<HoroscopeOrderData | null>(null)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/horoscope-orders')
      const json = await res.json()
      if (json?.ok) {
        setOrders(json.data || [])
      }
    } catch {
      toast.error('Failed to load horoscope orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleUpdateStatus = async (id: string, newStatus: HoroscopeOrderData['dispatchStatus']) => {
    try {
      const res = await fetch('/api/admin/horoscope-orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      const json = await res.json()
      if (json?.ok) {
        toast.success(`Status updated to ${newStatus}`)
        loadOrders()
      } else {
        toast.error('Failed to update status')
      }
    } catch {
      toast.error('Error updating status')
    }
  }

  // Open WhatsApp to dispatch PDF report to devotee
  const handleOpenWhatsAppDispatch = (order: HoroscopeOrderData) => {
    let cleanPhone = order.whatsappPhone.replace(/[^\d]/g, '')
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`

    const msg = `हरि ओम् / Namaste ${order.devoteeName}! ॐ

दिव्ययज्ञम् (DivyaYagyam) की ओर से आपकी "${order.reportTitle}" (PDF) वरिष्ठ ज्योतिषाचार्यों द्वारा वैदिक गणना सहित तैयार कर ली गई है।

*यजमान जन्म विवरण:*
• नाम: ${order.devoteeName} (${order.gender})
• जन्म तिथि: ${order.dob}
• जन्म समय: ${order.birthTime}
• जन्म स्थान: ${order.birthPlace}
• भाषा: ${order.language}
${order.specialConcern ? `• प्रश्न/चिंता: ${order.specialConcern}` : ''}

कृपया अपनी संलग्न रिपोर्ट (PDF) डाउनलोड करें। 
भगवान शिव एवं माँ कात्यायनी की कृपा आप और आपके परिवार पर सदा बनी रहे! 🙏`

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    handleUpdateStatus(order.id, 'SENT_ON_WHATSAPP')
  }

  // Filtered orders
  const filtered = orders.filter((o) => {
    if (activeFilter === 'PENDING') return o.dispatchStatus === 'PENDING'
    if (activeFilter === 'SENT') return o.dispatchStatus === 'SENT_ON_WHATSAPP'
    if (activeFilter === 'COMPLETED') return o.dispatchStatus === 'COMPLETED'
    return true
  })

  // KPIs
  const totalOrders = orders.length
  const pendingCount = orders.filter((o) => o.dispatchStatus === 'PENDING').length
  const sentCount = orders.filter((o) => o.dispatchStatus === 'SENT_ON_WHATSAPP' || o.dispatchStatus === 'COMPLETED').length
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.amount : 0), 0)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Compass className="h-6 w-6 text-amber-600" />
            <span>Horoscope Reports Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time queue of all horoscope & birth chart orders for PDF generation and WhatsApp dispatch
          </p>
        </div>

        <Button
          onClick={loadOrders}
          variant="outline"
          size="sm"
          className="gap-2 cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </Button>
      </div>

      {/* ── KPI STATS CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Orders" value={totalOrders} icon={FileText} />
        <KpiCard title="Pending Dispatch" value={pendingCount} icon={Clock} />
        <KpiCard title="Sent on WhatsApp" value={sentCount} icon={CheckCircle2} />
        <KpiCard title="Horoscope Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={Compass} />
      </div>

      {/* ── FILTER TABS ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'ALL', label: `All Orders (${totalOrders})` },
          { id: 'PENDING', label: `Pending Dispatch (${pendingCount})` },
          { id: 'SENT', label: `Sent on WhatsApp (${sentCount})` },
          { id: 'COMPLETED', label: 'Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── ORDERS TABLE ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Compass className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">No orders in this view</h3>
            <p className="text-xs text-slate-400">Any incoming horoscope orders will automatically appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Report Details</th>
                  <th className="py-3.5 px-4">Devotee & Contact</th>
                  <th className="py-3.5 px-4">Birth Details (DOB, Time, Place)</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Dispatch Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Col 1: Report Title & Date */}
                    <td className="py-4 px-4 space-y-1">
                      <div className="font-extrabold text-slate-900 text-sm">
                        {order.reportTitle}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400">
                        <span>₹{order.amount}</span>
                        <span>•</span>
                        <span>Language: <strong className="text-slate-700">{order.language}</strong></span>
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        {new Date(order.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Col 2: Devotee & Contact */}
                    <td className="py-4 px-4 space-y-1">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>{order.devoteeName}</span>
                        <span className="text-[10px] text-slate-400">({order.gender})</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-600 font-mono text-xs">
                        <Phone className="h-3 w-3 text-emerald-600" />
                        <span>{order.whatsappPhone}</span>
                      </div>
                      {order.email && (
                        <div className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {order.email}
                        </div>
                      )}
                    </td>

                    {/* Col 3: Birth Details */}
                    <td className="py-4 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <Calendar className="h-3.5 w-3.5 text-amber-600" />
                        <span>DOB: {order.dob}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>Time: {order.birthTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="truncate max-w-[160px]">{order.birthPlace}</span>
                      </div>
                      {order.specialConcern && (
                        <div className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-md border border-amber-200 mt-1 max-w-[200px] line-clamp-2">
                          <strong>Note:</strong> {order.specialConcern}
                        </div>
                      )}
                    </td>

                    {/* Col 4: Payment Status */}
                    <td className="py-4 px-4">
                      {order.paymentStatus === 'PAID' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> PAID (₹{order.amount})
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                          {order.paymentStatus}
                        </span>
                      )}
                      {order.paymentId && (
                        <span className="block text-[10px] text-slate-400 font-mono mt-1">
                          Ref: {order.paymentId.slice(-8)}
                        </span>
                      )}
                    </td>

                    {/* Col 5: Dispatch Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                        order.dispatchStatus === 'PENDING'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : order.dispatchStatus === 'SENT_ON_WHATSAPP'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {order.dispatchStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Col 6: Direct Actions */}
                    <td className="py-4 px-4 text-right space-y-1.5">
                      {/* Send via WhatsApp Button */}
                      <Button
                        onClick={() => handleOpenWhatsAppDispatch(order)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 px-3 rounded-lg flex items-center gap-1.5 shadow-2xs ml-auto cursor-pointer"
                      >
                        <MessageCircle className="h-3.5 w-3.5 fill-white" />
                        <span>Send PDF on WhatsApp</span>
                      </Button>

                      <div className="flex items-center justify-end gap-1.5 pt-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline"
                        >
                          View Details
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => handleUpdateStatus(order.id, order.dispatchStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED')}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 underline"
                        >
                          {order.dispatchStatus === 'COMPLETED' ? 'Mark Pending' : 'Mark Done'}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ORDER DETAILS MODAL ── */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-lg bg-white p-6 rounded-3xl">
          <DialogHeader className="space-y-1 text-left">
            <span className="text-xs font-bold text-amber-600 uppercase">Horoscope Order Details</span>
            <DialogTitle className="text-lg font-black text-slate-900">
              {selectedOrder?.reportTitle}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Order ID: {selectedOrder?.id} • Created: {selectedOrder?.createdAt}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 pt-2 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  Devotee & Contact Information
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Name:</strong> {selectedOrder.devoteeName}</div>
                  <div><strong>Gender:</strong> {selectedOrder.gender}</div>
                  <div><strong>WhatsApp:</strong> {selectedOrder.whatsappPhone}</div>
                  <div><strong>Language:</strong> {selectedOrder.language}</div>
                  {selectedOrder.email && <div className="col-span-2"><strong>Email:</strong> {selectedOrder.email}</div>}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  Birth Chart Calculation Data
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div><strong>Date of Birth:</strong> {selectedOrder.dob}</div>
                  <div><strong>Time of Birth:</strong> {selectedOrder.birthTime}</div>
                  <div className="col-span-2"><strong>Place of Birth:</strong> {selectedOrder.birthPlace}</div>
                </div>
                {selectedOrder.specialConcern && (
                  <div className="pt-1">
                    <strong>Special Concern / Question:</strong>
                    <p className="bg-white p-2 rounded-lg border border-slate-200 mt-1 text-slate-800">
                      {selectedOrder.specialConcern}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleOpenWhatsAppDispatch(selectedOrder)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2"
                >
                  <MessageCircle className="h-4 w-4 fill-white" />
                  <span>Send PDF on WhatsApp</span>
                </Button>
                <Button
                  onClick={() => setSelectedOrder(null)}
                  variant="outline"
                  className="rounded-xl"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}

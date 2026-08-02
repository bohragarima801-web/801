'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Ticket, Clock, CheckCircle2, XCircle, Loader2, Trash2,
  RefreshCw, RotateCcw, Calendar, IndianRupee, FileText
} from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'

function BookingsManager() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'all'

  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refunding, setRefunding] = useState<string | null>(null)

  async function loadBookings() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/bookings')
      const data = await res.json()
      if (data.ok) {
        setBookings(data.data || [])
      }
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
    const interval = setInterval(loadBookings, 10000)
    return () => clearInterval(interval)
  }, [])

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.ok) {
        toast.success('Booking deleted')
        loadBookings()
      } else {
        toast.error(data.error || 'Failed to delete booking')
      }
    } catch {
      toast.error('Network error deleting booking')
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`Status updated to ${status}`)
        loadBookings()
      } else {
        toast.error(data.error || 'Failed to update status')
      }
    } catch {
      toast.error('Network error updating booking')
    }
  }

  async function handleRefund(id: string, bookingNumber: string) {
    setRefunding(id)
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'booking',
          id,
          reason: `Admin initiated refund for booking ${bookingNumber}`
        })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`Refund initiated: ₹${data.refundAmount}`)
        loadBookings()
      } else if (res.status === 207) {
        // Partial success - DB updated but Razorpay failed
        toast.warning(data.error || 'DB updated but Razorpay refund needs manual action')
        loadBookings()
      } else {
        toast.error(data.error || 'Refund failed')
      }
    } catch {
      toast.error('Network error during refund')
    } finally {
      setRefunding(null)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    const status = (b.status || '').toUpperCase()
    if (activeTab === 'pending') return status === 'PENDING'
    if (activeTab === 'confirmed') return status === 'CONFIRMED'
    if (activeTab === 'completed') return status === 'COMPLETED'
    if (activeTab === 'cancelled') return status === 'CANCELLED'
    if (activeTab === 'refunds') return b.paymentStatus === 'REFUNDED' || status === 'REFUNDED'
    return true
  })

  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Refunds', value: 'refunds' }
  ]

  const statusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-300'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-300'
      case 'REFUNDED': return 'bg-purple-100 text-purple-800 border-purple-300'
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  }

  const payStatusColor = (ps: string) => {
    switch (ps?.toUpperCase()) {
      case 'SUCCESS': return 'bg-green-100 text-green-800'
      case 'FAILED': return 'bg-red-100 text-red-700'
      case 'REFUNDED': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings (पूजा बुकिंग्स)"
        description="Manage all devotee puja bookings — confirm, complete, cancel, and refund."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Bookings' }]}
        action={
          <Button variant="outline" size="sm" onClick={loadBookings} disabled={loading} className="gap-1">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total" value={bookings.length.toString()} icon={Ticket} />
        <KpiCard title="Pending" value={bookings.filter(b => b.status?.toUpperCase() === 'PENDING').length.toString()} icon={Clock} iconClass="text-orange-500" />
        <KpiCard title="Confirmed" value={bookings.filter(b => b.status?.toUpperCase() === 'CONFIRMED').length.toString()} icon={CheckCircle2} iconClass="text-blue-500" />
        <KpiCard title="Completed" value={bookings.filter(b => b.status?.toUpperCase() === 'COMPLETED').length.toString()} icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Refunded" value={bookings.filter(b => b.status?.toUpperCase() === 'REFUNDED' || b.paymentStatus === 'REFUNDED').length.toString()} icon={RotateCcw} iconClass="text-purple-500" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b pb-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => router.push(`/admin/bookings?tab=${t.value}`)}
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
            {
              key: 'bookingNumber', label: 'Booking #',
              render: (r) => <span className="font-mono text-xs font-bold text-orange-700">{r.bookingNumber}</span>
            },
            {
              key: 'customer', label: 'Devotee',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-bold">{r.user?.fullName || 'Guest User'}</span>
                  <span className="text-[10px] text-muted-foreground">{r.user?.email}</span>
                  {r.user?.phone && <span className="text-[10px] text-slate-500">{r.user.phone}</span>}
                  {r.gotra && <span className="text-[10px] text-orange-600 font-semibold">Gotra: {r.gotra}</span>}
                </div>
              )
            },
            {
              key: 'puja', label: 'Puja',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-bold max-w-[140px] truncate">{r.puja?.name || 'Unknown'}</span>
                  {r.temple?.name && <span className="text-[10px] text-muted-foreground">{r.temple.name}</span>}
                  {r.memberCount > 1 && <span className="text-[10px] text-blue-600">{r.memberCount} members</span>}
                </div>
              )
            },
            {
              key: 'sankalpPurpose', label: 'Sankalp Purpose (उद्देश्य)',
              render: (r) => (
                <div className="flex flex-col text-xs max-w-[200px]">
                  <span className="font-bold text-indigo-950 bg-indigo-50/80 p-1.5 rounded border border-indigo-100 text-[11px] leading-snug line-clamp-3">
                    {r.sankalpPurpose || r.sankalpText || '—'}
                  </span>
                  {r.specialInstructions && (
                    <span className="text-[9px] text-slate-500 line-clamp-1 mt-0.5">{r.specialInstructions}</span>
                  )}
                </div>
              )
            },
            {
              key: 'total', label: 'Amount',
              render: (r) => (
                <div className="text-right">
                  <span className="font-bold text-sm">₹{Number(r.total).toLocaleString('en-IN')}</span>
                  <div className={`text-[9px] px-1 py-0.5 rounded mt-0.5 inline-block ${payStatusColor(r.paymentStatus)}`}>
                    {r.paymentStatus}
                  </div>
                </div>
              )
            },
            {
              key: 'status', label: 'Status',
              render: (r) => (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(r.status)}`}>
                  {r.status}
                </span>
              )
            },
            {
              key: 'scheduledAt', label: 'Scheduled',
              render: (r) => (
                <span className="text-xs text-slate-500">
                  {r.scheduledAt ? new Date(r.scheduledAt).toLocaleDateString('en-IN') : '—'}
                </span>
              )
            },
            {
              key: 'actions', label: 'Actions',
              render: (r) => (
                <div className="flex items-center gap-1 justify-end flex-wrap">
                  {r.status === 'PENDING' && (
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 h-7 text-[10px]" onClick={() => updateStatus(r.id, 'CONFIRMED')}>
                      Confirm
                    </Button>
                  )}
                  {r.status === 'CONFIRMED' && (
                    <Button size="sm" variant="outline" className="text-green-600 border-green-300 h-7 text-[10px]" onClick={() => updateStatus(r.id, 'COMPLETED')}>
                      Complete
                    </Button>
                  )}
                  {(r.status === 'CONFIRMED' || r.status === 'PENDING') && (
                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 h-7 text-[10px]" onClick={() => updateStatus(r.id, 'CANCELLED')}>
                      Cancel
                    </Button>
                  )}
                  {/* Refund button — show for confirmed/cancelled with successful payment */}
                  {r.paymentStatus === 'SUCCESS' && r.status !== 'REFUNDED' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-purple-700 border-purple-300 h-7 text-[10px]"
                          disabled={refunding === r.id}
                        >
                          {refunding === r.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                          Refund
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Initiate Refund</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will refund ₹{Number(r.total).toLocaleString('en-IN')} for booking <strong>{r.bookingNumber}</strong> to {r.user?.fullName || 'the customer'} via Razorpay. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => handleRefund(r.id, r.bookingNumber)}
                          >
                            Confirm Refund ₹{Number(r.total).toLocaleString('en-IN')}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  <Button size="sm" variant="outline" className="text-slate-700 border-slate-300 h-7 text-[10px] gap-1" asChild>
                    <a href={`/api/invoice/booking/${r.id}`} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-3 w-3 text-purple-600" /> Receipt
                    </a>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )
            }
          ]}
          rows={filteredBookings}
          searchPlaceholder="Search bookings by number, name, puja..."
        />
      )}
    </div>
  )
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-orange-600" /></div>}>
      <BookingsManager />
    </Suspense>
  )
}

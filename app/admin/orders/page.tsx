'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Clock, Truck, CheckCircle2, XCircle, Loader2, Trash2, RotateCcw, FileText, Phone, MapPin, Eye } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'

function OrdersManager() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'all'

  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refunding, setRefunding] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)

  async function loadOrders() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.ok) {
        setOrders(data.data || [])
      }
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.ok) {
        toast.success('Order deleted successfully')
        loadOrders()
      } else {
        toast.error(data.error || 'Failed to delete order')
      }
    } catch {
      toast.error('Network error deleting order')
    }
  }

  async function handleRefund(id: string, orderNumber: string, total: number) {
    setRefunding(id)
    try {
      const res = await fetch('/api/admin/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'order', id, reason: `Admin refund for order ${orderNumber}` })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`Refund of ₹${data.refundAmount} initiated!`)
        loadOrders()
      } else if (res.status === 207) {
        toast.warning(data.error || 'DB updated but Razorpay refund needs manual action')
        loadOrders()
      } else {
        toast.error(data.error || 'Refund failed')
      }
    } catch {
      toast.error('Network error during refund')
    } finally {
      setRefunding(null)
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`Order status updated to ${status}`)
        loadOrders()
      } else {
        toast.error(data.error || 'Failed to update status')
      }
    } catch {
      toast.error('Network error updating order')
    }
  }

  const filteredOrders = orders.filter((o) => {
    const status = (o.status || '').toUpperCase()
    if (activeTab === 'pending') return status === 'PENDING'
    if (activeTab === 'confirmed') return status === 'CONFIRMED'
    if (activeTab === 'processing') return status === 'PROCESSING'
    if (activeTab === 'shipped') return status === 'SHIPPED'
    if (activeTab === 'delivered') return status === 'DELIVERED'
    if (activeTab === 'cancelled') return status === 'CANCELLED'
    if (activeTab === 'cod') return o.isCod || o.paymentMethod === 'COD'
    if (activeTab === 'refunds') return o.paymentStatus === 'REFUNDED'
    return true
  })

  const tabs = [
    { label: 'All Orders', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed (COD/Paid)', value: 'confirmed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'COD Orders', value: 'cod' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Refunds', value: 'refunds' }
  ]

  const changeTab = (val: string) => {
    router.push(`/admin/orders?tab=${val}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders Dispatch & Management (ऑर्डर प्रेषण व्यवस्था)"
        description="Track customer delivery addresses, contact numbers, order items, and payment mode for dispatch."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total Orders" value={orders.length.toString()} icon={Package} />
        <KpiCard title="Confirmed" value={orders.filter(o => o.status?.toUpperCase() === 'CONFIRMED').length.toString()} icon={Clock} iconClass="text-amber-600" />
        <KpiCard title="Processing" value={orders.filter(o => o.status?.toUpperCase() === 'PROCESSING').length.toString()} icon={Truck} iconClass="text-blue-500" />
        <KpiCard title="Delivered" value={orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length.toString()} icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="COD Orders" value={orders.filter(o => o.isCod || o.paymentMethod === 'COD').length.toString()} icon={Package} iconClass="text-purple-600" />
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
            {
              key: 'orderNumber',
              label: 'Order # & Date',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-black text-orange-800">{r.orderNumber}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              )
            },
            {
              key: 'customer',
              label: 'Customer & Contact',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-slate-900">{r.shippingAddress?.fullName || r.user?.fullName || 'Guest'}</span>
                  {r.shippingAddress?.phone && (
                    <a href={`tel:${r.shippingAddress.phone}`} className="text-blue-600 text-[11px] font-mono flex items-center gap-1 hover:underline">
                      <Phone className="h-3 w-3" /> {r.shippingAddress.phone}
                    </a>
                  )}
                  <span className="text-[10px] text-slate-500">{r.shippingAddress?.city ? `${r.shippingAddress.city}, ${r.shippingAddress.state} - ${r.shippingAddress.pincode}` : r.user?.email}</span>
                </div>
              )
            },
            {
              key: 'items',
              label: 'Ordered Items',
              render: (r) => (
                <div className="flex flex-col text-xs max-w-[200px]">
                  {r.items?.map((item: any, idx: number) => (
                    <span key={idx} className="truncate text-slate-700 font-medium">
                      • {item.name} <strong className="text-slate-900">({item.quantity}x)</strong>
                    </span>
                  ))}
                </div>
              )
            },
            {
              key: 'payment',
              label: 'Payment & Mode',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-black text-slate-900">₹{Number(r.total).toLocaleString('en-IN')}</span>
                  {r.isCod || r.paymentMethod === 'COD' ? (
                    <span className="inline-block bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black px-1.5 py-0.5 rounded w-fit mt-0.5">
                      📦 COD (Collect ₹{Number(r.total)})
                    </span>
                  ) : (
                    <span className="inline-block bg-emerald-100 border border-emerald-300 text-emerald-900 text-[10px] font-black px-1.5 py-0.5 rounded w-fit mt-0.5">
                      ✅ Paid Online
                    </span>
                  )}
                </div>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <Badge variant={r.status === 'DELIVERED' ? 'success' : r.status === 'CONFIRMED' ? 'secondary' : 'default'}>
                  {r.status}
                </Badge>
              )
            },
            {
              key: 'actions',
              label: 'Dispatch Actions',
              render: (r) => (
                <div className="flex items-center gap-1 justify-end flex-wrap">
                  <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-slate-700" onClick={() => setSelectedOrder(r)}>
                    <Eye className="h-3 w-3" /> View
                  </Button>
                  {(r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                    <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 h-7 text-[10px]" onClick={() => updateStatus(r.id, 'PROCESSING')}>
                      Process
                    </Button>
                  )}
                  {r.status === 'PROCESSING' && (
                    <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 h-7 text-[10px]" onClick={() => updateStatus(r.id, 'SHIPPED')}>
                      Ship
                    </Button>
                  )}
                  {r.status === 'SHIPPED' && (
                    <Button size="sm" variant="outline" className="text-green-600 border-green-300 h-7 text-[10px]" onClick={() => updateStatus(r.id, 'DELIVERED')}>
                      Deliver
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-slate-700 border-slate-300 h-7 text-[10px] gap-1" asChild>
                    <a href={`/api/invoice/order/${r.id}`} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-3 w-3 text-orange-600" /> Invoice
                    </a>
                  </Button>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )
            }
          ]}
          rows={filteredOrders}
          searchPlaceholder="Search order #, customer name, phone, city..."
        />
      )}

      {/* FULL ORDER DETAILS MODAL */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-orange-950 flex items-center justify-between">
                <span>Order #{selectedOrder.orderNumber}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${selectedOrder.isCod ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'}`}>
                  {selectedOrder.isCod ? '📦 Cash on Delivery (COD)' : '✅ Online Paid'}
                </span>
              </DialogTitle>
              <DialogDescription>
                Customer Shipping & Order Verification for Dispatch
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs text-slate-800">
              {/* Customer Shipping Address */}
              <div className="p-3.5 rounded-xl bg-orange-50/60 border border-orange-200 space-y-1">
                <p className="font-black text-orange-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-orange-600" /> Shipping & Contact Details
                </p>
                <p className="font-bold text-sm text-slate-900">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.fullName || 'N/A'}</p>
                {selectedOrder.shippingAddress?.phone && (
                  <p className="font-mono font-bold text-blue-700 text-xs">
                    📞 Phone: <a href={`tel:${selectedOrder.shippingAddress.phone}`} className="underline">{selectedOrder.shippingAddress.phone}</a>
                  </p>
                )}
                {selectedOrder.shippingAddress ? (
                  <p className="text-slate-700 leading-relaxed">
                    {selectedOrder.shippingAddress.line1} {selectedOrder.shippingAddress.line2}<br />
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - <strong>{selectedOrder.shippingAddress.pincode}</strong>
                  </p>
                ) : (
                  <p className="text-slate-500 italic">No shipping address recorded</p>
                )}
              </div>

              {/* Items List */}
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-3 py-1.5 font-black text-[10px] uppercase text-slate-700">
                  Ordered Items ({selectedOrder.items?.length || 0})
                </div>
                <div className="divide-y divide-slate-100">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between p-2.5">
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-slate-500">₹{Number(item.price)} × {item.quantity}</p>
                      </div>
                      <p className="font-black text-orange-800">₹{Number(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Summary */}
              <div className="p-3 rounded-xl bg-slate-50 border space-y-1">
                <div className="flex justify-between"><span>Subtotal:</span><span>₹{selectedOrder.subtotal}</span></div>
                {selectedOrder.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount:</span><span>-₹{selectedOrder.discount}</span></div>}
                <div className="flex justify-between"><span>Delivery:</span><span>{selectedOrder.shipping > 0 ? `₹${selectedOrder.shipping}` : 'FREE'}</span></div>
                <div className="border-t pt-1 flex justify-between font-black text-sm text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-orange-700">₹{selectedOrder.total}</span>
                </div>
              </div>

              {/* Status Update Quick Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant={selectedOrder.status === 'PROCESSING' ? 'default' : 'outline'} onClick={() => { updateStatus(selectedOrder.id, 'PROCESSING'); setSelectedOrder(null); }}>
                  Set Processing
                </Button>
                <Button size="sm" variant={selectedOrder.status === 'SHIPPED' ? 'default' : 'outline'} className="text-orange-700 border-orange-300" onClick={() => { updateStatus(selectedOrder.id, 'SHIPPED'); setSelectedOrder(null); }}>
                  Set Shipped
                </Button>
                <Button size="sm" variant={selectedOrder.status === 'DELIVERED' ? 'default' : 'outline'} className="text-green-700 border-green-300" onClick={() => { updateStatus(selectedOrder.id, 'DELIVERED'); setSelectedOrder(null); }}>
                  Set Delivered
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    }>
      <OrdersManager />
    </Suspense>
  )
}

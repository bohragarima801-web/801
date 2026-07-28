import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wallet, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

function statusBadge(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    SUCCESS:    { label: '✅ Success',    color: 'bg-green-100 text-green-800 border-green-200' },
    PENDING:    { label: '⏳ Pending',    color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    FAILED:     { label: '❌ Failed',     color: 'bg-red-100 text-red-800 border-red-200' },
    REFUNDED:   { label: '↩️ Refunded',  color: 'bg-blue-100 text-blue-800 border-blue-200' },
    PROCESSING: { label: '🔄 Processing', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  }
  const s = map[status] || { label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' }
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.color}`}>
      {s.label}
    </span>
  )
}

function paymentType(payment: any) {
  const meta = payment.metadata as any || {}
  if (payment.bookingId || meta.paymentType === 'puja_booking') return '📿 Puja Booking'
  if (payment.orderId || meta.paymentType === 'product_order') return '🛒 Product Order'
  if (meta.paymentType === 'bhaktiSeva') return '🪔 BhaktiSeva'
  if (meta.paymentType === 'donation') return '💰 Donation'
  if (meta.paymentType === 'astro') return '⭐ Astrology'
  return '💳 Payment'
}

export default async function PaymentsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    include: {
      order: { select: { orderNumber: true } },
      booking: { select: { bookingNumber: true, puja: { select: { name: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payment History</h1>
        <p className="text-muted-foreground text-sm">View all your transactions and payment records.</p>
      </div>

      {payments.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Wallet className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-semibold text-lg">No Payments Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-6">
            No transactions found for your account. Start by booking a puja or ordering a product.
          </p>
          <Link
            href="/pujas"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Browse Pujas
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
                  {/* Left: Type + Reference */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-slate-800">{paymentType(payment)}</span>
                      {statusBadge(payment.status)}
                    </div>
                    {/* Reference number */}
                    {payment.order?.orderNumber && (
                      <p className="text-xs text-muted-foreground">
                        Order: <span className="font-mono font-medium text-orange-600">{payment.order.orderNumber}</span>
                      </p>
                    )}
                    {payment.booking?.bookingNumber && (
                      <p className="text-xs text-muted-foreground">
                        Booking: <span className="font-mono font-medium text-orange-600">{payment.booking.bookingNumber}</span>
                        {payment.booking.puja?.name && (
                          <span className="text-slate-500"> · {payment.booking.puja.name}</span>
                        )}
                      </p>
                    )}
                    {/* Gateway reference */}
                    {payment.gatewayRef && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Payment ID: <span className="font-mono text-slate-600">{payment.gatewayRef}</span>
                      </p>
                    )}
                    {/* Date */}
                    <p className="text-xs text-muted-foreground mt-1">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                        : new Date(payment.createdAt).toLocaleString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Right: Amount */}
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-slate-900">
                      ₹{Number(payment.amount).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-muted-foreground">{payment.currency || 'INR'} · {payment.gateway || 'Razorpay'}</p>
                  </div>
                </div>

                {/* Bottom link bar */}
                <div className="border-t bg-slate-50 px-5 py-2 flex gap-4 text-xs">
                  {payment.orderId && (
                    <Link href="/dashboard/orders" className="text-orange-600 hover:underline font-medium">
                      View Order →
                    </Link>
                  )}
                  {payment.bookingId && (
                    <Link href="/dashboard/bookings" className="text-orange-600 hover:underline font-medium">
                      View Booking →
                    </Link>
                  )}
                  <Link href="/dashboard/support" className="text-slate-500 hover:underline ml-auto">
                    Need Help?
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

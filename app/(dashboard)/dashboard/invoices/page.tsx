import { FileText, Download, ExternalLink } from 'lucide-react'
import { RealtimeRefresher } from '@/components/realtime-refresher'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

async function resolveDbUserId(user: { id: string; email: string; supabaseId?: string | null }) {
  let dbUserId = user.id
  if (!dbUserId || dbUserId === 'admin-system-id' || dbUserId.length > 36) {
    const dbUser = await prisma.user.findFirst({
      where: { OR: [{ email: user.email }, { supabaseId: user.supabaseId ?? '' }] }
    }).catch(() => null)
    if (dbUser) dbUserId = dbUser.id
  }
  return dbUserId
}

export default async function InvoicesPage() {
  const user = await getCurrentUser()
  if (!user?.id) return null

  const dbUserId = await resolveDbUserId(user)

  const [bookings, orders, payments] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: dbUserId },
      include: { puja: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.findMany({
      where: { userId: dbUserId },
      include: {
        items: { take: 3, select: { name: true } },
        payments: { select: { gatewayRef: true }, orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.payment.findMany({
      where: { 
        userId: dbUserId,
        orderId: null,
        bookingId: null,
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  const allTx = [
    ...bookings.map(b => ({
      id: b.id,
      number: b.bookingNumber,
      title: b.puja?.name || 'Custom Puja',
      subtitle: `Puja Booking · ${b.memberCount || 1} member${(b.memberCount || 1) > 1 ? 's' : ''}`,
      date: b.createdAt,
      amount: b.total,
      status: b.paymentStatus,
      type: 'BOOKING' as const,
      icon: '📿',
      invoiceUrl: `/api/invoice/booking/${b.id}`,
      paymentRef: null as string | null,
    })),
    ...orders.map(o => {
      const cleanItems = o.items.map(i => (!i.name || i.name === 'Unknown Item') ? '🪔 Sacred Puja Booking / Item' : i.name)
      const firstItem = cleanItems[0] || 'Spiritual Purchase'
      const isPujaOrder = o.items.some(i => i.name.includes('Puja') || i.name.includes('🪔') || i.name.includes('Dakshina')) || (o.notes && o.notes.includes('[Sankalp]'))
      return {
        id: o.id,
        number: o.orderNumber,
        title: isPujaOrder ? (firstItem.startsWith('🪔') || firstItem.startsWith('🙏') ? firstItem : `🪔 ${firstItem}`) : firstItem,
        subtitle: cleanItems.join(', '),
        date: o.createdAt,
        amount: o.total,
        status: o.paymentStatus,
        type: 'ORDER' as const,
        icon: isPujaOrder ? '📿' : '📦',
        invoiceUrl: `/api/invoice/order/${o.id}`,
        paymentRef: o.payments[0]?.gatewayRef || null,
      }
    }),
    ...payments.map(p => {
      const meta = p.metadata as Record<string, any> | null
      const isTool = meta?.paymentType === 'tool_access'
      const isBhaktiSeva = meta?.paymentType === 'bhaktiSeva'
      return {
        id: p.id,
        number: p.id.slice(0, 8).toUpperCase(),
        title: isTool ? 'Tool Access' : isBhaktiSeva ? 'Bhakti Seva' : 'Payment',
        subtitle: isTool ? 'Digital Tool Access' : isBhaktiSeva ? 'Donation / Seva' : 'Miscellaneous Payment',
        date: p.createdAt,
        amount: p.amount,
        status: p.status,
        type: 'PAYMENT' as const,
        icon: isTool ? '🛠️' : isBhaktiSeva ? '🪔' : '💳',
        invoiceUrl: `/api/invoice/payment/${p.id}`,
        paymentRef: p.gatewayRef || null,
      }
    })
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const totalPaid = allTx
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const pendingCount = allTx.filter(t => t.status === 'PENDING').length

  return (
    <div className="space-y-6">
      <RealtimeRefresher />
      <div>
        <h1 className="text-2xl font-bold">मेरी रसीदें — Invoices</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Download your payment receipts and invoices.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Transactions', value: allTx.length, color: 'text-slate-800' },
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString('en-IN')}`, color: 'text-green-700' },
          { label: 'Pending', value: pendingCount, color: 'text-yellow-700' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Transactions List */}
      {allTx.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 text-lg">No Invoices Yet</h3>
          <p className="text-slate-500 text-sm mt-1">Your receipts will appear here after purchases.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <p className="text-sm font-bold text-slate-700">All Transactions ({allTx.length})</p>
          </div>
          <div className="divide-y divide-slate-100">
            {allTx.map(tx => (
              <div key={tx.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                {/* Left: Details */}
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 text-xl ${tx.type === 'BOOKING' ? 'bg-purple-50' : 'bg-orange-50'}`}>
                    {tx.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{tx.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xs">{tx.subtitle}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-xs font-mono font-medium text-slate-400">#{tx.number}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-400">
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                        tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        tx.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {tx.status === 'SUCCESS' ? '✅ Paid' : tx.status === 'PENDING' ? '⏳ Pending' : tx.status === 'FAILED' ? '❌ Failed' : tx.status}
                      </span>
                    </div>
                    {/* Payment reference */}
                    {tx.paymentRef && (
                      <p className="text-[11px] text-slate-400 font-mono mt-1">Txn: {tx.paymentRef}</p>
                    )}
                  </div>
                </div>

                {/* Right: Amount + Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-lg font-black text-slate-800">₹{Number(tx.amount).toLocaleString('en-IN')}</p>
                  {tx.status === 'SUCCESS' ? (
                    <a
                      href={tx.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  ) : tx.status === 'PENDING' ? (
                    <Link
                      href={`/checkout`}
                      className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors"
                    >
                      Pay Now
                    </Link>
                  ) : null}
                  <a
                    href={tx.invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-orange-600 transition-colors"
                    title="View Invoice"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <p className="text-sm text-blue-700">
          💡 <strong>Invoice Download करने के लिए:</strong> &quot;Download&quot; button दबाएं → नया tab खुलेगा → <kbd className="bg-white border px-1.5 py-0.5 rounded text-xs">Ctrl+P</kbd> → &quot;Save as PDF&quot; चुनें
        </p>
      </div>
    </div>
  )
}

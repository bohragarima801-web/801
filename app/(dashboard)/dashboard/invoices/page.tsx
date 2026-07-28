import { FileText, Download, Clock, CheckCircle, ExternalLink } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
export const dynamic = 'force-dynamic'

export default async function InvoicesPage() {
  const user = await getCurrentUser()
  if (!user?.id) return null

  const [bookings, orders] = await Promise.all([
    prisma.booking.findMany({
      where: { userId: user.id },
      include: { puja: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      include: { items: { take: 3, select: { name: true } } },
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
    })),
    ...orders.map(o => ({
      id: o.id,
      number: o.orderNumber,
      title: `Store Order`,
      subtitle: o.items.map(i => i.name).join(', '),
      date: o.createdAt,
      amount: o.total,
      status: o.paymentStatus,
      type: 'ORDER' as const,
      icon: '📦',
      invoiceUrl: `/api/invoice/order/${o.id}`,
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const totalPaid = allTx
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">मेरी रसीदें — Invoices</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Download your payment receipts and invoices.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Transactions', value: allTx.length, color: 'text-slate-800' },
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString('en-IN')}`, color: 'text-green-700' },
          { label: 'Pending', value: allTx.filter(t => t.status === 'PENDING').length, color: 'text-yellow-700' },
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
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {tx.status === 'SUCCESS' ? '✅ Paid' : tx.status === 'PENDING' ? '⏳ Pending' : tx.status}
                      </span>
                    </div>
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
                      href={`/checkout?retry=${tx.id}`}
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
          💡 <strong>Invoice Download करने के लिए:</strong> "Download" button दबाएं → नया tab खुलेगा → <kbd className="bg-white border px-1.5 py-0.5 rounded text-xs">Ctrl+P</kbd> → "Save as PDF" चुनें
        </p>
      </div>
    </div>
  )
}

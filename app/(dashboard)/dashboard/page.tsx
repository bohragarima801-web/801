import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ShoppingBag, Heart, MessageSquare, Wallet, ArrowRight } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { RealtimeRefresher } from '@/components/realtime-refresher'
export const dynamic = 'force-dynamic'

const statusColors: Record<string, string> = {
  CONFIRMED: 'text-green-600 bg-green-50',
  PROCESSING: 'text-blue-600 bg-blue-50',
  PENDING: 'text-yellow-600 bg-yellow-50',
  SHIPPED: 'text-purple-600 bg-purple-50',
  DELIVERED: 'text-green-700 bg-green-100',
  CANCELLED: 'text-red-600 bg-red-50',
  OPEN: 'text-yellow-600 bg-yellow-50',
  IN_PROGRESS: 'text-blue-600 bg-blue-50',
  RESOLVED: 'text-green-600 bg-green-50',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user?.id) return null

  const [bookingsCount, ordersCount, wishlistCount, ticketsCount, totalPayments, recentBookings, recentOrders, recentTickets, upcomingBookings] = await Promise.all([
    prisma.booking.count({ where: { userId: user.id } }),
    prisma.order.count({ where: { userId: user.id } }),
    prisma.wishlist.count({ where: { userId: user.id } }),
    prisma.supportTicket.count({ where: { userId: user.id } }),
    prisma.payment.aggregate({ where: { userId: user.id, status: 'SUCCESS' }, _sum: { amount: true } }),
    prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 3, include: { puja: { select: { name: true } } } }),
    prisma.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.supportTicket.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 2 }),
    prisma.booking.findMany({
      where: { userId: user.id, scheduledAt: { gte: new Date() } },
      orderBy: { scheduledAt: 'asc' }, take: 2,
      include: { puja: { select: { name: true } } }
    })
  ])

  const totalSpent = Number(totalPayments._sum.amount || 0)

  const activities = [
    ...recentBookings.map(b => ({ type: 'booking', date: b.createdAt, title: `Puja Booked: ${b.puja?.name || 'Custom'}`, status: b.status, link: '/dashboard/bookings', icon: '📿' })),
    ...recentOrders.map(o => ({ type: 'order', date: o.createdAt, title: `Order #${o.orderNumber}`, status: o.status, link: '/dashboard/orders', icon: '📦' })),
    ...recentTickets.map(t => ({ type: 'ticket', date: t.createdAt, title: `Support: ${t.subject}`, status: t.status, link: '/dashboard/support', icon: '🎧' }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)

  return (
    <div className="space-y-6">
      <RealtimeRefresher />

      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold">नमस्ते, {user?.fullName?.split(' ')[0] || 'Devotee'} 🙏</h1>
        <p className="text-muted-foreground text-sm">Welcome to your spiritual dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'My Bookings', value: bookingsCount, icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-50', href: '/dashboard/bookings' },
          { title: 'My Orders', value: ordersCount, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50', href: '/dashboard/orders' },
          { title: 'Wishlist', value: wishlistCount, icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50', href: '/dashboard/wishlist' },
          { title: 'Support Tickets', value: ticketsCount, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50', href: '/dashboard/support' },
        ].map(s => {
          const Icon = s.icon
          return (
            <Link href={s.href} key={s.title}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
                  <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{s.value}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Total Spent Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-medium">Total Amount Spent</p>
            <p className="text-4xl font-black mt-1">₹{totalSpent.toLocaleString('en-IN')}</p>
            <p className="text-orange-100 text-xs mt-1">Across all orders & bookings</p>
          </div>
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Wallet className="h-8 w-8 text-white" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: '🪔 Book a Puja', href: '/pujas', color: 'hover:bg-orange-50 hover:border-orange-300' },
            { label: '🛒 Browse Products', href: '/products', color: 'hover:bg-blue-50 hover:border-blue-300' },
            { label: '🪔 BhaktiSeva', href: '/bhaktiseva', color: 'hover:bg-yellow-50 hover:border-yellow-300' },
            { label: '🎧 Get Support', href: '/dashboard/support', color: 'hover:bg-purple-50 hover:border-purple-300' },
          ].map(action => (
            <Link key={action.href} href={action.href}
              className={`bg-white border border-slate-200 rounded-xl p-4 text-center font-bold text-sm text-slate-700 transition-all flex flex-col items-center gap-1 ${action.color}`}>
              <span className="text-2xl">{action.label.split(' ')[0]}</span>
              <span className="text-xs leading-tight">{action.label.split(' ').slice(1).join(' ')}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">📅 Upcoming Pujas</h2>
              <Link href="/dashboard/bookings" className="text-xs text-orange-600 font-semibold hover:underline">View All →</Link>
            </div>
            <div className="space-y-3">
              {upcomingBookings.map(b => (
                <div key={b.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <span className="text-2xl">🪔</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{b.puja?.name || 'Puja'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Date TBD'}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[b.status] || 'text-slate-600 bg-slate-100'}`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">🕐 Recent Activity</h2>
          </div>
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No activity yet. Start by booking a puja!</p>
          ) : (
            <div className="space-y-3">
              {activities.map((a, i) => (
                <Link href={a.link} key={i} className="flex items-start gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors">
                  <span className="text-lg mt-0.5">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{a.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(a.date).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${statusColors[a.status] || 'text-slate-600 bg-slate-100'}`}>
                    {a.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
          <Link href="/dashboard/payments" className="mt-4 flex items-center justify-center gap-1 text-sm font-semibold text-orange-600 hover:underline">
            View Payment History <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

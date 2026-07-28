import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { Bell, CheckCheck } from 'lucide-react'
import Link from 'next/link'
import { NotificationActions } from './actions'
export const dynamic = 'force-dynamic'

const TYPE_ICONS: Record<string, string> = {
  ORDER:   '📦',
  BOOKING: '📿',
  PAYMENT: '💳',
  PROMO:   '🎁',
  SYSTEM:  '🔔',
  SUPPORT: '🎧',
  GENERAL: '📢',
}

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && <NotificationActions markAll />}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 text-lg">No Notifications Yet</h3>
          <p className="text-slate-500 text-sm mt-1">
            We'll notify you about orders, bookings, and offers here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`bg-white border rounded-xl px-4 py-3.5 flex items-start gap-3 transition-all ${!n.isRead ? 'border-orange-200 bg-orange-50/30' : 'border-slate-200'}`}>
              <span className="text-xl shrink-0 mt-0.5">{TYPE_ICONS[n.type] || '🔔'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                  {!n.isRead && <span className="shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-1.5" />}
                </div>
                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-slate-400">
                    {new Date(n.createdAt).toLocaleString('hi-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {n.link && (
                    <Link href={n.link} className="text-xs font-semibold text-orange-600 hover:underline">
                      View →
                    </Link>
                  )}
                  {!n.isRead && <NotificationActions id={n.id} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

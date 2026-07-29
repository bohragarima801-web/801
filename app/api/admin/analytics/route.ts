import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30' // days
    const days = Math.min(365, Math.max(1, parseInt(period)))
    const since = new Date()
    since.setDate(since.getDate() - days)

    const [
      totalRevenue,
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      refundedBookings,
      totalOrders,
      completedOrders,
      cancelledOrders,
      totalUsers,
      newUsers,
      totalPayments,
      successPayments,
      failedPayments,
      refundedPayments,
      recentBookings,
      recentOrders,
      dailyRevenue,
      topPujas,
      couponStats,
      paymentMethodStats,
    ] = await Promise.all([
      // Revenue from successful payments
      prisma.payment.aggregate({
        where: { status: 'SUCCESS', paidAt: { gte: since } },
        _sum: { amount: true },
      }),

      // Booking counts
      prisma.booking.count({ where: { createdAt: { gte: since } } }),
      prisma.booking.count({ where: { status: 'CONFIRMED', createdAt: { gte: since } } }),
      prisma.booking.count({ where: { status: 'CANCELLED', createdAt: { gte: since } } }),
      prisma.booking.count({ where: { status: 'REFUNDED', createdAt: { gte: since } } }),

      // Order counts
      prisma.order.count({ where: { createdAt: { gte: since } } }),
      prisma.order.count({ where: { status: 'DELIVERED', createdAt: { gte: since } } }),
      prisma.order.count({ where: { status: 'CANCELLED', createdAt: { gte: since } } }),

      // Users
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: since } } }),

      // Payment stats
      prisma.payment.count({ where: { createdAt: { gte: since } } }),
      prisma.payment.count({ where: { status: 'SUCCESS', createdAt: { gte: since } } }),
      prisma.payment.count({ where: { status: 'FAILED', createdAt: { gte: since } } }),
      prisma.payment.aggregate({
        where: { status: 'REFUNDED', createdAt: { gte: since } },
        _sum: { amount: true },
      }),

      // Recent bookings (last 10)
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { fullName: true, email: true } },
          puja: { select: { name: true } },
        },
      }),

      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { fullName: true, email: true } },
          items: { take: 1 },
        },
      }),

      // Daily revenue for chart (last 30 days)
      prisma.payment.findMany({
        where: { status: 'SUCCESS', paidAt: { gte: since } },
        select: { amount: true, paidAt: true },
        orderBy: { paidAt: 'asc' },
      }),

      // Top performing pujas
      prisma.booking.groupBy({
        by: ['pujaId'],
        where: { createdAt: { gte: since }, status: { not: 'CANCELLED' } },
        _count: { pujaId: true },
        _sum: { total: true },
        orderBy: { _count: { pujaId: 'desc' } },
        take: 5,
      }),

      // Coupon usage stats
      prisma.coupon.findMany({
        where: { usedCount: { gt: 0 } },
        select: { code: true, usedCount: true, discountValue: true, discountType: true },
        orderBy: { usedCount: 'desc' },
        take: 10,
      }),

      // Payment method breakdown (from gateway field)
      prisma.payment.groupBy({
        by: ['gateway'],
        where: { status: 'SUCCESS', createdAt: { gte: since } },
        _count: { gateway: true },
        _sum: { amount: true },
      }),
    ])

    // Process daily revenue into chart format
    const revenueByDay: Record<string, number> = {}
    for (let i = 0; i < Math.min(days, 30); i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      revenueByDay[key] = 0
    }
    dailyRevenue.forEach((p) => {
      if (p.paidAt) {
        const key = p.paidAt.toISOString().split('T')[0]
        if (key in revenueByDay) {
          revenueByDay[key] = (revenueByDay[key] || 0) + Number(p.amount)
        }
      }
    })

    const dailyRevenueChart = Object.entries(revenueByDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount: Math.round(amount) }))

    // Resolve top puja names
    const topPujaIds = topPujas.map((t) => t.pujaId)
    const pujaDetails = await prisma.puja.findMany({
      where: { id: { in: topPujaIds } },
      select: { id: true, name: true },
    })
    const pujaMap = Object.fromEntries(pujaDetails.map((p) => [p.id, p.name]))

    const topPujasFormatted = topPujas.map((t) => ({
      pujaId: t.pujaId,
      name: pujaMap[t.pujaId] || 'Unknown',
      bookings: t._count.pujaId,
      revenue: Math.round(Number(t._sum.total) || 0),
    }))

    const conversionRate =
      totalPayments > 0 ? Math.round((successPayments / totalPayments) * 100) : 0

    const avgOrderValue =
      successPayments > 0
        ? Math.round(Number(totalRevenue._sum.amount || 0) / successPayments)
        : 0

    return NextResponse.json({
      ok: true,
      period: days,
      data: {
        revenue: {
          total: Math.round(Number(totalRevenue._sum.amount) || 0),
          refunded: Math.round(Number(refundedPayments._sum.amount) || 0),
          avgOrderValue,
          conversionRate,
          dailyChart: dailyRevenueChart,
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          refunded: refundedBookings,
          pending: totalBookings - confirmedBookings - cancelledBookings - refundedBookings,
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          pending: totalOrders - completedOrders - cancelledOrders,
        },
        users: {
          total: totalUsers,
          newThisPeriod: newUsers,
        },
        payments: {
          total: totalPayments,
          successful: successPayments,
          failed: failedPayments,
          byGateway: paymentMethodStats.map((g) => ({
            gateway: g.gateway,
            count: g._count.gateway,
            revenue: Math.round(Number(g._sum.amount) || 0),
          })),
        },
        topPujas: topPujasFormatted,
        couponUsage: couponStats,
        recentBookings: recentBookings.map((b) => ({
          id: b.id,
          bookingNumber: b.bookingNumber,
          customer: b.user?.fullName || b.user?.email || 'Guest',
          puja: b.puja?.name || 'Unknown',
          total: Number(b.total),
          status: b.status,
          paymentStatus: b.paymentStatus,
          date: b.createdAt,
        })),
        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          customer: o.user?.fullName || o.user?.email || 'Guest',
          total: Number(o.total),
          status: o.status,
          paymentStatus: o.paymentStatus,
          date: o.createdAt,
        })),
      },
    })
  } catch (err: any) {
    console.error('[Analytics API] Error:', err)
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

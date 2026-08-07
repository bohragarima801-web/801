import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// Helper to resolve DB user ID
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

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null)
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const orderParam = searchParams.get('order') || ''
    if (!orderParam) return NextResponse.json({ ok: false, error: 'Order number required' }, { status: 400 })

    const dbUserId = await resolveDbUserId(user)
    const isAdmin = user.role === 'super_admin' || user.role === 'store_manager'

    // Find order by orderNumber or id
    const whereCondition = isAdmin
      ? { OR: [{ id: orderParam }, { orderNumber: orderParam }] }
      : { OR: [{ id: orderParam }, { orderNumber: orderParam }], userId: dbUserId }

    const order = await prisma.order.findFirst({
      where: whereCondition,
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        items: true,
        shippingAddress: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        coupon: { select: { code: true } },
      }
    })

    if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })

    const addr = order.shippingAddress
    const addressStr = addr
      ? [addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')
      : ''

    const payment = order.payments[0]

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        subtotal: Number(order.subtotal),
        discount: Number(order.discount),
        shipping: Number(order.shipping),
        total: Number(order.total),
        items: order.items.map(i => ({
          name: i.name,
          quantity: i.quantity,
          price: Number(i.price),
          total: Number(i.total),
        })),
        customerName: addr?.fullName || order.user?.fullName || '',
        phone: addr?.phone || order.user?.phone || '',
        address: addressStr,
        paymentId: payment?.gatewayRef || payment?.gatewayOrderId || null,
        gateway: payment?.gateway || null,
        couponCode: order.coupon?.code || null,
        notes: order.notes || null,
        createdAt: order.createdAt.toISOString(),
      }
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}

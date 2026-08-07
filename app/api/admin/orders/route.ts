import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(200, parseInt(searchParams.get('limit') || '100'))
    const skip = (page - 1) * limit
    const status = searchParams.get('status')
    const search = searchParams.get('search') || ''

    const where: any = {}
    if (status) where.status = status as any
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { shippingAddress: { phone: { contains: search } } },
        { shippingAddress: { fullName: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { fullName: true, email: true, phone: true } },
          items: true,
          shippingAddress: true,
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { gateway: true, gatewayRef: true, status: true, paidAt: true }
          },
          coupon: { select: { code: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where })
    ])

    const mapped = orders.map(o => {
      const addr = o.shippingAddress
      const payment = o.payments[0]
      const isCod = o.status === 'CONFIRMED' && o.paymentStatus !== 'SUCCESS'
      return {
        id: o.id,
        orderNumber: o.orderNumber,
        user: {
          fullName: addr?.fullName || o.user?.fullName || 'Guest',
          email: o.user?.email || '',
          phone: addr?.phone || o.user?.phone || '',
        },
        shippingAddress: addr ? {
          fullName: addr.fullName,
          phone: addr.phone,
          line1: addr.line1 || '',
          line2: addr.line2 || '',
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          country: addr.country || 'India',
        } : null,
        items: o.items.map(i => ({
          name: i.name,
          quantity: i.quantity,
          price: Number(i.price),
          total: Number(i.total),
        })),
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        shipping: Number(o.shipping),
        total: Number(o.total),
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: payment?.gateway || (isCod ? 'COD' : 'RAZORPAY'),
        paymentRef: payment?.gatewayRef || null,
        paymentGateway: payment?.gateway || null,
        couponCode: o.coupon?.code || null,
        notes: o.notes || null,
        isCod,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      }
    })

    return NextResponse.json({ ok: true, data: mapped, total, page, limit })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'ID required' }, { status: 400 })

    const body = await req.json()
    const { status, trackingNumber, courierName, paymentStatus } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (trackingNumber !== undefined) updateData.notes = body.notes || null

    const order = await prisma.order.update({ where: { id }, data: updateData })
    return NextResponse.json({ ok: true, data: order })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update order' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'ID required' }, { status: 400 })

    // Delete related records first
    await prisma.orderItem.deleteMany({ where: { orderId: id } }).catch(() => {})
    await prisma.payment.deleteMany({ where: { orderId: id } }).catch(() => {})
    await prisma.order.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete order' }, { status: 500 })
  }
}

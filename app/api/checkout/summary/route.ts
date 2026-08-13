import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('order') || searchParams.get('orderNumber') || ''
    const paymentId = searchParams.get('payment') || searchParams.get('paymentId') || ''

    if (!orderNumber && !paymentId) {
      return NextResponse.json({ ok: false, error: 'Order number or payment ID is required' }, { status: 400 })
    }

    // 1. Try finding Order by orderNumber or id
    if (orderNumber) {
      const order = await prisma.order.findFirst({
        where: { OR: [{ orderNumber: orderNumber }, { id: orderNumber }] },
        include: {
          items: true,
          payments: { take: 1, orderBy: { createdAt: 'desc' } },
          shippingAddress: true,
          user: { select: { fullName: true, email: true, phone: true } },
          coupon: { select: { code: true } },
        }
      })

      if (order) {
        const addr = order.shippingAddress
        const addressStr = addr
          ? [addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')
          : ''
        return NextResponse.json({
          ok: true,
          type: 'order',
          orderNumber: order.orderNumber,
          total: Number(order.total),
          subtotal: Number(order.subtotal),
          discount: Number(order.discount),
          shipping: Number(order.shipping),
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt,
          customerName: addr?.fullName || order.user?.fullName || '',
          phone: addr?.phone || order.user?.phone || '',
          address: addressStr,
          couponCode: order.coupon?.code || null,
          items: order.items.map(i => ({
            name: (!i.name || i.name === 'Unknown Item') ? '🪔 Sacred Puja Booking / Item' : i.name,
            quantity: i.quantity,
            price: Number(i.price),
            total: Number(i.total)
          })),
          paymentRef: order.payments[0]?.gatewayRef || paymentId || null,
          gateway: order.payments[0]?.gateway || null,
        })
      }
    }


    // 2. Try finding Booking by bookingNumber or id
    if (orderNumber) {
      const booking = await prisma.booking.findFirst({
        where: { OR: [{ bookingNumber: orderNumber }, { id: orderNumber }] },
        include: { puja: { select: { name: true } }, payments: { take: 1, orderBy: { createdAt: 'desc' } } }
      })

      if (booking) {
        const pujaName = booking.puja?.name || 'Sacred Puja Booking'
        return NextResponse.json({
          ok: true,
          type: 'booking',
          orderNumber: booking.bookingNumber,
          total: Number(booking.total),
          subtotal: Number(booking.subtotal),
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          createdAt: booking.createdAt,
          items: [{
            name: `🪔 ${pujaName}`,
            quantity: booking.memberCount || 1,
            price: Number(booking.total),
            total: Number(booking.total)
          }],
          paymentRef: booking.payments[0]?.gatewayRef || paymentId || null
        })
      }
    }

    // 3. Try finding Payment by gatewayRef or id
    if (paymentId) {
      const payment = await prisma.payment.findFirst({
        where: { OR: [{ id: paymentId }, { gatewayRef: paymentId }, { gatewayOrderId: paymentId }] },
        include: {
          order: { include: { items: true } },
          booking: { include: { puja: { select: { name: true } } } }
        }
      })

      if (payment) {
        if (payment.order) {
          return NextResponse.json({
            ok: true,
            type: 'order',
            orderNumber: payment.order.orderNumber,
            total: Number(payment.order.total),
            subtotal: Number(payment.order.subtotal),
            status: payment.order.status,
            paymentStatus: payment.order.paymentStatus,
            createdAt: payment.order.createdAt,
            items: payment.order.items.map(i => ({
              name: (!i.name || i.name === 'Unknown Item') ? '🪔 Sacred Puja Booking / Item' : i.name,
              quantity: i.quantity,
              price: Number(i.price),
              total: Number(i.total)
            })),
            paymentRef: payment.gatewayRef || paymentId
          })
        }

        if (payment.booking) {
          return NextResponse.json({
            ok: true,
            type: 'booking',
            orderNumber: payment.booking.bookingNumber,
            total: Number(payment.booking.total),
            subtotal: Number(payment.booking.subtotal),
            status: payment.booking.status,
            paymentStatus: payment.booking.paymentStatus,
            createdAt: payment.booking.createdAt,
            items: [{
              name: `🪔 ${payment.booking.puja?.name || 'Sacred Puja Booking'}`,
              quantity: payment.booking.memberCount || 1,
              price: Number(payment.booking.total),
              total: Number(payment.booking.total)
            }],
            paymentRef: payment.gatewayRef || paymentId
          })
        }
      }
    }

    return NextResponse.json({ ok: false, error: 'Order summary not found' }, { status: 404 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch summary' }, { status: 500 })
  }
}

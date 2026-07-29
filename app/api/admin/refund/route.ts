import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { getRazorpay } from '@/lib/razorpay'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { type, id, reason = 'Admin initiated refund', amount } = body
    // type: 'booking' | 'order'
    // id: booking or order id
    // reason: refund reason string
    // amount: optional partial refund amount in rupees

    if (!type || !id) {
      return NextResponse.json({ ok: false, error: 'type and id are required' }, { status: 400 })
    }

    let payment: any = null
    let refundableAmount = 0

    if (type === 'booking') {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: { payments: { where: { status: 'SUCCESS' }, orderBy: { createdAt: 'desc' }, take: 1 } },
      })
      if (!booking) return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })

      payment = booking.payments[0]
      refundableAmount = Number(booking.total)

      if (!payment) {
        // No successful payment found — just update status
        await prisma.booking.update({
          where: { id },
          data: { status: 'CANCELLED', paymentStatus: 'REFUNDED' },
        })
        return NextResponse.json({
          ok: true,
          message: 'Booking cancelled (no payment to refund)',
          refunded: false,
        })
      }
    } else if (type === 'order') {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { payments: { where: { status: 'SUCCESS' }, orderBy: { createdAt: 'desc' }, take: 1 } },
      })
      if (!order) return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })

      payment = order.payments[0]
      refundableAmount = Number(order.total)

      if (!payment) {
        await prisma.order.update({
          where: { id },
          data: { status: 'CANCELLED', paymentStatus: 'REFUNDED' },
        })
        return NextResponse.json({
          ok: true,
          message: 'Order cancelled (no payment to refund)',
          refunded: false,
        })
      }
    } else {
      return NextResponse.json({ ok: false, error: 'Invalid type. Must be booking or order' }, { status: 400 })
    }

    // Determine refund amount
    const refundAmountRupees = amount ? Math.min(Number(amount), refundableAmount) : refundableAmount
    const refundAmountPaise = Math.round(refundAmountRupees * 100)

    // Get the Razorpay payment ID (gatewayRef = razorpay_payment_id)
    const razorpayPaymentId = payment.gatewayRef
    if (!razorpayPaymentId) {
      return NextResponse.json({
        ok: false,
        error: 'Razorpay payment ID not found. Cannot initiate refund automatically. Please refund manually from Razorpay Dashboard.',
      }, { status: 400 })
    }

    // Initiate refund via Razorpay
    let refundResult: any = null
    let razorpayError: string | null = null

    try {
      const razorpay = await getRazorpay()
      refundResult = await (razorpay.payments as any).refund(razorpayPaymentId, {
        amount: refundAmountPaise,
        speed: 'normal',
        notes: { reason, adminEmail: session.email },
        receipt: `refund_${Date.now()}`,
      })
    } catch (rzpErr: any) {
      razorpayError = rzpErr?.error?.description || rzpErr?.message || 'Razorpay refund failed'
      console.error('[Refund API] Razorpay error:', rzpErr)
    }

    // Update DB regardless (mark as refunded)
    if (type === 'booking') {
      await prisma.booking.update({
        where: { id },
        data: {
          status: 'REFUNDED',
          paymentStatus: refundResult ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
        },
      }).catch(() => {})
    } else {
      await prisma.order.update({
        where: { id },
        data: {
          status: 'RETURNED',
          paymentStatus: refundResult ? 'REFUNDED' : 'PARTIALLY_REFUNDED',
        },
      }).catch(() => {})
    }

    // Update payment record
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'REFUNDED',
        metadata: {
          ...(payment.metadata && typeof payment.metadata === 'object' ? payment.metadata as any : {}),
          refundInitiated: true,
          refundId: refundResult?.id || null,
          refundAmount: refundAmountRupees,
          refundReason: reason,
          refundedAt: new Date().toISOString(),
          adminEmail: session.email,
          razorpayError: razorpayError || null,
        },
      },
    }).catch(() => {})

    if (razorpayError && !refundResult) {
      return NextResponse.json({
        ok: false,
        error: `DB updated but Razorpay refund failed: ${razorpayError}. Please refund ₹${refundAmountRupees} manually from Razorpay Dashboard for payment ID: ${razorpayPaymentId}`,
        dbUpdated: true,
        razorpayPaymentId,
        refundAmount: refundAmountRupees,
      }, { status: 207 })
    }

    return NextResponse.json({
      ok: true,
      message: `Refund of ₹${refundAmountRupees} initiated successfully`,
      refundId: refundResult?.id,
      refundAmount: refundAmountRupees,
      razorpayPaymentId,
      status: refundResult?.status || 'initiated',
    })
  } catch (err: any) {
    console.error('[Refund API] Error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Refund failed' }, { status: 500 })
  }
}

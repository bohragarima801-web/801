import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

import { getSetting } from '@/lib/settings'

function cors(res: NextResponse) {
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return res
}

export async function OPTIONS() {
  return cors(new NextResponse(null, { status: 200 }))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      paymentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body || {}

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return cors(NextResponse.json({ ok: false, error: 'Missing verification fields' }, { status: 400 }))
    }

    const secret = await getSetting('secret.razorpay_key_secret', 'RAZORPAY_KEY_SECRET')
    if (!secret) {
      return cors(NextResponse.json({ ok: false, error: 'RAZORPAY_KEY_SECRET not configured' }, { status: 500 }))
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    const isValid = expected === razorpay_signature

    // Best-effort DB update
    try {
      let paymentRecord: any = null
      if (paymentId) {
        paymentRecord = await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: isValid ? 'SUCCESS' : 'FAILED',
            gatewayRef: razorpay_payment_id,
            paidAt: isValid ? new Date() : null,
            metadata: { verified: isValid, razorpay_order_id, razorpay_payment_id, razorpay_signature },
          },
        })
      } else {
        await prisma.payment.updateMany({
          where: { gatewayOrderId: razorpay_order_id },
          data: {
            status: isValid ? 'SUCCESS' : 'FAILED',
            gatewayRef: razorpay_payment_id,
            paidAt: isValid ? new Date() : null,
          },
        })
        paymentRecord = await prisma.payment.findFirst({ where: { gatewayOrderId: razorpay_order_id } })
      }

      // Mirror webhook behavior: also confirm the linked Order/Booking immediately
      if (isValid) {
        const meta = (paymentRecord?.metadata && typeof paymentRecord.metadata === 'object') ? paymentRecord.metadata as any : {}

        // 1st priority: direct DB foreign key column
        // 2nd priority: metadata JSON field
        const linkedOrderId = paymentRecord?.orderId || meta.orderId
        const linkedBookingId = paymentRecord?.bookingId || meta.bookingId

        if (linkedOrderId) {
          await prisma.order.update({
            where: { id: linkedOrderId },
            data: { paymentStatus: 'SUCCESS', status: 'PROCESSING' },
          }).catch(() => {})
        } else {
          // Last resort: find order via Razorpay order ID in payment metadata
          const orderViaGateway = await prisma.order.findFirst({
            where: {
              payments: { some: { gatewayOrderId: razorpay_order_id } }
            }
          }).catch(() => null)
          if (orderViaGateway) {
            await prisma.order.update({
              where: { id: orderViaGateway.id },
              data: { paymentStatus: 'SUCCESS', status: 'PROCESSING' },
            }).catch(() => {})
          }
        }

        if (linkedBookingId) {
          const updatedBk = await prisma.booking.update({
            where: { id: linkedBookingId },
            data: { paymentStatus: 'SUCCESS', status: 'CONFIRMED' },
            include: { puja: true, user: true }
          }).catch(() => null)

          if (updatedBk) {
            const { sendWhatsAppNotification } = await import('@/lib/whatsapp')
            sendWhatsAppNotification({
              type: 'PUJA_CONFIRMED',
              phone: (updatedBk.user as any)?.phone || updatedBk.user?.email || '',
              name: updatedBk.user?.fullName || 'Devotee',
              details: {
                bookingNumber: updatedBk.bookingNumber,
                pujaName: updatedBk.puja?.name || 'Puja Ritual',
                amount: Number(updatedBk.total)
              }
            }).catch(() => {})

            // Trigger Real-Time Meta CAPI Server-Side Purchase Event
            const { sendMetaCapiEvent } = await import('@/lib/meta-capi')
            sendMetaCapiEvent({
              eventName: 'Purchase',
              eventId: `bk_${updatedBk.id}_${Date.now()}`,
              eventSourceUrl: `https://divyayagyam.com/pujas/${updatedBk.puja?.slug || ''}`,
              userData: {
                email: updatedBk.user?.email,
                phone: updatedBk.user?.phone,
                fullName: updatedBk.user?.fullName,
              },
              customData: {
                currency: 'INR',
                value: Number(updatedBk.total),
                content_name: updatedBk.puja?.name || 'Puja Booking',
                booking_number: updatedBk.bookingNumber,
              }
            }).catch(() => {})
          }
        }
      }
    } catch (dbErr: any) {
// console.warn('[verify] DB update skipped:', dbErr?.message) (removed for production)
    }

    if (!isValid) {
      return cors(NextResponse.json({ ok: false, verified: false, error: 'Invalid signature' }, { status: 400 }))
    }

    return cors(NextResponse.json({
      ok: true,
      verified: true,
      razorpay_payment_id,
      razorpay_order_id,
    }))
  } catch (err: any) {
// console.error('[verify] error:', err) (removed for production)
    return cors(NextResponse.json({ ok: false, error: err?.message || 'Verification failed' }, { status: 500 }))
  }
}

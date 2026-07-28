import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

// Razorpay webhook receiver. Configure this URL in Dashboard → Settings → Webhooks.
// Set `RAZORPAY_WEBHOOK_SECRET'env var to the secret you defined there.

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    if (!secret) {
      // Refuse to process events if the webhook secret isn't configured.
      // Accepting unsigned events here would let anyone fake a "payment successful" call.
      return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 500 });
    }

    const rawBody = await req.text()
    const receivedSignature =
      req.headers.get('x-razorpay-signature') ||
      req.headers.get('X-Razorpay-Signature') ||
      ''
    const eventId =
      req.headers.get('x-razorpay-event-id') ||
      req.headers.get('X-Razorpay-Event-Id') ||
      null

    const generated = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
    if (generated !== receivedSignature) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as {
      event: string
      payload: { payment?: { entity: any }; order?: { entity: any }; refund?: { entity: any } }
    }

    const orderEntityId: string | undefined = event.payload?.order?.entity?.id
    const paymentEntity: any = event.payload?.payment?.entity
    const paymentEntityId: string | undefined = paymentEntity?.id

    let statusUpdate: string | null = null
    switch (event.event) {
      case 'payment.captured':
      case 'order.paid':
        statusUpdate = 'SUCCESS'
        break
      case 'payment.authorized':
        statusUpdate = 'PROCESSING'
        break
      case 'payment.failed':
        statusUpdate = 'FAILED'
        break
      case 'refund.processed':
      case 'refund.created':
        statusUpdate = 'REFUNDED'
        break
      default:
        statusUpdate = null
    }

    try {
      if (statusUpdate && (orderEntityId || paymentEntityId)) {
        // Read the existing payment FIRST so we don't lose its orderId/bookingId
        // link before we've had a chance to use it (previous code overwrote
        // metadata, then tried to read the link afterwards, always failing).
        const existingPayment = await prisma.payment.findFirst({
          where: {
            OR: [
              orderEntityId ? { gatewayOrderId: orderEntityId } : undefined,
              paymentEntityId ? { gatewayRef: paymentEntityId } : undefined,
            ].filter(Boolean) as any,
          },
        })

        const existingMeta = (existingPayment?.metadata && typeof existingPayment.metadata === 'object')
          ? existingPayment.metadata as any
          : {}

        await prisma.payment.updateMany({
          where: {
            OR: [
              orderEntityId ? { gatewayOrderId: orderEntityId } : undefined,
              paymentEntityId ? { gatewayRef: paymentEntityId } : undefined,
            ].filter(Boolean) as any,
          },
          data: {
            status: statusUpdate as any,
            gatewayRef: paymentEntityId ?? undefined,
            paidAt: statusUpdate === 'SUCCESS' ? new Date() : undefined,
            metadata: { ...existingMeta, webhookEvent: event.event, eventId },
          },
        })

        const actualOrderId = existingPayment?.orderId || existingMeta.orderId
        const actualBookingId = existingPayment?.bookingId || existingMeta.bookingId

        if (actualOrderId) {
          await prisma.order.update({
            where: { id: actualOrderId },
            data: {
              paymentStatus: statusUpdate === 'SUCCESS' ? 'SUCCESS' : statusUpdate === 'FAILED' ? 'FAILED' : 'PENDING',
              status: statusUpdate === 'SUCCESS' ? 'PROCESSING' : 'PENDING'
            }
          }).catch(() => {})
        }

        if (actualBookingId) {
          await prisma.booking.update({
            where: { id: actualBookingId },
            data: {
              paymentStatus: statusUpdate === 'SUCCESS' ? 'SUCCESS' : statusUpdate === 'FAILED' ? 'FAILED' : 'PENDING',
              status: statusUpdate === 'SUCCESS' ? 'CONFIRMED' : 'PENDING'
            }
          }).catch(() => {})
        }
      }
    } catch (dbErr: any) {
// console.warn('[webhook] DB update skipped:', dbErr?.message) (removed for production)
    }

// console.log('[webhook] Handled event=${event.event} order=${orderEntityId} payment=${paymentEntityId}`) (removed for production)
    return NextResponse.json({ ok: true, event: event.event });
  } catch (err: any) {
// console.error('[webhook] error:', err) (removed for production)
    return NextResponse.json({ ok: false, error: err?.message || 'Webhook error' }, { status: 500 });
  }
}

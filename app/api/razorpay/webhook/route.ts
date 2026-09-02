import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

// In-memory idempotency cache for webhook events
// Razorpay may retry events - this prevents duplicate processing
const processedEventIds = new Map<string, number>() // eventId -> timestamp
const EVENT_CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function cleanupEventCache() {
  const now = Date.now()
  for (const [id, ts] of processedEventIds.entries()) {
    if (now - ts > EVENT_CACHE_TTL_MS) processedEventIds.delete(id)
  }
}

export async function POST(req: NextRequest) {
  try {
    let secret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim()
    if (!secret) {
      secret = (await getSetting('payments.razorpayWebhookSecret', 'RAZORPAY_WEBHOOK_SECRET')).replace(/^["']|["']$/g, '').trim()
    }
    if (!secret) {
      secret = (await getSetting('secret.razorpay_webhook_secret', 'RAZORPAY_WEBHOOK_SECRET')).replace(/^["']|["']$/g, '').trim()
    }
    if (!secret) {
      return NextResponse.json({ ok: false, error: 'Webhook secret not configured in Admin Settings' }, { status: 500 });
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

    // ── Idempotency Check ────────────────────────────────────────────────────
    // Razorpay retries webhooks on failure. We must not process the same
    // event twice (e.g., confirming an order or sending WhatsApp twice).
    if (eventId) {
      cleanupEventCache()
      if (processedEventIds.has(eventId)) {
        console.log(`[webhook] Duplicate event skipped: ${eventId}`)
        return NextResponse.json({ ok: true, event: 'duplicate_skipped', eventId })
      }
      // Mark as processed immediately (before DB ops) to prevent race conditions
      processedEventIds.set(eventId, Date.now())
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

          // Also update any BhaktiSeva records linked to this order
          if (statusUpdate === 'SUCCESS') {
            const linkedOrder = await prisma.order.findUnique({ where: { id: actualOrderId }, select: { userId: true } }).catch(() => null)
            if (linkedOrder?.userId) {
              await prisma.bhaktiSeva.updateMany({
                where: { userId: linkedOrder.userId, status: 'PENDING', paymentStatus: 'PENDING' },
                data: { status: 'SUCCESS', paymentStatus: 'SUCCESS' }
              }).catch(() => {})
            }
          }
        }

        if (actualBookingId) {
          const updatedBooking = await prisma.booking.update({
            where: { id: actualBookingId },
            data: {
              paymentStatus: statusUpdate === 'SUCCESS' ? 'SUCCESS' : statusUpdate === 'FAILED' ? 'FAILED' : 'PENDING',
              status: statusUpdate === 'SUCCESS' ? 'CONFIRMED' : 'PENDING'
            },
            include: { puja: true, user: true }
          }).catch(() => null)

          // Send WhatsApp on booking confirmation (idempotency already guaranteed above)
          if (updatedBooking && statusUpdate === 'SUCCESS') {
            const { sendWhatsAppNotification } = await import('@/lib/whatsapp')
            sendWhatsAppNotification({
              type: 'PUJA_CONFIRMED',
              phone: (updatedBooking.user as any)?.phone || updatedBooking.user?.email || '',
              name: updatedBooking.user?.fullName || 'Devotee',
              details: {
                bookingNumber: updatedBooking.bookingNumber,
                pujaName: updatedBooking.puja?.name || 'Puja Ritual',
                amount: Number(updatedBooking.total)
              }
            }).catch(() => {})
          }

          // Log payment failure for admin visibility
          if (statusUpdate === 'FAILED') {
            try {
              const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://divyayagyam.com'
              await fetch(`${siteUrl}/api/log-payment-error`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  source: 'webhook',
                  event: event.event,
                  paymentId: paymentEntityId,
                  orderId: actualOrderId,
                  bookingId: actualBookingId,
                  errorCode: paymentEntity?.error_code,
                  errorDescription: paymentEntity?.error_description,
                  amount: paymentEntity?.amount,
                  timestamp: new Date().toISOString(),
                })
              })
            } catch {}
          }
        }
      }
    } catch (dbErr: any) {
      console.warn('[webhook] DB update skipped:', dbErr?.message)
    }

    console.log(`[webhook] Handled event=${event.event} order=${orderEntityId} payment=${paymentEntityId} eventId=${eventId}`)
    return NextResponse.json({ ok: true, event: event.event });
  } catch (err: any) {
    console.error('[webhook] error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Webhook error' }, { status: 500 });
  }
}

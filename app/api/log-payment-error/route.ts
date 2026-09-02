import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * POST /api/log-payment-error
 * Accepts structured payment error logs from frontend + webhook.
 * Saves to database WebsiteSetting table as a JSON log entry (best-effort).
 * Also always logs to server console for Vercel log streaming.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      source,       // 'frontend' | 'webhook' | 'api'
      event,        // Razorpay event name
      paymentId,    // Razorpay payment ID
      orderId,      // Internal order ID
      bookingId,    // Internal booking ID
      errorCode,    // Razorpay error code
      errorDescription,
      amount,
      userId,
      userEmail,
      timestamp,
    } = body || {}

    // Always log to server console (captured by Vercel Log Drains)
    const logEntry = {
      type: 'PAYMENT_ERROR',
      source: source || 'unknown',
      event,
      paymentId,
      orderId,
      bookingId,
      errorCode,
      errorDescription,
      amount,
      userId,
      userEmail,
      timestamp: timestamp || new Date().toISOString(),
    }
    console.error('[PAYMENT_ERROR]', JSON.stringify(logEntry))

    // Best-effort: store in DB using existing Payment model if paymentId exists
    if (paymentId) {
      await prisma.payment.updateMany({
        where: { gatewayRef: paymentId },
        data: {
          status: 'FAILED',
          metadata: {
            error: true,
            errorCode,
            errorDescription,
            loggedAt: new Date().toISOString(),
          }
        }
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, logged: true })
  } catch (err: any) {
    console.error('[log-payment-error] Failed:', err?.message)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

/**
 * GET /api/cron/data-consistency
 * Daily cron job that audits payment/order/booking consistency.
 * Runs at 3AM IST (21:30 UTC) via Vercel Cron.
 * 
 * Checks:
 * 1. Pending payments older than 24h (likely abandoned/failed)
 * 2. Orders with SUCCESS payment but still PENDING status
 * 3. Bookings with SUCCESS payment but still PENDING status
 * Sends WhatsApp summary to admin on any mismatches.
 */
export async function GET(req: NextRequest) {
  // Strict cron authorization
  const authHeader = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const now = new Date()
  const cutoff24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const report: Record<string, any> = { timestamp: now.toISOString(), issues: [] }

  try {
    // ── 1. Stale PENDING payments (>24h old) ─────────────────────────────────
    const stalePendingPayments = await prisma.payment.findMany({
      where: {
        status: 'PENDING',
        createdAt: { lt: cutoff24h }
      },
      select: {
        id: true, amount: true, currency: true, createdAt: true,
        gatewayOrderId: true, gatewayRef: true, orderId: true, bookingId: true,
        user: { select: { email: true, phone: true, fullName: true } }
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    }).catch(() => [])

    if (stalePendingPayments.length > 0) {
      report.issues.push({
        type: 'STALE_PENDING_PAYMENTS',
        count: stalePendingPayments.length,
        description: `${stalePendingPayments.length} payments stuck in PENDING for >24h`,
        ids: stalePendingPayments.map(p => p.id)
      })
    }

    // ── 2. Orders with payment SUCCESS but wrong order status ──────────────────
    const mismatchedOrders = await prisma.order.findMany({
      where: {
        paymentStatus: 'SUCCESS',
        status: 'PENDING'
      },
      select: {
        id: true, orderNumber: true, total: true, createdAt: true, status: true, paymentStatus: true,
        user: { select: { email: true, phone: true } }
      },
      take: 50
    }).catch(() => [])

    if (mismatchedOrders.length > 0) {
      report.issues.push({
        type: 'MISMATCHED_ORDER_STATUS',
        count: mismatchedOrders.length,
        description: `${mismatchedOrders.length} orders: payment=SUCCESS but status=PENDING`,
        ids: mismatchedOrders.map(o => o.orderNumber)
      })

      // Auto-fix: Update to PROCESSING
      await prisma.order.updateMany({
        where: {
          id: { in: mismatchedOrders.map(o => o.id) }
        },
        data: { status: 'PROCESSING' }
      }).catch(() => {})
    }

    // ── 3. Bookings with payment SUCCESS but wrong booking status ──────────────
    const mismatchedBookings = await prisma.booking.findMany({
      where: {
        paymentStatus: 'SUCCESS',
        status: 'PENDING'
      },
      select: {
        id: true, bookingNumber: true, total: true, createdAt: true, status: true, paymentStatus: true,
        user: { select: { email: true, phone: true } },
        puja: { select: { name: true } }
      },
      take: 50
    }).catch(() => [])

    if (mismatchedBookings.length > 0) {
      report.issues.push({
        type: 'MISMATCHED_BOOKING_STATUS',
        count: mismatchedBookings.length,
        description: `${mismatchedBookings.length} bookings: payment=SUCCESS but status=PENDING`,
        ids: mismatchedBookings.map(b => b.bookingNumber)
      })

      // Auto-fix: Update to CONFIRMED
      await prisma.booking.updateMany({
        where: {
          id: { in: mismatchedBookings.map(b => b.id) }
        },
        data: { status: 'CONFIRMED' }
      }).catch(() => {})
    }

    report.summary = {
      totalIssues: report.issues.length,
      autoFixed: mismatchedOrders.length + mismatchedBookings.length,
      needsManualReview: stalePendingPayments.length
    }

    // ── 4. Send WhatsApp admin alert if issues found ──────────────────────────
    if (report.issues.length > 0) {
      try {
        const adminPhone = process.env.ADMIN_WHATSAPP_PHONE
        if (adminPhone) {
          const { sendWhatsAppNotification } = await import('@/lib/whatsapp')
          const issuesSummary = report.issues.map((i: any) => `• ${i.type}: ${i.description}`).join('\n')
          await sendWhatsAppNotification({
            type: 'CUSTOM_ALERT',
            phone: adminPhone,
            name: 'Admin',
            details: {
              querySubject: `🔔 DivyaYagyam Data Consistency Alert — ${now.toLocaleDateString('hi-IN')}`,
              items: `${issuesSummary}\n\nAuto-fixed: ${report.summary.autoFixed} records\nManual review needed: ${report.summary.needsManualReview} records`,
            }
          }).catch(() => {})
        }
      } catch {}
    }

    console.log('[cron/data-consistency] Report:', JSON.stringify(report))
    return NextResponse.json({ ok: true, report })

  } catch (err: any) {
    console.error('[cron/data-consistency] Error:', err?.message)
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

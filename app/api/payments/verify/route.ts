import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { getSetting } from '@/lib/settings'
import { withCors, corsPreflightResponse, checkRateLimit } from '@/lib/api-security'

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req)
}

export async function POST(req: NextRequest) {
  // Rate limit: max 15 payment verifications per minute per IP
  const rateLimited = checkRateLimit(req, { limit: 15, prefix: 'verify' })
  if (rateLimited) return withCors(req, rateLimited)

  try {
    const forwardedFor = req.headers.get('x-forwarded-for') || ''
    const clientIp = forwardedFor.split(',')[0].trim() || req.headers.get('x-real-ip') || undefined
    const userAgent = req.headers.get('user-agent') || undefined
    const fbp = req.cookies.get('_fbp')?.value || undefined
    const fbc = req.cookies.get('_fbc')?.value || undefined

    const body = await req.json()
    const {
      paymentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body || {}

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return withCors(req, NextResponse.json({ ok: false, error: 'Missing verification fields' }, { status: 400 }))
    }

    // ENV var has priority; DB/Admin Settings is fallback
    let secret = (process.env.RAZORPAY_KEY_SECRET || '').replace(/^["']|["']$/g, '').trim()
    if (!secret) {
      secret = (await getSetting('secret.razorpay_key_secret')).replace(/^["']|["']$/g, '').trim()
    }
    if (!secret) {
      return withCors(req, NextResponse.json({ ok: false, error: 'RAZORPAY_KEY_SECRET not configured' }, { status: 500 }))
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
        // Fetch existing metadata first to merge (avoid overwrite)
        const existingPayment = await prisma.payment.findUnique({ where: { id: paymentId } }).catch(() => null)
        const existingMeta = (existingPayment?.metadata && typeof existingPayment.metadata === 'object') ? existingPayment.metadata as any : {}
        paymentRecord = await prisma.payment.update({
          where: { id: paymentId },
          data: {
            status: isValid ? 'SUCCESS' : 'FAILED',
            gatewayRef: razorpay_payment_id,
            paidAt: isValid ? new Date() : null,
            metadata: { ...existingMeta, verified: isValid, razorpay_order_id, razorpay_payment_id, razorpay_signature },
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

        const { sendMetaCapiEvent } = await import('@/lib/meta-capi')

        if (linkedOrderId) {
          const updatedOrder = await prisma.order.update({
            where: { id: linkedOrderId },
            data: { paymentStatus: 'SUCCESS', status: 'PROCESSING' },
            include: { items: true, user: true, shippingAddress: true, coupon: { select: { id: true } } }
          }).catch(() => null)

          if (updatedOrder) {
            // Increment coupon usedCount now that payment is confirmed
            const couponId = (updatedOrder as any).couponId || (updatedOrder as any).coupon?.id
            if (couponId) {
              await prisma.coupon.update({
                where: { id: couponId },
                data: { usedCount: { increment: 1 } }
              }).catch(() => {})
            }

            // Update BhaktiSeva records linked to this order (if it's a BhaktiSeva purchase)
            await prisma.bhaktiSeva.updateMany({
              where: { userId: updatedOrder.userId, status: 'PENDING', paymentStatus: 'PENDING' },
              data: { status: 'SUCCESS', paymentStatus: 'SUCCESS' }
            }).catch(() => {})

            // WhatsApp notification for product order success
            const { sendWhatsAppNotification } = await import('@/lib/whatsapp')
            sendWhatsAppNotification({
              type: 'ORDER_SUCCESS',
              phone: updatedOrder.shippingAddress?.phone || updatedOrder.user?.phone || '',
              name: updatedOrder.shippingAddress?.fullName || updatedOrder.user?.fullName || 'Devotee',
              details: {
                orderNumber: updatedOrder.orderNumber,
                amount: Number(updatedOrder.total),
                items: updatedOrder.items.map((i: any) => i.name).join(', ')
              }
            }).catch(() => {})

            sendMetaCapiEvent({
              eventName: 'Purchase',
              eventId: `ord_${updatedOrder.id}_${Date.now()}`,
              eventSourceUrl: 'https://divyayagyam.com/checkout/success',
              userData: {
                email: updatedOrder.user?.email || (updatedOrder as any).shippingAddress?.email,
                phone: updatedOrder.user?.phone || updatedOrder.shippingAddress?.phone,
                fullName: updatedOrder.user?.fullName || updatedOrder.shippingAddress?.fullName,
                clientIp,
                userAgent,
                fbp,
                fbc,
              },
              customData: {
                currency: 'INR',
                value: Number(updatedOrder.total),
                order_id: updatedOrder.orderNumber || updatedOrder.id,
                content_type: 'product',
                content_ids: updatedOrder.items?.map((i: any) => i.productId).filter(Boolean) || [],
              }
            }).catch(() => {})
          }

        } else {
          // Last resort: find order via Razorpay order ID in payment metadata
          const orderViaGateway = await prisma.order.findFirst({
            where: {
              payments: { some: { gatewayOrderId: razorpay_order_id } }
            },
            include: { items: true, user: true, shippingAddress: true }
          }).catch(() => null)
          if (orderViaGateway) {
            await prisma.order.update({
              where: { id: orderViaGateway.id },
              data: { paymentStatus: 'SUCCESS', status: 'PROCESSING' },
            }).catch(() => {})

            sendMetaCapiEvent({
              eventName: 'Purchase',
              eventId: `ord_${orderViaGateway.id}_${Date.now()}`,
              eventSourceUrl: 'https://divyayagyam.com/checkout/success',
              userData: {
                email: orderViaGateway.user?.email,
                phone: orderViaGateway.user?.phone,
                fullName: orderViaGateway.user?.fullName,
                clientIp,
                userAgent,
                fbp,
                fbc,
              },
              customData: {
                currency: 'INR',
                value: Number(orderViaGateway.total),
                order_id: orderViaGateway.orderNumber || orderViaGateway.id,
              }
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
            sendMetaCapiEvent({
              eventName: 'Purchase',
              eventId: `bk_${updatedBk.id}_${Date.now()}`,
              eventSourceUrl: `https://divyayagyam.com/pujas/${updatedBk.puja?.slug || ''}`,
              userData: {
                email: updatedBk.user?.email,
                phone: updatedBk.user?.phone,
                fullName: updatedBk.user?.fullName,
                clientIp,
                userAgent,
                fbp,
                fbc,
              },
              customData: {
                currency: 'INR',
                value: Number(updatedBk.total),
                content_name: updatedBk.puja?.name || 'Puja Booking',
                booking_number: updatedBk.bookingNumber,
                content_ids: updatedBk.pujaId ? [updatedBk.pujaId] : [],
              }
            }).catch(() => {})
          }
        }
      }
    } catch (dbErr: any) {
      console.warn('[verify] DB update skipped:', dbErr?.message)
    }

    if (!isValid) {
      return withCors(req, NextResponse.json({ ok: false, verified: false, error: 'Invalid signature' }, { status: 400 }))
    }

    return withCors(req, NextResponse.json({
      ok: true,
      verified: true,
      razorpay_payment_id,
      razorpay_order_id,
    }))
  } catch (err: any) {
    console.error('[verify] error:', err)
    return withCors(req, NextResponse.json({ ok: false, error: err?.message || 'Verification failed' }, { status: 500 }))
  }
}

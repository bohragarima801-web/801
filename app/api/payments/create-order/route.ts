import { NextRequest, NextResponse } from 'next/server'
import { getRazorpay } from '@/lib/razorpay'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { getSetting } from '@/lib/settings'
import { withCors, corsPreflightResponse, checkRateLimit } from '@/lib/api-security'

export async function OPTIONS(req: NextRequest) {
  return corsPreflightResponse(req)
}

export async function POST(req: NextRequest) {
  // Rate limit: max 10 order creations per minute per IP
  const rateLimited = checkRateLimit(req, { limit: 10, prefix: 'create-order' })
  if (rateLimited) return withCors(req, rateLimited)

  try {
    const body = await req.json()
    const {
      amountInRupees,
      paymentType = 'donation',
      referenceId,
      description,
      customer,
      notes,
    } = body || {}

    if (!amountInRupees || typeof amountInRupees !== 'number' || amountInRupees <= 0) {
      return withCors(req, NextResponse.json({ ok: false, error: 'Invalid amount' }, { status: 400 }))
    }
    if (amountInRupees < 1) {
      return withCors(req, NextResponse.json({ ok: false, error: 'Minimum ₹1 required' }, { status: 400 }))
    }

    const amountInPaise = Math.round(amountInRupees * 100)
    const receipt = `dvj_${paymentType}_${Date.now()}`.slice(0, 40)

    // Optional: attach user (works even if unauth for donations/testing)
    const user = await getCurrentUser().catch(() => null)

    const { getRazorpay, getRazorpayKeys } = await import('@/lib/razorpay')
    const razorpay = await getRazorpay()
    const { key_id: rzpKeyId } = await getRazorpayKeys()

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        paymentType,
        referenceId: referenceId ?? '',
        userId: user?.id ?? 'guest',
        description: description ?? '',
        ...(notes || {}),
      },
    })

    // Persist Payment record (best-effort)
    let paymentId: string | null = null
    try {
      const { ensureDbUser } = await import('@/lib/user-resolver')
      const dbUser = await ensureDbUser(user, {
        email: customer?.email,
        phone: customer?.contact,
        name: customer?.name || 'Devotee',
      })
      const record = await prisma.payment.create({
        data: {
          userId: dbUser.id,
          amount: amountInRupees,
          currency: 'INR',
          gateway: 'RAZORPAY',
          gatewayOrderId: order.id,
          status: 'PENDING',
          metadata: { paymentType, referenceId, description, receipt, customer, notes },
        },
      })
      paymentId = record.id
    } catch (dbErr: any) {
      console.warn('[create-order] DB persistence skipped:', dbErr?.message)
    }

    return withCors(req, NextResponse.json({
      ok: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      razorpayKeyId: rzpKeyId,
      paymentId,
      customer: {
        name: customer?.name || user?.fullName || '',
        email: customer?.email || user?.email || '',
        contact: customer?.contact || '',
      },
    }))
  } catch (err: any) {
    console.error('[Create Order API] Error creating Razorpay order:', err?.message || err)
    return withCors(req, NextResponse.json({
      ok: false,
      error: `Razorpay Error: ${err?.error?.description || err?.message || 'Failed to create Razorpay order'}`,
    }, { status: 500 }))
  }
}

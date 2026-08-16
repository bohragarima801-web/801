import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { ensureDbUser } from '@/lib/user-resolver'

// POST /api/tools/buy
// Purchase a paid spiritual tool
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null)
    const body = await req.json()
    const { toolId } = body

    if (!toolId) {
      return NextResponse.json({ ok: false, error: 'Tool ID is required' }, { status: 400 })
    }

    // Fetch tool from DB to get secure price
    const tool = await prisma.spiritualTool.findUnique({ where: { id: toolId } })
    if (!tool) {
      return NextResponse.json({ ok: false, error: 'Tool not found' }, { status: 404 })
    }
    if (!tool.isActive) {
      return NextResponse.json({ ok: false, error: 'This tool is not available' }, { status: 400 })
    }

    // If tool is free, grant access immediately
    if (tool.isFree || Number(tool.price) === 0) {
      return NextResponse.json({
        ok: true,
        mode: 'free',
        message: 'This tool is free to use!',
        toolId: tool.id,
        toolSlug: tool.slug,
      })
    }

    const price = Number(tool.price)
    if (price < 1) {
      return NextResponse.json({ ok: false, error: 'Invalid tool price' }, { status: 400 })
    }

    // Resolve DB user
    const dbUser = await ensureDbUser(user, {
      email: user?.email,
      name: user?.fullName || 'Devotee'
    })
    const dbUserId = dbUser.id

    // Create order for the tool
    const orderNumber = 'TOOL-' + Math.floor(100000 + Math.random() * 900000)
    const dbOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: dbUserId,
        subtotal: price,
        tax: 0,
        shipping: 0,
        discount: 0,
        total: price,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        items: {
          create: [{
            name: `Spiritual Tool: ${tool.name}`,
            quantity: 1,
            price,
            total: price,
          }],
        },
      },
    })

    // Razorpay payment
    try {
      const { getRazorpay, getRazorpayKeys } = await import('@/lib/razorpay')
      const razorpay = await getRazorpay()
      const { key_id: rzpKeyId } = await getRazorpayKeys()

      const amountInPaise = Math.max(100, Math.round(price * 100))
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: dbOrder.id,
        notes: {
          paymentType: 'spiritual_tool',
          toolId: tool.id,
          toolName: tool.name,
          orderId: dbOrder.id,
          userId: dbUserId,
        },
      })

      const paymentRecord = await prisma.payment.create({
        data: {
          userId: dbUserId,
          orderId: dbOrder.id,
          amount: price,
          currency: 'INR',
          gateway: 'RAZORPAY',
          gatewayOrderId: rzpOrder.id,
          status: 'PENDING',
          metadata: { paymentType: 'spiritual_tool', toolId: tool.id, orderId: dbOrder.id },
        },
      }).catch(() => null)

      return NextResponse.json({
        ok: true,
        mode: 'razorpay',
        orderNumber: dbOrder.orderNumber,
        tool: { id: tool.id, name: tool.name, slug: tool.slug },
        paymentData: {
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          razorpayKeyId: rzpKeyId,
          paymentId: paymentRecord?.id || null,
        },
      })
    } catch (rzpErr: any) {
      await prisma.order.delete({ where: { id: dbOrder.id } }).catch(() => {})
      return NextResponse.json({
        ok: false,
        error: `Payment error: ${rzpErr?.error?.description || rzpErr?.message || 'Failed to initialize payment'}`,
      }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Tool purchase failed' }, { status: 500 })
  }
}

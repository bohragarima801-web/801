import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// POST /api/bhaktiseva/buy
// Standalone BhaktiSeva purchase (outside of puja booking)
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null)
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Please login to continue' }, { status: 401 })
    }

    const body = await req.json()
    const { offeringIds, shippingAddress, notes } = body

    if (!offeringIds || !Array.isArray(offeringIds) || offeringIds.length === 0) {
      return NextResponse.json({ ok: false, error: 'Please select at least one BhaktiSeva offering' }, { status: 400 })
    }

    // Secure: fetch offerings from DB to prevent price tampering
    const offerings = await prisma.bhaktiSevaOffering.findMany({
      where: { id: { in: offeringIds }, isActive: true },
    })

    if (offerings.length === 0) {
      return NextResponse.json({ ok: false, error: 'No valid offerings found' }, { status: 400 })
    }

    const total = offerings.reduce((sum, o) => sum + Number(o.price), 0)

    if (total < 1) {
      return NextResponse.json({ ok: false, error: 'Total amount must be at least ₹1' }, { status: 400 })
    }

    // Resolve DB user ID
    let dbUserId = user.id
    if (dbUserId === 'admin-system-id' || dbUserId.length > 36) {
      let dbUser = await prisma.user.findFirst({ where: { email: user.email } })
      if (!dbUser) {
        const defaultRole = await prisma.role.findFirst({ where: { isSystem: true } })
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            fullName: user.fullName || 'Devotee',
            supabaseId: user.supabaseId || user.id,
            roleId: defaultRole?.id ?? null,
          },
        })
      }
      dbUserId = dbUser.id
    }

    // Save shipping address if provided
    let savedAddressId: string | null = null
    if (shippingAddress?.name && shippingAddress?.phone) {
      const saved = await prisma.address.create({
        data: {
          userId: dbUserId,
          type: 'SHIPPING',
          fullName: shippingAddress.name,
          phone: shippingAddress.phone,
          line1: shippingAddress.street || shippingAddress.line1 || '',
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          pincode: shippingAddress.pincode || '',
          country: 'India',
          isDefault: false,
        },
      }).catch(() => null)
      savedAddressId = saved?.id || null
    }

    // Create an order for bhaktiseva
    const orderNumber = 'BS-' + Math.floor(100000 + Math.random() * 900000)
    const dbOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: dbUserId,
        subtotal: total,
        tax: 0,
        shipping: 0,
        discount: 0,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        shippingAddressId: savedAddressId,
        notes: notes || null,
        items: {
          create: offerings.map(o => ({
            name: o.name,
            quantity: 1,
            price: Number(o.price),
            total: Number(o.price),
          })),
        },
      },
    })

    // Resolve default temple to satisfy schema constraint
    const defaultTemple = await prisma.temple.findFirst({ where: { isActive: true } })
    if (!defaultTemple) {
      return NextResponse.json({ ok: false, error: 'No active temple found to host BhaktiSeva' }, { status: 400 })
    }

    // Create BhaktiSeva records
    const bhaktiSevaRecords = await Promise.all(
      offerings.map(o =>
        prisma.bhaktiSeva.create({
          data: {
            userId: dbUserId,
            templeId: defaultTemple.id,
            amount: Number(o.price),
            status: 'PENDING',
            paymentStatus: 'PENDING',
            sankalpText: notes ? `Offering: ${o.name}. Notes: ${notes}` : `Offering: ${o.name}`,
          },
        }).catch(() => null)
      )
    )

    // Create Razorpay order
    try {
      const { getRazorpay, getRazorpayKeys } = await import('@/lib/razorpay')
      const razorpay = await getRazorpay()
      const { key_id: rzpKeyId } = await getRazorpayKeys()

      const amountInPaise = Math.max(100, Math.round(total * 100))
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: dbOrder.id,
        notes: {
          paymentType: 'bhaktiseva',
          orderId: dbOrder.id,
          userId: dbUserId,
          offeringNames: offerings.map(o => o.name).join(', '),
        },
      })

      const paymentRecord = await prisma.payment.create({
        data: {
          userId: dbUserId,
          orderId: dbOrder.id,
          amount: total,
          currency: 'INR',
          gateway: 'RAZORPAY',
          gatewayOrderId: rzpOrder.id,
          status: 'PENDING',
          metadata: { paymentType: 'bhaktiseva', orderId: dbOrder.id, offeringIds },
        },
      }).catch(() => null)

      return NextResponse.json({
        ok: true,
        mode: 'razorpay',
        orderNumber: dbOrder.orderNumber,
        offerings: offerings.map(o => ({ id: o.id, name: o.name, price: Number(o.price) })),
        total,
        paymentData: {
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          razorpayKeyId: rzpKeyId,
          paymentId: paymentRecord?.id || null,
        },
      })
    } catch (rzpErr: any) {
      // Clean up order AND BhaktiSeva records to prevent orphaned rows
      await prisma.order.delete({ where: { id: dbOrder.id } }).catch(() => {})
      const bhaktiSevaIds = bhaktiSevaRecords.filter(Boolean).map((r: any) => r.id)
      if (bhaktiSevaIds.length > 0) {
        await prisma.bhaktiSeva.deleteMany({ where: { id: { in: bhaktiSevaIds } } }).catch(() => {})
      }
      return NextResponse.json({
        ok: false,
        error: `Payment gateway error: ${rzpErr?.error?.description || rzpErr?.message || 'Failed to initialize payment'}`,
      }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to process BhaktiSeva purchase' }, { status: 500 })
  }
}

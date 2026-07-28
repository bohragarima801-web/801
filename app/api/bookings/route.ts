import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

import { withSafeApi } from '@/lib/safe-api'

export const GET = withSafeApi(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const pujaId = searchParams.get('pujaId')

  if (!pujaId) {
    return NextResponse.json({ ok: false, error: 'Puja ID is required' }, { status: 400 });
  }

  const puja = await prisma.puja.findUnique({
    where: { id: pujaId },
    include: { temple: true },
  })

  if (!puja) {
    return NextResponse.json({ ok: false, error: 'Puja not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: puja });
})

export const POST = withSafeApi(async (req: NextRequest) => {
  const user = await getCurrentUser().catch(() => null)
  if (!user) {
    return NextResponse.json({ ok: false, error: 'You must be logged in to book a puja' }, { status: 401 });
  }

  const body = await req.json()
  const { 
    pujaId, 
    devoteeName, 
    fatherHusbandName, 
    gotra, 
    members = [], // Array of { name: string }
    selectedOfferingIds = [],
    addCourier = false,
    addDakshina = false,
    packageKey = '1'
  } = body

  if (!pujaId || !devoteeName || !fatherHusbandName) {
    return NextResponse.json({ ok: false, error: 'All mandatory fields must be filled' }, { status: 400 });
  }

  const puja = await prisma.puja.findUnique({
    where: { id: pujaId },
  })

  if (!puja) {
    return NextResponse.json({ ok: false, error: 'Puja not found' }, { status: 404 });
  }

  // 1. SECURE PRICE CALCULATION
  const basePrice = Number(puja.price) || 0
  const packageUpgrades: Record<string, number> = { '1': 0, '2': 550, '4': 1550, '6': 2550 }
  const memberCount = Number(packageKey) || 1
  const packagePrice = basePrice + (packageUpgrades[packageKey] ?? 0)

  let addOnsTotal = 0
  if (addCourier) addOnsTotal += 99
  if (addDakshina) addOnsTotal += 251

  // Fetch offering prices securely from DB to prevent tampering
  if (selectedOfferingIds.length > 0) {
    const offerings = await prisma.bhaktiSevaOffering.findMany({
      where: { id: { in: selectedOfferingIds }, isActive: true }
    })
    offerings.forEach(offering => {
      addOnsTotal += Number(offering.price) || 0
    })
  }

  const total = packagePrice + addOnsTotal

  // 2. CREATE BOOKING WITH NESTED MEMBERS
  const bookingNumber = 'DY-' + Math.floor(100000 + Math.random() * 900000)

  // Build description text for sankalp
  const descriptionText = [
    `Package: ${memberCount} Members`,
    addCourier ? 'Prasad Courier (₹99)' : '',
    addDakshina ? 'Pandit Dakshina (₹251)' : '',
    selectedOfferingIds.length > 0 ? `Extra Offerings Added` : '',
    `Total Payable Amount: ₹${total}`
  ].filter(Boolean).join(' | ')

  // Prepare members array for nested create
  const bookingMembers = [
    { fullName: devoteeName, gotra: gotra || 'Kashyap', relation: 'Self' },
    ...members.filter((m: any) => m && m.name?.trim()).map((m: any) => ({
      fullName: m.name.trim(),
      gotra: gotra || 'Kashyap',
      relation: 'Family'
    }))
  ]

  // Resolve or Upsert DB User Record to prevent foreign key errors
  let dbUserId = user.id
  if (dbUserId === 'admin-system-id' || dbUserId.length > 36) {
    let dbUser = await prisma.user.findFirst({
      where: { OR: [{ email: user.email }, { id: user.id }] }
    })
    if (!dbUser) {
      const defaultRole = await prisma.role.findFirst({ where: { isSystem: true } })
      dbUser = await prisma.user.create({
        data: {
          email: user.email,
          fullName: user.fullName || 'Devotee',
          supabaseId: user.supabaseId || user.id,
          roleId: defaultRole?.id ?? null
        }
      })
    }
    dbUserId = dbUser.id
  }

  const booking = await prisma.booking.create({
    data: {
      userId: dbUserId,
      pujaId: puja.id,
      bookingNumber,
      memberCount: memberCount,
      subtotal: total, // For now, total and subtotal are same, tax is 0
      total: total,
      gotra: gotra || 'Kashyap',
      sankalpText: `Devotee: ${devoteeName}, Relation Name: ${fatherHusbandName}, Details: ${descriptionText}`,
      specialInstructions: `Father/Husband: ${fatherHusbandName}`,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      members: {
        create: bookingMembers
      }
    },
    include: {
      members: true
    }
  })

  if (total === 0) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED', paymentStatus: 'PAID' }
    })
    return NextResponse.json({
      ok: true,
      data: booking,
      mode: 'manual',
      message: 'आपकी पूजा बुकिंग (नि:शुल्क) सफलतापूर्वक कन्फर्म हो गई है!'
    });
  }

  if (total < 1) {
    await prisma.booking.delete({ where: { id: booking.id } }).catch(() => {})
    return NextResponse.json({
      ok: false,
      error: 'Online payment requires a minimum booking total of ₹1.'
    }, { status: 400 });
  }

  // 3. CREATE RAZORPAY ORDER — booking must not be marked paid until real payment is verified
  try {
    const { getRazorpay } = await import('@/lib/razorpay')
    const { getSetting } = await import('@/lib/settings')
    const razorpay = await getRazorpay()
    const amountInPaise = Math.round(total * 100)
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: booking.id,
      notes: { paymentType: 'puja_booking', bookingId: booking.id, userId: dbUserId }
    })

    await prisma.payment.create({
      data: {
        userId: dbUserId,
        bookingId: booking.id,
        amount: total,
        currency: 'INR',
        gateway: 'RAZORPAY',
        gatewayOrderId: rzpOrder.id,
        status: 'PENDING',
        metadata: { paymentType: 'puja_booking', bookingId: booking.id }
      }
    }).catch(() => {})

    const rzpKeyId = (await getSetting('secret.razorpay_key_id', 'RAZORPAY_KEY_ID')) || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID

    return NextResponse.json({
      ok: true,
      data: booking,
      mode: 'razorpay',
      paymentData: {
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        razorpayKeyId: rzpKeyId,
      }
    });
  } catch (rzpErr: any) {
    const errorMsg = rzpErr?.error?.description || rzpErr?.message || 'Failed to initialize Razorpay payment'
    console.error('================ Razorpay Booking Creation Error ================')
    console.error('Error Details:', rzpErr)
    console.error('==================================================================')
    
    // Clean up unconfirmed booking if payment failed to initiate
    await prisma.booking.delete({ where: { id: booking.id } }).catch(() => {})

    return NextResponse.json({
      ok: false,
      error: `Razorpay Error: ${errorMsg}. Please verify your Razorpay API Keys in Admin Settings.`
    }, { status: 400 });
  }
})

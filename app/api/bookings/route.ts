import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { ensureDbUser } from '@/lib/user-resolver'
import { withSafeApi } from '@/lib/safe-api'

export const GET = withSafeApi(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const pujaId = searchParams.get('pujaId')

  if (!pujaId) {
    return NextResponse.json({ ok: false, error: 'Puja ID is required' }, { status: 400 });
  }

  const puja = await prisma.puja.findFirst({
    where: {
      OR: [
        { id: pujaId },
        { slug: pujaId }
      ]
    },
    include: { temple: true, packages: true },
  })

  if (!puja) {
    return NextResponse.json({ ok: false, error: 'Puja not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: JSON.parse(JSON.stringify(puja)) });
})

export const POST = withSafeApi(async (req: NextRequest) => {
  const body = await req.json()
  const { 
    pujaId, 
    devoteeName, 
    fatherHusbandName,
    phone,
    email,
    gotra, 
    sankalpPurpose,
    members = [], // Array of { name: string }
    selectedOfferingIds = [],
    addCourier = false,
    addDakshina = false,
    packageKey = '1',
    isVipBooking = false,
    amount: customAmount
  } = body

  if (!pujaId || !devoteeName) {
    return NextResponse.json({ ok: false, error: 'Mandatory fields missing: pujaId and devoteeName are required' }, { status: 400 });
  }

  // 1. Resolve Puja by ID or Slug
  const puja = await prisma.puja.findFirst({
    where: {
      OR: [
        { id: pujaId },
        { slug: pujaId }
      ]
    },
    include: { packages: true },
  })

  if (!puja) {
    return NextResponse.json({ ok: false, error: 'Puja not found' }, { status: 404 });
  }

  // 2. Resolve guaranteed valid User record in DB
  const authUser = await getCurrentUser().catch(() => null)
  const dbUser = await ensureDbUser(authUser, {
    email: email || authUser?.email,
    phone: phone || (authUser as any)?.phone,
    name: devoteeName || authUser?.fullName || 'Devotee'
  })
  const dbUserId = dbUser.id

  // 1. SECURE PRICE CALCULATION
  const finalIsVip = Boolean(isVipBooking || puja.isVip)
  const basePrice = (finalIsVip && puja.vipPrice) ? Number(puja.vipPrice) : Number(puja.price) || 0
  const memberCount = Number(packageKey) || 1

  let packagePrice = basePrice
  if (packageKey && !finalIsVip) {
    const matchedPkg = puja.packages?.find((p: any) => p.id === packageKey)
    if (matchedPkg) {
      packagePrice = Number(matchedPkg.price)
    } else {
      const packageUpgrades: Record<string, number> = { '1': 0, '2': 550, '3': 1550, '4': 2550, '6': 2550 }
      packagePrice = basePrice + (packageUpgrades[packageKey] ?? 0)
    }
  }

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

  const booking = await prisma.booking.create({
    data: {
      userId: dbUserId,
      pujaId: puja.id,
      bookingNumber,
      memberCount: memberCount,
      subtotal: total, // For now, total and subtotal are same, tax is 0
      total: total,
      gotra: gotra || 'Kashyap',
      sankalpText: `Devotee: ${devoteeName}, WhatsApp: ${phone || 'N/A'}, Relation: ${fatherHusbandName || 'Self'}, Purpose: ${sankalpPurpose || 'N/A'}, Details: ${descriptionText}`,
      specialInstructions: `WhatsApp/Phone: ${phone || 'N/A'}${fatherHusbandName && fatherHusbandName !== 'Self' ? ` | Father/Husband: ${fatherHusbandName}` : ''}${sankalpPurpose ? ` | Purpose: ${sankalpPurpose}` : ''}`,
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

  // NOTE: WhatsApp PUJA_CONFIRMED notification is sent ONLY after payment verification
  // succeeds (in /api/payments/verify). Sending it here would notify devotees who
  // then cancel or close the Razorpay popup without completing payment.

  if (total === 0) {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED', paymentStatus: 'SUCCESS' }
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
    const { getRazorpay, getRazorpayKeys } = await import('@/lib/razorpay')
    const razorpay = await getRazorpay()
    const { key_id: rzpKeyId } = await getRazorpayKeys()

    const amountInPaise = Math.max(100, Math.round(total * 100))
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: booking.id,
      notes: { paymentType: 'puja_booking', bookingId: booking.id, userId: dbUserId }
    })

    const paymentRecord = await prisma.payment.create({
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
    }).catch(() => null)

    return NextResponse.json({
      ok: true,
      data: booking,
      mode: 'razorpay',
      paymentData: {
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        razorpayKeyId: rzpKeyId,
        paymentId: paymentRecord?.id || null,
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

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { getSetting } from '@/lib/settings'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null)
    if (!user) {
      return NextResponse.json({ ok: false, error: 'You must be logged in to view your orders' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))
    const skip = (page - 1) * limit

    // Resolve actual DB user ID
    let dbUserId = user.id
    if (dbUserId === 'admin-system-id' || dbUserId.length > 36) {
      const dbUser = await prisma.user.findFirst({ where: { email: user.email } })
      if (!dbUser) return NextResponse.json({ ok: true, data: [], total: 0 });
      dbUserId = dbUser.id
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: dbUserId },
        skip,
        take: limit,
        include: {
          items: {
            include: { product: { select: { name: true, coverImage: true } } }
          },
          payments: {
            select: { status: true, gatewayRef: true, paidAt: true },
            orderBy: { createdAt: 'desc' },
            take: 1
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where: { userId: dbUserId } }),
    ])

    return NextResponse.json({
      ok: true,
      data: orders.map(o => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        paymentStatus: o.paymentStatus,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        total: Number(o.total),
        items: o.items.map(i => ({
          name: i.name,
          quantity: i.quantity,
          price: Number(i.price),
          total: Number(i.total),
          image: i.product?.coverImage || null,
        })),
        payment: o.payments[0] || null,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
      })),
      total,
      page,
      limit,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null)
    if (!user) {
      return NextResponse.json({ ok: false, error: 'You must be logged in to place an order' }, { status: 401 });
    }


    const body = await req.json()
    const { items = [], shippingAddress, notes, couponCode } = body

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: 'Cart is empty or invalid' }, { status: 400 });
    }


    if (!shippingAddress?.name || !shippingAddress?.phone || !shippingAddress?.pincode) {
      return NextResponse.json({ ok: false, error: 'Incomplete shipping address' }, { status: 400 });
    }

    // 1. Secure Price Calculation from DB
    const productIds = items.filter((i: any) => !i.id.startsWith('puja-') && !i.id.startsWith('addon-') && !i.id.startsWith('tool-')).map((i: any) => i.id)
    const products = productIds.length > 0 ? await prisma.product.findMany({
      where: { id: { in: productIds } }
    }) : []
    const bhaktiSevaOfferings = await prisma.bhaktiSevaOffering.findMany({
       where: { isActive: true }
    })

    let subtotal = 0
    const orderItemsData: any[] = []

    for (const item of items) {
       let price = 0
       let name = (item.name && item.name !== 'Unknown Item') ? item.name : ''
       let productId: string | null = null

       if (item.id.startsWith('puja-')) {
          const parts = item.id.split('-')
          let pujaId = parts.slice(1, parts.length - 1).join('-')
          let pkgId = parts[parts.length - 1]
          
          if (!pujaId) {
             pujaId = parts.slice(1).join('-')
             pkgId = '1'
          }

          const puja = await prisma.puja.findUnique({ 
             where: { id: pujaId }, 
             include: { packages: true, temple: true } 
          })

          if (puja) {
             const pkg = puja.packages.find(p => p.id === pkgId)
             if (pkg) { 
                price = Number(pkg.price)
                const pkgTitle = (pkg as any).name || (pkg as any).title || 'Package'
                name = `🪔 ${puja.name} (${pkgTitle})`
             } else if (pkgId === '1' || pkgId.includes('base')) { 
                price = Number(puja.price)
                name = `🪔 ${puja.name}`
             } else if (pkgId === '2') { 
                price = Number(puja.price) * 1.5
                name = `🪔 ${puja.name} (Family Package)`
             } else if (pkgId === '3') { 
                price = Number(puja.price) * 2.5
                name = `🪔 ${puja.name} (VIP Package)`
             } else { 
                price = Math.max(0, Number(item.price) || Number(puja.price) || 0)
                name = name || `🪔 ${puja.name}`
             }
          } else { 
             price = Math.max(0, Number(item.price) || 0)
             name = name || '🪔 Sacred Puja Booking'
          }
       } 
       else if (item.id.startsWith('addon-')) {
          if (item.id === 'addon-dakshina') {
             price = Math.max(1, Number(item.price) || 0)
             name = '🙏 Pandit Dakshina (पंडित दक्षिणा)'
          } else if (item.id === 'addon-courier') {
             price = 99
             name = '📦 Prasad Courier / Delivery Fee (प्रसाद कूरियर शुल्क)'
          } else if (item.id.startsWith('addon-bhaktiSeva-')) {
             const offeringId = item.id.replace('addon-bhaktiSeva-', '')
             const offering = bhaktiSevaOfferings.find(o => o.id === offeringId)
             if (offering && Number(offering.price) > 0) {
                price = Number(offering.price)
                name = `🪔 BhaktiSeva: ${offering.name}`
             } else {
                price = Math.max(1, Number(item.price) || 0)
                name = name || '🪔 Sacred BhaktiSeva Offering'
             }
          } else {
             const addonPrices: Record<string, number> = { 'addon-courier': 99 }
             price = addonPrices[item.id] || Number(item.price) || 0
             name = name || 'Sacred Add-on Service'
          }
       }
       else if (item.id.startsWith('tool-')) {
          const toolId = item.id.replace('tool-', '')
          const spiritualTool = await prisma.spiritualTool.findUnique({ where: { id: toolId } })
          if (spiritualTool && Number(spiritualTool.price) > 0) {
             price = Number(spiritualTool.price)
             name = `🔮 Premium Tool: ${spiritualTool.name}`
          } else {
             price = Math.max(1, Number(item.price) || 0)
             name = name || 'Spiritual Tool Access'
          }
       }
       else {
          const product = products.find((p: any) => p.id === item.id)
          if (product) {
             price = Number((product as any).salePrice || product.price) || 0
             name = product.name
             productId = product.id
          } else {
             price = Number(item.price) || 0
             name = name || 'Spiritual Product'
          }
       }

       if (!name || name === 'Unknown Item') {
          name = '🪔 Sacred Puja Booking / Item'
       }

       const quantity = Number(item.quantity)
       if (isNaN(quantity) || quantity <= 0) throw new Error(`Invalid quantity for ${item.id}`)
       
       const itemTotal = price * quantity
       subtotal += itemTotal
       orderItemsData.push({ productId, name, price, quantity, total: itemTotal })
    }


    // Physical product subtotal calculation (only items with productId)
    const productSubtotal = orderItemsData
      .filter((item: any) => item.productId)
      .reduce((sum: number, item: any) => sum + item.total, 0)

    const deliveryEnabledStr = await getSetting('delivery.enabled', 'true')
    const deliveryFeeStr = await getSetting('delivery.fee', '99')
    const freeThresholdStr = await getSetting('delivery.free_threshold', '999')

    const deliveryEnabled = deliveryEnabledStr !== 'false'
    const deliveryFee = (deliveryFeeStr !== '' && !isNaN(Number(deliveryFeeStr)) && Number(deliveryFeeStr) >= 0) ? Number(deliveryFeeStr) : 99
    const freeThreshold = (freeThresholdStr !== '' && !isNaN(Number(freeThresholdStr)) && Number(freeThresholdStr) >= 0) ? Number(freeThresholdStr) : 999

    let shipping = 0
    if (deliveryEnabled && productSubtotal > 0 && deliveryFee > 0 && productSubtotal < freeThreshold) {
      shipping = deliveryFee
    } else {
      shipping = 0
    }


    let discountAmount = 0
    let validCouponId: string | null = null

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.trim().toUpperCase() } })
      if (coupon && coupon.isActive) {
        // Validate
        let isValid = true
        if (coupon.startsAt && new Date() < coupon.startsAt) isValid = false
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) isValid = false
        if (coupon.minAmount && subtotal < Number(coupon.minAmount)) isValid = false
        
        if (isValid) {
          validCouponId = coupon.id
          const val = Number(coupon.discountValue)
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (subtotal * val) / 100
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
              discountAmount = Number(coupon.maxDiscount)
            }
          } else {
            discountAmount = val
          }
          if (discountAmount > subtotal) discountAmount = subtotal
        }
      }
    }

    const total = Math.max(0, subtotal - discountAmount + shipping)


    // 2. Resolve or Upsert DB User Record
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

    // Save Address
    const savedAddress = await prisma.address.create({
      data: {
        userId: dbUserId,
        type: 'SHIPPING',
        fullName: shippingAddress.name,
        phone: shippingAddress.phone,
        line1: shippingAddress.street || shippingAddress.line1 || '',
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: 'India',
        isDefault: false
      }
    })

    // 3. Create Order
    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000)
    const dbOrder = await prisma.order.create({
      data: {
        orderNumber,
        userId: dbUserId,
        subtotal,
        tax: 0,
        shipping: shipping,
        discount: discountAmount,
        total,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        couponId: validCouponId,
        notes: notes || null,
        shippingAddressId: savedAddress.id,
        items: { create: orderItemsData }
      }
    })

    // 4. Razorpay Payment Gateway integration
    const isExplicitManual = body.paymentMethod === 'cod' || body.paymentMethod === 'manual'

    if (total === 0) {
      await prisma.order.update({
        where: { id: dbOrder.id },
        data: { status: 'PROCESSING', paymentStatus: 'SUCCESS' }
      })
      if (validCouponId) {
        await prisma.coupon.update({
          where: { id: validCouponId },
          data: { usedCount: { increment: 1 } }
        }).catch(() => {})
      }
      return NextResponse.json({
        ok: true,
        mode: 'manual',
        orderId: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
        total: 0,
        message: 'आपका ऑर्डर (नि:शुल्क / 100% डिस्काउंट) सफलतापूर्वक दर्ज हो गया है!'
      });
    }

    if (isExplicitManual) {
      // Update order status to CONFIRMED for Cash on Delivery
      // paymentStatus stays PENDING until delivery collection
      await prisma.order.update({
        where: { id: dbOrder.id },
        data: {
          status: 'CONFIRMED',
          notes: (notes ? notes + ' | ' : '') + 'Payment: Cash on Delivery (COD)'
        }
      })

      // Create a COD payment record for tracking
      await prisma.payment.create({
        data: {
          userId: dbUserId,
          orderId: dbOrder.id,
          amount: total,
          currency: 'INR',
          gateway: 'COD',
          status: 'PENDING',
          metadata: { paymentType: 'cod', orderNumber: dbOrder.orderNumber }
        }
      }).catch(() => {})

      if (validCouponId) {
        await prisma.coupon.update({
          where: { id: validCouponId },
          data: { usedCount: { increment: 1 } }
        }).catch(e => console.error('[Coupon] Failed to increment usedCount:', e))
      }

      // Trigger WhatsApp Notification for Order Placed
      const { sendWhatsAppNotification } = await import('@/lib/whatsapp')
      sendWhatsAppNotification({
        type: 'ORDER_SUCCESS',
        phone: shippingAddress.phone || user.email,
        name: shippingAddress.name || user.fullName || 'Devotee',
        details: {
          orderNumber: dbOrder.orderNumber,
          amount: total,
          items: orderItemsData.map((i: any) => i.name).join(', ')
        }
      }).catch(() => {})

      return NextResponse.json({
        ok: true,
        mode: 'manual',
        orderId: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
        total,
        paymentMethod: 'cod',
        message: 'आपका ऑर्डर COD (Cash on Delivery) के रूप में कन्फर्म हो गया है! डिलीवरी पर भुगतान करें।'
      });
    }

    try {
      const { getRazorpay, getRazorpayKeys } = await import('@/lib/razorpay')
      const razorpay = await getRazorpay()
      const { key_id: rzpKeyId } = await getRazorpayKeys()

      const amountInPaise = Math.max(100, Math.round(total * 100))
      const rzpOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: dbOrder.id,
        notes: { paymentType: 'product_order', orderId: dbOrder.id, userId: dbUserId }
      })

      if (validCouponId) {
        await prisma.coupon.update({
          where: { id: validCouponId },
          data: { usedCount: { increment: 1 } }
        }).catch(e => console.error('[Coupon] Failed to increment usedCount:', e))
      }

      const paymentRecord = await prisma.payment.create({
        data: {
          userId: dbUserId,
          orderId: dbOrder.id,
          amount: total,
          currency: 'INR',
          gateway: 'RAZORPAY',
          gatewayOrderId: rzpOrder.id,
          status: 'PENDING',
          metadata: { paymentType: 'product_order', orderId: dbOrder.id }
        }
      }).catch(e => { console.error('[Orders] Failed to create payment record:', e.message); return null })

      return NextResponse.json({
        ok: true,
        mode: 'razorpay',
        orderNumber: dbOrder.orderNumber,
        paymentData: {
          orderId: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          receipt: rzpOrder.receipt,
          razorpayKeyId: rzpKeyId,
          paymentId: paymentRecord?.id || null,
        }
      });
    } catch (rzpErr: any) {
      const errorMsg = rzpErr?.error?.description || rzpErr?.message || 'Failed to initialize Razorpay payment'
      console.error('================ Razorpay Order Creation Error ================')
      console.error('Error Details:', rzpErr)
      console.error('================================================================')
      
      // Fallback: If Razorpay API keys are missing or unconfigured, place order as COD / Manual
      await prisma.order.update({
        where: { id: dbOrder.id },
        data: {
          status: 'CONFIRMED',
          notes: (notes ? notes + ' | ' : '') + 'Payment: Cash on Delivery (COD) [Razorpay Fallback]'
        }
      }).catch(() => {})

      if (validCouponId) {
        await prisma.coupon.update({
          where: { id: validCouponId },
          data: { usedCount: { increment: 1 } }
        }).catch(() => {})
      }

      return NextResponse.json({
        ok: true,
        mode: 'manual',
        orderId: dbOrder.id,
        orderNumber: dbOrder.orderNumber,
        total,
        paymentMethod: 'cod',
        message: 'आपका ऑर्डर COD (Cash on Delivery) के रूप में दर्ज हो गया है! डिलीवरी पर भुगतान करें।'
      });
    }
  } catch (err: any) {
// console.error('[API_ORDERS_ERROR]', err) (removed for production)
    return NextResponse.json({ ok: false, error: err?.message || 'Internal Server Error' }, { status: 500 });
  }
}


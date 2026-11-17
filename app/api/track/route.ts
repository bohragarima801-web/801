import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const query = String(body?.query || '').trim()

    if (!query || query.length < 4) {
      return NextResponse.json(
        { success: false, message: 'कृपया मान्य बुकिंग नंबर, ऑर्डर नंबर या 10 अंकों का मोबाइल नंबर दर्ज करें।' },
        { status: 400 }
      )
    }

    // Clean query
    const cleanDigits = query.replace(/\D/g, '')
    const isPhoneNumber = cleanDigits.length >= 10
    const normalizedPhone = isPhoneNumber ? cleanDigits.slice(-10) : ''

    // 1. Search Bookings
    const bookingWhere: any = {
      OR: [
        { bookingNumber: { equals: query, mode: 'insensitive' } },
        { id: { equals: query } },
      ]
    }

    if (normalizedPhone) {
      bookingWhere.OR.push(
        { user: { phone: { contains: normalizedPhone } } }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: bookingWhere,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        puja: {
          select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            temple: { select: { name: true, location: true } }
          }
        },
        pandit: {
          select: {
            name: true,
            experience: true,
            avatar: true
          }
        },
        members: true,
        certificate: {
          select: {
            certificateNo: true,
            pdfUrl: true,
            issuedAt: true
          }
        },
        invoices: {
          take: 1,
          select: {
            invoiceNumber: true,
            pdfUrl: true
          }
        }
      }
    })

    // 2. Search Orders (Store Products)
    const orderWhere: any = {
      OR: [
        { orderNumber: { equals: query, mode: 'insensitive' } },
        { id: { equals: query } },
      ]
    }

    if (normalizedPhone) {
      orderWhere.OR.push(
        { user: { phone: { contains: normalizedPhone } } }
      )
    }

    const orders = await prisma.order.findMany({
      where: orderWhere,
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { take: 1, select: { url: true } }
              }
            }
          }
        },
        shipping_: true,
        shippingAddress: true,
        invoices: {
          take: 1,
          select: {
            invoiceNumber: true,
            pdfUrl: true
          }
        }
      }
    })

    if (bookings.length === 0 && orders.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'इस विवरण से कोई बुकिंग या ऑर्डर नहीं मिला। कृपया अपना बुकिंग/ऑर्डर नंबर या पंजीकृत मोबाइल नंबर जांचें।'
      }, { status: 404 })
    }

    // Format Bookings
    const formattedBookings = bookings.map(b => {
      let step = 1 // 1: Booked, 2: Pandit Assigned, 3: Completed, 4: Prasad/Video Sent
      if (b.status === 'COMPLETED') {
        step = b.certificate?.pdfUrl || b.pdfUrl ? 4 : 3
      } else if (b.panditId || b.scheduledAt) {
        step = 2
      } else if (b.status === 'CONFIRMED') {
        step = 1
      }

      return {
        type: 'PUJA_BOOKING',
        id: b.id,
        number: b.bookingNumber,
        title: b.puja?.name || 'विशेष पूजा एवं अनुष्ठान',
        temple: b.puja?.temple?.name || 'माँ कात्यायनी शक्तिपीठ',
        location: b.puja?.temple?.location || 'जोधपुर, राजस्थान',
        slug: b.puja?.slug,
        image: b.puja?.image || '/placeholder-puja.jpg',
        date: b.createdAt,
        scheduledAt: b.scheduledAt,
        status: b.status,
        paymentStatus: b.paymentStatus,
        total: Number(b.total),
        gotra: b.gotra,
        sankalpText: b.sankalpText,
        members: b.members.map(m => ({ name: m.fullName, gotra: m.gotra })),
        panditName: b.pandit?.name || 'वरिष्ठ वैदिक आचार्य',
        step,
        pdfUrl: b.certificate?.pdfUrl || b.pdfUrl || b.invoices[0]?.pdfUrl || null,
        invoiceNumber: b.invoices[0]?.invoiceNumber || null
      }
    })

    // Format Orders
    const formattedOrders = orders.map(o => {
      let step = 1 // 1: Placed, 2: Processing, 3: Shipped, 4: Delivered
      if (o.status === 'DELIVERED') {
        step = 4
      } else if (o.status === 'SHIPPED') {
        step = 3
      } else if (o.status === 'PROCESSING' || o.status === 'CONFIRMED') {
        step = 2
      }

      return {
        type: 'PRODUCT_ORDER',
        id: o.id,
        number: o.orderNumber,
        title: o.items.map(i => i.product?.name).filter(Boolean).join(', ') || 'पवित्र प्रसाद व पूजा सामग्री',
        image: o.items[0]?.product?.images[0]?.url || '/placeholder-product.jpg',
        date: o.createdAt,
        status: o.status,
        paymentStatus: o.paymentStatus,
        total: Number(o.total),
        step,
        shippingProvider: o.shipping_?.provider || null,
        trackingNumber: o.shipping_?.trackingNumber || null,
        trackingUrl: o.shipping_?.trackingUrl || null,
        invoiceNumber: o.invoices[0]?.invoiceNumber || null,
        pdfUrl: o.invoices[0]?.pdfUrl || null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        bookings: formattedBookings,
        orders: formattedOrders
      }
    })
  } catch (error: any) {
    console.error('Tracking API error:', error)
    return NextResponse.json(
      { success: false, message: 'ट्रैकिंग जानकारी प्राप्त करने में त्रुटि हुई। कृपया पुनः प्रयास करें।' },
      { status: 500 }
    )
  }
}

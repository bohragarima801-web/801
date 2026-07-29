import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null)
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '20'))
    const skip = (page - 1) * limit

    // Resolve DB user
    let dbUserId = user.id
    if (dbUserId === 'admin-system-id' || dbUserId.length > 36) {
      const dbUser = await prisma.user.findFirst({ where: { email: user.email } })
      if (!dbUser) return NextResponse.json({ ok: true, data: [], total: 0 })
      dbUserId = dbUser.id
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { userId: dbUserId },
        skip,
        take: limit,
        include: {
          puja: { select: { name: true, coverImage: true, slug: true } },
          members: { select: { fullName: true, relation: true } },
          payments: {
            select: { status: true, gatewayRef: true, paidAt: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          certificate: { select: { url: true, number: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.count({ where: { userId: dbUserId } }),
    ])

    return NextResponse.json({
      ok: true,
      data: bookings.map(b => ({
        id: b.id,
        bookingNumber: b.bookingNumber,
        status: b.status,
        paymentStatus: b.paymentStatus,
        pujaName: b.puja?.name || 'Puja',
        pujaCover: b.puja?.coverImage || null,
        pujaSlug: b.puja?.slug || null,
        total: Number(b.total),
        memberCount: b.memberCount,
        members: b.members,
        gotra: b.gotra,
        sankalpText: b.sankalpText,
        scheduledAt: b.scheduledAt,
        completedAt: b.completedAt,
        payment: b.payments[0] || null,
        certificate: b.certificate || null,
        createdAt: b.createdAt,
      })),
      total,
      page,
      limit,
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch bookings' }, { status: 500 })
  }
}

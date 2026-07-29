import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

// GET /api/admin/bookings/[id] — single booking detail
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
        puja: { select: { name: true, coverImage: true } },
        pandit: { select: { user: { select: { fullName: true } } } },
        temple: { select: { name: true } },
        members: true,
        payments: { orderBy: { createdAt: 'desc' } },
        certificate: true,
      },
    })

    if (!booking) return NextResponse.json({ ok: false, error: 'Booking not found' }, { status: 404 })
    return NextResponse.json({ ok: true, data: booking })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch booking' }, { status: 500 })
  }
}

// PUT /api/admin/bookings/[id] — update booking (status, scheduled date, etc)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { status, paymentStatus, scheduledAt, completedAt, panditId, notes } = body

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(paymentStatus && { paymentStatus }),
        ...(scheduledAt !== undefined && { scheduledAt: scheduledAt ? new Date(scheduledAt) : null }),
        ...(completedAt !== undefined && { completedAt: completedAt ? new Date(completedAt) : null }),
        ...(panditId !== undefined && { panditId }),
        ...(notes !== undefined && { specialInstructions: notes }),
      },
    })

    return NextResponse.json({ ok: true, data: booking })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update booking' }, { status: 500 })
  }
}

// DELETE /api/admin/bookings/[id] — delete booking
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    // Remove linked records first
    await prisma.bookingMember.deleteMany({ where: { bookingId: id } }).catch(() => {})
    await prisma.certificate.deleteMany({ where: { bookingId: id } }).catch(() => {})

    await prisma.booking.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Booking deleted' })
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: Has linked records. Cancel first.' }, { status: 400 })
    }
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete booking' }, { status: 500 })
  }
}

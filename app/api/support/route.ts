import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const tickets = await prisma.supportTicket.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    })

    return NextResponse.json({ ok: true, data: tickets })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch tickets' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { subject, description, category } = await req.json()

    if (!subject || !description) {
      return NextResponse.json({ ok: false, error: 'Subject and description are required' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,
        subject,
        description,
        category: category || 'General',
        ticketNumber: `TKT-${Math.floor(100000 + Math.random() * 900000)}`
      },
      include: { messages: true }
    })

    // Trigger WhatsApp Notification for Support Ticket Query
    try {
      const { sendWhatsAppNotification } = await import('@/lib/whatsapp')
      sendWhatsAppNotification({
        type: 'QUERY_SUBMITTED',
        phone: user.email,
        name: user.fullName || 'Devotee',
        details: {
          querySubject: subject
        }
      }).catch(() => {})
    } catch (e) {}

    return NextResponse.json({ ok: true, data: ticket });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to submit ticket' }, { status: 500 });
  }
}

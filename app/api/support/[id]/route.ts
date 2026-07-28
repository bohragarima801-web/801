import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET /api/support/[id] — Get single ticket with all messages
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const ticket = await prisma.supportTicket.findFirst({
      where: { id, userId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: { user: { select: { fullName: true, avatar: true } } }
        }
      }
    })

    if (!ticket) return NextResponse.json({ ok: false, error: 'Ticket not found' }, { status: 404 })
    return NextResponse.json({ ok: true, data: ticket })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

// POST /api/support/[id] — Add reply to ticket
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const { message } = await req.json()
    if (!message?.trim()) return NextResponse.json({ ok: false, error: 'Message is required' }, { status: 400 })

    // Verify ticket belongs to user
    const ticket = await prisma.supportTicket.findFirst({ where: { id, userId: user.id } })
    if (!ticket) return NextResponse.json({ ok: false, error: 'Ticket not found' }, { status: 404 })

    const reply = await prisma.ticketMessage.create({
      data: {
        ticketId: id,
        userId: user.id,
        message: message.trim(),
        isInternal: false,
      },
      include: { user: { select: { fullName: true, avatar: true } } }
    })

    // Reopen ticket if it was closed
    if (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') {
      await prisma.supportTicket.update({
        where: { id },
        data: { status: 'OPEN' }
      })
    }

    return NextResponse.json({ ok: true, data: reply })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

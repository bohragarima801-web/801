import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { eventName, pageUrl, metadata } = body

    if (!eventName) {
      return NextResponse.json({ ok: false, error: 'Event name is required' }, { status: 400 })
    }

    const h = await headers()
    const forwardedFor = h.get('x-forwarded-for') || ''
    const userIp = forwardedFor.split(',')[0].trim() || h.get('x-real-ip') || '0.0.0.0'
    const userAgent = h.get('user-agent') || ''

    const event = await prisma.analyticsEvent.create({
      data: {
        eventName,
        pageUrl: pageUrl || '/',
        userIp,
        userAgent,
        metadata: metadata || {},
      },
    })

    return NextResponse.json({ ok: true, id: event.id })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

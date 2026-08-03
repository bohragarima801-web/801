import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { eventName, pageUrl, metadata } = body

    if (!eventName) {
      return NextResponse.json({ ok: false, error: 'Event name is required' }, { status: 400 })
    }

    const h = await headers()
    const forwardedFor = h.get('x-forwarded-for') || ''
    const userIp = forwardedFor.split(',')[0].trim() || h.get('x-real-ip') || '0.0.0.0'
    const userAgent = h.get('user-agent') || ''

    let id = `event-${Date.now()}`
    try {
      const log = await prisma.auditLog.create({
        data: {
          action: `ANALYTICS_${eventName}`,
          resource: 'AnalyticsEvent',
          resourceId: (pageUrl || '/').slice(0, 190),
          ipAddress: userIp,
          userAgent: userAgent.slice(0, 255),
          metadata: { eventName, pageUrl, ...(metadata || {}) }
        }
      })
      id = log.id
    } catch {
      console.log(`[Analytics Event]: ${eventName} on ${pageUrl}`)
    }

    return NextResponse.json({ ok: true, id })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Analytics error' }, { status: 500 })
  }
}


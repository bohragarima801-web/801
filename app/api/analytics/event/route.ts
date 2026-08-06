import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

import { sendMetaCapiEvent } from '@/lib/meta-capi'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { eventName, eventId, pageUrl, fbp: bodyFbp, fbc: bodyFbc, userData, metadata } = body

    if (!eventName) {
      return NextResponse.json({ ok: false, error: 'Event name is required' }, { status: 400 })
    }

    const h = await headers()
    const forwardedFor = h.get('x-forwarded-for') || ''
    const userIp = forwardedFor.split(',')[0].trim() || h.get('x-real-ip') || '0.0.0.0'
    const userAgent = h.get('user-agent') || ''

    // Parse fbp/fbc cookies from Cookie header if not passed in body
    const cookieHeader = h.get('cookie') || ''
    const cookieFbp = bodyFbp || (cookieHeader.match(/_fbp=([^;]+)/)?.[1] ? decodeURIComponent(cookieHeader.match(/_fbp=([^;]+)/)![1]) : null)
    const cookieFbc = bodyFbc || (cookieHeader.match(/_fbc=([^;]+)/)?.[1] ? decodeURIComponent(cookieHeader.match(/_fbc=([^;]+)/)![1]) : null)

    // Trigger Meta CAPI Server-Side Event asynchronously
    const capiPromise = sendMetaCapiEvent({
      eventName,
      eventId: eventId || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      eventSourceUrl: pageUrl || 'https://divyayagyam.com',
      userData: {
        clientIp: userIp !== '0.0.0.0' ? userIp : undefined,
        userAgent: userAgent || undefined,
        fbp: cookieFbp || undefined,
        fbc: cookieFbc || undefined,
        ...(userData || {})
      },
      customData: metadata || {}
    }).catch((err) => {
      console.warn('[Analytics API] CAPI dispatch warning:', err?.message || err)
    })

    let id = `event-${Date.now()}`
    try {
      const log = await prisma.auditLog.create({
        data: {
          action: `ANALYTICS_${eventName}`,
          resource: 'AnalyticsEvent',
          resourceId: (pageUrl || '/').slice(0, 190),
          ipAddress: userIp,
          userAgent: userAgent.slice(0, 255),
          metadata: { eventName, eventId, pageUrl, ...(metadata || {}) }
        }
      })
      id = log.id
    } catch {
      console.log(`[Analytics Event]: ${eventName} on ${pageUrl}`)
    }

    // Await CAPI result to return diagnostic status
    const capiRes: any = await capiPromise

    return NextResponse.json({ ok: true, id, capiSent: !!capiRes?.success, capiError: capiRes?.error })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Analytics error' }, { status: 500 })
  }
}



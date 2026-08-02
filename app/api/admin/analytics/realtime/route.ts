import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/admin-session'

export async function GET() {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000)
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    // 1. Live Active Visitors (unique IPs in last 5 minutes)
    const activeVisitorsRaw = await prisma.analyticsEvent.groupBy({
      by: ['userIp'],
      where: {
        createdAt: {
          gte: fiveMinsAgo,
        },
      },
    })
    const liveActiveVisitors = activeVisitorsRaw.length

    // 2. Today's Total PageViews & Events
    const totalTodayEvents = await prisma.analyticsEvent.count({
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    })

    // 3. Event Counts by Type Today
    const eventsBreakdown = await prisma.analyticsEvent.groupBy({
      by: ['eventName'],
      _count: { id: true },
      where: {
        createdAt: {
          gte: startOfToday,
        },
      },
    })

    // 4. Live Recent Event Stream (last 20 events)
    const recentEvents = await prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    // 5. Website Pixel Config Status
    const pixelSettings = await prisma.websiteSetting.findMany({
      where: {
        key: {
          in: [
            'pixel.facebook_id',
            'pixel.google_analytics_id',
            'pixel.google_tag_manager_id',
            'pixel.custom_head_scripts',
          ],
        },
      },
    })

    const pixelStatus = {
      facebook: pixelSettings.some((s) => s.key === 'pixel.facebook_id' && (s.value as any)?.length > 0),
      googleAnalytics: pixelSettings.some((s) => s.key === 'pixel.google_analytics_id' && (s.value as any)?.length > 0),
      googleTagManager: pixelSettings.some((s) => s.key === 'pixel.google_tag_manager_id' && (s.value as any)?.length > 0),
      customScripts: pixelSettings.some((s) => s.key === 'pixel.custom_head_scripts' && (s.value as any)?.length > 0),
    }

    return NextResponse.json({
      ok: true,
      data: {
        liveActiveVisitors,
        totalTodayEvents,
        eventsBreakdown: eventsBreakdown.map((e) => ({ event: e.eventName, count: e._count.id })),
        recentEvents,
        pixelStatus,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

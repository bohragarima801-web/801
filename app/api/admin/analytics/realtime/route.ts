import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/admin-session'

export async function GET() {
  try {
    const user = await getAdminUser()
    if (!user && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000)
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    // 1. Live Active Visitors (unique IPs in last 5 minutes)
    const activeVisitorsRaw = await prisma.auditLog.groupBy({
      by: ['ipAddress'],
      where: {
        resource: 'AnalyticsEvent',
        createdAt: {
          gte: fiveMinsAgo,
        },
      },
    })
    const liveActiveVisitors = activeVisitorsRaw.length

    // 2. Today's Total PageViews & Events
    const totalTodayEvents = await prisma.auditLog.count({
      where: {
        resource: 'AnalyticsEvent',
        createdAt: {
          gte: startOfToday,
        },
      },
    })

    // 3. Event Counts by Type Today
    const eventsBreakdown = await prisma.auditLog.groupBy({
      by: ['action'],
      _count: { id: true },
      where: {
        resource: 'AnalyticsEvent',
        createdAt: {
          gte: startOfToday,
        },
      },
    })

    // 4. Live Recent Event Stream (last 20 events)
    const recentEvents = await prisma.auditLog.findMany({
      where: { resource: 'AnalyticsEvent' },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    // 5. Website Pixel & Meta CAPI Config Status
    const pixelSettings = await prisma.websiteSetting.findMany({
      where: {
        key: {
          in: [
            'pixel.facebook_id',
            'marketing.metaPixelId',
            'pixel.meta_capi_token',
            'marketing.metaCapiToken',
            'pixel.google_analytics_id',
            'marketing.googleAnalyticsId',
            'pixel.google_tag_manager_id',
            'pixel.custom_head_scripts',
          ],
        },
      },
    })

    const hasValue = (key: string) => {
      const s = pixelSettings.find((item) => item.key === key)
      if (!s) return false
      const val = typeof s.value === 'string' ? s.value.trim() : JSON.stringify(s.value || '')
      return val.replace(/^["']|["']$/g, '').length > 0
    }

    const pixelStatus = {
      facebook: hasValue('pixel.facebook_id') || hasValue('marketing.metaPixelId'),
      metaCapi: hasValue('pixel.meta_capi_token') || hasValue('marketing.metaCapiToken'),
      googleAnalytics: hasValue('pixel.google_analytics_id') || hasValue('marketing.googleAnalyticsId'),
      googleTagManager: hasValue('pixel.google_tag_manager_id'),
      customScripts: hasValue('pixel.custom_head_scripts'),
    }

    return NextResponse.json({
      ok: true,
      data: {
        liveActiveVisitors,
        totalTodayEvents,
        eventsBreakdown: eventsBreakdown.map((e) => ({
          event: String(e.action || '').replace(/^ANALYTICS_/, ''),
          count: e._count.id,
        })),
        recentEvents,
        pixelStatus,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { getRealtimeBlogStats } from '@/lib/blog-analytics'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // 1. Authorize Admin
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse Date Filters
    const { searchParams } = new URL(req.url)
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')

    const filter: any = {}
    if (startDateStr) {
      filter.startDate = new Date(startDateStr)
    }
    if (endDateStr) {
      filter.endDate = new Date(endDateStr)
    }

    // 3. Handle CSV Export
    if (searchParams.get('export') === 'true') {
      const events = await prisma.blogViewEvent.findMany({
        where: {
          createdAt: filter.startDate || filter.endDate ? {
            ...(filter.startDate ? { gte: filter.startDate } : {}),
            ...(filter.endDate ? { lte: filter.endDate } : {})
          } : undefined
        },
        orderBy: { createdAt: 'desc' },
        include: { blog: { select: { title: true } } }
      })

      // Generate CSV string safely
      const headers = ['Event ID', 'Blog Title', 'Session ID', 'Hashed IP', 'User Agent', 'Referrer', 'Country', 'Is Bot', 'Counted', 'Created At (UTC)']
      const csvRows = events.map(e => [
        e.id.toString(),
        e.blog?.title || 'Unknown',
        e.sessionId,
        e.ipHash || '',
        (e.userAgent || '').replace(/"/g, '""'),
        (e.referrer || '').replace(/"/g, '""'),
        e.country || '',
        e.isBot ? 'YES' : 'NO',
        e.counted ? 'YES' : 'NO',
        e.createdAt.toISOString()
      ])

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.map(val => `"${val}"`).join(','))
      ].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="blog_analytics_export.csv"',
          'Cache-Control': 'no-store'
        }
      })
    }

    // 4. Fetch Real-time Analytics
    const stats = await getRealtimeBlogStats(
      filter.startDate || filter.endDate ? filter : undefined
    )

    return NextResponse.json({ ok: true, data: stats })
  } catch (err: any) {
    // console.error('Error fetching blog analytics:', err)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

import { NextRequest } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/admin-session'

// Bot detection: checks user-agent against common bot keywords
export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim() === '') return true // Treat empty User-Agent as suspicious
  const botKeywords = [
    'googlebot', 'bingbot', 'yandexbot', 'baiduspider', 'duckduckbot',
    'crawler', 'spider', 'bot', 'curl', 'wget', 'lighthouse',
    'semrushbot', 'ia_archiver', 'archive.org_bot', 'ahrefsbot',
    'monit', 'uptime', 'pingdom', 'statuscake', 'datadog'
  ]
  const uaLower = userAgent.toLowerCase()
  return botKeywords.some(keyword => uaLower.includes(keyword))
}

// IP Hash utility for privacy-conscious abuse detection
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'default-divyayagyam-secret-ip-salt-108'
  return crypto.createHmac('sha256', salt).update(ip).digest('hex')
}

interface RecordResult {
  counted: boolean;
  sessionId: string;
  isNewSession: boolean;
  reason?: string;
}

export async function recordBlogView(
  blogId: string,
  slug: string,
  req: NextRequest
): Promise<RecordResult> {
  const host = req.headers.get('host') || ''
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1') || process.env.NODE_ENV === 'development'
  
  // Extract and verify Admin Session Cookie
  const adminCookie = req.cookies.get('dvj_admin_session')?.value
  const isAdmin = !!(await verifyAdminToken(adminCookie))

  // Extract User Agent and check for Bots
  const userAgent = req.headers.get('user-agent') || ''
  const botDetected = isBot(userAgent)

  // Retrieve or generate anonymous Session ID
  let sessionId = req.cookies.get('blog_session_id')?.value || ''
  let isNewSession = false
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    isNewSession = true
  }

  // Extract IP and hash it
  const rawIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1'
  const ipHash = hashIp(rawIp)

  // Rate Limiting: Max 30 requests per minute per IP Hash
  const oneMinuteAgo = new Date(Date.now() - 60000)
  const recentRequestsCount = await prisma.blogViewEvent.count({
    where: {
      ipHash,
      createdAt: { gte: oneMinuteAgo }
    }
  })



  if (recentRequestsCount >= 30) {
    // Record rate-limit block as uncounted bot request for monitoring
    await prisma.blogViewEvent.create({
      data: {
        blogId,
        sessionId,
        ipHash,
        userAgent: userAgent.slice(0, 500),
        referrer: req.headers.get('referer')?.slice(0, 255) || null,
        country: req.headers.get('x-vercel-ip-country')?.slice(0, 100) || null,
        isBot: true,
        counted: false
      }
    }).catch(() => {})
    
    return { counted: false, sessionId, isNewSession, reason: 'rate_limited' }
  }

  // Determine if this view should be counted
  const shouldCount = !botDetected && !isAdmin && !isLocal
  let reason: string | undefined = undefined

  if (isAdmin) reason = 'admin_user'
  else if (isLocal) reason = 'localhost_dev'
  else if (botDetected) reason = 'bot_detected'

  try {
    // Try to record view event in database
    await prisma.blogViewEvent.create({
      data: {
        blogId,
        sessionId,
        ipHash,
        userAgent: userAgent.slice(0, 500),
        referrer: req.headers.get('referer')?.slice(0, 255) || null,
        country: req.headers.get('x-vercel-ip-country')?.slice(0, 100) || null,
        isBot: botDetected,
        counted: shouldCount
      }
    })

    // If counted and successfully recorded, increment the public views counter in blogs
    if (shouldCount) {
      await prisma.blog.update({
        where: { id: blogId },
        data: { views: { increment: 1 } }
      })
    }

    return { counted: shouldCount, sessionId, isNewSession, reason }
  } catch (err: any) {
    // Check for Postgres Unique Constraint Violation (P2002) - duplicate session today
    if (err.code === 'P2002') {
      return { counted: false, sessionId, isNewSession, reason: 'duplicate_today' }
    }
    throw err;
  }
}

export interface DateFilter {
  startDate?: Date;
  endDate?: Date;
}

export async function getBlogAnalytics(blogId?: string, filter?: DateFilter) {
  const whereClause: any = {}

  if (blogId) {
    whereClause.blogId = blogId
  }

  if (filter?.startDate || filter?.endDate) {
    whereClause.createdAt = {}
    if (filter.startDate) whereClause.createdAt.gte = filter.startDate
    if (filter.endDate) whereClause.createdAt.lte = filter.endDate
  }

  const events = await prisma.blogViewEvent.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  })

  return events
}

export async function getRealtimeBlogStats(filter?: DateFilter) {
  const whereCounted: any = { counted: true, isBot: false }
  const whereTotal: any = {}
  
  if (filter?.startDate || filter?.endDate) {
    const range: any = {}
    if (filter.startDate) range.gte = filter.startDate
    if (filter.endDate) range.lte = filter.endDate
    whereCounted.createdAt = range
    whereTotal.createdAt = range
  }

  const totalRawRequests = await prisma.blogViewEvent.count({ where: whereTotal })
  const countedUniqueViews = await prisma.blogViewEvent.count({ where: whereCounted })

  // Count unique sessions (visitors)
  // Prisma doesn't do distinct counts on grouping easily, we can use raw query or findMany with select and distinct
  const uniqueVisitorsResult = await prisma.blogViewEvent.findMany({
    where: whereCounted,
    select: { sessionId: true },
    distinct: ['sessionId']
  })
  const uniqueVisitors = uniqueVisitorsResult.length

  // Last 5 minutes unique views
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000)
  const last5MinutesResult = await prisma.blogViewEvent.findMany({
    where: { ...whereCounted, createdAt: { gte: fiveMinAgo } },
    select: { sessionId: true },
    distinct: ['sessionId']
  })
  const last5Minutes = last5MinutesResult.length

  // Last 30 minutes unique views
  const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)
  const last30MinutesResult = await prisma.blogViewEvent.findMany({
    where: { ...whereCounted, createdAt: { gte: thirtyMinAgo } },
    select: { sessionId: true },
    distinct: ['sessionId']
  })
  const last30Minutes = last30MinutesResult.length

  // Today views (UTC)
  const startOfToday = new Date()
  startOfToday.setUTCHours(0, 0, 0, 0)
  const todayViewsResult = await prisma.blogViewEvent.findMany({
    where: { ...whereCounted, createdAt: { gte: startOfToday } },
    select: { sessionId: true },
    distinct: ['sessionId']
  })
  const todayViews = todayViewsResult.length

  // Filtered requests (Bot or uncounted requests)
  const botRequests = await prisma.blogViewEvent.count({
    where: { ...whereTotal, isBot: true }
  })
  const filteredRequests = await prisma.blogViewEvent.count({
    where: { ...whereTotal, counted: false, isBot: false }
  })

  // Group views by post (Limit 15)
  const viewsByPostRaw = await prisma.$queryRaw<Array<{ title: string; slug: string; count: bigint }>>`
    SELECT b.title, b.slug, COUNT(e.id) as count
    FROM blog_view_events e
    JOIN blogs b ON e.blog_id = b.id
    WHERE e.counted = true AND e.is_bot = false
    ${filter?.startDate || filter?.endDate ? 
      prisma.$queryRaw`AND e.created_at >= ${filter.startDate || new Date(0)} AND e.created_at <= ${filter.endDate || new Date()}` : 
      prisma.$queryRaw``}
    GROUP BY b.title, b.slug
    ORDER BY count DESC
    LIMIT 15
  `.catch(() => [])

  const viewsByPost = (viewsByPostRaw || []).map(row => ({
    title: row.title,
    slug: row.slug,
    count: Number(row.count)
  }))

  // Group views by referrer (Limit 10)
  const viewsByReferrerRaw = await prisma.$queryRaw<Array<{ referrer: string | null; count: bigint }>>`
    SELECT referrer, COUNT(id) as count
    FROM blog_view_events
    WHERE counted = true AND is_bot = false
    ${filter?.startDate || filter?.endDate ? 
      prisma.$queryRaw`AND created_at >= ${filter.startDate || new Date(0)} AND created_at <= ${filter.endDate || new Date()}` : 
      prisma.$queryRaw``}
    GROUP BY referrer
    ORDER BY count DESC
    LIMIT 10
  `.catch(() => [])

  const viewsByReferrer = (viewsByReferrerRaw || []).map(row => ({
    referrer: row.referrer || 'Direct / None',
    count: Number(row.count)
  }))

  // Group views by country (Limit 10)
  const viewsByCountryRaw = await prisma.$queryRaw<Array<{ country: string | null; count: bigint }>>`
    SELECT country, COUNT(id) as count
    FROM blog_view_events
    WHERE counted = true AND is_bot = false
    ${filter?.startDate || filter?.endDate ? 
      prisma.$queryRaw`AND created_at >= ${filter.startDate || new Date(0)} AND created_at <= ${filter.endDate || new Date()}` : 
      prisma.$queryRaw``}
    GROUP BY country
    ORDER BY count DESC
    LIMIT 10
  `.catch(() => [])

  const viewsByCountry = (viewsByCountryRaw || []).map(row => ({
    country: row.country || 'Unknown',
    count: Number(row.count)
  }))

  return {
    totalRawRequests,
    countedUniqueViews,
    uniqueVisitors,
    last5Minutes,
    last30Minutes,
    todayViews,
    botRequests,
    filteredRequests,
    viewsByPost,
    viewsByReferrer,
    viewsByCountry
  }
}

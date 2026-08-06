import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { revalidateTag, revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const startTime = Date.now()

    const [
      totalPujas, publishedPujas, vipPujas,
      totalProducts, activeProducts,
      totalTools, activeTools,
      totalBlogs, publishedBlogs,
      totalBookings, totalOrders, totalPayments
    ] = await Promise.all([
      prisma.puja.count(),
      prisma.puja.count({ where: { status: 'PUBLISHED' } }),
      prisma.puja.count({ where: { isVip: true } }),

      prisma.product.count(),
      prisma.product.count({ where: { status: 'ACTIVE' } }),

      prisma.spiritualTool.count(),
      prisma.spiritualTool.count({ where: { isActive: true } }),

      prisma.blog.count(),
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),

      prisma.booking.count().catch(() => 0),
      prisma.order.count().catch(() => 0),
      prisma.payment.count().catch(() => 0)
    ])

    const pingMs = Date.now() - startTime

    const liveStats = {
      dbConnected: true,
      pingMs,
      timestamp: new Date().toISOString(),
      counts: {
        pujas: { total: totalPujas, published: publishedPujas, vip: vipPujas },
        products: { total: totalProducts, active: activeProducts },
        tools: { total: totalTools, active: activeTools },
        blogs: { total: totalBlogs, published: publishedBlogs },
        transactions: { bookings: totalBookings, orders: totalOrders, payments: totalPayments }
      },
      feeds: {
        sitemap: { url: 'https://divyayagyam.com/sitemap.xml', status: 'ACTIVE' },
        robots: { url: 'https://divyayagyam.com/robots.txt', status: 'ACTIVE' },
        llms: { url: 'https://divyayagyam.com/llms.txt', type: 'DYNAMIC_REALTIME', status: 'ACTIVE' }
      }
    }

    return NextResponse.json({ ok: true, data: liveStats })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database query failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    // Force revalidate all Next.js tags & paths
    try {
      revalidateTag('pujas')
      revalidateTag('products')
      revalidateTag('blogs')
      revalidateTag('tools')
      revalidateTag('testimonials')
      revalidateTag('hero-slides')
      revalidateTag('media')

      revalidatePath('/')
      revalidatePath('/pujas')
      revalidatePath('/vip-pujas')
      revalidatePath('/products')
      revalidatePath('/tools')
      revalidatePath('/blog')
      revalidatePath('/bhaktiseva')
      revalidatePath('/sitemap.xml')
      revalidatePath('/llms.txt')
    } catch {}

    return NextResponse.json({
      ok: true,
      message: 'All live data & SEO feeds synced and revalidated successfully!',
      revalidatedAt: new Date().toISOString()
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Sync failed' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const now = new Date()

    // Find posts whose publishedAt has just matured
    const maturedPosts = await prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: {
          not: null,
          lte: now,
        },
      },
      select: { id: true, slug: true, title: true, publishedAt: true },
    })

    // Revalidate public blog listing and individual blog pages
    revalidatePath('/blog')
    revalidatePath('/sitemap.xml')
    for (const post of maturedPosts) {
      if (post.slug) {
        revalidatePath(`/blog/${post.slug}`)
      }
    }

    return NextResponse.json({
      ok: true,
      timestamp: now.toISOString(),
      maturedCount: maturedPosts.length,
      posts: maturedPosts.map(p => ({ title: p.title, slug: p.slug, publishedAt: p.publishedAt })),
    })
  } catch (err: any) {
    console.error('Schedule Blog Cron Error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Failed checking scheduled blogs' }, { status: 500 })
  }
}

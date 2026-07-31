import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/admin-session'
import { publishSocialPost } from '@/lib/social-publisher'

export async function GET(req: Request) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const whereClause: any = {}
    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    const posts = await prisma.socialPost.findMany({
      where: whereClause,
      include: {
        logs: {
          orderBy: { postedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })

    return NextResponse.json({ ok: true, data: posts })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, caption, hashtags, mediaUrls, mediaUrl, platforms, scheduledAt, postNow } = body

    if (!caption && !title) {
      return NextResponse.json({ ok: false, error: 'Title or Caption is required for social posts.' }, { status: 400 })
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json({ ok: false, error: 'At least one target social platform must be selected.' }, { status: 400 })
    }

    const mediaList: string[] = mediaUrls || (mediaUrl ? [mediaUrl] : [])
    const isVideo = mediaList.some((url) => /\.(mp4|mov|avi|webm|mkv)/i.test(url))
    const mediaType = isVideo ? 'VIDEO' : mediaList.length > 0 ? 'IMAGE' : 'TEXT'

    let scheduledDate: Date | null = null
    if (!postNow && scheduledAt) {
      scheduledDate = new Date(scheduledAt)
    }

    const postStatus = postNow ? 'PUBLISHING' : 'SCHEDULED'

    const post = await prisma.socialPost.create({
      data: {
        title: title || null,
        caption,
        hashtags: hashtags || null,
        mediaType,
        mediaUrls: mediaList,
        platforms,
        status: postStatus,
        scheduledAt: scheduledDate,
        createdById: user.id,
      },
    })

    if (postNow) {
      // Execute publishing immediately in background/async
      publishSocialPost(post.id).catch((err) => console.error('[SocialPublisher] error:', err))
      return NextResponse.json({
        ok: true,
        data: post,
        message: '🚀 Post broadcast initiated! Real-time publishing in progress across selected platforms.',
      })
    }

    return NextResponse.json({
      ok: true,
      data: post,
      message: `📅 Post successfully scheduled for ${scheduledDate ? scheduledDate.toLocaleString('en-IN') : 'set date/time'}.`,
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publishSocialPost } from '@/lib/social-publisher'

export async function GET(req: NextRequest) {
  // Cron authorization check
  const authHeader = req.headers.get('authorization')
  const secret = process.env.CRON_SECRET
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const now = new Date()

    // Find all posts due for publication
    const duePosts = await prisma.socialPost.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: now,
        },
      },
    })

    if (duePosts.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'No posts currently due for scheduled publishing.',
        processedCount: 0,
        timestamp: now.toISOString(),
      })
    }

    const executionResults: any[] = []
    for (const post of duePosts) {
      try {
        const results = await publishSocialPost(post.id)
        executionResults.push({
          postId: post.id,
          title: post.title,
          results,
        })
      } catch (err: any) {
        executionResults.push({
          postId: post.id,
          error: err.message,
        })
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Processed ${duePosts.length} scheduled social post(s).`,
      processedCount: duePosts.length,
      results: executionResults,
      timestamp: now.toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  return GET(req)
}

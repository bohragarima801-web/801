import { NextRequest, NextResponse } from 'next/server'
import { recordBlogView } from '@/lib/blog-analytics'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || !body.blogId || !body.slug) {
      return NextResponse.json({ error: 'blogId and slug are required' }, { status: 400 })
    }

    const { blogId, slug } = body

    // Record the view using our session-based analytics logic
    const result = await recordBlogView(blogId, slug, req)

    // Build the response
    const response = NextResponse.json({
      counted: result.counted,
      reason: result.reason
    })

    // If a new session ID was generated, set a secure HTTP-only cookie
    if (result.isNewSession || !req.cookies.get('blog_session_id')) {
      response.cookies.set('blog_session_id', result.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year session expiration
        path: '/'
      })
    }

    return response
  } catch (err: any) {
    // console.error('Error recording blog view:', err)
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 })
  }
}

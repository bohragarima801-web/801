import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/admin-session'
import { publishSocialPost } from '@/lib/social-publisher'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const post = await prisma.socialPost.findUnique({
      where: { id },
      include: { logs: true },
    })

    if (!post) {
      return NextResponse.json({ ok: false, error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data: post })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { action } = await req.json()

    if (action === 'PUBLISH_NOW') {
      const results = await publishSocialPost(id)
      return NextResponse.json({
        ok: true,
        data: results,
        message: 'Post publish execution completed!',
      })
    }

    return NextResponse.json({ ok: false, error: 'Invalid action requested.' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await prisma.socialPost.delete({ where: { id } })

    return NextResponse.json({ ok: true, message: 'Scheduled post removed successfully.' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

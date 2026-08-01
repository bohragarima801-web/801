import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { revalidatePath, revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const folder = searchParams.get('folder')

    const where: any = {
      OR: [
        { type: 'VIDEO' },
        { folder: { in: ['Home Video', 'Live Darshan', 'Past Puja', 'Aarti & Bhajan', 'Customer Review', 'Video Gallery'] } }
      ]
    }

    if (folder && folder !== 'all') {
      where.folder = folder
    }

    const videos = await prisma.mediaLibrary.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ ok: true, data: videos })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { url, filename, folder, mimeType } = await req.json()

    if (!url) {
      return NextResponse.json({ ok: false, error: 'Video URL or file is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.email } })

    const video = await prisma.mediaLibrary.create({
      data: {
        url,
        filename: filename || 'Sacred Video',
        type: 'VIDEO',
        folder: folder || 'Home Video',
        mimeType: mimeType || (url.includes('youtube') || url.includes('youtu.be') ? 'video/youtube' : 'video/mp4'),
        size: 0,
        uploadedBy: user?.id || null,
      }
    })

    try {
      revalidatePath('/')
      revalidatePath('/pujas')
      revalidateTag('pujas')
    } catch {}

    return NextResponse.json({ ok: true, data: video })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save video' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id, filename, folder, url, mimeType } = await req.json()

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 })
    }

    const dataToUpdate: any = {}
    if (filename !== undefined) dataToUpdate.filename = filename
    if (folder !== undefined) dataToUpdate.folder = folder
    if (url !== undefined) dataToUpdate.url = url
    if (mimeType !== undefined) dataToUpdate.mimeType = mimeType

    const updated = await prisma.mediaLibrary.update({
      where: { id },
      data: dataToUpdate
    })

    try {
      revalidatePath('/')
      revalidatePath('/pujas')
      revalidateTag('pujas')
    } catch {}

    return NextResponse.json({ ok: true, data: updated })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 })
    }

    await prisma.mediaLibrary.delete({ where: { id } })

    try {
      revalidatePath('/')
      revalidatePath('/pujas')
      revalidateTag('pujas')
    } catch {}

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}


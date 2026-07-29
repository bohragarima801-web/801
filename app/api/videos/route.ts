import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
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
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({ ok: true, data: videos })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch videos' }, { status: 500 })
  }
}

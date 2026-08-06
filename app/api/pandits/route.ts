import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Public GET for fetching verified Vedic Pandits
export async function GET(req: NextRequest) {
  try {
    const pandits = await prisma.pandit.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
            phone: true,
            email: true,
          }
        }
      },
      orderBy: { rating: 'desc' }
    }).catch(() => [])

    return NextResponse.json({ ok: true, data: pandits })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch pandits' }, { status: 500 })
  }
}

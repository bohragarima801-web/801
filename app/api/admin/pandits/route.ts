import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const pandits = await prisma.pandit.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
            email: true,
            phone: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }).catch(() => [])

    return NextResponse.json({ ok: true, data: pandits })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch pandits' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { bio, experience, specialization, languages, rating, isActive, isVerified } = await req.json()

    // Find or create admin user for the pandit profile
    const panditUser = await prisma.user.findFirst({
      where: { role: { slug: 'admin' } }
    })

    if (!panditUser) {
      return NextResponse.json({ ok: false, error: 'No user record found to attach pandit profile' }, { status: 400 })
    }

    const pandit = await prisma.pandit.create({
      data: {
        userId: panditUser.id,
        bio,
        experience: Number(experience) || 10,
        specialization: Array.isArray(specialization) ? specialization : [specialization || 'Vedic Rituals'],
        languages: Array.isArray(languages) ? languages : ['Sanskrit', 'Hindi'],
        rating: Number(rating) || 5.0,
        isActive: isActive !== undefined ? !!isActive : true,
        isVerified: isVerified !== undefined ? !!isVerified : true,
      }
    })

    return NextResponse.json({ ok: true, data: pandit })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to create pandit profile' }, { status: 500 })
  }
}

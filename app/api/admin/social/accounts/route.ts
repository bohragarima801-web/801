import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminUser } from '@/lib/admin-session'

export async function GET() {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const accounts = await prisma.socialAccount.findMany({
      orderBy: { platform: 'asc' },
    })

    return NextResponse.json({ ok: true, data: accounts })
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
    const { id, platform, accountName, accountId, accessToken, refreshToken, apiSecret, webhookUrl, isActive } = body

    if (!platform || !accountName) {
      return NextResponse.json({ ok: false, error: 'Platform and Account Name are required.' }, { status: 400 })
    }

    let account
    if (id) {
      account = await prisma.socialAccount.update({
        where: { id },
        data: {
          platform,
          accountName,
          accountId,
          accessToken,
          refreshToken,
          apiSecret,
          webhookUrl,
          isActive: isActive !== undefined ? isActive : true,
        },
      })
    } else {
      // Check if account for platform exists
      const existing = await prisma.socialAccount.findFirst({
        where: { platform: platform.toUpperCase() },
      })

      if (existing) {
        account = await prisma.socialAccount.update({
          where: { id: existing.id },
          data: {
            accountName,
            accountId,
            accessToken,
            refreshToken,
            apiSecret,
            webhookUrl,
            isActive: isActive !== undefined ? isActive : true,
          },
        })
      } else {
        account = await prisma.socialAccount.create({
          data: {
            platform: platform.toUpperCase(),
            accountName,
            accountId,
            accessToken,
            refreshToken,
            apiSecret,
            webhookUrl,
            isActive: isActive !== undefined ? isActive : true,
          },
        })
      }
    }

    return NextResponse.json({ ok: true, data: account, message: 'Social account credentials saved!' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getAdminUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Account ID missing' }, { status: 400 })
    }

    await prisma.socialAccount.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Social account disconnected.' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

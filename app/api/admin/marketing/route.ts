import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

const KEYS = ['googleAnalyticsId', 'googleAdsId', 'metaPixelId', 'customHeaderScripts']

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const settings = await prisma.websiteSetting.findMany({
      where: { key: { in: KEYS.map(k => `marketing.${k}`) } }
    })

    const data: Record<string, any> = {}
    settings.forEach(s => {
      const field = s.key.replace('marketing.', '')
      data[field] = s.value
    })

    const [couponsCount, newsletterCount] = await Promise.all([
      prisma.coupon.count(),
      prisma.newsletter.count(),
    ])

    return NextResponse.json({ ok: true, data, stats: { couponsCount, newsletterCount } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json()

    const upserts = KEYS
      .filter((k) => body[k] !== undefined)
      .map((k) => prisma.websiteSetting.upsert({
        where: { key: `marketing.${k}` },
        create: { key: `marketing.${k}`, value: String(body[k] ?? ''), group: 'marketing' },
        update: { value: String(body[k] ?? '') },
      }))

    await prisma.$transaction(upserts)

    return NextResponse.json({ ok: true, message: 'Marketing configurations saved!' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save settings' }, { status: 500 });
  }
}

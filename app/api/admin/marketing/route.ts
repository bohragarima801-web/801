import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { sendMetaCapiEvent } from '@/lib/meta-capi'
import { revalidatePath, revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

const MARKETING_KEYS = [
  'googleAnalyticsId',
  'googleAdsId',
  'metaPixelId',
  'metaCapiToken',
  'metaTestEventCode',
  'customHeaderScripts',
]

const KEY_MAPPING: Record<string, string> = {
  metaPixelId: 'pixel.facebook_id',
  googleAnalyticsId: 'pixel.google_analytics_id',
  googleAdsId: 'pixel.google_ads_id',
  metaCapiToken: 'pixel.meta_capi_token',
  metaTestEventCode: 'pixel.meta_test_event_code',
  customHeaderScripts: 'pixel.custom_head_scripts',
}

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const allSearchKeys = [
      ...MARKETING_KEYS.map((k) => `marketing.${k}`),
      ...Object.values(KEY_MAPPING),
    ]

    const settings = await prisma.websiteSetting.findMany({
      where: { key: { in: allSearchKeys } },
    })

    const data: Record<string, any> = {}
    settings.forEach((s) => {
      if (s.key.startsWith('marketing.')) {
        const field = s.key.replace('marketing.', '')
        data[field] = s.value
      } else {
        // Find mapped key
        const entry = Object.entries(KEY_MAPPING).find(([_, pixelKey]) => pixelKey === s.key)
        if (entry && !data[entry[0]]) {
          data[entry[0]] = s.value
        }
      }
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

import { clearSettingCache } from '@/lib/settings'

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const body = await req.json()

    // 1. Handle CAPI Connection Test Trigger
    if (body.action === 'test_capi') {
      const forwardedFor = req.headers.get('x-forwarded-for') || ''
      const clientIp = forwardedFor.split(',')[0].trim() || req.headers.get('x-real-ip') || '127.0.0.1'
      const userAgent = req.headers.get('user-agent') || 'DivyaYagyam Admin CAPI Tester'

      const testRes = await sendMetaCapiEvent({
        eventName: 'PageView',
        eventId: `test_capi_${Date.now()}`,
        eventSourceUrl: 'https://divyayagyam.com/admin/marketing',
        userData: {
          email: session.email || 'admin@divyayagyam.com',
          fullName: (session as any)?.name || (session as any)?.fullName || 'DivyaYagyam Admin',
          clientIp,
          userAgent,
        },
        customData: {
          test_note: 'Realtime Admin Meta CAPI Health Verification',
        },
      })

      if (!testRes.success) {
        return NextResponse.json({ ok: false, error: testRes.error || 'Meta CAPI test failed', result: testRes.result }, { status: 400 })
      }

      return NextResponse.json({
        ok: true,
        message: '✅ Meta CAPI Test Event successfully sent to Meta Graph API!',
        result: testRes.result,
      })
    }

    // 2. Save Tracking Configurations
    const upsertPromises: any[] = []

    MARKETING_KEYS.forEach((k) => {
      if (body[k] !== undefined) {
        const val = String(body[k] ?? '').trim()

        // Upsert marketing.* key
        upsertPromises.push(
          prisma.websiteSetting.upsert({
            where: { key: `marketing.${k}` },
            create: { key: `marketing.${k}`, value: val, group: 'marketing' },
            update: { value: val },
          })
        )

        // Upsert mapped pixel.* key
        const mappedPixelKey = KEY_MAPPING[k]
        if (mappedPixelKey) {
          upsertPromises.push(
            prisma.websiteSetting.upsert({
              where: { key: mappedPixelKey },
              create: { key: mappedPixelKey, value: val, group: 'pixel' },
              update: { value: val },
            })
          )
        }
      }
    })

    // Also ensure pixel.events_enabled is set to 'true' if pixels exist
    if (body.metaPixelId || body.googleAnalyticsId) {
      upsertPromises.push(
        prisma.websiteSetting.upsert({
          where: { key: 'pixel.events_enabled' },
          create: { key: 'pixel.events_enabled', value: 'true', group: 'pixel' },
          update: { value: 'true' },
        })
      )
    }

    await prisma.$transaction(upsertPromises)

    clearSettingCache()
    revalidatePath('/')
    revalidatePath('/pujas')
    revalidateTag('pixel-config')

    return NextResponse.json({ ok: true, message: 'Marketing & Meta CAPI configurations saved live!' });

  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save settings' }, { status: 500 });
  }
}

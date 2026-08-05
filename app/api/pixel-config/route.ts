import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Public endpoint — returns client-safe tracking configuration
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await prisma.websiteSetting.findMany({
      where: {
        key: {
          in: [
            'pixel.facebook_id',
            'marketing.metaPixelId',
            'pixel.google_analytics_id',
            'marketing.googleAnalyticsId',
            'pixel.google_tag_manager_id',
            'pixel.google_ads_id',
            'marketing.googleAdsId',
            'pixel.tiktok_id',
            'pixel.custom_head_scripts',
            'marketing.customHeaderScripts',
            'pixel.custom_body_scripts',
            'pixel.events_enabled',
          ],
        },
      },
    })

    const raw: Record<string, string> = {}
    settings.forEach((s) => {
      const val = typeof s.value === 'string' ? s.value : JSON.stringify(s.value || '')
      raw[s.key] = val.replace(/^"|"$/g, '').trim()
    })

    const data: Record<string, any> = {
      'pixel.facebook_id': raw['pixel.facebook_id'] || raw['marketing.metaPixelId'] || '',
      'pixel.google_analytics_id': raw['pixel.google_analytics_id'] || raw['marketing.googleAnalyticsId'] || '',
      'pixel.google_ads_id': raw['pixel.google_ads_id'] || raw['marketing.googleAdsId'] || '',
      'pixel.google_tag_manager_id': raw['pixel.google_tag_manager_id'] || '',
      'pixel.tiktok_id': raw['pixel.tiktok_id'] || '',
      'pixel.custom_head_scripts': raw['pixel.custom_head_scripts'] || raw['marketing.customHeaderScripts'] || '',
      'pixel.custom_body_scripts': raw['pixel.custom_body_scripts'] || '',
      'pixel.events_enabled': raw['pixel.events_enabled'] || 'true',
    }

    return NextResponse.json({ ok: true, settings: data }, {
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    })
  } catch {
    return NextResponse.json({ ok: true, settings: {} })
  }
}

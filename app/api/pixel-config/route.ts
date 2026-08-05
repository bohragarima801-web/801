import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Public endpoint — only returns pixel/tracking settings (no secrets exposed)
// No auth required — safe to call from frontend
export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    const settings = await prisma.websiteSetting.findMany({
      where: {
        key: {
          in: [
            'pixel.facebook_id',
            'pixel.google_analytics_id',
            'pixel.google_tag_manager_id',
            'pixel.tiktok_id',
            'pixel.custom_head_scripts',
            'pixel.custom_body_scripts',
            'pixel.events_enabled',
          ]
        }
      }
    })

    const data: Record<string, any> = {}
    settings.forEach(s => {
      const val = typeof s.value === 'string' ? s.value : JSON.stringify(s.value)
      data[s.key] = val.replace(/^"|"$/g, '')
    })

    return NextResponse.json({ ok: true, settings: data }, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' }
    })
  } catch {
    return NextResponse.json({ ok: true, settings: {} })
  }
}

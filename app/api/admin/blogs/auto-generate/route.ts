import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-session'
import { generateAutoBlog } from '@/lib/auto-blog-engine'
import { getSetting, clearSettingCache } from '@/lib/settings'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // Allow up to 60s for AI blog generation (Vercel Pro/Hobby limit)

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const [enabled, publishMode] = await Promise.all([
      getSetting('autoblog.enabled', 'true'),
      getSetting('autoblog.publish_mode', 'PUBLISHED')
    ])

    return NextResponse.json({
      ok: true,
      data: {
        enabled: enabled === 'true',
        publishMode: publishMode === 'DRAFT' ? 'DRAFT' : 'PUBLISHED'
      }
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    let body: any
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ ok: false, error: 'Invalid JSON request body' }, { status: 400 })
    }
    const { action, enabled, publishMode, forceTopic } = body

    if (action === 'settings') {
      const enabledVal = enabled ? 'true' : 'false'
      const modeVal = publishMode === 'DRAFT' ? 'DRAFT' : 'PUBLISHED'

      await Promise.all([
        prisma.websiteSetting.upsert({
          where: { key: 'autoblog.enabled' },
          update: { value: JSON.stringify(enabledVal), group: 'autoblog' },
          create: { key: 'autoblog.enabled', value: JSON.stringify(enabledVal), group: 'autoblog' }
        }),
        prisma.websiteSetting.upsert({
          where: { key: 'autoblog.publish_mode' },
          update: { value: JSON.stringify(modeVal), group: 'autoblog' },
          create: { key: 'autoblog.publish_mode', value: JSON.stringify(modeVal), group: 'autoblog' }
        })
      ])

      clearSettingCache('autoblog.enabled')
      clearSettingCache('autoblog.publish_mode')

      return NextResponse.json({ ok: true, message: 'Auto-blog settings updated successfully!' })
    }

    if (action === 'generate') {
      const result = await generateAutoBlog({
        forceTopic: forceTopic || undefined,
        status: publishMode === 'DRAFT' ? 'DRAFT' : 'PUBLISHED',
        authorId: session.email,
        bypassLimit: true
      })

      if (!result.ok) {
        return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
      }

      return NextResponse.json({
        ok: true,
        message: 'Instant AI Blog Generated & Published Successfully!',
        data: result.data
      })
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to process auto-blog request' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { generateAutoBlog } from '@/lib/auto-blog-engine'
import { getSetting } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const secret = searchParams.get('secret')
    const cronHeader = req.headers.get('x-vercel-cron')

    // Optional secret verification for external cron pinging
    const expectedSecret = process.env.CRON_SECRET || 'divyayagyam_cron_2026'
    if (!cronHeader && secret !== expectedSecret) {
      // Allow trigger if auto-blogging is enabled from settings
      const isEnabled = await getSetting('autoblog.enabled', 'false')
      if (isEnabled !== 'true') {
        return NextResponse.json({ ok: false, error: 'Unauthorized or auto-blogging disabled' }, { status: 401 })
      }
    }

    // Check if auto-blog feature is enabled
    const isEnabled = await getSetting('autoblog.enabled', 'true')
    if (isEnabled === 'false') {
      return NextResponse.json({
        ok: true,
        message: 'Auto-blogging is currently turned OFF from admin panel'
      })
    }

    const result = await generateAutoBlog()
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Daily auto-blog generated successfully!',
      data: result.data
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Server error generating blog' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url)
    const group = searchParams.get('group')

    const query: any = {}
    if (group) {
      query.group = group
    }

    const settings = await prisma.websiteSetting.findMany({
      where: query
    })

    // Return as a key-value dictionary for extremely easy client binding
    const config: Record<string, any> = {}
    settings.forEach(s => {
      config[s.key] = s.value
    })

    return NextResponse.json({ ok: true, config, settings });
  } catch (err: any) {
// console.error('Settings GET Error:', err) (removed for production)
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

import { clearSettingCache } from '@/lib/settings'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json()
    const { key, value, group } = body

    if (!key) {
      return NextResponse.json({ ok: false, error: 'Setting key is required' }, { status: 400 });
    }

    const setting = await prisma.websiteSetting.upsert({
      where: { key },
      create: {
        key,
        value: value !== undefined ? value : null,
        group: group || 'general',
      },
      update: {
        value: value !== undefined ? value : null,
        group: group || undefined,
      }
    })

    // Immediately clear in-memory setting cache & revalidate Next.js cache so changes take effect LIVE!
    clearSettingCache(key)
    clearSettingCache()
    try {
      revalidateTag('pixel-config')
      revalidateTag('settings')
      revalidatePath('/', 'layout')
    } catch {}

    return NextResponse.json({ ok: true, setting, message: 'Setting updated live!' });
  } catch (err: any) {
// console.error('Settings POST Error:', err) (removed for production)
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save setting' }, { status: 500 });
  }
}

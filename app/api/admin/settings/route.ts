import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { isSuperAdminAccount } from '@/lib/rbac'
import { clearSettingCache } from '@/lib/settings'
import { revalidatePath, revalidateTag } from 'next/cache'

async function checkAdminUser() {
  const session = await getAdminSession()
  if (!session) return { ok: false as const, status: 401, error: 'Unauthorized' }

  const sessionEmail = session.email.trim().toLowerCase()
  const caller = await prisma.user.findFirst({
    where: { email: { equals: sessionEmail, mode: 'insensitive' } },
    include: { role: true }
  })

  const isSuperAdmin = isSuperAdminAccount({ email: sessionEmail, role: caller?.role })
  return { ok: true as const, isSuperAdmin, sessionEmail, caller }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await checkAdminUser()
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url)
    const group = searchParams.get('group')

    // Secrets and Payments settings groups are strictly Super Admin only
    if ((group === 'secrets' || group === 'payments') && !auth.isSuperAdmin) {
      return NextResponse.json({ ok: false, error: 'Access denied: Secrets & Payment settings are restricted to Super Admin.' }, { status: 403 });
    }

    const query: any = {}
    if (group) {
      query.group = group
    } else if (!auth.isSuperAdmin) {
      // Exclude secrets from bulk fetch if not super admin
      query.group = { notIn: ['secrets', 'payments'] }
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
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await checkAdminUser()
    if (!auth.ok) {
      return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
    }

    // Only Super Admin can change website settings, secrets, or tracking configs
    if (!auth.isSuperAdmin) {
      return NextResponse.json({ ok: false, error: 'Permission denied: Only Super Admin can modify website settings.' }, { status: 403 });
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
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save setting' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { isSuperAdminAccount } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

async function checkSuperAdmin() {
  const session = await getAdminSession()
  if (!session) return { ok: false as const, status: 401, error: 'Unauthorized' }

  const sessionEmail = session.email.trim().toLowerCase()
  const caller = await prisma.user.findFirst({
    where: { email: { equals: sessionEmail, mode: 'insensitive' } },
    include: { role: true }
  })

  if (!isSuperAdminAccount({ email: sessionEmail, role: caller?.role })) {
    return { ok: false as const, status: 403, error: 'Access denied: Payment settings are strictly restricted to Super Admin.' }
  }

  return { ok: true as const }
}

export async function GET() {
  try {
    const auth = await checkSuperAdmin()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const settings = await prisma.websiteSetting.findMany({
      where: { key: { startsWith: 'payments.' } }
    })

    const data: Record<string, any> = {}
    settings.forEach(s => {
      const field = s.key.replace('payments.', '')
      const val = typeof s.value === 'string' ? s.value : JSON.stringify(s.value)
      if (val === 'true') data[field] = true
      else if (val === 'false') data[field] = false
      else if (!isNaN(Number(val)) && val !== '') data[field] = Number(val)
      else data[field] = val
    })

    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await checkSuperAdmin()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const body = await req.json()
    const upserts: any[] = []

    for (const [key, value] of Object.entries(body)) {
      let stringValue = ''
      if (typeof value === 'boolean') {
        stringValue = value ? 'true' : 'false'
      } else if (typeof value === 'number') {
        stringValue = value.toString()
      } else {
        stringValue = value as string
      }

      upserts.push((prisma.websiteSetting as any).upsert({
        where: { key: `payments.${key}` },
        create: { key: `payments.${key}`, value: stringValue, group: 'payments' },
        update: { value: stringValue }
      }))
    }

    await Promise.all(upserts)

    const { clearSettingCache } = await import('@/lib/settings')
    clearSettingCache()

    return NextResponse.json({ ok: true, message: 'Payment settings saved and applied live!' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save settings' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { isSuperAdminAccount } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const sessionEmail = session.email.trim().toLowerCase()
    const caller = await prisma.user.findFirst({
      where: { email: { equals: sessionEmail, mode: 'insensitive' } },
      include: { role: true }
    })

    if (!isSuperAdminAccount({ email: sessionEmail, role: caller?.role })) {
      return NextResponse.json({ ok: false, error: 'Access denied: Role management is strictly restricted to Super Admin.' }, { status: 403 });
    }

    const roles = await prisma.role.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ ok: true, roles });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 });
  }
}

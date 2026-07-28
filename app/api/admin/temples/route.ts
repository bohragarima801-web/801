import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const temples = await prisma.temple.findMany({
      select: { id: true, name: true, city: true },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ ok: true, data: temples });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 });
  }
}

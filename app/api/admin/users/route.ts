import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { isSuperAdminAccount } from '@/lib/rbac'
import bcrypt from 'bcryptjs'

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
    return { ok: false as const, status: 403, error: 'Access denied: User management is strictly restricted to Super Admin.' }
  }

  return { ok: true as const }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await checkSuperAdmin()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))
    const skip = (page - 1) * limit
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')

    const where: any = {}
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (status) where.status = status

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          fullName: true,
          firstName: true,
          email: true,
          phone: true,
          status: true,
          roleId: true,
          createdAt: true,
          role: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where })
    ])

    const mapped = users.map(u => ({
      id: u.id,
      name: u.fullName || u.firstName || 'Unknown',
      email: u.email,
      phone: u.phone || 'N/A',
      role: u.role?.name || 'Customer / Devotee',
      roleSlug: u.role?.slug || 'devotee',
      roleId: u.roleId,
      status: u.status,
      date: u.createdAt.toLocaleDateString('en-IN')
    }))

    return NextResponse.json({ ok: true, data: mapped, total, page, limit });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await checkSuperAdmin()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { name, email, phone, roleId, password } = await req.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required' }, { status: 400 });
    }

    if (roleId) {
      const targetRole = await prisma.role.findUnique({ where: { id: roleId } })
      if (targetRole?.slug === 'super_admin') {
        return NextResponse.json({ ok: false, error: 'Cannot assign Super Admin role.' }, { status: 403 });
      }
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, ...(phone ? [{ phone }] : [])] }
    });
    
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Email or phone already exists' }, { status: 400 });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined

    const user = await prisma.user.create({
      data: { fullName: name, email, phone: phone || null, roleId: roleId || null, passwordHash, status: 'ACTIVE' }
    })

    return NextResponse.json({ ok: true, data: user });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await checkSuperAdmin()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 });

    const targetUser = await prisma.user.findUnique({ where: { id }, include: { role: true } })
    if (!targetUser) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });

    const { name, email, phone, roleId, password, status } = await req.json()

    if (roleId && roleId !== targetUser.roleId) {
      const targetRole = await prisma.role.findUnique({ where: { id: roleId } })
      if (targetRole?.slug === 'super_admin') {
        return NextResponse.json({ ok: false, error: 'Cannot assign Super Admin role' }, { status: 403 });
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.fullName = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone || null
    if (roleId !== undefined) updateData.roleId = roleId || null
    if (status !== undefined) updateData.status = status
    if (password) updateData.passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.update({ where: { id }, data: updateData })
    return NextResponse.json({ ok: true, data: user });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await checkSuperAdmin()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 });

    const { safelyDeleteUser } = await import('@/lib/user-delete')
    await safelyDeleteUser(id)

    return NextResponse.json({ ok: true, message: 'User permanently deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete user' }, { status: 500 });
  }
}

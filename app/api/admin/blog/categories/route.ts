import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ ok: true, data: categories });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { name, slug } = await req.json()
    if (!name || !slug) {
      return NextResponse.json({ ok: false, error: 'Name and slug are required' }, { status: 400 });
    }

    const category = await prisma.blogCategory.create({
      data: { name, slug }
    })

    return NextResponse.json({ ok: true, data: category });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ ok: false, error: 'A category with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { id, name, slug } = await req.json()
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 });
    }

    const category = await prisma.blogCategory.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
      }
    })

    return NextResponse.json({ ok: true, data: category });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ ok: false, error: 'A category with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 });
    }

    await prisma.blogCategory.delete({ where: { id } })

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: this category has blogs linked to it.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete category' }, { status: 500 });
  }
}

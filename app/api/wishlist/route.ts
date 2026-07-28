import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET — fetch user wishlist
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const wishlist = await prisma.wishlist.findMany({
      where: { userId: user.id },
      include: { product: { select: { id: true, name: true, slug: true, price: true, salePrice: true } } },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ ok: true, data: wishlist })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

// POST — add to wishlist
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { productId } = await req.json()
    if (!productId) return NextResponse.json({ ok: false, error: 'productId required' }, { status: 400 })

    const item = await prisma.wishlist.upsert({
      where: { userId_productId: { userId: user.id, productId } },
      create: { userId: user.id, productId },
      update: {}
    })
    return NextResponse.json({ ok: true, data: item })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

// DELETE — remove from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const productId = searchParams.get('productId')

    if (id) {
      // Delete by wishlist record id (verify ownership)
      const item = await prisma.wishlist.findFirst({ where: { id, userId: user.id } })
      if (!item) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
      await prisma.wishlist.delete({ where: { id } })
    } else if (productId) {
      await prisma.wishlist.deleteMany({ where: { userId: user.id, productId } })
    } else {
      return NextResponse.json({ ok: false, error: 'id or productId required' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

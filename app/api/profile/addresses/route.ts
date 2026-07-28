import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
    })
    return NextResponse.json({ ok: true, data: addresses })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { fullName, phone, line1, line2, landmark, city, state, pincode, country, type, isDefault } = body

    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json({ ok: false, error: 'Required fields missing' }, { status: 400 })
    }

    // If setting as default, unset others first
    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName, phone, line1,
        line2: line2 || null,
        landmark: landmark || null,
        city, state, pincode,
        country: country || 'India',
        type: type || 'HOME',
        isDefault: isDefault || false,
      }
    })
    return NextResponse.json({ ok: true, data: address })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'ID required' }, { status: 400 })

    // Verify ownership
    const addr = await prisma.address.findFirst({ where: { id, userId: user.id } })
    if (!addr) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

    await prisma.address.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { id, isDefault } = body
    if (!id) return NextResponse.json({ ok: false, error: 'ID required' }, { status: 400 })

    const addr = await prisma.address.findFirst({ where: { id, userId: user.id } })
    if (!addr) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } })
    }

    const updated = await prisma.address.update({ where: { id }, data: { isDefault: isDefault ?? addr.isDefault } })
    return NextResponse.json({ ok: true, data: updated })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

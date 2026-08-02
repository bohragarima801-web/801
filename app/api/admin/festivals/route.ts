import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '30')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { festival: { contains: search, mode: 'insensitive' } },
        { festivalHi: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { categoryHi: { contains: search, mode: 'insensitive' } },
        { significance: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.festival.findMany({
        where,
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      prisma.festival.count({ where }),
    ])

    const stats = await prisma.festival.aggregate({
      _count: { id: true },
      _min: { date: true },
      _max: { date: true },
    })

    return NextResponse.json({
      success: true,
      items,
      total,
      page,
      pages: Math.ceil(total / limit),
      stats: {
        totalRecords: stats._count.id,
        minDate: stats._min.date,
        maxDate: stats._max.date,
      },
    })
  } catch (err: any) {
    console.error('Error fetching admin festivals:', err)
    return NextResponse.json({ error: 'Failed to fetch Festival data' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll')

    if (clearAll === 'true') {
      await prisma.festival.deleteMany({})
      return NextResponse.json({ success: true, message: 'All Festival records cleared' })
    }

    if (id) {
      await prisma.festival.delete({ where: { id } })
      return NextResponse.json({ success: true, message: 'Festival deleted' })
    }

    return NextResponse.json({ error: 'Missing id or clearAll parameter' }, { status: 400 })
  } catch (err: any) {
    console.error('Error deleting festival:', err)
    return NextResponse.json({ error: 'Failed to delete Festival data' }, { status: 500 })
  }
}

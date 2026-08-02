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
        { day: { contains: search, mode: 'insensitive' } },
        { dayHi: { contains: search, mode: 'insensitive' } },
        { tithi: { contains: search, mode: 'insensitive' } },
        { tithiHi: { contains: search, mode: 'insensitive' } },
        { nakshatra: { contains: search, mode: 'insensitive' } },
        { nakshatraHi: { contains: search, mode: 'insensitive' } },
        { specialFestival: { contains: search, mode: 'insensitive' } },
        { specialFestivalHi: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [items, total] = await Promise.all([
      prisma.panchang.findMany({
        where,
        orderBy: { date: 'asc' },
        skip,
        take: limit,
      }),
      prisma.panchang.count({ where }),
    ])

    // Get date range stats
    const stats = await prisma.panchang.aggregate({
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
    console.error('Error fetching admin panchang:', err)
    return NextResponse.json({ error: 'Failed to fetch Panchang data' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll')

    if (clearAll === 'true') {
      await prisma.panchang.deleteMany({})
      return NextResponse.json({ success: true, message: 'All Panchang records cleared successfully' })
    }

    if (id) {
      await prisma.panchang.delete({ where: { id } })
      return NextResponse.json({ success: true, message: 'Panchang record deleted' })
    }

    return NextResponse.json({ error: 'Missing id or clearAll parameter' }, { status: 400 })
  } catch (err: any) {
    console.error('Error deleting panchang:', err)
    return NextResponse.json({ error: 'Failed to delete Panchang data' }, { status: 500 })
  }
}

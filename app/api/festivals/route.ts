import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = {}

    if (year) {
      const y = parseInt(year)
      let startDate = new Date(Date.UTC(y, 0, 1))
      let endDate = new Date(Date.UTC(y, 11, 31, 23, 59, 59))

      if (month) {
        const m = parseInt(month) - 1
        startDate = new Date(Date.UTC(y, m, 1))
        endDate = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59))
      }

      where.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    if (category && category !== 'ALL') {
      where.OR = [
        { category: { contains: category, mode: 'insensitive' } },
        { categoryHi: { contains: category, mode: 'insensitive' } },
      ]
    }

    if (search) {
      where.OR = [
        { festival: { contains: search, mode: 'insensitive' } },
        { festivalHi: { contains: search, mode: 'insensitive' } },
        { significance: { contains: search, mode: 'insensitive' } },
      ]
    }

    const festivals = await prisma.festival.findMany({
      where,
      orderBy: { date: 'asc' },
    })

    return NextResponse.json({
      success: true,
      count: festivals.length,
      festivals,
    })
  } catch (err: any) {
    console.error('Error fetching public festivals:', err)
    return NextResponse.json({ error: 'Failed to fetch Festivals' }, { status: 500 })
  }
}

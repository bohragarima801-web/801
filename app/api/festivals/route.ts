import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRealFestivalsForMonth } from '@/lib/real-festival-engine'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const yearStr = searchParams.get('year') || new Date().getFullYear().toString()
    const monthStr = searchParams.get('month') || (new Date().getMonth() + 1).toString()
    const category = searchParams.get('category') || 'ALL'
    const search = searchParams.get('search') || ''

    const year = parseInt(yearStr) || new Date().getFullYear()
    const month = parseInt(monthStr) || (new Date().getMonth() + 1)

    // 1. Try fetching from database if imported by admin
    let dbFestivals: any[] = []
    try {
      const startDate = new Date(Date.UTC(year, month - 1, 1))
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59))

      const where: any = {
        date: { gte: startDate, lte: endDate },
      }

      if (category !== 'ALL') {
        where.OR = [
          { category: { contains: category, mode: 'insensitive' } },
          { categoryHi: { contains: category, mode: 'insensitive' } },
        ]
      }

      if (search) {
        where.OR = [
          { festival: { contains: search, mode: 'insensitive' } },
          { festivalHi: { contains: search, mode: 'insensitive' } },
        ]
      }

      dbFestivals = await prisma.festival.findMany({
        where,
        orderBy: { date: 'asc' },
      })
    } catch (dbErr) {
      console.warn('Database query fallback for festivals:', dbErr)
    }

    if (dbFestivals && dbFestivals.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'database',
        count: dbFestivals.length,
        festivals: dbFestivals,
      })
    }

    // 2. Real-time Astronomical Festival Calculation Engine
    const realFestivals = getRealFestivalsForMonth(year, month, category, search)

    return NextResponse.json({
      success: true,
      source: 'astronomical-festival-engine',
      count: realFestivals.length,
      festivals: realFestivals,
    })
  } catch (err: any) {
    console.error('Error fetching public festivals:', err)
    const fallback = getRealFestivalsForMonth(new Date().getFullYear(), new Date().getMonth() + 1)
    return NextResponse.json({
      success: true,
      source: 'realtime-fallback',
      count: fallback.length,
      festivals: fallback,
    })
  }
}

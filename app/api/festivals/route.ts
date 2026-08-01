import { NextResponse } from 'next/server'
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

    // Real-time Astronomical Festival Calculation Engine (Single Source of Truth)
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

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date')

    let targetDate: Date
    if (dateStr) {
      targetDate = new Date(dateStr + 'T00:00:00.000Z')
    } else {
      const today = new Date().toISOString().split('T')[0]
      targetDate = new Date(today + 'T00:00:00.000Z')
    }

    // Attempt exact match first
    let panchang = await prisma.panchang.findUnique({
      where: { date: targetDate },
    })

    // Fallback: If exact date not found, get closest or latest entry
    if (!panchang) {
      panchang = await prisma.panchang.findFirst({
        orderBy: { date: 'asc' },
      })
    }

    if (!panchang) {
      return NextResponse.json(
        { success: false, message: 'No Panchang data available in database.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      panchang,
    })
  } catch (err: any) {
    console.error('Error fetching public panchang:', err)
    return NextResponse.json({ error: 'Failed to fetch Panchang' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateRealPanchang } from '@/lib/real-panchang-engine'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0]

    let targetDate: Date
    try {
      targetDate = new Date(dateStr + 'T00:00:00.000Z')
      if (isNaN(targetDate.getTime())) {
        targetDate = new Date()
      }
    } catch {
      targetDate = new Date()
    }

    // 1. Try to fetch from database if imported by admin
    let dbPanchang: any = null

    try {
      dbPanchang = await prisma.panchang.findUnique({
        where: { date: targetDate },
      })
    } catch (dbErr) {
      console.warn('Database query fallback:', dbErr)
    }

    if (dbPanchang) {
      return NextResponse.json({
        success: true,
        source: 'database',
        panchang: dbPanchang,
      })
    }

    // 2. Real-time Astronomical Calculation Engine (Drik Ganita)
    const realCalc = calculateRealPanchang(dateStr)

    const panchangObj = {
      id: `real-${dateStr}`,
      date: targetDate,
      day: realCalc.dayEn,
      dayHi: realCalc.dayHi,
      hinduMonth: realCalc.hinduMonthEn,
      hinduMonthHi: realCalc.hinduMonthHi,
      paksha: realCalc.pakshaEn,
      pakshaHi: realCalc.pakshaHi,
      tithi: realCalc.tithiEn,
      tithiHi: realCalc.tithiHi,
      nakshatra: realCalc.nakshatraEn,
      nakshatraHi: realCalc.nakshatraHi,
      yog: realCalc.yogEn,
      yogHi: realCalc.yogHi,
      karan: realCalc.karanEn,
      karanHi: realCalc.karanHi,
      sunrise: realCalc.sunrise,
      sunset: realCalc.sunset,
      moonrise: realCalc.moonrise,
      moonset: realCalc.moonset,
      rahuKaal: realCalc.rahuKaal,
      yamagandaKaal: realCalc.yamagandaKaal,
      gulikaKaal: realCalc.gulikaKaal,
      abhijitMuhurat: realCalc.abhijitMuhurat,
      specialFestival: realCalc.specialFestivalEn,
      specialFestivalHi: realCalc.specialFestivalHi,
    }

    return NextResponse.json({
      success: true,
      source: 'astronomical-engine',
      panchang: panchangObj,
    })
  } catch (err: any) {
    console.error('Error in panchang API:', err)
    const fallback = calculateRealPanchang(new Date().toISOString().split('T')[0])
    return NextResponse.json({
      success: true,
      source: 'realtime-fallback',
      panchang: {
        date: new Date(),
        day: fallback.dayEn,
        dayHi: fallback.dayHi,
        hinduMonth: fallback.hinduMonthEn,
        hinduMonthHi: fallback.hinduMonthHi,
        paksha: fallback.pakshaEn,
        pakshaHi: fallback.pakshaHi,
        tithi: fallback.tithiEn,
        tithiHi: fallback.tithiHi,
        nakshatra: fallback.nakshatraEn,
        nakshatraHi: fallback.nakshatraHi,
        yog: fallback.yogEn,
        yogHi: fallback.yogHi,
        karan: fallback.karanEn,
        karanHi: fallback.karanHi,
        sunrise: fallback.sunrise,
        sunset: fallback.sunset,
        moonrise: fallback.moonrise,
        moonset: fallback.moonset,
        rahuKaal: fallback.rahuKaal,
        yamagandaKaal: fallback.yamagandaKaal,
        gulikaKaal: fallback.gulikaKaal,
        abhijitMuhurat: fallback.abhijitMuhurat,
        specialFestival: fallback.specialFestivalEn,
        specialFestivalHi: fallback.specialFestivalHi,
      },
    })
  }
}

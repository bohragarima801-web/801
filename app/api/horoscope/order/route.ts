import { NextRequest, NextResponse } from 'next/server'
import { saveHoroscopeOrder } from '@/lib/horoscope-orders'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      devoteeName,
      gender = 'Male',
      dob,
      birthTime,
      birthPlace,
      whatsappPhone,
      email,
      language = 'English',
      specialConcern,
      reportId,
      reportTitle,
      amount = 199,
      paymentId,
      orderId,
      paymentStatus = 'PENDING',
    } = body || {}

    if (!devoteeName || !dob || !birthPlace || !whatsappPhone) {
      return NextResponse.json(
        { ok: false, error: 'Missing required birth details' },
        { status: 400 }
      )
    }

    const saved = await saveHoroscopeOrder({
      devoteeName,
      gender,
      dob,
      birthTime: birthTime || 'Unknown',
      birthPlace,
      whatsappPhone,
      email,
      language,
      specialConcern,
      reportId: reportId || 'horoscope',
      reportTitle: reportTitle || 'Vedic Horoscope Report',
      amount: Number(amount) || 199,
      paymentId,
      orderId,
      paymentStatus: paymentStatus as any,
    })

    return NextResponse.json({
      ok: true,
      data: saved,
    })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to save horoscope order' },
      { status: 500 }
    )
  }
}

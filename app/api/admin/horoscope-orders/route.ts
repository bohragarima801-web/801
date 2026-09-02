import { NextRequest, NextResponse } from 'next/server'
import { getAllHoroscopeOrders, updateHoroscopeDispatchStatus } from '@/lib/horoscope-orders'

export async function GET() {
  try {
    const orders = await getAllHoroscopeOrders()
    return NextResponse.json({ ok: true, data: orders })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to fetch horoscope orders' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status } = body || {}

    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: 'Order ID and status are required' },
        { status: 400 }
      )
    }

    const updated = await updateHoroscopeDispatchStatus(id, status)
    return NextResponse.json({ ok: true, data: updated })
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || 'Failed to update order status' },
      { status: 500 }
    )
  }
}

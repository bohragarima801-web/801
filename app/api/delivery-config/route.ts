import { NextResponse } from 'next/server'
import { getSetting } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const enabledStr = await getSetting('delivery.enabled', 'true')
    const feeStr = await getSetting('delivery.fee', '99')
    const thresholdStr = await getSetting('delivery.free_threshold', '999')

    const enabled = enabledStr !== 'false'
    const fee = (feeStr !== '' && !isNaN(Number(feeStr)) && Number(feeStr) >= 0) ? Number(feeStr) : 99
    const freeThreshold = (thresholdStr !== '' && !isNaN(Number(thresholdStr)) && Number(thresholdStr) >= 0) ? Number(thresholdStr) : 999

    return NextResponse.json({
      ok: true,
      enabled,
      fee,
      freeThreshold
    })

  } catch (err: any) {
    return NextResponse.json({
      ok: true,
      enabled: true,
      fee: 99,
      freeThreshold: 999
    })
  }
}

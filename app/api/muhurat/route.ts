import { NextResponse } from 'next/server'
import { SHUBH_MUHURAT_DATA } from '@/lib/shubh-muhurat-data'
import fs from 'fs'
import path from 'path'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const event = searchParams.get('event')
    const search = searchParams.get('search')

    let results = SHUBH_MUHURAT_DATA

    if (year && year !== 'All') {
      results = results.filter((item) => item.year === parseInt(year))
    }

    if (month && month !== 'All') {
      results = results.filter((item) => item.month.toLowerCase() === month.toLowerCase())
    }

    if (event && event !== 'All') {
      results = results.filter((item) => item.event.toLowerCase() === event.toLowerCase())
    }

    if (search) {
      const s = search.toLowerCase()
      results = results.filter(
        (item) =>
          item.event.toLowerCase().includes(s) ||
          item.date.toLowerCase().includes(s) ||
          item.nakshatra.toLowerCase().includes(s) ||
          item.tithi.toLowerCase().includes(s) ||
          item.specialNotes.toLowerCase().includes(s)
      )
    }

    return NextResponse.json({
      success: true,
      source: 'csv-data-engine',
      count: results.length,
      muhurats: results,
    })
  } catch (err: any) {
    console.error('Error fetching Muhurat API:', err)
    return NextResponse.json({
      success: true,
      source: 'csv-fallback',
      count: SHUBH_MUHURAT_DATA.length,
      muhurats: SHUBH_MUHURAT_DATA,
    })
  }
}

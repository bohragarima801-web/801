import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  translateDay,
  translateMonth,
  translatePaksha,
  translateTithi,
  translateNakshatra,
  translateYog,
  translateKaran,
  translateFestival,
} from '@/lib/panchang-translator'

// CSV Parser Helper
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []

  const parseLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes
      } else if ((char === ',' || char === '\t') && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  }

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().trim())
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i])
    if (values.length === 0 || !values.some((v) => v)) continue
    const rowObj: Record<string, string> = {}
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || ''
    })
    rows.push(rowObj)
  }

  return rows
}

// Find header value matching potential keys
function getVal(row: Record<string, string>, keys: string[]): string {
  for (const k of keys) {
    const foundKey = Object.keys(row).find((rk) => rk.toLowerCase().includes(k.toLowerCase()))
    if (foundKey && row[foundKey]) {
      return row[foundKey].trim()
    }
  }
  return ''
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    let rawRows: Record<string, string>[] = []

    if (body.csvUrl) {
      // Direct Google Sheet / Published CSV URL Fetch
      let url = body.csvUrl.trim()
      if (url.includes('docs.google.com/spreadsheets') && !url.includes('/export?') && !url.includes('/pub?')) {
        const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
        const gidMatches = url.match(/gid=([0-9]+)/)
        if (matches && matches[1]) {
          const sheetId = matches[1]
          const gid = gidMatches ? gidMatches[1] : '0'
          url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`
        }
      }

      const res = await fetch(url)
      if (!res.ok) {
        return NextResponse.json(
          { error: `Google Sheet fetch failed with status ${res.status}. Please check permissions (Anyone with link can view).` },
          { status: 400 }
        )
      }
      const text = await res.text()
      rawRows = parseCSV(text)
    } else if (body.rawCsvText) {
      rawRows = parseCSV(body.rawCsvText)
    } else if (Array.isArray(body.rows)) {
      rawRows = body.rows
    } else {
      return NextResponse.json({ error: 'No CSV data or URL provided' }, { status: 400 })
    }

    if (!rawRows.length) {
      return NextResponse.json({ error: 'No data rows found in CSV' }, { status: 400 })
    }

    let successCount = 0
    let skippedCount = 0

    // Process in batches
    const batchSize = 100
    for (let i = 0; i < rawRows.length; i += batchSize) {
      const chunk = rawRows.slice(i, i + batchSize)

      await Promise.all(
        chunk.map(async (row) => {
          const dateStr = getVal(row, ['date', 'तारीख', 'दिनांक'])
          if (!dateStr) {
            skippedCount++
            return
          }

          let parsedDate: Date | null = null;
          // Handle YYYY-MM-DD or DD-MM-YYYY
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            parsedDate = new Date(dateStr + 'T00:00:00.000Z')
          } else if (/^\d{2}[-\/]\d{2}[-\/]\d{4}$/.test(dateStr)) {
            const parts = dateStr.split(/[-\/]/)
            parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`)
          } else {
            parsedDate = new Date(dateStr)
          }

          if (!parsedDate || isNaN(parsedDate.getTime())) {
            skippedCount++
            return
          }

          const day = getVal(row, ['day', 'वार', 'दिन'])
          const hinduMonth = getVal(row, ['hindu month', 'month', 'मास', 'महीना'])
          const paksha = getVal(row, ['paksha', 'पक्ष'])
          const tithi = getVal(row, ['tithi', 'तिथि'])
          const nakshatra = getVal(row, ['nakshatra', 'नक्षत्र'])
          const yog = getVal(row, ['yog', 'yoga', 'योग'])
          const karan = getVal(row, ['karan', 'karana', 'करण'])
          const sunrise = getVal(row, ['sunrise', 'सूर्योदय'])
          const sunset = getVal(row, ['sunset', 'सूर्यास्त'])
          const moonrise = getVal(row, ['moonrise', 'चंद्रोदय'])
          const moonset = getVal(row, ['moonset', 'चंद्रास्त'])
          const rahuKaal = getVal(row, ['rahu kaal', 'rahukaal', 'राहु काल', 'राहुकाल'])
          const yamagandaKaal = getVal(row, ['yamaganda kaal', 'yamaganda', 'यमगण्ड'])
          const gulikaKaal = getVal(row, ['gulika kaal', 'gulika', 'गुलीका'])
          const abhijitMuhurat = getVal(row, ['abhijit muhurat', 'abhijit', 'अभिजीत'])
          const specialFestival = getVal(row, ['special festival', 'festival', 'vrat', 'त्योहार', 'व्रत'])

          const dayHi = getVal(row, ['day_hi', 'day (hi)']) || translateDay(day)
          const hinduMonthHi = getVal(row, ['month_hi', 'month (hi)']) || translateMonth(hinduMonth)
          const pakshaHi = getVal(row, ['paksha_hi', 'paksha (hi)']) || translatePaksha(paksha)
          const tithiHi = getVal(row, ['tithi_hi', 'tithi (hi)']) || translateTithi(tithi)
          const nakshatraHi = getVal(row, ['nakshatra_hi', 'nakshatra (hi)']) || translateNakshatra(nakshatra)
          const yogHi = getVal(row, ['yog_hi', 'yog (hi)']) || translateYog(yog)
          const karanHi = getVal(row, ['karan_hi', 'karan (hi)']) || translateKaran(karan)
          const specialFestivalHi = getVal(row, ['festival_hi', 'festival (hi)']) || translateFestival(specialFestival)

          await prisma.panchang.upsert({
            where: { date: parsedDate },
            update: {
              day,
              dayHi,
              hinduMonth,
              hinduMonthHi,
              paksha,
              pakshaHi,
              tithi,
              tithiHi,
              nakshatra,
              nakshatraHi,
              yog,
              yogHi,
              karan,
              karanHi,
              sunrise,
              sunset,
              moonrise,
              moonset,
              rahuKaal,
              yamagandaKaal,
              gulikaKaal,
              abhijitMuhurat,
              specialFestival,
              specialFestivalHi,
              rawJson: row,
            },
            create: {
              date: parsedDate,
              day,
              dayHi,
              hinduMonth,
              hinduMonthHi,
              paksha,
              pakshaHi,
              tithi,
              tithiHi,
              nakshatra,
              nakshatraHi,
              yog,
              yogHi,
              karan,
              karanHi,
              sunrise,
              sunset,
              moonrise,
              moonset,
              rahuKaal,
              yamagandaKaal,
              gulikaKaal,
              abhijitMuhurat,
              specialFestival,
              specialFestivalHi,
              rawJson: row,
            },
          })

          successCount++
        })
      )
    }

    return NextResponse.json({
      success: true,
      message: `Panchang imported successfully! ${successCount} records saved, ${skippedCount} skipped.`,
      successCount,
      skippedCount,
      totalRows: rawRows.length,
    })
  } catch (err: any) {
    console.error('Error importing Panchang:', err)
    return NextResponse.json({ error: err.message || 'Failed to process Panchang import' }, { status: 500 })
  }
}

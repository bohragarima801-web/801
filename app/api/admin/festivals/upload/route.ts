import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { translateFestival, translateCategory } from '@/lib/panchang-translator'

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
          { error: `Google Sheet fetch failed (${res.status}). Ensure sharing is set to 'Anyone with link can view'.` },
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
      return NextResponse.json({ error: 'No CSV data provided' }, { status: 400 })
    }

    if (!rawRows.length) {
      return NextResponse.json({ error: 'No rows found in CSV' }, { status: 400 })
    }

    let successCount = 0
    let skippedCount = 0

    const batchSize = 100
    for (let i = 0; i < rawRows.length; i += batchSize) {
      const chunk = rawRows.slice(i, i + batchSize)

      await Promise.all(
        chunk.map(async (row) => {
          const dateStr = getVal(row, ['date', 'तारीख', 'दिनांक'])
          const festival = getVal(row, ['festival', 'tyohar', 'त्योहार', 'पर्व'])
          if (!dateStr || !festival) {
            skippedCount++
            return
          }

          let parsedDate: Date | null = null
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

          const category = getVal(row, ['category', 'श्रेणी', 'प्रकार'])
          const significance = getVal(row, ['significance', 'mahatai', 'महत्व', 'विवरण', 'description'])

          const festivalHi = getVal(row, ['festival_hi', 'festival (hi)', 'त्योहार (हिंदी)']) || translateFestival(festival)
          const categoryHi = getVal(row, ['category_hi', 'category (hi)', 'श्रेणी (हिंदी)']) || translateCategory(category)
          const significanceHi = getVal(row, ['significance_hi', 'significance (hi)', 'महत्व (हिंदी)']) || significance

          await prisma.festival.create({
            data: {
              date: parsedDate,
              festival,
              festivalHi,
              category,
              categoryHi,
              significance,
              significanceHi,
              rawJson: row,
            },
          })

          successCount++
        })
      )
    }

    return NextResponse.json({
      success: true,
      message: `Festival list imported! ${successCount} entries saved, ${skippedCount} skipped.`,
      successCount,
      skippedCount,
      totalRows: rawRows.length,
    })
  } catch (err: any) {
    console.error('Error importing Festivals:', err)
    return NextResponse.json({ error: err.message || 'Failed to process Festival import' }, { status: 500 })
  }
}

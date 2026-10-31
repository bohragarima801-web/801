import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

function wrapTitle(text: string, maxCharsPerLine = 34): string[] {
  const clean = text.trim().replace(/\s+/g, ' ')
  if (clean.length <= maxCharsPerLine) {
    return [clean]
  }

  const words = clean.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines.slice(0, 2)
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const rawTitle = searchParams.get('title') || 'दिव्ययज्ञम् वैदिक पूजा एवं अनुष्ठान'
    const title = escapeXml(rawTitle)

    const lines = wrapTitle(title, 34)
    const isMultiLine = lines.length > 1
    const fontSize = isMultiLine ? 26 : 33

    let textElements = ''
    if (isMultiLine) {
      textElements = `
        <text x="688" y="104" class="title">${lines[0]}</text>
        <text x="688" y="142" class="title">${lines[1]}</text>
      `
    } else {
      textElements = `<text x="688" y="120" class="title">${lines[0]}</text>`
    }

    const svgOverlay = `
      <svg width="1376" height="768" viewBox="0 0 1376 768" xmlns="http://www.w3.org/2000/svg">
        <style>
          .title {
            fill: #2d1607;
            font-family: 'Mukta', 'Noto Sans Devanagari', 'Cinzel', serif, sans-serif;
            font-size: ${fontSize}px;
            font-weight: 800;
            text-anchor: middle;
            dominant-baseline: middle;
          }
        </style>
        ${textElements}
      </svg>
    `

    const templatePath = path.join(process.cwd(), 'public', 'blog-banner-template.webp')
    const templateBuffer = fs.readFileSync(templatePath)

    const compositedBuffer = await sharp(templateBuffer)
      .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
      .webp({ quality: 85 })
      .toBuffer()

    return new NextResponse(compositedBuffer, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch (err: any) {
    console.error('Error generating blog cover image:', err)
    // Fallback to static template
    try {
      const templatePath = path.join(process.cwd(), 'public', 'blog-banner-template.webp')
      const buffer = fs.readFileSync(templatePath)
      return new NextResponse(buffer, {
        headers: { 'Content-Type': 'image/webp' },
      })
    } catch {
      return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
    }
  }
}

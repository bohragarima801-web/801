import { NextRequest, NextResponse } from 'next/server'
import { META_TEMPLATES } from '@/lib/whatsapp'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lang = (searchParams.get('lang') || 'hi') as 'hi' | 'en' | 'hinglish'

  const templateData = META_TEMPLATES[lang] || META_TEMPLATES.hi
  const jsonString = JSON.stringify(templateData, null, 2)

  const fileName = `Meta_WhatsApp_Templates_${lang.toUpperCase()}.json`

  return new NextResponse(jsonString, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store, max-age=0'
    }
  })
}

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'horoscope')

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}

export async function GET() {
  try {
    ensureDir()
    const files = fs.readdirSync(UPLOAD_DIR)
    const list = files.map(file => {
      const fullPath = path.join(UPLOAD_DIR, file)
      const stat = fs.statSync(fullPath)
      const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(file)
      return {
        filename: file,
        url: `/uploads/horoscope/${file}`,
        size: stat.size,
        type: isVideo ? 'video' : 'image',
        createdAt: stat.birthtime.toISOString()
      }
    })
    return NextResponse.json({ ok: true, data: list })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to list media' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureDir()
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    const baseName = path.basename(file.name, ext).replace(/[^a-z0-9_-]/gi, '_')
    const safeName = `${baseName}_${Date.now()}${ext}`
    const filePath = path.join(UPLOAD_DIR, safeName)

    const buffer = Buffer.from(await file.arrayBuffer())
    fs.writeFileSync(filePath, new Uint8Array(buffer))

    const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(ext)

    return NextResponse.json({
      ok: true,
      url: `/uploads/horoscope/${safeName}`,
      filename: safeName,
      type: isVideo ? 'video' : 'image',
      size: buffer.length
    })
  } catch (err: any) {
    console.error('Horoscope media upload error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    ensureDir()
    const { searchParams } = new URL(req.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ ok: false, error: 'Filename is required' }, { status: 400 })
    }

    // Protect against path traversal
    const safeName = path.basename(filename)
    const filePath = path.join(UPLOAD_DIR, safeName)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return NextResponse.json({ ok: true, message: 'File removed successfully' })
    } else {
      return NextResponse.json({ ok: false, error: 'File not found' }, { status: 404 })
    }
  } catch (err: any) {
    console.error('Horoscope media delete error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}

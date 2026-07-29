import { NextRequest, NextResponse } from 'next/server'
import { uploadToSupabase } from '@/lib/supabase/storage-helpers'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 });
    }

    let buffer = Buffer.from(await file.arrayBuffer())
    let fileName = file.name
    let mimeType = file.type

    // Auto-compress and format image using Sharp if it's an image
    if (file.type && file.type.startsWith('image/')) {
      try {
        const sharp = require('sharp')
        buffer = await sharp(buffer)
          .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer()
        fileName = fileName.replace(/\.[^/.]+$/, "") + ".webp"
        mimeType = 'image/webp'
      } catch (sharpError) {
        console.warn('Server sharp compression skipped:', sharpError)
      }
    }

    const uploadResult = await uploadToSupabase(buffer, fileName, mimeType)

    return NextResponse.json({
      ok: true,
      url: uploadResult.publicUrl,
      name: fileName,
      size: buffer.length,
    });
  } catch (err: any) {
    console.error('Upload API Error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Upload failed' }, { status: 500 });
  }
}

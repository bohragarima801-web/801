import { NextRequest, NextResponse } from 'next/server'
import { uploadToSupabase } from '@/lib/supabase/storage-helpers'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadResult = await uploadToSupabase(buffer, file.name, file.type)

    return NextResponse.json({
      ok: true,
      url: uploadResult.publicUrl,
      name: file.name,
      size: buffer.length,
    });
  } catch (err: any) {
    console.error('Upload API Error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Upload failed' }, { status: 500 });
  }
}

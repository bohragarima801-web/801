import { NextRequest, NextResponse } from 'next/server'
import {
  getAllHoroscopePages,
  saveHoroscopePage,
  deleteHoroscopePage,
  getHoroscopePageById
} from '@/lib/horoscope-pages'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const page = await getHoroscopePageById(id)
      if (!page) {
        return NextResponse.json({ ok: false, error: 'Page not found' }, { status: 404 })
      }
      return NextResponse.json({ ok: true, data: page })
    }

    const pages = await getAllHoroscopePages()
    return NextResponse.json({ ok: true, data: pages })
  } catch (error: any) {
    console.error('Error fetching horoscope pages:', error)
    return NextResponse.json({ ok: false, error: error?.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ ok: false, error: 'Title is required' }, { status: 400 })
    }

    const saved = await saveHoroscopePage({
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle,
      customCode: body.customCode || '',
      layout: body.layout || 'container',
      headerBanner: body.headerBanner ?? true,
      showBookingBar: body.showBookingBar ?? true,
      whatsappNumber: body.whatsappNumber || '919530401984',
      images: body.images || [],
      videos: body.videos || [],
      razorpay: body.razorpay || { enabled: false },
      status: body.status || 'PUBLISHED',
    })

    return NextResponse.json({ ok: true, data: saved })
  } catch (error: any) {
    console.error('Error creating horoscope page:', error)
    return NextResponse.json({ ok: false, error: error?.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.id) {
      return NextResponse.json({ ok: false, error: 'Page ID is required' }, { status: 400 })
    }

    const saved = await saveHoroscopePage({
      id: body.id,
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle,
      customCode: body.customCode || '',
      layout: body.layout || 'container',
      headerBanner: body.headerBanner ?? true,
      showBookingBar: body.showBookingBar ?? true,
      whatsappNumber: body.whatsappNumber || '919530401984',
      images: body.images || [],
      videos: body.videos || [],
      razorpay: body.razorpay || { enabled: false },
      status: body.status || 'PUBLISHED',
    })

    return NextResponse.json({ ok: true, data: saved })
  } catch (error: any) {
    console.error('Error updating horoscope page:', error)
    return NextResponse.json({ ok: false, error: error?.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Page ID is required' }, { status: 400 })
    }

    const deleted = await deleteHoroscopePage(id)
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Failed to delete or page not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, message: 'Page deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting horoscope page:', error)
    return NextResponse.json({ ok: false, error: error?.message || 'Server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const tool = await prisma.spiritualTool.findUnique({ where: { id } })
      return NextResponse.json({ ok: true, data: tool })
    }

    const tools = await prisma.spiritualTool.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ ok: true, data: tools })
  } catch (error: any) {
    console.error('Tools GET error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const body = await req.json()
    const { name, slug, description, isFree, price, trialDays, thumbnail, htmlCode, cssCode, jsCode, isActive } = body

    const cleanSlug = (slug || name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    let finalSlug = cleanSlug;
    const existing = await prisma.spiritualTool.findUnique({ where: { slug: cleanSlug } })
    if (existing) {
      finalSlug = `${cleanSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const tool = await prisma.spiritualTool.create({
      data: {
        name,
        slug: finalSlug,
        description,
        isFree: isFree !== undefined ? !!isFree : true,
        price: parseFloat(price) || 0,
        trialDays: parseInt(trialDays) || 0,
        thumbnail,
        htmlCode,
        cssCode,
        jsCode,
        isActive: isActive !== undefined ? !!isActive : true
      }
    })

    try {
      revalidatePath('/tools')
      revalidatePath(`/tools/${tool.slug}`)
      revalidatePath('/')
      revalidatePath('/sitemap.xml')
    } catch {}

    return NextResponse.json({ ok: true, data: tool })
  } catch (error: any) {
    console.error('Tools POST error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'Missing ID' }, { status: 400 })

    const body = await req.json()
    
    if (body.slug) {
      const cleanSlug = body.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const existing = await prisma.spiritualTool.findFirst({
        where: { slug: cleanSlug, NOT: { id } }
      })
      if (existing) {
        body.slug = `${cleanSlug}-${Math.floor(1000 + Math.random() * 9000)}`;
      } else {
        body.slug = cleanSlug;
      }
    }

    if (body.price !== undefined) {
      body.price = parseFloat(body.price) || 0
    }
    if (body.trialDays !== undefined) {
      body.trialDays = parseInt(body.trialDays) || 0
    }

    const tool = await prisma.spiritualTool.update({
      where: { id },
      data: body
    })

    try {
      revalidatePath('/tools')
      revalidatePath(`/tools/${tool.slug}`)
      revalidatePath('/')
      revalidatePath('/sitemap.xml')
    } catch {}

    return NextResponse.json({ ok: true, data: tool })
  } catch (error: any) {
    console.error('Tools PUT error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'Missing ID' }, { status: 400 })

    const deleted = await prisma.spiritualTool.delete({ where: { id } })

    try {
      revalidatePath('/tools')
      revalidatePath(`/tools/${deleted.slug}`)
      revalidatePath('/')
      revalidatePath('/sitemap.xml')
    } catch {}

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Tools DELETE error:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

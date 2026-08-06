import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'
import { autoGenerateBlogSeo } from '@/lib/seo-auto'
import { sanitizeSlug } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const post = await prisma.blog.findUnique({
        where: { id }
      })
      if (!post) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
      
      const faqs = await prisma.fAQ.findMany({
        where: { category: `blog-${post.id}` },
        orderBy: { order: 'asc' }
      });
      
      return NextResponse.json({ ok: true, data: { ...post, faqs } });
    }

    const posts = await prisma.blog.findMany({
      include: {
        category: { select: { name: true } },
        author: { select: { fullName: true, email: true } },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const mapped = posts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      author: p.author?.fullName || p.author?.email || 'Unknown',
      category: p.category?.name || 'Uncategorized',
      views: p.views,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      seoKeywords: p.seoKeywords,
      comments: p._count?.comments || 0,
      status: p.status,
      date: p.createdAt.toLocaleDateString('en-IN')
    }))

    return NextResponse.json({ ok: true, data: mapped });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: This item has linked records.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const data = await req.json()
    const { title, slug, excerpt, content, categoryId, coverImage, coverImageAlt, status, publishedAt, seoTitle, seoDescription, seoKeywords, videoUrl, isVideoEnabled, pdfUrl, pdfTitle, faqs } = data

    if (!title || !categoryId) {
      return NextResponse.json({ ok: false, error: 'Title and Category are required' }, { status: 400 });
    }

    let calculatedSlug = sanitizeSlug(slug || title)
    if (!calculatedSlug) {
      calculatedSlug = `post-${Date.now()}`
    }
    
    // Ensure uniqueness
    const existing = await prisma.blog.findUnique({ where: { slug: calculatedSlug } })
    if (existing) {
      calculatedSlug = `${calculatedSlug}-${Date.now().toString().slice(-4)}`
    }

    const autoSeo = autoGenerateBlogSeo({
      title,
      excerpt,
      content,
      seoTitle,
      seoDescription,
      seoKeywords,
    })

    const finalCoverAlt = coverImageAlt || `${title} - Online Puja Booking & Spiritual Guide DivyaYagyam`

    const post = await prisma.blog.create({
      data: {
        title,
        slug: calculatedSlug,
        excerpt: excerpt || '',
        content: content || '',
        categoryId,
        authorId: data.authorId || (await prisma.user.findUnique({ where: { email: session.email } }))?.id || null,
        coverImage: coverImage || null,
        coverImageAlt: finalCoverAlt,
        status: status || 'PUBLISHED',
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        seoTitle: autoSeo.seoTitle,
        seoDescription: autoSeo.seoDescription,
        seoKeywords: autoSeo.seoKeywords,
        videoUrl,
        isVideoEnabled: isVideoEnabled !== undefined ? !!isVideoEnabled : true,
        pdfUrl: pdfUrl || null,
        pdfTitle: pdfTitle || null
      }
    })

    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      await prisma.fAQ.createMany({
        data: faqs.map((faq: any, i: number) => ({
          question: faq.question,
          answer: faq.answer,
          category: `blog-${post.id}`,
          order: i,
        }))
      })
    }

    return NextResponse.json({ ok: true, data: post });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: This item has linked records.' }, { status: 400 });
    }
    if (err.code === 'P2002') {
      return NextResponse.json({ ok: false, error: 'A post with this title/slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to create post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 });

    const data = await req.json()
    
    // Always sanitize slug if provided or generated from title
    let calculatedSlug = sanitizeSlug(data.slug || data.title || '')
    if (!calculatedSlug) {
      calculatedSlug = `post-${id.slice(0, 8)}`
    }

    // Check if slug is used by another post
    const existing = await prisma.blog.findFirst({
      where: {
        slug: calculatedSlug,
        NOT: { id }
      }
    })
    if (existing) {
      calculatedSlug = `${calculatedSlug}-${Date.now().toString().slice(-4)}`
    }
    data.slug = calculatedSlug
    
    if (data.publishedAt) {
      data.publishedAt = new Date(data.publishedAt)
      data.status = 'PUBLISHED'
    } else if (data.status === 'PUBLISHED') {
      data.publishedAt = new Date()
    } else {
      data.publishedAt = null
    }

    
    if (data.categoryId === 'none' || data.categoryId === '') {
      delete data.categoryId;
    }

    const { faqs, ...restData } = data;

    if (restData.coverImage && (!restData.coverImageAlt || !restData.coverImageAlt.trim())) {
      restData.coverImageAlt = restData.title ? `${restData.title} - Online Puja Booking & Spiritual Guide DivyaYagyam` : 'DivyaYagyam Spiritual Guide'
    }

    const post = await prisma.blog.update({
      where: { id },
      data: restData
    })

    if (faqs && Array.isArray(faqs)) {
      // Delete existing
      await prisma.fAQ.deleteMany({ where: { category: `blog-${post.id}` } })
      // Create new
      if (faqs.length > 0) {
        await prisma.fAQ.createMany({
          data: faqs.map((faq: any, i: number) => ({
            question: faq.question,
            answer: faq.answer,
            category: `blog-${post.id}`,
            order: i,
          }))
        })
      }
    }

    return NextResponse.json({ ok: true, data: post });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: This item has linked records.' }, { status: 400 });
    }
    if (err.code === 'P2002') {
      return NextResponse.json({ ok: false, error: 'A post with this title/slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 });

    // Clean up associated FAQs first
    await prisma.fAQ.deleteMany({
      where: { category: `blog-${id}` }
    })

    await prisma.blog.delete({
      where: { id }
    })

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: This item has linked records.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete post' }, { status: 500 });
  }
}


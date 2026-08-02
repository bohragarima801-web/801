import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    // Fetch blogs with coverImage and content images
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        coverImageAlt: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        content: true,
        status: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    // Global SEO setting
    const globalSeoSetting = await prisma.websiteSetting.findUnique({
      where: { key: 'seo_global' }
    })

    const mappedBlogs = blogs.map(b => {
      // Find inline markdown images in content: ![alt](src)
      const inlineImages: { alt: string; src: string }[] = []
      const regex = /!\[([^\]]*)\]\(([^)]+)\)/g
      let match
      while ((match = regex.exec(b.content)) !== null) {
        inlineImages.push({ alt: match[1] || '', src: match[2] })
      }

      const missingCoverAlt = !!b.coverImage && !b.coverImageAlt
      const missingInlineAltCount = inlineImages.filter(img => !img.alt.trim()).length

      return {
        id: b.id,
        title: b.title,
        slug: b.slug,
        coverImage: b.coverImage,
        coverImageAlt: b.coverImageAlt || '',
        seoTitle: b.seoTitle || '',
        seoDescription: b.seoDescription || '',
        seoKeywords: b.seoKeywords || '',
        status: b.status,
        inlineImagesCount: inlineImages.length,
        missingInlineAltCount,
        hasMissingAlt: missingCoverAlt || missingInlineAltCount > 0,
      }
    })

    return NextResponse.json({
      ok: true,
      data: {
        blogs: mappedBlogs,
        globalSeo: globalSeoSetting ? globalSeoSetting.value : null,
      }
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { action } = body

    if (action === 'update_blog_alt') {
      const { id, coverImageAlt } = body
      if (!id) return NextResponse.json({ ok: false, error: 'Blog ID is required' }, { status: 400 })

      const blog = await prisma.blog.findUnique({ where: { id } })
      if (!blog) return NextResponse.json({ ok: false, error: 'Blog not found' }, { status: 404 })

      const updated = await prisma.blog.update({
        where: { id },
        data: { coverImageAlt: coverImageAlt.trim() }
      })

      return NextResponse.json({ ok: true, message: 'Alt text updated live in database!', data: updated })
    }

    if (action === 'auto_fix_all_alts') {
      const blogs = await prisma.blog.findMany()
      let updatedCount = 0

      for (const b of blogs) {
        const autoAlt = b.coverImageAlt || `${b.title} - Online Puja Booking & Spiritual Guide DivyaYagyam`
        
        // Auto fill inline images missing alt tags
        let updatedContent = b.content
        let contentModified = false

        updatedContent = updatedContent.replace(/!\[(.*?)\]\(([^)]+)\)/g, (match, altText, src) => {
          if (!altText || !altText.trim()) {
            contentModified = true
            const inlineAlt = `${b.title} - ${b.seoKeywords ? b.seoKeywords.split(',')[0] : 'DivyaYagyam'}`
            return `![${inlineAlt}](${src})`
          }
          return match
        })

        const needsCoverAltFix = b.coverImage && !b.coverImageAlt

        if (needsCoverAltFix || contentModified) {
          await prisma.blog.update({
            where: { id: b.id },
            data: {
              coverImageAlt: autoAlt,
              content: updatedContent,
            }
          })
          updatedCount++
        }
      }

      return NextResponse.json({ ok: true, message: `Successfully updated ${updatedCount} blog posts with live SEO Alt Texts!` })
    }

    if (action === 'update_global_seo') {
      const { seoData } = body
      const setting = await prisma.websiteSetting.upsert({
        where: { key: 'seo_global' },
        create: {
          key: 'seo_global',
          value: seoData,
          group: 'seo',
        },
        update: {
          value: seoData,
        }
      })
      return NextResponse.json({ ok: true, message: 'Global SEO settings updated live in DB!', data: setting })
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update SEO' }, { status: 500 })
  }
}

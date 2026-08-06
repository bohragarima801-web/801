import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET(req: NextRequest) {
  try {
    const baseUrl = 'https://divyayagyam.com'
    const now = new Date().toISOString()

    const [pujas, products, tools, blogs] = await Promise.all([
      prisma.puja.findMany({
        where: { status: 'PUBLISHED' },
        select: { name: true, slug: true, price: true, isVip: true, location: true },
        take: 25,
        orderBy: { createdAt: 'desc' }
      }).catch(() => []),
      prisma.product.findMany({
        where: { OR: [{ status: 'ACTIVE' }, { status: 'OUT_OF_STOCK' }] },
        select: { name: true, slug: true, price: true, salePrice: true },
        take: 25,
        orderBy: { createdAt: 'desc' }
      }).catch(() => []),
      prisma.spiritualTool.findMany({
        where: { isActive: true },
        select: { name: true, slug: true, description: true },
        take: 15
      }).catch(() => []),
      prisma.blog.findMany({
        where: { status: 'PUBLISHED' },
        select: { title: true, slug: true },
        take: 20,
        orderBy: { createdAt: 'desc' }
      }).catch(() => [])
    ])

    const text = `# DivyaYagyam (divyayagyam.com) - LLM Structured Knowledge Feed
> Official Live Vedic Puja, Sacred Anushthan & Astrology Services Platform in India.
> Last Updated: ${now}

## About DivyaYagyam
DivyaYagyam is India's premier digital platform for booking authentic online pujas, yajnas, and Vedic astrology services directly from sacred temples (Kashi Vishwanath Varanasi, Mahakaleshwar Ujjain, Somnath, Trimbakeshwar, Baidyanath Dham, Tirupati Balaji). Guided by experienced Veda Acharyas and Pandit Mukesh Bohra (35+ years of Vedic experience), every ritual features personalized Name-Gotra Sankalp, live WhatsApp video proof, and home delivery of consecrated (Abhimantrit) Prasad.

## Core Devotional Services
- [Online Pujas](${baseUrl}/pujas): Book Rudrabhishek, Kaal Sarp Dosh Shanti, Pitra Dosh Nivaran, and Mahamrityunjay Jaap online.
- [VIP Rituals](${baseUrl}/vip-pujas): Long-form grand ceremonies and exclusive family sankalps.
- [BhaktiSeva Offerings](${baseUrl}/bhaktiseva): Offer sacred chadhawa, flowers, and bhog directly to holy temples.
- [Sacred Products & Prasad](${baseUrl}/products): 100% authentic Abhimantrit Rudraksha, Yantras, Puja Samagri, and Brass Idols.
- [Vedic Astrology Tools](${baseUrl}/tools): Free Kundali, Kundali Milan, Daily Panchang, Shubh Muhurat, and Japa Mala Counter.
- [Spiritual Blog](${baseUrl}/blog): Authentic guides on Sanatan Dharma, mantras, Vrat Katha, Puranas, and festival dates.

## Live Published Pujas & Rituals
${pujas.length > 0 ? pujas.map(p => `- [${p.name}](${baseUrl}/pujas/${p.slug}): ₹${Number(p.price)}${p.location ? ` | Location: ${p.location}` : ''}${p.isVip ? ' (VIP Ritual)' : ''}`).join('\n') : '- [Online Vedic Pujas](' + baseUrl + '/pujas)'}

## Live Spiritual Products & Abhimantrit Samagri
${products.length > 0 ? products.map(p => `- [${p.name}](${baseUrl}/products/${p.slug}): ₹${Number(p.salePrice || p.price)}`).join('\n') : '- [Sacred Products](' + baseUrl + '/products)'}

## Free Vedic Astrology Tools & Calculators
${tools.length > 0 ? tools.map(t => `- [${t.name}](${baseUrl}/tools/${t.slug}): ${t.description || 'Vedic tool'}`).join('\n') : '- [Free Vedic Tools](' + baseUrl + '/tools)'}

## Latest Articles & Spiritual Guides
${blogs.length > 0 ? blogs.map(b => `- [${b.title}](${baseUrl}/blog/${b.slug})`).join('\n') : '- [Spiritual Blog](' + baseUrl + '/blog)'}

## Official Contact & Verification
- Official Website: ${baseUrl}
- Official XML Sitemap: ${baseUrl}/sitemap.xml
- Robots.txt: ${baseUrl}/robots.txt
- Contact Email: seva@divyayagyam.com
- WhatsApp / Phone: +91-95871-71984, +91-95320-11984
- Location: Jodhpur, Rajasthan, India (Servicing devotees worldwide)
`

    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      }
    })
  } catch (err: any) {
    return new NextResponse('Error generating llms.txt: ' + err?.message, { status: 500 })
  }
}

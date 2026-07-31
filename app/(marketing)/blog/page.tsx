

import { prisma } from '@/lib/prisma'
import Image from 'next/image';
import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { getSafeImageUrl, DEFAULT_PLACEHOLDER_IMAGE } from '@/lib/utils'

export function generateMetadata() {
  return generatePageMeta({
    title: 'सनातन धर्म ब्लॉग — पूजा विधि, मंत्र, ज्योतिष | DivyaYagyam',
    description: 'सनातन धर्म, पूजा विधि, मंत्र, व्रत कथा, ज्योतिष ज्ञान। पढ़ें विद्वान आचार्यों के लेख और आध्यात्मिक मार्गदर्शन।',
    path: '/blog',
  })
}
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Calendar, User } from 'lucide-react'

export const revalidate = 30

export default async function BlogListPage() {
  const posts = await prisma.blog.findMany({
    where: { 
      status: 'PUBLISHED',
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: new Date() } }
      ]
    },
    include: {
      category: { select: { name: true } },
      author: { select: { fullName: true } }
    },
    orderBy: { publishedAt: 'desc' }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: 'DivyaYagyam Spiritual Blog',
        description: 'Articles on dharma, mantras, festivals, and spiritual guidance.',
        url: `${BASE_URL}/blog`,
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Blog', url: `${BASE_URL}/blog` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-blog-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="secondary" className="mb-3">✍️ Spiritual Insights</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Divine Wisdom Blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Articles on dharma, mantras, festivals, and spiritual guidance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Card key={post.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden border">
            <div className="aspect-video relative overflow-hidden bg-slate-100">
              <img 
                loading="lazy" 
                src={getSafeImageUrl(post.coverImage)} 
                alt={`${post.title} - ${post.category?.name || 'Spirituality'} | DivyaYagyam`} 
                title={post.title}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_PLACEHOLDER_IMAGE
                }}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <CardContent className="p-6 flex flex-col justify-between h-[300px]">
              <div className="space-y-3">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                  {post.category?.name || 'Spirituality'}
                </Badge>
                <h3 className="font-bold text-xl line-clamp-2 group-hover:text-[var(--primary-color)] transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.excerpt || post.content.substring(0, 150).replace(/[#*`]/g, '') + '...'}
                </p>
              </div>
              <div className="pt-4 border-t flex items-center justify-between text-xs text-slate-500 mt-auto">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author?.fullName || 'Admin'}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.publishedAt?.toLocaleDateString('en-IN') || ''}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed rounded-xl">
            No published articles found. Check back later!
          </div>
        )}
      </div>
    </div>
    </>
  )
}


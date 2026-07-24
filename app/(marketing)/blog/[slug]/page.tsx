

import { notFound } from 'next/navigation'
import Image from 'next/image';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'

export const revalidate = 30

function getEmbedUrl(url: string | null): string | null {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  return url;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({
    where: { slug: slug },
    select: { title: true, excerpt: true, seoTitle: true, seoDescription: true, seoKeywords: true, coverImage: true }
  });

  if (!post) return { title: 'Not Found' };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || '',
    keywords: post.seoKeywords || undefined,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || '',
      images: post.coverImage ? [post.coverImage] : [],
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({
    where: { slug: slug },
    include: {
      category: { select: { name: true } },
      author: { select: { fullName: true } }
    }
  })

  if (!post || post.status !== 'PUBLISHED' || (post.publishedAt && new Date(post.publishedAt) > new Date())) {
    notFound()
  }

  // Increment views in background
  prisma.blog.update({
    where: { id: post.id },
    data: { views: { increment: 1 } }
  }).catch(() => {})

  const embedVideoUrl = getEmbedUrl(post.videoUrl)

  return (
    <div className="container max-w-4xl py-12 px-4">
      <Button variant="ghost" size="sm" asChild className="mb-8 hover:text-primary rounded-xl">
        <Link href="/blog" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </Button>

      <article className="space-y-6 bg-white border border-gray-100 p-6 md:p-10 rounded-3xl shadow-sm">
        <div className="space-y-3 text-center md:text-left">
          <Badge className="bg-amber-500/10 border border-amber-500/30 text-amber-700 hover:bg-amber-500/20 text-xs py-1 px-3.5 rounded-full font-bold">
            {post.category?.name || 'Spirituality'}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-slate-500 text-lg leading-relaxed font-medium mt-4">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start border-t border-b border-gray-100/60 py-4 gap-6 text-sm font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-[var(--primary-color)]" /> {post.author?.fullName || 'Admin'}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[var(--primary-color)]" /> {post.publishedAt?.toLocaleDateString('en-IN') || 'Unknown Date'}</span>
          <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-[var(--primary-color)]" /> {post.views} views</span>
        </div>

        {post.isVideoEnabled && embedVideoUrl ? (
          <div className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-amber-50">
            <iframe 
              src={embedVideoUrl} 
              className="w-full h-full" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        ) : !post.isVideoEnabled && embedVideoUrl ? (
          <div className="my-8 p-4 text-center italic text-sm text-slate-400 bg-slate-50 border rounded-xl">
            Video disabled by admin.
          </div>
        ) : post.coverImage ? (
          <div className="my-8 aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-4 border-amber-50">
            <img loading="lazy" src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        ) : null}

        <div className="prose prose-amber prose-lg max-w-none text-slate-700 leading-relaxed font-normal">
          <ReactMarkdown>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  )
}

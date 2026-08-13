import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getSafeImageUrl } from '@/lib/utils'
import { ArrowRight, BookOpen } from 'lucide-react'

interface RelatedPostsProps {
  currentPostId: string
  categoryId: string | null
  categoryName: string | null
}

export default async function RelatedPosts({ currentPostId, categoryId, categoryName }: RelatedPostsProps) {
  if (!categoryId) return null

  const now = new Date()

  const related = await prisma.blog.findMany({
    where: {
      id: { not: currentPostId },
      status: 'PUBLISHED',
      categoryId,
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: now } }
      ]
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      coverImageAlt: true,
      publishedAt: true,
      views: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  }).catch(() => [])

  if (!related || related.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-amber-100" aria-label="Related Articles">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-normal">
            इससे मिलते-जुलते लेख पढ़ें
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {categoryName || 'Vedic & Spiritual'} — और जानकारी के लिए
          </p>
        </div>
      </div>

      {/* Related Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {related.map((post) => {
          const imgSrc = getSafeImageUrl(post.coverImage)
          const alt = post.coverImageAlt || `${post.title} - DivyaYagyam`
          const dateStr = post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' })
            : ''

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white border border-amber-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 no-underline"
              title={post.title}
            >
              {/* Thumbnail */}
              <div className="aspect-video w-full bg-amber-50 overflow-hidden relative">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                    <BookOpen className="h-10 w-10 text-amber-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-2">
                <h3 className="text-sm font-bold text-slate-900 leading-relaxed line-clamp-2 group-hover:text-amber-700 transition-colors">
                  {post.title}
                </h3>

                {post.excerpt && (
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                  {dateStr && (
                    <span className="text-[10px] font-bold text-slate-400">{dateStr}</span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-700 group-hover:gap-2 transition-all">
                    पढ़ें <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

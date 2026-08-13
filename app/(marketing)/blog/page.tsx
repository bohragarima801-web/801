
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { getSafeImageUrl } from '@/lib/utils'
import { ArrowRight, Calendar, User, BookOpen } from 'lucide-react'

export function generateMetadata() {
  return generatePageMeta({
    title: 'Sanatan Dharma Blog – Puja Vidhi, Mantra, Vrat & Jyotish | DivyaYagyam',
    description: 'सनातन धर्म, पूजा विधि, मंत्र, व्रत कथा, ज्योतिष ज्ञान। पढ़ें विद्वान आचार्यों के लेख और आध्यात्मिक मार्गदर्शन।',
    path: '/blog',
  })
}

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

      {/* ── Hero Banner (Bright Sanatani Gold) */}
      <section className="relative bg-gradient-to-b from-[#FFF8EB] via-[#FFF3D6] to-[#FFFDF7] py-16 md:py-22 overflow-hidden border-b border-[#F5E2B8]">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[rgba(212,155,0,0.06)] leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5D6] border border-[#F2C94C] shadow-xs mb-5">
            <BookOpen className="h-3.5 w-3.5 text-[#B37B00] fill-[#B37B00]" />
            <span className="text-[#8B5A00] text-[11px] font-extrabold uppercase tracking-[0.14em]">✍️ Spiritual Insights (ज्ञान गंगा)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#2A1508] leading-tight mb-4">
            Divine <span className="bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] bg-clip-text text-transparent">Wisdom Blog</span>
          </h1>
          <p className="text-[#4A2D1B] text-base font-medium max-w-xl mx-auto">
            Articles on dharma, mantras, festivals, and spiritual guidance by our Vedic scholars.
          </p>
        </div>
      </section>

      {/* ── Blog Cards Grid */}
      <section className="bg-[#FFFDF7] py-14 md:py-20">
        <div className="container px-4 md:px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[rgba(139,26,33,0.08)] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-[#8B1A21]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#1E120A] dark:text-white mb-2">
                Articles Coming Soon
              </h3>
              <p className="text-[#8B7355] dark:text-[rgba(245,235,220,0.50)] text-sm">
                Our scholars are preparing spiritual articles. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, idx) => (
                <article
                  key={post.id}
                  className={`puja-card-premium reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}
                >
                  {/* Image */}
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden">
                    <img
                      loading="lazy"
                      src={getSafeImageUrl(post.coverImage)}
                      alt={`${post.title} - ${post.category?.name || 'Spirituality'} | DivyaYagyam`}
                      title={post.title}
                      className="object-cover object-top w-full h-full transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,4,2,0.55)] via-transparent to-transparent pointer-events-none" />
                    {post.category?.name && (
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-md bg-[rgba(12,4,2,0.65)] backdrop-blur-sm text-[rgba(245,235,220,0.85)] text-[10px] font-semibold border border-[rgba(255,255,255,0.10)]">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                    <div className="space-y-2">
                      <h3 className="font-heading font-bold text-lg text-[#1E120A] dark:text-[#F5EBDC] line-clamp-2 leading-normal hover:text-[#8B1A21] transition-colors tracking-normal">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-sm text-[#5A4030] dark:text-[rgba(245,235,220,0.55)] line-clamp-3 leading-relaxed tracking-normal">
                        {post.excerpt || post.content.substring(0, 140).replace(/[#*`]/g, '') + '…'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[rgba(168,124,40,0.12)] flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[#8B7355] dark:text-[rgba(245,235,220,0.40)]">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author?.fullName || 'Admin'}
                        </span>
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {post.publishedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-[#8B1A21] dark:text-[#E06070] text-xs font-bold hover:gap-2 transition-all"
                      >
                        Read <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

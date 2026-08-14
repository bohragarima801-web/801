
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { getSafeImageUrl } from '@/lib/utils'
import { ArrowRight, Calendar, User, BookOpen } from 'lucide-react'

export function generateMetadata() {
  return generatePageMeta({
    title: 'सनातन धर्म एवं वैदिक ज्ञान ब्लॉग',
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

      {/* ── Hero Banner (Warm Ivory & Gold) */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/50 to-[#FFF9EF] py-14 md:py-20 overflow-hidden border-b border-[#E6D6BE] notranslate" translate="no">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] shadow-xs mb-4">
            <BookOpen className="h-3.5 w-3.5 text-[#E58A16]" />
            <span className="text-[#E58A16] text-xs font-bold uppercase tracking-wider">✍️ आध्यात्मिक ज्ञान व पंचांग</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-3">
            सनातन धर्म एवं <span className="text-[#E58A16]">वैदिक ज्ञान गंगा</span>
          </h1>
          <p className="text-[#4A403C] text-sm sm:text-base font-medium max-w-xl mx-auto leading-relaxed">
            पूजा विधि, मंत्र, व्रत त्योहार, ज्योतिष ज्ञान एवं विद्वान आचार्यों द्वारा आध्यात्मिक मार्गदर्शन।
          </p>
        </div>
      </section>

      {/* ── Blog Cards Grid */}
      <section className="bg-[#FFF9EF] py-12 md:py-16 notranslate" translate="no">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto bg-white p-8 rounded-2xl border border-[#E6D6BE]">
              <div className="w-16 h-16 rounded-full bg-[#F7EBD7] flex items-center justify-center mx-auto mb-4 text-[#E58A16]">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[#292321] mb-2">
                शीघ्र आ रहे हैं नए लेख
              </h3>
              <p className="text-[#665E58] text-xs">
                विद्वान आचार्य नए वैदिक लेख तैयार कर रहे हैं।
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl border border-[#E6D6BE] hover:border-[#E58A16] transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-lg flex flex-col overflow-hidden"
                >
                  {/* Image Container */}
                  <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-slate-900 group">
                    <img
                      loading="lazy"
                      src={getSafeImageUrl(post.coverImage)}
                      alt={`${post.title} - ${post.category?.name || 'Spirituality'} | DivyaYagyam`}
                      title={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {post.category?.name && (
                      <div className="absolute bottom-2.5 left-2.5 z-30">
                        <span className="px-2.5 py-1 rounded-md bg-[#292321]/85 text-[#FFF9EF] text-[10px] font-bold border border-white/10 shadow-xs backdrop-blur-xs">
                          {post.category.name}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                    <div className="space-y-2">
                      <h3 className="font-bold text-base sm:text-lg text-[#292321] line-clamp-2 leading-snug hover:text-[#E58A16] transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#4A403C] line-clamp-3 leading-relaxed">
                        {post.excerpt || post.content.substring(0, 140).replace(/[#*`]/g, '') + '…'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E6D6BE] flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-[#665E58]">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3 text-[#C99A3D]" />
                          {post.author?.fullName || 'Admin'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-[#C99A3D]" />
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-xs font-bold text-[#E58A16] hover:text-[#d4790e] inline-flex items-center gap-1"
                      >
                        पढ़ें ➔
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

import { notFound } from 'next/navigation'
import Image from 'next/image';
import Script from 'next/script'
import { generateArticleSchema, generateBreadcrumbSchema, generatePageMeta, BASE_URL } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Eye, FileText, Download, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Metadata } from 'next'
import { getSafeImageUrl, DEFAULT_PLACEHOLDER_IMAGE, sanitizeSlug, convertGoogleDrivePdfUrl } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BlogViewTracker } from '@/components/blog/BlogViewTracker'
import RelatedPosts from '@/components/blog/RelatedPosts'
import { BlogBannerPoster } from '@/components/blog/BlogBannerPoster'

export const revalidate = 3600

// Pre-build all published blog posts at deploy time for faster Google crawling
export async function generateStaticParams() {
  try {
    const posts = await prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    })
    return posts
      .filter(p => p.slug)
      .map(p => ({ slug: p.slug as string }))
  } catch {
    return []
  }
}

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
  const cleanSlug = sanitizeSlug(slug) || slug;
  const post = await prisma.blog.findUnique({
    where: { slug: cleanSlug },
    select: { title: true, excerpt: true, seoTitle: true, seoDescription: true, seoKeywords: true, coverImage: true, coverImageAlt: true }
  });

  if (!post) return generatePageMeta({ title: 'Blog Post Not Found | DivyaYagyam', description: 'The requested article could not be found.', path: `/blog/${cleanSlug}` });

  const keywords = post.seoKeywords ? post.seoKeywords.split(',').map(k => k.trim()) : undefined

  return generatePageMeta({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || '',
    path: `/blog/${cleanSlug}`,
    image: post.coverImage || undefined,
    keywords,
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cleanSlug = sanitizeSlug(slug) || slug;
  const post = await prisma.blog.findUnique({
    where: { slug: cleanSlug },
    include: {
      category: { select: { name: true, id: true } },
      author: { select: { fullName: true } }
    }
  })

  if (!post || post.status !== 'PUBLISHED' || (post.publishedAt && new Date(post.publishedAt) > new Date())) {
    notFound()
  }

  const faqs = await prisma.fAQ.findMany({
    where: { category: `blog-${post.id}`, isActive: true },
    orderBy: { order: 'asc' }
  });

  const embedVideoUrl = getEmbedUrl(post.videoUrl)
  const coverAlt = post.coverImageAlt || `${post.title} - ${post.category?.name || 'Spirituality'} | Online Puja Booking & Spiritual Guide DivyaYagyam`

  return (
    <>
      <BlogViewTracker blogId={post.id} slug={post.slug} />
      <Script
        id={`schema-blog-${post.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              generateArticleSchema({
                title: post.title,
                description: post.excerpt || post.content?.substring(0, 200) || '',
                image: post.coverImage || '/logo.jpg',
                imageAlt: coverAlt,
                slug: post.slug,
                datePublished: post.publishedAt?.toISOString() || post.createdAt?.toISOString() || new Date().toISOString(),
                dateModified: post.updatedAt?.toISOString() || new Date().toISOString(),
              }),
              generateBreadcrumbSchema([
                { name: 'Home', url: BASE_URL },
                { name: 'Blog', url: `${BASE_URL}/blog` },
                { name: post.title, url: `${BASE_URL}/blog/${post.slug}` },
              ]),
            ]
          })
        }}
      />
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.35] tracking-normal font-sans">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-slate-600 text-base md:text-lg leading-[1.8] font-normal mt-4 tracking-normal">
              {post.excerpt}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-start border-t border-b border-gray-100/60 py-4 gap-6 text-sm font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-[var(--primary-color)]" /> {post.author?.fullName || 'Admin'}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-[var(--primary-color)]" /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown Date'}</span>
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
        ) : post.coverImage && !post.coverImage.includes('blog-banner-template') && !post.coverImage.includes('pollinations') && !post.coverImage.startsWith('/ashta') && !post.coverImage.startsWith('/bagala') && !post.coverImage.startsWith('/mahamrityunjaya') ? (
          <figure className="my-8 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border-2 border-amber-300/40 bg-gradient-to-b from-[#2A1508] to-[#120703]">
            <div className="relative aspect-[16/9] w-full max-h-[500px] overflow-hidden flex items-center justify-center">
              <img 
                src={getSafeImageUrl(post.coverImage)} 
                alt="" 
                aria-hidden="true" 
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-115 pointer-events-none" 
              />
              <img 
                loading="lazy" 
                decoding="async" 
                src={getSafeImageUrl(post.coverImage)} 
                alt={coverAlt} 
                title={post.title} 
                itemProp="image" 
                className="relative z-10 w-full h-full max-h-[500px] object-contain p-1 sm:p-2" 
              />
            </div>
            <figcaption className="p-3 text-center text-xs font-semibold text-amber-900/90 bg-amber-50/90 border-t border-amber-100 italic">
              📷 {coverAlt}
            </figcaption>
          </figure>
        ) : (
          <BlogBannerPoster
            title={post.title}
            categoryName={post.category?.name || 'वैदिक पूजा एवं अनुष्ठान'}
            excerpt={post.excerpt}
            authorName={post.author?.fullName || 'आचार्य मुकेश बोहरा जी'}
            dateStr={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('hi-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : null}
          />
        )}

        {/* PDF Material Download Section Banner */}
        {post.pdfUrl && (() => {
          const safePdfUrl = post.pdfUrl.includes('drive.google.com')
            ? convertGoogleDrivePdfUrl(post.pdfUrl)
            : post.pdfUrl
          const isDriveEmbed = safePdfUrl.includes('/preview')
          return (
            <div className="my-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white shadow-xl border border-emerald-500/30 relative overflow-hidden group">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                    <FileText className="h-3.5 w-3.5 text-emerald-400" /> Free PDF Download
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {post.pdfTitle || 'निःशुल्क पीडीएफ पुस्तक / सामग्री डाउनलोड करें'}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
                    सुरक्षित डायरेक्ट लिंक से मुफ्त पीडीएफ प्राप्त करें।
                  </p>
                </div>

                <a
                  href={safePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={!isDriveEmbed && !safePdfUrl.includes('mega.nz')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm md:text-base shadow-lg hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0 w-full sm:w-auto text-center no-underline"
                >
                  <Download className="h-5 w-5" /> {isDriveEmbed ? 'View / Download PDF' : 'Download PDF Now'}
                </a>
              </div>
            </div>
          )
        })()}


        <div 
          className="prose prose-amber prose-lg md:prose-xl max-w-none 
          prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-normal 
          prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:leading-[1.35] 
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:leading-[1.35] prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-4 prose-h2:border-amber-100 
          prose-h3:text-xl md:prose-h3:text-2xl prose-h3:leading-[1.4] prose-h3:text-slate-800 
          prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:text-base md:prose-p:text-lg prose-p:tracking-normal 
          prose-a:text-[var(--primary-color)] prose-a:font-bold prose-a:no-underline hover:prose-a:underline 
          prose-blockquote:border-l-4 prose-blockquote:border-[var(--primary-color)] prose-blockquote:bg-amber-50/50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:text-slate-700 prose-blockquote:shadow-sm prose-blockquote:leading-[1.75]
          prose-li:text-slate-700 prose-li:leading-[1.8] prose-li:marker:text-[var(--primary-color)]
          prose-img:max-h-[500px] prose-img:w-auto prose-img:mx-auto prose-img:object-contain prose-img:rounded-3xl prose-img:shadow-xl prose-img:border-4 prose-img:border-amber-50"
        >
          {(() => {
            const sanitizedContent = (post.content || '')
              .replace(/काशी विश्वनाथ|काशी|हरिद्वार|उज्जैन|त्र्यंबकेश्वर|मथुरा|वृंदावन/g, 'दिव्य प्राचीन स्थान')
              .replace(/👉\s*\[([^\]]+)\][^\:]*\:\s*\[?(\/pujas\/[a-zA-Z0-9\-]+)\]?/g, '👉 [**$1**]($2)')
              .replace(/\[([^\]]+)\]\:\s*\[?(\/pujas\/[a-zA-Z0-9\-]+)\]?/g, '[**$1**]($2)')

            return (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
              a: ({ href, children, ...props }) => {
                if (!href) return <span className="font-semibold text-amber-700">{children}</span>
                const lowerHref = href.toLowerCase()
                const isDriveLink = lowerHref.includes('drive.google.com')
                const isPdf = lowerHref.includes('.pdf') || isDriveLink || lowerHref.includes('mega.nz') || lowerHref.includes('dropbox.com')
                const isExternal = href.startsWith('http://') || href.startsWith('https://')
                const safeHref = isDriveLink ? convertGoogleDrivePdfUrl(href) : href

                if (isPdf) {
                  return (
                    <a
                      href={safeHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 my-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 hover:bg-emerald-100 transition-all text-sm no-underline align-baseline"
                      {...props}
                    >
                      <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{children}</span>
                      <Download className="h-3.5 w-3.5 shrink-0 ml-1 text-emerald-600" />
                    </a>
                  )
                }

                if (href.startsWith('/pujas/') || href.startsWith('/pujas')) {
                  const rawString = typeof children === 'string' 
                    ? children 
                    : Array.isArray(children) 
                    ? children.map(c => (typeof c === 'string' ? c : '')).join('') 
                    : ''

                  const isExplicitCTA = rawString.includes('👉') || rawString.includes('संकल्प') || rawString.includes('बुक करें')

                  if (isExplicitCTA) {
                    return (
                      <div className="my-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300/70 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group not-prose">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">🚩 प्रामाणिक वैदिक पूजा एवं अनुष्ठान</span>
                            <span className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">{children}</span>
                          </div>
                        </div>
                        <Link
                          href={href}
                          className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all shrink-0 no-underline"
                        >
                          ऑनलाइन संकल्प लें ➔
                        </Link>
                      </div>
                    )
                  }

                  return (
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 mx-1 my-0.5 rounded-md bg-amber-500/10 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 text-amber-900 hover:text-white font-bold border border-amber-500/30 hover:border-transparent transition-all duration-200 text-[0.92em] align-baseline no-underline shadow-2xs hover:shadow-xs group cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3 text-amber-600 group-hover:text-white transition-colors shrink-0" />
                      <span className="underline decoration-amber-400/50 decoration-1 underline-offset-2">{children}</span>
                      <span className="text-[9px] font-extrabold uppercase tracking-wide bg-amber-600/15 group-hover:bg-white/25 text-amber-800 group-hover:text-white px-1 py-0.2 rounded-xs ml-0.5 transition-colors">
                        पूजा ➔
                      </span>
                    </Link>
                  )
                }

                if (isExternal) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline font-bold text-amber-700 hover:text-amber-900 underline decoration-amber-400 decoration-1 underline-offset-4 hover:decoration-amber-700 transition-colors"
                      {...props}
                    >
                      <span>{children}</span> ↗
                    </a>
                  )
                }

                return (
                  <Link
                    href={href}
                    className="inline font-bold text-amber-700 hover:text-amber-900 underline decoration-amber-400 decoration-1 underline-offset-4 hover:decoration-amber-700 transition-colors"
                  >
                    <span>{children}</span>
                  </Link>
                )
              },
              img: ({ src, alt, title, ...props }) => {
                if (!src) return null
                const safeSrc = getSafeImageUrl(src)
                const imageAltText = alt || `${post.title} - DivyaYagyam`
                const imageTitleText = title || imageAltText
                return (
                  <figure className="my-8 mx-auto max-w-2xl text-center bg-amber-50/40 border border-amber-200/50 rounded-2xl p-2.5 shadow-sm">
                    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-amber-50">
                      <img
                        src={safeSrc}
                        alt={imageAltText}
                        title={imageTitleText}
                        loading="lazy"
                        decoding="async"
                        itemProp="image"
                        className="w-full h-full object-cover object-center"
                        {...props}
                      />
                    </div>
                    {alt && (
                      <figcaption className="text-center text-xs font-semibold text-amber-900/80 mt-2 px-2">
                        📷 {imageAltText}
                      </figcaption>
                    )}
                  </figure>
                )
              }
            }}
          >
            {sanitizedContent}
          </ReactMarkdown>
          )
        })()}
        </div>

        {faqs.length > 0 && (
          <div className="mt-16 pt-12 border-t border-amber-100">
            <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="bg-slate-50 border border-slate-100 rounded-2xl px-6 data-[state=open]:bg-white data-[state=open]:shadow-md data-[state=open]:border-amber-200 transition-all">
                  <AccordionTrigger className="text-left font-bold text-lg text-slate-800 hover:text-[var(--primary-color)] hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-lg leading-relaxed pb-6">
                    <ReactMarkdown>{faq.answer}</ReactMarkdown>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <RelatedPosts
          currentPostId={post.id}
          categoryId={post.categoryId ?? null}
          categoryName={post.category?.name ?? null}
        />
      </article>
    </div>
    </>
  )
}

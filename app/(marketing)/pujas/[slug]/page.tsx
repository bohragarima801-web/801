import { prisma } from '@/lib/prisma'
import { PujaClientView } from '@/components/puja-client-view'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import Script from 'next/script'
import { generateServiceSchema, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600; // ISR: Revalidate every 3600s

async function getPujaBySlugOrFallback(slug: string) {
  // 1. Try exact slug match
  let puja = await prisma.puja.findUnique({
    where: { slug },
    include: {
      category: true,
      temple: true,
      packages: true,
    }
  });

  // 2. Fallback: Check if slug is partial or old long slug
  if (!puja) {
    puja = await prisma.puja.findFirst({
      where: {
        OR: [
          { id: slug },
          { slug: { contains: slug.slice(0, 15) } },
          { name: { contains: slug.replace(/-/g, ' '), mode: 'insensitive' } }
        ]
      },
      include: {
        category: true,
        temple: true,
        packages: true,
      }
    });
  }

  return puja;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const puja = await getPujaBySlugOrFallback(slug);

  if (!puja) return { title: 'Puja Not Found | DivyaYagyam' };

  const pageUrl = `https://divyayagyam.com/pujas/${puja.slug}`
  const title = puja.seoTitle || `${puja.name} — Book Online Puja & Darshan | DivyaYagyam`
  const description = (puja.seoDescription || puja.shortDescription || puja.description || 'Participate in authentic online puja ritual at sacred temples with video proof on WhatsApp and prasad home delivery.').replace(/<[^>]*>?/gm, '').slice(0, 160)

  return {
    title,
    description,
    keywords: puja.seoKeywords || `${puja.name}, Online Puja, ${puja.temple?.name || 'Temple Puja'}, DivyaYagyam, Sanatan Seva`,
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      }
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'DivyaYagyam',
      locale: 'hi_IN',
      type: 'website',
      images: puja.coverImage ? [{ url: puja.coverImage, width: 1200, height: 630, alt: puja.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: puja.coverImage ? [puja.coverImage] : [],
    }
  };
}

export default async function PujaDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const puja = await getPujaBySlugOrFallback(slug);

  if (!puja || puja.status !== 'PUBLISHED' || (puja.publishedAt && new Date(puja.publishedAt) > new Date())) {
    notFound()
  }

  // Redirect to canonical short slug if accessed via old long URL or ID
  if (slug !== puja.slug) {
    redirect(`/pujas/${puja.slug}`);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "name": puja.name,
        "description": (puja.shortDescription || puja.description || '').replace(/<[^>]*>?/gm, ''),
        "image": puja.coverImage ? [puja.coverImage] : [],
        "startDate": puja.pujaDate ? new Date(puja.pujaDate).toISOString() : new Date().toISOString(),
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "VirtualLocation",
          "url": `https://divyayagyam.com/pujas/${puja.slug}`
        },
        "offers": {
          "@type": "Offer",
          "price": Number(puja.price),
          "priceCurrency": "INR",
          "url": `https://divyayagyam.com/pujas/${puja.slug}`,
          "availability": "https://schema.org/InStock",
          "validFrom": new Date().toISOString()
        },
        "organizer": {
          "@type": "Organization",
          "name": "DivyaYagyam",
          "url": "https://divyayagyam.com"
        }
      },
      generateServiceSchema({
        name: puja.name,
        description: puja.shortDescription || puja.description?.substring(0, 200) || '',
        image: puja.coverImage || '/logo.jpg',
        price: Number(puja.price),
        slug: puja.slug,
        location: puja.temple?.name || puja.city || undefined,
      }),
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Pujas', url: `${BASE_URL}/pujas` },
        { name: puja.name, url: `${BASE_URL}/pujas/${puja.slug}` },
      ]),
    ]
  }

  return (
    <>
      <Script
        id={`schema-puja-${puja.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PujaClientView puja={puja} />
    </>
  )
}


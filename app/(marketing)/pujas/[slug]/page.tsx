import { prisma } from '@/lib/prisma'
import { PujaClientView } from '@/components/puja-client-view'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'

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

  if (!puja) return { title: 'Not Found' };

  return {
    title: puja.seoTitle || puja.name,
    description: puja.seoDescription || puja.shortDescription || '',
    keywords: puja.seoKeywords || undefined,
    openGraph: {
      title: puja.seoTitle || puja.name,
      description: puja.seoDescription || puja.shortDescription || '',
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

  return <PujaClientView puja={puja} />
}


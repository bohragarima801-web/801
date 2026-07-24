import { prisma } from '@/lib/prisma'
import { PujaClientView } from '@/components/puja-client-view'
import { notFound } from 'next/navigation'
export const revalidate = 3600; // ISR: Revalidate every 3600s


export default async function PujaDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const puja = await prisma.puja.findUnique({
    where: { slug },
    include: {
      category: true,
      temple: true,
      packages: true,
    }
  })

  if (!puja || puja.status !== 'PUBLISHED' || (puja.publishedAt && new Date(puja.publishedAt) > new Date())) {
    notFound()
  }

  return <PujaClientView puja={puja} />
}

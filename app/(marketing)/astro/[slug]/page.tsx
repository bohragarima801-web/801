import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function AstroSlugRedirectPage({ params }: PageProps) {
  const { slug } = await params
  redirect(`/horoscope/${slug}`)
}

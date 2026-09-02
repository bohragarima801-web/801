import { redirect } from 'next/navigation'

export default async function AstroChartListingLegacyRedirect({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/horoscope/${id}`)
}

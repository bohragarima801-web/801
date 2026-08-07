import { Suspense } from 'react'
import { Metadata } from 'next'
import { InvoiceSystem } from '@/components/invoice/invoice-system'
import { mockAllInOneInvoice } from '@/lib/mock-invoice-data'

export const metadata: Metadata = {
  title: 'Official Invoice & Booking Receipt — Divyayagyam',
  description: 'Sanatan Seva Official Luxury Invoice & Booking Certificate',
  robots: 'noindex, nofollow'
}

export default async function InvoicePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params

  // Clone mock data with custom orderId if provided
  const invoiceData = {
    ...mockAllInOneInvoice,
    orderNumber: orderId || mockAllInOneInvoice.orderNumber,
    invoiceNumber: orderId ? `INV-${orderId}` : mockAllInOneInvoice.invoiceNumber,
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center">
        <div className="text-[#8B1A21] text-2xl font-serif animate-pulse">ॐ Divyayagyam Invoice Engine...</div>
      </div>
    }>
      <InvoiceSystem initialData={invoiceData} allowDemoSwitcher={true} />
    </Suspense>
  )
}

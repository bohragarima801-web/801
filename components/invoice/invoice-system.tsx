'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShieldCheck, Download, Printer, MessageCircle, Mail, Sparkles, CheckCircle2,
  Calendar, Clock, MapPin, User, FileText, Package, Flame, Heart, Award, ChevronRight,
  ExternalLink, CreditCard, Truck, AlertCircle, Copy, Share2
} from 'lucide-react'
import { InvoiceData } from '@/types/invoice'
import { mockAllInOneInvoice, mockPujaOnlyInvoice, mockProductsOnlyInvoice } from '@/lib/mock-invoice-data'

interface InvoiceSystemProps {
  initialData?: InvoiceData
  allowDemoSwitcher?: boolean
}

export function InvoiceSystem({ initialData, allowDemoSwitcher = true }: InvoiceSystemProps) {
  const [data, setData] = useState<InvoiceData>(initialData || mockAllInOneInvoice)
  const [copied, setCopied] = useState(false)

  const {
    invoiceNumber,
    orderNumber,
    bookingNumber,
    invoiceDate,
    paymentDate,
    customer,
    spiritualDetails,
    pujaBookings = [],
    vipPujas = [],
    bhaktiSeva = [],
    products = [],
    digitalTools = [],
    summary,
    paymentDetails,
    bookingDetails,
    deliveryDetails
  } = data

  const hasPujas = pujaBookings.length > 0
  const hasVipPujas = vipPujas.length > 0
  const hasBhaktiSeva = bhaktiSeva.length > 0
  const hasProducts = products.length > 0
  const hasDigitalTools = digitalTools.length > 0

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black tracking-wide uppercase shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            🟢 PAID
          </span>
        )
      case 'PARTIALLY_PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black tracking-wide uppercase">
            <span className="h-2 w-2 rounded-full bg-amber-600" />
            🟡 PARTIALLY PAID
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-xs font-black tracking-wide uppercase">
            <span className="h-2 w-2 rounded-full bg-rose-600" />
            🔴 PAYMENT PENDING
          </span>
        )
    }
  }

  const getBookingBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge-divine bg-emerald-50 text-emerald-800 border-emerald-300">✓ Confirmed</span>
      case 'SCHEDULED':
        return <span className="badge-divine bg-blue-50 text-blue-800 border-blue-300">📅 Scheduled</span>
      case 'COMPLETED':
        return <span className="badge-divine bg-purple-50 text-purple-800 border-purple-300">🌟 Completed</span>
      default:
        return <span className="badge-divine bg-amber-50 text-amber-800 border-amber-300">⏳ In Progress</span>
    }
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `नमस्ते! दिव्ययज्ञम् (Divyayagyam) रसीद व बुकिंग विवरण:\nरसीद सं: ${invoiceNumber}\nऑर्डर सं: ${orderNumber}\nराशि: ₹${summary.grandTotal.toLocaleString('hi-IN')}\nविवरण देखें: ${typeof window !== 'undefined' ? window.location.href : ''}`
  )}`

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1A1A1A] py-6 sm:py-12 px-3 sm:px-6 relative font-sans selection:bg-[#C89B3C]/20">
      {/* CSS for print mode & floating watermark */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            background: #ffffff !important;
          }
          .page-break-before {
            page-break-before: always !important;
          }
          .break-inside-avoid {
            page-break-inside: avoid !important;
          }
        }

        .badge-divine {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          border-width: 1px;
          font-size: 0.75rem;
          font-weight: 800;
        }

        .gold-card {
          background-color: #FFFFFF;
          border: 1px solid #E8DDD0;
          border-radius: 14px;
          box-shadow: 0 2px 12px rgba(36, 26, 24, 0.04);
        }

        .gold-table th {
          background-color: #F7F0E6;
          color: #7A1F2B;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 0.875rem 1rem;
          border-bottom: 1.5px solid #E8DDD0;
        }

        .gold-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #E8DDD0;
          font-size: 0.875rem;
          color: #241A18;
        }

        .gold-table tr:nth-child(even) {
          background-color: #FFF9F1;
        }
      `}</style>

      {/* ============================================================
          TOP ACTION TOOLBAR (NO-PRINT)
          ============================================================ */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95 backdrop-blur-md p-4 rounded-card border border-[#E8DDD0] shadow-card">
        {/* Left: Branding & Status */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7A1F2B] to-[#52131D] text-white flex items-center justify-center font-serif font-black text-xl shadow-xs border border-[#C89B3C]/40">
            ॐ
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#241A18]">DivyaYagyam Official Invoice Engine</h2>
            <p className="text-[11px] text-[#C89B3C] font-bold">Sanatan Seva · Luxury Certificate & Receipt</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {allowDemoSwitcher && (
            <div className="flex items-center gap-1 bg-[#FFF9F1] p-1 rounded-xl border border-[#E8DDD0] mr-2 text-xs">
              <button
                onClick={() => setData(mockAllInOneInvoice)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${data.invoiceNumber === mockAllInOneInvoice.invoiceNumber ? 'bg-[#7A1F2B] text-white' : 'text-[#6F625D] hover:text-[#7A1F2B]'}`}
              >
                All-in-One
              </button>
              <button
                onClick={() => setData(mockPujaOnlyInvoice)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${data.invoiceNumber === mockPujaOnlyInvoice.invoiceNumber ? 'bg-[#7A1F2B] text-white' : 'text-[#6F625D] hover:text-[#7A1F2B]'}`}
              >
                Puja Only
              </button>
              <button
                onClick={() => setData(mockProductsOnlyInvoice)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${data.invoiceNumber === mockProductsOnlyInvoice.invoiceNumber ? 'bg-[#7A1F2B] text-white' : 'text-[#6F625D] hover:text-[#7A1F2B]'}`}
              >
                Products Only
              </button>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A1F2B] hover:bg-[#52131D] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all hover:scale-[1.02] border border-[#C89B3C]/30"
          >
            <Printer className="h-3.5 w-3.5" /> Print / Save PDF
          </button>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-sm hover:bg-emerald-700 transition-all"
          >
            <MessageCircle className="h-3.5 w-3.5 fill-white/20" /> WhatsApp
          </a>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#C89B3C] text-[#8B1A21] font-bold text-xs shadow-xs hover:bg-[#FFF8EA] transition-all"
          >
            <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* ============================================================
          MAIN INVOICE CONTAINER (A4 PDF FRIENDLY & RESPONSIVE)
          ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="print-container max-w-4xl mx-auto bg-[#FFFDF8] border-2 border-[#F0D695] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        {/* Background Subtle Lotus Watermark */}
        <div aria-hidden="true" className="absolute right-[-8%] bottom-[-5%] text-[40vw] font-serif text-[rgba(200,155,60,0.03)] leading-none pointer-events-none select-none z-0">
          🪷
        </div>

        {/* Background Om Watermark Top Center */}
        <div aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 top-4 text-[12vw] font-serif text-[rgba(200,155,60,0.02)] leading-none pointer-events-none select-none z-0">
          ॐ
        </div>

        {/* Top Gold Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-[#8B1A21] via-[#C89B3C] to-[#8B1A21] absolute top-0 left-0 right-0 z-10" />

        <div className="relative z-10 space-y-8">

          {/* ============================================================
              HEADER: LOGO & FLOATING INVOICE META CARD
              ============================================================ */}
          <header className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-[#F0D695]">
            
            {/* Top Left: Logo & Sanatan Seva Tagline */}
            <div className="space-y-2">
              <Link href="/" className="inline-flex items-center gap-3 group">
                <div className="h-14 w-14 rounded-2xl bg-white p-1 shadow-md border-2 border-[#C89B3C]/40 ring-1 ring-amber-300/30 flex items-center justify-center">
                  <img
                    src="/logo.jpg"
                    alt="Divyayagyam Logo"
                    className="h-full w-full object-contain rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.jpg'
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black sacred-gradient-text tracking-wide leading-none" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
                    Divyayagyam
                  </h1>
                  <p className="text-[10px] sm:text-[11px] text-[#8B5A00] font-black tracking-[0.2em] uppercase mt-1">
                    Sanatan Seva · दिव्य अनुभूति
                  </p>
                </div>
              </Link>

              <div className="pt-1 text-xs text-[#6A4D3B] font-medium leading-relaxed max-w-xs">
                <p>भारत का सबसे भरोसेमंद ऑनलाइन वैदिक पूजा एवं अनुष्ठान संस्थान</p>
                <p className="text-[11px] text-[#8B7355] mt-0.5">divyayagyam.com · +91 95304-01984</p>
              </div>
            </div>

            {/* Top Right: Floating Invoice Details Card */}
            <div className="w-full md:w-auto bg-[#FFF9EE] border-2 border-[#F0D695] rounded-2xl p-5 shadow-md space-y-3 min-w-[280px]">
              <div className="flex items-center justify-between gap-3 border-b border-[#F5E2B8] pb-2">
                <span className="text-xs font-black uppercase text-[#8B1A21] tracking-wider">
                  {bookingNumber ? 'Booking Certificate & Invoice' : 'Official Tax Invoice'}
                </span>
                {getPaymentBadge(paymentDetails.status)}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div>
                  <span className="text-[#8B7355] font-bold">Invoice No:</span>
                  <p className="font-black text-[#2A1508] font-mono">{invoiceNumber}</p>
                </div>
                <div>
                  <span className="text-[#8B7355] font-bold">Order No:</span>
                  <p className="font-black text-[#2A1508] font-mono">{orderNumber}</p>
                </div>
                {bookingNumber && (
                  <div>
                    <span className="text-[#8B7355] font-bold">Booking No:</span>
                    <p className="font-black text-[#8B1A21] font-mono">{bookingNumber}</p>
                  </div>
                )}
                <div>
                  <span className="text-[#8B7355] font-bold">Invoice Date:</span>
                  <p className="font-bold text-[#2A1508]">{invoiceDate}</p>
                </div>
              </div>
            </div>

          </header>


          {/* ============================================================
              CUSTOMER & SPIRITUAL DETAILS GRID
              ============================================================ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
            
            {/* Customer Details Box */}
            <div className="gold-card p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-[#F5E2B8] pb-2">
                <User className="h-4 w-4 text-[#8B1A21]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#8B1A21]">
                  भक्त एवं ग्राहक विवरण (Devotee Info)
                </h3>
              </div>

              <div className="space-y-1 text-xs text-[#2A1508]">
                <p className="text-sm font-extrabold text-[#8B1A21]">{customer.fullName}</p>
                <p className="font-semibold">{customer.address}</p>
                <p className="font-semibold">
                  {customer.city}, {customer.state} - {customer.pincode}
                </p>
                <p className="font-semibold">{customer.country}</p>
                <div className="pt-2 text-[#6A4D3B] font-bold flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                  <span>📞 {customer.phone}</span>
                  <span>✉️ {customer.email}</span>
                </div>
              </div>
            </div>

            {/* Spiritual Details Box (Sankalp, Gotra, etc.) */}
            {spiritualDetails && (
              <div className="gold-card p-5 space-y-3 bg-[#FFFBF0]">
                <div className="flex items-center gap-2 border-b border-[#F5E2B8] pb-2">
                  <Sparkles className="h-4 w-4 text-[#C89B3C]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#8B5A00]">
                    संकल्प एवं धार्मिक विवरण (Spiritual Details)
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {spiritualDetails.sankalpName && (
                    <div className="col-span-2 bg-white/80 p-2 rounded-xl border border-[#F5E2B8]">
                      <span className="text-[10px] text-[#8B7355] font-bold uppercase">संकल्पकर्ता नाम:</span>
                      <p className="font-extrabold text-[#8B1A21]">{spiritualDetails.sankalpName}</p>
                    </div>
                  )}
                  {spiritualDetails.gotra && (
                    <div className="bg-white/80 p-2 rounded-xl border border-[#F5E2B8]">
                      <span className="text-[10px] text-[#8B7355] font-bold uppercase">गोत्र (Gotra):</span>
                      <p className="font-bold text-[#2A1508]">{spiritualDetails.gotra}</p>
                    </div>
                  )}
                  {spiritualDetails.rashi && (
                    <div className="bg-white/80 p-2 rounded-xl border border-[#F5E2B8]">
                      <span className="text-[10px] text-[#8B7355] font-bold uppercase">राशि / नक्षत्र:</span>
                      <p className="font-bold text-[#2A1508]">{spiritualDetails.rashi} {spiritualDetails.nakshatra ? `(${spiritualDetails.nakshatra})` : ''}</p>
                    </div>
                  )}
                  {spiritualDetails.purposeOfPuja && (
                    <div className="col-span-2 bg-white/80 p-2 rounded-xl border border-[#F5E2B8]">
                      <span className="text-[10px] text-[#8B7355] font-bold uppercase">पूजा संकल्प उद्देश्य:</span>
                      <p className="font-medium text-[#2A1508] italic">{spiritualDetails.purposeOfPuja}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </section>


          {/* ============================================================
              DYNAMIC ITEM SECTIONS (1 TO 5) - AUTO HIDE EMPTY
              ============================================================ */}

          {/* SECTION 1: PUJA BOOKINGS */}
          {hasPujas && (
            <section className="space-y-3 break-inside-avoid">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-[#8B1A21]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-[#8B1A21]">
                  1. वैदिक पूजा एवं अनुष्ठान (Puja Bookings)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#F0D695] bg-white shadow-sm">
                <table className="w-full text-left border-collapse gold-table">
                  <thead>
                    <tr>
                      <th>Puja Name & Details</th>
                      <th>Temple / Location</th>
                      <th>Assigned Pandit</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Discount</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pujaBookings.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p className="font-black text-[#8B1A21]">{item.name}</p>
                        </td>
                        <td>
                          <p className="font-semibold text-xs text-[#4A2D1B]">{item.temple}</p>
                        </td>
                        <td>
                          <p className="font-semibold text-xs text-[#4A2D1B]">{item.pandit}</p>
                        </td>
                        <td className="text-center font-bold">{item.quantity}</td>
                        <td className="text-right font-medium">₹{item.price.toLocaleString('hi-IN')}</td>
                        <td className="text-right text-emerald-700 font-medium">
                          {item.discount > 0 ? `-₹${item.discount.toLocaleString('hi-IN')}` : '-'}
                        </td>
                        <td className="text-right font-black text-[#8B1A21]">
                          ₹{item.amount.toLocaleString('hi-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}


          {/* SECTION 2: VIP PUJA */}
          {hasVipPujas && (
            <section className="space-y-3 break-inside-avoid">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#C89B3C]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-[#8B5A00]">
                  2. वीआईपी व्यक्तिगत अनुष्ठान (VIP Personal Puja)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border-2 border-[#C89B3C]/40 bg-[#FFFDF5] shadow-sm">
                <table className="w-full text-left border-collapse gold-table">
                  <thead>
                    <tr>
                      <th>VIP Package Name</th>
                      <th>Exclusive Benefits & Seva Included</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vipPujas.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p className="font-black text-[#8B1A21]">{item.packageName}</p>
                        </td>
                        <td>
                          <p className="text-xs font-semibold text-[#4A2D1B] leading-relaxed">{item.benefits}</p>
                        </td>
                        <td className="text-center font-bold">{item.quantity}</td>
                        <td className="text-right font-black text-[#8B1A21]">
                          ₹{item.amount.toLocaleString('hi-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}


          {/* SECTION 3: BHAKTI SEVA */}
          {hasBhaktiSeva && (
            <section className="space-y-3 break-inside-avoid">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-700 fill-rose-700" />
                <h3 className="text-sm font-black uppercase tracking-wider text-rose-900">
                  3. भक्ति सेवा व दान संकल्प (Bhakti Seva & Offerings)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-rose-200 bg-[#FFF5F5] shadow-sm">
                <table className="w-full text-left border-collapse gold-table">
                  <thead>
                    <tr>
                      <th>Seva Name</th>
                      <th>Seva Purpose & Description</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Donation Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bhaktiSeva.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p className="font-black text-rose-900">{item.sevaName}</p>
                        </td>
                        <td>
                          <p className="text-xs font-semibold text-rose-950">{item.description}</p>
                        </td>
                        <td className="text-center font-bold">{item.quantity}</td>
                        <td className="text-right font-black text-rose-900">
                          ₹{item.donation.toLocaleString('hi-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}


          {/* SECTION 4: SPIRITUAL PRODUCTS */}
          {hasProducts && (
            <section className="space-y-3 break-inside-avoid">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#8B1A21]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-[#8B1A21]">
                  4. सिद्ध आध्यात्मिक सामग्री व प्रसाद (Spiritual Products)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#F0D695] bg-white shadow-sm">
                <table className="w-full text-left border-collapse gold-table">
                  <thead>
                    <tr>
                      <th className="w-16">Item</th>
                      <th>Product Name</th>
                      <th>SKU Code</th>
                      <th className="text-center">Qty</th>
                      <th className="text-right">Price</th>
                      <th className="text-right">Discount</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="h-10 w-10 rounded-lg overflow-hidden border border-[#F0D695] bg-[#FFF8EB] relative">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs">🪔</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <p className="font-black text-[#2A1508]">{item.name}</p>
                        </td>
                        <td>
                          <p className="font-mono text-xs text-[#8B7355]">{item.sku}</p>
                        </td>
                        <td className="text-center font-bold">{item.quantity}</td>
                        <td className="text-right font-medium">₹{item.price.toLocaleString('hi-IN')}</td>
                        <td className="text-right text-emerald-700 font-medium">
                          {item.discount > 0 ? `-₹${item.discount.toLocaleString('hi-IN')}` : '-'}
                        </td>
                        <td className="text-right font-black text-[#8B1A21]">
                          ₹{item.amount.toLocaleString('hi-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}


          {/* SECTION 5: DIGITAL TOOLS */}
          {hasDigitalTools && (
            <section className="space-y-3 break-inside-avoid">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-700" />
                <h3 className="text-sm font-black uppercase tracking-wider text-blue-900">
                  5. डिजिटल ज्योतिष रिपोर्ट व उपकरण (Digital Tools & Reports)
                </h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-blue-200 bg-[#F5F9FF] shadow-sm">
                <table className="w-full text-left border-collapse gold-table">
                  <thead>
                    <tr>
                      <th>Digital Report / Tool</th>
                      <th>Access Validity</th>
                      <th>License Number</th>
                      <th className="text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {digitalTools.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <p className="font-black text-blue-950">{item.name}</p>
                        </td>
                        <td>
                          <p className="text-xs font-semibold text-blue-900">{item.validity}</p>
                        </td>
                        <td>
                          <p className="font-mono text-xs text-blue-700">{item.license}</p>
                        </td>
                        <td className="text-right font-black text-blue-950">
                          ₹{item.amount.toLocaleString('hi-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}


          {/* ============================================================
              ORDER SUMMARY & FINANCIAL BREAKDOWN CARD
              ============================================================ */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6 break-inside-avoid">
            
            {/* Left: Notes & QR Code */}
            <div className="md:col-span-7 gold-card p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#8B1A21] border-b border-[#F5E2B8] pb-2 mb-3">
                  सुरक्षा व सत्यापन (Order Verification & QR Code)
                </h4>
                <div className="flex items-start gap-4">
                  {/* SVG QR Code Simulation */}
                  <div className="h-24 w-24 bg-white p-1.5 rounded-xl border-2 border-[#C89B3C] shadow-xs shrink-0 flex flex-col items-center justify-center text-center">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                        typeof window !== 'undefined' ? window.location.href : `https://divyayagyam.com/orders/${orderNumber}`
                      )}`} 
                      alt="Order QR Verification Code" 
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="text-xs text-[#4A2D1B] space-y-1">
                    <p className="font-bold text-[#8B1A21]">डिजिटल रसीद सत्यापन QR</p>
                    <p className="text-[11px] leading-relaxed">
                      इस QR कोड को स्कैन करके आप संस्थान की वेबसाइट पर इस रसीद एवं पूजा की आधिकारिक स्थिति सत्यापित कर सकते हैं।
                    </p>
                    <p className="text-[10px] text-[#8B7355] pt-1">
                      100% Verified Sanatan Seva Transaction
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F5E2B8] text-[11px] text-[#6A4D3B] font-medium leading-relaxed">
                <p>• यह एक कंप्यूटर जनित रसीद है, इस पर हस्ताक्षर की आवश्यकता नहीं है।</p>
                <p>• पूजा का व्हाट्सएप प्रूफ संकल्प पूर्ण होते ही पंजीकृत मोबाइल नंबर पर उपलब्ध होगा।</p>
              </div>
            </div>

            {/* Right: Grand Financial Summary Box */}
            <div className="md:col-span-5 bg-gradient-to-br from-[#FFF5D6] via-[#FFF3D6] to-[#FFF9EE] border-2 border-[#C89B3C] rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#8B1A21] border-b border-[#F2C94C] pb-2">
                वित्तीय विवरण (Order Summary)
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#4A2D1B]">
                  <span>Subtotal (प्रारंभिक राशि):</span>
                  <span className="font-bold">₹{summary.subtotal.toLocaleString('hi-IN')}</span>
                </div>

                {summary.itemsDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Items Discount (छूट):</span>
                    <span>-₹{summary.itemsDiscount.toLocaleString('hi-IN')}</span>
                  </div>
                )}

                {summary.couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount {summary.couponCode ? `(${summary.couponCode})` : ''}:</span>
                    <span>-₹{summary.couponDiscount.toLocaleString('hi-IN')}</span>
                  </div>
                )}

                {summary.bhaktiDonation > 0 && (
                  <div className="flex justify-between text-rose-800 font-semibold">
                    <span>Gau/Annadan Donation:</span>
                    <span>₹{summary.bhaktiDonation.toLocaleString('hi-IN')}</span>
                  </div>
                )}

                {summary.shippingCharges > 0 ? (
                  <div className="flex justify-between text-[#4A2D1B]">
                    <span>Shipping Charges (प्रसाद डिलीवरी):</span>
                    <span className="font-bold">₹{summary.shippingCharges.toLocaleString('hi-IN')}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Prasad Shipping:</span>
                    <span>FREE (मुफ़्त)</span>
                  </div>
                )}

                {summary.taxAmount > 0 && (
                  <div className="flex justify-between text-[#4A2D1B]">
                    <span>GST Tax {summary.taxRate ? `(${summary.taxRate}%)` : ''}:</span>
                    <span className="font-bold">₹{summary.taxAmount.toLocaleString('hi-IN')}</span>
                  </div>
                )}

                {/* Grand Total Highlight */}
                <div className="pt-3 border-t-2 border-[#C89B3C] flex items-baseline justify-between">
                  <div>
                    <span className="text-xs font-black uppercase text-[#8B1A21] block">Grand Total</span>
                    <span className="text-[10px] text-[#6A4D3B] font-bold">(कुल देय सेवा राशि)</span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-[#8B1A21]">
                    ₹{summary.grandTotal.toLocaleString('hi-IN')}
                  </span>
                </div>

                {/* Paid & Pending status breakdown */}
                <div className="pt-2 flex justify-between text-[11px] font-bold border-t border-[#F2C94C]/60">
                  <span className="text-emerald-800">Paid Amount: ₹{summary.paidAmount.toLocaleString('hi-IN')}</span>
                  {summary.pendingAmount > 0 ? (
                    <span className="text-rose-700">Pending: ₹{summary.pendingAmount.toLocaleString('hi-IN')}</span>
                  ) : (
                    <span className="text-emerald-700">Pending: ₹0 (FULLY PAID)</span>
                  )}
                </div>

              </div>
            </div>

          </section>


          {/* ============================================================
              PAYMENT, BOOKING & DELIVERY VERIFICATION TRACKER
              ============================================================ */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5 break-inside-avoid">
            
            {/* 1. Payment Verification Card */}
            <div className="gold-card p-4 space-y-2">
              <div className="flex items-center gap-2 border-b border-[#F5E2B8] pb-1.5">
                <CreditCard className="h-4 w-4 text-emerald-700" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#2A1508]">
                  भुगतान विवरण (Payment Info)
                </h4>
              </div>
              <div className="space-y-1 text-xs text-[#4A2D1B]">
                <p><span className="text-[#8B7355] font-bold">Method:</span> <span className="font-extrabold">{paymentDetails.method}</span></p>
                <p><span className="text-[#8B7355] font-bold">Txn ID:</span> <span className="font-mono text-[11px]">{paymentDetails.transactionId}</span></p>
                {paymentDetails.razorpayPaymentId && (
                  <p><span className="text-[#8B7355] font-bold">Razorpay ID:</span> <span className="font-mono text-[11px]">{paymentDetails.razorpayPaymentId}</span></p>
                )}
                <p><span className="text-[#8B7355] font-bold">Paid At:</span> {paymentDetails.paymentTime}</p>
              </div>
            </div>

            {/* 2. Booking Details Card (If applicable) */}
            {bookingDetails && (
              <div className="gold-card p-4 space-y-2 bg-[#FFFBF0]">
                <div className="flex items-center justify-between border-b border-[#F5E2B8] pb-1.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#8B1A21]" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#8B1A21]">
                      पूजा अनुसूची (Booking Schedule)
                    </h4>
                  </div>
                  {getBookingBadge(bookingDetails.status)}
                </div>
                <div className="space-y-1 text-xs text-[#4A2D1B]">
                  <p><span className="text-[#8B7355] font-bold">स्थान:</span> <span className="font-bold">{bookingDetails.templeName}</span></p>
                  <p><span className="text-[#8B7355] font-bold">तिथि व समय:</span> <span className="font-bold text-[#8B1A21]">{bookingDetails.scheduledDate} ({bookingDetails.scheduledTime})</span></p>
                  <p><span className="text-[#8B7355] font-bold">वेदाचार्य:</span> {bookingDetails.assignedPandit}</p>
                </div>
              </div>
            )}

            {/* 3. Delivery Tracking Card (If applicable) */}
            {deliveryDetails && (
              <div className="gold-card p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-[#F5E2B8] pb-1.5">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-700" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-blue-900">
                      प्रसाद कूरियर (Shipping)
                    </h4>
                  </div>
                  <span className="badge-divine bg-blue-50 text-blue-800 border-blue-300">
                    🚚 {deliveryDetails.shippingStatus}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-[#4A2D1B]">
                  <p><span className="text-[#8B7355] font-bold">Courier:</span> <span className="font-bold">{deliveryDetails.courierPartner}</span></p>
                  <p><span className="text-[#8B7355] font-bold">Tracking No:</span> <span className="font-mono text-[11px]">{deliveryDetails.trackingNumber}</span></p>
                  <p><span className="text-[#8B7355] font-bold">Expected:</span> <span className="font-bold text-emerald-800">{deliveryDetails.expectedDelivery}</span></p>
                </div>
              </div>
            )}

          </section>


          {/* ============================================================
              FOOTER: BLESSING MESSAGE, CONTACT SUPPORT & TERMS
              ============================================================ */}
          <footer className="pt-8 border-t-2 border-[#F0D695] text-center space-y-4 break-inside-avoid">
            
            {/* Spiritual Quote */}
            <div className="space-y-1">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[#FFF5D6] border border-[#F2C94C] text-[#8B1A21] font-serif text-lg font-bold shadow-xs mx-auto">
                ॐ
              </div>
              <p className="text-base sm:text-lg font-heading font-black text-[#8B1A21]">
                "आपकी श्रद्धा ही हमारी सबसे बड़ी प्रेरणा है।"
              </p>
              <p className="text-xs font-black text-[#8B5A00] tracking-[0.18em] uppercase">
                Divyayagyam · Sanatan Seva · 100% Authentic Vedic Platform
              </p>
            </div>

            {/* Support Links */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-bold text-[#6A4D3B] pt-2">
              <span>🌐 Website: <a href="https://divyayagyam.com" className="text-[#8B1A21] underline">divyayagyam.com</a></span>
              <span>📞 WhatsApp Support: <a href="https://wa.me/919530401984" className="text-emerald-700 underline">+91 95304-01984</a></span>
              <span>✉️ Email: <a href="mailto:support@divyayagyam.com" className="text-[#8B1A21] underline">support@divyayagyam.com</a></span>
            </div>

            {/* Terms & Conditions note */}
            <div className="text-[10px] text-[#8B7355] font-medium max-w-xl mx-auto space-y-0.5 pt-2 border-t border-[#F5E2B8]">
              <p>
                This document serves as an official booking receipt & invoice issued under Divyayagyam platform terms.
              </p>
              <div className="flex justify-center items-center gap-3 font-semibold pt-1">
                <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
                <span>•</span>
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                <span>•</span>
                <Link href="/refunds" className="hover:underline">Refund Policy</Link>
              </div>
            </div>

          </footer>

        </div>
      </motion.div>
    </div>
  )
}

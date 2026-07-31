import Script from 'next/script'
import Link from 'next/link'
import { Headphones, MessageSquare, Phone, Mail, HelpCircle, ShieldCheck, Sparkles, FileText, ArrowRight } from 'lucide-react'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600 // ISR: Revalidate every 3600s

export function generateMetadata() {
  return generatePageMeta({
    title: 'सहायता केंद्र (Support Center) — Devotee Help Desk',
    description: 'DivyaYagyam सहायता केंद्र। पूजा बुकिंग सहायता, संकल्प अपडेट, वीडियो प्रूफ डाउनलोड एवं प्रसाद ट्रैकिंग हेतु 24x7 मदद प्राप्त करें।',
    path: '/support',
  })
}

export default function SupportPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Support Center & Help Desk',
        description: 'DivyaYagyam devotee support center for online puja bookings and assistance.',
        url: `${BASE_URL}/support`,
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Support', url: `${BASE_URL}/support` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-support-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50/50 min-h-screen py-12">
        <div className="container max-w-4xl mx-auto space-y-10 px-4">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--primary-color)]">🎧 Seva Desk</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800">DivyaYagyam Support Center</h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We are committed to resolving your queries with care and prompt devotion. Choose a support option below or contact our team directly for instant assistance with your puja or order.
            </p>
          </div>

          {/* Quick Support Options */}
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* WhatsApp Assistance */}
            <div className="bg-white p-6 border rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-slate-800 text-lg">WhatsApp Help</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fastest way to update Gotra, check puja timings, or receive video proof links directly on WhatsApp.
                </p>
              </div>
              <p className="text-xs font-bold text-slate-800 pt-2 border-t">+91-95871-71984, +91-95320-11984</p>
            </div>

            {/* Email Support */}
            <div className="bg-white p-6 border rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-orange-100 text-[var(--primary-color)] flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-slate-800 text-lg">Email Seva</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  For formal booking modifications, refund inquiries, corporate seva, or detailed astrological questions.
                </p>
              </div>
              <a href="mailto:Seva@divyayagyam.com" className="text-xs font-bold text-[var(--primary-color)] hover:underline pt-2 border-t inline-block">
                Seva@divyayagyam.com
              </a>
            </div>

            {/* AI Pandit Guidance */}
            <div className="bg-white p-6 border rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="font-bold text-slate-800 text-lg">Ask AI Pandit</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instant guidance on which puja is suitable for your Rashi, Nakshatra, or specific life situation.
                </p>
              </div>
              <Link href="/ask-a-pandit" className="text-xs font-bold text-slate-800 hover:text-[var(--primary-color)] flex items-center gap-1 pt-2 border-t">
                Consult AI Pandit <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

          </div>

          {/* Detailed Resolution Guide */}
          <div className="bg-white p-6 md:p-10 border rounded-3xl shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[var(--primary-color)]" /> Common Support Requests
            </h2>

            <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed">
              <div className="border-b pb-4 space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">1. How do I provide my Name and Gotra for the Sankalp?</h3>
                <p>You can enter your Name, Gotra, and special prayers during checkout. If you forgot to include them, simply WhatsApp your Booking ID to +91-95871-71984 prior to the puja start time.</p>
              </div>

              <div className="border-b pb-4 space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">2. When will I receive the Video Proof of my Puja?</h3>
                <p>Video proof recordings are shared via WhatsApp within <strong>24 to 48 hours</strong> after the ritual is performed by the priest.</p>
              </div>

              <div className="border-b pb-4 space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">3. How can I track my Prasad shipping?</h3>
                <p>Tracking links from our courier partners (Speed Post / BlueDart) are sent to your registered WhatsApp number as soon as the package is dispatched (usually 1–2 days after puja completion).</p>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">4. Need to cancel or reschedule?</h3>
                <p>Cancellations or date changes can be requested free of charge at least 2 hours before the scheduled puja. Please read our full <Link href="/refunds" className="text-[var(--primary-color)] font-bold hover:underline">Refund & Cancellation Policy</Link>.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

import Script from 'next/script'
import Link from 'next/link'
import { Truck, ShieldCheck, Clock, PackageCheck, Globe, MapPin, Mail, Phone } from 'lucide-react'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600 // ISR: Revalidate every 3600s

export function generateMetadata() {
  return generatePageMeta({
    title: 'प्रसाद शिपिंग एवं डिलीवरी नीति (Prasad Delivery Policy)',
    description: 'DivyaYagyam शिपिंग नीति। काशी, महाकाल एवं सिद्ध मंदिरों का अभिमंत्रित प्रसाद भारत भर में 3-5 दिनों में सुरक्षित होम डिलीवरी।',
    path: '/shipping',
  })
}

export default function ShippingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Shipping Policy', url: `${BASE_URL}/shipping` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-shipping-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50/50 min-h-screen py-12">
        <div className="container max-w-4xl mx-auto space-y-8 px-4">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-black text-slate-800">Shipping & Prasad Delivery Policy</h1>
            <p className="text-xs text-slate-500">Last updated: July 17, 2026</p>
          </div>

          {/* Body Content */}
          <div className="bg-white p-6 md:p-10 border rounded-3xl shadow-sm space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed prose max-w-none prose-orange">
            
            {/* Overview */}
            <section className="space-y-2">
              <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--primary-color)]" /> Overview & Delivery Promise
              </h2>
              <p>
                At <strong>DivyaYagyam</strong>, we understand the deep sanctity of sacred offerings. When you participate in an online puja or order spiritual essentials, we take utmost care to ensure that your <strong>Abhimantrit Prasad</strong>, sacred gangajal, dry fruits, bhasma, and blessed items reach your doorstep safely and with complete reverence.
              </p>
              <p>
                All physical items are dispatched following strict hygienic and traditional packing guidelines directly from our temple hubs or spiritual center in Jodhpur, Rajasthan.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 1. Processing & Dispatch Timelines */}
            <section className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--primary-color)]" /> 1. Processing & Dispatch Timelines
              </h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Puja Prasad Dispatch:</strong> Prasad is dispatched within <strong>24 to 48 hours</strong> after the completion of the ritual, allowing time for sacred packaging and consecration.
                </li>
                <li>
                  <strong>Store Products Dispatch:</strong> Orders for rudraksha, yantras, and puja essentials are packed and handed over to courier partners within <strong>1–2 business days</strong>.
                </li>
                <li>
                  <strong>Tracking Information:</strong> Once your package is shipped, a tracking link and consignment number are shared via WhatsApp and email.
                </li>
              </ul>
            </section>

            <hr className="border-slate-100" />

            {/* 2. Domestic Delivery Timelines (India) */}
            <section className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-[var(--primary-color)]" /> 2. Domestic Delivery Timelines (India)
              </h2>
              <p>We partner with India's most reliable courier services (BlueDart, Delhivery, India Post Speed Post):</p>
              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                <div className="bg-slate-50 p-4 rounded-2xl border space-y-1">
                  <p className="font-bold text-slate-800 text-xs md:text-sm">Metro & Tier 1 Cities</p>
                  <p className="text-xs text-slate-600">Expected delivery within <strong>3 to 5 business days</strong> from dispatch.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border space-y-1">
                  <p className="font-bold text-slate-800 text-xs md:text-sm">Rest of India & Rural Areas</p>
                  <p className="text-xs text-slate-600">Expected delivery within <strong>5 to 7 business days</strong> via Speed Post.</p>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 3. International Shipping */}
            <section className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--primary-color)]" /> 3. International Shipping
              </h2>
              <p>
                DivyaYagyam serves NRI devotees worldwide (USA, UK, Canada, Australia, UAE, Singapore, etc.). International shipping charges are calculated at checkout based on destination and weight. Delivery typically takes <strong>7 to 14 business days</strong> depending on customs clearance.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 4. Sacred Packaging & Damage Guarantee */}
            <section className="space-y-3">
              <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[var(--primary-color)]" /> 4. Sacred Packaging & Replacement Guarantee
              </h2>
              <p>
                Prasad items (dry fruits, misri, sacred threads, vibhuti) are sealed in tamper-proof, food-grade protective pouches to preserve freshness. In the unlikely event that your package is damaged during transit, please contact us within 48 hours at <strong>Seva@divyayagyam.com</strong> with a photo, and we will send a free replacement.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 5. Contact Support */}
            <section className="space-y-4 pt-2">
              <h2 className="text-base md:text-lg font-black text-slate-800">5. Shipping Support & Tracking Help</h2>
              <div className="grid gap-4 sm:grid-cols-2 text-xs md:text-sm">
                <div className="space-y-2">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--primary-color)]" /> Center: Jodhpur, Rajasthan, India</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-[var(--primary-color)]" /> Email: <a href="mailto:Seva@divyayagyam.com" className="hover:underline text-[var(--primary-color)] font-bold">Seva@divyayagyam.com</a></p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-[var(--primary-color)]" /> WhatsApp: +91-95871-71984, +91-95320-11984</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </>
  )
}

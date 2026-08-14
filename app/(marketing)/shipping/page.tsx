import Script from 'next/script'
import Link from 'next/link'
import { Truck, ShieldCheck, Clock, PackageCheck, Globe, MapPin, Mail, Phone } from 'lucide-react'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600

export function generateMetadata() {
  return generatePageMeta({
    title: 'प्रसाद शिपिंग एवं डिलीवरी नीति',
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
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-shipping-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-12 md:py-16 overflow-hidden border-b border-[#E6D6BE]">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#292321] mb-2">
            प्रसाद शिपिंग एवं डिलीवरी नीति (Shipping Policy)
          </h1>
          <p className="text-xs text-[#665E58]">अंतिम अद्यतन: 2026 • सम्पूर्ण भारत एवं विदेश में सुरक्षित डिलीवरी</p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto space-y-6 px-4 py-8 sm:py-12">
        <div className="bg-white p-5 sm:p-8 md:p-10 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-5 text-xs sm:text-sm text-[#4A403C] leading-relaxed prose max-w-none">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#E58A16]" /> 1. पावन प्रसाद का सम्प्रेषण
            </h2>
            <p>
              दिव्ययज्ञम् में प्रत्येक पूजा सम्पन्न होने के उपरांत अभिमंत्रित पावन प्रसाद (जैसे रक्षा सूत्र, भस्म, सूखे मेवे, रुद्राक्ष आदि) को पवित्र, हाईजीनिक एवं वाटरप्रूफ पैकेजिंग में पैक किया जाता है।
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#E58A16]" /> 2. डिलीवरी समय सीमा (Timeline)
            </h2>
            <p>
              पूजा सम्पन्न होने के अगले कार्यदिवस पर पार्सल कूरियर द्वारा डिस्पैच किया जाता है।
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>मेट्रो शहर (Delhi, Mumbai, Bengaluru, etc.):</strong> 3 से 4 कार्यदिवस</li>
              <li><strong>अन्य भारतीय राज्य एवं शहर:</strong> 4 से 6 कार्यदिवस</li>
              <li><strong>अंतरराष्ट्रीय (NRI) पते:</strong> 7 से 12 कार्यदिवस (Express Air Courier)</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-[#E58A16]" /> 3. लाइव ट्रैकिंग एवं अपडेट
            </h2>
            <p>
              डिस्पैच होते ही कूरियर का ट्रैकिंग नंबर आपके पंजीकृत व्हाट्सएप नंबर एवं ईमेल पर भेज दिया जाता है।
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

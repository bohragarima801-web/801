import Link from 'next/link'
import { Sparkles, Calendar, Heart, ShieldCheck, Mail, Phone, MapPin, AlertCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'रिफंड एवं निरस्तीकरण नीति (Refund & Cancellation) | DivyaYagyam',
    description: 'DivyaYagyam रिफंड एवं निरस्तीकरण नीति। 100% रिफंड गारंटी, पूजा निरस्तीकरण नियम, एवं रीशेड्यूलिंग प्रक्रिया की पूरी जानकारी।',
    path: '/refunds',
  })
}

export const revalidate = 3600

export default async function RefundsPage() {
  const setting = await prisma.websiteSetting.findUnique({
    where: { key: 'cms.refund' }
  })
  const customContent = setting?.value || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Refund Policy', url: `${BASE_URL}/refunds` },
      ]),
    ],
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-refunds-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-12 md:py-16 overflow-hidden border-b border-[#E6D6BE]">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#292321] mb-2">
            रिफंड एवं निरस्तीकरण नीति (Refund Policy)
          </h1>
          <p className="text-xs text-[#665E58]">अंतिम अद्यतन: 2026 • 100% भक्त संतुष्टि एवं रिफंड सुरक्षा</p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto space-y-6 px-4 py-8 sm:py-12">
        <div className="bg-white p-5 sm:p-8 md:p-10 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-5 text-xs sm:text-sm text-[#4A403C] leading-relaxed prose max-w-none">
          {customContent ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} children={customContent as string} />
          ) : (
            <>
              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#E58A16]" /> 1. पूजा निरस्तीकरण एवं 100% रिफंड
                </h2>
                <p>
                  यदि आप किसी कारणवश अपनी निर्धारित पूजा रद्द करना चाहते हैं, तो पूजा प्रारंभ होने से 2 घंटे पूर्व तक सूचना देने पर 100% पूर्ण राशि आपके मूल भुगतान खाते में 5-7 कार्यदिवसों के भीतर रिफंड कर दी जाएगी।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#E58A16]" /> 2. पूजा तिथि में परिवर्तन (Rescheduling)
                </h2>
                <p>
                  आप बिना किसी अतिरिक्त शुल्क के अपनी पूजा को किसी भी अन्य आगामी शुभ तिथि अथवा मुहूर्त में स्थानांतरित करवा सकते हैं।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#E58A16]" /> 3. क्षतिग्रस्त सामग्री या पार्सल रिप्लेसमेंट
                </h2>
                <p>
                  यदि कोरियर द्वारा प्राप्त प्रसाद या सामग्री में कोई क्षति होती है, तो हमें फोटो भेजते ही तुरंत नवीन अभिमंत्रित सामग्री निःशुल्क प्रेषित की जाएगी।
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

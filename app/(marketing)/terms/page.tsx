import Link from 'next/link'
import { ShieldCheck, UserCheck, Sparkles, BookOpen, AlertCircle, Eye, ShieldAlert, Heart, Phone, MapPin } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'नियम एवं शर्तें (Terms of Service)',
    description: 'DivyaYagyam नियम एवं शर्तें। ऑनलाइन पूजा बुकिंग, नाम-गोत्र संकल्प, प्रसाद डिलीवरी, एवं सेवा उपयोग से जुड़ी संपूर्ण नियम व शर्तें।',
    path: '/terms',
  })
}
export const revalidate = 30

export default async function TermsPage() {
  const setting = await prisma.websiteSetting.findUnique({
    where: { key: 'cms.terms' }
  })
  const customContent = setting?.value || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Terms & Conditions', url: `${BASE_URL}/terms` },
      ]),
    ],
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-terms-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-12 md:py-16 overflow-hidden border-b border-[#E6D6BE]">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#292321] mb-2">
            नियम एवं शर्तें (Terms & Conditions)
          </h1>
          <p className="text-xs text-[#665E58]">अंतिम अद्यतन: 2026 • DivyaYagyam Service Agreement</p>
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
                  <ShieldCheck className="h-5 w-5 text-[#E58A16]" /> 1. प्रस्तावना एवं स्वीकृति
                </h2>
                <p>
                  दिव्ययज्ञम् (DivyaYagyam) प्लेटफॉर्म का उपयोग करने पर आप इन सेवा शर्तों से पूर्णतः सहमत होते हैं। हम सनातन वैदिक रीति-रिवाजों के अनुसार पूजा, अनुष्ठान एवं आध्यात्मिक सेवाएं उपलब्ध कराते हैं।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-[#E58A16]" /> 2. नाम-गोत्र संकल्प एवं पूजा सम्पादन
                </h2>
                <p>
                  यजमान द्वारा प्रदान किए गए नाम, गोत्र एवं विशिष्ट मनोकामना के आधार पर वैदिक आचार्यों द्वारा विधि-विधान से पूजा संपन्न की जाती है। पूजा संपन्न होने के उपरांत वीडियो प्रमाण व्हाट्सएप पर प्रेषित किया जाता है।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#E58A16]" /> 3. प्रसाद डिलीवरी एवं दायित्व
                </h2>
                <p>
                  अभिमंत्रित प्रसाद को सुरक्षित कूरियर माध्यम से आपके पते पर भेजा जाता है। सामान्यतः 3 से 6 कार्यदिवसों में डिलीवरी पूर्ण होती है।
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

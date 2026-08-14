import Link from 'next/link'
import { Shield, Sparkles, Key, Heart, Mail, Phone, MapPin, EyeOff } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'गोपनीयता नीति (Privacy Policy)',
    description: 'DivyaYagyam गोपनीयता नीति। जानें कि हम आपके नाम-गोत्र संकल्प, पूजा बुकिंग डेटा और व्यक्तिगत जानकारी की सुरक्षा कैसे करते हैं।',
    path: '/privacy',
  })
}
export const revalidate = 30

export default async function PrivacyPage() {
  const setting = await prisma.websiteSetting.findUnique({
    where: { key: 'cms.privacy' }
  })
  const customContent = setting?.value || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Privacy Policy', url: `${BASE_URL}/privacy` },
      ]),
    ],
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-privacy-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-12 md:py-16 overflow-hidden border-b border-[#E6D6BE]">
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#292321] mb-2">
            गोपनीयता नीति (Privacy Policy)
          </h1>
          <p className="text-xs text-[#665E58]">अंतिम अद्यतन: 2026 • 100% डेटा व संकल्प सुरक्षा</p>
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
                  <Shield className="h-5 w-5 text-[#E58A16]" /> 1. व्यक्तिगत जानकारी एवं संकल्प डेटा
                </h2>
                <p>
                  दिव्ययज्ञम् आपके द्वारा प्रदान की गई निजी जानकारी (जैसे नाम, फोन नंबर, गोत्र, पता व संकल्प विवरण) की पूर्ण गोपनीयता बनाए रखने के लिए प्रतिबद्ध है। यह डेटा केवल पूजा संपादन एवं प्रसाद वितरण हेतु उपयोग किया जाता है।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <Key className="h-5 w-5 text-[#E58A16]" /> 2. 100% सुरक्षित भुगतान
                </h2>
                <p>
                  सभी डिजिटल भुगतान भारतीय रिजर्व बैंक (RBI) द्वारा अधिकृत सुरक्षित पेमेंट गेटवे के माध्यम से 256-बिट SSL एन्क्रिप्शन के तहत संसाधित किए जाते हैं।
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

import { PublicPageShell } from '@/components/public-page-shell'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, generateFaqSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600; // ISR: Revalidate every 3600s

export function generateMetadata() {
  return generatePageMeta({
    title: 'अक्सर पूछे जाने वाले प्रश्न (FAQ) — दिव्य यज्ञम | DivyaYagyam',
    description: 'ऑनलाइन पूजा कैसे काम करती है? प्रसाद होम डिलीवरी, लाइव पूजा वीडियो प्रूफ, बुकिंग और रिफंड से जुड़े सभी प्रश्नों के उत्तर।',
    path: '/faq',
  })
}

export default async function Page() {
  const setting = await prisma.websiteSetting.findUnique({
    where: { key: 'cms.faqs' }
  })
  const customContent = setting?.value || ''

  const defaultFaqs = [
    { question: 'ऑनलाइन पूजा कैसे होती है?', answer: 'हमारे विद्वान आचार्य आपके नाम और गोत्र से संकल्प लेकर लाइव या रिकॉर्डेड वीडियो प्रूफ के साथ पूजा संपन्न करते हैं।' },
    { question: 'प्रसाद घर कैसे पहुंचेगा?', answer: 'पूजा संपन्न होने के बाद सिद्ध प्रसाद डाक या कूरियर द्वारा सीधे आपके दिए पते पर भेज दिया जाता है।' },
    { question: 'क्या मुझे पूजा का वीडियो मिलेगा?', answer: 'हां, आपके नाम-गोत्र के संकल्प का स्पष्ट वीडियो वॉट्सऐप पर भेजा जाता है।' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateFaqSchema(defaultFaqs),
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'FAQ', url: `${BASE_URL}/faq` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-faq-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPageShell badge="❓ FAQ" title="Frequently Asked Questions" subtitle="How online puja works, prasad delivery, refunds & more">
        {customContent ? (
          <div className="bg-white p-6 md:p-10 border rounded-3xl shadow-sm text-xs md:text-sm text-slate-700 leading-relaxed prose max-w-none prose-orange max-w-4xl mx-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]} children={customContent as string} />
          </div>
        ) : (
          <div className="bg-white p-6 md:p-10 border rounded-3xl shadow-sm text-center text-muted-foreground max-w-4xl mx-auto">
            FAQs will be updated soon.
          </div>
        )}
      </PublicPageShell>
    </>
  )
}

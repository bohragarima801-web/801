import Script from 'next/script'
import Link from 'next/link'
import { HelpCircle, Sparkles, ShieldCheck, Truck, Video, FileText, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { generatePageMeta, generateBreadcrumbSchema, generateFaqSchema, BASE_URL } from '@/lib/seo'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const revalidate = 3600 // ISR: Revalidate every 3600s

export function generateMetadata() {
  return generatePageMeta({
    title: 'अक्सर पूछे जाने वाले प्रश्न (FAQ) — Online Puja & Help Desk',
    description: 'ऑनलाइन पूजा कैसे काम करती है? प्रसाद होम डिलीवरी, लाइव पूजा वीडियो प्रूफ, नाम-गोत्र संकल्प और रिफंड से जुड़े सभी प्रश्नों के उत्तर।',
    path: '/faq',
  })
}

export default async function FaqPage() {
  const setting = await prisma.websiteSetting.findUnique({
    where: { key: 'cms.faqs' }
  })
  const customContent = setting?.value || ''

  const defaultFaqs = [
    {
      id: 'faq-1',
      question: 'ऑनलाइन पूजा (Online Puja) कैसे संपन्न होती है?',
      answer: 'DivyaYagyam पर ऑनलाइन पूजा बुक करने पर हमारे विद्वान आचार्य आपके द्वारा दिए गए नाम, गोत्र और विशिष्ट मनोकामना का स्पष्ट संकल्प (Sankalp) लेते हैं। पूजा का पूरा अनुष्ठान शास्त्रीय विधि-विधान के साथ संपन्न किया जाता है और संकल्प का वीडियो प्रूफ आपके वॉट्सऐप (WhatsApp) पर भेजा जाता है।'
    },
    {
      id: 'faq-2',
      question: 'क्या पूजा का वीडियो या लाइव स्ट्रीमिंग का प्रमाण मिलता है?',
      answer: 'जी हां! DivyaYagyam द्वारा आयोजित प्रत्येक पूजा में आपके नाम और गोत्र के उच्चारण का स्पष्ट वीडियो रिकॉर्ड किया जाता है। पूजा संपन्न होने के 24 से 48 घंटे के भीतर वीडियो लिंक सीधे आपके पंजीकृत व्हाट्सएप नंबर पर शेयर किया जाता है।'
    },
    {
      id: 'faq-3',
      question: 'सिद्ध प्रसाद (Sacred Prasad) मेरे घर तक कैसे पहुंचेगा?',
      answer: 'पूजा संपन्न होने के उपरांत मंदिर का पवित्र प्रसाद (जैसे रक्षा सूत्र, भस्म, सूखे मेवे, रुद्राक्ष आदि) सुरक्षित खाद्य-ग्रेड पैकेजिंग में पैक करके आपके दिए गए पते पर कूरियर या इंडिया पोस्ट स्पीड पोस्ट के माध्यम से 3 से 7 दिनों के भीतर डिलीवर किया जाता है।'
    },
    {
      id: 'faq-4',
      question: 'क्या मैं एक पूजा में अपने परिवार के सदस्यों का नाम जोड़ सकता हूँ?',
      answer: 'जी बिल्कुल! आप एक ही पूजा बुकिंग में अपने परिवार के सदस्यों (पति/पत्नी, बच्चे, माता-पिता) का नाम और गोत्र शामिल कर सकते हैं। पंडित जी संकल्प के दौरान सभी सदस्यों का नाम और गोत्र उच्चारण करेंगे।'
    },
    {
      id: 'faq-5',
      question: 'पूजा की फीस में क्या-क्या शामिल होता है?',
      answer: 'पूजा शुल्क में पंडित जी की दक्षिणा, संपूर्ण पूजन सामग्री, मंदिर रसीद/सेवा, नाम-गोत्र संकल्प, वीडियो रिकॉर्डिंग एवं सिद्ध प्रसाद की होम डिलीवरी का पूरा खर्च शामिल होता है। कोई भी छिपा हुआ शुल्क नहीं लिया जाता।'
    },
    {
      id: 'faq-6',
      question: 'यदि मुझे अपनी बुकिंग रद्द या रीशेड्यूल करनी हो तो प्रक्रिया क्या है?',
      answer: 'पूजा शुरू होने से 2 घंटे पहले तक आप व्हाट्सएप (+91-95304-01984) या ईमेल (Seva@divyayagyam.com) के माध्यम से अपनी बुकिंग रद्द या रीशेड्यूल कर सकते हैं। रद्द करने पर 100% रिफंड आपके बैंक खाते में 5-7 कार्य दिवसों में जमा कर दिया जाता है।'
    },
    {
      id: 'faq-7',
      question: 'DivyaYagyam के पंडित जी कौन हैं और उनका अनुभव क्या है?',
      answer: 'DivyaYagyam के आध्यात्मिक मार्गदर्शक पं. मुकेश बोहरा हैं, जिनके पास सनातन कर्मकांड और वैदिक पूजा अनुष्ठानों का 35 से अधिक वर्षों का वृहद अनुभव है। हमारे सभी आचार्य संस्कृत व्याकरण और कर्मकांड में निष्णात हैं।'
    },
    {
      id: 'faq-8',
      question: 'क्या अंतरराष्ट्रीय (NRI) भक्त भी पूजा बुक कर सकते हैं?',
      answer: 'जी हां! अमेरिका, ब्रिटेन, कनाडा, ऑस्ट्रेलिया, यूएई आदि देशों में रहने वाले अप्रवासी भारतीय (NRI) भक्त भी आसानी से ऑनलाइन पूजा बुक कर सकते हैं। अंतरराष्ट्रीय पते पर भी प्रसाद डिलीवर किया जाता है।'
    }
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateFaqSchema(defaultFaqs.map(f => ({ question: f.question, answer: f.answer }))),
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
      <div className="bg-slate-50/50 min-h-screen py-12">
        <div className="container max-w-4xl mx-auto space-y-10 px-4">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--primary-color)]">❓ FAQ & Help</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800">Frequently Asked Questions</h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find detailed answers to all your questions regarding online puja bookings, video proof updates, prasad shipping, and Vedic rituals.
            </p>
          </div>

          {/* Dynamic or Default FAQs */}
          <div className="bg-white p-6 md:p-10 border rounded-3xl shadow-sm space-y-6">
            {customContent ? (
              <div className="text-xs md:text-sm text-slate-700 leading-relaxed prose max-w-none prose-orange">
                <ReactMarkdown remarkPlugins={[remarkGfm]} children={customContent as string} />
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 border-b pb-4">
                  <HelpCircle className="h-6 w-6 text-[var(--primary-color)]" /> Common Queries & Answers
                </h2>

                <Accordion type="single" collapsible className="w-full space-y-3">
                  {defaultFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-2xl px-5 bg-slate-50/50 data-[state=open]:bg-white data-[state=open]:shadow-sm">
                      <AccordionTrigger className="text-left font-bold text-sm md:text-base text-slate-800 hover:text-[var(--primary-color)] hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 text-xs md:text-sm leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          {/* Bottom Help Box */}
          <div className="bg-white p-6 md:p-8 border rounded-3xl shadow-sm text-center space-y-3">
            <h2 className="text-lg font-bold text-slate-800">Still have questions?</h2>
            <p className="text-xs md:text-sm text-slate-600">
              Our support team is available on WhatsApp to answer your specific questions in real-time.
            </p>
            <div className="pt-2">
              <Link href="/contact" className="inline-flex items-center gap-2 bg-[var(--primary-color)] hover:opacity-90 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-xl transition-all">
                Contact Support Desk
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

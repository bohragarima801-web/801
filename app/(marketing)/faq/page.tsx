import Script from 'next/script'
import Link from 'next/link'
import { HelpCircle, Sparkles, ShieldCheck, Truck, Video, FileText, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { generatePageMeta, generateBreadcrumbSchema, generateFaqSchema, BASE_URL } from '@/lib/seo'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const revalidate = 3600

export function generateMetadata() {
  return generatePageMeta({
    title: 'सामान्य प्रश्न (FAQ) — सहायता व मार्गदर्शन',
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
      answer: 'DivyaYagyam पर ऑनलाइन पूजा बुक करने पर हमारे विद्वान आचार्य आपके द्वारा दिए गए नाम, गोत्र और विशिष्ट मनोकामना का स्पष्ट संकल्प (Sankalp) लेते हैं। पूजा का पूरा अनुष्ठान शास्त्रीय विधि-विधान के साथ संपन्न किया जाता है और संकल्प का वीडियो प्रूफ आपके व्हाट्सएप पर भेजा जाता है।'
    },
    {
      id: 'faq-2',
      question: 'क्या पूजा का वीडियो या लाइव स्ट्रीमिंग का प्रमाण मिलता है?',
      answer: 'जी हां! DivyaYagyam द्वारा आयोजित प्रत्येक पूजा में आपके नाम और गोत्र के उच्चारण का स्पष्ट वीडियो रिकॉर्ड किया जाता है। पूजा संपन्न होने के 24 से 48 घंटे के भीतर वीडियो लिंक सीधे आपके पंजीकृत व्हाट्सएप नंबर पर शेयर किया जाता है।'
    },
    {
      id: 'faq-3',
      question: 'सिद्ध प्रसाद (Sacred Prasad) मेरे घर तक कैसे पहुंचेगा?',
      answer: 'पूजा संपन्न होने के उपरांत मंदिर का पवित्र प्रसाद (जैसे रक्षा सूत्र, भस्म, सूखे मेवे, रुद्राक्ष आदि) सुरक्षित खाद्य-ग्रेड पैकेजिंग में पैक करके आपके दिए गए पते पर कूरियर या स्पीड पोस्ट के माध्यम से 3 से 6 दिनों के भीतर डिलीवर किया जाता है।'
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
      answer: 'DivyaYagyam के आध्यात्मिक मार्गदर्शक पं. मुकेश बोहरा हैं, जिनके पास सनातन कर्मकांड और वैदिक पूजा अनुष्ठानों का 27 से अधिक वर्षों का वृहद अनुभव है। हमारे सभी आचार्य संस्कृत व्याकरण और कर्मकांड में निष्णात हैं।'
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
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-faq-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-14 md:py-20 overflow-hidden border-b border-[#E6D6BE]">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        <div className="container max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E6D6BE] shadow-2xs mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-[#E58A16]" />
            <span className="text-[#E58A16] text-xs font-black uppercase tracking-wider">❓ अक्सर पूछे जाने वाले सवाल (FAQ & HELP)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-3">
            सामान्य प्रश्न एवं <span className="text-[#E58A16]">समाधान</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A403C] max-w-xl mx-auto font-medium leading-relaxed">
            ऑनलाइन पूजा बुकिंग, लाइव वीडियो प्रूफ, प्रसाद डिलीवरी एवं वेदोक्त संकल्प से जुड़े आपके सभी सवालों के स्पष्ट उत्तर।
          </p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto space-y-8 px-4 py-10 sm:py-14">
        
        {/* Dynamic or Default FAQs */}
        <div className="bg-white p-6 sm:p-8 md:p-10 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-4">
          {customContent ? (
            <div className="prose max-w-none text-xs sm:text-sm text-[#4A403C] leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]} children={customContent as string} />
            </div>
          ) : (
            <Accordion type="single" collapsible defaultValue="faq-1" className="space-y-3">
              {defaultFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border border-[#E6D6BE] rounded-2xl px-4 sm:px-5 shadow-2xs overflow-hidden">
                  <AccordionTrigger className="text-left font-bold text-xs sm:text-sm text-[#292321] hover:text-[#E58A16] py-4 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-[#4A403C] leading-relaxed pb-4 pt-1 border-t border-[#E6D6BE]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Quick Contact Box */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6D6BE] text-center space-y-3 shadow-2xs">
          <h3 className="text-base sm:text-lg font-bold text-[#292321]">
            क्या आपका कोई अन्य प्रश्न है?
          </h3>
          <p className="text-xs text-[#4A403C] max-w-md mx-auto">
            हमारी समर्पित सेवा टीम आपके हर प्रश्न का समाधान करने के लिए सदैव तत्पर है।
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E58A16] hover:bg-[#d4790e] text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>संपर्क केंद्र देखें ➔</span>
            </Link>
            <a
              href="https://wa.me/919530401984"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-sm transition-all"
            >
              <span>व्हाट्सएप पर पूछें ➔</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

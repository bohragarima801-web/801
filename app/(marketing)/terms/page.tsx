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
                  <ShieldCheck className="h-5 w-5 text-[#E58A16]" /> 1. प्रस्तावना एवं नियम स्वीकृति (Introduction & Acceptance)
                </h2>
                <p>
                  दिव्ययज्ञम् (DivyaYagyam) प्लेटफॉर्म (वेबसाइट एवं मोबाइल इंटरफेस) का उपयोग करने पर आप इन सेवा शर्तों, गोपनीयता नीति एवं रिफंड नीति से पूर्णतः सहमत होते हैं। दिव्ययज्ञम् सनातन वैदिक रीति-रिवाजों, आगम शास्त्रों एवं कर्मकांड पद्धतियों के अनुसार ऑनलाइन पूजा, अनुष्ठान, अभिमंत्रित प्रसाद एवं प्रामाणिक आध्यात्मिक सेवाएं उपलब्ध कराता है।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-[#E58A16]" /> 2. नाम-गोत्र संकल्प एवं पूजा सम्पादन (Sankalp & Ritual Execution)
                </h2>
                <p>
                  यजमान द्वारा फॉर्म में प्रदान किए गए नाम, गोत्र, कुलदेवी/देवता एवं विशिष्ट मनोकामना के आधार पर सिद्ध पीठों एवं तीर्थ क्षेत्रों में उपस्थित वैदिक विद्वानों द्वारा शास्त्रसम्मत संकल्प लिया जाता है। पूजा संपन्न होने के उपरांत यजमान के पंजीकृत व्हाट्सएप नंबर पर पूजा का वीडियो प्रमाण (नाम-गोत्र उच्चारण सहित) प्रेषित किया जाता है।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#E58A16]" /> 3. ऑनलाइन भुगतान एवं सुरक्षा (Payment Terms & Security)
                </h2>
                <p>
                  सभी वित्तीय लेनदेन (UPI, डेबिट/क्रेडिट कार्ड, नेटबैंकिंग) भारतीय रिज़र्व बैंक (RBI) द्वारा अधिकृत सुरक्षित पेमेंट गेटवे (Razorpay) के माध्यम से 256-बिट SSL एन्क्रिप्शन के अंतर्गत प्रोसेस होते हैं। हम किसी भी यजमान का कार्ड नंबर, सीवीवी या यूपीआई पिन कभी संग्रहित (store) नहीं करते हैं।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#E58A16]" /> 4. आध्यात्मिक व आस्था अस्वीकरण (Faith & Spiritual Disclaimer)
                </h2>
                <p className="text-[#4A403C] leading-relaxed">
                  वैदिक पूजा, अनुष्ठान, हवन, रुद्राक्ष एवं ज्योतिषीय परामर्श सनातन धर्म की आस्था, शास्त्रों एवं पारंपरिक विश्वास पर आधारित हैं। ये सेवाएं मानसिक शांति, आध्यात्मिक उन्नति एवं सकारात्मक ऊर्जा हेतु की जाती हैं। इन्हें किसी भी प्रकार की चिकित्सीय (Medical), कानूनी (Legal) या वित्तीय (Financial) सलाह का विकल्प नहीं माना जाना चाहिए।
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#E58A16]" /> 5. शिकायत निवारण अधिकारी (Grievance Redressal Mechanism)
                </h2>
                <p>
                  सूचना प्रौद्योगिकी अधिनियम (IT Act 2000) एवं उपभोक्ता संरक्षण (ई-कॉमर्स) नियम 2020 के अंतर्गत शिकायत निवारण हेतु अधिकारी का विवरण निम्नवत है:
                </p>
                <div className="bg-[#FFF9EF] p-3.5 rounded-xl border border-[#E6D6BE] text-xs space-y-1">
                  <p><strong>शिकायत अधिकारी:</strong> Grievance Officer, DivyaYagyam</p>
                  <p><strong>ईमेल:</strong> <a href="mailto:grievance@divyayagyam.com" className="text-[#E58A16] font-bold hover:underline">grievance@divyayagyam.com</a> / <a href="mailto:Seva@divyayagyam.com" className="text-[#E58A16] font-bold hover:underline">Seva@divyayagyam.com</a></p>
                  <p><strong>हेल्पलाइन:</strong> +91-95304-01984 (प्रातः 9:00 से सायं 8:00)</p>
                  <p><strong>पता:</strong> जोधपुर, राजस्थान, भारत (342001)</p>
                  <p className="text-[11px] text-[#665E58] pt-1">किसी भी शिकायत की पावती (Acknowledgement) 48 घंटे के भीतर एवं समाधान 30 दिनों के भीतर किया जाता है।</p>
                </div>
              </section>

              <section className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-[#292321] flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-[#E58A16]" /> 6. क्षेत्राधिकार (Governing Law & Jurisdiction)
                </h2>
                <p>
                  ये नियम व शर्तें भारतीय कानूनों के अनुसार शासित होंगी और किसी भी विवाद की स्थिति में न्यायिक क्षेत्राधिकार जोधपुर, राजस्थान (भारत) की अदालतों का होगा।
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

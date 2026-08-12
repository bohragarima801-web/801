'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react'

interface FAQItem {
  question: string
  questionHi: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How does online puja booking work?",
    questionHi: "ऑनलाइन पूजा बुकिंग कैसे संपन्न होती है?",
    answer: "आप अपनी इच्छानुसार पूजा का चयन करते हैं, अपना नाम, गोत्र व संकल्प विवरण दर्ज करते हैं। हमारे प्रामाणिक वैदिक आचार्यों द्वारा सिद्ध मंदिरों में पूर्ण शास्त्रोक्त विधि से पूजन किया जाता है। व्हाट्सएप पर वीडियो प्रमाण व घर पर सिद्ध प्रसाद प्राप्त होता है।"
  },
  {
    question: "How do I know priests are genuine and verified?",
    questionHi: "मुझे कैसे पता चलेगा कि आचार्य व पंडितजी प्रामाणिक हैं?",
    answer: "दिव्ययज्ञम् से जुड़े सभी विद्वान आचार्य वैदिक पीठों एवं सिद्ध मंदिरों से अनुप्रमाणित हैं। हर अनुष्ठान पूर्ण मंत्रोच्चार व वैदिक मर्यादा के साथ ही संपन्न होता है।"
  },
  {
    question: "What proof do I receive after the puja is completed?",
    questionHi: "पूजा संपन्न होने के बाद मुझे क्या प्रमाण प्राप्त होता है?",
    answer: "आपको संकल्प का HD वीडियो प्राप्त होता है जिसमें आपका नाम व गोत्र स्पष्ट रूप से उच्चारित किया जाता है। यह वीडियो प्रमाण आपके व्हाट्सएप नंबर पर 24 घंटे के भीतर भेजा जाता है।"
  },
  {
    question: "Can I request a custom puja or specific muhurat?",
    questionHi: "क्या मैं विशेष मुहूर्त या व्यक्तिगत अनुष्ठान का अनुरोध कर सकता हूँ?",
    answer: "हाँ! आप व्हाट्सएप या AI पंडित जी के माध्यम से हमारे आचार्य परामर्शदाताओं से संपर्क करके अपनी जन्म नक्षत्र व आवश्यकतानुसार व्यक्तिगत पूजा या जाप बुक करवा सकते हैं।"
  },
  {
    question: "What is the refund and cancellation policy?",
    questionHi: "रिफंड एवं निरस्तीकरण की क्या नीति है?",
    answer: "यदि किसी मंदिर में अपरिहार्य स्थिति के कारण पूजा संपन्न न हो पाए, तो 100% पूर्ण रिफंड या अन्य शुभ तिथि पर पूजा पुनर्निधारित की जाती है।"
  },
  {
    question: "How is the Prasad delivered to my home?",
    questionHi: "सिद्ध प्रसाद मेरे घर तक कैसे पहुँचेगा?",
    answer: "पूजन में अभिमंत्रित प्रसाद (पावन अक्षत, भस्म, रक्षासूत्र, रुद्राक्ष एवं कलावा) सुरक्षित पैकिंग के साथ 3 से 5 कार्यदिवसों के भीतर एक्सप्रेस कोरियर से आपके पते पर पहुँचाया जाता है।"
  }
]

export function SacredFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="w-full py-16 md:py-24 bg-[#FFFBF7] text-[#111827]">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center space-y-3 mb-12">
          <div className="kundli-badge-orange inline-flex">
            <HelpCircle className="h-3.5 w-3.5 text-[#FF7A00]" /> FAQ Section
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">
            Frequently Asked Questions <span className="text-[#FF7A00] font-bold">/ सामान्य प्रश्न</span>
          </h2>
          <p className="text-sm md:text-base text-[#4B5563] font-medium">
            Get clear, transparent answers about our Vedic pujas, verification process, and prasad delivery.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-white border border-[#F3E8DE] rounded-2xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-200 hover:border-[#FF7A00]/40 reveal"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 font-semibold text-[#111827] hover:text-[#FF7A00] transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="block text-base md:text-lg font-heading font-bold text-[#111827]">
                      {faq.question}
                    </span>
                    <span className="block text-xs md:text-sm font-medium text-[#FF7A00]">
                      {faq.questionHi}
                    </span>
                  </div>
                  <div className={`h-8 w-8 rounded-full bg-[#FFF3E0] text-[#FF7A00] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 shadow-sm' : ''}`}>
                    <ChevronDown className="h-4 w-4 text-[#FF7A00]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 md:px-6 md:pb-6 text-[#4B5563] text-sm md:text-base leading-relaxed border-t border-[#F3E8DE] pt-4 bg-[#FFFBF7]">
                    <p className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-[#FF7A00] shrink-0 mt-1" />
                      <span>{faq.answer}</span>
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
    <section className="w-full py-12 md:py-20 bg-[#FFF9EF] text-[#292321] notranslate" translate="no">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center space-y-2.5 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EBD7] text-[#E58A16] font-bold text-xs border border-[#E6D6BE]">
            <HelpCircle className="h-3.5 w-3.5" /> अक्सर पूछे जाने वाले सवाल
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#292321] tracking-tight">
            सामान्य प्रश्न एवं <span className="text-[#E58A16]">समाधान (FAQ)</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#665E58] font-medium max-w-xl mx-auto">
            पूजा विधि, संकल्प वीडियो प्रमाण व प्रसाद डिलीवरी से जुड़े आपके सभी प्रश्नों के उत्तर।
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-white border border-[#E6D6BE] rounded-2xl shadow-2xs overflow-hidden transition-all duration-200 hover:border-[#E58A16]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-semibold text-[#292321] hover:text-[#E58A16] transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[#292321]">
                    {faq.questionHi}
                  </span>
                  <div className={`h-7 w-7 rounded-full bg-[#F7EBD7] text-[#E58A16] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-[#4A403C] text-xs sm:text-sm leading-relaxed border-t border-[#E6D6BE] pt-3 bg-[#FFF9EF]/50">
                    <p className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-[#E58A16] shrink-0 mt-0.5" />
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

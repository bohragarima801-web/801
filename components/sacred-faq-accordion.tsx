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
    questionHi: "ऑनलाइन पूजा बुकिंग कैसे काम करती है?",
    answer: "You select your desired puja or ritual, provide your Name, Gotra, and Sankalp details. Our verified Vedic pandits perform the ritual at sacred temples with full authenticity. You receive live/recorded video proof on WhatsApp along with home-delivered sacred prasad."
  },
  {
    question: "How do I know priests are genuine and verified?",
    questionHi: "मुझे कैसे पता चलेगा कि पंडित जी प्रामाणिक हैं?",
    answer: "All pandits associated with DivyaYagyam undergo strict verification of Vedic credentials, lineage, and temple affiliations. Every ritual strictly adheres to Vedic shastras and mantras."
  },
  {
    question: "What proof do I receive after the puja is completed?",
    questionHi: "पूजा संपन्न होने के बाद मुझे क्या सबूत मिलता है?",
    answer: "You get video recordings and photographs where your Name & Gotra are explicitly chanted during the Sankalp. The video proof is delivered directly to your registered WhatsApp number within 24 hours."
  },
  {
    question: "Can I request a custom puja or specific muhurat?",
    questionHi: "क्या मैं कस्टम पूजा या विशेष मुहूर्त का अनुरोध कर सकता हूँ?",
    answer: "Yes! You can contact our spiritual advisors via WhatsApp or AI Pandit Ji to customize any specific Vedic homa, jaap, or personal puja tailored to your Nakshatra and requirement."
  },
  {
    question: "What is the refund and cancellation policy?",
    questionHi: "रिफंड एवं निरस्तीकरण की क्या नीति है?",
    answer: "If a puja cannot be performed due to unforeseen temple closures or extreme events, 100% full refund or rescheduling to another auspicious date is provided immediately without hassle."
  },
  {
    question: "How is the Prasad delivered to my home?",
    questionHi: "प्रसाद मेरे घर तक कैसे पहुँचेगा?",
    answer: "Sacred prasad (including dry fruits, holy ash/bhasma, kumkum, threads & energized yantra) is sanctified during the puja, hygienically packed, and dispatched via express courier (3–5 business days)."
  }
]

export function SacredFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="w-full py-16 md:py-24 bg-[#0D0704] text-[#F5F0E6]">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center space-y-3 mb-12">
          <div className="vip-badge inline-flex">
            <HelpCircle className="h-3.5 w-3.5 text-[#F4C430]" /> FAQ Section
          </div>
          <h2 className="text-3xl md:text-5xl font-vip font-extrabold text-[#F5F0E6] tracking-tight">
            Frequently Asked Questions <span className="bg-gradient-to-r from-[#F4C430] via-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent font-normal">/ सामान्य प्रश्न</span>
          </h2>
          <p className="text-sm md:text-base text-[#C9C0B3] font-medium">
            Get clear, transparent answers about our Vedic pujas, verification process, and prasad delivery.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-[#180E08] border-2 border-[#D4AF37]/30 rounded-2xl shadow-xl overflow-hidden transition-all duration-200 hover:border-[#F4C430]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 md:p-6 text-left flex items-center justify-between gap-4 font-semibold text-[#F5F0E6] hover:text-[#F4C430] transition-colors focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="block text-base md:text-lg font-vip font-bold text-[#F5F0E6]">
                      {faq.question}
                    </span>
                    <span className="block text-xs md:text-sm font-medium text-[#F4C430]">
                      {faq.questionHi}
                    </span>
                  </div>
                  <div className={`h-8 w-8 rounded-full bg-gradient-to-br from-[#6B0F1A] to-[#D4AF37] text-[#F5F0E6] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 shadow-md' : ''}`}>
                    <ChevronDown className="h-4 w-4 text-[#F4C430]" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 md:px-6 md:pb-6 text-[#C9C0B3] text-sm md:text-base leading-relaxed border-t border-[#D4AF37]/20 pt-4 bg-[#140A05]">
                    <p className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-[#F4C430] shrink-0 mt-1" />
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

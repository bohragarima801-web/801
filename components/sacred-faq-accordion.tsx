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
    questionHi: "How does online puja booking work?",
    answer: "You select your desired puja, enter your name, gotra, and sankalp details. Our authentic Vedic priests perform the puja in sacred shrines following complete scriptural rituals. You receive video proof on WhatsApp and consecrated prasad at home."
  },
  {
    question: "How do I know priests are genuine and verified?",
    questionHi: "How do I know the priests and acharyas are authentic?",
    answer: "All learned acharyas associated with DivyaYagyam are certified from Vedic shrines and sacred temples. Every ritual is conducted with complete mantra recitation and Vedic sanctity."
  },
  {
    question: "What proof do I receive after the puja is completed?",
    questionHi: "What proof do I receive after the puja is completed?",
    answer: "You receive an HD video of the sankalp clearly chanting your name and gotra. This video proof is sent to your WhatsApp number within 24 hours."
  },
  {
    question: "Can I request a custom puja or specific muhurat?",
    questionHi: "Can I request a custom ritual or specific auspicious muhurat?",
    answer: "Yes! You can contact our acharya consultants via WhatsApp or AI Pandit Ji to book personalized pujas or japas tailored to your birth star and requirements."
  },
  {
    question: "What is the refund and cancellation policy?",
    questionHi: "What is the refund and cancellation policy?",
    answer: "If a puja cannot be performed due to unavoidable circumstances at a temple, a 100% full refund is issued or the puja is rescheduled to another auspicious date."
  },
  {
    question: "How is the Prasad delivered to my home?",
    questionHi: "How will the consecrated prasad reach my home?",
    answer: "Consecrated prasad from the puja (holy akshat, bhasma, sacred thread, rudraksha, and kalawa) is delivered to your address via express courier in secure packaging within 3 to 5 business days."
  }
]

export function SacredFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section className="w-full py-12 md:py-20 bg-white text-zinc-900 notranslate" translate="no">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center space-y-2.5 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 font-bold text-xs border border-zinc-200">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">
            Frequently Asked Questions & <span className="text-amber-600">Answers (FAQ)</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium max-w-xl mx-auto">
            Answers to all your questions regarding puja rituals, sankalp video proof, and prasad delivery.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-2xl shadow-2xs overflow-hidden transition-all duration-200 hover:border-[#E58A16]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-semibold text-zinc-900 hover:text-amber-600 transition-colors focus:outline-none cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-zinc-900">
                    {faq.questionHi}
                  </span>
                  <div className={`h-7 w-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-[#4A403C] text-xs sm:text-sm leading-relaxed border-t border-zinc-200 pt-3 bg-white/50">
                    <p className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
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

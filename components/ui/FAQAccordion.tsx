'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HelpCircle, Sparkles, CheckCircle2 } from 'lucide-react'

export interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  faqs: FAQItem[]
  title?: string
  subtitle?: string
  className?: string
}

export function FAQAccordion({
  faqs,
  title = 'अक्सर पूछे जाने वाले प्रश्न (FAQs)',
  subtitle = 'ऑनलाइन पूजा संकल्प, वीडियो प्रमाण एवं प्रसाद डिलीवरी संबंधी जिज्ञासा समाधान',
  className = '',
}: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <div className={`w-full bg-[#141b26] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-10 shadow-[0_8px_24px_rgba(0,0,0,0.5)] space-y-8 ${className}`}>
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f6d860] text-xs font-bold tracking-widest uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] animate-pulse" />
          <span>जिज्ञासा समाधान</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white uppercase tracking-wide pt-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#9ca3af] text-xs sm:text-sm font-medium max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="w-20 h-1 bg-gradient-to-r from-[#f59e0b] to-[#d97706] mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Accordion Component */}
      <Accordion type="single" collapsible className="w-full space-y-3.5">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-item-${index}`}
            className="border border-[#d4af37]/20 bg-[#1f293d] rounded-2xl px-5 sm:px-6 shadow-md hover:border-[#d4af37]/50 transition-all overflow-hidden group"
          >
            <AccordionTrigger className="text-left font-bold text-white text-sm sm:text-base hover:no-underline py-4 hover:text-[#fbbf24] transition-colors flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#d4af37]/15 text-[#fbbf24] text-xs font-extrabold shrink-0 border border-[#d4af37]/30 group-hover:bg-[#f59e0b] group-hover:text-white transition-colors">
                {index + 1}
              </span>
              <span className="flex-1 font-heading">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-[#d1d5db] leading-relaxed text-xs sm:text-sm pb-5 font-medium pl-10 pt-1 border-t border-[#d4af37]/15">
              <div className="flex items-start gap-2.5 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>{faq.answer}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Trust Guarantee Footer */}
      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#9ca3af] font-semibold">
        <HelpCircle className="w-4 h-4 text-[#fbbf24]" />
        <span>अन्य प्रश्न? व्हाट्सएप पर संपर्क करें: +91-95871-71984 / +91-95304-01984</span>
      </div>
    </div>
  )
}

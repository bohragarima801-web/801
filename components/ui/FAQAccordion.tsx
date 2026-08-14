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
    <div className={`w-full bg-white border border-[#E6D6BE] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-[#292321] notranslate ${className}`} translate="no">
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] text-xs font-bold tracking-widest uppercase shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#E58A16] animate-pulse" />
          <span>जिज्ञासा समाधान</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#292321] uppercase tracking-wide pt-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#665E58] text-xs sm:text-sm font-medium max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="w-20 h-1 bg-gradient-to-r from-[#8B1A21] to-[#E58A16] mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Accordion Component */}
      <Accordion type="single" collapsible className="w-full space-y-3.5">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-item-${index}`}
            className="border border-[#E6D6BE] bg-[#FFFDF9] rounded-2xl px-5 sm:px-6 shadow-2xs hover:border-[#E58A16] transition-all overflow-hidden group"
          >
            <AccordionTrigger className="text-left font-bold text-[#292321] text-sm sm:text-base hover:no-underline py-4 hover:text-[#E58A16] transition-colors flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-[#F7EBD7] text-[#E58A16] text-xs font-extrabold shrink-0 border border-[#E6D6BE] group-hover:bg-[#E58A16] group-hover:text-white transition-colors">
                {index + 1}
              </span>
              <span className="flex-1 font-heading">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-[#4A403C] leading-relaxed text-xs sm:text-sm pb-5 font-normal pl-10 pt-1 border-t border-[#E6D6BE] bg-[#FFF9EF]/50">
              <div className="flex items-start gap-2.5 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>{faq.answer}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Trust Guarantee Footer */}
      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#665E58] font-semibold">
        <HelpCircle className="w-4 h-4 text-[#E58A16]" />
        <span>अन्य प्रश्न? व्हाट्सएप पर संपर्क करें: +91 95304 01984</span>
      </div>
    </div>
  )
}

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
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-bold tracking-widest uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>जिज्ञासा समाधान</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-rose-950 uppercase tracking-wide">
          {title}
        </h2>
        {subtitle && (
          <p className="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-rose-700 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Accordion Component */}
      <Accordion type="single" collapsible className="w-full space-y-3">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-item-${index}`}
            className="border border-amber-200/80 bg-white rounded-2xl px-5 sm:px-6 shadow-xs hover:shadow-md transition-all overflow-hidden group border-b-2"
          >
            <AccordionTrigger className="text-left font-bold text-slate-800 text-sm sm:text-base hover:no-underline py-4.5 hover:text-rose-900 transition-colors flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-50 text-rose-900 text-xs font-extrabold shrink-0 border border-amber-200 group-hover:bg-rose-900 group-hover:text-amber-300 transition-colors">
                {index + 1}
              </span>
              <span className="flex-1">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="text-slate-600 leading-relaxed text-xs sm:text-sm pb-5 font-medium pl-10 pt-1 border-t border-amber-100/60">
              <div className="flex items-start gap-2 pt-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>{faq.answer}</div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Trust Guarantee Footer */}
      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500 font-semibold">
        <HelpCircle className="w-4 h-4 text-amber-600" />
        <span>अन्य प्रश्न? व्हाट्सएप पर संपर्क करें: +91-95871-71984</span>
      </div>
    </div>
  )
}

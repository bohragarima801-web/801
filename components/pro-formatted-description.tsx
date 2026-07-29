'use client'

import React from 'react'
import { Sparkles, CheckCircle2, ShieldCheck, Flame, BookOpen, Star, Award, HeartHandshake } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProDescriptionProps {
  content: string
  type?: 'product' | 'puja'
  className?: string
}

export function ProFormattedDescription({ content, type = 'product', className }: ProDescriptionProps) {
  if (!content || !content.trim()) {
    return (
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 italic text-xs">
        {type === 'puja' 
          ? 'शास्त्रों के अनुसार विधि-विधान से सम्पादित सम्पूर्ण महायज्ञ एवं पूजा अनुष्ठान।' 
          : 'गंगाजल से अभिमंत्रित सिद्ध सनातन सामग्री।'}
      </div>
    )
  }

  const rawText = content.trim()
  const isHtml = /<[a-z][\s\S]*>/i.test(rawText)

  // If HTML content: wrap in customized pro typography styling
  if (isHtml) {
    return (
      <div className={cn("space-y-4", className)}>
        <div 
          className={cn(
            "prose max-w-none text-slate-700 font-sans leading-relaxed",
            "prose-headings:font-black prose-headings:text-slate-900 prose-headings:font-serif",
            "prose-h2:text-xl prose-h2:border-b prose-h2:border-amber-200 prose-h2:pb-2 prose-h2:mt-6 prose-h2:text-rose-950",
            "prose-h3:text-lg prose-h3:text-amber-900 prose-h3:mt-4",
            "prose-p:text-sm sm:prose-p:text-base prose-p:leading-relaxed prose-p:my-3",
            "prose-ul:my-4 prose-ul:space-y-2 prose-ul:list-none prose-ul:pl-0",
            "prose-li:flex prose-li:items-start prose-li:gap-2 prose-li:text-sm sm:prose-li:text-base prose-li:text-slate-700",
            "prose-strong:text-slate-900 prose-strong:font-bold",
            "prose-blockquote:border-l-4 prose-blockquote:border-amber-500 prose-blockquote:bg-amber-50/60 prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-slate-800"
          )}
          dangerouslySetInnerHTML={{ __html: rawText }}
        />
      </div>
    )
  }

  // Parse plain text with line breaks, bullets, and section headers
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  
  // Categorize lines into sections / bullets / key-values
  const blocks: Array<{ type: 'header' | 'bullet' | 'paragraph' | 'keyval'; title?: string; text: string }> = []

  lines.forEach(line => {
    // Bullet detection: starts with -, *, •, 1., 2., ॐ, ✓
    const bulletMatch = line.match(/^[-*•✓ॐ]|\d+\.\s+/)
    if (bulletMatch) {
      const cleanText = line.replace(/^[-*•✓ॐ]|\d+\.\s+/, '').trim()
      blocks.push({ type: 'bullet', text: cleanText })
      return
    }

    // Key-value / Header detection: ends with : or contains bold keyword
    if (line.endsWith(':') || line.includes('महत्व:') || line.includes('लाभ:') || line.includes('विधि:') || line.includes('मंत्र:')) {
      const parts = line.split(':')
      if (parts.length >= 2 && parts[0].length < 40) {
        blocks.push({ type: 'keyval', title: parts[0].trim(), text: parts.slice(1).join(':').trim() })
        return
      }
      blocks.push({ type: 'header', text: line.replace(':', '') })
      return
    }

    // Default paragraph
    blocks.push({ type: 'paragraph', text: line })
  })

  return (
    <div className={cn("space-y-5 font-sans", className)}>
      {blocks.map((block, idx) => {
        if (block.type === 'header') {
          return (
            <div key={idx} className="pt-2 pb-1 border-b border-amber-200/80">
              <h3 className="text-lg font-black text-rose-950 font-serif flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
                {block.text}
              </h3>
            </div>
          )
        }

        if (block.type === 'keyval') {
          return (
            <div key={idx} className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/70 space-y-1">
              <span className="font-bold text-amber-900 text-sm block uppercase tracking-wider font-serif">
                ✨ {block.title}
              </span>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {block.text}
              </p>
            </div>
          )
        }

        if (block.type === 'bullet') {
          return (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-200/60 hover:border-amber-300 transition-colors">
              <div className="h-6 w-6 rounded-full bg-rose-900 text-amber-300 flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-xs">
                ॐ
              </div>
              <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                {block.text}
              </p>
            </div>
          )
        }

        return (
          <p key={idx} className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

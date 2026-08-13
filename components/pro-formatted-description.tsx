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
      <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-amber-900 italic text-xs font-medium">
        {type === 'puja' 
          ? 'शास्त्रों के अनुसार विधि-विधान से सम्पादित सम्पूर्ण महायज्ञ एवं पूजा अनुष्ठान।' 
          : 'गंगाजल से अभिमंत्रित 100% सिद्ध सनातन सामग्री।'}
      </div>
    )
  }

  const rawText = content.trim()
  const isHtml = /<[a-z][\s\S]*>/i.test(rawText)
  const isDark = type === 'puja'

  // If HTML content: wrap in customized pro typography styling
  if (isHtml) {
    return (
      <div className={cn("space-y-4", className)}>
        <div 
          className={cn(
            "prose max-w-none font-sans leading-relaxed",
            isDark ? [
              "text-[#e5e7eb] dark:prose-invert",
              "prose-headings:font-extrabold prose-headings:text-white prose-headings:font-heading",
              "prose-h2:text-xl prose-h2:border-b prose-h2:border-[#d4af37]/30 prose-h2:pb-2 prose-h2:mt-6 prose-h2:text-[#fbbf24]",
              "prose-h3:text-lg prose-h3:text-[#f6d860] prose-h3:mt-4",
              "prose-p:text-sm sm:prose-p:text-base prose-p:leading-relaxed prose-p:my-3 prose-p:text-[#e5e7eb] prose-p:font-medium",
              "prose-ul:my-4 prose-ul:space-y-2.5 prose-ul:list-none prose-ul:pl-0",
              "prose-li:flex prose-li:items-start prose-li:gap-2.5 prose-li:text-sm sm:prose-li:text-base prose-li:text-[#f3e5ab] prose-li:font-medium",
              "prose-strong:text-white prose-strong:font-bold",
              "prose-blockquote:border-l-4 prose-blockquote:border-[#d4af37] prose-blockquote:bg-[#1f293d] prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-white"
            ] : [
              "text-[#2A1508]",
              "prose-headings:font-extrabold prose-headings:text-[#1E120A] prose-headings:font-heading",
              "prose-h2:text-xl prose-h2:border-b prose-h2:border-[#F2C94C] prose-h2:pb-2 prose-h2:mt-6 prose-h2:text-[#8B1A21]",
              "prose-h3:text-lg prose-h3:text-[#8B1A21] prose-h3:mt-4",
              "prose-p:text-sm sm:prose-p:text-base prose-p:leading-relaxed prose-p:my-3 prose-p:text-[#2A1508] prose-p:font-medium",
              "prose-ul:my-4 prose-ul:space-y-2.5 prose-ul:list-disc prose-ul:pl-5",
              "prose-li:text-sm sm:prose-li:text-base prose-li:text-[#2A1508] prose-li:font-medium prose-li:my-1.5",
              "prose-strong:text-[#8B1A21] prose-strong:font-black",
              "prose-span:text-[#2A1508]",
              "prose-blockquote:border-l-4 prose-blockquote:border-[#8B1A21] prose-blockquote:bg-[#FFF5D6] prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:italic prose-blockquote:text-[#2A1508]"
            ]
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
    <div className={cn("space-y-4 font-sans", isDark ? "text-[#f3e5ab]" : "text-[#2A1508]", className)}>
      {blocks.map((block, idx) => {
        if (block.type === 'header') {
          return (
            <div key={idx} className={cn("pt-3 pb-1 border-b", isDark ? "border-[#d4af37]/35" : "border-[#F2C94C]")}>
              <h3 className={cn("text-lg font-bold font-heading flex items-center gap-2", isDark ? "text-[#fbbf24]" : "text-[#8B1A21]")}>
                <Sparkles className={cn("h-5 w-5 shrink-0", isDark ? "text-[#fbbf24]" : "text-[#8B1A21]")} />
                {block.text}
              </h3>
            </div>
          )
        }

        if (block.type === 'keyval') {
          return (
            <div key={idx} className={cn("p-4 rounded-xl border space-y-1", isDark ? "bg-[#2E0A06] border-[#d4af37]/30" : "bg-[#FFF8EA] border-[#F2C94C]")}>
              <span className={cn("font-bold text-sm block uppercase tracking-wider", isDark ? "text-[#f6d860]" : "text-[#8B1A21]")}>
                ✨ {block.title}
              </span>
              <p className={cn("text-sm sm:text-base leading-relaxed font-medium", isDark ? "text-white" : "text-[#2A1508]")}>
                {block.text}
              </p>
            </div>
          )
        }

        if (block.type === 'bullet') {
          return (
            <div key={idx} className={cn("flex items-start gap-3 p-3.5 rounded-xl border transition-colors", isDark ? "bg-[#2E0A06] border-[#d4af37]/25 hover:border-[#d4af37]/60" : "bg-[#FFF8EA] border-[#F5E2B8] hover:border-[#F2C94C]")}>
              <div className={cn("h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs border", isDark ? "bg-[#d4af37]/20 text-[#fbbf24] border-[#d4af37]/50" : "bg-[#8B1A21] text-white border-[#8B1A21]")}>
                ॐ
              </div>
              <p className={cn("text-sm sm:text-base leading-relaxed font-semibold", isDark ? "text-white" : "text-[#2A1508]")}>
                {block.text}
              </p>
            </div>
          )
        }

        return (
          <p key={idx} className="text-[#d1d5db] text-sm sm:text-base leading-relaxed font-normal">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProDescriptionProps {
  content: string
  type?: 'product' | 'puja' | 'default'
  className?: string
}

export function ProFormattedDescription({ content, type = 'product', className }: ProDescriptionProps) {
  if (!content || !content.trim()) {
    return (
      <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E6D6BE] text-[#665E58] italic text-xs sm:text-sm font-medium">
        {type === 'puja' 
          ? 'शास्त्रों के अनुसार विधि-विधान से सम्पादित सम्पूर्ण महायज्ञ एवं पूजा अनुष्ठान।' 
          : 'गंगाजल से अभिमंत्रित 100% सिद्ध सनातन सामग्री।'}
      </div>
    )
  }

  const rawText = content.trim()
  const isHtml = /<[a-z][\s\S]*>/i.test(rawText)

  // If HTML content: wrap in customized pro typography styling
  if (isHtml) {
    return (
      <div className={cn("space-y-4 notranslate", className)} translate="no">
        <div 
          className={cn(
            "prose prose-amber max-w-none font-sans leading-relaxed text-[#292321]",
            // Headings
            "prose-headings:font-heading prose-headings:font-extrabold prose-headings:text-[#292321] prose-headings:tracking-normal",
            "prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:leading-snug prose-h1:border-b prose-h1:border-[#E6D6BE] prose-h1:pb-3 prose-h1:mt-6 prose-h1:mb-4 prose-h1:text-[#292321]",
            "prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:leading-snug prose-h2:border-b prose-h2:border-[#E6D6BE] prose-h2:pb-2.5 prose-h2:mt-6 prose-h2:mb-4 prose-h2:text-[#8B1A21]",
            "prose-h3:text-lg sm:prose-h3:text-xl prose-h3:leading-snug prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-[#292321] prose-h3:font-bold",
            "prose-h4:text-base sm:prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2 prose-h4:text-[#8B1A21] prose-h4:font-bold",
            // Paragraphs & Body
            "prose-p:text-sm sm:prose-p:text-base prose-p:leading-[1.85] prose-p:my-3.5 prose-p:text-[#3D3533] prose-p:font-normal",
            // Strong / Bold
            "prose-strong:text-[#1E120A] prose-strong:font-black",
            // Lists & Items
            "prose-ul:my-4 prose-ul:space-y-2.5 prose-ul:list-disc prose-ul:pl-5",
            "prose-ol:my-4 prose-ol:space-y-2.5 prose-ol:list-decimal prose-ol:pl-5",
            "prose-li:text-sm sm:prose-li:text-base prose-li:text-[#3D3533] prose-li:font-normal prose-li:leading-[1.8] prose-li:my-2 prose-li:marker:text-[#E58A16]",
            // Blockquotes
            "prose-blockquote:border-l-4 prose-blockquote:border-[#E58A16] prose-blockquote:bg-[#FFF8EA] prose-blockquote:py-3.5 prose-blockquote:px-5 prose-blockquote:rounded-r-2xl prose-blockquote:italic prose-blockquote:text-[#292321] prose-blockquote:shadow-2xs prose-blockquote:my-4",
            // Links & Images
            "prose-a:text-[#E58A16] prose-a:font-bold prose-a:no-underline hover:prose-a:underline",
            "prose-em:text-[#5C534E] prose-em:font-medium",
            "prose-span:text-inherit"
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
    <div className={cn("space-y-4 font-sans text-[#292321] notranslate", className)} translate="no">
      {blocks.map((block, idx) => {
        if (block.type === 'header') {
          return (
            <div key={idx} className="pt-4 pb-2 border-b border-[#E6D6BE]">
              <h3 className="text-lg sm:text-xl font-bold font-heading text-[#8B1A21] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#E58A16] shrink-0" />
                <span>{block.text}</span>
              </h3>
            </div>
          )
        }

        if (block.type === 'keyval') {
          return (
            <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF9] border border-[#E6D6BE] shadow-2xs space-y-1.5 hover:border-[#E58A16]/50 transition-colors">
              <span className="font-bold text-xs sm:text-sm block uppercase tracking-wider text-[#8B1A21] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#E58A16]" /> {block.title}
              </span>
              <p className="text-sm sm:text-base leading-relaxed font-normal text-[#3D3533]">
                {block.text}
              </p>
            </div>
          )
        }

        if (block.type === 'bullet') {
          return (
            <div key={idx} className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#FFFDF9] border border-[#E6D6BE] hover:border-[#E58A16]/50 transition-colors shadow-2xs">
              <div className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs bg-[#F7EBD7] text-[#E58A16] border border-[#E6D6BE]">
                ॐ
              </div>
              <p className="text-sm sm:text-base leading-relaxed font-medium text-[#292321]">
                {block.text}
              </p>
            </div>
          )
        }

        return (
          <p key={idx} className="text-[#3D3533] text-sm sm:text-base leading-[1.85] font-normal">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

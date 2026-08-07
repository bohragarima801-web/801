'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AiChat } from '@/components/ai-chat'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function GargiChatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button (Positioned Bottom-Left to avoid overlap with WhatsApp on Bottom-Right) */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 flex items-center gap-2">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-amber-300/40",
            isOpen
              ? "bg-slate-900 hover:bg-slate-950 text-white"
              : "bg-gradient-to-r from-[#7A1F2B] via-[#8B1A21] to-[#E85D04] hover:scale-105 text-white shadow-[0_4px_20px_rgba(139,26,33,0.45)]"
          )}
          aria-label="Gargi AI Assistant"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <span className="text-2xl leading-none select-none">👩🏻‍💼</span>
          )}
        </Button>
      </div>

      {/* Chat Window (Opens cleanly from Bottom-Left) */}
      <div
        className={cn(
          "fixed bottom-36 sm:bottom-24 left-4 sm:left-6 w-[350px] max-w-[calc(100vw-2rem)] max-h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-50 overflow-hidden transition-all duration-300 origin-bottom-left border-2 border-amber-500/30",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-gradient-to-r from-[#7A1F2B] via-[#8B1A21] to-[#E85D04] p-3.5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl shrink-0">
              👩🏻‍💼
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5 leading-tight">
                गार्गी (Gargi AI)
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </h3>
              <p className="text-[10px] sm:text-[11px] text-amber-100 font-medium">Customer Support Assistant</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-8 w-8" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <AiChat 
          mode="gargi"
          emptyTitle="हरि ओम्! 🙏"
          emptyDescription="मैं गार्गी, आपकी सहायता के लिए यहाँ हूँ। पूजा, उत्पाद या बुकिंग से जुड़ा कोई भी सवाल पूछें।"
          placeholder="अपना प्रश्न पूछें..."
          suggestions={['पूजा कैसे बुक करें?', 'मेरे ऑर्डर का स्टेटस?', 'रुद्राक्ष की कीमत?']}
          streamHeight="flex-1 min-h-[300px]"
          className="border-none shadow-none rounded-none flex-1 overflow-hidden"
        />
      </div>
    </>
  )
}

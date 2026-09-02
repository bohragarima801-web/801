'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, X, ChevronRight, Phone, Sparkles } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  phone: string
  role: string
  message: string
  isPrimary?: boolean
  isActive?: boolean
}

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    id: 'wa_1',
    name: 'Pandit Seva Desk (पं. सेवा केंद्र)',
    phone: '919530401984',
    role: 'Online Puja & Sankalp Booking',
    message: 'जय श्री राम! मुझे पूजा एवं नाम-गोत्र संकल्प के बारे में जानकारी चाहिए।',
    isPrimary: true,
    isActive: true,
  },
  {
    id: 'wa_2',
    name: 'Prasad & Order Helpline',
    phone: '919530401984',
    role: 'Prasad Delivery & Support',
    message: 'जय श्री राम! मुझे सिद्ध प्रसाद एवं बुकिंग की जानकारी चाहिए।',
    isPrimary: false,
    isActive: true,
  },
]

export function WhatsAppFloatingWidget() {
  const [enabled, setEnabled] = useState(true)
  const [title, setTitle] = useState('DivyaYagyam WhatsApp Seva')
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_MEMBERS)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/whatsapp-config')
        if (!res.ok) return
        const data = await res.json()
        if (data.ok) {
          setEnabled(data.widgetEnabled !== false)
          if (data.widgetTitle) setTitle(data.widgetTitle)
          if (Array.isArray(data.teamMembers) && data.teamMembers.length > 0) {
            setTeamMembers(data.teamMembers)
          }
        }
      } catch {}
    }

    loadConfig()
  }, [])

  if (!enabled || teamMembers.length === 0) return null

  const handleDirectChat = (member: TeamMember) => {
    let cleanPhone = member.phone.replace(/[^\d]/g, '')
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`
    const msg = member.message || 'Jai Shree Ram! I would like more information.'
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  // If only 1 number, click button directly
  const singleMember = teamMembers.length === 1 ? teamMembers[0] : null

  return (
    <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Expanded Team Selection Popup */}
      {open && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2.5rem)] rounded-3xl bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 text-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-start justify-between">
            <div className="space-y-0.5">
              <h4 className="font-bold text-xs sm:text-sm flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                {title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-emerald-100 opacity-90">
                Online Team Support · 24/7 Response
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body List */}
          <div className="p-3 space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
            <p className="text-[11px] text-slate-400 font-medium px-1">
              Select a team member to start WhatsApp chat:
            </p>
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleDirectChat(member)}
                className="w-full text-left p-2.5 sm:p-3 rounded-2xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-xs text-slate-100 group-hover:text-emerald-300 transition-colors truncate">
                      {member.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{member.role}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-emerald-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Chat</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>

          {/* Footer Note */}
          <div className="p-2 bg-slate-950/60 border-t border-white/5 text-center text-[10px] text-slate-400">
            🙏 जय श्री राम · Direct Business WhatsApp Assistance
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => {
          if (singleMember) {
            handleDirectChat(singleMember)
          } else {
            setOpen(!open)
          }
        }}
        className="relative group flex items-center justify-center h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 ring-2 sm:ring-4 ring-emerald-500/20"
        aria-label="WhatsApp Support"
      >
        <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-amber-400 border-2 border-white animate-bounce" />
        {open ? (
          <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white fill-white/20" />
        )}
      </button>
    </div>
  )
}

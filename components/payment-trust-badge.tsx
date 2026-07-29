'use client'

import React from 'react'
import { Lock } from 'lucide-react'

export function PaymentTrustBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-center shadow-xs ${className}`}>
      {/* Header Text: 100% secure payments powered by Razorpay */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-slate-600 font-medium text-sm sm:text-base mb-3">
        <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>100% secure payments powered by</span>
        
        {/* Stylized Razorpay Logo */}
        <div className="inline-flex items-center gap-1 font-black italic text-slate-900 tracking-tighter text-base sm:text-lg">
          <svg className="w-5 h-5 text-blue-600 inline" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.43 4.22L11.64 15.01L14.77 15.01L8.33 21.45L12.59 13.19L9.46 13.19L22.43 4.22Z" />
          </svg>
          <span className="text-blue-900 font-extrabold not-italic tracking-normal">Razorpay</span>
        </div>
      </div>

      {/* Logos Row: GPay | PhonePe | UPI | PayPal | Paytm */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-400">
        
        {/* Google Pay */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.32 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.18 0 10.03 0 12s.46 3.82 1.26 5.42l4.02-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.68 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
          <span className="font-bold text-slate-700">Pay</span>
        </div>

        <span className="text-slate-300">|</span>

        {/* PhonePe */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <div className="w-4 h-4 rounded-full bg-[#5f259f] text-white font-bold flex items-center justify-center text-[10px]">
            पे
          </div>
          <span className="font-bold text-[#5f259f]">PhonePe</span>
        </div>

        <span className="text-slate-300">|</span>

        {/* BHIM UPI */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <span className="font-extrabold text-slate-800 tracking-tighter">UPI</span>
          <span className="text-emerald-600 font-black text-xs">❯❯</span>
        </div>

        <span className="text-slate-300">|</span>

        {/* PayPal */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <span className="font-black italic text-blue-800">Pay</span>
          <span className="font-black italic text-sky-500">Pal</span>
        </div>

        <span className="text-slate-300">|</span>

        {/* Paytm */}
        <div className="flex items-center gap-1 px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
          <span className="font-black text-blue-900">pay</span>
          <span className="font-black text-cyan-500">tm</span>
        </div>

      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import {
  Sparkles, Star, ShieldCheck, Lock, CheckCircle2, ArrowRight,
  Clock, Phone, MessageCircle, FileText, Check, ArrowLeft,
  ChevronDown, ChevronUp, User, MapPin, Calendar, HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { AstroReportDetail } from '@/lib/astro-data'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface HoroscopeReportClientViewProps {
  report: AstroReportDetail
}

export function HoroscopeReportClientView({ report }: HoroscopeReportClientViewProps) {
  // Form states
  const [devoteeName, setDevoteeName] = useState('')
  const [gender, setGender] = useState('Male')
  const [dob, setDob] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [isTimeUnknown, setIsTimeUnknown] = useState(false)
  const [birthPlace, setBirthPlace] = useState('')
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('English')
  const [specialConcern, setSpecialConcern] = useState('')

  // UI states
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState<{ paymentId: string; orderId: string } | null>(null)
  const [activeSampleIndex, setActiveSampleIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Form Validation
  const validateForm = () => {
    if (!devoteeName.trim()) {
      toast.error('Please enter devotee full name.')
      return false
    }
    if (!dob) {
      toast.error('Please select date of birth.')
      return false
    }
    if (!birthPlace.trim()) {
      toast.error('Please enter place of birth (City, State).')
      return false
    }
    const cleanPhone = whatsappPhone.replace(/[^\d]/g, '')
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit WhatsApp number.')
      return false
    }
    return true
  }

  // 1. Razorpay Payment Gateway Flow
  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      // 1) Create Order on Server
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInRupees: report.price,
          paymentType: 'astro',
          referenceId: report.id,
          description: `${report.title} — Vedic Horoscope Report`,
          customer: {
            name: devoteeName,
            contact: whatsappPhone,
            email: email || undefined,
          },
          notes: {
            reportTitle: report.title,
            reportSlug: report.slug,
            dob,
            birthTime: isTimeUnknown ? 'Time Unknown' : birthTime,
            birthPlace,
            gender,
            language,
            specialConcern,
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || 'Unable to initiate order. Please try again.')
      }

      // 2) Verify Razorpay SDK
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay SDK is loading, please try again in a few moments.')
      }

      // 3) Open Razorpay Gateway
      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'DivyaYagyam Vedic Astrology',
        description: `${report.title} (₹${report.price})`,
        image: '/logo.jpg',
        order_id: data.orderId,
        prefill: {
          name: devoteeName,
          contact: whatsappPhone,
          email: email || undefined,
        },
        theme: {
          color: '#B85C24',
        },
        handler: async (response: any) => {
          try {
            // Verify Payment
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: data.paymentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()

            if (verifyData?.ok) {
              // Save to dedicated Horoscope Orders system for Admin
              try {
                await fetch('/api/horoscope/order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    devoteeName,
                    gender,
                    dob,
                    birthTime: isTimeUnknown ? 'Time Unknown' : birthTime,
                    birthPlace,
                    whatsappPhone,
                    email,
                    language,
                    specialConcern,
                    reportId: report.id,
                    reportTitle: report.title,
                    amount: report.price,
                    paymentId: response.razorpay_payment_id,
                    orderId: data.orderId,
                    paymentStatus: 'PAID',
                  }),
                })
              } catch (e) {
                console.warn('Failed to sync horoscope order:', e)
              }

              setPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: data.orderId,
              })
              toast.success('Your horoscope report order was placed successfully!')
            } else {
              toast.error('Payment verification failed. Please contact WhatsApp support.')
            }
          } catch (err: any) {
            toast.error('Payment verification encounter an issue.')
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      })

      rzp.on('payment.failed', (resp: any) => {
        toast.error(`Payment failed: ${resp?.error?.description || 'Please try again.'}`)
        setLoading(false)
      })

      rzp.open()
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  // 2. WhatsApp Direct Order Option
  const handleWhatsAppOrder = () => {
    if (!validateForm()) return

    // Pre-record in Admin queue
    fetch('/api/horoscope/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        devoteeName,
        gender,
        dob,
        birthTime: isTimeUnknown ? 'Time Unknown' : birthTime,
        birthPlace,
        whatsappPhone,
        email,
        language,
        specialConcern,
        reportId: report.id,
        reportTitle: report.title,
        amount: report.price,
        paymentStatus: 'WHATSAPP_REQUEST',
      }),
    }).catch(() => {})

    const msg = `Hello DivyaYagyam! 
I would like to order the "${report.title}" (₹${report.price}) Vedic Horoscope Report.

*Devotee Birth Details:*
• Name: ${devoteeName}
• Gender: ${gender}
• Date of Birth: ${dob}
• Time of Birth: ${isTimeUnknown ? 'Time Unknown' : birthTime || 'Time Unknown'}
• Place of Birth: ${birthPlace}
• Preferred Language: ${language}
• WhatsApp Number: ${whatsappPhone}
${specialConcern ? `• Key Question / Concern: ${specialConcern}` : ''}

Please confirm the order and provide payment link / confirmation.`

    const waUrl = `https://wa.me/919530401984?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
  }

  return (
    <div className="bg-[#F8F4EC] text-[#171513] min-h-screen notranslate selection:bg-[#B85C24]/20 pb-24 md:pb-16" translate="no">
      {/* Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* ── BREADCRUMB ── */}
      <div className="border-b border-[#E8E1D5] bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#6E665D]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#B85C24] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/horoscope" className="hover:text-[#B85C24] transition-colors">Horoscope</Link>
            <span>/</span>
            <span className="text-[#171513] font-bold truncate max-w-[200px] sm:max-w-none">{report.title}</span>
          </div>

          <Link href="/horoscope" className="inline-flex items-center gap-1 text-[#B85C24] font-bold hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All 7 Reports</span>
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTAINER ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* ── SUCCESS STATE SCREEN ── */}
        {paymentSuccess ? (
          <section className="max-w-2xl mx-auto bg-white rounded-3xl border border-emerald-300 p-8 sm:p-12 text-center shadow-xl space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase">
                Payment Confirmed • Order Accepted
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#171513]">
                Thank You, {devoteeName}!
              </h1>
              <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed max-w-md mx-auto">
                Your <strong className="text-[#171513]">{report.title}</strong> is now being computed and verified.
              </p>
            </div>

            <div className="bg-[#F8F4EC] rounded-2xl p-4 text-xs space-y-2 text-left border border-[#E8E1D5]">
              <div className="flex justify-between">
                <span className="text-[#6E665D]">Payment ID:</span>
                <span className="font-mono font-bold text-[#171513]">{paymentSuccess.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E665D]">WhatsApp Delivery To:</span>
                <span className="font-bold text-[#171513]">{whatsappPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E665D]">Estimated Delivery:</span>
                <span className="font-bold text-emerald-700">Within minutes directly on WhatsApp & Email</span>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={`https://wa.me/919530401984?text=${encodeURIComponent(`Hello! I have completed payment for "${report.title}" (Payment ID: ${paymentSuccess.paymentId}). Please confirm my order.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Get WhatsApp Updates Immediately</span>
              </a>

              <Link
                href="/horoscope"
                className="inline-block text-xs font-bold text-[#6E665D] hover:text-[#171513] hover:underline"
              >
                ← Explore other Vedic Reports
              </Link>
            </div>
          </section>
        ) : (

          /* ── 2-COLUMN HERO + CHECKOUT GRID ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ── LEFT COLUMN: ARTWORK & CREDIBILITY (5 Cols) ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Luxury Artwork Card */}
              <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-sm overflow-hidden text-center relative group">
                <div
                  className="w-48 h-64 sm:w-56 sm:h-76 mx-auto rounded-2xl shadow-xl border-4 border-white/60 flex flex-col justify-between p-6 text-white relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ background: report.coverArtwork }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-serif opacity-80">ॐ</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded">
                      DIVYAYAGYAM
                    </span>
                  </div>

                  <div className="space-y-1 text-left">
                    <h3 className="text-xl font-black leading-tight drop-shadow-md">
                      {report.title}
                    </h3>
                    <p className="text-[11px] text-white/90 font-medium line-clamp-2 drop-shadow-sm">
                      {report.tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/30 flex justify-between items-center text-[10px] font-bold">
                    <span>{report.pages} PAGES</span>
                    <span>SIDEREAL VEDIC</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E8E1D5] flex items-center justify-around text-xs font-bold text-[#6E665D]">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#B85C24]" />
                    <span>{report.pages} Pages Complete PDF</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    <span>{report.rating} ({report.reviewCount}+ reviews)</span>
                  </div>
                </div>
              </div>

              {/* 4 Trust Highlights Strip */}
              <div className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-2xs space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-[#6E665D]">
                  What's Guaranteed In This Report:
                </div>
                <ul className="space-y-2.5 text-xs text-[#171513] font-medium">
                  {report.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="leading-snug">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Astrologer Verification Badge */}
              <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-amber-300">
                  <img
                    src="/mukesh_bohra_ji.png"
                    alt="Pt. Mukesh Bohra"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/katyayani_yagya_hero.webp'
                    }}
                  />
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="font-extrabold text-[#171513] flex items-center gap-1">
                    <span>Verified by Pt. Mukesh Bohra</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[#6E665D] text-[11px] leading-tight">
                    Head Acharya, Maa Katyayani Shakti Peeth (25+ Years Vedic Experience)
                  </p>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: INTERACTIVE FORM (7 Cols) ── */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-black text-[#B85C24]">
                    ✨ VEDIC HOROSCOPE
                  </span>
                  {report.badge && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${report.badgeColor}`}>
                      {report.badge}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#171513] leading-tight">
                  {report.title}
                </h1>

                <p className="text-sm sm:text-base text-[#6E665D] font-medium leading-relaxed">
                  {report.subtitle}
                </p>

                {/* Price Bar */}
                <div className="pt-2 flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#171513]">
                    ₹{report.price}
                  </span>
                  <span className="text-base text-[#6E665D] line-through font-medium">
                    ₹{report.originalPrice}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-xs font-black">
                    Save ₹{report.originalPrice - report.price} (Special Dakshina)
                  </span>
                </div>
              </div>

              {/* ── FORM CONTAINER ── */}
              <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-md">
                <div className="pb-5 mb-5 border-b border-[#E8E1D5] flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-[#171513]">
                      Enter Birth Details
                    </h2>
                    <p className="text-xs text-[#6E665D]">
                      Required for minute-accurate sidereal planetary computation
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ⚡ WhatsApp PDF Delivery
                    </span>
                  </div>
                </div>

                <form onSubmit={handleRazorpayPayment} className="space-y-4 text-left">
                  
                  {/* Full Name & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">Devotee Full Name *</Label>
                      <Input
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={devoteeName}
                        onChange={(e) => setDevoteeName(e.target.value)}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] placeholder:text-gray-400 focus:border-[#B85C24] h-11"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">Gender</Label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full h-11 px-3 rounded-md bg-[#F8F4EC] border border-[#E8E1D5] text-xs font-bold text-[#171513] focus:border-[#B85C24] outline-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Date of Birth & Exact Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">Date of Birth *</Label>
                      <Input
                        required
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] focus:border-[#B85C24] h-11"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-bold text-[#171513]">Time of Birth</Label>
                        <label className="text-[11px] text-[#6E665D] flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isTimeUnknown}
                            onChange={(e) => setIsTimeUnknown(e.target.checked)}
                            className="rounded border-[#E8E1D5] text-[#B85C24] focus:ring-0"
                          />
                          <span>Exact time unknown</span>
                        </label>
                      </div>
                      <Input
                        type="time"
                        disabled={isTimeUnknown}
                        value={isTimeUnknown ? '' : birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        placeholder={isTimeUnknown ? 'Time Unknown' : '10:30 AM'}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] focus:border-[#B85C24] h-11 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Place of Birth & WhatsApp Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">Place of Birth (City, State) *</Label>
                      <Input
                        required
                        placeholder="e.g. New Delhi, India"
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] placeholder:text-gray-400 focus:border-[#B85C24] h-11"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">WhatsApp Number (For PDF Delivery) *</Label>
                      <Input
                        required
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] placeholder:text-gray-400 focus:border-[#B85C24] h-11"
                      />
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-1 pt-1">
                    <Label className="text-xs font-bold text-[#171513]">Preferred Report Language</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setLanguage('English')}
                        className={`h-11 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 ${
                          language === 'English'
                            ? 'bg-[#151311] text-[#F8F4EC] border-[#151311] shadow-xs'
                            : 'bg-[#F8F4EC] text-[#6E665D] border-[#E8E1D5] hover:bg-[#EFE7D8]'
                        }`}
                      >
                        <span>English</span>
                        {language === 'English' && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('Hindi')}
                        className={`h-11 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 ${
                          language === 'Hindi'
                            ? 'bg-[#151311] text-[#F8F4EC] border-[#151311] shadow-xs'
                            : 'bg-[#F8F4EC] text-[#6E665D] border-[#E8E1D5] hover:bg-[#EFE7D8]'
                        }`}
                      >
                        <span>हिन्दी (Hindi)</span>
                        {language === 'Hindi' && <Check className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Optional Specific Concern */}
                  <div className="space-y-1 pt-1">
                    <Label className="text-xs font-bold text-[#171513]">Any Specific Life Question or Concern? (Optional)</Label>
                    <Input
                      placeholder="e.g. Career switch, marriage timing, health concern"
                      value={specialConcern}
                      onChange={(e) => setSpecialConcern(e.target.value)}
                      className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] placeholder:text-gray-400 focus:border-[#B85C24] h-11"
                    />
                  </div>

                  {/* ── ACTION BUTTONS ── */}
                  <div className="pt-3 space-y-2.5">
                    
                    {/* Razorpay Instant Payment Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-gradient-to-r from-[#B85C24] via-[#D97706] to-[#B08A45] hover:from-[#a04e1c] hover:to-[#b45309] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Opening Secure Payment Gateway...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>Pay ₹{report.price} (UPI / Cards / NetBanking)</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {/* WhatsApp Booking Alternative */}
                    <button
                      type="button"
                      onClick={handleWhatsAppOrder}
                      className="w-full h-12 bg-[#F8F4EC] hover:bg-[#EFE7D8] text-[#171513] font-bold text-xs rounded-2xl border border-[#E8E1D5] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="h-4 w-4 text-emerald-600" />
                      <span>Order via WhatsApp Chat</span>
                    </button>

                  </div>

                  {/* Micro Trust Bar */}
                  <div className="pt-3 border-t border-[#E8E1D5] flex flex-wrap items-center justify-center gap-3 text-[11px] font-semibold text-[#6E665D]">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Secured
                    </span>
                    <span>•</span>
                    <span>Razorpay Verified</span>
                    <span>•</span>
                    <span>GPay / PhonePe / Paytm / Cards</span>
                  </div>

                </form>
              </div>

            </div>

          </div>
        )}

        {/* ── SECTION 2: WHAT'S INSIDE THIS REPORT ── */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E1D5]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#B85C24]">
              Scriptural Breakdown
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              What This Report Reveals
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665D]">
              Key chapters computed specifically for your unique birth chart
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.chapters.map((ch, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#E8E1D5] shadow-2xs space-y-2 hover:shadow-md transition-all"
              >
                <div className="font-mono text-xs font-black text-[#B85C24] bg-[#F8F4EC] w-8 h-8 rounded-lg flex items-center justify-center border border-[#E8E1D5]">
                  {ch.number}
                </div>
                <h3 className="font-extrabold text-base text-[#171513] pt-1">
                  {ch.title}
                </h3>
                <p className="text-xs text-[#6E665D] leading-relaxed">
                  {ch.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: FULL SAMPLE PAGES READER ── */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E1D5]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#B85C24]">
              100% Transparency Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              Read Sample Pages Before You Pay
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665D]">
              We believe in complete transparency. See the depth and clarity of your report before purchasing.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-10 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-[#E8E1D5]">
              {report.samplePages.map((sample, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setActiveSampleIndex(sIdx)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeSampleIndex === sIdx
                      ? 'bg-[#151311] text-[#F8F4EC] shadow-xs'
                      : 'bg-[#F8F4EC] text-[#6E665D] hover:text-[#171513]'
                  }`}
                >
                  {sample.title.split(':')[0]}
                </button>
              ))}
            </div>

            <div className="pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 bg-[#F8F4EC] p-6 rounded-2xl border border-[#E8E1D5] text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white text-[#B85C24] mx-auto flex items-center justify-center font-bold text-lg shadow-2xs border border-[#E8E1D5]">
                  ▤
                </div>
                <h4 className="font-extrabold text-sm text-[#171513]">
                  {report.samplePages[activeSampleIndex]?.title}
                </h4>
                <p className="text-xs text-[#6E665D] leading-relaxed">
                  {report.samplePages[activeSampleIndex]?.desc}
                </p>
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    ✓ Verified Brihat Parashara Algorithms
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-left">
                <h3 className="text-lg font-black text-[#171513]">
                  Minute-Accurate Planetary Interpretations
                </h3>
                <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
                  Every page computes the exact degrees, aspects, house transitions, and nakshatra padas. No generic computerized one-liners — only precise, authenticated Vedic science.
                </p>
                <ul className="space-y-2 text-xs text-[#171513]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Planetary benefic & malefic strength percentage analysis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Resolving conflicts between running Dashas and Gochar (transits)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Practical Vedic remedies easy to adopt in daily life</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: FAQS ── */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E1D5] max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#6E665D]">
              Everything you need to know about the {report.title}
            </p>
          </div>

          <div className="space-y-3">
            {report.faqs.map((f, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-[#E8E1D5] overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-4 px-5 text-left font-bold text-sm text-[#171513] flex items-center justify-between gap-3 hover:text-[#B85C24] transition-colors cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <span className="text-base font-bold text-[#6E665D]">
                      {isOpen ? '–' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-[#6E665D] leading-relaxed border-t border-[#E8E1D5]/60 bg-[#F8F4EC]/30">
                      {f.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

      </main>

      {/* ── 5. STICKY MOBILE CONVERSION BAR ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-[#E8E1D5] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-[#6E665D] block">{report.title}</span>
          <span className="text-lg font-black text-[#171513]">₹{report.price}</span>
        </div>

        <button
          onClick={() => {
            window.scrollTo({ top: 120, behavior: 'smooth' })
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B85C24] to-[#D97706] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
        >
          <span>Order Report →</span>
        </button>
      </div>

    </div>
  )
}

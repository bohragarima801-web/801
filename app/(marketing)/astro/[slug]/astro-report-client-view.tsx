'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import {
  Sparkles, Star, ShieldCheck, Lock, CheckCircle2, ArrowRight,
  Clock, Phone, MessageCircle, FileText, Check, ArrowLeft,
  ChevronDown, ChevronUp, User, MapPin, Calendar, HelpCircle,
  Award, Eye, Share2
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

interface AstroReportClientViewProps {
  report: AstroReportDetail
}

export function AstroReportClientView({ report }: AstroReportClientViewProps) {
  // Form states
  const [devoteeName, setDevoteeName] = useState('')
  const [gender, setGender] = useState('Male')
  const [dob, setDob] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [isTimeUnknown, setIsTimeUnknown] = useState(false)
  const [birthPlace, setBirthPlace] = useState('')
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('Hindi')
  const [specialConcern, setSpecialConcern] = useState('')

  // UI states
  const [loading, setLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState<{ paymentId: string; orderId: string } | null>(null)
  const [activeSampleIndex, setActiveSampleIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Validate form
  const validateForm = () => {
    if (!devoteeName.trim()) {
      toast.error('कृपया मुख्य यजमान का पूरा नाम दर्ज करें।')
      return false
    }
    if (!dob) {
      toast.error('कृपया जन्म तिथि (Date of Birth) चुनें।')
      return false
    }
    if (!birthPlace.trim()) {
      toast.error('कृपया जन्म स्थान (City / State) दर्ज करें।')
      return false
    }
    const cleanPhone = whatsappPhone.replace(/[^\d]/g, '')
    if (cleanPhone.length < 10) {
      toast.error('कृपया 10 अंकों का वैध WhatsApp नंबर दर्ज करें।')
      return false
    }
    return true
  }

  // 1. Direct Razorpay Checkout Flow
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
          description: `${report.title} — Vedic Astrology Report`,
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
        throw new Error(data?.error || 'ऑर्डर बनाने में असमर्थ। कृपया पुनः प्रयास करें।')
      }

      // 2) Check if Razorpay is loaded
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay SDK लोड हो रहा है, कृपया 2 सेकंड बाद फिर दबाएं।')
      }

      // 3) Open Razorpay Gateway
      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'दिव्ययज्ञम् — DivyaYagyam',
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
              setPaymentSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: data.orderId,
              })
              toast.success('हरि ओम्! आपकी रिपोर्ट बुकिंग सफलतापूर्वक संपन्न हुई।')
            } else {
              toast.error('भुगतान सत्यापन विफल रहा। सहायता हेतु WhatsApp पर संपर्क करें।')
            }
          } catch (err: any) {
            toast.error('भुगतान सत्यापन में समस्या आई।')
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      })

      rzp.on('payment.failed', (resp: any) => {
        toast.error(`भुगतान विफल: ${resp?.error?.description || 'कृपया पुनः प्रयास करें।'}`)
        setLoading(false)
      })

      rzp.open()
    } catch (err: any) {
      toast.error(err?.message || 'त्रुटि हुई। कृपया पुनः प्रयास करें।')
      setLoading(false)
    }
  }

  // 2. Direct WhatsApp Order Alternative
  const handleWhatsAppOrder = () => {
    if (!validateForm()) return

    const msg = `हरि ओम्! 
मुझे दिव्ययज्ञम् की "${report.title}" (₹${report.price}) वैदिक रिपोर्ट प्राप्त करनी है।

*यजमान जन्म विवरण:*
• नाम: ${devoteeName}
• लिंग: ${gender}
• जन्म तिथि: ${dob}
• जन्म समय: ${isTimeUnknown ? 'ज्ञात नहीं' : birthTime || 'ज्ञात नहीं'}
• जन्म स्थान: ${birthPlace}
• भाषा: ${language}
• WhatsApp नंबर: ${whatsappPhone}
${specialConcern ? `• मुख्य प्रश्न / चिंता: ${specialConcern}` : ''}

कृपया रिपोर्ट तैयार करने की प्रक्रिया एवं भुगतान लिंक प्रदान करें।`

    const waUrl = `https://wa.me/919530401984?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
  }

  return (
    <div className="bg-[#F8F4EC] text-[#171513] min-h-screen notranslate selection:bg-[#B85C24]/20 pb-24 md:pb-16" translate="no">
      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* ── BREADCRUMB ── */}
      <div className="border-b border-[#E8E1D5] bg-white/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#6E665D]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#B85C24] transition-colors">होम</Link>
            <span>/</span>
            <Link href="/astro" className="hover:text-[#B85C24] transition-colors">वैदिक ज्योतिष</Link>
            <span>/</span>
            <span className="text-[#171513] font-bold truncate max-w-[200px] sm:max-w-none">{report.title}</span>
          </div>

          <Link href="/astro" className="inline-flex items-center gap-1 text-[#B85C24] font-bold hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>सभी 7 रिपोर्ट्स</span>
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        {/* ── SUCCESS STATE SCREEN ── */}
        {paymentSuccess ? (
          <section className="max-w-2xl mx-auto bg-white rounded-3xl border border-emerald-300 p-8 sm:p-12 text-center shadow-xl space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase">
                Payment Confirmed • आदेश स्वीकृत
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#171513]">
                हरि ओम्, {devoteeName}!
              </h1>
              <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed max-w-md mx-auto">
                आपकी <strong className="text-[#171513]">{report.title}</strong> का वैदिक गणितीय विश्लेषण शुरू हो चुका है।
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
                <span className="font-bold text-emerald-700">24 से 48 घंटे के भीतर (PDF)</span>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <a
                href={`https://wa.me/919530401984?text=${encodeURIComponent(`जय श्री राम! मैंने "${report.title}" (Payment ID: ${paymentSuccess.paymentId}) का भुगतान कर दिया है। कृपया पुष्टि करें।`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp पर तुरंत अपडेट प्राप्त करें</span>
              </a>

              <Link
                href="/astro"
                className="inline-block text-xs font-bold text-[#6E665D] hover:text-[#171513] hover:underline"
              >
                ← अन्य वैदिक रिपोर्ट्स देखें
              </Link>
            </div>
          </section>
        ) : (

          /* ── 2-COLUMN HERO + CHECKOUT GRID ── */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ── LEFT COLUMN: REPORT ARTWORK & CREDENTIALS (5 Cols) ── */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Luxury Artwork Card */}
              <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-sm overflow-hidden text-center relative group">
                {/* 3D Simulated Book Cover */}
                <div
                  className="w-48 h-64 sm:w-56 sm:h-76 mx-auto rounded-2xl shadow-xl border-4 border-white/60 flex flex-col justify-between p-6 text-white relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ background: report.coverArtwork }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-serif opacity-80">ॐ</span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded">
                      दिव्ययज्ञम्
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
                    <span>VEDIC SIDEREAL</span>
                  </div>
                </div>

                {/* Micro Meta below Artwork */}
                <div className="mt-5 pt-4 border-t border-[#E8E1D5] flex items-center justify-around text-xs font-bold text-[#6E665D]">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#B85C24]" />
                    <span>{report.pages} पृष्ठ सम्पूर्ण रिपोर्ट</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                    <span>{report.rating} ({report.reviewCount}+ समीक्षाएं)</span>
                  </div>
                </div>
              </div>

              {/* 4 Trust Highlights Strip */}
              <div className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-2xs space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-[#6E665D]">
                  दिव्ययज्ञम् का प्रामाणिक संकल्प:
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

              {/* Acharya Verification Guarantee Badge */}
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
                    <span>पं. मुकेश बोहरा द्वारा सत्यापित</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[#6E665D] text-[11px] leading-tight">
                    मुख्य अर्चक, माँ कात्यायनी शक्तिपीठ (25+ वर्ष वैदिक अनुभव)
                  </p>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: INTERACTIVE BOOKING FORM (7 Cols) ── */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Header Details */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-black text-[#B85C24]">
                    ✨ वैदिक ज्योतिष रिपोर्ट
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
                    बचत ₹{report.originalPrice - report.price} (विशेष दक्षिणा)
                  </span>
                </div>
              </div>

              {/* ── FORM CONTAINER ── */}
              <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-8 shadow-md">
                <div className="pb-5 mb-5 border-b border-[#E8E1D5] flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-[#171513]">
                      यजमान जन्म विवरण भरें
                    </h2>
                    <p className="text-xs text-[#6E665D]">
                      सटीक वैदिक गणना हेतु जन्म विवरण अनिवार्य है
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ⚡ WhatsApp PDF डिलीवरी
                    </span>
                  </div>
                </div>

                <form onSubmit={handleRazorpayPayment} className="space-y-4 text-left">
                  
                  {/* Full Name & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">मुख्य यजमान का पूरा नाम *</Label>
                      <Input
                        required
                        placeholder="उदा. अमित कुमार शर्मा"
                        value={devoteeName}
                        onChange={(e) => setDevoteeName(e.target.value)}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] placeholder:text-gray-400 focus:border-[#B85C24] h-11"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">लिंग (Gender)</Label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full h-11 px-3 rounded-md bg-[#F8F4EC] border border-[#E8E1D5] text-xs font-bold text-[#171513] focus:border-[#B85C24] outline-none"
                      >
                        <option value="Male">पुरुष (Male)</option>
                        <option value="Female">महिला (Female)</option>
                        <option value="Other">अन्य (Other)</option>
                      </select>
                    </div>
                  </div>

                  {/* Date of Birth & Exact Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">जन्म तिथि (Date of Birth) *</Label>
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
                        <Label className="text-xs font-bold text-[#171513]">जन्म समय (Birth Time)</Label>
                        <label className="text-[11px] text-[#6E665D] flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isTimeUnknown}
                            onChange={(e) => setIsTimeUnknown(e.target.checked)}
                            className="rounded border-[#E8E1D5] text-[#B85C24] focus:ring-0"
                          />
                          <span>समय ज्ञात नहीं</span>
                        </label>
                      </div>
                      <Input
                        type="time"
                        disabled={isTimeUnknown}
                        value={isTimeUnknown ? '' : birthTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        placeholder={isTimeUnknown ? 'समय अज्ञात' : '10:30 AM'}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] focus:border-[#B85C24] h-11 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Place of Birth & WhatsApp Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">जन्म स्थान (City, State) *</Label>
                      <Input
                        required
                        placeholder="उदा. जोधपुर, राजस्थान"
                        value={birthPlace}
                        onChange={(e) => setBirthPlace(e.target.value)}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] placeholder:text-gray-400 focus:border-[#B85C24] h-11"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-[#171513]">WhatsApp नंबर (रिपोर्ट डिलीवरी हेतु) *</Label>
                      <Input
                        required
                        type="tel"
                        placeholder="उदा. 9876543210"
                        value={whatsappPhone}
                        onChange={(e) => setWhatsappPhone(e.target.value)}
                        className="bg-[#F8F4EC] border-[#E8E1D5] text-[#171513] placeholder:text-gray-400 focus:border-[#B85C24] h-11"
                      />
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div className="space-y-1 pt-1">
                    <Label className="text-xs font-bold text-[#171513]">रिपोर्ट की भाषा चुनें</Label>
                    <div className="grid grid-cols-2 gap-3">
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
                    </div>
                  </div>

                  {/* Optional Specific Concern */}
                  <div className="space-y-1 pt-1">
                    <Label className="text-xs font-bold text-[#171513]">कोई विशेष प्रश्न या चिंता? (वैकल्पिक)</Label>
                    <Input
                      placeholder="उदा. विवाह का समय, करियर में रुकावट, स्वास्थ्य चिंता"
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
                          <span>सुरक्षित पेमेंट गेटवे खुल रहा है...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>पेमेंट करें ₹{report.price} (UPI / Cards / NetBanking)</span>
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
                      <span>WhatsApp पर बात करके आर्डर करें</span>
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

        {/* ── SECTION 2: WHAT'S INSIDE THIS REPORT (CHAPTERS) ── */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E1D5]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#B85C24]">
              Scriptural Breakdown
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              What This Report Reveals
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665D]">
              आपकी जन्मपत्रिका के शास्त्रीय एवं गणितीय आधार पर तैयार किए गए 5 प्रमुख अध्याय
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

        {/* ── SECTION 3: FULL SAMPLE PAGES READER (DevPunya Style) ── */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E1D5]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#B85C24]">
              100% Transparency Promise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              Read Sample Pages Before You Pay
            </h2>
            <p className="text-xs sm:text-sm text-[#6E665D]">
              हम पूरी पारदर्शिता में विश्वास करते हैं। भुगतान से पूर्व देखें कि आपकी रिपोर्ट किस गहराई व स्पष्टता से लिखी जाएगी।
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 sm:p-10 shadow-sm">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 border-b border-[#E8E1D5]">
              {report.samplePages.map((sample, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => setActiveSampleIndex(sIdx)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    activeSampleIndex === sIdx
                      ? 'bg-[#151311] text-[#F8F4EC] shadow-xs'
                      : 'bg-[#F8F4EC] text-[#6E665D] hover:text-[#171513]'
                  }`}
                >
                  {sample.title.split(':')[0]}
                </button>
              ))}
            </div>

            {/* Active Sample Card */}
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
                    ✓ Verified Parashara Algorithm
                  </span>
                </div>
              </div>

              <div className="md:col-span-7 space-y-4 text-left">
                <h3 className="text-lg font-black text-[#171513]">
                  हस्तलिखित व्याख्या एवं वेदोक्त मार्गदर्शन
                </h3>
                <p className="text-xs sm:text-sm text-[#6E665D] leading-relaxed">
                  इस पृष्ठ पर जन्म कुण्डली के ग्रहों की अंश-कला (exact degree), दृष्टि (aspects) एवं भाव-संधि का सूक्ष्म फलादेश दिया जाता है। कोई भी अस्पष्ट या सामान्य भविष्यफल नहीं, बल्कि आपके व्यक्तिगत ग्रह चक्र का प्रमाण।
                </p>
                <ul className="space-y-2 text-xs text-[#171513]">
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>ग्रहों के शुभ-अशुभ प्रभाव का प्रतिशत विश्लेषण</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>दशा और गोचर के टकराव का निवारण</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>दैनिक जीवन में अपनाने योग्य आसान वैदिक उपाय</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: FREQUENTLY ASKED QUESTIONS ── */}
        <section className="mt-16 sm:mt-24 pt-12 border-t border-[#E8E1D5] max-w-3xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#171513]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#6E665D]">
              {report.title} से संबंधित सामान्य जिज्ञासाएं
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
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B85C24] to-[#D97706] text-white font-extrabold text-xs shadow-md transition-all"
        >
          <span>विवरण भरें व बुक करें →</span>
        </button>
      </div>

    </div>
  )
}

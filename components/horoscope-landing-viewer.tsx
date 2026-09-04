'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Sparkles, MessageCircle, ShieldCheck, Compass, CreditCard, Play, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { HoroscopeCustomPage } from '@/lib/horoscope-pages'

declare global {
  interface Window {
    Razorpay: any
  }
}

export function HoroscopeLandingViewer({ page }: { page: HoroscopeCustomPage }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [paying, setPaying] = useState(false)

  // Razorpay dynamic checkout loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Handle direct Razorpay payment
  const handleRazorpayPayment = async (customAmount?: number, purpose?: string) => {
    const amount = customAmount || page.razorpay?.amount || 501

    // If a direct payment link is configured, open it
    if (page.razorpay?.paymentLink && page.razorpay.paymentLink.trim()) {
      window.open(page.razorpay.paymentLink.trim(), '_blank')
      return
    }

    try {
      setPaying(true)
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInRupees: amount,
          paymentType: 'horoscope',
          description: purpose || page.title,
          notes: {
            pageSlug: page.slug,
            pageTitle: page.title
          }
        })
      })

      const data = await res.json()
      if (!data?.ok) {
        toast.error(data?.error || 'Failed to create payment order')
        setPaying(false)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        toast.error('Payment gateway could not be loaded. Please check your internet connection.')
        setPaying(false)
        return
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'DivyaYagyam',
        description: purpose || page.title,
        order_id: data.orderId,
        image: '/logo.jpg',
        handler: async function (response: any) {
          toast.success('🎉 दक्षिणा / भुगतान सफल! धन्यवाद।')
          // Optional redirect to WhatsApp with payment confirmation
          const waPhone = page.whatsappNumber || '919530401984'
          const confirmText = encodeURIComponent(`नमस्ते पंडित जी, मैंने "${page.title}" के लिए ₹${amount} का भुगतान सफलता पूर्वक कर दिया है। Payment ID: ${response.razorpay_payment_id}`)
          window.location.href = `https://wa.me/${waPhone}?text=${confirmText}`
        },
        theme: {
          color: '#7A1F2B'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (resp: any) {
        toast.error('Payment failed or cancelled')
      })
      rzp.open()
    } catch (err: any) {
      toast.error('Error initiating payment')
    } finally {
      setPaying(false)
    }
  }

  // Inject & safely process pasted code
  useEffect(() => {
    if (!containerRef.current || !page.customCode) return

    // 1. Inject HTML safely
    containerRef.current.innerHTML = page.customCode

    // 2. Make all iframes responsive and prevent layout breaking
    const iframes = containerRef.current.querySelectorAll('iframe')
    iframes.forEach((iframe) => {
      iframe.classList.add('w-full', 'max-w-full', 'rounded-2xl')
      if (!iframe.style.maxWidth) iframe.style.maxWidth = '100%'
      if (!iframe.getAttribute('loading')) {
        iframe.setAttribute('loading', 'lazy')
      }
    })

    // 3. Make all images responsive
    const images = containerRef.current.querySelectorAll('img')
    images.forEach((img) => {
      img.classList.add('max-w-full', 'h-auto', 'rounded-xl')
    })

    // 4. Wrap tables in responsive scroll wrapper
    const tables = containerRef.current.querySelectorAll('table')
    tables.forEach((table) => {
      if (!table.parentElement?.classList.contains('table-responsive-wrapper')) {
        const wrapper = document.createElement('div')
        wrapper.className = 'table-responsive-wrapper w-full overflow-x-auto my-4 rounded-xl border border-[#E8DDD0]'
        table.parentNode?.insertBefore(wrapper, table)
        wrapper.appendChild(table)
      }
    })

    // 5. Attach click listener to any buttons or links with data-razorpay-amount or class razorpay-pay-btn
    const payElements = containerRef.current.querySelectorAll('[data-razorpay-amount], .razorpay-pay-btn, [data-razorpay="true"]')
    payElements.forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault()
        const amtAttr = el.getAttribute('data-razorpay-amount')
        const purposeAttr = el.getAttribute('data-purpose')
        const amt = amtAttr ? Number(amtAttr) : page.razorpay?.amount || 501
        handleRazorpayPayment(amt, purposeAttr || undefined)
      })
    })

    // 6. Re-execute any embedded <script> tags
    const scripts = containerRef.current.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [page.customCode, page.razorpay])

  const waPhone = page.whatsappNumber || '919530401984'
  const waText = encodeURIComponent(`प्रणाम, मुझे "${page.title}" के बारे में जानकारी व परामर्श चाहिए।`)
  const waUrl = `https://wa.me/${waPhone}?text=${waText}`

  // Helper to format video embed URLs
  const formatVideoEmbed = (url: string) => {
    if (!url) return ''
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${id}`
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${id}`
    }
    return url
  }

  return (
    <div className="min-h-screen bg-[#FFF9F1] text-[#241A18] notranslate selection:bg-[#7A1F2B]/10 overflow-x-hidden" translate="no">

      {/* Optional Divine Header Banner */}
      {page.headerBanner && (
        <section className="relative bg-gradient-to-b from-white via-[#FFF9F1] to-[#FFF9F1] py-10 md:py-16 border-b border-[#E8DDD0] overflow-hidden">
          <div aria-hidden="true" className="absolute right-0 top-0 text-[24vw] font-serif text-[#C89B3C]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6ED] border border-[#E8DDD0] text-[#7A1F2B] text-xs font-black tracking-wide shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
              <span>DIVYAYAGYAM VEDIC ASTROLOGY & HOROSCOPE</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#241A18] leading-tight font-heading">
              {page.title}
            </h1>

            {page.subtitle && (
              <p className="text-sm sm:text-base text-[#6F625D] max-w-2xl mx-auto font-medium leading-relaxed">
                {page.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold text-[#241A18]">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E8DDD0] shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% शास्त्रोक्त गणना
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#E8DDD0] shadow-2xs">
                <Compass className="h-3.5 w-3.5 text-[#C89B3C]" /> प्रमाणित ज्योतिषाचार्य
              </span>
              {page.razorpay?.enabled && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200 shadow-2xs">
                  <CreditCard className="h-3.5 w-3.5 text-emerald-600" /> Razorpay सुरक्षित भुगतान सक्रिय
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area — Layout-Aware & Margin-Protected */}
      <main className="w-full">
        {page.layout === 'container' ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
            <div className="bg-white rounded-3xl border border-[#E8DDD0] shadow-[0_4px_24px_rgba(36,26,24,0.04)] p-5 sm:p-8 md:p-12 space-y-8 overflow-hidden">
              {/* Pasted Custom Code */}
              <div ref={containerRef} className="w-full text-[#241A18] leading-relaxed" />

              {/* Separate Images Section if provided */}
              {page.images && page.images.length > 0 && (
                <div className="pt-6 border-t border-[#E8DDD0] space-y-4">
                  <h3 className="text-lg font-bold text-[#241A18] flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-[#7A1F2B]" />
                    <span>पावन छवि संग्रह / Featured Media</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {page.images.map((img, idx) => (
                      <div key={img.id || idx} className="rounded-2xl overflow-hidden border border-[#E8DDD0] bg-[#FAF6ED] shadow-2xs group">
                        <div className="aspect-[4/3] relative overflow-hidden">
                          <img
                            src={img.url}
                            alt={img.title || 'Horoscope image'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {img.title && (
                          <div className="p-2.5 bg-white text-xs font-semibold text-[#241A18] truncate">
                            {img.title}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Separate Videos Section if provided */}
              {page.videos && page.videos.length > 0 && (
                <div className="pt-6 border-t border-[#E8DDD0] space-y-4">
                  <h3 className="text-lg font-bold text-[#241A18] flex items-center gap-2">
                    <Play className="h-5 w-5 text-[#7A1F2B]" />
                    <span>विशेष वीडियो एवं मार्गदर्शन / Featured Videos</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {page.videos.map((vid, idx) => (
                      <div key={vid.id || idx} className="rounded-2xl overflow-hidden border border-[#E8DDD0] bg-black shadow-md space-y-2 p-1">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden">
                          {vid.url.endsWith('.mp4') || vid.url.endsWith('.webm') ? (
                            <video src={vid.url} controls className="w-full h-full object-cover" />
                          ) : (
                            <iframe
                              src={formatVideoEmbed(vid.url)}
                              title={vid.title || 'Video player'}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full border-0"
                            />
                          )}
                        </div>
                        {vid.title && (
                          <p className="px-3 py-1.5 text-xs font-bold text-white truncate">
                            {vid.title}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`${page.layout === 'fullwidth' ? 'max-w-7xl mx-auto' : 'w-full'} px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8`}>
            <div ref={containerRef} className="w-full text-[#241A18] leading-relaxed" />

            {/* Separate Images Section */}
            {page.images && page.images.length > 0 && (
              <div className="pt-6 border-t border-[#E8DDD0] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {page.images.map((img, idx) => (
                    <div key={img.id || idx} className="rounded-2xl overflow-hidden border border-[#E8DDD0] bg-white shadow-2xs">
                      <img src={img.url} alt={img.title || ''} className="w-full h-auto object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Separate Videos Section */}
            {page.videos && page.videos.length > 0 && (
              <div className="pt-6 border-t border-[#E8DDD0] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {page.videos.map((vid, idx) => (
                    <div key={vid.id || idx} className="rounded-2xl overflow-hidden border border-[#E8DDD0] bg-black shadow-md aspect-video">
                      <iframe src={formatVideoEmbed(vid.url)} className="w-full h-full border-0" allowFullScreen />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Sticky Action Bar */}
      {page.showBookingBar && (
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8DDD0] p-3 sm:p-4 shadow-[0_-6px_20px_rgba(36,26,24,0.08)] pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-extrabold text-[#241A18] truncate">{page.title}</span>
              <span className="text-[11px] text-[#6F625D]">100% सुरक्षित भुगतान • विशेषज्ञ आचार्य परामर्श</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Direct Razorpay Pay Button if enabled */}
              {page.razorpay?.enabled && (
                <button
                  onClick={() => handleRazorpayPayment()}
                  disabled={paying}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#7A1F2B] hover:bg-[#631822] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
                >
                  {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  <span>{page.razorpay.buttonText || `सुरक्षित भुगतान करें (₹${page.razorpay.amount || 501})`}</span>
                </button>
              )}

              {/* WhatsApp Consultation Link */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp परामर्श</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

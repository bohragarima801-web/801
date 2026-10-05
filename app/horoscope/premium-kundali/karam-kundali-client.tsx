'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { toast } from 'sonner'

declare global {
  interface Window {
    Razorpay: any
  }
}

export function KaramKundaliClient() {
  // Form states
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState('male')
  const [dob, setDob] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [birthPlace, setBirthPlace] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // FAQ accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => (prev === index ? null : index))
  }

  // Smooth video fade loop for hero video
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return

    const handleCanPlay = () => {
      video.play().catch(() => {})
      video.style.opacity = '1'
    }

    video.addEventListener('canplay', handleCanPlay, { once: true })
    video.play().catch(() => {})

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  // Handle Form Submission & Razorpay Gateway Checkout
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error('कृपया अपना पूरा नाम दर्ज करें।')
      return
    }
    if (!dob) {
      toast.error('कृपया जन्म तिथि चुनें।')
      return
    }
    if (!birthPlace.trim()) {
      toast.error('कृपया अपना जन्म स्थान (शहर, राज्य) दर्ज करें।')
      return
    }
    const cleanPhone = whatsapp.replace(/[^\d]/g, '')
    if (cleanPhone.length < 10) {
      toast.error('कृपया 10 अंकों का वैध WhatsApp नंबर दर्ज करें।')
      return
    }

    setLoading(true)

    try {
      // 1. Create Order on Server
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountInRupees: 501,
          paymentType: 'astro',
          referenceId: 'premium-kundali',
          description: 'DivyaYagyam Karam Kundali (40+ Pages Report)',
          customer: {
            name: fullName,
            contact: whatsapp,
            email: email || undefined,
          },
          notes: {
            reportTitle: 'DivyaYagyam Karam Kundali',
            reportSlug: 'premium-kundali',
            devoteeName: fullName,
            dob,
            birthTime: birthTime || 'Unknown',
            birthPlace,
            gender,
            whatsappPhone: whatsapp,
            email: email || '',
            language: 'Hindi',
          },
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data?.error || 'ऑर्डर शुरू करने में असमर्थ। कृपया पुनः प्रयास करें।')
      }

      // 2. Ensure Razorpay SDK is loaded
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay SDK लोड हो रहा है, कृपया कुछ सेकंड बाद प्रयास करें।')
      }

      // 3. Open Razorpay Checkout Modal
      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'DivyaYagyam',
        description: 'Karam Kundali Report (₹501)',
        image: '/logo.jpg',
        order_id: data.orderId,
        prefill: {
          name: fullName,
          contact: whatsapp,
          email: email || undefined,
        },
        theme: {
          color: '#E5A638',
        },
        handler: async (response: any) => {
          try {
            // Verify payment
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
              // Save client details to backend Horoscope Orders queue
              try {
                await fetch('/api/horoscope/order', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    devoteeName: fullName,
                    gender,
                    dob,
                    birthTime: birthTime || 'Unknown',
                    birthPlace,
                    whatsappPhone: whatsapp,
                    email,
                    language: 'Hindi',
                    reportId: 'premium-kundali',
                    reportTitle: 'Karam Kundali (40+ Pages)',
                    amount: 501,
                    paymentId: response.razorpay_payment_id,
                    orderId: data.orderId,
                    paymentStatus: 'PAID',
                  }),
                })
              } catch (e) {
                console.warn('Backend sync warning:', e)
              }

              toast.success('🎉 भुगतान सफल! धन्यवाद।')

              // Redirect to dedicated Thank You / Success Page with client details
              const query = new URLSearchParams({
                payment_id: response.razorpay_payment_id || '',
                order_id: data.orderId || '',
                name: fullName || '',
                phone: whatsapp || '',
                email: email || '',
                dob,
                time: birthTime || '',
                place: birthPlace || '',
                gender,
              })
              window.location.href = `/horoscope/premium-kundali/thank-you?${query.toString()}`
            } else {
              toast.error('भुगतान सत्यापन विफल रहा। कृपया WhatsApp सपोर्ट पर संपर्क करें।')
              setLoading(false)
            }
          } catch (err: any) {
            toast.error('भुगतान सत्यापन में समस्या आई।')
            setLoading(false)
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
      toast.error(err?.message || 'त्रुटि उत्पन्न हुई। कृपया पुनः प्रयास करें।')
      setLoading(false)
    }
  }

  return (
    <div className="karam-kundali-root">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* ── GOOGLE FONTS & STYLES MATCHING UPLOADED HTML EXACTLY ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        .karam-kundali-root {
          --bg: #08080a;
          --bg-card: rgba(255, 255, 255, 0.02);
          --white: #ffffff;
          --text-main: #f5f5f7;
          --muted: rgba(240, 240, 245, 0.65);
          --soft: rgba(255, 255, 255, 0.06);
          --border: rgba(255, 255, 255, 0.1);
          --gold-accent: #E5A638;
          --gold-light: #FFE28A;
          --gold-grad: linear-gradient(135deg, #FFE28A 0%, #E5A638 52%, #B86B14 100%);
          --gold-glow: rgba(229, 166, 56, 0.35);
          --border-gold: rgba(229, 166, 56, 0.22);

          margin: 0;
          background: var(--bg);
          color: var(--text-main);
          font-family: 'Plus Jakarta Sans', Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        .karam-kundali-root * {
          box-sizing: border-box;
        }

        .karam-kundali-root a {
          color: inherit;
          text-decoration: none;
        }

        .karam-kundali-root button,
        .karam-kundali-root input,
        .karam-kundali-root select {
          font: inherit;
        }

        .instrument {
          font-family: 'Instrument Serif', Georgia, serif;
        }

        .liquid-glass {
          background: var(--bg-card);
          background-blend-mode: luminosity;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid var(--border);
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08);
          position: relative;
          overflow: hidden;
        }

        .liquid-glass::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.3) 0%,
            rgba(229, 166, 56, 0.18) 25%,
            rgba(255, 255, 255, 0) 50%,
            rgba(229, 166, 56, 0.12) 80%,
            rgba(255, 255, 255, 0.25) 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* HIGH-IMPACT CATCHY BUTTON STYLES */
        .btn-catchy {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: var(--gold-grad);
          color: #120e06 !important;
          font-weight: 700;
          letter-spacing: 0.02em;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 0 25px var(--gold-glow), 0 4px 18px rgba(0, 0, 0, 0.6);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .btn-catchy::before {
          content: '';
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
          transform: skewX(-25deg);
          animation: shine 3.5s infinite;
        }

        .btn-catchy:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 35px rgba(229, 166, 56, 0.65), 0 8px 25px rgba(0, 0, 0, 0.7);
          color: #000 !important;
        }

        .btn-catchy:active {
          transform: translateY(1px) scale(0.98);
        }

        @keyframes shine {
          0% {
            left: -75%;
          }
          35%,
          100% {
            left: 125%;
          }
        }

        /* HERO */
        .hero {
          min-height: 100vh;
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: radial-gradient(ellipse at 50% 15%, rgba(229, 166, 56, 0.09) 0%, transparent 65%),
            var(--bg);
        }

        .hero-video {
          position: absolute;
          inset: 0;
          z-index: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
          opacity: 0.85;
          filter: brightness(0.65) saturate(0.85);
          transition: opacity 1s ease;
        }

        .hero-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: radial-gradient(
              ellipse at 50% 48%,
              transparent 18%,
              rgba(8, 8, 10, 0.35) 52%,
              rgba(8, 8, 10, 0.75) 100%
            ),
            linear-gradient(180deg, rgba(8, 8, 10, 0.4), transparent 38%, rgba(8, 8, 10, 0.85));
          pointer-events: none;
        }

        .nav-wrap {
          position: relative;
          z-index: 20;
          padding: 24px;
        }

        .nav {
          max-width: 1024px;
          margin: auto;
          padding: 12px 24px;
          min-height: 58px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 600;
          color: #fff;
        }

        .globe {
          width: 24px;
          height: 24px;
          border: 1.5px solid var(--gold-accent);
          border-radius: 50%;
          position: relative;
        }

        .globe:before {
          content: '';
          position: absolute;
          left: 5px;
          right: 5px;
          top: 2px;
          bottom: 2px;
          border-left: 1px solid var(--gold-accent);
          border-right: 1px solid var(--gold-accent);
          border-radius: 50%;
        }

        .globe:after {
          content: '';
          position: absolute;
          left: 2px;
          right: 2px;
          top: 10px;
          border-top: 1px solid var(--gold-accent);
        }

        .nav-left {
          display: flex;
          align-items: center;
        }

        .nav-links {
          display: flex;
          gap: 32px;
          margin-left: 32px;
        }

        .nav-links a {
          color: rgba(255, 255, 255, 0.78);
          font-size: 14px;
          font-weight: 500;
          transition: 0.2s;
        }

        .nav-links a:hover {
          color: var(--gold-light);
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .login {
          padding: 10px 22px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* HERO GRID */
        .hero-content {
          position: relative;
          z-index: 10;
          flex: 1;
          max-width: 1152px;
          width: 100%;
          margin: auto;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 40px;
          padding: 40px 24px;
        }

        .hero-text {
          text-align: left;
        }

        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: var(--gold-accent);
          font-weight: 600;
          margin-bottom: 22px;
        }

        .hero h1 {
          margin: 0;
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(50px, 6.5vw, 96px);
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: -0.045em;
          color: #fff;
        }

        .hero h1 em {
          font-style: italic;
          color: var(--gold-light);
        }

        .hero-copy {
          max-width: 540px;
          margin: 24px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.65;
        }

        .hero-cta {
          margin-top: 30px;
          padding: 16px 36px;
          font-size: 15px;
          text-transform: uppercase;
        }

        /* HERO RIGHT SIDE IMAGE */
        .hero-image-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-image-wrap img {
          width: 100%;
          max-width: 440px;
          height: auto;
          border-radius: 24px;
          object-fit: cover;
          border: 1px solid rgba(229, 166, 56, 0.28);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85), 0 0 45px rgba(229, 166, 56, 0.18);
        }

        .socials {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: center;
          gap: 12px;
          padding-bottom: 30px;
        }

        .social {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: rgba(255, 255, 255, 0.8);
          transition: 0.2s;
        }

        .social:hover {
          color: var(--gold-light);
          transform: translateY(-2px);
          border-color: var(--border-gold);
        }

        section {
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }

        .about {
          padding: 140px 24px 55px;
          background: radial-gradient(ellipse at top, rgba(229, 166, 56, 0.05) 0%, transparent 70%),
            var(--bg);
        }

        .container {
          max-width: 1152px;
          margin: auto;
        }

        .label {
          color: var(--gold-accent);
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .about h2 {
          margin: 25px 0 0;
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
          font-size: clamp(50px, 7vw, 90px);
          line-height: 1.02;
          letter-spacing: -0.035em;
          color: #fff;
        }

        .about h2 em {
          font-style: italic;
          color: var(--gold-light);
        }

        .featured {
          padding: 20px 24px 110px;
        }

        .video-card {
          max-width: 1152px;
          margin: auto;
          aspect-ratio: 16/9;
          border-radius: 28px;
          overflow: hidden;
          position: relative;
          background: #111116;
          border: 1px solid var(--border);
        }

        .video-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .video-card:after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8, 8, 10, 0.75), transparent 55%);
        }

        .video-info {
          position: absolute;
          z-index: 2;
          left: 28px;
          right: 28px;
          bottom: 28px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
        }

        .glass-info {
          max-width: 430px;
          padding: 25px;
          border-radius: 18px;
        }

        .glass-info .label {
          margin-bottom: 10px;
        }

        .glass-info p {
          font-size: 14px;
          line-height: 1.65;
          margin: 0;
          color: #fff;
        }

        .pill-btn {
          padding: 14px 30px;
          font-size: 13px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .philosophy {
          padding: 110px 24px 145px;
        }

        .big-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(60px, 9vw, 115px);
          line-height: 0.9;
          font-weight: 400;
          letter-spacing: -0.045em;
          margin: 0 0 80px;
          color: #fff;
        }

        .big-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }

        .philosophy-video {
          aspect-ratio: 4/3;
          border-radius: 28px;
          overflow: hidden;
          background: #111116;
          border: 1px solid var(--border);
        }

        .philosophy-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .text-block {
          padding: 12px 0 35px;
        }

        .text-block + .text-block {
          border-top: 1px solid var(--border);
          padding-top: 35px;
        }

        .text-block p {
          color: var(--muted);
          font-size: 16px;
          line-height: 1.7;
          margin: 0;
        }

        .services {
          padding: 110px 24px 145px;
          background: radial-gradient(ellipse at center, rgba(229, 166, 56, 0.035), transparent 65%),
            var(--bg);
        }

        .services-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 45px;
        }

        .services-head h2 {
          margin: 0;
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
          font-size: clamp(45px, 6vw, 72px);
          letter-spacing: -0.03em;
          color: #fff;
        }

        .services-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        .service {
          border-radius: 28px;
          overflow: hidden;
        }

        .service-media {
          aspect-ratio: 16/9;
          overflow: hidden;
          position: relative;
        }

        .service-media video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s;
        }

        .service:hover .service-media video {
          transform: scale(1.05);
        }

        .service-media:after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8, 8, 10, 0.65), transparent);
        }

        .service-body {
          padding: 27px;
        }

        .service-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-tag {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--gold-accent);
        }

        .arrow-up {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 20px;
          color: var(--gold-light);
        }

        .service h3 {
          font-size: 25px;
          font-weight: 500;
          margin: 26px 0 10px;
          letter-spacing: -0.02em;
          color: #fff;
        }

        .service p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.65;
          margin: 0;
          max-width: 460px;
        }

        /* CHAPTERS / MODULES */
        .report-chapters {
          padding: 90px 24px 120px;
          background: rgba(255, 255, 255, 0.01);
        }

        .chapter-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 50px;
        }

        .chap-box {
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .chap-box:hover {
          transform: translateY(-6px);
          border-color: var(--border-gold);
        }

        .chap-img-wrap {
          width: 100%;
          height: 190px;
          position: relative;
          overflow: hidden;
        }

        .chap-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
          filter: brightness(0.82) contrast(1.08);
        }

        .chap-box:hover .chap-img-wrap img {
          transform: scale(1.07);
        }

        .chap-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8, 8, 10, 0.92) 0%, rgba(8, 8, 10, 0.2) 60%, transparent 100%);
        }

        .chap-body {
          padding: 24px 28px 30px;
          flex: 1;
        }

        .chap-no {
          font-size: 11px;
          letter-spacing: 0.18em;
          color: var(--gold-accent);
          font-weight: 700;
          margin-bottom: 10px;
        }

        .chap-box h3 {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
          color: #fff;
        }

        .chap-box p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.65;
          margin: 0;
        }

        .karam-value {
          padding: 115px 24px;
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--border);
          margin-top: 55px;
        }

        .value-item {
          padding: 32px 28px 10px 0;
          border-right: 1px solid var(--border);
        }

        .value-item:not(:first-child) {
          padding-left: 28px;
        }

        .value-item:last-child {
          border-right: 0;
        }

        .value-no {
          color: var(--gold-accent);
          opacity: 0.75;
          font-size: 11px;
          letter-spacing: 0.15em;
          font-weight: 600;
        }

        .value-item h3 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
          font-size: 32px;
          margin: 38px 0 12px;
          color: #fff;
        }

        .value-item p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
          margin: 0;
        }

        /* BUY SECTION */
        .buy-section {
          padding: 110px 24px 70px;
        }

        .buy-box {
          max-width: 1152px;
          margin: auto;
          padding: 65px 60px;
          border-radius: 32px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 60px;
          align-items: center;
        }

        .buy-box h2 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
          font-size: clamp(52px, 6vw, 82px);
          line-height: 0.9;
          letter-spacing: -0.04em;
          margin: 0;
          color: #fff;
        }

        .buy-box h2 em {
          font-style: italic;
          color: var(--gold-light);
        }

        .buy-box p {
          color: var(--muted);
          line-height: 1.7;
          font-size: 14px;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin-top: 25px;
        }

        .current {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 55px;
          color: var(--gold-light);
        }

        .old {
          text-decoration: line-through;
          color: rgba(255, 255, 255, 0.45);
        }

        .buy {
          margin-top: 28px;
          padding: 20px 42px;
          font-size: 16px;
          text-transform: uppercase;
        }

        .report-mockup-wrap {
          position: relative;
          border-radius: 24px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-gold);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85), 0 0 45px rgba(229, 166, 56, 0.16);
          transform: rotate(1.5deg);
          transition: transform 0.4s ease;
        }

        .report-mockup-wrap:hover {
          transform: rotate(0deg) scale(1.02);
        }

        .report-mockup-wrap img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 18px;
          filter: contrast(1.03) brightness(0.98);
        }

        /* BIRTH DETAILS ORDER FORM */
        .order-form-container {
          max-width: 1152px;
          margin: 40px auto 130px;
          padding: 0 24px;
        }

        .form-card {
          padding: 50px 60px;
          border-radius: 32px;
        }

        .form-title-wrap {
          margin-bottom: 35px;
        }

        .form-title-wrap h3 {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(38px, 4.5vw, 55px);
          margin: 10px 0 6px;
          font-weight: 400;
          color: #fff;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .form-field label {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.78);
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border);
          color: #fff;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: var(--gold-accent);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 16px rgba(229, 166, 56, 0.25);
        }

        .form-input option {
          background: #121217;
          color: #fff;
        }

        /* REVIEWS MARQUEE */
        .reviews-section {
          padding: 100px 0 120px;
          background: radial-gradient(ellipse at center, rgba(229, 166, 56, 0.04) 0%, transparent 70%),
            var(--bg);
          overflow: hidden;
        }

        .reviews-section .container {
          margin-bottom: 45px;
        }

        .marquee-container {
          width: 100%;
          overflow: hidden;
          position: relative;
          padding: 10px 0;
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        .marquee-track {
          display: flex;
          gap: 24px;
          width: max-content;
          animation: marquee-scroll 110s linear infinite;
          will-change: transform;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 12px));
          }
        }

        .review-card {
          width: 360px;
          flex-shrink: 0;
          padding: 28px 30px;
          border-radius: 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-gold);
        }

        .review-stars {
          color: var(--gold-light);
          font-size: 14px;
          margin-bottom: 12px;
          letter-spacing: 2px;
        }

        .review-card p {
          color: var(--muted);
          font-size: 13.5px;
          line-height: 1.68;
          margin: 0 0 20px;
          flex: 1;
        }

        .review-author {
          display: flex;
          align-items: center;
          gap: 13px;
          border-top: 1px solid var(--border);
          padding-top: 15px;
        }

        .author-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 1.5px solid var(--border-gold);
          background: #17171e;
          flex-shrink: 0;
        }

        .author-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .author-name {
          font-weight: 600;
          color: #fff;
          font-size: 14px;
        }

        .author-loc {
          color: var(--gold-accent);
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* FAQ ACCORDION */
        .faq-section {
          padding: 80px 24px 140px;
        }

        .faq-wrap {
          max-width: 900px;
          margin: 50px auto 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .faq-item {
          border-radius: 20px;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .faq-item.active {
          border-color: var(--border-gold);
          background: rgba(229, 166, 56, 0.03);
        }

        .faq-question {
          width: 100%;
          padding: 26px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background: none;
          border: none;
          color: #fff;
          text-align: left;
          gap: 20px;
        }

        .faq-question h4 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #fff;
          transition: color 0.2s ease;
        }

        .faq-item.active .faq-question h4 {
          color: var(--gold-light);
        }

        .faq-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: grid;
          place-items: center;
          font-size: 20px;
          font-weight: 300;
          flex-shrink: 0;
          color: var(--gold-accent);
          transition: all 0.3s ease;
          line-height: 1;
        }

        .faq-item.active .faq-icon {
          transform: rotate(45deg);
          border-color: var(--gold-accent);
          background: rgba(229, 166, 56, 0.12);
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0, 1, 0, 1), padding 0.3s ease;
          padding: 0 30px;
        }

        .faq-item.active .faq-answer {
          max-height: 400px;
          padding-bottom: 24px;
        }

        .faq-answer p {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.75;
          color: var(--muted);
        }

        footer {
          background: var(--bg);
          padding: 45px 24px;
          border-top: 1px solid var(--border);
        }

        .footer {
          max-width: 1152px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-logo {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 34px;
          color: var(--gold-light);
        }

        .footer-links {
          display: flex;
          gap: 25px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .footer-links a:hover {
          color: var(--gold-light);
        }

        @media (max-width: 800px) {
          .nav-wrap {
            padding: 15px;
          }
          .nav {
            padding: 10px 16px;
          }
          .nav-links {
            display: none;
          }
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            padding-top: 20px;
            gap: 30px;
          }
          .hero-text {
            text-align: center;
          }
          .hero h1 {
            font-size: 14vw;
            line-height: 1;
          }
          .hero-copy {
            margin: 20px auto 0;
            font-size: 14px;
          }
          .about {
            padding-top: 95px;
          }
          .featured {
            padding-bottom: 80px;
          }
          .video-info {
            left: 15px;
            right: 15px;
            bottom: 15px;
            flex-direction: column;
            align-items: flex-start;
          }
          .glass-info {
            padding: 17px;
          }
          .philosophy {
            padding: 80px 24px 100px;
          }
          .big-title {
            margin-bottom: 55px;
          }
          .two-col,
          .services-grid,
          .buy-box,
          .form-row,
          .chapter-cards {
            grid-template-columns: 1fr;
          }
          .form-card {
            padding: 30px 20px;
          }
          .services {
            padding: 80px 24px 100px;
          }
          .services-head {
            align-items: flex-start;
          }
          .services-head .label {
            display: none;
          }
          .value-grid {
            grid-template-columns: 1fr;
          }
          .value-item,
          .value-item:not(:first-child) {
            padding: 28px 0;
            border-right: 0;
            border-bottom: 1px solid var(--border);
          }
          .buy-box {
            padding: 40px 25px;
            gap: 40px;
          }
          .report-mockup-wrap {
            transform: none;
          }
          .review-card {
            width: 290px;
            padding: 22px;
          }
          .faq-question {
            padding: 20px 22px;
          }
          .faq-answer {
            padding: 0 22px;
          }
          .footer {
            align-items: flex-start;
            gap: 25px;
            flex-direction: column;
          }
          .footer-links {
            flex-wrap: wrap;
          }
        }
      `}</style>

      {/* ── HERO ── */}
      <header className="hero" id="home">
        <video
          ref={heroVideoRef}
          className="hero-video"
          muted
          autoPlay
          playsInline
          loop
          preload="auto"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
            type="video/mp4"
          />
        </video>
        <div className="hero-shade" />

        <div className="nav-wrap">
          <nav className="nav liquid-glass">
            <div className="nav-left">
              <Link href="#home" className="brand">
                <span className="globe" />
                <span>DivyaYagyam</span>
              </Link>
              <div className="nav-links">
                <a href="#benefits">Kyun Zaroori Hai?</a>
                <a href="#chapters">Report Me Kya Hai?</a>
                <a href="#purchase">Price</a>
                <a href="#reviews">Samiksha</a>
                <a href="#faqs">Prashn</a>
              </div>
            </div>
            <div className="nav-right">
              <a className="login btn-catchy" href="#order">
                Abhi Shuru Karein ⚡
              </a>
            </div>
          </nav>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <div className="eyebrow">✦ KARAM KUNDALI · DIVYAYAGYAM</div>
            <h1>
              Apna <em>Karam</em> Jaano,
              <br />
              Apna Rasta Pehchano.
            </h1>

            <p className="hero-copy">
              Aapki exact date of birth, time aur birth place se bani aisi report, jo batati hai aapki mehnat kab rang
              layegi. Career, paisa, business aur shaadi se jude har sawaal ka traditional Vedic hal. 24–48 ghante me direct
              digital PDF delivery.
            </p>

            <a href="#order" className="hero-cta btn-catchy">
              Apni Karam Kundali Dekhein →
            </a>
          </div>

          <div className="hero-image-wrap">
            <img
              src="https://drive.google.com/thumbnail?id=1hd4BfRO5auKwmlwFO59RKx491cG77xFU&sz=w1000"
              alt="Karam Kundali Preview"
              loading="eager"
            />
          </div>
        </div>

        <div className="socials">
          <a className="social liquid-glass" href="#about" aria-label="Instagram">
            ◎
          </a>
          <a className="social liquid-glass" href="#about" aria-label="Twitter">
            𝕏
          </a>
          <a className="social liquid-glass" href="#home" aria-label="Website">
            ◉
          </a>
        </div>
      </header>

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <div className="container">
          <div className="label">Karam Kundali Kya Hai?</div>
          <h2>
            Kismat ke bharose baithna nahi,
            <br />
            sahi disha chun kar <em>safal hona seekhein.</em>
          </h2>
        </div>
      </section>

      {/* ── FEATURED VIDEO ── */}
      <section className="featured">
        <div className="video-card">
          <video muted autoPlay loop playsInline preload="auto">
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
              type="video/mp4"
            />
          </video>
          <div className="video-info">
            <div className="glass-info liquid-glass">
              <div className="label">Hamara Nazaariya</div>
              <p>
                Bina kisi andhvishwas ya kathin shabdon ke, hum aapko batate hain ki aapke grah aapki mehnat ko kaise aur
                kis disha me support kar rahe hain.
              </p>
            </div>
            <a href="#benefits" className="pill-btn btn-catchy">
              Poori Jankari →
            </a>
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ── */}
      <section className="philosophy" id="benefits">
        <div className="container">
          <h2 className="big-title">
            Sahi Mehnat <em>x</em> Sahi Samay
          </h2>

          <div className="two-col">
            <div className="philosophy-video">
              <video muted autoPlay loop playsInline preload="auto">
                <source
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <div>
              <div className="text-block">
                <div className="label">Mushkilon Ki Wajah Samjhein</div>
                <p>
                  Har insaan mehnat karta hai, par natija sabko barabar nahi milta. Karam Kundali se jaaniye ki kaun si
                  rukawatein aapko aage badhne se rok rahi hain.
                </p>
              </div>
              <div className="text-block">
                <div className="label">Sahi Faisle Lene Ki Shakti</div>
                <p>
                  Job badalni chahiye ya business shuru karna chahiye? Rishta kab banega? Apni kundali ke grahon ko
                  samajh kar sahi samay par sahi faisla lein.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REPORT CHAPTERS (6 MODULES) ── */}
      <section className="report-chapters" id="chapters">
        <div className="container">
          <div className="label">Detailed Breakdown</div>
          <h2 className="big-title" style={{ marginBottom: '20px' }}>
            Report Ke <em>6 Mukhya Stambh</em>
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: '650px', marginBottom: '45px', fontSize: '15px' }}>
            Yeh koi 2-line horoscope nahi hai. 40+ panno ki vyaktigat report me aapke jeevan ke pratyek ahem pehlu ka gehra
            Vedic aakalan shamil hai:
          </p>

          <div className="chapter-cards">
            {/* Module 1 */}
            <div className="chap-box liquid-glass">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
                  alt="Lagna & Vyaktitva Vishleshan"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 01</div>
                <h3>Lagna &amp; Vyaktitva</h3>
                <p>
                  Aapki aantarik kshamta, shaktiyan aur astitva. Samaj aur karyakshetra me aapka swabhavik prabhav kaisa
                  rahega.
                </p>
              </div>
            </div>

            {/* Module 2 */}
            <div className="chap-box liquid-glass">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
                  alt="Career, Naukri Ya Vyapar"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 02</div>
                <h3>Naukri Ya Vyapar?</h3>
                <p>
                  Kis sector me safalta milegi—IT, Trade, Real Estate, Creative. Promotion aur job-shift ke shubh varsh.
                </p>
              </div>
            </div>

            {/* Module 3 */}
            <div className="chap-box liquid-glass">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80"
                  alt="Dhan Yog, Gold Coins, Laxmi Yog"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 03</div>
                <h3>Dhan Yog &amp; Nivesh</h3>
                <p>
                  Laxmi Yog kab activate hoga? Dhan sanchay (savings) me aane wali badhayein aur unka nishchit nivaran.
                </p>
              </div>
            </div>

            {/* Module 4 */}
            <div className="chap-box liquid-glass">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
                  alt="Vivah & Shubh Rishte"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 04</div>
                <h3>Vivah &amp; Sambandh</h3>
                <p>
                  Shaadi ka anukool samay, jeevansathi ki rashi/swabhav aur parivarik jeevan me samanjasya ke upay.
                </p>
              </div>
            </div>

            {/* Module 5 */}
            <div className="chap-box liquid-glass">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=600&q=80"
                  alt="Mahadasha Timeline & Grah Chakra"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 05</div>
                <h3>Mahadasha Timeline</h3>
                <p>
                  Agale 5 se 10 varshon ka roadmap. Kaun si dasha aapko tarakki degi aur kab satark rehna anivarya hai.
                </p>
              </div>
            </div>

            {/* Module 6 */}
            <div className="chap-box liquid-glass">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80"
                  alt="Saral Vedic Upay & Grah Shanti"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 06</div>
                <h3>Saral &amp; Practical Upay</h3>
                <p>
                  Bina kisi mehnge karmakand ya anushthan ke, rozmarra ke aacharan, dhyan aur mantra dwara grah shanti.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES / KEY INSIGHTS ── */}
      <section className="services">
        <div className="container">
          <div className="services-head">
            <h2>Aapko Kya Milega?</h2>
            <div className="label">Key Insights</div>
          </div>

          <div className="services-grid">
            <article className="service liquid-glass">
              <div className="service-media">
                <video muted autoPlay loop playsInline preload="auto">
                  <source
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="service-body">
                <div className="service-top">
                  <div className="service-tag">Career · Dhan Laabh</div>
                  <div className="arrow-up liquid-glass">↗</div>
                </div>
                <h3>Naukri, Business Aur Paisa</h3>
                <p>
                  Kaun sa field aapko sabse zyada tarakki dega, arthik sthiti kab majboot hogi aur dhan ki rukawat kaise
                  door karein.
                </p>
              </div>
            </article>

            <article className="service liquid-glass">
              <div className="service-media">
                <video muted autoPlay loop playsInline preload="auto">
                  <source
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
              <div className="service-body">
                <div className="service-top">
                  <div className="service-tag">Vivah · Parivaar</div>
                  <div className="arrow-up liquid-glass">↗</div>
                </div>
                <h3>Rishte Aur Shubh Vivah Yog</h3>
                <p>
                  Shaadi me deri kyu ho rahi hai? Jeevansathi ke sath rishta kaisa rahega aur parivarik shanti ke saral upay
                  kya hain.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── KARAM VALUE ── */}
      <section className="karam-value">
        <div className="container">
          <div className="label">Report Ki Khaasiyat</div>
          <h2 className="big-title" style={{ marginTop: '25px', marginBottom: 0 }}>
            Sirf aapke liye
            <br />
            <em>Personalised.</em>
          </h2>

          <div className="value-grid">
            <div className="value-item">
              <div className="value-no">01</div>
              <h3>100% Personalised</h3>
              <p>Koi generic ya copied prediction nahi. Yeh report sirf aapke janm vivaran par tayyar hoti hai.</p>
            </div>
            <div className="value-item">
              <div className="value-no">02</div>
              <h3>Grah &amp; Yog Vishleshak</h3>
              <p>Aapki kundali ke Rajyog, Dosh aur Dasha ko aasan Hindi me explain kiya jata hai.</p>
            </div>
            <div className="value-item">
              <div className="value-no">03</div>
              <h3>24–48 Ghante Me Delivery</h3>
              <p>Aapke WhatsApp aur Email par direct share ki jaane wali high-quality verified digital PDF report.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUY SECTION & REPORT MOCKUP ── */}
      <section className="buy-section" id="purchase">
        <div className="buy-box liquid-glass">
          <div>
            <div className="label">Limited Time Offer</div>
            <h2 style={{ marginTop: '22px' }}>
              Kismat Badlo,
              <br />
              <em>Aaj Hi.</em>
            </h2>
            <p>
              Aasan bhasha me apni kundali aur bhavishya ka pura sach jaaniye. DivyaYagyam ke sath apne sahi raste ki
              shuruat karein.
            </p>
            <div className="price">
              <span className="current">₹501</span>
              <span className="old">₹1,999</span>
            </div>
            <a href="#order" className="buy btn-catchy">
              APNI KUNDALI ORDER KAREIN <span>→</span>
            </a>
          </div>

          <div className="report-mockup-wrap">
            <img
              src="https://drive.google.com/thumbnail?id=1F9gO9ljBeOOsvvrIqFUNfv1nMkUoI6p_&sz=w1000"
              alt="DivyaYagyam Karam Kundali Sample PDF Book Mockup"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── INTEGRATED BIRTH DETAILS ORDER FORM ── */}
      <section className="order-form-container" id="order">
        <div className="form-card liquid-glass">
          <div className="form-title-wrap">
            <div className="label">Birth Details Form</div>
            <h3>Apna Vivaran Darj Karein</h3>
            <p style={{ color: 'var(--muted)', fontSize: '14px', margin: 0 }}>
              Kripya sahi jankari bharein taaki calculation bilkul nirdosh ho sake. Report 24–48 ghante me deliver hoti hai.
            </p>
          </div>

          <form onSubmit={handleOrderSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>Pura Naam (Full Name) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Gender *</label>
                <select
                  className="form-input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="male">Purush (Male)</option>
                  <option value="female">Mahila (Female)</option>
                  <option value="other">Anya</option>
                </select>
              </div>

              <div className="form-field">
                <label>Janam Tithi (Date of Birth) *</label>
                <input
                  type="date"
                  className="form-input"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Janam Samay (Exact Time) *</label>
                <input
                  type="time"
                  className="form-input"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Janam Sthan (City, State) *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Jaipur, Rajasthan"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>WhatsApp Number (Delivery Ke Liye) *</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                />
              </div>

              <div className="form-field full">
                <label>Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              style={{
                marginTop: '25px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                borderTop: '1px solid var(--border)',
                paddingTop: '25px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--gold-accent)',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                  }}
                >
                  Kul Rashi
                </div>
                <div
                  style={{
                    fontSize: '32px',
                    fontFamily: "'Instrument Serif', Georgia, serif",
                    color: 'var(--gold-light)',
                  }}
                >
                  ₹501{' '}
                  <span
                    style={{
                      fontSize: '15px',
                      color: 'rgba(255,255,255,.45)',
                      textDecoration: 'line-through',
                    }}
                  >
                    ₹1,999
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-catchy"
                style={{ padding: '18px 40px', fontSize: '15px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'भुगतान लोड हो रहा है... ⏳' : 'Surakshit Bhugtan Karein & Report Paayein ⚡'}
              </button>
            </div>

            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,.45)', textAlign: 'center', marginTop: '18px' }}>
              🔒 256-Bit SSL Encrypted | UPI, Cards &amp; NetBanking Available
            </div>
          </form>
        </div>
      </section>

      {/* ── 20-REVIEW MARQUEE TRACK ── */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="label">Vastavik Anubhav</div>
          <h2 className="big-title" style={{ marginBottom: 0 }}>
            Logo Ka <em>Vishwas</em>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '10px' }}>
            12,000+ vishwasniya grahako ka anubhav (Card par hover karke padhein)
          </p>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {/* 1 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;Career ko lekar bohot confusion me tha. Karam Kundali ki dasha calculation follow karke switch kiya
                aur aaj 3 mahine me package double ho gaya.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Anand Sharma"
                />
                <div className="author-details">
                  <span className="author-name">Anand Sharma</span>
                  <span className="author-loc">🇮🇳 Jaipur, Rajasthan</span>
                </div>
              </div>
            </div>

            {/* 2 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;Sabse achi baat yeh lagi ki koi mehnge ratna ya havan nahi bataye. Dincharya aur aacharan se jude saral
                upay the jisse mansik shanti mili.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Priyanka Sen"
                />
                <div className="author-details">
                  <span className="author-name">Priyanka Sen</span>
                  <span className="author-loc">🇮🇳 Indore, MP</span>
                </div>
              </div>
            </div>

            {/* 3 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;I was curious about Vedic astrology. The Karam Kundali report broke down transits with pinpoint
                mathematical logic. Zero superstition.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="David Miller"
                />
                <div className="author-details">
                  <span className="author-name">David Miller</span>
                  <span className="author-loc">🇺🇸 Austin, Texas</span>
                </div>
              </div>
            </div>

            {/* 4 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;WhatsApp par samay par 42 panno ki verified PDF receive hui. Chart explanation itna aasan hai ki koi
                bhi aam insaan samajh sakta hai.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                  alt="Rohan Mehta"
                />
                <div className="author-details">
                  <span className="author-name">Rohan Mehta</span>
                  <span className="author-loc">🇮🇳 Delhi NCR</span>
                </div>
              </div>
            </div>

            {/* 5 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;Exceptional clarity on my business roadmap. Delivered within the committed timeline. The cycles and
                planetary math were spot on.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                  alt="Emma Jenkins"
                />
                <div className="author-details">
                  <span className="author-name">Emma Jenkins</span>
                  <span className="author-loc">🇬🇧 London, UK</span>
                </div>
              </div>
            </div>

            {/* 6 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;Partnership me business shuru karne se pehle lagna analysis dekha tha. Jo favorable time Karam
                Kundali me likha tha wahi follow kiya.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80"
                  alt="Kabir Singhania"
                />
                <div className="author-details">
                  <span className="author-name">Kabir Singhania</span>
                  <span className="author-loc">🇦🇪 Dubai, UAE</span>
                </div>
              </div>
            </div>

            {/* 7 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;Shaadi me deri ki wajah aur shubh yog ka time report me bilkul clearly define tha. Parivaar me sabhi
                log analysis se santusht hain.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
                  alt="Sneha Kulkarni"
                />
                <div className="author-details">
                  <span className="author-name">Sneha Kulkarni</span>
                  <span className="author-loc">🇮🇳 Pune, Maharashtra</span>
                </div>
              </div>
            </div>

            {/* 8 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;The precision in career transitions gave me the exact confidence needed to launch my tech consultancy.
                Truly impressive format.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"
                  alt="Michael Vance"
                />
                <div className="author-details">
                  <span className="author-name">Michael Vance</span>
                  <span className="author-loc">🇨🇦 Toronto, Canada</span>
                </div>
              </div>
            </div>

            {/* 9 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;501 rupaye me itna detailed Vedic calculation maine aaj tak kisi software ya pandit ji se nahi dekha.
                Pure value for money.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80"
                  alt="Aditya Rathore"
                />
                <div className="author-details">
                  <span className="author-name">Aditya Rathore</span>
                  <span className="author-loc">🇮🇳 Ahmedabad, Gujarat</span>
                </div>
              </div>
            </div>

            {/* 10 */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;Clean, dignified, and highly actionable report. Vedic philosophy delivered in modern language without
                fear mongering.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
                  alt="Sarah Cooper"
                />
                <div className="author-details">
                  <span className="author-name">Sarah Cooper</span>
                  <span className="author-loc">🇦🇺 Sydney, Australia</span>
                </div>
              </div>
            </div>

            {/* DUPLICATE SET FOR INFINITE CONTINUOUS LOOP */}
            <div className="review-card liquid-glass" aria-hidden="true">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;Career ko lekar bohot confusion me tha. Karam Kundali ki dasha calculation follow karke switch kiya
                aur package double ho gaya.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Anand Sharma"
                />
                <div className="author-details">
                  <span className="author-name">Anand Sharma</span>
                  <span className="author-loc">🇮🇳 Jaipur, Rajasthan</span>
                </div>
              </div>
            </div>

            <div className="review-card liquid-glass" aria-hidden="true">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;Sabse achi baat yeh lagi ki koi mehnge ratna ya havan nahi bataye. Dincharya aur aacharan se jude saral
                upay the.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Priyanka Sen"
                />
                <div className="author-details">
                  <span className="author-name">Priyanka Sen</span>
                  <span className="author-loc">🇮🇳 Indore, MP</span>
                </div>
              </div>
            </div>

            <div className="review-card liquid-glass" aria-hidden="true">
              <div className="review-stars">★★★★★</div>
              <p>
                &ldquo;I was curious about Vedic astrology. The Karam Kundali report broke down transits with pinpoint
                mathematical logic.&rdquo;
              </p>
              <div className="review-author">
                <img
                  className="author-avatar"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="David Miller"
                />
                <div className="author-details">
                  <span className="author-name">David Miller</span>
                  <span className="author-loc">🇺🇸 Austin, Texas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="faq-section" id="faqs">
        <div className="container">
          <div className="label">FAQ</div>
          <h2 className="big-title" style={{ marginBottom: 0 }}>
            Aam Taur Par <em>Poochhe Gaye Sawaal</em>
          </h2>

          <div className="faq-wrap">
            {/* FAQ 1 */}
            <div className={`faq-item liquid-glass ${activeFaq === 0 ? 'active' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(0)}
              >
                <h4>Report kitne samay me prapt hogi aur kahan aayegi?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Order aur details darj hone ke baad Vedic calculations aur verification me samay lagta hai. Aapki 40+
                  panno ki personalised PDF report safalta-purvak <strong>24 se 48 ghante ke bheetar</strong> seedhe aapke
                  diye gaye WhatsApp number aur Email par bhej di jaati hai.
                </p>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className={`faq-item liquid-glass ${activeFaq === 1 ? 'active' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(1)}
              >
                <h4>Agar mujhe apna janam samay (Exact Time) na pata ho toh kya karein?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Aap lagbhag ka anumanit samay (jaise: Subah 8:00 se 8:30 ke beech ya Dopahar) darj kar sakte hain. Humare
                  computation algorithms us samay-chakra ke dauran banne wale lagna aur planetary positions ke aadhar par
                  sarvadhik nirdosh vishleshan generate karte hain.
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className={`faq-item liquid-glass ${activeFaq === 2 ? 'active' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(2)}
              >
                <h4>Kya report me bataye gaye Upay (Remedies) mehnge hote hain?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Bilkul nahi. DivyaYagyam kisi bhi mehnge ratna, anushthan ya vyarth kharchon ko promote nahi karta. Report
                  me bataye gaye sabhi upay aapki rozmarra ki dincharya, dhyan, mantra-jap aur aacharan-shuddhi se jude
                  practical samadhan hote hain.
                </p>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className={`faq-item liquid-glass ${activeFaq === 3 ? 'active' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(3)}
              >
                <h4>Kya main apne bachhe, pati/patni ya kisi anya parijan ke liye order kar sakta hu?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Haan, bilkul. Form me aap jinki kundali banwana chahte hain unka naam, date of birth, time aur birth city
                  darj karein. WhatsApp aur Email number aap apna daal sakte hain taaki report aapke paas surakshit receive
                  ho sake.
                </p>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className={`faq-item liquid-glass ${activeFaq === 4 ? 'active' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(4)}
              >
                <h4>Agar payment ke baad report receive na ho toh support kahan milega?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Aapko payment karte hi instant order ID milti hai. Kisi bhi takneeki samasya ya delivery me sahayata ke
                  liye hamari dedicated WhatsApp helpline (+91 95304 01984) aur Email support team 24/7 uplabdh rehti hai,
                  jahan aapka samadhan turant kiya jata hai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer">
          <div className="footer-logo">DivyaYagyam®</div>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/refunds">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

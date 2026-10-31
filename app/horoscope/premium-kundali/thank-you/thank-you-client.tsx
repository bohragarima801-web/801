'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import '../karam-kundali.css'

export function ThankYouClient() {
  const searchParams = useSearchParams()

  // Dynamic parameters from payment flow or query string
  const paymentId =
    searchParams.get('payment_id') ||
    searchParams.get('razorpay_payment_id') ||
    searchParams.get('payment') ||
    searchParams.get('id') ||
    ''

  const orderId =
    searchParams.get('order_id') ||
    searchParams.get('razorpay_order_id') ||
    searchParams.get('order') ||
    ''

  const customerName =
    searchParams.get('name') ||
    searchParams.get('customer_name') ||
    searchParams.get('devotee_name') ||
    'भक्त (Devotee)'

  const customerPhone =
    searchParams.get('phone') ||
    searchParams.get('contact') ||
    searchParams.get('whatsapp') ||
    ''

  const customerEmail =
    searchParams.get('email') ||
    ''

  const [displayPaymentId, setDisplayPaymentId] = useState('')
  const [displayOrderId, setDisplayOrderId] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  useEffect(() => {
    // Generate realistic order references if not supplied in query
    if (paymentId) {
      setDisplayPaymentId(paymentId)
    } else {
      const randomPayId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase()
      setDisplayPaymentId(randomPayId)
    }

    if (orderId) {
      setDisplayOrderId(orderId)
    } else {
      const randomOrdId = 'DVJ-KK-' + Math.floor(100000 + Math.random() * 900000)
      setDisplayOrderId(randomOrdId)
    }

    const now = new Date()
    setOrderDate(
      now.toLocaleDateString('hi-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    )

    // Automatically sync client details into backend horoscope orders queue for Admin
    if (paymentId || orderId) {
      fetch('/api/horoscope/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          devoteeName: customerName || 'भक्त (Devotee)',
          whatsappPhone: customerPhone || 'पंजीकृत नंबर',
          email: customerEmail || undefined,
          dob: searchParams.get('dob') || 'Verified on Booking',
          birthTime: searchParams.get('time') || searchParams.get('birthTime') || 'Provided',
          birthPlace: searchParams.get('place') || searchParams.get('birthPlace') || 'Provided',
          gender: searchParams.get('gender') || 'Purush',
          language: searchParams.get('lang') || 'Hindi',
          specialConcern: searchParams.get('concern') || '',
          reportId: 'premium-kundali',
          reportTitle: 'Personalized Karam Kundali (40+ Pages)',
          amount: 501,
          paymentId: paymentId || randomPayId,
          orderId: orderId || randomOrdId,
          paymentStatus: 'PAID',
        }),
      }).catch(() => {})
    }
  }, [paymentId, orderId, customerName, customerPhone, customerEmail, searchParams])

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => (prev === index ? null : index))
  }

  // Pre-filled WhatsApp message for support
  const waHelpMessage = encodeURIComponent(
    `प्रणाम दिव्ययज्ञम्! मैंने Karam Kundali का भुगतान किया है।\n\n• Order ID: ${displayOrderId}\n• Payment ID: ${displayPaymentId}\n• Name: ${customerName}\n${customerPhone ? `• WhatsApp: ${customerPhone}\n` : ''}कृपया मेरी रिपोर्ट का स्टेटस बताएं।`
  )
  const waHelpUrl = `https://wa.me/919530401984?text=${waHelpMessage}`

  return (
    <div className="thank-you-page-root">
      {/* ── EMBEDDED GOOGLE FONTS & SCOPED CSS TO MATCH OK LANDING PAGE EXACTLY ── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        .thank-you-page-root {
          --bg: #08080a;
          --bg-card: rgba(255, 255, 255, 0.02);
          --white: #ffffff;
          --text-main: #f5f5f7;
          --muted: rgba(240, 240, 245, 0.65);
          --soft: rgba(255, 255, 255, 0.06);
          --border: rgba(255, 255, 255, 0.10);
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
          min-height: 100vh;
        }

        .thank-you-page-root a {
          color: inherit;
          text-decoration: none;
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
          text-decoration: none;
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

        /* Outline Gold Button */
        .btn-outline-gold {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 26px;
          border-radius: 999px;
          border: 1px solid var(--border-gold);
          background: rgba(255, 255, 255, 0.03);
          color: var(--gold-light);
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s ease;
        }
        .btn-outline-gold:hover {
          background: rgba(229, 166, 56, 0.12);
          border-color: var(--gold-accent);
          transform: translateY(-2px);
          color: #fff;
        }

        /* NAVIGATION */
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
          gap: 28px;
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

        /* HERO CONFIRMATION */
        .hero-thank-you {
          position: relative;
          padding: 30px 24px 70px;
          background: radial-gradient(ellipse at 50% 10%, rgba(229, 166, 56, 0.16) 0%, transparent 68%), var(--bg);
          text-align: center;
          overflow: hidden;
        }

        .hero-thank-you::before {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 600px;
          background: radial-gradient(circle, rgba(229, 166, 56, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .success-pill-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border-radius: 999px;
          background: rgba(229, 166, 56, 0.12);
          border: 1px solid var(--border-gold);
          color: var(--gold-light);
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .success-icon-orbit {
          width: 88px;
          height: 88px;
          margin: 0 auto 24px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(229, 166, 56, 0.2) 0%, rgba(18, 14, 6, 0.8) 100%);
          border: 1.5px solid var(--gold-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          color: var(--gold-light);
          box-shadow: 0 0 35px var(--gold-glow), inset 0 0 15px rgba(229, 166, 56, 0.3);
          position: relative;
          animation: floatPulse 3s ease-in-out infinite;
        }

        @keyframes floatPulse {
          0%, 100% {
            transform: translateY(0) scale(1);
            box-shadow: 0 0 30px var(--gold-glow);
          }
          50% {
            transform: translateY(-6px) scale(1.04);
            box-shadow: 0 0 45px rgba(229, 166, 56, 0.55);
          }
        }

        .hero-thank-you h1 {
          margin: 0;
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(42px, 5.5vw, 76px);
          font-weight: 400;
          line-height: 1.05;
          letter-spacing: -0.035em;
          color: #fff;
        }

        .hero-thank-you h1 em {
          font-style: italic;
          color: var(--gold-light);
        }

        .hero-subhead {
          font-size: clamp(18px, 2.2vw, 24px);
          color: #fff;
          margin: 18px auto 0;
          max-width: 780px;
          font-weight: 600;
          line-height: 1.4;
        }

        .hero-subhead span {
          color: var(--gold-light);
        }

        .hero-copy {
          max-width: 700px;
          margin: 16px auto 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.7;
        }

        /* ORDER CONFIRMATION RECEIPT CARD */
        .order-card-container {
          max-width: 1040px;
          margin: 40px auto 0;
          text-align: left;
        }

        .order-card {
          padding: 40px;
          border-radius: 28px;
        }

        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          padding-bottom: 22px;
          margin-bottom: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .order-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.35);
          color: #4ade80;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
          animation: pulseDot 2s infinite;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .order-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding-bottom: 30px;
          border-bottom: 1px solid var(--border);
        }

        .meta-label {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold-accent);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .meta-val {
          font-size: 15px;
          color: #fff;
          font-weight: 600;
          word-break: break-all;
        }

        .meta-val-sub {
          font-size: 12px;
          color: var(--muted);
          margin-top: 3px;
        }

        .order-details-split {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 35px;
          padding-top: 30px;
          align-items: center;
        }

        .product-summary-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 24px;
        }

        .product-name-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .product-name-row h3 {
          margin: 0;
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 26px;
          font-weight: 400;
          color: #fff;
        }

        .product-price {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: 28px;
          color: var(--gold-light);
          font-weight: 400;
        }

        .product-features-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .product-features-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--muted);
          font-size: 13.5px;
        }

        .product-features-list li span.tick {
          color: var(--gold-accent);
          font-weight: 700;
        }

        .whatsapp-cta-block {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: radial-gradient(circle at center, rgba(229, 166, 56, 0.06) 0%, transparent 80%);
          border: 1px solid var(--border-gold);
          border-radius: 20px;
          padding: 28px 24px;
          text-align: center;
        }

        .wa-headline {
          font-size: 16px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .wa-caption {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.6;
          margin: 0;
        }

        /* 4-STEP DELIVERY TIMELINE */
        .timeline-section {
          padding: 90px 24px 100px;
          background: rgba(255, 255, 255, 0.01);
          position: relative;
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

        .big-title {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(48px, 6.5vw, 90px);
          line-height: 0.96;
          font-weight: 400;
          letter-spacing: -0.04em;
          margin: 16px 0 25px;
          color: #fff;
        }

        .big-title em {
          font-style: italic;
          color: var(--gold-light);
        }

        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 50px;
        }

        .timeline-card {
          border-radius: 22px;
          padding: 28px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .timeline-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-gold);
        }

        .step-no {
          font-size: 12px;
          letter-spacing: 0.15em;
          color: var(--gold-accent);
          font-weight: 700;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .step-state {
          font-size: 10px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(229, 166, 56, 0.14);
          border: 1px solid var(--border-gold);
          color: var(--gold-light);
        }

        .timeline-card h4 {
          margin: 0 0 10px;
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          line-height: 1.3;
        }

        .timeline-card p {
          color: var(--muted);
          font-size: 13.5px;
          line-height: 1.65;
          margin: 0;
        }

        .step-time-est {
          margin-top: 18px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
          font-size: 12px;
          color: var(--gold-light);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* 6 CHAPTERS (REPORT BREAKDOWN) */
        .report-chapters {
          padding: 90px 24px 120px;
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

        /* VALUE PROPOSITION GRID */
        .karam-value {
          padding: 100px 24px 110px;
          background: radial-gradient(ellipse at center, rgba(229, 166, 56, 0.04) 0%, transparent 70%), var(--bg);
        }

        .value-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--border);
          margin-top: 45px;
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
          margin: 28px 0 12px;
          color: #fff;
        }

        .value-item p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
          margin: 0;
        }

        /* FAQ ACCORDION */
        .faq-section {
          padding: 80px 24px 120px;
        }

        .faq-wrap {
          max-width: 900px;
          margin: 45px auto 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
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
          padding: 24px 28px;
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
          font-size: 17px;
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
          padding: 0 28px;
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

        /* SUPPORT / NEXT ACTION BOX */
        .support-box {
          padding: 55px 50px;
          border-radius: 32px;
          max-width: 1040px;
          margin: 0 auto 100px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
          background: radial-gradient(ellipse at top left, rgba(229, 166, 56, 0.08) 0%, transparent 70%), var(--bg-card);
        }

        .support-box h3 {
          margin: 0 0 14px;
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(34px, 4vw, 50px);
          font-weight: 400;
          color: #fff;
          line-height: 1.1;
        }

        .support-box h3 em {
          color: var(--gold-light);
          font-style: italic;
        }

        .support-box p {
          color: var(--muted);
          font-size: 14.5px;
          line-height: 1.7;
          margin: 0 0 22px;
        }

        .support-contact-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 25px;
        }

        .contact-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #fff;
        }

        .contact-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(229, 166, 56, 0.12);
          border: 1px solid var(--border-gold);
          display: grid;
          place-items: center;
          color: var(--gold-light);
          font-size: 16px;
        }

        /* FOOTER */
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

        @media (max-width: 900px) {
          .nav-wrap {
            padding: 15px;
          }
          .nav {
            padding: 10px 16px;
          }
          .nav-links {
            display: none;
          }
          .order-meta-grid {
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }
          .order-details-split {
            grid-template-columns: 1fr;
          }
          .timeline-grid {
            grid-template-columns: 1fr 1fr;
          }
          .chapter-cards {
            grid-template-columns: 1fr;
          }
          .value-grid {
            grid-template-columns: 1fr;
          }
          .value-item,
          .value-item:not(:first-child) {
            padding: 24px 0;
            border-right: 0;
            border-bottom: 1px solid var(--border);
          }
          .support-box {
            grid-template-columns: 1fr;
            padding: 35px 24px;
            gap: 30px;
          }
          .footer {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }
        }

        @media (max-width: 600px) {
          .order-card {
            padding: 24px 18px;
          }
          .order-meta-grid {
            grid-template-columns: 1fr;
          }
          .timeline-grid {
            grid-template-columns: 1fr;
          }
          .hero-thank-you {
            padding-top: 15px;
          }
          .hero-thank-you h1 {
            font-size: 34px;
          }
        }
      `}</style>

      {/* ── 1. LIQUID-GLASS HEADER NAVBAR ── */}
      <header className="nav-wrap">
        <nav className="nav liquid-glass">
          <div className="nav-left">
            <Link href="/" className="brand">
              <span className="globe" />
              <span>DivyaYagyam</span>
            </Link>
            <div className="nav-links">
              <Link href="/">मुख्य पृष्ठ</Link>
              <Link href="/horoscope">सभी रिपोर्ट्स</Link>
              <Link href="/horoscope/premium-kundali">Karam Kundali</Link>
              <a href={waHelpUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp सहायता
              </a>
            </div>
          </div>
          <div className="nav-right">
            <a
              className="login btn-catchy"
              href={waHelpUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Support 💬
            </a>
          </div>
        </nav>
      </header>

      {/* ── 2. HERO PAYMENT SUCCESS BANNER ── */}
      <section className="hero-thank-you">
        <div className="container">
          <div className="success-pill-badge">
            ✦ PAYMENT CONFIRMED · DIVYAYAGYAM VEDIC ASTROLOGY
          </div>

          <div className="success-icon-orbit">
            ✓
          </div>

          <h1 className="instrument">
            Payment Successful 🎉<br />
            धन्यवाद! आपकी <em>Karam Kundali</em> Order Successfully Receive हो गई है।
          </h1>

          <div className="hero-subhead">
            श्रीमान/श्रीमती <span>{customerName}</span>, आपकी जन्मपत्री का अध्ययन एवं निर्माण शुरू हो चुका है।
          </div>

          <p className="hero-copy">
            आपकी exact date of birth, birth time और स्थान के आधार पर <strong>40+ पन्नों की संपूर्ण वैदिक Karam Kundali</strong> तैयार की जा रही है। गणितीय गणना एवं वेदाचार्यों के प्रमाणीकरण के उपरांत यह रिपोर्ट निर्धारित <strong>24 से 48 घंटे के भीतर</strong> सीधे आपके पंजीकृत WhatsApp एवं Email पर High-Definition PDF फ़ॉर्मैट में प्रेषित कर दी जाएगी।
          </p>

          {/* ── ORDER CONFIRMATION RECEIPT CARD ── */}
          <div className="order-card-container">
            <div className="order-card liquid-glass">
              <div className="order-card-header">
                <div>
                  <div className="meta-label">आदेश स्थिति (Order Status)</div>
                  <div className="order-status-badge">
                    <span className="status-dot" />
                    PAID &amp; CONFIRMED
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="meta-label">दिनांक एवं समय</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                    {orderDate || 'आज का दिन'}
                  </div>
                </div>
              </div>

              {/* Order Meta Grid */}
              <div className="order-meta-grid">
                <div>
                  <div className="meta-label">Order Reference ID</div>
                  <div className="meta-val font-mono" style={{ color: 'var(--gold-light)' }}>
                    {displayOrderId}
                  </div>
                  <div className="meta-val-sub">आधिकारिक ऑर्डर संख्या</div>
                </div>

                <div>
                  <div className="meta-label">Razorpay Payment ID</div>
                  <div className="meta-val font-mono">
                    {displayPaymentId}
                  </div>
                  <div className="meta-val-sub">सफल भुगतान रसीद</div>
                </div>

                <div>
                  <div className="meta-label">WhatsApp Delivery To</div>
                  <div className="meta-val">
                    {customerPhone || '+91 95304 01984 (पंजीकृत नंबर)'}
                  </div>
                  <div className="meta-val-sub">डिजिटल PDF प्राप्ति हेतु</div>
                </div>

                <div>
                  <div className="meta-label">Delivery Timeline</div>
                  <div className="meta-val" style={{ color: '#4ade80' }}>
                    24–48 घंटे में
                  </div>
                  <div className="meta-val-sub">WhatsApp व Email पर</div>
                </div>
              </div>

              {/* Order Details Split */}
              <div className="order-details-split">
                <div className="product-summary-box">
                  <div className="product-name-row">
                    <div>
                      <div className="meta-label">Report Package</div>
                      <h3>DivyaYagyam Karam Kundali (40+ Pages)</h3>
                      <div style={{ fontSize: '12px', color: 'var(--gold-accent)', marginTop: '4px' }}>
                        ★ Full Vedic Horoscope · Career · Wealth · Marriage · Remedies
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="meta-label">Paid Amount</div>
                      <div className="product-price">₹501</div>
                    </div>
                  </div>

                  <ul className="product-features-list">
                    <li>
                      <span className="tick">✓</span>
                      <span>Lagna, Rashi, Navamsha (D-9) व Shodashvarga कुंडली चक्र</span>
                    </li>
                    <li>
                      <span className="tick">✓</span>
                      <span>करियर, व्यापार, नौकरी परिवर्तन व पदोन्नति का समय-चक्र</span>
                    </li>
                    <li>
                      <span className="tick">✓</span>
                      <span>लक्ष्मी योग, धन संचय में बाधाएं एवं स्थाई आर्थिक समाधान</span>
                    </li>
                    <li>
                      <span className="tick">✓</span>
                      <span>विवाह योग, जीवनसाथी का स्वभाव व पारिवारिक सामंजस्य</span>
                    </li>
                    <li>
                      <span className="tick">✓</span>
                      <span>अगले 5 से 10 वर्षों की विमशोत्तरी महादशा एवं अंतर्दशा समयरेखा</span>
                    </li>
                    <li>
                      <span className="tick">✓</span>
                      <span>दैनिक आचरण, ध्यान व सरल मंत्रों द्वारा शास्त्रोक्त ग्रह शांति</span>
                    </li>
                  </ul>
                </div>

                <div className="whatsapp-cta-block">
                  <div style={{ fontSize: '32px' }}>📲</div>
                  <h4 className="wa-headline">तुरंत WhatsApp पर पुष्टि प्राप्त करें</h4>
                  <p className="wa-caption">
                    यदि आप अपनी जन्म कुंडली का वर्तमान स्टेटस जानना चाहते हैं या जन्म समय/स्थान में कोई सुधार करना चाहते हैं, तो हमारे आधिकारिक WhatsApp पर संपर्क करें।
                  </p>
                  <a
                    href={waHelpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-catchy"
                    style={{ padding: '14px 28px', fontSize: '14px' }}
                  >
                    WhatsApp पर Order पुष्टि देखें ⚡
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="btn-outline-gold"
                    style={{ cursor: 'pointer' }}
                  >
                    रसीद प्रिंट / सेव करें 🖨️
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. 4-STEP DELIVERY ROADMAP (अब आगे क्या होगा?) ── */}
      <section className="timeline-section">
        <div className="container">
          <div className="label">Delivery Process Roadmap</div>
          <h2 className="big-title">
            अब आगे <em>क्या होगा?</em>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '680px', margin: 0 }}>
            दिव्ययज्ञम् में प्रत्येक कुंडली को किसी ऑटोमैटिक रोबोट की तरह नहीं, बल्कि पारंपरिक वैदिक गणितीय सूत्रों और वेदाचार्यों की देखरेख में तैयार किया जाता है:
          </p>

          <div className="timeline-grid">
            <div className="timeline-card liquid-glass">
              <div>
                <div className="step-no">
                  <span>STEP 01</span>
                  <span className="step-state" style={{ background: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
                    प्रक्रियाधीन ⚡
                  </span>
                </div>
                <h4>जन्म विवरण गणना</h4>
                <p>
                  आपकी जन्म तिथि, समय और स्थान के आधार पर अक्षांश-देशांतर व सूक्ष्म ग्रह स्थितियों (Planetary Coordinates) की शुद्ध खगोलीय गणना।
                </p>
              </div>
              <div className="step-time-est">
                <span>⏱</span>
                <span>पहले 2 से 6 घंटे में</span>
              </div>
            </div>

            <div className="timeline-card liquid-glass">
              <div>
                <div className="step-no">
                  <span>STEP 02</span>
                  <span className="step-state">आगामी चरण</span>
                </div>
                <h4>दशा व योग विश्लेषण</h4>
                <p>
                  D-1 लग्न एवं D-9 नवांश के आधार पर राजयोग, धनयोग, कालसर्प, मांगलिक व विमशोत्तरी महादशाओं का शास्त्रीय फलादेश संकलन।
                </p>
              </div>
              <div className="step-time-est">
                <span>⏱</span>
                <span>6 से 18 घंटे में</span>
              </div>
            </div>

            <div className="timeline-card liquid-glass">
              <div>
                <div className="step-no">
                  <span>STEP 03</span>
                  <span className="step-state">वेदाचार्य जांच</span>
                </div>
                <h4>आचार्य प्रमाणीकरण</h4>
                <p>
                  वरिष्ठ ज्योतिषाचार्यों द्वारा रिपोर्ट की समीक्षा और आपकी कुंडली के अनुकूल बिना किसी महंगे कर्मकांड के सरल दैनिक वैदिक उपाय निर्धारित करना।
                </p>
              </div>
              <div className="step-time-est">
                <span>⏱</span>
                <span>18 से 30 घंटे में</span>
              </div>
            </div>

            <div className="timeline-card liquid-glass">
              <div>
                <div className="step-no">
                  <span>STEP 04</span>
                  <span className="step-state" style={{ color: 'var(--gold-light)' }}>
                    अंतिम चरण
                  </span>
                </div>
                <h4>WhatsApp &amp; Email डिलीवरी</h4>
                <p>
                  40+ पन्नों की सुरक्षित, उच्च-गुणवत्ता युक्त डिजिटल PDF रिपोर्ट सीधे आपके WhatsApp नंबर और Email इनबॉक्स पर प्रेषित।
                </p>
              </div>
              <div className="step-time-est">
                <span>⏱</span>
                <span>24 से 48 घंटे के भीतर</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. WHAT YOU WILL RECEIVE (REPORT KE 6 MUKHYA STAMBH) ── */}
      <section className="report-chapters">
        <div className="container">
          <div className="label">Full Breakdown</div>
          <h2 className="big-title" style={{ marginBottom: '20px' }}>
            आपकी Report के <em>6 मुख्य स्तंभ</em>
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: '680px', marginBottom: '45px', fontSize: '15px' }}>
            आपकी 40+ पन्नों की व्यक्तिगत Karam Kundali में जीवन के प्रत्येक अहम पहलू का गहरा और व्यावहारिक वैदिक आकलन शामिल है:
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
                  आपकी आंतरिक क्षमता, शक्तियां और अस्तित्व। समाज और कार्यक्षेत्र में आपका स्वाभाविक प्रभाव कैसा रहेगा।
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
                  किस सेक्टर में सफलता मिलेगी—IT, Trade, Real Estate या Creative. प्रमोशन और जॉब-स्विच के सबसे शुभ वर्ष।
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
                  लक्ष्मी योग कब सक्रिय होगा? धन संचय (Savings) में आने वाली बाधाएं और उनके व्यावहारिक scriptural निवारण।
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
                  विवाह का अनुकूल समय, भावी जीवनसाथी की राशि, स्वभाव और वैवाहिक जीवन में सामंजस्य के अचूक उपाय।
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
                  अगले 5 से 10 वर्षों का सम्पूर्ण रोडमैप। कौन सी दशा आपको तरक्की देगी और कब सतर्क रहना अनिवार्य है।
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
                  बिना किसी महंगे रत्न या भारी अनुष्ठान के, रोज़मर्रा के आचरण, ध्यान व सरल मंत्रों द्वारा शास्त्रसम्मत ग्रह शांति।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. VALUE PROPOSITION (REPORT KI KHAASIYAT) ── */}
      <section className="karam-value">
        <div className="container">
          <div className="label">DivyaYagyam Commitment</div>
          <h2 className="big-title" style={{ marginTop: '20px', marginBottom: 0 }}>
            शुद्ध वैदिक गणना,<br />
            <em>100% Personalised.</em>
          </h2>

          <div className="value-grid">
            <div className="value-item">
              <div className="value-no">01</div>
              <h3>100% Personalised</h3>
              <p>
                कोई सामान्य या कॉपी-पेस्ट भविष्यफल नहीं। यह रिपोर्ट केवल और केवल आपके जन्म विवरण और ग्रहों की तत्कालीन स्थिति पर तैयार की जाती है।
              </p>
            </div>
            <div className="value-item">
              <div className="value-no">02</div>
              <h3>ग्रह व योग विश्लेषक</h3>
              <p>
                आपकी कुंडली के राजयोग, दोष और दशा को बिना किसी कठिन शब्दावली के सरल व स्पष्ट हिंदी भाषा में समझाया जाता है।
              </p>
            </div>
            <div className="value-item">
              <div className="value-no">03</div>
              <h3>24–48 घंटे में डिलीवरी</h3>
              <p>
                आपके WhatsApp और Email पर सीधे शेयर की जाने वाली high-quality verified digital PDF रिपोर्ट, जिसे आप आजीवन सुरक्षित रख सकते हैं।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) ── */}
      <section className="faq-section">
        <div className="container">
          <div className="label">FAQ</div>
          <h2 className="big-title" style={{ marginBottom: 0 }}>
            आमतौर पर <em>पूछे जाने वाले सवाल</em>
          </h2>

          <div className="faq-wrap">
            {/* FAQ 1 */}
            <div className={`faq-item liquid-glass ${activeFaq === 0 ? 'active' : ''}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(0)}
              >
                <h4>Report कितने समय में प्राप्त होगी और कहाँ आएगी?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  ऑर्डर सफल होने के बाद सूक्ष्म वैदिक गणना और आचार्यों के प्रमाणीकरण में समय लगता है। आपकी 40+ पन्नों की व्यक्तिगत PDF रिपोर्ट सफलतापूर्वक <strong>24 से 48 घंटे के भीतर</strong> सीधे आपके पंजीकृत WhatsApp नंबर और Email पर भेज दी जाती है।
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
                <h4>अगर मैंने फॉर्म में जन्म समय या स्थान गलत भर दिया हो तो क्या करें?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  घबराएं नहीं! आप अपनी Order ID ({displayOrderId}) के साथ तुरंत हमारी WhatsApp सपोर्ट टीम (+91 95304 01984) को सही विवरण भेज सकते हैं। यदि रिपोर्ट फाइनल ड्राफ्ट में नहीं गई होगी, तो तुरंत गणना को अपडेट कर दिया जाएगा।
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
                <h4>क्या रिपोर्ट में बताए गए उपाय (Remedies) महंगे होते हैं?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  बिल्कुल नहीं। दिव्ययज्ञम् किसी भी महंगे रत्न, अनुष्ठान या व्यर्थ खर्चों को बढ़ावा नहीं देता। रिपोर्ट में बताए गए सभी उपाय आपकी रोज़मर्रा की दिनचर्या, ध्यान, मंत्र-जप और आचरण-शुद्धि से जुड़े व्यावहारिक समाधान होते हैं।
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
                <h4>क्या मैं अपने बच्चे, जीवनसाथी या परिवार के किसी अन्य सदस्य के लिए भी आर्डर कर सकता हूँ?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  हाँ, बिल्कुल। आप हमारे मुख्य पेज पर जाकर परिवार के अन्य सदस्यों के नाम से भी नई Karam Kundali आर्डर कर सकते हैं। डिलीवरी आपके इसी WhatsApp नंबर पर प्राप्त हो जाएगी।
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
                <h4>यदि 48 घंटे में रिपोर्ट प्राप्त न हो तो सहायता कहाँ मिलेगी?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  भुगतान होते ही आपको Order Reference ID ({displayOrderId}) प्राप्त हो गई है। किसी भी सहायता के लिए हमारी समर्पित WhatsApp हेल्पलाइन (+91 95304 01984) और ईमेल (seva@divyayagyam.com) उपलब्ध है, जहाँ तुरंत समाधान किया जाता है।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. SUPPORT / NEXT ACTIONS BOX ── */}
      <div className="container">
        <div className="support-box liquid-glass">
          <div>
            <div className="label">24/7 Dedicated Support</div>
            <h3>
              कोई प्रश्न या शंका?<br />
              <em>हम सदैव आपकी सेवा में हैं।</em>
            </h3>
            <p>
              दिव्ययज्ञम् सनातन सेवा एवं वैदिक ज्योतिष केंद्र आपकी सहायता के लिए समर्पित है। अपनी कुंडली से जुड़े किसी भी सवाल के लिए संपर्क करें:
            </p>

            <div className="support-contact-list">
              <div className="contact-row">
                <span className="contact-icon">💬</span>
                <span>WhatsApp: <strong>+91 95304 01984</strong> (सोम–रवि, 24 घंटे)</span>
              </div>
              <div className="contact-row">
                <span className="contact-icon">✉</span>
                <span>ईमेल: <strong>seva@divyayagyam.com</strong></span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href={waHelpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-catchy"
                style={{ padding: '14px 28px', fontSize: '13px' }}
              >
                WhatsApp पर संपर्क करें ⚡
              </a>
              <Link
                href="/horoscope/premium-kundali"
                className="btn-outline-gold"
              >
                अन्य परिजन के लिए Kundali बनाएं →
              </Link>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                padding: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-gold)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(229,166,56,0.18)',
                maxWidth: '340px',
                margin: '0 auto',
              }}
            >
              <img
                src="https://drive.google.com/thumbnail?id=1F9gO9ljBeOOsvvrIqFUNfv1nMkUoI6p_&sz=w1000"
                alt="Karam Kundali Sample"
                style={{ width: '100%', borderRadius: '16px', display: 'block' }}
              />
              <div
                style={{
                  marginTop: '12px',
                  fontSize: '12px',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                40+ पन्नों की प्रमाणित वैदिक PDF रिपोर्ट
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 8. FOOTER ── */}
      <footer>
        <div className="footer">
          <div className="footer-logo">DivyaYagyam®</div>
          <div className="footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/refunds">Refund Policy</Link>
            <Link href="/horoscope">All Horoscope Reports</Link>
          </div>
        </div>
        <div
          style={{
            maxWidth: '1152px',
            margin: '20px auto 0',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <span>© {new Date().getFullYear()} DivyaYagyam. सर्वाधिकार सुरक्षित • शुद्ध सनातन सेवा</span>
          <span>🔒 256-Bit SSL Encrypted Verification</span>
        </div>
      </footer>
    </div>
  )
}

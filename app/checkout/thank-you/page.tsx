'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('order') || ''
  const paymentId = searchParams.get('payment') || ''
  const [show, setShow] = useState(false)
  const now = new Date()

  useEffect(() => {
    setShow(true)
    // Confetti effect using CSS animation only
    const timer = setTimeout(() => {}, 100)
    return () => clearTimeout(timer)
  }, [])

  const formatDate = (d: Date) =>
    d.toLocaleString('hi-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0a00 0%, #1c1000 50%, #0a1628 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "'Segoe UI', 'Noto Sans Devanagari', sans-serif"
    }}>
      <div style={{
        maxWidth: '540px',
        width: '100%',
        transition: 'all 0.6s ease',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(30px)',
      }}>

        {/* Top Success Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.08))',
          border: '1px solid rgba(249,115,22,0.4)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(249,115,22,0.1)'
        }}>
          {/* Diya */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            animation: 'glow 2s infinite alternate'
          }}>🪔</div>

          <p style={{ color: '#f97316', fontSize: '0.9rem', margin: '0 0 0.5rem', letterSpacing: '0.1em' }}>
            ॐ तत् सत् · जय श्री राम 🚩
          </p>

          <h1 style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 800,
            margin: '0.5rem 0',
            lineHeight: 1.2
          }}>
            भुगतान सफल! 🎉
          </h1>
          <p style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: 600, margin: '0.5rem 0 1.2rem' }}>
            आपकी सेवा स्वीकार कर ली गई है
          </p>
          <p style={{
            color: '#d1d5db',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            maxWidth: '380px',
            margin: '0 auto'
          }}>
            भगवान आपके इस पुण्य कार्य को आशीर्वाद दें और आपके घर में
            सुख-समृद्धि बनाए रखें। 🌸
          </p>
        </div>

        {/* Receipt / Invoice Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          {/* Receipt Header */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(249,115,22,0.2), rgba(234,88,12,0.1))',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(249,115,22,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🧾</span>
            <h2 style={{ color: '#fbbf24', fontSize: '1rem', fontWeight: 700, margin: 0 }}>
              Payment Receipt
            </h2>
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
              ✅ CONFIRMED
            </span>
          </div>

          {/* Receipt Body */}
          <div style={{ padding: '1.2rem 1.5rem' }}>
            {[
              { label: '📅 दिनांक / Date', value: formatDate(now) },
              ...(orderNumber ? [{ label: '📦 Order Number', value: orderNumber }] : []),
              ...(paymentId ? [{ label: '💳 Payment ID', value: paymentId }] : []),
              { label: '🏦 Payment Gateway', value: 'Razorpay' },
              { label: '📍 Status', value: 'SUCCESS ✅' },
              { label: '🌐 Website', value: 'divyayagyam.com' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: '0.65rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                gap: '1rem'
              }}>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  {row.label}
                </span>
                <span style={{
                  color: '#f3f4f6',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textAlign: 'right',
                  wordBreak: 'break-all',
                  maxWidth: '60%'
                }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* Receipt Footer Note */}
          <div style={{
            padding: '0.8rem 1.5rem',
            background: 'rgba(16,185,129,0.06)',
            borderTop: '1px solid rgba(16,185,129,0.15)'
          }}>
            <p style={{ color: '#6ee7b7', fontSize: '0.78rem', margin: 0, textAlign: 'center' }}>
              📧 Receipt आपके registered email पर भेज दी गई है।
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <Link href="/dashboard/orders" style={{
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: '#fff',
            padding: '0.85rem 1.8rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            boxShadow: '0 4px 20px rgba(249,115,22,0.4)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            📦 मेरे Orders देखें
          </Link>
          <Link href="/" style={{
            background: 'transparent',
            color: '#f97316',
            padding: '0.85rem 1.8rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '0.95rem',
            border: '2px solid rgba(249,115,22,0.6)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}>
            🏠 Home Page
          </Link>
        </div>

        {/* Footer */}
        <p style={{
          color: '#4b5563',
          fontSize: '0.78rem',
          textAlign: 'center',
          lineHeight: 1.6,
          margin: 0
        }}>
          किसी भी सहायता के लिए संपर्क करें · जय श्री राम 🚩
        </p>
      </div>

      <style>{`
        @keyframes glow {
          from { text-shadow: 0 0 10px rgba(249,115,22,0.5); }
          to { text-shadow: 0 0 30px rgba(249,115,22,1), 0 0 50px rgba(251,191,36,0.5); }
        }
      `}</style>
    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0f0a00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#f97316', fontSize: '2rem' }}>🪔</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}

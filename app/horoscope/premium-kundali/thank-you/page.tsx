import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { ThankYouClient } from './thank-you-client'

export const metadata: Metadata = {
  title: 'Payment Successful — Karam Kundali | DivyaYagyam',
  description: 'धन्यवाद! आपकी Karam Kundali Order Successfully Receive हो गई है। 24 से 48 घंटे के भीतर आपकी व्यक्तिगत वैदिक रिपोर्ट WhatsApp और Email पर प्रेषित की जाएगी।',
  robots: {
    index: false,
    follow: false,
  },
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            background: '#08080a',
            color: '#f5f5f7',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: '2px solid rgba(229,166,56,0.3)',
              borderTopColor: '#E5A638',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: '14px', color: '#FFE28A', letterSpacing: '0.1em' }}>
            लोड हो रहा है... कृपया प्रतीक्षा करें
          </div>
        </div>
      }
    >
      <ThankYouClient />
    </Suspense>
  )
}

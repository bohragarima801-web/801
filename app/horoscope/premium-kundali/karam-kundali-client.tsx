'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { toast } from 'sonner'
import './karam-kundali.css'

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

  // FAQ Accordion State (0 is open by default)
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setActiveFaq(prev => (prev === index ? null : index))
  }

  // 3D Scroll Reveal Observer + Hero Video Smooth Loop
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // 1. Intersection Observer for 3D Scroll Reveal
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '-60px' }
    )

    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach(el => observer.observe(el))

    // 2. Force muted and autoplay on ALL video elements immediately
    const startAllVideos = () => {
      const allVideos = document.querySelectorAll<HTMLVideoElement>('video')
      allVideos.forEach(v => {
        v.muted = true
        v.defaultMuted = true
        v.playsInline = true
        v.setAttribute('muted', '')
        v.setAttribute('playsinline', '')
        v.style.opacity = '1'
        const playPromise = v.play()
        if (playPromise !== undefined) {
          playPromise.catch(() => {})
        }
      })
    }

    startAllVideos()
    const timer1 = setTimeout(startAllVideos, 250)
    const timer2 = setTimeout(startAllVideos, 800)

    const handleFirstInteraction = () => {
      startAllVideos()
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
    window.addEventListener('click', handleFirstInteraction, { once: true })
    window.addEventListener('touchstart', handleFirstInteraction, { once: true })

    return () => {
      observer.disconnect()
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [])

  // Razorpay Checkout & Order Creation
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

      // 2. Open Razorpay Checkout Modal
      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Razorpay SDK लोड हो रहा है, कृपया 2 सेकंड बाद पुनः प्रयास करें।')
      }

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
              // Sync order details to backend Horoscope Orders queue
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
                console.warn('Backend sync note:', e)
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
    <div className="karam-kundali-page">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* ── HERO ── */}
      <header className="hero" id="home">
        <video
          ref={heroVideoRef}
          className="hero-video"
          id="heroVideo"
          muted
          autoPlay
          playsInline
          loop
          preload="auto"
          poster="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
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
              <a href="#home" className="brand">
                <span className="globe" />
                <span>DivyaYagyam</span>
              </a>
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
        <div className="container reveal">
          <div className="label">Karam Kundali Kya Hai?</div>
          <h2>
            Kismat ke bharose baithna nahi,
            <br className="desktop" />
            sahi disha chun kar <em>safal hona seekhein.</em>
          </h2>
        </div>
      </section>

      {/* ── FEATURED VIDEO ── */}
      <section className="featured">
        <div className="video-card reveal">
          <video
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=80"
          >
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
          <h2 className="big-title reveal">
            Sahi Mehnat <em>x</em> Sahi Samay
          </h2>

          <div className="two-col">
            <div className="philosophy-video reveal">
              <video
                muted
                autoPlay
                loop
                playsInline
                preload="auto"
                poster="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80"
              >
                <source
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
                  type="video/mp4"
                />
              </video>
            </div>

            <div className="reveal">
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
                  Job badalni chahiye ya business shuru karna chahiye? Rishta kab banega? Apni kundali ke grahon ko samajh
                  kar sahi samay par sahi faisla lein.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CHAPTERS / 6 MODULES ── */}
      <section className="report-chapters" id="chapters">
        <div className="container">
          <div className="label reveal">Detailed Breakdown</div>
          <h2 className="big-title reveal" style={{ marginBottom: 20 }}>
            Report Ke <em>6 Mukhya Stambh</em>
          </h2>
          <p className="reveal" style={{ color: 'var(--muted)', maxWidth: 650, marginBottom: 45, fontSize: 15 }}>
            Yeh koi 2-line horoscope nahi hai. 40+ panno ki vyaktigat report me aapke jeevan ke pratyek ahem pehlu ka gehra
            Vedic aakalan shamil hai:
          </p>

          <div className="chapter-cards">
            {/* Module 1: Lagna & Vyaktitva */}
            <div className="chap-box liquid-glass reveal">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
                  alt="Lagna & Vyaktitva Vishleshan"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 01</div>
                <h3>Lagna & Vyaktitva</h3>
                <p>Aapki aantarik kshamta, shaktiyan aur astitva. Samaj aur karyakshetra me aapka swabhavik prabhav kaisa rahega.</p>
              </div>
            </div>

            {/* Module 2: Career / Business */}
            <div className="chap-box liquid-glass reveal">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
                  alt="Career, Naukri Ya Vyapar"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 02</div>
                <h3>Naukri Ya Vyapar?</h3>
                <p>Kis sector me safalta milegi—IT, Trade, Real Estate, Creative. Promotion aur job-shift ke shubh varsh.</p>
              </div>
            </div>

            {/* Module 3: Dhan Yog & Nivesh */}
            <div className="chap-box liquid-glass reveal">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80"
                  alt="Dhan Yog, Gold Coins, Laxmi Yog"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 03</div>
                <h3>Dhan Yog & Nivesh</h3>
                <p>Laxmi Yog kab activate hoga? Dhan sanchay (savings) me aane wali badhayein aur unka nishchit nivaran.</p>
              </div>
            </div>

            {/* Module 4: Vivah & Sambandh */}
            <div className="chap-box liquid-glass reveal">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80"
                  alt="Vivah & Shubh Rishte"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 04</div>
                <h3>Vivah & Sambandh</h3>
                <p>Shaadi ka anukool samay, jeevansathi ki rashi/swabhav aur parivarik jeevan me samanjasya ke upay.</p>
              </div>
            </div>

            {/* Module 5: Mahadasha Timeline */}
            <div className="chap-box liquid-glass reveal">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=600&q=80"
                  alt="Mahadasha Timeline & Grah Chakra"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 05</div>
                <h3>Mahadasha Timeline</h3>
                <p>Agale 5 se 10 varshon ka roadmap. Kaun si dasha aapko tarakki degi aur kab satark rehna anivarya hai.</p>
              </div>
            </div>

            {/* Module 6: Practical Vedic Remedies */}
            <div className="chap-box liquid-glass reveal">
              <div className="chap-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=600&q=80"
                  alt="Saral Vedic Upay & Grah Shanti"
                />
              </div>
              <div className="chap-body">
                <div className="chap-no">MODULE 06</div>
                <h3>Saral & Practical Upay</h3>
                <p>Bina kisi mehnge karmakand ya anushthan ke, rozmarra ke aacharan, dhyan aur mantra dwara grah shanti.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES / KEY INSIGHTS ── */}
      <section className="services">
        <div className="container">
          <div className="services-head reveal">
            <h2>Aapko Kya Milega?</h2>
            <div className="label">Key Insights</div>
          </div>

          <div className="services-grid">
            <article className="service liquid-glass reveal">
              <div className="service-media">
                <video
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  poster="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                >
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
                  Kaun sa field aapko sabse zyada tarakki dega, arthik sthiti kab majboot hogi aur dhan ki rukawat kaise door karein.
                </p>
              </div>
            </article>

            <article className="service liquid-glass reveal">
              <div className="service-media">
                <video
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  poster="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80"
                >
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
                  Shaadi me deri kyu ho rahi hai? Jeevansathi ke sath rishta kaisa rahega aur parivarik shanti ke saral upay kya hain.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── KARAM VALUE ── */}
      <section className="karam-value">
        <div className="container">
          <div className="label reveal">Report Ki Khaasiyat</div>
          <h2 className="big-title reveal" style={{ marginTop: 25, marginBottom: 0 }}>
            Sirf aapke liye
            <br />
            <em>Personalised.</em>
          </h2>

          <div className="value-grid">
            <div className="value-item reveal">
              <div className="value-no">01</div>
              <h3>100% Personalised</h3>
              <p>Koi generic ya copied prediction nahi. Yeh report sirf aapke janm vivaran par tayyar hoti hai.</p>
            </div>
            <div className="value-item reveal">
              <div className="value-no">02</div>
              <h3>Grah & Yog Vishleshak</h3>
              <p>Aapki kundali ke Rajyog, Dosh aur Dasha ko aasan Hindi me explain kiya jata hai.</p>
            </div>
            <div className="value-item reveal">
              <div className="value-no">03</div>
              <h3>24–48 Ghante Me Delivery</h3>
              <p>Aapke WhatsApp aur Email par direct share ki jaane wali high-quality verified digital PDF report.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BUY SECTION & 3D REPORT MOCKUP ── */}
      <section className="buy-section" id="purchase">
        <div className="buy-box liquid-glass reveal">
          <div>
            <div className="label">Limited Time Offer</div>
            <h2 style={{ marginTop: 22 }}>
              Kismat Badlo,
              <br />
              <em>Aaj Hi.</em>
            </h2>
            <p>
              Aasan bhasha me apni kundali aur bhavishya ka pura sach jaaniye. DivyaYagyam ke sath apne sahi raste ki shuruat karein.
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

      {/* ── ORDER FORM ── */}
      <section className="order-form-container" id="order">
        <div className="form-card liquid-glass reveal">
          <div className="form-title-wrap">
            <div className="label">Birth Details Form</div>
            <h3>Apna Vivaran Darj Karein</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
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
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Gender *</label>
                <select
                  className="form-input"
                  value={gender}
                  onChange={e => setGender(e.target.value)}
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
                  onChange={e => setDob(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Janam Samay (Exact Time) *</label>
                <input
                  type="time"
                  className="form-input"
                  value={birthTime}
                  onChange={e => setBirthTime(e.target.value)}
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
                  onChange={e => setBirthPlace(e.target.value)}
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
                  onChange={e => setWhatsapp(e.target.value)}
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
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              style={{
                marginTop: 25,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 20,
                borderTop: '1px solid var(--border)',
                paddingTop: 25,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: 'var(--gold-accent)', letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Kul Rashi
                </div>
                <div style={{ fontSize: 32, fontFamily: "'Instrument Serif', serif", color: 'var(--gold-light)' }}>
                  ₹501 <span style={{ fontSize: 15, color: 'rgba(255,255,255,.45)', textDecoration: 'line-through' }}>₹1,999</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-catchy"
                style={{ padding: '18px 40px', fontSize: 15, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'कृपया प्रतीक्षा करें...' : 'Surakshit Bhugtan Karein & Report Paayein ⚡'}
              </button>
            </div>

            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', textAlign: 'center', marginTop: 18 }}>
              🔒 256-Bit SSL Encrypted | UPI, Cards & NetBanking Available
            </div>
          </form>
        </div>
      </section>

      {/* ── REVIEWS MARQUEE (20 CARDS) ── */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="label reveal">Vastavik Anubhav</div>
          <h2 className="big-title reveal" style={{ marginBottom: 0 }}>
            Logo Ka <em>Vishwas</em>
          </h2>
          <p className="reveal" style={{ color: 'var(--muted)', fontSize: 14, marginTop: 10 }}>
            12,000+ vishwasniya grahako ka anubhav (Card par hover karke padhein)
          </p>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {/* 1. Indian (Male) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "Career ko lekar bohot confusion me tha. Karam Kundali ki dasha calculation follow karke switch kiya aur aaj 3
                mahine me package double ho gaya."
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

            {/* 2. Indian (Female) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "Sabse achi baat yeh lagi ki koi mehnge ratna ya havan nahi bataye. Dincharya aur aacharan se jude saral upay the
                jisse mansik shanti mili."
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

            {/* 3. Foreigner (USA) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "I was curious about Vedic astrology. The Karam Kundali report broke down transits with pinpoint mathematical
                logic. Zero superstition."
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

            {/* 4. Indian (Male) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "WhatsApp par samay par 42 panno ki verified PDF receive hui. Chart explanation itna aasan hai ki koi bhi aam
                insaan samajh sakta hai."
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

            {/* 5. Foreigner (UK) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "Exceptional clarity on my business roadmap. Delivered within the committed timeline. The cycles and planetary
                math were spot on."
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

            {/* 6. NRI (Dubai) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "Partnership me business shuru karne se pehle lagna analysis dekha tha. Jo favorable time Karam Kundali me likha tha
                wahi follow kiya."
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

            {/* 7. Indian (Female) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "Shaadi me deri ki wajah aur shubh yog ka time report me bilkul clearly define tha. Parivaar me sabhi log
                analysis se santusht hain."
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

            {/* 8. Foreigner (Canada) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "The precision in career transitions gave me the exact confidence needed to launch my tech consultancy. Truly
                impressive format."
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

            {/* 9. Indian (Male) */}
            <div className="review-card liquid-glass">
              <div className="review-stars">★★★★★</div>
              <p>
                "501 rupaye me itna detailed Vedic calculation maine aaj tak kisi software ya pandit ji se nahi dekha. Pure value
                for money."
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

            {/* DUPLICATE SET FOR INFINITE CONTINUOUS LOOP */}
            <div className="review-card liquid-glass" aria-hidden="true">
              <div className="review-stars">★★★★★</div>
              <p>
                "Career ko lekar bohot confusion me tha. Karam Kundali ki dasha calculation follow karke switch kiya aur package
                double ho gaya."
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
                "Sabse achi baat yeh lagi ki koi mehnge ratna ya havan nahi bataye. Dincharya aur aacharan se jude saral upay the."
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
                "I was curious about Vedic astrology. The Karam Kundali report broke down transits with pinpoint mathematical logic."
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

      {/* ── FAQ SECTION (5 QUESTIONS WITH 3D ROTATING + / −) ── */}
      <section className="faq-section" id="faqs">
        <div className="container">
          <div className="label reveal">FAQ</div>
          <h2 className="big-title reveal" style={{ marginBottom: 0 }}>
            Aam Taur Par <em>Poochhe Gaye Sawaal</em>
          </h2>

          <div className="faq-wrap">
            {/* FAQ 1: Delivery Timing */}
            <div className={`faq-item liquid-glass reveal ${activeFaq === 0 ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(0)}>
                <h4>Report kitne samay me prapt hogi aur kahan aayegi?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Order aur details darj hone ke baad Vedic calculations aur verification me samay lagta hai. Aapki 40+ panno ki
                  personalised PDF report safalta-purvak <strong>24 se 48 ghante ke bheetar</strong> seedhe aapke diye gaye WhatsApp
                  number aur Email par bhej di jaati hai.
                </p>
              </div>
            </div>

            {/* FAQ 2: Birth Time Missing */}
            <div className={`faq-item liquid-glass reveal ${activeFaq === 1 ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(1)}>
                <h4>Agar mujhe apna janam samay (Exact Time) na pata ho toh kya karein?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Aap lagbhag ka anumanit samay (jaise: Subah 8:00 se 8:30 ke beech ya Dopahar) darj kar sakte hain. Humare computation
                  algorithms us samay-chakra ke dauran banne wale lagna aur planetary positions ke aadhar par sarvadhik nirdosh
                  vishleshan generate karte hain.
                </p>
              </div>
            </div>

            {/* FAQ 3: Remedies & Expenses */}
            <div className={`faq-item liquid-glass reveal ${activeFaq === 2 ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(2)}>
                <h4>Kya report me bataye gaye Upay (Remedies) mehnge hote hain?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Bilkul nahi. DivyaYagyam kisi bhi mehnge ratna, anushthan ya vyarth kharchon ko promote nahi karta. Report me bataye
                  gaye sabhi upay aapki rozmarra ki dincharya, dhyan, mantra-jap aur aacharan-shuddhi se jude practical samadhan hote
                  hain.
                </p>
              </div>
            </div>

            {/* FAQ 4: Ordering for Family */}
            <div className={`faq-item liquid-glass reveal ${activeFaq === 3 ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(3)}>
                <h4>Kya main apne bachhe, pati/patni ya kisi anya parijan ke liye order kar sakta hu?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Haan, bilkul. Form me aap jinki kundali banwana chahte hain unka naam, date of birth, time aur birth city darj karein.
                  WhatsApp aur Email number aap apna daal sakte hain taaki report aapke paas surakshit receive ho sake.
                </p>
              </div>
            </div>

            {/* FAQ 5: Support & Guarantee */}
            <div className={`faq-item liquid-glass reveal ${activeFaq === 4 ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(4)}>
                <h4>Agar payment ke baad report receive na ho toh support kahan milega?</h4>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer">
                <p>
                  Aapko payment karte hi instant order ID milti hai. Kisi bhi takneeki samasya ya delivery me sahayata ke liye hamari
                  dedicated WhatsApp helpline aur Email support team 24/7 uplabdh rehti hai, jahan aapka samadhan turant kiya jata
                  hai.
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

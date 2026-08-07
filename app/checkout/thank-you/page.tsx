'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, Download, MessageCircle, ArrowLeft, Calendar, 
  Clock, ShieldCheck, Sparkles, Heart, FileText, Phone, Mail, ChevronRight, MapPin, User, Receipt
} from 'lucide-react'

function ThankYouContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || searchParams.get('id') || 'DY-2026-89421'
  const paymentId = searchParams.get('payment') || searchParams.get('pay_id') || 'pay_Px89a2K19'
  const devoteeName = searchParams.get('name') || searchParams.get('devotee') || 'श्रद्धालु भक्त'
  const pujaName = searchParams.get('puja') || 'काशी विश्वनाथ महादेव रुद्राभिषेक एवं महायज्ञ'
  const amountPaid = searchParams.get('amount') ? `₹${searchParams.get('amount')}` : '₹1,100'
  
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const now = new Date()
    const formatted = now.toLocaleString('hi-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    setCurrentTime(formatted)
  }, [])

  const timelineSteps = [
    { label: 'Booking Confirmed', desc: 'पूजा सफलतापूर्वक दर्ज', status: 'completed' },
    { label: 'Payment Received', desc: '100% सुरक्षित भुगतान प्राप्त', status: 'completed' },
    { label: 'Invoice Generated', desc: 'रसीद डाउनलोड हेतु उपलब्ध', status: 'completed' },
    { label: 'WhatsApp Confirmation Sent', desc: 'व्हाट्सएप पर संदेश प्रेषित', status: 'completed' },
    { label: 'Pandit Assignment', desc: 'अनुभवी वेदाचार्य आवंटन', status: 'in-progress' },
    { label: 'Puja Scheduled', desc: 'शुभ मुहूर्त में पूजन संपन्नता', status: 'pending' },
  ]

  const whatsappMessage = `नमस्ते Divyayagyam! मेरी पूजा बुकिंग संख्या ${orderNumber} सफलतापूर्वक दर्ज हो गई है। कृपया आगे का अपडेट साझा करें।`
  const whatsappUrl = `https://wa.me/919587171984?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9EE] via-[#FFF3D6] to-[#FFFDF7] text-[#1E120A] relative overflow-hidden font-sans selection:bg-[#F2C94C]/30">
      {/* Dynamic CSS Keyframe for floating lotus petals */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatPetal {
          0% {
            transform: translateY(-10vh) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) scale(1.1);
            opacity: 0;
          }
        }

        .floating-petal {
          position: absolute;
          top: -5%;
          pointer-events: none;
          user-select: none;
          z-index: 1;
          animation: floatPetal linear infinite;
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 25px rgba(212, 155, 0, 0.35), 0 0 60px rgba(139, 26, 33, 0.15);
          }
          50% {
            box-shadow: 0 0 45px rgba(212, 155, 0, 0.65), 0 0 90px rgba(242, 201, 76, 0.4);
          }
        }

        .ring-glow-effect {
          animation: pulseGlow 3s infinite ease-in-out;
        }
      ` }} />

      {/* Floating Petals Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <span className="floating-petal text-2xl left-[5%]" style={{ animationDuration: '14s', animationDelay: '0s' }}>🌸</span>
        <span className="floating-petal text-xl left-[18%]" style={{ animationDuration: '18s', animationDelay: '3s' }}>🪷</span>
        <span className="floating-petal text-2xl left-[32%]" style={{ animationDuration: '16s', animationDelay: '1s' }}>🌺</span>
        <span className="floating-petal text-xl left-[55%]" style={{ animationDuration: '15s', animationDelay: '4s' }}>🌸</span>
        <span className="floating-petal text-2xl left-[72%]" style={{ animationDuration: '19s', animationDelay: '2s' }}>🪷</span>
        <span className="floating-petal text-xl left-[88%]" style={{ animationDuration: '17s', animationDelay: '5s' }}>🌺</span>
      </div>

      {/* Sacred Om Background Watermark */}
      <div aria-hidden="true" className="absolute right-[-5%] top-[-2%] text-[38vw] font-serif text-[rgba(212,155,0,0.04)] leading-none pointer-events-none select-none overflow-hidden z-0">
        ॐ
      </div>

      {/* Divine Ambient Radial Light Rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[rgba(242,201,76,0.22)] via-[rgba(212,155,0,0.08)] to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* Content Container */}
      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-20 relative z-10 max-w-4xl">

        {/* ============================================================
            HERO SECTION: ANIMATED GOLDEN SUCCESS CHECKMARK & HEADINGS
            ============================================================ */}
        <div className="text-center space-y-6">
          
          {/* Animated Success Checkmark Ring */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-[#FFFDF7] via-[#FFF3D6] to-[#FFE8A3] p-1.5 border-2 border-[#D49B00] ring-glow-effect">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-[#F2C94C]/60 animate-ping opacity-25" />
              
              {/* Inner Circle */}
              <div className="h-full w-full rounded-full bg-gradient-to-br from-[#8B1A21] to-[#D49B00] flex items-center justify-center shadow-inner">
                <CheckCircle2 className="h-14 w-14 sm:h-16 sm:w-16 text-white stroke-[2.2] drop-shadow-md" />
              </div>
            </div>
          </motion.div>

          {/* Heading Badge */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFF5D6] border-2 border-[#F2C94C] shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-[#B37B00] fill-[#B37B00]" />
            <span className="text-[#8B1A21] text-xs sm:text-sm font-black tracking-wide uppercase">
              जय श्री राम · 100% सफल बुकिंग
            </span>
          </motion.div>

          {/* Main Title & Subtitles */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#2A1508] tracking-tight">
              🙏 धन्यवाद!
            </h1>
            <p className="text-xl sm:text-2xl font-heading font-extrabold bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] bg-clip-text text-transparent">
              आपकी पूजा सफलतापूर्वक बुक हो गई है
            </p>
            <p className="text-sm sm:text-base text-[#4A2D1B] font-semibold max-w-lg mx-auto leading-relaxed">
              आपका भुगतान सफल रहा। हमारी टीम शीघ्र ही आपसे संपर्क करेगी।
            </p>
          </motion.div>
        </div>


        {/* ============================================================
            BOOKING INFORMATION CARD (RECEIPT)
            ============================================================ */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 sm:mt-12"
        >
          <div className="bg-white/95 backdrop-blur-xl border-2 border-[#F0D695] rounded-3xl p-6 sm:p-8 shadow-[0_15px_50px_rgba(212,155,0,0.10)] relative overflow-hidden">
            {/* Top Royal Gold Accent Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] absolute top-0 left-0 right-0" />

            <div className="flex items-center justify-between border-b border-[#F5E2B8] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#FFF5D6] border border-[#F2C94C] flex items-center justify-center text-[#8B1A21]">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2A1508] leading-none">
                    बुकिंग विवरण (Booking Receipt)
                  </h3>
                  <p className="text-xs text-[#6A4D3B] font-bold mt-1">Divyayagyam Official Receipt</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black">
                <ShieldCheck className="h-3.5 w-3.5" />
                Success ✅
              </span>
            </div>

            {/* Grid of Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              
              <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F5E2B8]">
                <p className="text-xs text-[#6A4D3B] font-bold uppercase tracking-wider">Booking ID</p>
                <p className="text-base font-black text-[#8B1A21] font-mono mt-0.5">{orderNumber}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F5E2B8]">
                <p className="text-xs text-[#6A4D3B] font-bold uppercase tracking-wider">Payment ID</p>
                <p className="text-base font-black text-[#2A1508] font-mono mt-0.5">{paymentId}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F5E2B8]">
                <p className="text-xs text-[#6A4D3B] font-bold uppercase tracking-wider">भक्त का नाम (Devotee)</p>
                <p className="text-base font-extrabold text-[#2A1508] mt-0.5">{devoteeName}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F5E2B8]">
                <p className="text-xs text-[#6A4D3B] font-bold uppercase tracking-wider">दिनांक व समय (Date & Time)</p>
                <p className="text-sm font-extrabold text-[#2A1508] mt-0.5">{currentTime || 'आज का दिन'}</p>
              </div>

              <div className="sm:col-span-2 p-4 rounded-2xl bg-[#FFF7E6] border border-[#F2C94C]">
                <p className="text-xs text-[#8B5A00] font-bold uppercase tracking-wider">चयनित पूजा (Selected Puja)</p>
                <p className="text-base font-black text-[#8B1A21] mt-0.5">{pujaName}</p>
              </div>

              <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#FFF5D6] via-[#FFF0C2] to-[#FFF5D6] border-2 border-[#D49B00]/40">
                <div>
                  <p className="text-xs text-[#6A4D3B] font-bold">कुल भुगतान राशि (Amount Paid)</p>
                  <p className="text-2xl font-black text-[#8B1A21] leading-none mt-1">{amountPaid}</p>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl">
                  भुगतान सफल (Paid via Razorpay)
                </span>
              </div>

            </div>

          </div>
        </motion.div>


        {/* ============================================================
            STATUS TIMELINE SECTION
            ============================================================ */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 sm:mt-10"
        >
          <div className="bg-white/95 backdrop-blur-xl border-2 border-[#F0D695] rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-heading font-black text-[#2A1508] mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#8B1A21]" />
              पूजा स्थिति समय-सारणी (Booking Progress)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {timelineSteps.map((step, idx) => {
                const isDone = step.status === 'completed'
                const isInProgress = step.status === 'in-progress'

                return (
                  <div 
                    key={step.label}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDone 
                        ? 'bg-[#F2FBF6] border-emerald-300 text-emerald-950'
                        : isInProgress
                        ? 'bg-[#FFFBF0] border-[#F2C94C] text-[#8B5A00] animate-pulse'
                        : 'bg-[#FAF6EE] border-[#E8D8B0] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      {isDone ? (
                        <span className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                          ✓
                        </span>
                      ) : isInProgress ? (
                        <span className="h-6 w-6 rounded-full bg-[#D49B00] text-white flex items-center justify-center text-xs font-black shrink-0">
                          ⏳
                        </span>
                      ) : (
                        <span className="h-6 w-6 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-xs font-black shrink-0">
                          {idx + 1}
                        </span>
                      )}
                      <h4 className="text-xs font-black uppercase tracking-wide">
                        {step.label}
                      </h4>
                    </div>
                    <p className="text-xs font-bold text-[#4A2D1B] pl-8">
                      {step.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>


        {/* ============================================================
            INFORMATION CARD: "अब आगे क्या होगा?"
            ============================================================ */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 sm:mt-10"
        >
          <div className="bg-gradient-to-br from-[#FFF5D6] via-[#FFF3D6] to-[#FFF9EE] border-2 border-[#F2C94C] rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl font-heading font-black text-[#8B1A21] mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#D49B00] fill-[#D49B00]" />
              अब आगे क्या होगा? (Next Steps)
            </h3>

            <ul className="space-y-3 text-sm sm:text-base font-semibold text-[#2A1508]">
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-[#8B1A21] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  1
                </span>
                <span>हमारी आचार्य टीम शीघ्र ही आपसे व्हाट्सएप या फोन पर संपर्क कर नाम-गोत्र संकल्प की पुष्टि करेगी।</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-[#8B1A21] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  2
                </span>
                <span>पूजा आपके द्वारा चयनित शुभ समय पर सिद्ध मंदिर में वेदोक्त विधि से संपन्न कराई जाएगी।</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-[#8B1A21] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  3
                </span>
                <span>पूजा संपन्न होने के उपरांत पूजन का लाइव वीडियो/फोटो आपके व्हाट्सएप नंबर पर प्रेषित किया जाएगा।</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="h-6 w-6 rounded-full bg-[#8B1A21] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  4
                </span>
                <span>सिद्ध मंदिर का पावन प्रसाद आपके दिए गए पते पर सुरक्षित स्पीड पोस्ट द्वारा भेजा जाएगा।</span>
              </li>
            </ul>
          </div>
        </motion.div>


        {/* ============================================================
            ACTION BUTTONS ROW
            ============================================================ */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
        >
          {/* 1. Download Invoice */}
          <a
            href={`/api/invoice/booking/${orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#8B1A21] via-[#A8232B] to-[#D49B00] text-white font-black text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-amber-300/40"
          >
            <Download className="h-4 w-4" />
            Download Invoice (रसीद)
          </a>

          {/* 2. WhatsApp Support */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4 fill-white/20" />
            WhatsApp सपोर्ट
          </a>

          {/* 3. View Booking Details */}
          <Link
            href="/dashboard/bookings"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-[#D49B00] text-[#8B1A21] font-black text-sm shadow-sm hover:bg-[#FFF8EA] hover:scale-[1.02] active:scale-95 transition-all duration-200 text-center"
          >
            <FileText className="h-4 w-4 text-[#8B1A21]" />
            मेरी बुकिंग देखें
          </Link>

          {/* 4. Back to Home */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/80 border border-[#F5E2B8] text-[#2A1508] font-extrabold text-sm hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-200 text-center"
          >
            <ArrowLeft className="h-4 w-4 text-[#6A4D3B]" />
            मुख्य पृष्ठ (Home)
          </Link>
        </motion.div>


        {/* ============================================================
            BOTTOM QUOTE & SACRED SEAL
            ============================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-14 text-center space-y-3 border-t border-[#F5E2B8] pt-10"
        >
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#FFF5D6] border-2 border-[#F2C94C] text-[#8B1A21] font-serif text-xl font-bold shadow-xs mx-auto">
            ॐ
          </div>
          <p className="text-lg sm:text-xl font-heading font-black text-[#8B1A21] italic">
            "आपकी श्रद्धा ही हमारी सबसे बड़ी प्रेरणा है।"
          </p>
          <p className="text-xs sm:text-sm font-extrabold text-[#8B5A00] tracking-[0.2em] uppercase">
            सनातन सेवा • दिव्य अनुभूति • दिव्ययज्ञम्
          </p>
        </motion.div>

      </main>


      {/* ============================================================
          FOOTER SECTION
          ============================================================ */}
      <footer className="footer-spiritual py-8 mt-12 text-[#3D1E10] relative z-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm font-bold text-[#6A4D3B]">
            <a href="tel:+919587171984" className="hover:text-[#8B1A21] flex items-center gap-1.5 transition-colors">
              <Phone className="h-3.5 w-3.5 text-[#8B1A21]" /> +91 95871-71984
            </a>
            <a href="mailto:support@divyayagyam.com" className="hover:text-[#8B1A21] flex items-center gap-1.5 transition-colors">
              <Mail className="h-3.5 w-3.5 text-[#8B1A21]" /> support@divyayagyam.com
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-700 flex items-center gap-1.5 transition-colors">
              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" /> WhatsApp Support
            </a>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-[#8B7355]">
            <Link href="/privacy" className="hover:text-[#8B1A21] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#8B1A21] transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#8B1A21] transition-colors">FAQ</Link>
          </div>

          <p className="text-[11px] text-[#8B7355] font-medium pt-2">
            © {new Date().getFullYear()} Divyayagyam. All Rights Reserved. · भारत का सबसे भरोसेमंद सनातन प्लेटफॉर्म
          </p>
        </div>
      </footer>

    </div>
  )
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
        <div className="text-[#8B1A21] text-3xl font-serif animate-pulse">ॐ Divyayagyam</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}

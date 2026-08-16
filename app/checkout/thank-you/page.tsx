'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, Download, MessageCircle, ArrowLeft, 
  Clock, ShieldCheck, Sparkles, FileText, Phone, Mail, Receipt,
  Package, Truck, CreditCard, Loader2
} from 'lucide-react'

interface OrderItem {
  name: string
  quantity: number
  price: number
  total: number
}

interface OrderData {
  id: string
  orderNumber: string
  status: string
  paymentStatus: string
  subtotal: number
  discount: number
  shipping: number
  total: number
  items: OrderItem[]
  customerName: string
  phone: string
  address: string
  paymentId?: string | null
  createdAt: string
}

function ThankYouContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || searchParams.get('id') || ''
  const razorpayPaymentId = searchParams.get('payment') || ''
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const now = new Date()
    setCurrentTime(now.toLocaleString('hi-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    }))
  }, [])

  const hasFiredPurchaseRef = useRef(false)

  useEffect(() => {
    if (!orderNumber && !razorpayPaymentId) { setLoading(false); return }
    const url = orderNumber
      ? `/api/checkout/summary?order=${encodeURIComponent(orderNumber)}`
      : `/api/checkout/summary?payment=${encodeURIComponent(razorpayPaymentId)}`
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          // Summary API returns fields at top level (not nested under data.order)
          setOrder({
            id: data.orderNumber || orderNumber,
            orderNumber: data.orderNumber || orderNumber,
            status: data.status || '',
            paymentStatus: data.paymentStatus || '',
            subtotal: Number(data.subtotal || 0),
            discount: Number(data.discount || 0),
            shipping: Number(data.shipping || 0),
            total: Number(data.total || 0),
            items: data.items || [],
            customerName: data.customerName || '',
            phone: data.phone || '',
            address: data.address || '',
            paymentId: data.paymentRef || razorpayPaymentId || null,
            createdAt: data.createdAt || new Date().toISOString(),
          })

          // Trigger Meta Pixel Purchase Event
          if (!hasFiredPurchaseRef.current) {
            hasFiredPurchaseRef.current = true
            const val = Number(data.total || 0)
            const ordId = data.orderNumber || orderNumber

            if (typeof window !== 'undefined' && (window as any).fbq) {
              try {
                (window as any).fbq('track', 'Purchase', {
                  value: val,
                  currency: 'INR',
                  content_name: data.items?.map((i: any) => i.name).join(', ') || 'Puja / Order',
                  content_type: data.type === 'booking' ? 'puja' : 'product',
                  num_items: data.items?.length || 1,
                  order_id: ordId,
                })
              } catch (e) {
                console.warn('[Pixel] Purchase tracking error:', e)
              }
            }

            // Server-side CAPI event via /api/analytics/event
            fetch('/api/analytics/event', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                eventName: 'Purchase',
                eventId: `pur_${ordId}_${Date.now()}`,
                pageUrl: window.location.href,
                userData: {
                  fullName: data.customerName,
                  phone: data.phone,
                },
                metadata: {
                  value: val,
                  currency: 'INR',
                  order_id: ordId,
                  content_type: data.type === 'booking' ? 'puja' : 'product',
                }
              })
            }).catch(() => {})
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [orderNumber, razorpayPaymentId])


  const isCod = order
    ? (order.paymentStatus !== 'SUCCESS')
    : (!razorpayPaymentId)
  const isOnline = order ? order.paymentStatus === 'SUCCESS' : !!razorpayPaymentId
  const displayTotal = order ? `${Number(order.total).toLocaleString('en-IN')}` : ''
  const customerName = order?.customerName || ''
  
  const whatsappText = `Namaste Divyayagyam! Mera order ${orderNumber} darj ho gaya hai. Kripaya update den.`
  const whatsappUrl = `https://wa.me/919530401984?text=${encodeURIComponent(whatsappText)}`

  const timelineSteps = isCod ? [
    { label: 'Order Confirmed', desc: 'COD ऑर्डर दर्ज', status: 'completed' },
    { label: 'Invoice Ready', desc: 'रसीद उपलब्ध', status: 'completed' },
    { label: 'WhatsApp Sent', desc: 'सूचना प्रेषित', status: 'completed' },
    { label: 'Packing', desc: 'पैकेजिंग एवं डिस्पैच', status: 'in-progress' },
    { label: 'Out for Delivery', desc: 'रास्ते में', status: 'pending' },
    { label: 'Pay at Door', desc: 'डिलीवरी पर भुगतान', status: 'pending' },
  ] : [
    { label: 'Order Confirmed', desc: 'सफलतापूर्वक दर्ज', status: 'completed' },
    { label: 'Payment Done', desc: '100% सुरक्षित भुगतान', status: 'completed' },
    { label: 'Invoice Ready', desc: 'रसीद उपलब्ध', status: 'completed' },
    { label: 'WhatsApp Sent', desc: 'सूचना प्रेषित', status: 'completed' },
    { label: 'Processing', desc: 'तैयारी / डिस्पैच', status: 'in-progress' },
    { label: 'Delivered', desc: 'आपके द्वार पर', status: 'pending' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF9EE] via-[#FFF3D6] to-[#FFFDF7] text-[#1E120A] relative overflow-hidden font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatPetal {
          0% { transform: translateY(-10vh) rotate(0deg) scale(0.8); opacity: 0; }
          15% { opacity: 0.7; }
          85% { opacity: 0.7; }
          100% { transform: translateY(105vh) rotate(360deg) scale(1.1); opacity: 0; }
        }
        .floating-petal { position: absolute; top: -5%; pointer-events: none; user-select: none; z-index: 1; animation: floatPetal linear infinite; }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 25px rgba(212,155,0,0.35), 0 0 60px rgba(139,26,33,0.15); }
          50% { box-shadow: 0 0 45px rgba(212,155,0,0.65), 0 0 90px rgba(242,201,76,0.4); }
        }
        .ring-glow { animation: pulseGlow 3s infinite ease-in-out; }
      ` }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {['🌸','🪷','🌺','🌸','🪷','🌺'].map((p, i) => (
          <span key={i} className="floating-petal text-2xl"
            style={{ left: `${[5,18,32,55,72,88][i]}%`, animationDuration: `${[14,18,16,15,19,17][i]}s`, animationDelay: `${[0,3,1,4,2,5][i]}s` }}>
            {p}
          </span>
        ))}
      </div>

      <div aria-hidden="true" className="absolute right-[-5%] top-[-2%] text-[38vw] font-serif text-[rgba(212,155,0,0.04)] leading-none pointer-events-none select-none overflow-hidden z-0">ॐ</div>

      <main className="container mx-auto px-4 sm:px-6 py-12 md:py-20 relative z-10 max-w-4xl">

        {/* HERO */}
        <div className="text-center space-y-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex items-center justify-center">
            <div className="relative flex items-center justify-center h-28 w-28 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-[#FFFDF7] via-[#FFF3D6] to-[#FFE8A3] p-1.5 border-2 border-[#D49B00] ring-glow">
              <div className="absolute inset-0 rounded-full border border-[#F2C94C]/60 animate-ping opacity-25" />
              <div className="h-full w-full rounded-full bg-gradient-to-br from-[#8B1A21] to-[#D49B00] flex items-center justify-center shadow-inner">
                <CheckCircle2 className="h-14 w-14 sm:h-16 sm:w-16 text-white stroke-[2.2]" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FFF5D6] border-2 border-[#F2C94C] shadow-sm">
            <Sparkles className="h-4 w-4 text-[#B37B00] fill-[#B37B00]" />
            <span className="text-[#8B1A21] text-xs sm:text-sm font-black tracking-wide uppercase">
              {isCod ? '📦 COD Order Confirmed' : '✅ Payment Successful'}
            </span>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }} className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#2A1508] tracking-tight">
              🙏 धन्यवाद!
            </h1>
            <p className="text-xl sm:text-2xl font-heading font-extrabold bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] bg-clip-text text-transparent">
              {isCod ? 'आपका ऑर्डर COD कन्फर्म हो गया है!' : 'भुगतान सफल — ऑर्डर दर्ज हो गया!'}
            </p>
            <p className="text-sm sm:text-base text-[#4A2D1B] font-semibold max-w-lg mx-auto leading-relaxed">
              {isCod ? 'डिलीवरी के समय कैश/UPI से भुगतान करें।' : 'हमारी टीम शीघ्र ही आपसे संपर्क करेगी।'}
            </p>
          </motion.div>
        </div>

        {/* ORDER RECEIPT */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }} className="mt-10 sm:mt-12">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-[#F0D695] rounded-3xl p-6 sm:p-8 shadow-[0_15px_50px_rgba(212,155,0,0.10)] relative overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] absolute top-0 left-0 right-0" />

            <div className="flex items-center justify-between border-b border-[#F5E2B8] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#FFF5D6] border border-[#F2C94C] flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-[#8B1A21]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#2A1508] leading-none">ऑर्डर रसीद (Receipt)</h3>
                  <p className="text-xs text-[#6A4D3B] font-bold mt-1">Divyayagyam — Official</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${isCod ? 'bg-amber-100 border border-amber-300 text-amber-800' : 'bg-emerald-100 border border-emerald-300 text-emerald-800'}`}>
                <ShieldCheck className="h-3.5 w-3.5" />
                {isCod ? '📦 COD' : '✅ Paid'}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-10 gap-3 text-[#8B1A21]">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="font-bold text-sm">ऑर्डर विवरण लोड हो रहा है...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F5E2B8]">
                    <p className="text-[10px] text-[#6A4D3B] font-bold uppercase tracking-wider mb-1">Order ID</p>
                    <p className="text-sm font-black text-[#8B1A21] font-mono">{orderNumber || '—'}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F5E2B8]">
                    <p className="text-[10px] text-[#6A4D3B] font-bold uppercase tracking-wider mb-1">ग्राहक नाम</p>
                    <p className="text-sm font-extrabold text-[#2A1508]">{customerName || '—'}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F5E2B8]">
                    <p className="text-[10px] text-[#6A4D3B] font-bold uppercase tracking-wider mb-1">दिनांक एवं समय</p>
                    <p className="text-xs font-extrabold text-[#2A1508]">{currentTime || '—'}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFFBF5] border border-[#F5E2B8]">
                    <p className="text-[10px] text-[#6A4D3B] font-bold uppercase tracking-wider mb-1">भुगतान विधि</p>
                    <p className="text-xs font-black text-[#2A1508]">{isCod ? '📦 Cash on Delivery' : '💳 Online (Razorpay)'}</p>
                    {isOnline && razorpayPaymentId && <p className="text-[9px] font-mono text-[#6A4D3B] mt-0.5 break-all">ID: {razorpayPaymentId}</p>}
                  </div>
                </div>

                {/* Items */}
                {order?.items && order.items.length > 0 && (
                  <div className="rounded-2xl overflow-hidden border border-[#F5E2B8]">
                    <div className="bg-[#FFF8E8] px-4 py-2.5 border-b border-[#F5E2B8]">
                      <p className="text-[10px] font-black uppercase tracking-wider text-[#6A4D3B]">🛒 ऑर्डर आइटम</p>
                    </div>
                    <div className="divide-y divide-[#F5E2B8]">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between px-4 py-3 bg-white">
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="text-sm font-bold text-[#1E120A] leading-snug">{item.name}</p>
                            <p className="text-[11px] text-[#6A4D3B] mt-0.5">₹{Number(item.price).toLocaleString('en-IN')} × {item.quantity}</p>
                          </div>
                          <p className="text-sm font-black text-[#8B1A21] shrink-0">₹{Number(item.total).toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bill Summary */}
                <div className="rounded-2xl bg-gradient-to-r from-[#FFF5D6] via-[#FFF0C2] to-[#FFF5D6] border-2 border-[#D49B00]/40 p-4">
                  {order && (
                    <div className="space-y-1.5 text-sm mb-3">
                      <div className="flex justify-between text-[#4A2D1B]">
                        <span>Subtotal</span>
                        <span className="font-bold">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                      </div>
                      {Number(order.discount) > 0 && (
                        <div className="flex justify-between text-emerald-700">
                          <span>Discount</span>
                          <span className="font-bold">-₹{Number(order.discount).toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#4A2D1B]">
                        <span>Delivery Fee</span>
                        {Number(order.shipping) > 0
                          ? <span className="font-bold">₹{Number(order.shipping).toLocaleString('en-IN')}</span>
                          : <span className="font-bold text-emerald-700">FREE ✅</span>
                        }
                      </div>
                      <div className="border-t border-[#D49B00]/30 my-2" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#6A4D3B] font-bold">{isCod ? '💰 COD राशि (डिलीवरी पर)' : '✅ कुल भुगतान'}</p>
                      <p className="text-2xl font-black text-[#8B1A21] leading-none mt-1">
                        {displayTotal ? `₹${displayTotal}` : '—'}
                      </p>
                    </div>
                    <span className={`text-xs font-black px-3 py-2 rounded-xl text-center ${isCod ? 'text-amber-800 bg-amber-100 border border-amber-300' : 'text-emerald-800 bg-emerald-100 border border-emerald-300'}`}>
                      {isCod ? '📦 Pay at\nDelivery' : '✅ Paid via\nRazorpay'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* PROGRESS */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }} className="mt-8">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-[#F0D695] rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-heading font-black text-[#2A1508] mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#8B1A21]" /> ऑर्डर प्रगति (Progress)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {timelineSteps.map((step, idx) => {
                const isDone = step.status === 'completed'
                const isProgress = step.status === 'in-progress'
                return (
                  <div key={idx} className={`p-3 rounded-2xl border flex flex-col gap-1 ${isDone ? 'bg-emerald-50 border-emerald-200' : isProgress ? 'bg-amber-50 border-amber-200' : 'bg-[#FAFAFA] border-[#F0F0F0]'}`}>
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center text-white font-black text-xs shrink-0 ${isDone ? 'bg-emerald-500' : isProgress ? 'bg-amber-500' : 'bg-gray-300'}`}>
                      {isDone ? '✓' : isProgress ? '⏳' : String(idx + 1)}
                    </div>
                    <p className={`text-xs font-black leading-snug ${isDone ? 'text-emerald-800' : isProgress ? 'text-amber-800' : 'text-gray-500'}`}>{step.label}</p>
                    <p className="text-[10px] text-gray-500 leading-snug">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* NEXT STEPS */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }} className="mt-8">
          <div className="bg-white/95 backdrop-blur-xl border-2 border-[#F0D695] rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-heading font-black text-[#2A1508] mb-5 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#D49B00] fill-[#D49B00]" /> अब आगे क्या होगा?
            </h3>
            <ol className="space-y-4">
              {(isCod ? [
                'हमारी टीम आपको शीघ्र ही ऑर्डर पुष्टि का संदेश व्हाट्सएप/SMS पर भेजेगी।',
                'आपका ऑर्डर पैक करके भरोसेमंद कूरियर पार्टनर को सौंपा जाएगा।',
                `डिलीवरी के समय कुल राशि ${displayTotal ? '₹' + displayTotal : ''} कैश/UPI में दें।`,
                'किसी भी समस्या के लिए नीचे WhatsApp बटन से तुरंत संपर्क करें।',
              ] : [
                'हमारी टीम शीघ्र ही आपसे व्हाट्सएप/फोन पर संपर्क कर पुष्टि करेगी।',
                'आपका ऑर्डर/पूजा/सेवा तैयार होकर डिस्पैच/संपन्न किया जाएगा।',
                'सेवा/प्रसाद का वीडियो/फोटो आपके व्हाट्सएप पर भेजा जाएगा।',
                'नीचे Invoice बटन से अपनी रसीद सुरक्षित PDF में डाउनलोड करें।',
              ]).map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-br from-[#8B1A21] to-[#D49B00] text-white font-black text-xs flex items-center justify-center">{idx + 1}</span>
                  <p className="text-sm text-[#4A2D1B] font-semibold leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        {/* ACTION BUTTONS */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">

          {orderNumber && (
            <a href={`/api/invoice/order/${orderNumber}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#8B1A21] via-[#A8232B] to-[#D49B00] text-white font-black text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 border border-amber-300/40">
              <Download className="h-4 w-4" />
              Invoice / रसीद PDF
            </a>
          )}

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200">
            <MessageCircle className="h-4 w-4 fill-white/20" />
            WhatsApp Support
          </a>

          <Link href="/dashboard/orders"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border-2 border-[#D49B00] text-[#8B1A21] font-black text-sm shadow-sm hover:bg-[#FFF8EA] hover:scale-[1.02] active:scale-95 transition-all duration-200 text-center">
            <FileText className="h-4 w-4" />
            मेरे ऑर्डर
          </Link>

          <Link href="/"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/80 border border-[#F5E2B8] text-[#2A1508] font-extrabold text-sm hover:bg-white hover:scale-[1.02] active:scale-95 transition-all duration-200 text-center">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </motion.div>

        {/* QUOTE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-14 text-center space-y-3 border-t border-[#F5E2B8] pt-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#FFF5D6] border-2 border-[#F2C94C] text-[#8B1A21] font-serif text-xl font-bold mx-auto">ॐ</div>
          <p className="text-lg sm:text-xl font-heading font-black text-[#8B1A21] italic">"आपकी श्रद्धा ही हमारी सबसे बड़ी प्रेरणा है।"</p>
          <p className="text-xs sm:text-sm font-extrabold text-[#8B5A00] tracking-[0.2em] uppercase">सनातन सेवा • दिव्य अनुभूति • दिव्ययज्ञम्</p>
        </motion.div>
      </main>

      <footer className="footer-spiritual py-8 mt-12 text-[#3D1E10] relative z-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm font-bold text-[#6A4D3B]">
            <a href="tel:+919530401984" className="hover:text-[#8B1A21] flex items-center gap-1.5 transition-colors">
              <Phone className="h-3.5 w-3.5 text-[#8B1A21]" /> +91 95304-01984
            </a>
            <a href="mailto:support@divyayagyam.com" className="hover:text-[#8B1A21] flex items-center gap-1.5 transition-colors">
              <Mail className="h-3.5 w-3.5 text-[#8B1A21]" /> support@divyayagyam.com
            </a>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-[#8B7355]">
            <Link href="/privacy" className="hover:text-[#8B1A21] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#8B1A21] transition-colors">Terms & Conditions</Link>
          </div>
          <p className="text-[11px] text-[#8B7355] font-medium pt-2">
            © {new Date().getFullYear()} Divyayagyam. All Rights Reserved.
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
        <div className="text-center space-y-4">
          <div className="text-[#8B1A21] text-4xl font-serif animate-pulse">ॐ</div>
          <p className="text-[#8B1A21] font-bold">Divyayagyam...</p>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}

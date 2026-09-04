'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, CheckCircle2, MapPin, User, Plus, Edit2, Trash2, Shield, Lock, Star } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, cartTotal, totalItems, clearCart, addToCart, removeFromCart, updateQuantity, appliedCoupon, applyCoupon, removeCoupon, finalTotal, discountAmount, shippingFee, freeShippingThreshold, deliveryFee, hasProducts, productSubtotal } = useCart()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [bhaktiSevaOfferings, setBhaktiSevaOfferings] = useState<any[]>([])
  const [couponCode, setCouponCode] = useState('')
  const [validatingCoupon, setValidatingCoupon] = useState(false)
  const [step, setStep] = useState<'addons' | 'details'>('details')
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('cod')

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    street: '',
    city: '',
    state: ''
  })

  const [sankalp, setSankalp] = useState({
    gotra: '',
    purpose: ''
  })
  const [showSankalpModal, setShowSankalpModal] = useState(false)
  const [acceptedTnC, setAcceptedTnC] = useState(false)
  const [customDakshinaInput, setCustomDakshinaInput] = useState('2100')

  const isItemInCart = (id: string) => items.some(i => i.id === id)
  const dakshinaItem = items.find(i => i.id === 'addon-dakshina')
  const hasPuja = items.some(i => i.id.startsWith('puja-'))

  // Automatically start on 'details' step for product-only carts
  useEffect(() => {
    if (!loading && items.length > 0 && !hasPuja) {
      setStep('details')
    }
  }, [loading, items, hasPuja])

  const handleDakshinaSelect = (amt: number) => {
    if (dakshinaItem && dakshinaItem.price === amt) {
       removeFromCart('addon-dakshina')
       toast.info(`Dakshina removed`)
    } else {
       if (dakshinaItem) removeFromCart('addon-dakshina')
       addToCart({ id: 'addon-dakshina', name: 'Pandit Dakshina', price: amt, image: '' })
       toast.success(`Dakshina ₹${amt} added!`)
    }
  }

  const toggleAddonToCart = (id: string, price: number, name: string, image?: string) => {
    const fullId = `addon-${id}`
    if (isItemInCart(fullId)) {
      removeFromCart(fullId)
      toast.info(`${name} removed`)
    } else {
      addToCart({ id: fullId, name, price, image: image || '' })
      toast.success(`${name} added!`)
    }
  }

  useEffect(() => {
    let isMounted = true
    const loadCheckoutData = async () => {
      try {
        const [profileRes, bhaktiRes] = await Promise.all([
          fetch('/api/profile').catch(() => null),
          fetch('/api/bhaktiseva').catch(() => null)
        ])

        if (profileRes && profileRes.ok) {
          const data = await profileRes.json()
          if (data.ok && data.user && isMounted) {
            setUser(data.user)
            setAddress(prev => ({
              ...prev,
              name: data.user.fullName || prev.name,
              phone: data.user.phone || prev.phone
            }))
            if (data.user.customerProfile?.gotra) {
              setSankalp(prev => ({ ...prev, gotra: data.user.customerProfile.gotra }))
            }
          }
        }

        if (bhaktiRes && bhaktiRes.ok) {
          const bhaktiData = await bhaktiRes.json()
          if (bhaktiData.offerings && isMounted) {
            setBhaktiSevaOfferings(bhaktiData.offerings)
          }
        }
      } catch (err) {
        console.error('Checkout init error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCheckoutData()
    return () => { isMounted = false }
  }, [router])

  useEffect(() => {
    try {
      const storedSankalp = window.localStorage.getItem('dy_sankalp')
      if (storedSankalp) {
        const parsed = JSON.parse(storedSankalp)
        if (parsed.gotra || parsed.purpose) {
          setSankalp(prev => ({
            gotra: parsed.gotra || prev.gotra,
            purpose: parsed.purpose ? `${parsed.purpose}${parsed.date ? ` (Date: ${parsed.date})` : ''}` : prev.purpose
          }))
        }
        if (parsed.devoteeName || parsed.whatsappPhone) {
          setAddress(prev => ({
            ...prev,
            name: parsed.devoteeName || prev.name,
            phone: parsed.whatsappPhone || prev.phone
          }))
        }
      }
    } catch (e) {}
  }, [])

  useEffect(() => {
    if (!loading && items.length === 0) {
      router.push('/cart')
    }
  }, [loading, items.length, router])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }
    setValidatingCoupon(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal })
      })
      const data = await res.json()
      if (data.ok && data.coupon) {
        applyCoupon(data.coupon)
        toast.success(`Coupon applied! You saved ₹${data.coupon.discountAmount}`)
        setCouponCode('')
      } else {
        toast.error(data.error || 'Invalid coupon')
      }
    } catch (err) {
      toast.error('Failed to validate coupon')
    } finally {
      setValidatingCoupon(false)
    }
  }

  const initiatePayment = () => {
    if (!address.name || !address.phone || !address.pincode || !address.street || !address.city || !address.state) {
      toast.error('Please fill all address fields completely')
      return
    }
    if (items.some(i => i.id.startsWith('puja-'))) {
      setShowSankalpModal(true)
    } else {
      handlePayment()
    }
  }

  const handlePayment = async () => {
    if (paymentMethod === 'razorpay' && !(window as any).Razorpay) {
      toast.error('Payment gateway loading... कृपया 2 सेकंड बाद पुनः प्रयास करें।')
      return
    }

    setProcessing(true)
    try {
      const sankalpNotes = sankalp.gotra || sankalp.purpose ? `[Sankalp] Gotra: ${sankalp.gotra} | Purpose: ${sankalp.purpose}` : '';
      
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ 
            id: i.id, 
            quantity: i.quantity,
            name: i.name,
            price: i.price 
          })),
          shippingAddress: address,
          notes: sankalpNotes,
          couponCode: appliedCoupon?.code,
          paymentMethod: paymentMethod
        })
      })
      const data = await res.json()

      if (!data.ok) {
        toast.error(data.error || 'Order creation failed')
        setProcessing(false)
        return
      }

      if (data.mode === 'manual') {
        clearCart()
        toast.success('🎉 ऑर्डर सफलतापूर्वक दर्ज हो गया!')
        const params = new URLSearchParams()
        if (data.orderNumber) params.set('order', data.orderNumber)
        if (data.total != null) params.set('amount', String(data.total))
        params.set('method', data.paymentMethod === 'cod' ? 'cod' : 'manual')
        window.location.href = `/checkout/thank-you?${params.toString()}`
        return
      }

      const orderNumber = data.orderNumber || ''
      const { orderId, amount, currency, receipt, razorpayKeyId, paymentId: orderPaymentId } = data.paymentData

      if (!razorpayKeyId) {
        toast.error('Razorpay Key ID is missing. Please configure Razorpay Keys in Admin Settings.')
        setProcessing(false)
        return
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        try {
          (window as any).fbq('track', 'InitiateCheckout', {
            value: Math.round(amount / 100),
            currency: 'INR',
            num_items: items.length,
          })
        } catch (e) {}
      }

      const options = {
        key: razorpayKeyId,
        amount,
        currency,
        name: 'Divya Yagyam 🕉️',
        description: 'Puja / Prasad / Sacred Seva',
        order_id: orderId,
        image: 'https://divyayagyam.com/logo.png',
        modal: {
          ondismiss: () => {
            setProcessing(false)
          }
        },
        handler: async function (response: any) {
          setProcessing(true)
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: orderPaymentId,
              })
            })
            const verifyData = await verifyRes.json()

            if (verifyRes.ok && verifyData.ok && verifyData.verified) {
              clearCart()
              toast.success('🎉 भुगतान सफल! ऑर्डर दर्ज हो गया।')
              const params = new URLSearchParams()
              if (orderNumber) params.set('order', orderNumber)
              const pid = verifyData.razorpay_payment_id || response.razorpay_payment_id
              if (pid) params.set('payment', pid)
              params.set('method', 'online')
              if (amount) params.set('amount', String(Math.round(amount / 100)))
              window.location.href = `/checkout/thank-you?${params.toString()}`
            } else {
              const pid = response.razorpay_payment_id || ''
              toast.error(
                pid
                  ? `Payment verification failed. Payment ID: ${pid} — कृपया इसे note करें और support से contact करें।`
                  : 'Payment verification failed. अगर पैसे कट गए हों तो support से contact करें।',
                { duration: 10000 }
              )
              setProcessing(false)
            }
          } catch (verifyErr: any) {
            const pid = response?.razorpay_payment_id || ''
            toast.error(
              pid
                ? `Payment confirm नहीं हो सका। Payment ID: ${pid} — support से contact करें।`
                : 'Payment confirm नहीं हो सका। Support से contact करें।',
              { duration: 10000 }
            )
            setProcessing(false)
          }
        },
        prefill: {
          name: address.name,
          email: user?.email || '',
          contact: address.phone
        },
        theme: { color: '#8B1A21' },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        const desc = response?.error?.description || response?.error?.reason || 'Payment Failed'
        toast.error(`Payment failed: ${desc}`, { duration: 6000 })
        setProcessing(false)
      })
      rzp.open()

    } catch (err: any) {
      toast.error(err?.message || 'Order process करने में error आई। Please try again.')
      setProcessing(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen checkout-page flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#8B1A21]/20 border-t-[#8B1A21] animate-spin" />
        <p className="text-sm text-amber-900 font-semibold">आपका Order तैयार हो रहा है...</p>
      </div>
    </div>
  )
  if (items.length === 0) return null

  const primaryItem = items[0] || { name: 'Puja Booking', price: 0 }

  return (
    <>
      <div className="checkout-page pb-28 lg:pb-12">

        {/* ── STEP HEADER ───────────────────────────────────────── */}
        <div className="border-b border-amber-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-[#8B1A21] font-black text-lg">🕉️ Divya Yagyam</span>
              <span className="text-amber-700 hidden sm:block">|</span>
              <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-amber-900/70">
                {hasPuja && (
                  <>
                    <span className={`px-2 py-0.5 rounded-full transition-all ${step === 'addons' ? 'bg-[#8B1A21] text-white' : 'bg-amber-100 text-amber-800'}`}>1. Offerings</span>
                    <ArrowRight className="w-3 h-3 opacity-40" />
                  </>
                )}
                <span className={`px-2 py-0.5 rounded-full transition-all ${step === 'details' ? 'bg-[#8B1A21] text-white' : 'bg-amber-100 text-amber-800'}`}>{hasPuja ? '2.' : '1.'} Details & Pay</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold">
              <Lock className="w-3 h-3" />
              <span>100% Secure</span>
            </div>
          </div>
        </div>

        {/* ── STEP 1: ADD-ONS (Puja only) ───────────────────────── */}
        {step === 'addons' && hasPuja && (
          <div className="container max-w-6xl mx-auto px-4 pt-6">
            <div className="grid lg:grid-cols-12 gap-6 items-start">

              {/* Left Column */}
              <div className="lg:col-span-8 space-y-5">

                {/* Puja Header */}
                <div className="checkout-card p-5">
                  <div className="flex items-start gap-3">
                    <button onClick={() => router.back()} className="mt-1 text-amber-900/60 hover:text-[#8B1A21] transition-colors p-1 rounded-lg hover:bg-[#8B1A21]/08">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <div className="space-y-2.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-[#8B1A21]/08 text-[#8B1A21] text-[11px] font-bold px-3 py-1 rounded-full border border-[#8B1A21]/15">
                          ✦ Selected Puja
                        </span>
                      </div>
                      <h1 className="text-lg md:text-xl font-bold text-amber-950 leading-snug">
                        {primaryItem.name}
                      </h1>
                      <div className="space-y-1.5 text-sm text-amber-800">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>Sacred Temple / Online Booking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 shrink-0" />
                          <span className="font-semibold text-amber-950">{primaryItem.name} — {totalItems} item(s) · ₹{cartTotal}</span>
                          <button onClick={() => router.back()} className="text-[#8B1A21] text-xs font-bold flex items-center gap-1 hover:underline">
                            <Edit2 className="w-3 h-3" /> Change
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add-on Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'courier', title: 'Prasad Courier Fee', price: 99 },
                  ].map((addon) => {
                    const inCart = isItemInCart(`addon-${addon.id}`)
                    return (
                    <div key={addon.id} onClick={() => toggleAddonToCart(addon.id, addon.price, addon.title)}
                      className={`cursor-pointer checkout-card p-4 flex items-start justify-between transition-all duration-200 ${inCart ? 'bg-green-50 border-green-300 ring-1 ring-green-200' : 'hover:border-[#8B1A21]/30 hover:shadow-md'}`}>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-amber-950">{addon.title}</p>
                        <p className="text-sm text-amber-900/60 font-medium">₹{addon.price}</p>
                      </div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${inCart ? 'bg-green-600 border-green-600 text-white' : 'border-amber-300 text-amber-700'}`}>
                        {inCart ? <CheckCircle2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </div>
                    </div>
                  )})}
                </div>

                {/* Pandit Dakshina */}
                <div className="checkout-card p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-[#8B1A21]/10 flex items-center justify-center text-[#8B1A21]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <h3 className="font-bold text-amber-950 text-base">Pandit Dakshina (Optional)</h3>
                  </div>
                  <p className="text-xs text-amber-800 mb-4 ml-10">Support the pandits performing your sacred puja.</p>

                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {[251, 551, 1100].map(amt => {
                      const isSelected = dakshinaItem?.price === amt
                      return (
                        <button
                          key={amt}
                          onClick={() => handleDakshinaSelect(amt)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold border-2 transition-all duration-200 ${isSelected ? 'bg-[#8B1A21] text-white border-[#8B1A21] shadow-md' : 'bg-amber-50 text-amber-900 border-amber-200 hover:border-[#8B1A21]/50 hover:bg-[#8B1A21]/05'}`}
                        >
                          ₹{amt}
                        </button>
                      )
                    })}

                    {/* Custom Input */}
                    <div className={`flex items-center border-2 rounded-lg overflow-hidden transition-all ${(![251,551,1100].includes(dakshinaItem?.price || 0) && dakshinaItem) ? 'border-[#8B1A21] shadow-md' : 'border-amber-200 focus-within:border-[#8B1A21]/60'}`}>
                      <span className="px-3 text-amber-700 font-bold bg-amber-50 h-full flex items-center text-sm border-r border-amber-200">₹</span>
                      <input
                        type="number"
                        value={customDakshinaInput}
                        onChange={(e) => setCustomDakshinaInput(e.target.value)}
                        placeholder="2100"
                        className="w-20 px-2 py-2 text-sm font-bold outline-none text-amber-950 bg-white"
                      />
                      <button
                        onClick={() => handleDakshinaSelect(Number(customDakshinaInput) || 2100)}
                        className={`px-3 py-2 text-sm font-bold transition-all border-l ${(![251,551,1100].includes(dakshinaItem?.price || 0) && dakshinaItem) ? 'bg-[#8B1A21] text-white border-[#8B1A21]' : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'}`}
                      >
                        {(![251,551,1100].includes(dakshinaItem?.price || 0) && dakshinaItem) ? '✓' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bhakti Seva Offerings */}
                {bhaktiSevaOfferings.length > 0 && (
                  <div className="checkout-card p-5 space-y-4 bg-gradient-to-br from-amber-50/80 to-[#8B1A21]/03">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌸</span>
                        <div>
                          <h3 className="text-base font-bold text-amber-950">अतिरिक्त पुण्य एवं भक्ति सेवा</h3>
                          <p className="text-xs text-amber-800">गो-सेवा, साधु भोजन व दीपदान जोड़ें (Optional)</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold bg-[#8B1A21]/10 text-[#8B1A21] px-2.5 py-1 rounded-full border border-[#8B1A21]/15">
                        {bhaktiSevaOfferings.length} सेवाएं
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      {bhaktiSevaOfferings.map((offering) => {
                        const inCart = isItemInCart(`addon-bhaktiSeva-${offering.id}`)
                        return (
                        <div key={offering.id} className={`bg-white border rounded-xl p-4 flex gap-4 shadow-sm relative transition-all duration-200 ${inCart ? 'border-[#8B1A21]/40 ring-1 ring-[#8B1A21]/20 bg-[#8B1A21]/02' : 'border-amber-200/60 hover:border-[#8B1A21]/30'}`}>
                          <div className="space-y-1.5 flex-1">
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
                              🪔 भक्ति सेवा
                            </span>
                            <h4 className="font-bold text-sm text-amber-950">{offering.name}</h4>
                            <p className="text-xs text-amber-900/60 line-clamp-2">
                              {offering.description || `Offer ${offering.name} for divine blessings.`}
                            </p>
                            <p className="font-black text-sm text-[#8B1A21] pt-1">₹{Number(offering.price).toLocaleString('en-IN')}</p>
                          </div>
                          <div className="relative flex flex-col items-center justify-center w-24">
                            <div className="w-20 h-20 bg-amber-50 rounded-lg overflow-hidden border border-amber-200 flex items-center justify-center">
                              {offering.image ? (
                                <img src={offering.image} alt={offering.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs text-amber-400">🌺</span>
                              )}
                            </div>
                            <button
                              onClick={() => toggleAddonToCart(`bhaktiSeva-${offering.id}`, Number(offering.price), offering.name, offering.image)}
                              className={`absolute -bottom-2 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md transition-all ${inCart ? 'bg-[#8B1A21] hover:bg-[#701419]' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                              {inCart ? '✓ Added' : '+ Add'}
                            </button>
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Bill Summary (Sticky) */}
              <div className="lg:col-span-4">
                <div className="sticky top-20">
                  <div className="checkout-card p-5">
                    <h3 className="font-bold text-amber-950 text-sm mb-4 flex items-center gap-2">
                      <span className="text-[#8B1A21]">🛕</span> Your Offerings & Items
                    </h3>

                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 mb-4 border-b border-dashed border-amber-200 pb-4">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between items-start text-sm border-b border-amber-100 pb-3 last:border-0 last:pb-0">
                          <div className="flex-1 min-w-0 pr-3">
                            <p className="font-semibold text-amber-950 line-clamp-2 text-[13px]">{item.name}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center border border-amber-200 rounded-md h-6 overflow-hidden">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 h-full bg-amber-50 hover:bg-amber-100 text-amber-800 border-r border-amber-200 text-xs">−</button>
                                <span className="px-2 text-xs font-bold text-amber-950">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 h-full bg-amber-50 hover:bg-amber-100 text-amber-800 border-l border-amber-200 text-xs">+</button>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-0.5">
                                <Trash2 className="w-3 h-3"/>
                              </button>
                            </div>
                          </div>
                          <span className="font-bold text-[#8B1A21] whitespace-nowrap text-sm">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-2.5 text-sm text-amber-900/70">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-amber-950">₹{cartTotal}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-green-700 font-semibold">
                          <span>Coupon Discount</span>
                          <span>−₹{discountAmount}</span>
                        </div>
                      )}
                      {hasProducts && (
                        <div className="flex justify-between items-center">
                          <span>Delivery</span>
                          {shippingFee > 0 ? (
                            <span className="font-bold text-amber-950">₹{shippingFee}</span>
                          ) : (
                            <span className="text-green-700 font-bold text-xs bg-green-50 px-2 py-0.5 rounded border border-green-200">FREE</span>
                          )}
                        </div>
                      )}
                      <div className="pt-3 border-t border-amber-200 flex justify-between font-black text-lg text-amber-950">
                        <span>Total</span>
                        <span className="text-[#8B1A21]">₹{finalTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep('details')}
                      className="w-full mt-4 checkout-pay-btn h-12 flex items-center justify-center gap-2 text-base font-bold rounded-xl"
                    >
                      Proceed to Details
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <p className="text-center text-[11px] text-amber-700 mt-2 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> 100% Secure & Encrypted
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sticky Bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-amber-200 p-4 z-50 shadow-[0_-8px_24px_rgba(42,21,8,0.08)]">
              <div className="max-w-xl mx-auto flex items-center gap-4">
                <div>
                  <p className="text-[11px] text-amber-800 font-medium">कुल राशि</p>
                  <p className="text-xl font-black text-[#8B1A21]">₹{finalTotal}</p>
                </div>
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 checkout-pay-btn h-12 flex items-center justify-center gap-2 text-base font-bold rounded-xl"
                >
                  Proceed <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: DETAILS & PAY ────────────────────────────── */}
        {step === 'details' && (
          <div className="container max-w-6xl mx-auto px-4 pt-8">
            <div className="flex items-center gap-3 mb-8">
              {hasPuja && (
                <button onClick={() => setStep('addons')} className="text-[#8B1A21] font-bold hover:underline flex items-center gap-1 text-sm">
                  <ArrowRight className="h-4 w-4 rotate-180" /> Back to Offerings
                </button>
              )}
              <h1 className="text-2xl font-black text-amber-950">
                {hasPuja ? '🕉️ Sankalp & Billing' : '🛍️ Secure Checkout'}
              </h1>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
              {/* Address Form */}
              <div className="lg:col-span-7 space-y-5">
                <div className="checkout-card p-6 space-y-5">
                  <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Shipping & Devotee Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-amber-900 font-semibold text-xs uppercase tracking-wide">Full Name *</Label>
                      <Input value={address.name} onChange={e => setAddress({...address, name: e.target.value})} placeholder="e.g. Ramesh Sharma" className="border-amber-200 focus:border-[#8B1A21]/60 focus:ring-[#8B1A21]/20 bg-amber-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-amber-900 font-semibold text-xs uppercase tracking-wide">Phone Number (WhatsApp) *</Label>
                      <Input value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} placeholder="9530401984" className="border-amber-200 focus:border-[#8B1A21]/60 focus:ring-[#8B1A21]/20 bg-amber-50/30" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-amber-900 font-semibold text-xs uppercase tracking-wide">Street Address *</Label>
                      <Input value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="House No, Building, Area" className="border-amber-200 focus:border-[#8B1A21]/60 focus:ring-[#8B1A21]/20 bg-amber-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-amber-900 font-semibold text-xs uppercase tracking-wide">City *</Label>
                      <Input value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="Varanasi" className="border-amber-200 focus:border-[#8B1A21]/60 focus:ring-[#8B1A21]/20 bg-amber-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-amber-900 font-semibold text-xs uppercase tracking-wide">State *</Label>
                      <Input value={address.state} onChange={e => setAddress({...address, state: e.target.value})} placeholder="Uttar Pradesh" className="border-amber-200 focus:border-[#8B1A21]/60 focus:ring-[#8B1A21]/20 bg-amber-50/30" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-amber-900 font-semibold text-xs uppercase tracking-wide">Pincode *</Label>
                      <Input value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} placeholder="221001" className="border-amber-200 focus:border-[#8B1A21]/60 focus:ring-[#8B1A21]/20 bg-amber-50/30" />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="checkout-card p-6 space-y-4">
                  <h2 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-[#8B1A21]" />
                    Payment Method
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${paymentMethod === 'cod' ? 'border-[#8B1A21] bg-[#8B1A21]/05' : 'border-amber-200 hover:border-amber-300'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={paymentMethod === 'cod'} 
                        onChange={() => setPaymentMethod('cod')} 
                        className="accent-[#8B1A21] w-4 h-4"
                      />
                      <div>
                        <p className="font-bold text-sm text-amber-950">Cash on Delivery (COD)</p>
                        <p className="text-xs text-amber-900/60">Pay when order is delivered</p>
                      </div>
                    </label>

                    <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${paymentMethod === 'razorpay' ? 'border-[#8B1A21] bg-[#8B1A21]/05' : 'border-amber-200 hover:border-amber-300'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="razorpay" 
                        checked={paymentMethod === 'razorpay'} 
                        onChange={() => setPaymentMethod('razorpay')} 
                        className="accent-[#8B1A21] w-4 h-4"
                      />
                      <div>
                        <p className="font-bold text-sm text-amber-950">Online Payment</p>
                        <p className="text-xs text-amber-900/60">UPI, Cards, NetBanking (Razorpay)</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: <Shield className="w-4 h-4" />, text: '100% शास्त्रोक्त संकल्प' },
                    { icon: <Lock className="w-4 h-4" />, text: 'सुरक्षित भुगतान' },
                    { icon: <Star className="w-4 h-4" />, text: '27+ वर्ष पावन सेवा' },
                  ].map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-amber-100 text-center">
                      <div className="text-[#8B1A21]">{b.icon}</div>
                      <span className="text-[10px] text-amber-800 font-semibold leading-tight">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-5 order-first lg:order-last">
                <div className="sticky top-20">
                  <div className="checkout-card p-5 space-y-5">
                    <h3 className="font-bold text-amber-950 flex items-center gap-2">
                      <span className="text-[#8B1A21]">📦</span> Order Summary
                    </h3>
                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm border-b border-amber-100 pb-3 last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                              {item.image ? <img src={item.image} className="h-10 w-10 object-cover" /> : <span className="text-lg">🌺</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-amber-950 line-clamp-1 text-[13px]">{item.name}</p>
                              <p className="text-[11px] text-amber-800 font-medium">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-bold text-[#8B1A21] ml-4 text-sm">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Coupon code */}
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <input
                          value={couponCode}
                          onChange={e => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Coupon code"
                          className="flex-1 border border-amber-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#8B1A21]/50 font-medium text-amber-950 bg-amber-50/50"
                          onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon}
                          className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg border border-amber-300 transition-colors disabled:opacity-50"
                        >
                          {validatingCoupon ? '...' : 'Apply'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2 border border-green-200">
                        <span className="text-xs text-green-700 font-bold">✓ {appliedCoupon.code} applied</span>
                        <button onClick={removeCoupon} className="text-red-500 text-xs font-bold hover:underline">Remove</button>
                      </div>
                    )}

                    <div className="pt-4 border-t border-amber-200 space-y-2 text-sm text-amber-900/70">
                      <div className="flex justify-between">
                        <span>Subtotal ({totalItems} items)</span>
                        <span className="font-bold text-amber-950">₹{cartTotal}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-green-700 font-semibold">
                          <span>Coupon Discount</span>
                          <span>−₹{discountAmount}</span>
                        </div>
                      )}
                      {hasProducts && (
                        <div className="flex justify-between items-center">
                          <span>Delivery</span>
                          {shippingFee > 0 ? (
                            <span className="font-bold text-amber-950">₹{shippingFee}</span>
                          ) : (
                            <span className="text-green-700 font-bold text-xs bg-green-50 px-2 py-0.5 rounded border border-green-200">FREE</span>
                          )}
                        </div>
                      )}
                      <div className="pt-3 border-t border-amber-200 flex justify-between font-black text-xl text-amber-950">
                        <span>Total to Pay</span>
                        <span className="text-[#8B1A21]">₹{finalTotal}</span>
                      </div>
                    </div>

                    <button
                      onClick={initiatePayment}
                      disabled={processing}
                      className="w-full h-14 checkout-pay-btn flex items-center justify-center gap-2 text-lg font-black rounded-xl"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" />
                          {paymentMethod === 'cod' ? `Confirm Order ₹${finalTotal} (COD)` : `Pay ₹${finalTotal} Securely`}
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[11px] text-amber-700 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" /> Divya Yagyam Secure Checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sankalp Modal */}
      <Dialog open={showSankalpModal} onOpenChange={setShowSankalpModal}>
        <DialogContent className="sm:max-w-[440px] border-amber-200">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-amber-950">
              <span className="text-[#8B1A21] text-2xl font-black">ॐ</span> संकल्प विवरण
            </DialogTitle>
            <DialogDescription className="text-amber-800">
              कृपया पूजा में संकल्प के लिए अपना गोत्र और उद्देश्य भरें।
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-amber-900 font-semibold text-xs uppercase tracking-wide">Gotra (गोत्र)</Label>
              <Input
                value={sankalp.gotra}
                onChange={e => setSankalp({...sankalp, gotra: e.target.value})}
                placeholder="e.g. Kashyap (कश्यप)"
                className="border-amber-200 focus:border-[#8B1A21]/60 bg-amber-50/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-amber-900 font-semibold text-xs uppercase tracking-wide">पूजा का उद्देश्य / मन्नत</Label>
              <textarea
                value={sankalp.purpose}
                onChange={e => setSankalp({...sankalp, purpose: e.target.value})}
                className="flex min-h-[80px] w-full rounded-lg border border-amber-200 bg-amber-50/30 px-3 py-2 text-sm placeholder:text-amber-900/35 focus:outline-none focus:border-[#8B1A21]/50 focus:ring-2 focus:ring-[#8B1A21]/10 resize-none"
                placeholder="e.g. For good health and prosperity in family"
              />
            </div>

            <div className="flex items-start space-x-2 p-3.5 bg-amber-50 rounded-xl border border-amber-200">
              <Checkbox
                id="terms"
                checked={acceptedTnC}
                onCheckedChange={(checked) => setAcceptedTnC(checked as boolean)}
              />
              <div className="grid gap-1 leading-none">
                <label htmlFor="terms" className="text-sm font-semibold text-amber-950 cursor-pointer">
                  Terms & Conditions स्वीकार करें
                </label>
                <p className="text-[11px] text-amber-800">
                  मैं संकल्प के लिए दी गई जानकारी सही होने की पुष्टि करता/करती हूं।
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={!acceptedTnC || processing}
              onClick={() => {
                setShowSankalpModal(false)
                handlePayment()
              }}
              className="w-full h-12 checkout-pay-btn text-base font-bold"
            >
              {processing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Confirm & Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

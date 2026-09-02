'use client'

import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image';
import Script from 'next/script'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2, Heart, CheckCircle2, ChevronRight, ArrowLeft, ShieldCheck, Wallet, CreditCard, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PaymentTrustBadge } from '@/components/payment-trust-badge'
import { getSafeImageUrl } from '@/lib/utils'

function BookingForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pujaId = searchParams.get('pujaId')
  const packageKey = searchParams.get('package') || '1'

  const [puja, setPuja] = useState<any>(null)
  const [dbOfferings, setDbOfferings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [successBooking, setSuccessBooking] = useState<any>(null)

  // Step state: 'sankalp' | 'payment'
  const [step, setStep] = useState<'sankalp' | 'payment'>('sankalp')

  // Devotee details
  const [devoteeName, setDevoteeName] = useState('')
  const [devoteePhone, setDevoteePhone] = useState('')
  const [devoteeEmail, setDevoteeEmail] = useState('')
  const [gotra, setGotra] = useState('Kashyap')
  const [fatherHusbandName, setFatherHusbandName] = useState('')
  const [sankalpPurpose, setSankalpPurpose] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(true)
  
  // Dynamic family members list (based on packageKey count)
  const memberCount = Number(packageKey) || 1
  const [familyNames, setFamilyNames] = useState<string[]>(Array(memberCount - 1).fill(''))

  // Selected offerings (IDs)
  const [selectedOfferingIds, setSelectedOfferingIds] = useState<string[]>([])

  // Extra standard add-ons
  const [addCourier, setAddCourier] = useState(true)
  const [addDakshina, setAddDakshina] = useState(false)
  const [selectPanditChoice, setSelectPanditChoice] = useState(true)

  useEffect(() => {
    if (!pujaId) {
      toast.error('Puja selection is required')
      setLoading(false)
      return
    }

    const loadData = async () => {
      try {
        // 1. Optional User Profile Auto-fill (Guest allowed, never blocks)
        try {
          const profileRes = await fetch('/api/profile')
          if (profileRes.ok) {
            const profileData = await profileRes.json()
            if (profileData?.ok && profileData.user) {
              if (profileData.user.fullName) setDevoteeName(profileData.user.fullName)
              if (profileData.user.phone) setDevoteePhone(profileData.user.phone)
              if (profileData.user.email) setDevoteeEmail(profileData.user.email)
              if (profileData.user.customerProfile?.gotra) setGotra(profileData.user.customerProfile.gotra)
            }
          }
        } catch {}

        // 2. Load Puja Data
        const pujaRes = await fetch(`/api/bookings?pujaId=${pujaId}`)
        const pujaData = await pujaRes.json()
        if (pujaData.ok) {
          setPuja(pujaData.data)
        } else {
          toast.error(pujaData.error || 'Failed to fetch puja details')
        }

        // 3. Load Offerings
        const offeringsRes = await fetch('/api/bhaktiseva')
        const offeringsData = await offeringsRes.json()
        const fetchedOfferings = offeringsData.offerings || offeringsData.data || []
        setDbOfferings(fetchedOfferings.filter((o: any) => o.isActive !== false))
      } catch {
        toast.error('Error loading data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [pujaId])

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (!puja && !successBooking) {
    return (
      <div className="text-center py-10 space-y-4">
        <h2 className="text-xl font-bold text-destructive">Puja details not found.</h2>
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  // Calculate pricing
  const basePrice = Number(puja?.price) || 951
  const packageUpgrades: Record<string, number> = { '1': 0, '2': 550, '4': 1550, '6': 2550 }
  const packagePrice = basePrice + (packageUpgrades[packageKey] ?? 0)

  let showPanditChoice = false
  let assignedPandit: any = null
  if (puja?.customHtml) {
    try {
      const parsed = JSON.parse(puja.customHtml)
      showPanditChoice = !!parsed.showPanditChoice
      if (parsed.assignedPandit && parsed.assignedPandit.name) {
        assignedPandit = parsed.assignedPandit
      }
    } catch (e) {}
  }

  let addOnsTotal = 0
  if (addCourier) addOnsTotal += 99
  if (addDakshina) addOnsTotal += 251

  selectedOfferingIds.forEach(id => {
    const matched = dbOfferings.find(o => o.id === id)
    if (matched) {
      addOnsTotal += Number(matched.price) || 0
    }
  })

  const finalTotal = packagePrice + addOnsTotal

  const handleMemberNameChange = (index: number, val: string) => {
    const copy = [...familyNames]
    copy[index] = val
    setFamilyNames(copy)
  }

  const toggleOffering = (id: string) => {
    setSelectedOfferingIds(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    )
  }

  // Proceed from Sankalp step to Payment step
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) {
      toast.error('कृपया आगे बढ़ने के लिए नियमों व शर्तों को स्वीकार करें।')
      return
    }
    if (!devoteeName.trim()) {
      toast.error('कृपया यजमान का नाम दर्ज करें।')
      return
    }
    if (!devoteePhone.trim() || devoteePhone.trim().replace(/\D/g, '').length < 10) {
      toast.error('कृपया 10 अंकों का वैध व्हाट्सएप नंबर दर्ज करें।')
      return
    }
    setStep('payment')
    toast.success('संकल्प विवरण सुरक्षित हो गया। कृपया दक्षिणा भुगतान संपन्न करें।')
  }

  // Final booking execution
  async function handleConfirmBooking() {
    if (!puja) return

    setBooking(true)
    
    // Prepare structured members array
    const membersList = familyNames.filter(Boolean).map(name => ({ name }))

    const finalSankalpPurpose = [
      sankalpPurpose,
      (showPanditChoice && selectPanditChoice) ? `[Pandit Choice: ${assignedPandit?.name || 'Pt. Mukesh Bohra'}]` : ''
    ].filter(Boolean).join(' | ')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pujaId: puja.id,
          devoteeName: devoteeName.trim(),
          phone: devoteePhone.trim(),
          email: devoteeEmail.trim() || undefined,
          fatherHusbandName: fatherHusbandName.trim() || 'Self',
          gotra: gotra.trim() || 'Kashyap',
          sankalpPurpose: finalSankalpPurpose,
          members: membersList,
          selectedOfferingIds,
          addCourier,
          addDakshina,
          packageKey
        }),
      })
      const data = await res.json()
      if (!data.ok) {
        toast.error(data.error || 'Failed to complete booking')
        setBooking(false)
        return
      }

      if (data.mode === 'manual' || !data.paymentData) {
        // Payment gateway unavailable — booking saved but NOT paid yet.
        toast.info(data.message || 'Booking saved. Our team will contact you to complete payment.')
        setBooking(false)
        return
      }

      const { orderId, amount, currency, razorpayKeyId } = data.paymentData
      const bookingPaymentId = data.paymentData?.paymentId || null

      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        toast.error('Payment system is still loading. Please try again in a moment.')
        setBooking(false)
        return
      }

      if (typeof window !== 'undefined' && (window as any).fbq) {
        try {
          (window as any).fbq('track', 'InitiateCheckout', {
            value: Math.round(amount / 100),
            currency: 'INR',
            content_name: puja.name,
          })
        } catch (e) {}
      }

      const rzp = new (window as any).Razorpay({
        key: razorpayKeyId,
        amount,
        currency,
        name: 'DivyaYagyam (दिव्ययज्ञम्)',
        description: `Payment for ${puja.name || 'Puja Booking'}`,
        order_id: orderId,
        prefill: {
          name: devoteeName,
          contact: devoteePhone,
          email: devoteeEmail,
        },
        theme: { color: '#FF6600' },
        modal: {
          ondismiss: () => {
            setBooking(false)
            toast.info('Payment cancelled. Your booking is saved but not confirmed yet.')
          },
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: bookingPaymentId,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.ok && verifyData.verified) {
              const params = new URLSearchParams()
              params.set('type', 'booking')
              if (data.data?.bookingNumber) params.set('order', data.data.bookingNumber)
              if (verifyData.razorpay_payment_id) params.set('payment', verifyData.razorpay_payment_id)
              window.location.href = `/checkout/thank-you?${params.toString()}`
            } else {
              toast.error('Payment verification failed. If money was deducted, please contact support with booking: ' + data.data.bookingNumber)
              setBooking(false)
            }
          } catch {
            toast.error('Could not confirm payment. If money was deducted, please contact support with booking: ' + data.data.bookingNumber)
            setBooking(false)
          }
        },
      })
      rzp.on('payment.failed', (response: any) => {
        setBooking(false)
        toast.error(response.error?.description || 'Payment failed')
      })
      rzp.open()
    } catch {
      toast.error('Network error during booking confirmation')
      setBooking(false)
    }
  }

  if (successBooking) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Card className="border-2 border-green-200 bg-green-50/30 rounded-3xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-green-800">Sankalp & Payment Success!</h1>
              <p className="text-muted-foreground text-xs">
                Your Sankalp Patra and Payment of ₹{finalTotal} have been recorded successfully.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border text-left space-y-2 text-xs shadow-sm">
              <div className="flex justify-between border-b pb-2 font-semibold text-slate-700">
                <span>Booking Reference:</span>
                <span className="font-mono text-orange-600">{successBooking.bookingNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Puja Anusthan:</span>
                <span className="font-medium text-slate-800">{puja?.name || 'Sacred Ritual'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Devotee:</span>
                <span className="font-medium text-slate-800">{devoteeName}</span>
              </div>
              {gotra && (
                <div className="flex justify-between py-1">
                  <span>Gotra:</span>
                  <span className="font-medium text-slate-800">{gotra}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-t pt-2 font-bold text-slate-800">
                <span>Amount Paid:</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl">
                <Link href="/dashboard/bookings">View Bookings</Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    <div className="min-h-screen bg-[#FAF8F5] pb-24 md:pb-12 text-[#1C1614]">
      {/* Top Sacred Trust Header Bar */}
      <div className="bg-gradient-to-r from-[#7A1521] via-[#901323] to-[#7A1521] text-white py-2 px-4 text-center text-xs font-semibold shadow-xs">
        <span>ॐ श्री गणेशाय नमः • पावन नाम-गोत्र संकल्प पत्र</span>
      </div>

      <div className="max-w-4xl mx-auto py-5 sm:py-8 px-3 sm:px-4 space-y-5">
        
        {/* Navigation & Stepper Header */}
        <div className="flex items-center justify-between gap-2 bg-white p-3 sm:p-4 rounded-2xl border border-[#EFE4D6] shadow-2xs">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1.5 text-xs font-bold text-[#7A1521] hover:text-[#FF6600] hover:bg-[#FFF3E8] rounded-xl px-2.5 h-9 shrink-0" 
            onClick={() => {
              if (step === 'payment') setStep('sankalp')
              else router.back()
            }}
          >
            <ArrowLeft className="h-4 w-4" /> 
            <span>{step === 'payment' ? 'विवरण बदलें' : 'वापस'}</span>
          </Button>

          {/* Stepper Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-black">
            <span className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
              step === 'sankalp' 
                ? 'bg-[#FF6600] text-white shadow-xs' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {step === 'payment' ? '✓' : '1.'} संकल्प विवरण
            </span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
              step === 'payment' 
                ? 'bg-[#FF6600] text-white shadow-xs' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              2. सुरक्षित दक्षिणा
            </span>
          </div>
        </div>

        {/* Selected Puja Summary Card */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EFE4D6] shadow-2xs flex items-center gap-3.5">
          {puja.coverImage && (
            <img 
              src={getSafeImageUrl(puja.coverImage)} 
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover border border-[#EFE4D6] shrink-0 bg-slate-900" 
              alt={puja.name} 
            />
          )}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#7A1521] text-white">
                {puja.isVip ? '👑 VIP महापूजा' : '🪔 पावन अनुष्ठान'}
              </span>
              <span className="text-[11px] font-semibold text-[#6B5E57] truncate">
                📍 {puja.temple?.name || 'सिद्ध शक्ति पीठ'}
              </span>
            </div>
            <h2 className="font-black text-[#1C1614] text-sm sm:text-base leading-tight line-clamp-2">
              {puja.name}
            </h2>
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <span className="text-xs font-bold text-[#FF6600] bg-[#FFF3E8] px-2 py-0.5 rounded-md border border-[#FFD2B0]">
                {memberCount} यजमान पैकेज • ₹{packagePrice}
              </span>
              <span className="text-xs font-bold text-emerald-700 hidden sm:inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% शास्त्रोक्त संकल्प
              </span>
            </div>
          </div>
        </div>

        {/* ── STEP 1: SANKALP FORM (PRIORITY: Form fields first on mobile) ── */}
        {step === 'sankalp' && (
          <div className="space-y-5">
            
            {/* Primary Devotee Form Card */}
            <form onSubmit={handleProceedToPayment} id="sankalp-form" className="space-y-5">
              <Card className="border border-[#EFE4D6] shadow-sm rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-gradient-to-r from-[#FFF3E8] to-white border-b border-[#EFE4D6] py-3.5 px-4 sm:px-6">
                  <CardTitle className="text-sm sm:text-base font-black flex items-center gap-2 text-[#1C1614]">
                    <Heart className="h-4 w-4 text-[#FF6600] fill-[#FF6600]" /> 
                    <span>मुख्य यजमान संकल्प विवरण (Sankalp Details)</span>
                  </CardTitle>
                  <CardDescription className="text-[11px] text-[#6B5E57]">
                    आचार्यों द्वारा इसी नाम और गोत्र से पवित्र मन्त्रोच्चार व आहुति दी जाएगी।
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6 space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1614]">
                      मुख्य यजमान का पूरा नाम * (Devotee Full Name)
                    </Label>
                    <Input
                      placeholder="उदा. रमेश शर्मा / Ramesh Sharma"
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      required
                      className="h-11 text-base sm:text-sm rounded-xl border-[#EFE4D6] focus:border-[#FF6600] bg-[#FFFDF9]"
                    />
                  </div>

                  {/* WhatsApp Phone Number */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-[#1C1614]">
                        व्हाट्सएप मोबाइल नंबर * (WhatsApp Phone)
                      </Label>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        📹 वीडियो प्रमाण हेतु
                      </span>
                    </div>
                    <Input
                      placeholder="उदा. 9876543210 (10 अंक)"
                      type="tel"
                      value={devoteePhone}
                      onChange={(e) => setDevoteePhone(e.target.value)}
                      required
                      className="h-11 text-base sm:text-sm rounded-xl border-[#EFE4D6] focus:border-[#FF6600] bg-[#FFFDF9]"
                    />
                    <p className="text-[10px] text-[#6B5E57]">
                      आपके संकल्प का व्यक्तिगत HD वीडियो इसी व्हाट्सएप नंबर पर प्रेषित किया जाएगा।
                    </p>
                  </div>

                  {/* Gotra with Instant Kashyap Suggestion Pill */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-[#1C1614]">गोत्र (Gotra) *</Label>
                      <button
                        type="button"
                        onClick={() => setGotra('कश्यप (Kashyap)')}
                        className="text-[10px] text-[#FF6600] font-black hover:underline cursor-pointer bg-[#FFF3E8] px-2 py-0.5 rounded border border-[#FFD2B0]"
                      >
                        + कश्यप गोत्र चुनें
                      </button>
                    </div>
                    <Input
                      placeholder="कश्यप / भारद्वाज / गर्ग / वशिष्ठ..."
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      required
                      className="h-11 text-base sm:text-sm rounded-xl border-[#EFE4D6] focus:border-[#FF6600] bg-[#FFFDF9]"
                    />
                    <p className="text-[10px] text-[#7A1521] font-medium bg-[#FFF3E8] p-2 rounded-xl border border-[#EFE4D6]">
                      शास्त्रोक्त नियम: यदि अपना गोत्र ज्ञात न हो तो 'कश्यप' गोत्र से संकल्प पूर्णतः शास्त्र-सम्मत होता है।
                    </p>
                  </div>

                  {/* Multi-member names if package includes family */}
                  {memberCount > 1 && (
                    <div className="space-y-3 border-t border-[#EFE4D6] pt-3">
                      <span className="text-xs font-bold text-[#1C1614]">
                        परिवार के अन्य सदस्य ({memberCount - 1} सदस्य संकल्प में सम्मिलित)
                      </span>
                      {Array.from({ length: memberCount - 1 }).map((_, index) => (
                        <div key={index} className="space-y-1">
                          <Label className="text-[10px] text-[#6B5E57]">सदस्य {index + 2} का नाम</Label>
                          <Input
                            placeholder={`सदस्य ${index + 2} का नाम`}
                            value={familyNames[index] || ''}
                            onChange={(e) => handleMemberNameChange(index, e.target.value)}
                            className="h-11 text-base sm:text-sm rounded-xl border-[#EFE4D6] bg-[#FFFDF9]"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Father/Husband Name (Optional) */}
                  <div className="space-y-1.5 border-t border-[#EFE4D6] pt-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-[#1C1614]">पिता / पति का नाम</Label>
                      <span className="text-[10px] text-[#6B5E57]">वैकल्पिक</span>
                    </div>
                    <Input
                      placeholder="उदा. श्री सुरेश शर्मा (यदि उपलब्ध हो)"
                      value={fatherHusbandName}
                      onChange={(e) => setFatherHusbandName(e.target.value)}
                      className="h-11 text-base sm:text-sm rounded-xl border-[#EFE4D6] bg-[#FFFDF9]"
                    />
                  </div>

                  {/* Sankalp Purpose / Wish */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1614]">
                      विशेष मनोकामना / संकल्प उद्देश्य (वैकल्पिक)
                    </Label>
                    <Textarea
                      placeholder="उदा. व्यापार वृद्धि, रोग निवारण, परिवार कल्याण, शीघ्र विवाह व सुख-शांति..."
                      value={sankalpPurpose}
                      onChange={(e) => setSankalpPurpose(e.target.value)}
                      rows={2}
                      className="text-base sm:text-sm rounded-xl border-[#EFE4D6] bg-[#FFFDF9]"
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-2 border-t border-[#EFE4D6] pt-3">
                    <Checkbox 
                      id="termsAccept" 
                      checked={acceptTerms} 
                      onCheckedChange={(val) => setAcceptTerms(!!val)} 
                      className="mt-0.5" 
                    />
                    <Label htmlFor="termsAccept" className="text-xs leading-tight text-[#4A3E39] cursor-pointer">
                      मैं दिव्ययज्ञम् के <Link href="/terms" target="_blank" className="text-[#FF6600] font-bold hover:underline">नियमों व शर्तों</Link> से सहमत हूँ।
                    </Label>
                  </div>

                  {/* Desktop Submit Button (Hidden on Mobile, handled by Sticky Bar) */}
                  <div className="hidden md:block pt-2">
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-sm font-black bg-gradient-to-r from-[#FF6600] to-[#FF8500] hover:from-[#E65C00] hover:to-[#FF6600] text-white rounded-xl shadow-md transition-all active:scale-[0.98]"
                    >
                      <span>सुरक्षित दक्षिणा भुगतान हेतु आगे बढ़ें (₹{finalTotal})</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>

            {/* Optional Enhancements & Add-ons Section (Cleanly placed below the form) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-black text-xs uppercase tracking-wider text-[#7A1521] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF6600]" />
                  <span>अतिरिक्त शुभ सेवा व अर्पण (Optional Add-ons)</span>
                </h3>
                <span className="text-[10px] text-[#6B5E57] font-semibold">इच्छानुसार जोड़ें</span>
              </div>

              {/* Pandit Ji Choice Option */}
              {showPanditChoice && (
                <div 
                  className={`p-3.5 sm:p-4 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                    selectPanditChoice ? 'border-[#FF6600] bg-[#FFF3E8]/60 shadow-xs' : 'border-[#EFE4D6] bg-white'
                  }`}
                  onClick={() => setSelectPanditChoice(!selectPanditChoice)}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={selectPanditChoice} 
                      onCheckedChange={(val) => setSelectPanditChoice(!!val)} 
                    />
                    <img 
                      src={getSafeImageUrl(assignedPandit?.photo || '/pandit_mukesh_bohra.jpg')} 
                      className="h-11 w-11 rounded-full object-cover border-2 border-amber-400 shrink-0" 
                      alt={assignedPandit?.name || 'पं. मुकेश बोहरा'} 
                      onError={(e) => { e.currentTarget.src = '/pandit_mukesh_bohra.jpg' }}
                    />
                    <div className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-black text-[#1C1614]">
                          पंडित जी चॉइस — {assignedPandit?.name || 'पं. मुकेश बोहरा'}
                        </h4>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                          ✓ मुख्य आचार्य
                        </span>
                      </div>
                      <p className="text-[#6B5E57] text-[10px]">
                        27+ वर्ष अनुभवी पीठाधीश्वर द्वारा विशेष संकल्प
                      </p>
                    </div>
                  </div>
                  <Badge className={selectPanditChoice ? "bg-[#FF6600] text-white font-black text-[10px]" : "bg-slate-100 text-slate-700 text-[10px]"}>
                    {selectPanditChoice ? '✓ चयनित' : 'जोड़ें'}
                  </Badge>
                </div>
              )}

              {/* Courier & Dakshina 2-Col Grid */}
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div 
                  className={`p-3.5 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${addCourier ? 'border-[#FF6600] bg-[#FFF3E8]/40 shadow-2xs' : 'border-[#EFE4D6] bg-white'}`} 
                  onClick={() => setAddCourier(!addCourier)}
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox checked={addCourier} onCheckedChange={() => setAddCourier(!addCourier)} />
                    <div className="text-xs">
                      <h4 className="font-bold text-[#1C1614]">📦 पावन प्रसाद कूरियर</h4>
                      <p className="text-[#6B5E57] text-[10px]">घर पर सुरक्षित डिलीवरी</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#FF6600]">+₹99</span>
                </div>

                <div 
                  className={`p-3.5 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${addDakshina ? 'border-[#FF6600] bg-[#FFF3E8]/40 shadow-2xs' : 'border-[#EFE4D6] bg-white'}`} 
                  onClick={() => setAddDakshina(!addDakshina)}
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox checked={addDakshina} onCheckedChange={() => setAddDakshina(!addDakshina)} />
                    <div className="text-xs">
                      <h4 className="font-bold text-[#1C1614]">🙏 पंडित दक्षिणा</h4>
                      <p className="text-[#6B5E57] text-[10px]">वेदाचार्यों को विशेष दक्षिणा</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#FF6600]">+₹251</span>
                </div>
              </div>

              {/* Extra Offerings List */}
              {dbOfferings.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-[#6B5E57] block px-1">
                    सिद्ध यंत्र व पावन अर्पण (Temple Offerings):
                  </span>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {dbOfferings.map((offering) => {
                      const isSelected = selectedOfferingIds.includes(offering.id)
                      return (
                        <div
                          key={offering.id}
                          className={`p-3 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                            isSelected ? 'border-[#FF6600] bg-[#FFF3E8]/50 shadow-2xs' : 'border-[#EFE4D6] bg-white'
                          }`}
                          onClick={() => toggleOffering(offering.id)}
                        >
                          <div className="flex gap-2.5 items-center">
                            <Checkbox checked={isSelected} onCheckedChange={() => toggleOffering(offering.id)} />
                            <div className="text-xs">
                              <h4 className="font-bold text-[#1C1614] line-clamp-1">{offering.name}</h4>
                              <p className="text-[10px] text-[#6B5E57] line-clamp-1">{offering.description || 'सिद्ध शक्तिपीठ अर्पण'}</p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-[#FF6600] shrink-0">+₹{Number(offering.price)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Fixed Bottom Action Bar for Step 1 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EFE4D6] px-4 py-2.5 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))]">
              <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#6B5E57] font-bold uppercase tracking-tight">कुल दक्षिणा:</span>
                  <span className="text-xl font-black text-[#FF6600]">₹{finalTotal}</span>
                </div>
                <Button 
                  type="submit" 
                  form="sankalp-form"
                  className="h-11 px-5 text-xs font-black bg-gradient-to-r from-[#FF6600] to-[#FF8500] active:scale-95 text-white rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <span>भुगतान हेतु आगे बढ़ें</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </div>
        )}

        {/* ── STEP 2: PAYMENT INTERFACE ── */}
        {step === 'payment' && (
          <div className="space-y-5">
            <Card className="border border-[#EFE4D6] shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader className="bg-gradient-to-r from-[#FFF3E8] to-white border-b border-[#EFE4D6] py-3.5 px-4 sm:px-6">
                <CardTitle className="text-sm sm:text-base font-black flex items-center gap-2 text-[#1C1614]">
                  <CreditCard className="h-4 w-4 text-[#FF6600]" /> 
                  <span>सुरक्षित दक्षिणा भुगतान (Confirm & Pay)</span>
                </CardTitle>
                <CardDescription className="text-[11px] text-[#6B5E57]">
                  विवरण सत्यापित करें और UPI / कार्ड द्वारा सुरक्षित दक्षिणा अर्पित करें।
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 space-y-4">
                
                {/* Devotee Summary Pill */}
                <div className="p-4 bg-[#FFF9F3] rounded-2xl border border-[#FFD2B0] space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-[#FFD2B0]/60 pb-2">
                    <span className="font-black text-[#7A1521]">संकल्प यजमान सारांश:</span>
                    <button 
                      type="button" 
                      onClick={() => setStep('sankalp')} 
                      className="text-[11px] font-bold text-[#FF6600] hover:underline"
                    >
                      संशोधन करें (Edit)
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[#1C1614]">
                    <div>
                      <span className="text-[10px] text-[#6B5E57] block">यजमान नाम:</span>
                      <span className="font-bold">{devoteeName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B5E57] block">व्हाट्सएप नंबर:</span>
                      <span className="font-bold">{devoteePhone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B5E57] block">गोत्र:</span>
                      <span className="font-bold">{gotra}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B5E57] block">पैकेज दक्षिणा:</span>
                      <span className="font-bold text-[#FF6600]">₹{packagePrice}</span>
                    </div>
                  </div>
                </div>

                {/* Total Payable Box */}
                <div className="p-4 bg-[#FFF3E8] rounded-2xl text-center space-y-1 border border-[#FFD2B0]">
                  <span className="text-xs text-[#6B5E57] font-bold">कुल संकल्प दक्षिणा (Total Amount)</span>
                  <div className="text-3xl sm:text-4xl font-black text-[#FF6600]">₹{finalTotal}</div>
                  <p className="text-[10px] text-[#7A1521] font-semibold">
                    (पूजा सामग्री, वैदिक आहुति, वीडियो प्रमाण एवं पावन प्रसाद सम्मिलित)
                  </p>
                </div>

                {/* UPI Quick Trust Badges */}
                <div className="p-3 bg-white rounded-xl border border-[#EFE4D6] space-y-1.5">
                  <span className="text-[10px] font-bold text-[#6B5E57] uppercase tracking-wider block text-center">
                    Instant 1-Click UPI & Card Payment
                  </span>
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-slate-700">
                    <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">GPay</span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">PhonePe</span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Paytm</span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">BHIM</span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200">Cards</span>
                  </div>
                </div>

                {/* Desktop Pay Button */}
                <div className="hidden md:block">
                  <Button 
                    onClick={handleConfirmBooking} 
                    disabled={booking} 
                    className="w-full h-12 text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {booking ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> भुगतान प्रक्रियाधीन है...
                      </span>
                    ) : (
                      <>
                        <Wallet className="h-4 w-4" /> सुरक्षित दक्षिणा भुगतान करें (₹{finalTotal}) 🔒
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-800 font-bold bg-emerald-50 py-2.5 px-3 rounded-xl border border-emerald-200 text-center">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" /> 
                  <span>100% सुरक्षित भुगतान • व्हाट्सएप लाइव वीडियो संकल्प • पावन प्रसाद डिलीवरी</span>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Fixed Bottom Action Bar for Step 2 */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EFE4D6] px-4 py-2.5 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))]">
              <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#6B5E57] font-bold uppercase tracking-tight">कुल देय:</span>
                  <span className="text-xl font-black text-emerald-700">₹{finalTotal}</span>
                </div>
                <Button 
                  onClick={handleConfirmBooking} 
                  disabled={booking} 
                  className="h-11 px-5 text-xs font-black bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl shadow-md flex items-center gap-1.5"
                >
                  {booking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      <span>दक्षिणा भुगतान करें 🔒</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

          </div>
        )}

        <PaymentTrustBadge className="mt-4" />
      </div>
    </div>
    </>
  )
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    }>
      <BookingForm />
    </Suspense>
  )
}

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
import { Loader2, Heart, CheckCircle2, ChevronRight, ArrowLeft, ShieldCheck, Wallet, CreditCard } from 'lucide-react'
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
  const [gotra, setGotra] = useState('Kashyap')
  const [fatherHusbandName, setFatherHusbandName] = useState('')
  const [sankalpPurpose, setSankalpPurpose] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  
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
        // 1. Auth check
        const profileRes = await fetch('/api/profile')
        if (profileRes.status === 401) {
          toast.error('Please login to continue with your booking.')
          router.push(`/login?callbackUrl=/bookings/new?pujaId=${pujaId}&package=${packageKey}`)
          return
        }

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
      toast.error('Please agree to the Terms & Conditions to proceed.')
      return
    }
    if (!devoteeName.trim()) {
      toast.error('Devotee Name is required')
      return
    }
    if (!fatherHusbandName.trim()) {
      toast.error('Father / Husband Name is required')
      return
    }
    setStep('payment')
    toast.success('Sankalp details captured. Please confirm payment.')
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
          devoteeName: devoteeName,
          fatherHusbandName: fatherHusbandName || 'N/A',
          gotra,
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

      const rzp = new (window as any).Razorpay({
        key: razorpayKeyId,
        amount,
        currency,
        name: 'Divyayagyam',
        description: `Payment for ${puja.name || 'Puja Booking'}`,
        order_id: orderId,
        prefill: {
          name: devoteeName,
        },
        theme: { color: '#ea580c' },
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
    <div className="max-w-5xl mx-auto py-10 px-4 grid gap-8 lg:grid-cols-12 items-start">
      
      {/* Left Column: Booking details & Add-ons */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => {
            if (step === 'payment') setStep('sankalp')
            else router.back()
          }}>
            <ArrowLeft className="h-4 w-4" /> {step === 'payment' ? 'Edit Sankalp' : 'Back to Details'}
          </Button>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className={step === 'sankalp' ? 'text-orange-600' : 'text-slate-400'}>1. Sankalp Form</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className={step === 'payment' ? 'text-orange-600' : 'text-slate-400'}>2. Payment Gateway</span>
          </div>
        </div>

        {/* Selected Puja Summary Card */}
        <Card className="border shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5 flex gap-4 items-center">
            {puja.coverImage && (
              <img src={getSafeImageUrl(puja.coverImage)} className="h-16 w-20 rounded-lg object-cover border" alt="Puja" />
            )}
            <div className="space-y-1">
              <h2 className="font-black text-slate-800 text-base">{puja.name}</h2>
              <p className="text-[11px] text-muted-foreground">📍 {puja.temple?.name || 'Holy Pilgrimage'}</p>
              <Badge variant="secondary" className="text-[10px] bg-orange-100 text-orange-800">
                {memberCount} Member Package — ₹{packagePrice}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic BhaktiSeva Offerings */}
        {step === 'sankalp' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase text-slate-700 tracking-wider">Enhance your Puja (अतिरिक्त सेवा)</h3>

            {/* Admin Controlled Pandit Ji Choice Tick Box */}
            {showPanditChoice && (
              <div 
                className={`p-4 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                  selectPanditChoice ? 'border-amber-500 bg-amber-50/40 shadow-sm' : 'border-slate-200 bg-white'
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
                    className="h-10 w-10 rounded-full object-cover border-2 border-amber-400 shrink-0" 
                    alt={assignedPandit?.name || 'पं. मुकेश बोहरा'} 
                    onError={(e) => {
                      e.currentTarget.src = '/pandit_mukesh_bohra.jpg';
                    }}
                  />
                  <div className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-800">
                        पंडित जी चॉइस (Pandit Ji Choice) — {assignedPandit?.name || 'पं. मुकेश बोहरा (Pt. Mukesh Bohra)'}
                      </h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-slate-500 text-[10px]">
                      {assignedPandit?.title || 'मुख्य पीठाधीश्वर व वेदाचार्य (माँ कात्यायनी शक्ति पीठ)'}
                    </p>
                  </div>
                </div>
                <Badge className={selectPanditChoice ? "bg-amber-500 text-slate-950 font-black text-[10px]" : "bg-slate-200 text-slate-700 font-bold text-[10px]"}>
                  {selectPanditChoice ? '✓ Selected' : 'Select'}
                </Badge>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${addCourier ? 'border-orange-500 bg-orange-50/20' : 'bg-white'}`} onClick={() => setAddCourier(!addCourier)}>
                <div className="flex items-center gap-3">
                  <Checkbox checked={addCourier} onCheckedChange={() => setAddCourier(!addCourier)} />
                  <div className="text-xs">
                    <h4 className="font-bold text-slate-800">Prasad Courier Fee</h4>
                    <p className="text-slate-500 text-[10px]">Pure home delivery</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-600">₹99</span>
              </div>

              <div className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${addDakshina ? 'border-orange-500 bg-orange-50/20' : 'bg-white'}`} onClick={() => setAddDakshina(!addDakshina)}>
                <div className="flex items-center gap-3">
                  <Checkbox checked={addDakshina} onCheckedChange={() => setAddDakshina(!addDakshina)} />
                  <div className="text-xs">
                    <h4 className="font-bold text-slate-800">Pandit Dakshina</h4>
                    <p className="text-slate-500 text-[10px]">Offer special dakshina</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-600">₹251</span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-600">Sacred Offerings & Yantras</span>

              {dbOfferings.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic">No extra offerings added yet.</p>
              ) : (
                dbOfferings.map((offering) => {
                  const isSelected = selectedOfferingIds.includes(offering.id)
                  return (
                    <div
                      key={offering.id}
                      className={`p-4 border rounded-2xl flex items-start justify-between cursor-pointer transition-all ${isSelected ? 'border-orange-500 bg-orange-50/20' : 'bg-white'}`}
                      onClick={() => toggleOffering(offering.id)}
                    >
                      <div className="flex gap-3 items-start max-w-[80%]">
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleOffering(offering.id)} className="mt-1" />
                        <div className="text-xs space-y-1">
                          <h4 className="font-bold text-slate-800">{offering.name}</h4>
                          <p className="text-[10px] text-slate-500 leading-snug">{offering.description || 'Sacred offering blessed at the temple.'}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-orange-600 shrink-0">₹{Number(offering.price)}</span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Step 2: Payment Method Interface */}
        {step === 'payment' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase text-slate-700 tracking-wider">Select Payment Gateway</h3>
            <Card className="border shadow-sm rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 border border-orange-500 bg-orange-50/20 rounded-xl">
                <CreditCard className="h-6 w-6 text-orange-600" />
                <div className="text-xs">
                  <h4 className="font-bold text-slate-800">Online Payment (UPI, Card, NetBanking)</h4>
                  <p className="text-slate-500">Pay securely via Razorpay payment gateway.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-slate-800">Sankalp Summary (संकल्प सारांश)</h4>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between">
                    <span>Devotee Name:</span>
                    <span className="font-bold text-slate-800">{devoteeName}</span>
                  </div>
                  {familyNames.filter(Boolean).length > 0 && (
                    <div className="flex justify-between">
                      <span>Family Members:</span>
                      <span className="font-bold text-slate-800">{familyNames.filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Gotra:</span>
                    <span className="font-bold text-slate-800">{gotra}</span>
                  </div>
                  {sankalpPurpose && (
                    <div className="flex justify-between">
                      <span>Sankalp Purpose:</span>
                      <span className="font-bold text-slate-800 line-clamp-1 max-w-[150px]">{sankalpPurpose}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Puja Package Rate:</span>
                    <span className="font-bold text-slate-800">₹{packagePrice}</span>
                  </div>
                  {addOnsTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Add-ons & Offerings:</span>
                      <span className="font-bold text-slate-800">₹{addOnsTotal}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

      </div>

      {/* Right Column: Dynamic Form Switcher */}
      <div className="lg:col-span-5 space-y-6">
        <Card className="border shadow-md rounded-3xl overflow-hidden sticky top-6">
          <CardHeader className="bg-orange-50/40 border-b">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
              <Heart className="h-5 w-5 text-orange-600 fill-orange-600" /> 
              {step === 'sankalp' ? 'Sankalp Patra (संकल्प पत्र)' : 'Confirm Booking (भुगतान करें)'}
            </CardTitle>
            <CardDescription className="text-[11px]">
              {step === 'sankalp' ? 'पूजा संकल्प के लिए अपनी गोत्र और नाम की सही जानकारी भरें।' : 'विवरण सत्यापित करें और भुगतान पूरा करें।'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            {step === 'sankalp' ? (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Devotee Full Name * (मुख्य यजमान नाम)</Label>
                  <Input
                    placeholder="e.g. Ramesh Bohra"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                {memberCount > 1 && (
                  <div className="space-y-3 border-t pt-3">
                    <span className="text-xs font-bold text-slate-700">Family Members' Names</span>
                    {Array.from({ length: memberCount - 1 }).map((_, index) => (
                      <div key={index} className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">Member {index + 2} Name</Label>
                        <Input
                          placeholder={`e.g. Family Member ${index + 2}`}
                          value={familyNames[index] || ''}
                          onChange={(e) => handleMemberNameChange(index, e.target.value)}
                          required
                          className="h-9 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2 border-t pt-3">
                  <Label className="text-xs font-bold">Father / Husband Name *</Label>
                  <Input
                    placeholder="e.g. Suresh Bohra"
                    value={fatherHusbandName}
                    onChange={(e) => setFatherHusbandName(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold">Gotra (गोत्र) *</Label>
                  <Input
                    placeholder="Kashyap"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    required
                    className="h-10"
                  />
                  <p className="text-[10px] text-slate-500">यदि गोत्र ज्ञात न हो तो 'Kashyap' ही रहने दें।</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold">Sankalp Purpose / Description (संकल्प का उद्देश्य / विवरण)</Label>
                  <Textarea
                    placeholder="उदा. उत्तम स्वास्थ्य, मनोकामना पूर्ति, व्यापार वृद्धि, कोर्ट केस सफलता या सुख-शांति..."
                    value={sankalpPurpose}
                    onChange={(e) => setSankalpPurpose(e.target.value)}
                    rows={2}
                    className="text-xs bg-white"
                  />
                  <p className="text-[10px] text-slate-500">अपनी विशेष मनोकामना या संकल्प का मुख्य उद्देश्य यहाँ लिखें।</p>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start gap-2 border-t pt-3 pb-1 text-left">
                  <Checkbox id="termsAccept" checked={acceptTerms} onCheckedChange={(val) => setAcceptTerms(!!val)} />
                  <Label htmlFor="termsAccept" className="text-[11px] leading-tight text-slate-600 cursor-pointer">
                    I agree to the <Link href="/terms" target="_blank" className="text-orange-600 hover:underline font-bold">Terms & Conditions</Link> of DivyaYagyam.com
                  </Label>
                </div>

                <Button type="submit" className="w-full h-12 text-sm font-black bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow">
                  Proceed to Payment (₹{finalTotal}) <ChevronRight className="ml-1 h-4 w-4" />
                </Button>

              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50/40 rounded-2xl text-center space-y-1">
                  <span className="text-xs text-slate-500">Total Payable Amount</span>
                  <div className="text-3xl font-black text-orange-600">₹{finalTotal}</div>
                </div>

                <Button onClick={handleConfirmBooking} disabled={booking} className="w-full h-12 text-sm font-black bg-green-600 hover:bg-green-700 text-white rounded-xl shadow flex items-center justify-center gap-1.5">
                  {booking ? (
                    <span className="flex items-center justify-center"><Loader2 className="h-4 w-4 animate-spin" /> Processing Payment…
                    </span>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" /> Pay Now & Confirm (भुगतान करें)
                    </>
                  )}
                </Button>

                <Button variant="outline" className="w-full h-11 text-xs font-bold rounded-xl" onClick={() => setStep('sankalp')}>
                  Edit Sankalp Details
                </Button>

                <div className="flex items-center justify-center gap-1 text-[10px] text-green-700 font-semibold bg-green-50 py-2 rounded-lg">
                  <ShieldCheck className="h-4 w-4 shrink-0" /> Safe & Secure Payments • Divyayagyam Promise
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { 
  Sparkles, Award, UserCheck, Calendar, Clock, Video, Truck, ShieldCheck, 
  CheckCircle2, ArrowRight, PhoneCall, MessageCircle, Star, Flame, Check, Zap, MapPin, Crown, ChevronDown
} from 'lucide-react'
import { DevoteeSocialProof } from '@/components/ui/devotee-social-proof'
import { ProFormattedDescription } from '@/components/pro-formatted-description'

export interface SingleVipPujaProps {
  puja: {
    id: string
    name: string
    slug: string
    shortDescription?: string | null
    description?: string | null
    location?: string | null
    price: number | string
    vipPrice?: number | string | null
    coverImage?: string | null
    category?: { name: string } | null
    temple?: { name: string; coverImage?: string } | null
    faqs?: Array<{ question: string; answer: string }> | null
    assignedPandit?: {
      name: string
      title: string
      experience: string
      location: string
      photo: string
    } | null
    benefits?: string[]
  }
}

const timeSlotOptions = [
  { id: 'default', label: '⚡ संस्थान द्वारा तय शुभ मुहूर्त', desc: '11:00 AM अभिजित मुहूर्त (विद्वान पंडितों द्वारा अनुशंसित)' },
  { id: 'brahma', label: '🌅 ब्रह्म मुहूर्त / प्रातःकाल', desc: '06:00 AM - 09:00 AM (स्वास्थ्य एवं शांति हेतु)' },
  { id: 'abhijit', label: '☀️ अभिजित मुहूर्त / मध्याह्न', desc: '11:00 AM - 02:00 PM (कार्य सिद्धि एवं समृद्धि हेतु)' },
  { id: 'godhuli', label: '🌆 गोधूलि मुहूर्त / सायंकाल', desc: '05:00 PM - 08:00 PM (पारिवारिक सुख एवं कल्याण हेतु)' },
]

function VipPujaCountdownTimer({ puja }: { puja: any }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const rawDate = puja?.pujaDate
    let targetTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000)
    if (rawDate) {
      const parsed = new Date(rawDate).getTime()
      if (!isNaN(parsed) && parsed > new Date().getTime()) {
        targetTime = parsed
      }
    }

    const updateTimer = () => {
      const now = new Date().getTime()
      const diff = Math.max(0, targetTime - now)

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [puja?.id, puja?.name])

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#E6D6BE] bg-[#F7EBD7] text-[#292321] text-xs font-bold font-mono shadow-2xs">
      <Clock className="w-3.5 h-3.5 text-[#E58A16]" />
      <span>प्रारंभ समय: {String(timeLeft.days).padStart(2, '0')}d : {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
    </div>
  )
}

export function VipPujaSingleView({ puja }: SingleVipPujaProps) {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [devoteeName, setDevoteeName] = useState('')
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [gotra, setGotra] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('default')
  const [sankalpWish, setSankalpWish] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const displayPrice = Number(puja.vipPrice || puja.price || 15100)
  const categoryName = puja.category?.name || 'विशिष्ट VIP महा अनुष्ठान'
  const templeLocation = puja.location || puja.temple?.name || 'सिद्ध शक्तिपीठ, भारत'
  const coverImg = puja.coverImage || '/bagalamukhi_mirchi_hawan_2.jpg'

  const rawGallery = [
    ...(puja.coverImage ? [puja.coverImage] : []),
    ...((puja as any).galleryImages ? (typeof (puja as any).galleryImages === 'string' ? JSON.parse((puja as any).galleryImages) : (puja as any).galleryImages) : []),
    ...((puja as any).images || []).map((img: any) => typeof img === 'string' ? img : img?.url)
  ].filter((img: any) => Boolean(img) && typeof img === 'string' && !img.includes('package-'))

  const vipMediaList = Array.from(new Set(rawGallery.length > 0 ? rawGallery : [coverImg]))
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const currentVipImage = vipMediaList[activeMediaIndex] || coverImg

  let parsedPandit = puja.assignedPandit
  if (!parsedPandit && (puja as any).customHtml) {
    try {
      const parsed = JSON.parse((puja as any).customHtml)
      if (parsed.assignedPandit && parsed.assignedPandit.name) {
        parsedPandit = parsed.assignedPandit
      }
    } catch (e) {}
  }

  const assignedPandit = parsedPandit || {
    name: 'पं. मुकेश बोहरा जी',
    title: 'मुख्य वेदाचार्य एवं कर्मकांड प्रमुख (27+ वर्ष अनुभव)',
    experience: '27+ वर्ष वैदिक अनुभव',
    location: templeLocation,
    photo: '/pandit_mukesh_bohra.jpg'
  }

  const defaultFaqs = [
    {
      question: "VIP पूजा सामान्य पूजा से किस प्रकार भिन्न है?",
      answer: "VIP अनुष्ठान विशेष रूप से केवल आपके परिवार के लिए 1-on-1 संपन्न होता है। इसमें 5 वरिष्ठ वेदाचार्य आपके नाम-गोत्र से अखंड मंत्र जाप करते हैं और आपको व्हाट्सएप पर लाइव संकल्प वीडियो प्राप्त होता है।"
    },
    {
      question: "संकल्प के लिए नाम और गोत्र कैसे दें?",
      answer: "बुकिंग के समय या सीधे व्हाट्सएप पर आप अपना, अपने परिवार के सदस्यों का नाम, गोत्र व मनोकामना दर्ज कर सकते हैं।"
    },
    {
      question: "सिद्ध प्रसाद घर तक कैसे पहुँचेगा?",
      answer: "पूजन में अभिमंत्रित प्रसाद (पावन भस्म, रक्षासूत्र, रुद्राक्ष व कलावा) सुरक्षित एक्सप्रेस कोरियर द्वारा 3 से 5 कार्यदिवसों में आपके घर पहुँचाया जाता है।"
    },
    {
      question: "रिफंड एवं निरस्तीकरण की क्या नीति है?",
      answer: "यदि किसी मंदिर में अपरिहार्य स्थिति के कारण पूजा संपन्न न हो पाए, तो 100% पूर्ण रिफंड या अन्य शुभ तिथि पर पूजा पुनर्निधारित की जाती है।"
    }
  ]

  const faqList = puja.faqs && puja.faqs.length > 0 ? puja.faqs : defaultFaqs

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!devoteeName || !whatsappPhone) {
      alert('कृपया अपना नाम एवं व्हाट्सएप नंबर दर्ज करें।')
      return
    }

    const slotObj = timeSlotOptions.find(s => s.id === selectedTimeSlot)
    const slotText = slotObj ? slotObj.label : 'Default Auspicious Timing'
    const dateText = selectedDate ? selectedDate : 'Auspicious Date Recommended by Priest'

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pujaId: puja.id,
          devoteeName,
          phone: whatsappPhone,
          gotra: gotra || 'Kashyap',
          sankalpPurpose: sankalpWish || 'Overall Victory & Health',
          amount: displayPrice,
          isVipBooking: true
        })
      })

      const data = await res.json()
      const bookingNo = data?.data?.bookingNumber || 'DY-VIP-' + Math.floor(100000 + Math.random() * 900000)
      const enc = encodeURIComponent
      const message = `Namaste DivyaYagyam Team!%0A%0A*VIP Puja Booking Request:*%0A- *Booking ID:* ${enc(bookingNo)}%0A- *Puja:* ${enc(puja.name)}%0A- *Price:* ₹${displayPrice}%0A- *Devotee Name:* ${enc(devoteeName)}%0A- *WhatsApp Phone:* ${enc(whatsappPhone)}%0A- *Gotra:* ${enc(gotra || 'Kashyap')}%0A- *Preferred Date:* ${enc(dateText)}%0A- *Time Slot:* ${enc(slotText)}%0A- *Assigned Priest:* ${enc(assignedPandit.name)}%0A- *Sankalp Intention:* ${enc(sankalpWish || 'Overall Victory & Health')}`

      window.open(`https://wa.me/919530401984?text=${message}`, '_blank')
    } catch (err) {
      const enc = encodeURIComponent
      const message = `Namaste DivyaYagyam Team!%0A%0A*VIP Puja Booking Request:*%0A- *Puja:* ${enc(puja.name)}%0A- *Price:* ₹${displayPrice}%0A- *Devotee Name:* ${enc(devoteeName)}%0A- *WhatsApp Phone:* ${enc(whatsappPhone)}%0A- *Gotra:* ${enc(gotra || 'Kashyap')}%0A- *Preferred Date:* ${enc(dateText)}%0A- *Time Slot:* ${enc(slotText)}%0A- *Assigned Priest:* ${enc(assignedPandit.name)}%0A- *Sankalp Intention:* ${enc(sankalpWish || 'Overall Victory & Health')}`
      window.open(`https://wa.me/919530401984?text=${message}`, '_blank')
    } finally {
      setBookingDialogOpen(false)
    }
  }

  return (
    <div className="vip-puja-theme min-h-screen bg-[#FFF9EF] text-[#292321] pb-28 relative overflow-hidden notranslate" translate="no">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 max-w-6xl space-y-10 relative z-10">
        
        {/* ── SECTION 1: HERO CONTAINER ── */}
        <div className="bg-white rounded-3xl border border-[#E6D6BE] p-5 sm:p-8 md:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Media */}
            <div className="lg:col-span-5 relative space-y-3">
              <div className="relative aspect-[4/3] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-[#E6D6BE] bg-slate-900 shadow-md group">
                <Image 
                  src={currentVipImage} 
                  alt={puja.name} 
                  fill 
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-[#6B2635] text-white text-[10px] font-black uppercase tracking-wide shadow-xs border border-[#C99A3D]">
                    <Crown className="h-3 w-3 text-[#C99A3D]" /> VIP LIVE PUJA
                  </span>
                  <span className="bg-[#292321]/80 backdrop-blur-xs text-[#FFF9EF] text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/10">
                    {categoryName}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-4 text-left pointer-events-none">
                  <span className="text-[#E58A16] font-bold text-xs flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> व्यक्तिगत 1-on-1 महा अनुष्ठान
                  </span>
                  <p className="text-xs text-[#FFF9EF] font-semibold flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-[#C99A3D]" /> {templeLocation}
                  </p>
                </div>
              </div>

              {/* Thumbnails */}
              {vipMediaList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {vipMediaList.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMediaIndex(i)}
                      className={`relative h-12 w-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeMediaIndex === i ? 'border-[#E58A16] scale-105 shadow-xs' : 'border-[#E6D6BE] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Key Details */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EBD7] text-[#E58A16] text-xs font-bold border border-[#E6D6BE]">
                    <Sparkles className="h-3.5 w-3.5" /> शास्त्रोक्त विशिष्ट सेवा
                  </div>
                  <VipPujaCountdownTimer puja={puja} />
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#292321] leading-tight">
                  {puja.name}
                </h1>

                <p className="text-xs sm:text-sm text-[#4A403C] leading-relaxed font-normal">
                  {puja.shortDescription || '27+ वर्षों के अनुभवी वरिष्ठ आचार्यों द्वारा आपके परिवार के लिए व्यक्तिगत नाम-गोत्र संकल्प, समर्पित 5 वेदाचार्य दल एवं 1-on-1 लाइव व्हाट्सएप वीडियो स्ट्रीमिंग के साथ।'}
                </p>

                <div className="pt-1 border-t border-[#E6D6BE]">
                  <DevoteeSocialProof pujaId={puja.id} pujaName={puja.name} />
                </div>
              </div>

              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { icon: <Video className="h-4 w-4 text-[#E58A16]" />, label: '1-on-1 लाइव वीडियो' },
                  { icon: <ShieldCheck className="h-4 w-4 text-[#E58A16]" />, label: 'समर्पित निजी अनुष्ठान' },
                  { icon: <UserCheck className="h-4 w-4 text-[#E58A16]" />, label: 'आचार्य परामर्श' },
                  { icon: <Award className="h-4 w-4 text-[#E58A16]" />, label: 'नाम-गोत्र संकल्प' },
                ].map((chip) => (
                  <div key={chip.label} className="p-2.5 rounded-xl bg-[#F7EBD7]/50 border border-[#E6D6BE] flex items-center gap-2 text-xs font-bold text-[#292321]">
                    {chip.icon}
                    <span className="truncate">{chip.label}</span>
                  </div>
                ))}
              </div>

              {/* Price & CTA Button Box */}
              <div className="w-full p-4 sm:p-5 rounded-2xl bg-[#FFF9EF] border border-[#E6D6BE] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-[#665E58] block uppercase font-bold tracking-wide">न्यूनतम दक्षिणा राशि:</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#292321] tracking-tight">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> संपूर्ण पूजन सामग्री एवं प्रसाद डिलीवरी सम्मिलित
                  </span>
                </div>

                <button
                  onClick={() => setBookingDialogOpen(true)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#E58A16] hover:bg-[#d4790e] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Crown className="h-4 w-4" /> VIP पूजा बुक करें ➔
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── SECTION 2: PANDIT CREDIBILITY BOX ── */}
        <div className="bg-white rounded-2xl border border-[#E6D6BE] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xs">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#E58A16] shadow-sm shrink-0">
              <Image 
                src={assignedPandit.photo || '/pandit_mukesh_bohra.jpg'} 
                alt={assignedPandit.name}
                fill 
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-xs text-[#E58A16] font-bold uppercase tracking-wider block">
                👑 मुख्य विद्वान आचार्य
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#292321]">
                {assignedPandit.name}
              </h3>
              <p className="text-xs text-[#665E58] font-normal">
                {assignedPandit.title} • {assignedPandit.experience}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            <span className="px-3 py-1.5 rounded-xl bg-[#F7EBD7] border border-[#E6D6BE] text-[#292321] text-xs font-bold flex items-center gap-1.5">
              📜 वेद प्रमाणित आचार्य
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#F7EBD7] border border-[#E6D6BE] text-[#292321] text-xs font-bold flex items-center gap-1.5">
              🏛️ सिद्ध पीठ प्रामाणिकता
            </span>
          </div>
        </div>

        {/* ── SECTION: PUJA SIGNIFICANCE & DESCRIPTION ── */}
        {(puja.description || (puja as any).longDescription) && (
          <div className="bg-white rounded-3xl border border-[#E6D6BE] p-6 sm:p-10 shadow-xs space-y-6 text-[#292321]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E6D6BE] pb-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] text-xs font-bold uppercase tracking-widest">
                  ✨ महिमा एवं फलप्राप्ति
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#292321] tracking-wide">
                  पूजा अनुष्ठान का महत्व एवं लाभ
                </h2>
              </div>

              <div className="bg-[#F7EBD7] border border-[#E6D6BE] px-4 py-2 rounded-2xl text-center shrink-0">
                <p className="text-xl font-black text-[#8B1A21] font-heading">100%</p>
                <p className="text-[10px] text-[#665E58] uppercase font-bold tracking-wider">सिद्धि व शांतिप्रद</p>
              </div>
            </div>

            <div className="w-full space-y-4">
              <ProFormattedDescription 
                content={puja.description || (puja as any).longDescription || ''} 
                type="puja" 
              />
            </div>
          </div>
        )}

        {/* ── SECTION 3: VIP EXPERIENCE 3 PILLARS ── */}
        <div className="space-y-5">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E58A16]">
              🌟 विशिष्ट अनुभव
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292321]">
              VIP महा अनुष्ठान के पावन लाभ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl border border-[#E6D6BE] p-5 space-y-2.5 text-center flex flex-col items-center shadow-2xs">
              <div className="h-11 w-11 rounded-xl bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] flex items-center justify-center font-bold">
                <UserCheck className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-[#292321]">आचार्य से सीधा परामर्श</h4>
              <p className="text-xs text-[#4A403C] leading-relaxed">
                अनुष्ठान से पूर्व मुख्य वेदाचार्य द्वारा व्यक्तिगत मार्गदर्शन व विशेष संकल्प की रूपरेखा।
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E6D6BE] p-5 space-y-2.5 text-center flex flex-col items-center shadow-2xs">
              <div className="h-11 w-11 rounded-xl bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] flex items-center justify-center font-bold">
                <Video className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-[#292321]">1-on-1 लाइव वीडियो दर्शन</h4>
              <p className="text-xs text-[#4A403C] leading-relaxed">
                व्हाट्सएप वीडियो लिंक के माध्यम से परिवार सहित लाइव संकल्प व मुख्य आहुति के प्रत्यक्ष दर्शन।
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E6D6BE] p-5 space-y-2.5 text-center flex flex-col items-center shadow-2xs">
              <div className="h-11 w-11 rounded-xl bg-[#F7EBD7] border border-[#E6D6BE] text-[#E58A16] flex items-center justify-center font-bold">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-bold text-base text-[#292321]">नाम-गोत्र संकल्प व राजप्रसाद</h4>
              <p className="text-xs text-[#4A403C] leading-relaxed">
                पूर्ण मंत्र जाप के साथ विशेष अभिमंत्रित प्रसाद एवं यंत्र सुरक्षित कोरियर से घर डिलीवरी।
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: 5-STEP TIMELINE ── */}
        <div className="space-y-5">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E58A16]">
              📋 सरल एवं पारदर्शी प्रक्रिया
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292321]">
              5 चरणों में VIP अनुष्ठान यात्रा
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { step: '01', title: 'शुभ तिथि चयन', desc: 'अपनी सुविधा अनुसार तिथि चुनें या आचार्य से पूछें।' },
              { step: '02', title: 'विवरण व संकल्प', desc: 'नाम, गोत्र एवं विशेष मनोकामना दर्ज करें।' },
              { step: '03', title: 'आचार्य मार्गदर्शन', desc: 'व्हाट्सएप पर अनुष्ठान पूर्व तैयारी व चर्चा।' },
              { step: '04', title: 'लाइव संकल्प दर्शन', desc: '1-on-1 वीडियो कॉल में मंत्रोच्चार के साथ जुड़ें।' },
              { step: '05', title: 'प्रसाद घर प्राप्ति', desc: 'अभिमंत्रित पावन प्रसाद व रक्षासूत्र प्राप्त करें।' },
            ].map((st, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E6D6BE] p-4 space-y-1.5 text-center shadow-2xs">
                <div className="text-lg font-black text-[#E58A16]">Step {st.step}</div>
                <h4 className="font-bold text-xs sm:text-sm text-[#292321]">{st.title}</h4>
                <p className="text-[11px] text-[#665E58] leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 5: FAQ ACCORDION ── */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E58A16]">
              ❓ सामान्य प्रश्न
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292321]">
              अक्सर पूछे जाने वाले सवाल
            </h2>
          </div>

          <div className="space-y-2.5">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className="bg-white rounded-2xl border border-[#E6D6BE] overflow-hidden text-left shadow-2xs">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 font-bold text-[#292321] hover:text-[#E58A16] transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-[#E58A16] transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-[#4A403C] leading-relaxed border-t border-[#E6D6BE] pt-3 bg-[#FFF9EF]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* ── STICKY MOBILE BOTTOM BAR ── */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E6D6BE] p-3 z-40 sm:hidden flex items-center justify-between gap-3 shadow-lg">
        <div className="min-w-0 shrink-0">
          <span className="text-[9px] text-[#665E58] uppercase font-bold block">VIP दक्षिणा राशि</span>
          <span className="text-lg font-black text-[#292321]">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <button
          onClick={() => setBookingDialogOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#E58A16] hover:bg-[#d4790e] text-white font-extrabold text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          VIP पूजा बुक करें ➔
        </button>
      </div>

      {/* ── BOOKING MODAL DIALOG ── */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-lg bg-white border border-[#E6D6BE] text-[#292321] rounded-3xl p-6 shadow-2xl notranslate" translate="no">
          <DialogHeader className="text-left space-y-1.5 border-b border-[#E6D6BE] pb-3">
            <DialogTitle className="text-lg font-black text-[#292321] flex items-center gap-2">
              <Crown className="h-5 w-5 text-[#E58A16]" /> VIP पूजा संकल्प विवरण
            </DialogTitle>
            <DialogDescription className="text-xs text-[#665E58]">
              {puja.name} • दक्षिणा: <span className="text-[#292321] font-bold">₹{displayPrice.toLocaleString('en-IN')}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmBooking} className="space-y-3.5 pt-2 text-left">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#292321]">मुख्य यजमान का नाम (Devotee Full Name) *</Label>
              <Input
                required
                placeholder="उदा. रमेश कुमार शर्मा"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                className="bg-[#FFF9EF] border-[#E6D6BE] text-[#292321] placeholder:text-gray-400 focus:border-[#E58A16]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#292321]">व्हाट्सएप नंबर (WhatsApp No) *</Label>
                <Input
                  required
                  type="tel"
                  placeholder="उदा. 9876543210"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="bg-[#FFF9EF] border-[#E6D6BE] text-[#292321] placeholder:text-gray-400 focus:border-[#E58A16]"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#292321]">गोत्र (Gotra)</Label>
                <Input
                  placeholder="उदा. कश्यप / भारद्वाज"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  className="bg-[#FFF9EF] border-[#E6D6BE] text-[#292321] placeholder:text-gray-400 focus:border-[#E58A16]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#292321]">पसंदीदा तिथि (Preferred Date)</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#FFF9EF] border-[#E6D6BE] text-[#292321] focus:border-[#E58A16]"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-[#292321]">विशेष संकल्प / मनोकामना (Intention)</Label>
              <Input
                placeholder="उदा. कार्य सिद्धि, स्वास्थ्य लाभ, पारिवारिक सुख"
                value={sankalpWish}
                onChange={(e) => setSankalpWish(e.target.value)}
                className="bg-[#FFF9EF] border-[#E6D6BE] text-[#292321] placeholder:text-gray-400 focus:border-[#E58A16]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#E58A16] hover:bg-[#d4790e] text-white font-extrabold text-sm py-3 mt-2 rounded-xl shadow-md cursor-pointer"
            >
              👑 बुकिंग की पुष्टि करें ➔
            </Button>

            <p className="text-[10px] text-[#665E58] text-center">
              🔒 100% सुरक्षित सेवा। हमारे मुख्य आचार्य सीधे व्हाट्सएप पर संपर्क करेंगे।
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

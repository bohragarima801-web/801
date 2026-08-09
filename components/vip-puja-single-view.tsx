'use client'

import { useState } from 'react'
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
  { id: 'default', label: '⚡ Default Auspicious Slot (संस्थान द्वारा तय शुभ समय)', desc: '11:00 AM Abhijit Muhurat (Recommended by Pandits)' },
  { id: 'brahma', label: '🌅 Brahma Muhurat / Morning Slot', desc: '06:00 AM - 09:00 AM (Best for Health & Peace)' },
  { id: 'abhijit', label: '☀️ Abhijit Muhurat / Midday Slot', desc: '11:00 AM - 02:00 PM (Best for Victory & Wealth)' },
  { id: 'godhuli', label: '🌆 Godhuli Muhurat / Evening Slot', desc: '05:00 PM - 08:00 PM (Best for Family Harmony)' },
]

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
  const categoryName = puja.category?.name || 'Exclusive VIP Anushthan'
  const templeLocation = puja.location || puja.temple?.name || 'Sacred Dham, India'
  const coverImg = puja.coverImage || '/bagalamukhi_mirchi_hawan_2.jpg'

  // Parse gallery images
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
    name: 'Pandit Ram Sharma (Senior Mahant)',
    title: 'मुख्य वेदाचार्य एवं कर्मकांड प्रमुख (25+ Years Experience)',
    experience: '25+ वर्ष वेद अनुभव',
    location: templeLocation,
    photo: '/pandit_mukesh_bohra.jpg'
  }

  const defaultFaqs = [
    {
      question: "How is a VIP Video Puja different from regular pujas?",
      answer: "VIP Pujas are conducted exclusively 1-on-1 for your family with dedicated Veda Pandits. You receive a private WhatsApp Video call link to watch the Sankalp live and recite mantras along with the lead Mahant."
    },
    {
      question: "How do I provide my Name & Gotra for Sankalp?",
      answer: "During booking or immediately via WhatsApp, you provide your full Name, Family Members' Names, Gotra, and Specific Intention (Sankalp). The Acharya chants these explicitly at the sacred altar."
    },
    {
      question: "When and how will the Prasad Kit be delivered?",
      answer: "Energized Prasad (sacred ash/bhasma, yantra, dry fruits, kumkum & energized thread) is sanctified during the homa and dispatched via express courier to your doorstep within 3-5 business days."
    },
    {
      question: "What is the cancellation & refund policy for VIP Anushthans?",
      answer: "If temple schedules change or an emergency arises, 100% full refund or immediate rescheduling to your choice of auspicious date is guaranteed."
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

      window.open(`https://wa.me/919587171984?text=${message}`, '_blank')
    } catch (err) {
      const enc = encodeURIComponent
      const message = `Namaste DivyaYagyam Team!%0A%0A*VIP Puja Booking Request:*%0A- *Puja:* ${enc(puja.name)}%0A- *Price:* ₹${displayPrice}%0A- *Devotee Name:* ${enc(devoteeName)}%0A- *WhatsApp Phone:* ${enc(whatsappPhone)}%0A- *Gotra:* ${enc(gotra || 'Kashyap')}%0A- *Preferred Date:* ${enc(dateText)}%0A- *Time Slot:* ${enc(slotText)}%0A- *Assigned Priest:* ${enc(assignedPandit.name)}%0A- *Sankalp Intention:* ${enc(sankalpWish || 'Overall Victory & Health')}`
      window.open(`https://wa.me/919587171984?text=${message}`, '_blank')
    } finally {
      setBookingDialogOpen(false)
    }
  }

  return (
    <div className="vip-container min-h-screen pb-28 relative overflow-hidden">
      
      {/* Background Pitambara Gold Glow Aura */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-[#D4AF37]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl space-y-14 relative z-10">
        
        {/* ============================================================
            SECTION 1: HERO SECTION (Above the Fold)
            ============================================================ */}
        <div className="vip-card p-6 md:p-10 space-y-8 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Visual Media */}
            <div className="lg:col-span-5 relative space-y-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl group">
                <Image 
                  src={currentVipImage} 
                  alt={puja.name} 
                  fill 
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Gold Outline Badge */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#D4AF37] bg-[#0F0C08]/90 text-[#F3E5AB] text-[11px] font-black uppercase tracking-widest shadow-lg">
                    <Crown className="h-3.5 w-3.5 text-[#D4AF37]" /> VIP LIVE PUJA
                  </span>
                  <span className="bg-[#1C160F]/90 backdrop-blur-md text-[#C5A059] text-xs font-bold px-3 py-1 rounded-md border border-[#D4AF37]/35">
                    {categoryName}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0C08] via-black/30 to-transparent flex flex-col justify-end p-5 text-left space-y-1.5 pointer-events-none">
                  <span className="text-[#D4AF37] font-black text-xs uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Exclusive 1-on-1 Anushthan
                  </span>
                  <h4 className="text-xl font-heading font-black text-white leading-tight">
                    {puja.name}
                  </h4>
                  <p className="text-xs text-[#C5A059] font-semibold">📍 {templeLocation}</p>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {vipMediaList.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {vipMediaList.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveMediaIndex(i)}
                      className={`relative h-14 w-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeMediaIndex === i ? 'border-[#D4AF37] scale-105 shadow-lg' : 'border-[#D4AF37]/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side: Key Details & Main CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/50 bg-[#0F0C08] text-[#D4AF37] text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" /> Shravan Special High-Impact Ritual
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
                  {puja.name}
                </h1>

                <p className="text-xs sm:text-sm text-[#C5A059] leading-relaxed font-medium">
                  {puja.shortDescription || '27+ वर्षों के अनुभवी वरिष्ठ आचार्यों द्वारा व्यक्तिगत नाम-गोत्र संकल्प, समर्पित 5 वेदाचार्य दल एवं 1-on-1 लाइव व्हाट्सएप वीडियो स्ट्रीमिंग के साथ।'}
                </p>
              </div>

              {/* Feature Chips */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                {[
                  { icon: <Video className="h-4 w-4 text-[#D4AF37]" />, label: '1-on-1 LIVE Video Puja' },
                  { icon: <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />, label: 'Private Dedicated Ritual' },
                  { icon: <UserCheck className="h-4 w-4 text-[#D4AF37]" />, label: 'Pandit Consultation' },
                  { icon: <Award className="h-4 w-4 text-[#D4AF37]" />, label: 'Personalized Name & Gotra' },
                ].map((chip) => (
                  <div key={chip.label} className="p-2.5 rounded-xl bg-[#0F0C08] border border-[#D4AF37]/30 flex items-center gap-2 text-xs font-bold text-[#F3E5AB]">
                    {chip.icon}
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>

              {/* Price & Main CTA Button */}
              <div className="p-6 rounded-2xl bg-[#0F0C08] border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div>
                  <span className="text-xs text-[#C5A059] block uppercase font-bold tracking-wider">VIP Dakshina Amount</span>
                  <div className="text-3xl md:text-4xl font-heading font-black vip-gold-gradient-text">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="h-3 w-3" /> All-Inclusive Samagri & Prasad Shipping
                  </span>
                </div>

                <button
                  onClick={() => setBookingDialogOpen(true)}
                  className="vip-cta-btn w-full sm:w-auto text-sm py-4 px-8 shadow-2xl"
                >
                  <Crown className="h-4 w-4" /> Book VIP Puja Now →
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ============================================================
            SECTION 2: PANDIT / PRIEST CREDIBILITY BOX
            ============================================================ */}
        <div className="vip-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-[#D4AF37] shadow-xl shrink-0">
              <Image 
                src={assignedPandit.photo || '/pandit_mukesh_bohra.jpg'} 
                alt={assignedPandit.name}
                fill 
                className="object-cover"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[#D4AF37] font-extrabold uppercase tracking-widest block">
                👑 Lead Vedic Mahant
              </span>
              <h3 className="text-lg md:text-xl font-heading font-bold text-white">
                {assignedPandit.name}
              </h3>
              <p className="text-xs text-[#C5A059] font-medium">
                {assignedPandit.title} • {assignedPandit.experience}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center md:justify-end">
            <span className="px-3 py-1.5 rounded-full bg-[#0F0C08] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold flex items-center gap-1.5">
              📜 Vedic Certified Priest
            </span>
            <span className="px-3 py-1.5 rounded-full bg-[#0F0C08] border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold flex items-center gap-1.5">
              🏛️ Verified Authentic Temple
            </span>
          </div>
        </div>

        {/* ============================================================
            SECTION 3: THE VIP EXPERIENCE GRID (3 Column Layout)
            ============================================================ */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] font-heading">
              🌟 Royal Experience
            </span>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white">
              The <span className="vip-gold-gradient-text">VIP Anushthan Privilege</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vip-card p-6 space-y-3 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-[#0F0C08] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-bold shadow-md">
                <UserCheck className="h-6 w-6 text-[#F3E5AB]" />
              </div>
              <h4 className="font-heading font-bold text-base text-white">Direct Pandit Consultation</h4>
              <p className="text-xs text-[#C5A059] leading-relaxed font-medium">
                Personal guidance & custom ritual planning directly with the lead Veda Acharya prior to the homam.
              </p>
            </div>

            <div className="vip-card p-6 space-y-3 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-[#0F0C08] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-bold shadow-md">
                <Video className="h-6 w-6 text-[#F3E5AB]" />
              </div>
              <h4 className="font-heading font-bold text-base text-white">1-on-1 LIVE Video Darshan</h4>
              <p className="text-xs text-[#C5A059] leading-relaxed font-medium">
                Exclusive WhatsApp Video call link to witness your Sankalp and recite mantras live with the priests.
              </p>
            </div>

            <div className="vip-card p-6 space-y-3 text-center flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-[#0F0C08] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center font-bold shadow-md">
                <Award className="h-6 w-6 text-[#F3E5AB]" />
              </div>
              <h4 className="font-heading font-bold text-base text-white">Personalized Sankalp</h4>
              <p className="text-xs text-[#C5A059] leading-relaxed font-medium">
                Ritual performed specifically in your full Name & Gotra with dedicated 1.25L mantra recitation.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 4: 5-STEP BOOKING PROCESS TIMELINE
            ============================================================ */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] font-heading">
              📋 Seamless Journey
            </span>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white">
              5-Step <span className="vip-gold-gradient-text">VIP Booking Process</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Select Tithi / Muhurat', desc: 'Choose your preferred date or let Acharya recommend.' },
              { step: '02', title: 'Confirm VIP Booking', desc: 'Fill Sankalp details & confirm booking.' },
              { step: '03', title: 'Acharya Consultation', desc: 'Personal WhatsApp guidance & ritual prep.' },
              { step: '04', title: 'LIVE Video Sankalp', desc: 'Join 1-on-1 live video stream during ritual.' },
              { step: '05', title: 'Prasad Kit Delivered', desc: 'Abhimantrit prasad & yantra shipped to home.' },
            ].map((st, i) => (
              <div key={i} className="vip-card p-5 space-y-2 text-center flex flex-col justify-between">
                <div className="text-2xl font-black vip-gold-gradient-text">Step {st.step}</div>
                <h4 className="font-bold text-sm text-white">{st.title}</h4>
                <p className="text-[11px] text-[#C5A059] leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            SECTION 5: BENEFITS & BLESSINGS
            ============================================================ */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] font-heading">
              🪔 Divine Grace
            </span>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white">
              Benefits & <span className="vip-gold-gradient-text">Sacred Blessings</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Victory Over Enemies & Negative Forces', desc: 'Stambhan of legal obstacles, court case victories, and protection from evil eye & negativity.' },
              { title: 'Success in Career, Exams & Business', desc: 'Removal of planetary doshas causing stagnant career growth, financial debt, or business losses.' },
              { title: 'Courage, Focus & Mental Clarity', desc: 'Infuses inner strength, reduces anxiety, and grants unwavering wisdom for life breakthroughs.' },
              { title: 'Divine Protection & Family Prosperity', desc: 'Establishes a spiritual protective shield (Kavach) over your family and home environment.' }
            ].map((b, idx) => (
              <div key={idx} className="vip-card p-5 flex items-start gap-4 text-left">
                <div className="h-10 w-10 rounded-xl bg-[#0F0C08] border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shrink-0 font-bold">
                  <Check className="h-5 w-5 text-[#F3E5AB]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-white">{b.title}</h4>
                  <p className="text-xs text-[#C5A059] leading-relaxed mt-1">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            SECTION 6: SOCIAL PROOF & REVIEWS
            ============================================================ */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] font-heading">
              ⭐ Devotee Experiences
            </span>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white">
              Trusted by <span className="vip-gold-gradient-text">10,000+ VIP Families</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Dr. Vikramaditya Singh', loc: 'Mumbai, Maharashtra', review: 'Booked Baglamukhi VIP Homam for ongoing property litigation. The 1-on-1 video call was deeply emotional and authentic. Prasad arrived in 3 days!' },
              { name: 'Meenakshi Sundaram', loc: 'Chennai, Tamil Nadu', review: 'Living abroad in Singapore, arranging authentic Veda homam in India was seamless. Complete WhatsApp live updates throughout.' },
              { name: 'Rajeshwar Goel', loc: 'Delhi NCR', review: 'Mahamrityunjaya VIP Jaap performed for father\'s health recovery. The Acharya\'s chanting & personal guidance was world-class.' }
            ].map((r, i) => (
              <div key={i} className="vip-card p-6 space-y-3 text-left flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#D4AF37]">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ✓ Verified Devotee
                    </span>
                  </div>
                  <p className="text-xs text-[#C5A059] leading-relaxed italic">"{r.review}"</p>
                </div>
                <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[#0F0C08] border border-[#D4AF37] text-[#F3E5AB] font-bold text-xs flex items-center justify-center">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white">{r.name}</h5>
                    <p className="text-[11px] text-[#C5A059]">{r.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================
            SECTION 7: FAQ ACCORDION & STICKY BOTTOM BAR
            ============================================================ */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#D4AF37] font-heading">
              ❓ Clear Answers
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
              Frequently Asked <span className="vip-gold-gradient-text">Questions</span>
            </h2>
          </div>

          <div className="space-y-3">
            {faqList.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={idx} className="vip-card overflow-hidden text-left">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white hover:text-[#D4AF37] transition-colors"
                  >
                    <span className="text-sm md:text-base">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 text-[#D4AF37] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs md:text-sm text-[#C5A059] leading-relaxed border-t border-[#D4AF37]/20 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* ── STICKY MOBILE BOTTOM BAR (Always visible on mobile view) ── */}
      <div className="fixed bottom-0 inset-x-0 bg-[#0F0C08]/95 backdrop-blur-lg border-t border-[#D4AF37]/40 p-3.5 z-40 sm:hidden flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-[#C5A059] uppercase font-bold block">VIP Dakshina</span>
          <span className="text-xl font-heading font-black vip-gold-gradient-text">
            ₹{displayPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <button
          onClick={() => setBookingDialogOpen(true)}
          className="vip-cta-btn text-xs py-3 px-6 shadow-xl"
        >
          Book VIP Puja →
        </button>
      </div>

      {/* ── BOOKING MODAL DIALOG ── */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-lg bg-[#1C160F] border-2 border-[#D4AF37] text-white rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="text-left space-y-2 border-b border-[#D4AF37]/30 pb-4">
            <DialogTitle className="text-xl font-heading font-black text-white flex items-center gap-2">
              <Crown className="h-5 w-5 text-[#D4AF37]" /> VIP Puja Sankalp Booking
            </DialogTitle>
            <DialogDescription className="text-xs text-[#C5A059]">
              {puja.name} • Dakshina: <span className="text-[#F3E5AB] font-bold">₹{displayPrice.toLocaleString('en-IN')}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmBooking} className="space-y-4 pt-2 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#F3E5AB]">मुख्य यजमान का नाम (Devotee Full Name) *</Label>
              <Input
                required
                placeholder="e.g. Ramesh Kumar Sharma"
                value={devoteeName}
                onChange={(e) => setDevoteeName(e.target.value)}
                className="bg-[#0F0C08] border-[#D4AF37]/40 text-white placeholder:text-gray-600 focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#F3E5AB]">व्हाट्सएप नंबर (WhatsApp No) *</Label>
                <Input
                  required
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="bg-[#0F0C08] border-[#D4AF37]/40 text-white placeholder:text-gray-600 focus:border-[#D4AF37]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#F3E5AB]">गोत्र (Gotra)</Label>
                <Input
                  placeholder="e.g. Kashyap / Bhardwaj"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  className="bg-[#0F0C08] border-[#D4AF37]/40 text-white placeholder:text-gray-600 focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#F3E5AB]">पसंदीदा तिथि (Preferred Date)</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#0F0C08] border-[#D4AF37]/40 text-white focus:border-[#D4AF37]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#F3E5AB]">विशेष संकल्प इच्छा / प्रार्थना (Intention)</Label>
              <Input
                placeholder="e.g. Court case victory, Health, Business Growth"
                value={sankalpWish}
                onChange={(e) => setSankalpWish(e.target.value)}
                className="bg-[#0F0C08] border-[#D4AF37]/40 text-white placeholder:text-gray-600 focus:border-[#D4AF37]"
              />
            </div>

            <Button
              type="submit"
              className="vip-cta-btn w-full text-sm py-3.5 mt-2"
            >
              👑 Confirm & Request VIP Booking →
            </Button>

            <p className="text-[11px] text-[#C5A059] text-center">
              🔒 Safe & Secure. Our Lead Acharya will contact you directly on WhatsApp to confirm timing.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

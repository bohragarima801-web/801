'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { 
  Sparkles, Award, UserCheck, Calendar, Clock, Video, Truck, ShieldCheck, 
  CheckCircle2, ArrowRight, PhoneCall, MessageCircle, Star, Flame, Check, Zap, MapPin, Crown
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
  const router = useRouter()
  const { addToCart, clearCart } = useCart()
  
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [devoteeName, setDevoteeName] = useState('')
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [gotra, setGotra] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('default')
  const [sankalpWish, setSankalpWish] = useState('')

  const displayPrice = Number(puja.vipPrice || puja.price || 11000)
  const categoryName = puja.category?.name || 'Exclusive VIP Ritual'
  const templeLocation = puja.location || puja.temple?.name || 'Sacred Dham, India'
  const coverImg = puja.coverImage || '/katyayani_yagya_hero.jpg'

  // Parse gallery images strictly from Puja cover & Puja gallery images
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
    name: 'पं. मुकेश बोहरा (Pt. Mukesh Bohra)',
    title: 'मुख्य आचार्य एवं वैदिक कर्मकांड विशेषज्ञ',
    experience: '15+ वर्ष अनुभव',
    location: templeLocation,
    photo: '/pandit_mukesh_bohra.jpg'
  }

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!devoteeName || !whatsappPhone) {
      alert('कृपया अपना नाम एवं व्हाट्सएप नंबर दर्ज करें।')
      return
    }

    const slotObj = timeSlotOptions.find(s => s.id === selectedTimeSlot)
    const slotText = slotObj ? slotObj.label : 'Default Auspicious Timing'
    const dateText = selectedDate ? selectedDate : 'Auspicious Date Recommended by Priest'

    try {
      window.localStorage.setItem('dy_sankalp', JSON.stringify({
        gotra: gotra || 'Kashyap',
        purpose: sankalpWish || 'Overall Prosperity & Victory',
        date: dateText,
        timeSlot: slotText,
        devoteeName,
        whatsappPhone
      }))
    } catch {}

    clearCart()
    addToCart({
      id: `puja-${puja.id}`,
      name: `👑 ${puja.name} (VIP Ritual)`,
      price: Number(displayPrice),
      image: coverImg || ''
    }, 1)

    setBookingDialogOpen(false)
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2B0306] via-[#3D0408] to-[#1A0204] text-slate-100 font-sans pb-24 relative overflow-hidden">
      {/* Background Pitambara Gold Ambient Aura */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[rgba(245,184,0,0.12)] rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl space-y-10 relative z-10">
        
        {/* Main VIP Puja Card Container (Deep Imperial Maroon × Pitambara Gold Filigree) */}
        <div className="bg-gradient-to-b from-[#4A070E] to-[#320408] border-2 border-[#F5B800]/60 rounded-3xl p-6 md:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Poster Banner / Image */}
            <div className="lg:col-span-5 relative space-y-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#F5B800]/70 shadow-2xl">
                <Image 
                  src={currentVipImage} 
                  alt={puja.name} 
                  fill 
                  priority
                  className="object-cover transition-transform duration-500" 
                />
                
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <Badge className="bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#3D0408] font-black text-[11px] uppercase tracking-wider px-3 py-1 border-none shadow-lg flex items-center gap-1">
                    <Crown className="h-3 w-3 fill-[#3D0408]" /> VIP EXCLUSIVE
                  </Badge>
                  <span className="bg-[#2B0306]/85 backdrop-blur-md text-[#FFF3D6] text-xs font-bold px-2.5 py-1 rounded-md border border-[#F5B800]/40">
                    {categoryName}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0204] via-black/40 to-transparent flex flex-col justify-end p-5 text-left space-y-1 pointer-events-none">
                  <span className="text-[#F5B800] font-black text-xs uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Special Divine Anushthan
                  </span>
                  <h4 className="text-xl font-heading font-black text-white leading-tight">
                    {puja.name}
                  </h4>
                  <p className="text-xs text-[#FFF3D6] font-semibold">📍 {templeLocation}</p>
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
                        activeMediaIndex === i ? 'border-[#F5B800] scale-105 shadow-lg' : 'border-[#54080F] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt={`पूजा गैलरी ${i + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-gradient-to-r from-[#3D0408] to-[#200205] p-4 rounded-2xl border-2 border-[#F5B800]/50 flex items-center justify-between text-center shadow-lg">
                <span className="text-xs text-[#FFF3D6] font-bold">VIP अनुष्ठान दक्षिणा राशि</span>
                <span className="text-2xl font-black text-[#F5B800]">₹{displayPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Title, Benefits & Embedded Pandit Card */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#F5B800]/20 text-[#FFF3D6] border border-[#F5B800]/50">
                  <Crown className="h-3.5 w-3.5 text-[#F5B800]" /> विशेष व्यक्तिगत VIP अनुष्ठान
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
                  {puja.name}
                </h1>
                <p className="text-sm text-[#FFE89C] font-medium leading-relaxed">
                  {(puja.shortDescription || puja.description || 'आपके एवं आपके परिवार के कल्याण, आरोग्य व समृद्धि हेतु विशेष VIP महा अनुष्ठान।').replace(/<[^>]*>?/gm, '')}
                </p>
              </div>

              {/* EMBEDDED CARD: "Who Will Perform Your Puja" */}
              <div className="p-5 rounded-2xl bg-[#2B0306] border-2 border-[#F5B800]/60 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#F5B800]/30 pb-2.5">
                  <span className="text-xs font-black text-[#F5B800] uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-[#F5B800]" /> अनुष्ठान संपन्नकर्ता मुख्य आचार्य
                  </span>
                  <Badge className="bg-[#54080F] text-[#FFF3D6] border border-[#F5B800]/50 font-bold text-[10px] px-2.5 py-0.5">
                    ✓ प्रामाणिक पीठाधीश्वर आचार्य
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-[#F5B800] shrink-0 shadow-md">
                    <Image 
                      src={assignedPandit.photo} 
                      alt={assignedPandit.name} 
                      fill 
                      className="object-cover object-center" 
                    />
                  </div>
                  <div className="space-y-0.5 text-left min-w-0">
                    <h4 className="font-extrabold text-base text-[#FFF3D6] truncate">
                      {assignedPandit.name}
                    </h4>
                    <p className="text-xs text-[#F5B800] font-bold">
                      {assignedPandit.title}
                    </p>
                    <p className="text-[11px] text-slate-300 font-medium">
                      📍 {assignedPandit.location} • 📜 {assignedPandit.experience}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-[#FFF3D6] font-bold">
                <div className="flex items-center gap-2 p-3 bg-[#3D0408]/80 rounded-xl border border-[#F5B800]/30">
                  <Clock className="h-4 w-4 text-[#F5B800] shrink-0" />
                  <span>संपूर्ण दिवस सिद्ध महाअनुष्ठान</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#3D0408]/80 rounded-xl border border-[#F5B800]/30">
                  <UserCheck className="h-4 w-4 text-[#F5B800] shrink-0" />
                  <span>वरिष्ठ वेदाचार्य मंडल</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#3D0408]/80 rounded-xl border border-[#F5B800]/30">
                  <Video className="h-4 w-4 text-[#F5B800] shrink-0" />
                  <span>व्हाट्सएप लाइव संकल्प व वीडियो</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-[#3D0408]/80 rounded-xl border border-[#F5B800]/30">
                  <Truck className="h-4 w-4 text-[#F5B800] shrink-0" />
                  <span>दिव्य सामग्री व सिद्ध प्रसाद</span>
                </div>
              </div>

              {/* Primary VIP Action Button */}
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#3D0408] font-black text-base py-6 rounded-2xl shadow-[0_4px_30px_rgba(245,184,0,0.4)] border border-[#FFE89C] hover:scale-[1.02] transition-transform mt-4" 
                onClick={() => setBookingDialogOpen(true)}
              >
                👑 VIP अनुष्ठान बुक करें - ₹{displayPrice.toLocaleString('en-IN')} &rarr;
              </Button>


            </div>

          </div>

        </div>

        {/* SECTION 2: "WHAT MAKES THIS SPECIAL" */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-black text-[#F5B800] uppercase tracking-widest flex items-center justify-center gap-1">
              <Crown className="h-3.5 w-3.5" /> WHY THIS RITUAL IS DIFFERENT
            </span>
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white">What Makes This Special?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-b from-[#4A070E] to-[#320408] border-2 border-[#F5B800]/40 rounded-2xl text-slate-100 space-y-3 shadow-xl">
              <div className="h-10 w-10 rounded-xl bg-[#F5B800] text-[#3D0408] flex items-center justify-center font-black">1</div>
              <h4 className="font-extrabold text-lg text-[#FFF3D6]">Personalized 1-on-1 Sankalp</h4>
              <p className="text-xs text-[#FFE89C] leading-relaxed font-medium">
                Your full name, gotra, family members, and specific personal intention chanted with complete Vedic mantras by the Lead Acharya.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-b from-[#4A070E] to-[#320408] border-2 border-[#F5B800]/40 rounded-2xl text-slate-100 space-y-3 shadow-xl">
              <div className="h-10 w-10 rounded-xl bg-[#F5B800] text-[#3D0408] flex items-center justify-center font-black">2</div>
              <h4 className="font-extrabold text-lg text-[#FFF3D6]">Extended Ahuti & Yagya Vidhi</h4>
              <p className="text-xs text-[#FFE89C] leading-relaxed font-medium">
                Special herbs, energized samagri, and 108/1008 mantra ahutis offered solely for your intention in an exclusive mandap.
              </p>
            </Card>
          </div>
        </div>

        {/* SECTION 3: "YOUR PERSONAL PUJA PROCESS" */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-black text-[#F5B800] uppercase tracking-widest">5 SIMPLE STEPS</span>
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white">Your Personal Puja Process</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '1', title: 'Select Slot', desc: 'Choose date & time slot or use default auspicious Muhurat.' },
              { step: '2', title: 'Submit Gotra', desc: 'Provide name, gotra and specific Sankalp wishes.' },
              { step: '3', title: 'Admin Assigns', desc: 'Admin allocates experienced Lead Acharya for your puja.' },
              { step: '4', title: 'Watch Live', desc: 'Join live stream or get HD WhatsApp video proof.' },
              { step: '5', title: 'Prasad Courier', desc: 'Blessed prasad & yantra shipped to your address.' }
            ].map((s) => (
              <div key={s.step} className="p-5 bg-gradient-to-b from-[#4A070E] to-[#320408] border border-[#F5B800]/40 rounded-2xl text-center space-y-2 shadow-lg">
                <div className="h-8 w-8 rounded-full bg-[#F5B800] text-[#3D0408] font-black text-xs flex items-center justify-center mx-auto">{s.step}</div>
                <h5 className="font-extrabold text-sm text-[#FFF3D6]">{s.title}</h5>
                <p className="text-[11px] text-[#FFE89C] font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: FAQS */}
        {puja.faqs && puja.faqs.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-black text-[#F5B800] uppercase tracking-widest">TRANSPARENCY & TRUST</span>
              <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-3 max-w-4xl mx-auto">
              {puja.faqs.map((faq, idx) => (
                <div key={idx} className="p-5 bg-[#3D0408] border border-[#F5B800]/30 rounded-2xl space-y-2">
                  <h5 className="font-extrabold text-base text-[#FFF3D6]">Q: {faq.question}</h5>
                  <p className="text-xs text-[#FFE89C] leading-relaxed font-medium">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* BOOKING MODAL */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-gradient-to-b from-[#3D0408] to-[#200205] text-white rounded-3xl border-2 border-[#F5B800]">
          <DialogHeader className="space-y-2 border-b border-[#F5B800]/30 pb-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-[#F5B800] text-[#3D0408] font-black text-[10px]">
                👑 VIP Booking Form
              </Badge>
              <span className="text-sm text-[#F5B800] font-black">
                ₹{displayPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <DialogTitle className="text-xl font-heading font-extrabold text-white">
              {puja.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-[#FFE89C] font-medium">
              Choose your preferred date & time slot, or let DivyaYagyam assign the default auspicious Muhurat & verified Acharya.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmBooking} className="space-y-5 pt-3 text-left">
            <div className="space-y-2">
              <Label className="font-bold text-xs text-[#FFF3D6]">
                📅 Select Date (तिथि का चयन करें) <span className="text-slate-400 font-normal">(Optional)</span>
              </Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl border-[#F5B800]/40 bg-black/40 text-white text-sm font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-xs text-[#FFF3D6]">
                ⏰ Preferred Time Slot (समय एवं मुहूर्त चुनें)
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {timeSlotOptions.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot.id)}
                    className={`p-3 rounded-xl text-left border text-xs font-semibold transition-all ${
                      selectedTimeSlot === slot.id
                        ? 'border-[#F5B800] bg-[#F5B800]/20 text-[#FFF3D6] shadow-md'
                        : 'border-white/10 hover:border-[#F5B800]/40 text-slate-300 bg-black/20'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{slot.label}</span>
                      {selectedTimeSlot === slot.id && <Check className="h-4 w-4 text-[#F5B800]" />}
                    </div>
                    <p className="text-[10px] text-[#FFE89C] font-normal mt-0.5">{slot.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[#F5B800]/40 bg-black/40 space-y-1">
              <div className="flex items-center gap-2 font-black text-xs text-[#F5B800]">
                <ShieldCheck className="h-4 w-4 text-[#F5B800]" /> Assigned Priest (संस्थान द्वारा नियुक्त आचार्य)
              </div>
              <p className="text-[11px] text-[#FFF3D6] font-medium leading-relaxed">
                {assignedPandit.name} ({assignedPandit.title})
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-[#FFF3D6]">आपका नाम (Devotee Name) *</Label>
                <Input
                  type="text"
                  placeholder="e.g. राजेश शर्मा"
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  required
                  className="rounded-xl border-[#F5B800]/40 bg-black/40 text-white text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-[#FFF3D6]">व्हाट्सएप नंबर (WhatsApp Phone) *</Label>
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  required
                  className="rounded-xl border-[#F5B800]/40 bg-black/40 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-[#FFF3D6]">गोत्र (Gotra) <span className="text-slate-400 font-normal">(Optional)</span></Label>
                <Input
                  type="text"
                  placeholder="e.g. कश्यप / गर्ग"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  className="rounded-xl border-[#F5B800]/40 bg-black/40 text-white text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-[#FFF3D6]">विशेष मनोकामना (Sankalp Wish)</Label>
                <Input
                  type="text"
                  placeholder="e.g. कोर्ट केस में विजय एवं व्यापार वृद्धि"
                  value={sankalpWish}
                  onChange={(e) => setSankalpWish(e.target.value)}
                  className="rounded-xl border-[#F5B800]/40 bg-black/40 text-white text-xs"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#3D0408] font-black rounded-xl text-sm shadow-xl py-6">
                Confirm VIP Booking & Pay via Razorpay &rarr;
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#200205]/95 backdrop-blur-md border-t-2 border-[#F5B800] py-3 px-4 shadow-2xl">
        <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="hidden sm:block text-left">
            <span className="text-xs text-[#F5B800] font-black block truncate max-w-md">👑 {puja.name}</span>
            <span className="text-xs text-[#FFF3D6] font-medium">📍 {templeLocation}</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div>
              <span className="text-[10px] text-[#FFE89C] font-medium block">Total Price</span>
              <span className="text-lg font-black text-[#F5B800]">₹{displayPrice.toLocaleString('en-IN')}</span>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#3D0408] font-black text-sm px-6 py-5 rounded-xl shadow-lg hover:scale-105 transition-transform" onClick={() => setBookingDialogOpen(true)}>
              Book VIP Puja - ₹{displayPrice.toLocaleString('en-IN')}
            </Button>
          </div>
        </div>

        {/* How This Works Process Bar (DivyaYagyam Pattern) */}
        <div className="p-5 rounded-2xl bg-[#360509]/90 border border-[#F5B800]/40 shadow-xl my-6">
          <p className="text-center text-xs font-black uppercase text-[#F5B800] tracking-widest mb-4">
            👑 VIP अनुष्ठान बुकिंग प्रक्रिया (How VIP Anushthan Works)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="flex items-center gap-2.5 p-2.5 bg-[#54080F]/80 rounded-xl border border-[#F5B800]/30">
              <div className="w-8 h-8 rounded-lg bg-[#F5B800] text-[#3D0408] font-black flex items-center justify-center text-xs shrink-0">1</div>
              <div className="text-left min-w-0"><p className="text-xs font-bold text-[#FFF3D6] truncate">VIP अनुष्ठान चयन</p><p className="text-[10px] text-[#FFE89C]/80 truncate">1-on-1 Personalized</p></div>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-[#54080F]/80 rounded-xl border border-[#F5B800]/30">
              <div className="w-8 h-8 rounded-lg bg-[#F5B800] text-[#3D0408] font-black flex items-center justify-center text-xs shrink-0">2</div>
              <div className="text-left min-w-0"><p className="text-xs font-bold text-[#FFF3D6] truncate">नाम व गोत्र संकल्प</p><p className="text-[10px] text-[#FFE89C]/80 truncate">Vedic Chanting</p></div>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-[#54080F]/80 rounded-xl border border-[#F5B800]/30">
              <div className="w-8 h-8 rounded-lg bg-[#F5B800] text-[#3D0408] font-black flex items-center justify-center text-xs shrink-0">3</div>
              <div className="text-left min-w-0"><p className="text-xs font-bold text-[#FFF3D6] truncate">व्हाट्सएप लाइव प्रमाण</p><p className="text-[10px] text-[#FFE89C]/80 truncate">HD Video Recording</p></div>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 bg-[#54080F]/80 rounded-xl border border-[#F5B800]/30">
              <div className="w-8 h-8 rounded-lg bg-[#F5B800] text-[#3D0408] font-black flex items-center justify-center text-xs shrink-0">4</div>
              <div className="text-left min-w-0"><p className="text-xs font-bold text-[#FFF3D6] truncate">दिव्य सामग्री प्रसाद</p><p className="text-[10px] text-[#FFE89C]/80 truncate">Royal Delivery</p></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

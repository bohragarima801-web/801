'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { 
  Sparkles, Award, UserCheck, Calendar, Clock, Video, Truck, ShieldCheck, 
  Heart, CheckCircle2, ArrowRight, PhoneCall, MessageCircle, Star, ChevronRight,
  Flame, Lock, Compass, HelpCircle, Check, MapPin, Zap
} from 'lucide-react'

export interface VipPackageItem {
  id: string
  name: string
  nameHi?: string
  shortDesc: string
  location: string
  duration: string
  priestsCount: string
  price: number
  categoryTag: string
  badgeTag?: string
  slug: string
  coverImage?: string
  assignedPandit?: {
    name: string
    title: string
    experience: string
    location: string
    photo: string
  }
  benefits?: string[]
}

const defaultVipPackages: VipPackageItem[] = [
  {
    id: 'vip-1',
    name: 'Mata Baglamukhi Mirchi Havan & Sarva Karya Siddhi Mahayagya',
    nameHi: 'माँ बगलामुखी मिर्ची हवन एवं सर्व कार्य सिद्धि महायज्ञ',
    shortDesc: 'Victory in legal disputes, protection from severe negativity, enemy destruction & business triumph.',
    location: 'Mata Baglamukhi Dham, Nalkheda / Datia',
    duration: 'Full-Day Intensive Homa',
    priestsCount: '5 Veda Certified Acharyas',
    price: 15100,
    categoryTag: 'Tantra & Victory Homa',
    badgeTag: 'Most Popular VIP',
    slug: 'mata-baglamukhi-mirchi-havan',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    assignedPandit: {
      name: 'पं. कन्हैया लाल दवे (Pt. Kanhaiya Lal Dave)',
      title: 'अथर्ववेद एवं महाविद्या पीठाधीश्वर',
      experience: '22+ वर्ष अनुभव',
      location: 'माँ बगलामुखी पीठ, दतिया',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    benefits: ['Victory in Legal & Court Cases', 'Shield from Negative Energy & Evil Eye', 'Triumph Over Competitors & Enemies']
  },
  {
    id: 'vip-2',
    name: 'Kashi Vishwanath Mahadev 1,25,000 Mahamrityunjaya Jaap',
    nameHi: 'काशी विश्वनाथ महामृत्युंजय सवा लाख मंत्र जाप एवं रुद्राभिषेक',
    shortDesc: 'Intensive Veda-chanted Mahamrityunjaya jaap for serious health issues, longevity & divine shield.',
    location: 'Kashi Vishwanath Temple, Varanasi',
    duration: '5-Day Continuous Ritual',
    priestsCount: '5 Senior Pandits',
    price: 21000,
    categoryTag: 'Health & Protection',
    badgeTag: 'Exclusive',
    slug: 'kashi-vishwanath-mahamrityunjaya',
    coverImage: 'https://images.unsplash.com/photo-1609345635867-03f565b9dfd1?auto=format&fit=crop&w=800&q=80',
    assignedPandit: {
      name: 'पं. रामेश्वर शास्त्री (Pt. Rameshwar Shastri)',
      title: 'शुक्ल यजुर्वेद संहिता महाविद्वान',
      experience: '25+ वर्ष अनुभव',
      location: 'काशी विश्वनाथ धाम, वाराणसी',
      photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80'
    },
    benefits: ['Relief from Critical Illnesses', 'Long Life & Accident Protection', 'Divine Blessing of Lord Shiva']
  },
  {
    id: 'vip-3',
    name: 'Mahakaleshwar Ujjain Kalsarp & Rahu-Ketu Dosh Nivaran',
    nameHi: 'महाकालेश्वर उज्जैन कालसर्प एवं राहु-केतु दोष निवारण महापूजा',
    shortDesc: 'Deep 9-planet astrological remediation conducted at Bhasma Aarti Dham for career & life breakthroughs.',
    location: 'Mahakaleshwar Temple, Ujjain',
    duration: 'Full-Day Special Ritual',
    priestsCount: '4 Acharyas',
    price: 12500,
    categoryTag: 'Dosha Removal',
    badgeTag: 'Recommended',
    slug: 'mahakaleshwar-kalsarp-shanti',
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80',
    assignedPandit: {
      name: 'आचार्य देवेन्द्र जोशी (Acharya Devendra Joshi)',
      title: 'कर्मकाण्ड एवं ज्योतिष भास्कर',
      experience: '18+ वर्ष अनुभव',
      location: 'महाकालेश्वर धाम, उज्जैन',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    },
    benefits: ['Clear Obstacles in Career & Business', 'Neutralize Rahu-Ketu Negative Effects', 'Restore Peace in Personal Life']
  }
]

const timeSlotOptions = [
  { id: 'default', label: '⚡ Default Auspicious Slot (संस्थान द्वारा तय शुभ समय)', desc: '11:00 AM Abhijit Muhurat (Recommended by Pandits)' },
  { id: 'brahma', label: '🌅 Brahma Muhurat / Morning Slot', desc: '06:00 AM - 09:00 AM (Best for Health & Peace)' },
  { id: 'abhijit', label: '☀️ Abhijit Muhurat / Midday Slot', desc: '11:00 AM - 02:00 PM (Best for Victory & Wealth)' },
  { id: 'godhuli', label: '🌆 Godhuli Muhurat / Evening Slot', desc: '05:00 PM - 08:00 PM (Best for Family Harmony)' },
]

export function VipPujasSection({ dbPackages = [] }: { dbPackages?: VipPackageItem[] }) {
  const packagesToDisplay = dbPackages
  const [activePackageIndex, setActivePackageIndex] = useState(0)

  // Booking Modal State
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [devoteeName, setDevoteeName] = useState('')
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [gotra, setGotra] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('default')
  const [sankalpWish, setSankalpWish] = useState('')

  if (packagesToDisplay.length === 0) {
    return (
      <div className="min-h-screen bg-[#1D070B] text-slate-100 font-sans py-24 px-4 text-center flex flex-col items-center justify-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-amber-500/20 border-2 border-amber-400/50 text-amber-400 flex items-center justify-center text-4xl shadow-xl">👑</div>
        <div className="space-y-3 max-w-lg">
          <h2 className="text-3xl font-extrabold font-heading text-white">शीघ्र उपलब्ध होंगी दिव्य VIP पूजाएँ एवं महायज्ञ</h2>
          <p className="text-slate-300 text-sm font-medium leading-relaxed">
            संस्थान के मुख्य आचार्यों द्वारा सिद्ध शक्तिपीठों पर विशेष VIP अनुष्ठानों की तारीखें घोषित की जा रही हैं। किसी भी विशेष VIP पूजा संकल्प हेतु आचार्य जी से परामर्श लें।
          </p>
        </div>
        <Button size="lg" className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black rounded-xl shadow-xl text-sm py-6 px-8" asChild>
          <a href="https://wa.me/919587171984?text=Namaste!%20I%20want%20to%20consult%20regarding%20special%20VIP%20Puja%20booking" target="_blank" rel="noopener noreferrer">
            💬 आचार्य जी से VIP पूजा परामर्श लें &rarr;
          </a>
        </Button>
      </div>
    )
  }

  const currentPackage = packagesToDisplay[activePackageIndex] || packagesToDisplay[0]

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!devoteeName || !whatsappPhone) {
      alert('कृपया अपना नाम एवं व्हाट्सएप नंबर दर्ज करें।')
      return
    }

    const slotObj = timeSlotOptions.find(s => s.id === selectedTimeSlot)
    const slotText = slotObj ? slotObj.label : 'Default Auspicious Timing'
    const dateText = selectedDate ? selectedDate : 'Auspicious Date Recommended by Priest'
    const panditName = currentPackage.assignedPandit?.name || 'DivyaYagyam Admin Assigned Acharya'

    const message = `Namaste DivyaYagyam Team!%0A%0A*I want to book a VIP Puja:*%0A- *Puja:* ${currentPackage.name}%0A- *Price:* ₹${currentPackage.price}%0A- *Devotee Name:* ${devoteeName}%0A- *WhatsApp:* ${whatsappPhone}%0A- *Gotra:* ${gotra || 'Kashyap / Unspecified'}%0A- *Preferred Date:* ${dateText}%0A- *Time Slot:* ${slotText}%0A- *Assigned Priest:* ${panditName}%0A- *Sankalp Intention:* ${sankalpWish || 'Overall Victory & Prosperity'}`

    window.open(`https://wa.me/919587171984?text=${message}`, '_blank')
    setBookingDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#1D070B] text-slate-100 font-sans">
      
      {/* Top Banner Navigation Selector if multiple packages */}
      <div className="bg-[#1A0608] border-b border-[rgba(168,124,40,0.25)] py-3 sticky top-[64px] z-40">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 overflow-x-auto">
          <span className="text-xs font-bold text-[#D4A843] shrink-0 flex items-center gap-1.5 tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> SELECT VIP PUJA:
          </span>
          <div className="flex gap-2 shrink-0">
            {packagesToDisplay.map((pkg, idx) => (
              <button
                key={pkg.id}
                onClick={() => setActivePackageIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activePackageIndex === idx
                    ? 'bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {pkg.badgeTag || `VIP ${idx + 1}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN LUXURY HERO & DETAILS CARD (TALLY WITH DEVPUNYA DESIGN)
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl space-y-10">
        
        {/* Main VIP Puja Card Container */}
        <div className="bg-[#2A0C14] border border-amber-500/30 rounded-3xl p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Poster Banner / Image */}
            <div className="lg:col-span-5 relative space-y-3">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl">
                <Image 
                  src={currentPackage.coverImage || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'} 
                  alt={currentPackage.name} 
                  fill 
                  priority
                  className="object-cover" 
                />
                
                {/* Top Poster Badge */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-[11px] uppercase tracking-wider px-3 py-1 border-none shadow-md">
                    {currentPackage.badgeTag || 'VIP Exclusive'}
                  </Badge>
                  <span className="bg-black/70 backdrop-blur-md text-amber-300 text-xs font-extrabold px-2.5 py-1 rounded-md border border-amber-500/30">
                    {currentPackage.categoryTag}
                  </span>
                </div>

                {/* Bottom Overlay Banner */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 text-left space-y-1">
                  <span className="text-amber-400 font-extrabold text-xs uppercase tracking-widest">Destroy Negativity • Achieve Success</span>
                  <h4 className="text-xl font-heading font-black text-white leading-tight">
                    {currentPackage.nameHi || currentPackage.name}
                  </h4>
                  <p className="text-xs text-amber-200/90 font-medium">📍 {currentPackage.location}</p>
                </div>
              </div>

              {/* Price Banner under image */}
              <div className="bg-gradient-to-r from-amber-950/80 to-amber-900/60 p-4 rounded-xl border border-amber-500/30 flex items-center justify-between text-center">
                <span className="text-xs text-amber-300 font-bold">Total VIP Sankalp Amount</span>
                <span className="text-2xl font-black text-amber-400">₹{currentPackage.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Title, Benefits & Embedded Pandit Card */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Title Header */}
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <Award className="h-3.5 w-3.5 text-amber-400" /> Exclusive Personalized Ritual
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white leading-tight">
                  {currentPackage.name}
                </h1>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  {currentPackage.shortDesc}
                </p>
              </div>

              {/* Benefit Badges */}
              {currentPackage.benefits && (
                <div className="flex flex-wrap gap-2">
                  {currentPackage.benefits.map((b, bIdx) => (
                    <span key={bIdx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      <Zap className="h-3.5 w-3.5 text-amber-400" /> {b}
                    </span>
                  ))}
                </div>
              )}

              {/* EMBEDDED CARD: "Who Will Perform Your Puja" (कौन करेंगे आपकी पूजा) */}
              <div className="p-4 md:p-5 rounded-2xl bg-[#1B060B] border-2 border-amber-500/50 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-amber-900/50 pb-2.5">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-amber-400" /> Who Will Perform Your Puja (आचार्य जानकारी)
                  </span>
                  <Badge className="bg-emerald-600/90 text-white font-extrabold text-[10px] px-2 py-0.5">
                    ✓ Admin Assigned Lead Acharya
                  </Badge>
                </div>

                {currentPackage.assignedPandit ? (
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-2xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-md">
                      <Image 
                        src={currentPackage.assignedPandit.photo} 
                        alt={currentPackage.assignedPandit.name} 
                        fill 
                        className="object-cover object-top" 
                      />
                    </div>
                    <div className="space-y-0.5 text-left min-w-0">
                      <h4 className="font-extrabold text-base text-amber-200 truncate">
                        {currentPackage.assignedPandit.name}
                      </h4>
                      <p className="text-xs text-amber-400 font-bold">
                        {currentPackage.assignedPandit.title}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        📍 {currentPackage.assignedPandit.location} • 📜 {currentPackage.assignedPandit.experience}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-300 font-medium">
                    📍 Admin Assigned Senior Veda Pandit (वाराणसी/उज्जैन शास्त्र-पारंगत आचार्य)
                  </div>
                )}
              </div>

              {/* Package Specs Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300 font-semibold">
                <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{currentPackage.duration}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <UserCheck className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>{currentPackage.priestsCount}</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <Video className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Live 1-on-1 Stream</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-white/5 rounded-xl border border-white/10">
                  <Truck className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Blessed Prasad Courier</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <Button size="lg" className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-base py-6 rounded-2xl shadow-xl border border-amber-300/60" onClick={() => setBookingDialogOpen(true)}>
                Book VIP Puja - ₹{currentPackage.price.toLocaleString('en-IN')} &rarr;
              </Button>

            </div>

          </div>

        </div>

        {/* ============================================================
            SECTION 2: "WHAT MAKES THIS SPECIAL" (विशेषताएँ)
            ============================================================ */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">WHY THIS RITUAL IS DIFFERENT</span>
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white">What Makes This Special?</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-slate-100 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-extrabold text-lg text-amber-200">Personalized 1-on-1 Sankalp</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Your full name, gotra, family members, and specific personal intention chanted with complete Vedic mantras by the Lead Acharya.
              </p>
            </Card>

            <Card className="p-6 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-slate-100 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-extrabold text-lg text-amber-200">Extended Ahuti & Yagya Vidhi</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Special herbs, energized samagri, and 108/1008 mantra ahutis offered solely for your intention in an exclusive mandap.
              </p>
            </Card>
          </div>
        </div>

        {/* ============================================================
            SECTION 3: "YOUR PERSONAL PUJA PROCESS" (पूजा प्रक्रिया)
            ============================================================ */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">5 SIMPLE STEPS</span>
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white">Your Personal Puja Process</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            <div className="p-5 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">1</div>
              <h5 className="font-bold text-sm text-amber-200">Select Slot</h5>
              <p className="text-[11px] text-slate-400">Choose date & time slot or use default auspicious Muhurat.</p>
            </div>

            <div className="p-5 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">2</div>
              <h5 className="font-bold text-sm text-amber-200">Submit Gotra</h5>
              <p className="text-[11px] text-slate-400">Provide name, gotra and specific Sankalp wishes.</p>
            </div>

            <div className="p-5 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">3</div>
              <h5 className="font-bold text-sm text-amber-200">Admin Assigns</h5>
              <p className="text-[11px] text-slate-400">Admin allocates certified Veda Acharya for your puja.</p>
            </div>

            <div className="p-5 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">4</div>
              <h5 className="font-bold text-sm text-amber-200">Watch Live</h5>
              <p className="text-[11px] text-slate-400">Join live stream or get HD WhatsApp video proof.</p>
            </div>

            <div className="p-5 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-center space-y-2">
              <div className="h-8 w-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center mx-auto">5</div>
              <h5 className="font-bold text-sm text-amber-200">Prasad Courier</h5>
              <p className="text-[11px] text-slate-400">Blessed prasad & yantra shipped to your address.</p>
            </div>

          </div>
        </div>

        {/* ============================================================
            SECTION 4: "WHAT YOU WILL RECEIVE" (आप क्या प्राप्त करेंगे)
            ============================================================ */}
        <div className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">SACRED DELIVERABLES</span>
            <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white">What You Will Receive</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-center space-y-2">
              <div className="text-2xl">🎥</div>
              <h5 className="font-bold text-base text-amber-200">Live Video & HD Proof</h5>
              <p className="text-xs text-slate-300">Complete video recording with explicit Gotra Sankalp sent on WhatsApp.</p>
            </div>

            <div className="p-5 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-center space-y-2">
              <div className="text-2xl">📦</div>
              <h5 className="font-bold text-base text-amber-200">Blessed Temple Prasad</h5>
              <p className="text-xs text-slate-300">Dry fruits, holy bhasma, kumkum & energized Raksha Sutra shipped pan-India.</p>
            </div>

            <div className="p-5 bg-[#2A0C14] border border-amber-500/30 rounded-2xl text-center space-y-2">
              <div className="text-2xl">🕉️</div>
              <h5 className="font-bold text-base text-amber-200">Energized Yantra</h5>
              <p className="text-xs text-slate-300">Sanctified Yantra energized during the Homa for your home altar.</p>
            </div>
          </div>
        </div>

        {/* ============================================================
            SECTION 5: "TRUE EXCLUSIVITY" (पूर्ण गोपनीयता व विशिष्टता)
            ============================================================ */}
        <div className="p-6 md:p-8 bg-[#2A0C14] border border-amber-500/40 rounded-3xl space-y-4 text-center max-w-3xl mx-auto shadow-xl">
          <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs px-3 py-1 font-bold">
            True Exclusivity & Trust
          </Badge>

          <ul className="text-xs md:text-sm text-slate-300 space-y-2 font-medium text-left max-w-md mx-auto">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-400 shrink-0" /> Limited 2-3 VIP Bookings Per Day
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-400 shrink-0" /> Dedicated Priest & Mandap Allocation by Admin
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-amber-400 shrink-0" /> 100% Personalized & Confidential Ritual
            </li>
          </ul>
        </div>

      </section>


      {/* ============================================================
          INTERACTIVE CALENDAR & TIME SLOT BOOKING MODAL
          ============================================================ */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-[#2A0C14] text-white rounded-3xl border-2 border-amber-400">
          <DialogHeader className="space-y-2 border-b border-amber-900/60 pb-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                VIP Booking Form
              </Badge>
              <span className="text-sm text-amber-400 font-extrabold">
                ₹{currentPackage.price.toLocaleString('en-IN')}
              </span>
            </div>
            <DialogTitle className="text-xl font-heading font-extrabold text-white">
              {currentPackage.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-300 font-medium">
              Choose your preferred date & time slot, or let DivyaYagyam assign the default auspicious Muhurat & verified Acharya.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmBooking} className="space-y-5 pt-3 text-left">
            
            {/* 1. Date Selection */}
            <div className="space-y-2">
              <Label className="font-bold text-xs text-amber-200">
                📅 Select Date (तिथि का चयन करें) <span className="text-slate-400 font-normal">(Optional - Or leave for default)</span>
              </Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl border-amber-500/40 bg-black/40 text-white text-sm font-medium"
              />
            </div>

            {/* 2. Time Slot Selector */}
            <div className="space-y-2">
              <Label className="font-bold text-xs text-amber-200">
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
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md'
                        : 'border-white/10 hover:border-amber-500/40 text-slate-300 bg-black/20'
                    }`}
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>{slot.label}</span>
                      {selectedTimeSlot === slot.id && <Check className="h-4 w-4 text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-slate-400 font-normal mt-0.5">{slot.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Assigned Priest Info */}
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-black/40 space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                <ShieldCheck className="h-4 w-4 text-amber-400" /> Assigned Priest (संस्थान द्वारा नियुक्त आचार्य)
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                {currentPackage.assignedPandit ? currentPackage.assignedPandit.name : 'DivyaYagyam Admin Assigned Senior Veda Acharya'}
              </p>
            </div>

            {/* 4. Devotee Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-amber-200">आपका नाम (Devotee Name) *</Label>
                <Input
                  type="text"
                  placeholder="e.g. राजेश शर्मा"
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  required
                  className="rounded-xl border-amber-500/40 bg-black/40 text-white text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-amber-200">व्हाट्सएप नंबर (WhatsApp Phone) *</Label>
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  required
                  className="rounded-xl border-amber-500/40 bg-black/40 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-amber-200">गोत्र (Gotra) <span className="text-slate-400 font-normal">(Optional)</span></Label>
                <Input
                  type="text"
                  placeholder="e.g. कश्यप / गर्ग"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  className="rounded-xl border-amber-500/40 bg-black/40 text-white text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-bold text-xs text-amber-200">विशेष मनोकामना (Sankalp Wish)</Label>
                <Input
                  type="text"
                  placeholder="e.g. कोर्ट केस में विजय एवं व्यापार वृद्धि"
                  value={sankalpWish}
                  onChange={(e) => setSankalpWish(e.target.value)}
                  className="rounded-xl border-amber-500/40 bg-black/40 text-white text-xs"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black rounded-xl text-sm shadow-xl py-6">
                Confirm VIP Booking via WhatsApp &rarr;
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>


      {/* Bottom Sticky Action Bar (Like DevPunya) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#150407]/95 backdrop-blur-md border-t border-amber-500/40 py-3 px-4 shadow-2xl">
        <div className="container mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="hidden sm:block text-left">
            <span className="text-xs text-amber-300 font-extrabold block truncate max-w-md">{currentPackage.name}</span>
            <span className="text-xs text-slate-300 font-medium">📍 {currentPackage.location}</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div>
              <span className="text-[10px] text-slate-400 font-medium block">Total Price</span>
              <span className="text-lg font-black text-amber-400">₹{currentPackage.price.toLocaleString('en-IN')}</span>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black text-sm px-6 py-5 rounded-xl shadow-lg" onClick={() => setBookingDialogOpen(true)}>
              Book VIP Puja - ₹{currentPackage.price.toLocaleString('en-IN')}
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

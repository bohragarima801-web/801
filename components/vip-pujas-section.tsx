'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { 
  Sparkles, Award, UserCheck, Calendar, Clock, Video, Truck, ShieldCheck, 
  Heart, CheckCircle2, ArrowRight, PhoneCall, MessageCircle, Star, ChevronRight,
  Flame, Lock, Compass, HelpCircle, X, Check, User
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
}

export interface VedicPanditItem {
  id: string
  name: string
  veda: string
  experience: string
  location: string
  photo: string
  rating: number
  specialization: string[]
  bio: string
}

const defaultVedicPandits: VedicPanditItem[] = [
  {
    id: 'pandit-1',
    name: 'पं. रामेश्वर शास्त्री (Pt. Rameshwar Shastri)',
    veda: 'शुक्ल यजुर्वेद संहिता विद्वान',
    experience: '25+ वर्ष अनुभव',
    location: 'काशी विश्वनाथ धाम, वाराणसी',
    photo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    specialization: ['रुद्राभिषेक', 'महामृत्युंजय जाप', 'नवग्रह शांति'],
    bio: 'वाराणसी संस्कृत विश्वविद्यालय से वेद पाठ्य निष्णात। 10,000+ संकल्पित पूजाओं का अनुभव।'
  },
  {
    id: 'pandit-2',
    name: 'आचार्य देवेन्द्र जोशी (Acharya Devendra Joshi)',
    veda: 'कर्मकाण्ड एवं ज्योतिष भास्कर',
    experience: '18+ वर्ष अनुभव',
    location: 'महाकालेश्वर धाम, उज्जैन',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    specialization: ['कालसर्प दोष', 'राहु-केतु शांति', 'रुद्रयज्ञ'],
    bio: 'उज्जैन महाकाल क्षेत्र के प्रमुख आचार्यों में से एक। तंत्र-मंत्र एवं वैदिक हवन विशेषज्ञ।'
  },
  {
    id: 'pandit-3',
    name: 'विद्वान बालकृष्ण भट्ट (Vidwan Balkrishna Bhat)',
    veda: 'कृष्ण यजुर्वेद एवं वेद भाष्यकार',
    experience: '22+ वर्ष अनुभव',
    location: 'त्र्यंबकेश्वर ज्योतिर्लिंग, नासिक',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    specialization: ['पितृदोष निवारण', 'नारायण नागबली', 'त्रिपिंडी श्राद्ध'],
    bio: 'त्र्यंबकेश्वर क्षेत्र में सर्व पितृ शांति व दोष निवारण महा-अनुष्ठानों के प्रामाणिक पंडित।'
  },
  {
    id: 'pandit-4',
    name: 'पं. कन्हैया लाल दवे (Pt. Kanhaiya Lal Dave)',
    veda: 'अथर्ववेद एवं महाविद्या विशेषज्ञ',
    experience: '20+ वर्ष अनुभव',
    location: 'माँ बगलामुखी पीठ, दतिया',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    specialization: ['बगलामुखी अनुष्ठान', 'शत्रु बाधा शांति', 'चंडी पाठ'],
    bio: 'सिद्ध पीठ बगलामुखी में महा-अनुष्ठान एवं तांत्रिक बाधा शांति के प्रसिद्ध आचार्य।'
  }
]

const defaultVipPackages: VipPackageItem[] = [
  {
    id: 'vip-1',
    name: 'VIP Mahamrityunjaya 1,25,000 Jaap & Mahayagya',
    shortDesc: 'Intensive Veda-chanted jaap for serious health concerns, longevity & divine protection.',
    location: 'Haridwar / Rishikesh Holy Ghats',
    duration: '5-Day Intensive Ritual',
    priestsCount: '5 Vedic Priests',
    price: 15100,
    categoryTag: 'Health & Protection',
    badgeTag: 'Most Chosen',
    slug: 'vip-mahamrityunjaya-jaap'
  },
  {
    id: 'vip-2',
    name: 'VIP Navagraha Shanti & Nakshatra Homa',
    shortDesc: 'Personalized 9-planet balancing ritual tailored strictly to your birth chart & gotra.',
    location: 'Trimbakeshwar Temple, Nashik',
    duration: 'Full-Day Ritual',
    priestsCount: '3 Senior Pandits',
    price: 11000,
    categoryTag: 'Karmic & Astrological',
    badgeTag: 'Recommended',
    slug: 'vip-navagraha-shanti'
  },
  {
    id: 'vip-3',
    name: 'VIP Lagna & Vivah Badha Nivaran Homa',
    shortDesc: 'Dedicated auspicious homa to remove obstacles in marriage and bless family harmony.',
    location: 'Kashi Vishwanath Temple, Varanasi',
    duration: 'Full-Day Ritual',
    priestsCount: '3 Vedic Priests',
    price: 9500,
    categoryTag: 'Marriage & Family',
    badgeTag: 'Popular',
    slug: 'vip-vivah-badha-nivaran'
  },
  {
    id: 'vip-4',
    name: 'VIP Kalsarp & Rahu-Ketu Dosh Nivaran',
    shortDesc: 'Deep dosha remediation conducted at sacred Jyotirlinga for career & life progress.',
    location: 'Mahakaleshwar Temple, Ujjain',
    duration: 'Full-Day Special Ritual',
    priestsCount: '4 Acharyas',
    price: 12500,
    categoryTag: 'Dosha Removal',
    badgeTag: 'Exclusive',
    slug: 'vip-kalsarp-shanti'
  }
]

const timeSlotOptions = [
  { id: 'default', label: '⚡ Default Auspicious Slot (संस्थान द्वारा तय शुभ समय)', desc: '11:00 AM Abhijit Muhurat (Recommended by Pandits)' },
  { id: 'brahma', label: '🌅 Brahma Muhurat / Morning Slot', desc: '06:00 AM - 09:00 AM (Best for Peace & Health)' },
  { id: 'abhijit', label: '☀️ Abhijit Muhurat / Midday Slot', desc: '11:00 AM - 02:00 PM (Best for Victory & Wealth)' },
  { id: 'godhuli', label: '🌆 Godhuli Muhurat / Evening Slot', desc: '05:00 PM - 08:00 PM (Best for Family & Prosperity)' },
]

export function VipPujasSection({ dbPackages = [] }: { dbPackages?: VipPackageItem[] }) {
  const packagesToDisplay = dbPackages.length > 0 ? dbPackages : defaultVipPackages
  const panditsList = defaultVedicPandits

  // Modal State for Booking & Slot Selection
  const [selectedPackage, setSelectedPackage] = useState<VipPackageItem | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  
  // Booking Form State
  const [devoteeName, setDevoteeName] = useState('')
  const [whatsappPhone, setWhatsappPhone] = useState('')
  const [gotra, setGotra] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('default')
  const [sankalpWish, setSankalpWish] = useState('')

  const handleOpenBooking = (pkg: VipPackageItem) => {
    setSelectedPackage(pkg)
    setBookingDialogOpen(true)
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

    const message = `Namaste DivyaYagyam Team!%0A%0A*I want to book a VIP Puja:*%0A- *Puja:* ${selectedPackage?.name}%0A- *Price:* ₹${selectedPackage?.price}%0A- *Devotee Name:* ${devoteeName}%0A- *WhatsApp:* ${whatsappPhone}%0A- *Gotra:* ${gotra || 'Kashyap / Unspecified'}%0A- *Preferred Date:* ${dateText}%0A- *Time Slot:* ${slotText}%0A- *Priest Allocation:* Admin Assigned Certified Veda Acharya%0A- *Sankalp Intention:* ${sankalpWish || 'Overall Prosperity & Health'}`

    window.open(`https://wa.me/919587171984?text=${message}`, '_blank')
    setBookingDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#FFF7EB] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      
      {/* ============================================================
          2.1 VIP HERO BANNER (PREMIUM ABOVE-THE-FOLD)
          ============================================================ */}
      <section className="relative w-full bg-gradient-to-br from-[#4C1D2F] via-[#7A1E3A] to-[#D97706] text-white py-16 md:py-24 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Side */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs md:text-sm font-extrabold tracking-wider uppercase backdrop-blur-md">
                <Award className="h-4 w-4 text-amber-400" /> Premium Service / VIP Pujas
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight">
                VIP Pujas – Exclusive, Personalized Rituals{' '}
                <span className="text-amber-300 block sm:inline mt-1 sm:mt-0 font-normal">
                  for Your Most Important Moments
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-amber-100/90 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience priority scheduling, dedicated Veda-certified priests assigned by DivyaYagyam admin, extended rituals, detailed sankalp with your name and gotra, and personalized HD video & prasad delivery to your doorstep.
              </p>

              <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
                  <UserCheck className="h-3.5 w-3.5 text-amber-400" /> Admin Assigned Priest
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" /> Custom Calendar & Slot
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
                  <Flame className="h-3.5 w-3.5 text-amber-400" /> Extended Rituals
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
                  <Video className="h-3.5 w-3.5 text-amber-400" /> Personalized Video & Prasad
                </span>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <Button size="lg" className="bg-gradient-to-r from-[#FF9F1C] to-[#D97706] hover:from-amber-500 hover:to-orange-600 text-white font-extrabold px-8 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all text-base border border-amber-300/40" asChild>
                  <a href="#vip-packages">
                    Request a VIP Puja <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>

                <Button size="lg" variant="outline" className="border-amber-400/50 bg-white/10 text-white hover:bg-white/20 font-bold px-6 py-6 rounded-xl text-base shadow-xs backdrop-blur-md" asChild>
                  <a href="#vedic-pandits">
                    Meet Certified Acharyas
                  </a>
                </Button>
              </div>

            </div>

            {/* Right Visual Card Side */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 bg-gradient-to-b from-white/10 to-black/40 backdrop-blur-md p-6 md:p-8 text-center space-y-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                  <Image 
                    src="https://images.unsplash.com/photo-1609345635867-03f565b9dfd1?auto=format&fit=crop&w=800&q=80" 
                    alt="VIP Sacred Temple Puja" 
                    fill 
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Priority Calendar • Time Slots
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-left">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">👑 Sacred Concierge</span>
                    <h3 className="text-lg font-extrabold text-white leading-tight">Personalized 1-on-1 Vedic Homa</h3>
                    <p className="text-xs text-slate-200 mt-0.5">Custom Gotra Sankalp & Admin Assigned Priest</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-left bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <div>
                    <p className="text-xs text-amber-200 font-semibold">Concierge Support</p>
                    <p className="text-sm font-extrabold text-white">Direct WhatsApp Assistance</p>
                  </div>
                  <Badge className="bg-emerald-500 text-white font-extrabold px-2.5 py-1 text-xs">
                    Live 24/7
                  </Badge>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================
          SHOWCASE: VERIFIED VEDIC PANDITS SECTION (हमारे सिद्ध वैदिक विद्वान)
          ============================================================ */}
      <section id="vedic-pandits" className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> DivyaYagyam Official Panelists
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            हमारे सिद्ध वैदिक विद्वान एवं आचार्य <span className="text-amber-700 dark:text-amber-400 font-normal block text-xl md:text-2xl mt-1">/ Verified Vedic Pandits</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            20+ वर्षों से तीर्थ क्षेत्रों में सेवारत, शास्त्र-पारंगत एवं दिव्य यज्ञम संस्थान द्वारा अधिकृत प्रामाणिक आचार्य मंडल।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {panditsList.map((pandit) => (
            <Card key={pandit.id} className="overflow-hidden border border-amber-200/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <Image 
                  src={pandit.photo} 
                  alt={pandit.name} 
                  fill 
                  className="object-cover object-top hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="h-3 w-3" /> Veda Verified
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-amber-400 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {pandit.rating}
                </div>
              </div>

              <CardContent className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-tight">
                    {pandit.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {pandit.veda}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    📍 {pandit.location} • 📜 {pandit.experience}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed pt-1">
                    {pandit.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {pandit.specialization.map((spec, sIdx) => (
                      <span key={sIdx} className="text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded-md">
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-amber-50/50 p-2 rounded-xl border border-amber-200/60 text-center">
                    🛡️ Admin Managed & Assigned Priest
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* ============================================================
          2.2 "WHY VIP PUJAS?" – BENEFITS GRID
          ============================================================ */}
      <section id="vip-benefits" className="container mx-auto px-4 md:px-6 py-16 border-t border-amber-100/60 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 shadow-xs">
            <Award className="h-3.5 w-3.5 text-amber-600" /> Exclusive Experience
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Why Choose VIP Pujas? <span className="text-amber-700 dark:text-amber-400 font-normal block text-xl md:text-2xl mt-1">/ VIP पूजाएँ क्यों विशेष हैं?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Admin Assigned Priest</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Our team selects the best Veda-certified Acharya for your specific Gotra and Puja requirement.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Custom Calendar & Slot</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Choose your preferred date and time slot, or let our Acharyas assign the default auspicious Muhurat for you.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Extended Vedic Vidhi</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Longer mantra chanting, 108/1008 ahuti offerings, and complete Shastra-guided steps beyond standard pujas.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>


      {/* ============================================================
          2.3 VIP PUJA PACKAGES – PREMIUM CARDS
          ============================================================ */}
      <section id="vip-packages" className="container mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-amber-100/60 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Exclusive Packages
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Select Your VIP Puja <span className="text-amber-700 dark:text-amber-400 font-normal block text-xl md:text-2xl mt-1">/ अपनी विशेष VIP पूजा चुनें</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {packagesToDisplay.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden border border-amber-300/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
              
              <div className="bg-gradient-to-r from-[#4C1D2F] to-[#7A1E3A] text-white p-6 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 border-none">
                    {pkg.badgeTag || 'VIP Exclusive'}
                  </Badge>
                  <span className="text-xs text-amber-200 font-bold">{pkg.categoryTag}</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl md:text-2xl leading-tight text-white">
                  {pkg.name}
                </h3>
              </div>

              <CardContent className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {pkg.shortDesc}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{pkg.priestsCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Live 1-on-1 / HD Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Prasad Courier</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Starting from</span>
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-400">
                      ₹{Number(pkg.price).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold rounded-xl shadow-xs text-xs px-5 py-5" onClick={() => handleOpenBooking(pkg)}>
                    Book & Choose Slot &rarr;
                  </Button>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* ============================================================
          INTERACTIVE CALENDAR & TIME SLOT BOOKING MODAL
          ============================================================ */}
      {selectedPackage && (
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-amber-400/80">
            <DialogHeader className="space-y-2 border-b border-amber-100 pb-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-500 text-white font-bold text-[10px]">
                  VIP Booking Form
                </Badge>
                <span className="text-xs text-amber-700 font-extrabold">
                  ₹{selectedPackage.price.toLocaleString('en-IN')}
                </span>
              </div>
              <DialogTitle className="text-xl font-heading font-extrabold text-slate-900 dark:text-slate-100">
                {selectedPackage.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600 font-medium">
                Choose your preferred date & time slot, or let DivyaYagyam assign the default auspicious Muhurat & verified Acharya.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirmBooking} className="space-y-5 pt-3">
              
              {/* 1. Date Selection */}
              <div className="space-y-2">
                <Label className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  📅 Select Date (तिथि का चयन करें) <span className="text-slate-400 font-normal">(Optional - Or leave for default)</span>
                </Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="rounded-xl border-amber-200 text-sm font-medium"
                />
              </div>

              {/* 2. Time Slot Selector */}
              <div className="space-y-2">
                <Label className="font-bold text-xs text-slate-800 dark:text-slate-200">
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
                          ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                          : 'border-slate-200 hover:border-amber-300 text-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{slot.label}</span>
                        {selectedTimeSlot === slot.id && <Check className="h-4 w-4 text-amber-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">{slot.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Priest Allocation Notice (Admin Controlled) */}
              <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60 dark:bg-slate-800/80 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900 dark:text-amber-300">
                  <ShieldCheck className="h-4 w-4 text-amber-600" /> Assigned Priest (संस्थान द्वारा नियुक्त आचार्य)
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  आपके गोत्र एवं मुहूर्त के अनुसार दिव्य यज्ञम संस्थान द्वारा सर्वोत्तम सिद्ध वैदिक ब्राह्मण/आचार्य नियुक्त किए जाएंगे।
                </p>
              </div>

              {/* 4. Devotee Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs">आपका नाम (Devotee Name) *</Label>
                  <Input
                    type="text"
                    placeholder="e.g. राजेश शर्मा"
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    required
                    className="rounded-xl border-amber-200 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs">व्हाट्सएप नंबर (WhatsApp Phone) *</Label>
                  <Input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    required
                    className="rounded-xl border-amber-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs">गोत्र (Gotra) <span className="text-slate-400 font-normal">(Optional)</span></Label>
                  <Input
                    type="text"
                    placeholder="e.g. कश्यप / गर्ग"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    className="rounded-xl border-amber-200 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs">विशेष मनोकामना (Sankalp Wish)</Label>
                  <Input
                    type="text"
                    placeholder="e.g. उत्तम स्वास्थ्य एवं व्यापार वृद्धि"
                    value={sankalpWish}
                    onChange={(e) => setSankalpWish(e.target.value)}
                    className="rounded-xl border-amber-200 text-xs"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex gap-3">
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white font-extrabold rounded-xl text-sm shadow-md">
                  Confirm VIP Booking via WhatsApp &rarr;
                </Button>
              </div>

            </form>
          </DialogContent>
        </Dialog>
      )}


      {/* ============================================================
          2.7 FINAL VIP CTA STRIP
          ============================================================ */}
      <section className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-16 border-t border-amber-400/40 shadow-xl">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6 max-w-4xl">
          <Badge className="bg-white/20 text-white border-white/30 text-xs px-3 py-1 font-bold rounded-full">
            VIP Personal Assistance
          </Badge>

          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white tracking-tight">
            Need Guidance on Which VIP Puja Is Right for You?
          </h2>

          <p className="text-base md:text-lg text-amber-100 font-medium">
            Talk directly to our spiritual advisors for a personalized recommendation based on your birth chart & requirement.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-amber-50 font-extrabold px-8 py-6 rounded-xl text-base shadow-lg" asChild>
              <a href="https://wa.me/919587171984?text=Namaste!%20I%20need%20VIP%20Puja%20guidance." target="_blank" rel="noopener noreferrer">
                <PhoneCall className="mr-2 h-5 w-5 text-amber-600" /> Talk to a Puja Advisor
              </a>
            </Button>

            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 font-bold px-8 py-6 rounded-xl text-base backdrop-blur-md" asChild>
              <a href="https://wa.me/919587171984?text=Namaste!%20I%20want%20to%20book%20a%20VIP%20Puja." target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5 text-emerald-400" /> WhatsApp Us for VIP Booking
              </a>
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}

'use client'

import { useState } from 'react'
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
    shortDesc: 'Court case victory, enemy neutralization, protection from severe negativity & business triumph.',
    location: 'Maa Katyayani Shakti Peeth, Jodhpur / Datia',
    duration: 'Full-Day Intensive Homa',
    priestsCount: '5 Veda Certified Acharyas',
    price: 15100,
    categoryTag: 'Tantra & Victory Homa',
    badgeTag: 'Most Popular VIP',
    slug: 'maa-bagalamukhi-mirchi-hawan',
    coverImage: '/bagalamukhi_mirchi_hawan_2.jpg'
  },
  {
    id: 'vip-2',
    name: 'Kashi Vishwanath Mahadev 1,25,000 Mahamrityunjaya Jaap',
    nameHi: 'काशी विश्वनाथ महामृत्युंजय सवा लाख मंत्र जाप एवं रुद्राभिषेक',
    shortDesc: 'Intensive Veda-chanted Mahamrityunjaya jaap for health, longevity, family protection & divine shield.',
    location: 'Kashi Vishwanath Temple, Varanasi',
    duration: '5-Day Continuous Ritual',
    priestsCount: '5 Senior Pandits',
    price: 21000,
    categoryTag: 'Health & Divine Protection',
    badgeTag: 'Exclusive Maha Yagya',
    slug: 'kashi-vishwanath-mahamrityunjaya',
    coverImage: '/mahamrityunjaya_hawan.webp'
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
    badgeTag: 'Recommended VIP',
    slug: 'shani-saadesati-dhaiya-dosh-nivaran-yagya',
    coverImage: '/shani_dosh_yagya.jpg'
  }
]

export function VipPujasSection({ dbPackages = [] }: { dbPackages?: VipPackageItem[] }) {
  const packagesToDisplay = dbPackages
  const [activePackageIndex, setActivePackageIndex] = useState(0)

  const categories = ['ALL', ...Array.from(new Set(displayPujas.map(p => p.categoryTag || 'VIP Ritual')))]

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
                key={pkg.id || idx}
                onClick={() => setActivePackageIndex(idx)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activePackageIndex === idx
                    ? 'bg-gradient-to-r from-[#8B1A21] to-[#B84430] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                <span>{pkg.title || pkg.name || `VIP Package ${idx + 1}`}</span>
              </button>
            ))}
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

      {/* ── VIP PUJA CARDS GRID & FILTER (Luxe Dark Gold Glassmorphism Theme) */}
      <section className="py-14 md:py-24 bg-[#0D0406]">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          
          {/* Header & Category Filters */}
          <div className="flex flex-col items-center justify-between gap-6 mb-12 text-center">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#F5B800] flex items-center justify-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#F5B800]" /> High-Impact Anushthans
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white">
                वीआईपीसी <span className="bg-gradient-to-r from-[#F5B800] to-[#FFD700] bg-clip-text text-transparent">महा अनुष्ठान सूची</span>
              </h2>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2.5 bg-black/50 p-2 rounded-2xl border border-[#F5B800]/20 backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#F5B800] to-[#D49B00] text-[#2B0306] shadow-[0_4px_15px_rgba(245,184,0,0.3)] scale-105'
                      : 'text-[#FFF3D6]/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat === 'ALL' ? '🌟 All VIP Pujas' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPujas.map((p, idx) => (
              <article
                key={p.id}
                className="group relative flex flex-col bg-gradient-to-b from-[#1C060B] to-[#120306] rounded-3xl overflow-hidden border border-[#F5B800]/30 hover:border-[#F5B800] shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_50px_rgba(245,184,0,0.25)] transition-all duration-300"
              >
                {/* Image & Overlay */}
                <Link href={`/pujas/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                  <SacredImageFrame 
                    src={p.coverImage || '/logo.jpg'} 
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10">
                    <span className="bg-gradient-to-r from-[#8B1A21] to-[#4A0A10] text-[#FFD700] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg border border-[#F5B800]/80 flex items-center gap-1.5">
                      <Crown className="h-3 w-3 text-[#F5B800]" /> ROYAL VIP
                    </span>
                    {p.badgeTag && (
                      <span className="bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#2B0306] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        {p.badgeTag}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-black/70 backdrop-blur-md border border-[#F5B800]/40 text-[#FFF3D6] text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-md">
                      <Clock className="w-3 h-3 text-[#F5B800]" />
                      {p.duration || 'Full-Day'}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#120306] via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFF3D6]">
                      <MapPin className="w-3.5 h-3.5 text-[#F5B800]" />
                      <span className="line-clamp-1">{p.location || 'Holy Temple, India'}</span>
                    </div>
                  </div>
                </Link>

                {/* Card Body Content */}
                <div className="flex flex-col flex-grow p-6 justify-between gap-4">
                  <div className="space-y-3">
                    {p.categoryTag && (
                      <div>
                        <span className="text-[10px] font-black text-[#F5B800] tracking-widest uppercase bg-[#F5B800]/10 px-3 py-1 rounded-full border border-[#F5B800]/30">
                          {p.categoryTag}
                        </span>
                      </div>
                    )}

                    <h3 className="font-heading font-extrabold text-xl text-white group-hover:text-[#F5B800] transition-colors leading-snug line-clamp-2">
                      <Link href={`/pujas/${p.slug}`}>{p.name}</Link>
                    </h3>

                    <p className="text-xs text-[#FFF3D6]/70 leading-relaxed line-clamp-3">
                      {p.shortDesc}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="py-3 border-y border-[#F5B800]/15 space-y-1.5 text-xs text-[#FFF3D6]/80 font-medium">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-[#F5B800] shrink-0" />
                      <span>{p.priestsCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Dedicated Live Stream & Royal Prasad</span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-[#FFF3D6]/50 block uppercase font-bold tracking-wider">Dakshina</span>
                      <span className="text-2xl font-black text-[#F5B800] drop-shadow-sm">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      href={`/pujas/${p.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#D49B00] text-[#2B0306] font-extrabold text-xs shadow-lg hover:shadow-[0_0_20px_rgba(245,184,0,0.5)] hover:scale-105 transition-all duration-300"
                    >
                      Book VIP Anushthan <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── VIP Trust Guarantee Section */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#2B0306] via-[#4A0A10] to-[#2B0306] border-2 border-[#F5B800]/60 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F5B800] text-[#2B0306] font-black text-xs uppercase tracking-widest">
                👑 Royal Seva Commitment
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-[#FFF3D6]">
                क्यों चुनें दिव्ययज्ञम् VIP महा अनुष्ठान?
              </h3>
              <p className="text-sm text-[#FFF3D6]/80 leading-relaxed font-medium">
                VIP अनुष्ठान केवल आपके परिवार के लिए विशेष रूप से संपन्न किए जाते हैं। इसमें 27 से अधिक वर्षों के अनुभवी वरिष्ठ आचार्यों एवं उनकी योग्य विद्वान टीम द्वारा विशेष नाम-गोत्र संकल्प, अखंड मंत्र जाप एवं लाइव वीडियो प्रमाण के साथ अनुष्ठान संपन्न किया जाता है, तथा विशेष आशीर्वाद स्वरूप दिव्य सामग्री आपके घर प्रसाद के रूप में दी जाती है।
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="https://wa.me/919587171984?text=Namaste!%20I%20want%20to%20book%20a%20VIP%20Anushthan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#2B0306] font-black text-sm shadow-xl hover:scale-105 transition-all"
              >
                💬 Talk to Lead Acharya on WhatsApp →
              </a>
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

        </div>
      </section>
    </div>
  )
}


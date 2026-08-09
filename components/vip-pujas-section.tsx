'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SacredImageFrame } from '@/components/ui/safe-image'
import { MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck, Crown, Flame, Award, Video, CheckCircle2, Star, UserCheck, Filter, Heart, Clock } from 'lucide-react'

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
    priestsCount: '5 अनुभवी वेदाचार्य (5 Senior Veda Acharyas)',
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
  const displayPujas = dbPackages.length > 0 ? dbPackages : defaultVipPackages
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const categories = ['ALL', ...Array.from(new Set(displayPujas.map(p => p.categoryTag || 'VIP Ritual')))]

  const filteredPujas = selectedCategory === 'ALL'
    ? displayPujas
    : displayPujas.filter(p => (p.categoryTag || 'VIP Ritual') === selectedCategory)

  return (
    <div className="bg-[#FFFBF7] text-[#111827] min-h-screen">
      {/* ── HERO BANNER */}
      <section className="relative bg-gradient-to-b from-[#FFFBF7] via-[#FFF8F2] to-[#FFFBF7] py-16 md:py-24 overflow-hidden border-b border-[#F3E8DE]">
        <div aria-hidden="true" className="absolute -right-10 -top-10 text-[35vw] font-heading text-orange-500/5 leading-none pointer-events-none select-none overflow-hidden animate-om-pulse">
          ॐ
        </div>

        <div className="container relative z-10 text-center max-w-5xl mx-auto px-4">
          {/* VIP Badge */}
          <div className="kundli-badge-orange mb-6 shadow-sm inline-flex">
            <Crown className="h-4 w-4 text-[#FF7A00]" />
            <span>👑 ROYAL VIP ANUSHTHAN (विशिष्ट सिद्ध महापूजा)</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#111827] leading-[1.15] mb-5 tracking-tight">
            Exclusive VIP Anushthans &{' '}
            <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] bg-clip-text text-transparent">
              Personalized Yagyas
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#4B5563] max-w-3xl mx-auto leading-relaxed font-medium">
            27+ वर्षों के अनुभवी सिद्ध वेदाचार्यों द्वारा व्यक्तिगत नाम-गोत्र संकल्प, समर्पित ब्राह्मण दल एवं लाइव HD वीडियो स्ट्रीमिंग के साथ।
          </p>

          {/* Trust Chips */}
          <div className="flex flex-wrap gap-3 justify-center mt-9 max-w-4xl mx-auto">
            {[
              { icon: <UserCheck className="h-4 w-4 text-[#FF7A00]" />, label: 'Dedicated 5 Veda Acharyas' },
              { icon: <Flame className="h-4 w-4 text-[#FF7A00]" />, label: 'Personalized 1.25L Mantra Jaap' },
              { icon: <Video className="h-4 w-4 text-[#FF7A00]" />, label: 'Private Live WhatsApp Video' },
              { icon: <Award className="h-4 w-4 text-[#FF7A00]" />, label: 'Special Prasad Box Home Delivery' }
            ].map((t) => (
              <div 
                key={t.label} 
                className="inline-flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-[#F3E8DE] text-xs font-bold text-[#111827] shadow-sm"
              >
                {t.icon}
                <span>{t.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── VIP PUJA CARDS GRID & FILTER */}
      <section className="py-14 md:py-24 bg-[#FFFBF7]">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          
          {/* Header & Category Filters */}
          <div className="flex flex-col items-center justify-between gap-6 mb-12 text-center">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#FF7A00] flex items-center justify-center gap-1.5 font-heading">
                <Sparkles className="h-4 w-4 text-[#FF7A00]" /> High-Impact Anushthans
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#111827]">
                वीआईपीसी <span className="text-[#FF7A00] font-bold">महा अनुष्ठान सूची</span>
              </h2>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2.5 bg-white p-2 rounded-2xl border border-[#F3E8DE] shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white shadow-md scale-105'
                      : 'text-[#4B5563] hover:text-[#FF7A00] hover:bg-orange-50'
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
                className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#F3E8DE] hover:border-[#FF7A00]/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 reveal"
              >
                {/* Image & Overlay */}
                <Link href={`/pujas/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                  <SacredImageFrame 
                    src={p.coverImage || '/logo.jpg'} 
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10">
                    <span className="kundli-badge-orange shadow-sm">
                      <Crown className="h-3 w-3 text-[#FF7A00]" /> VIP EXCLUSIVE
                    </span>
                    {p.badgeTag && (
                      <span className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        {p.badgeTag}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-[#111827]/80 backdrop-blur-md border border-white/20 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                      <Clock className="w-3 h-3 text-[#FF7A00]" />
                      {p.duration || 'Full-Day'}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                      <MapPin className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span className="line-clamp-1">{p.location || 'Holy Temple, India'}</span>
                    </div>
                  </div>
                </Link>

                {/* Card Body Content */}
                <div className="flex flex-col flex-grow p-6 justify-between gap-4">
                  <div className="space-y-3">
                    {p.categoryTag && (
                      <div>
                        <span className="text-[10px] font-black text-[#FF7A00] tracking-widest uppercase bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                          {p.categoryTag}
                        </span>
                      </div>
                    )}

                    <h3 className="font-heading font-extrabold text-xl text-[#111827] group-hover:text-[#FF7A00] transition-colors leading-snug line-clamp-2">
                      <Link href={`/pujas/${p.slug}`}>{p.name}</Link>
                    </h3>

                    <p className="text-xs text-[#4B5563] leading-relaxed line-clamp-3 font-medium">
                      {p.shortDesc}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="py-3 border-y border-[#F3E8DE] space-y-1.5 text-xs text-[#4B5563] font-medium">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-[#FF7A00] shrink-0" />
                      <span>{p.priestsCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Dedicated Live Stream & Royal Prasad</span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] text-[#4B5563] block uppercase font-bold tracking-wider">Dakshina</span>
                      <span className="text-2xl font-heading font-black text-[#FF7A00]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      href={`/pujas/${p.slug}`}
                      className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-xs py-2.5 px-5 rounded-full shadow-md hover:shadow-lg hover:shadow-[#FF7A00]/25 transition-all inline-flex items-center gap-1.5"
                    >
                      Book VIP Anushthan <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── VIP Trust Guarantee Section */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-white border border-[#F3E8DE] text-[#111827] shadow-sm relative overflow-hidden text-center space-y-6">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="kundli-badge-orange inline-flex">
                👑 Royal Seva Commitment
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-[#111827]">
                क्यों चुनें दिव्ययज्ञम् VIP महा अनुष्ठान?
              </h3>
              <p className="text-sm text-[#4B5563] leading-relaxed font-medium">
                VIP अनुष्ठान केवल आपके परिवार के लिए विशेष रूप से संपन्न किए जाते हैं। इसमें 27 से अधिक वर्षों के अनुभवी वरिष्ठ आचार्यों एवं उनकी योग्य विद्वान टीम द्वारा विशेष नाम-गोत्र संकल्प, अखंड मंत्र जाप एवं लाइव वीडियो प्रमाण के साथ अनुष्ठान संपन्न किया जाता है, तथा विशेष आशीर्वाद स्वरूप दिव्य सामग्री आपके घर प्रसाद के रूप में दी जाती है।
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="https://wa.me/919587171984?text=Namaste!%20I%20want%20to%20book%20a%20VIP%20Anushthan"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white font-bold text-sm py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
              >
                💬 Talk to Lead Acharya on WhatsApp →
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}


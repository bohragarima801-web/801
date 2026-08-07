'use client'

import Link from 'next/link'
import { SacredImageFrame } from '@/components/ui/safe-image'
import { MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck, Crown, Flame, Award, Video, CheckCircle2, Star } from 'lucide-react'

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

  return (
    <div className="bg-[#FFFDF7] min-h-screen">
      {/* ── ROYAL VIP HERO BANNER (Imperial Deep Maroon × Pitambara Yellow Theme) */}
      <section className="relative bg-gradient-to-b from-[#3D0408] via-[#54080F] to-[#2B0306] py-16 md:py-24 overflow-hidden border-b-4 border-[#F5B800]">
        {/* Glowing Om Watermark */}
        <div aria-hidden="true" className="absolute -right-10 -top-10 text-[35vw] font-serif text-[rgba(245,184,0,0.04)] leading-none pointer-events-none select-none overflow-hidden">
          ॐ
        </div>

        {/* Ambient Pitambara Gold & Agni Glow Effects */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[rgba(245,184,0,0.14)] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[rgba(139,26,33,0.25)] rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10 text-center max-w-5xl mx-auto px-4">
          
          {/* VIP Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#3D0408] shadow-[0_4px_20px_rgba(245,184,0,0.35)] border border-[#FFE89C] mb-6 animate-pulse">
            <Crown className="h-4 w-4 fill-[#3D0408] text-[#3D0408]" />
            <span className="text-[12px] font-black uppercase tracking-[0.16em]">👑 Sri Royal VIP Anushthan (विशिष्ट सिद्ध पूजा)</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[1.15] mb-5 tracking-tight">
            Exclusive VIP Pujas &{' '}
            <span className="bg-gradient-to-r from-[#FFE89C] via-[#F5B800] to-[#FFD700] bg-clip-text text-transparent drop-shadow-sm">
              Maha Yagyas
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#FFF3D6] max-w-3xl mx-auto leading-relaxed font-medium">
            वरिष्ठ पीताम्बरा वेदाचार्यों द्वारा विशेष नाम-गोत्र संकल्प के साथ व्यक्तिगत अनुष्ठान। १,२५,००० जाप, अखंड दीप, व्हाट्सएप पर एचडी लाइव वीडियो प्रमाण एवं घर द्वार दिव्य रजत-प्रसाद।
          </p>

          {/* Trust Chips */}
          <div className="flex flex-wrap gap-3 justify-center mt-9 max-w-4xl mx-auto">
            {[
              { icon: <UserCheck className="h-4 w-4 text-[#F5B800]" />, label: 'Dedicated 3-5 Senior Pandits' },
              { icon: <Flame className="h-4 w-4 text-[#F5B800]" />, label: 'Extended Maha Yagya & 1.25L Jaap' },
              { icon: <Video className="h-4 w-4 text-[#F5B800]" />, label: 'HD Live Video & Personal Proof' },
              { icon: <Award className="h-4 w-4 text-[#F5B800]" />, label: 'Royal Prasad Box Home Delivery' }
            ].map((t) => (
              <div 
                key={t.label} 
                className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-[#54080F]/90 to-[#3D0408]/90 rounded-full border border-[#F5B800]/40 text-xs font-bold text-[#FFF3D6] shadow-md backdrop-blur-md"
              >
                {t.icon}
                <span>{t.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── VIP PUJA CARDS GRID (Deep Maroon × Pitambara Yellow Cards) */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-[#FFFDF7] via-[#FFF8EA] to-[#FFFDF7]">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#8B1A21] flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#F5B800]" /> Select Sacred VIP Ritual
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-extrabold text-[#2A050A]">
              सिद्ध पीठों के <span className="text-[#8B1A21]">विशेष वीआईपीसी महा अनुष्ठान</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#8B1A21] via-[#F5B800] to-[#8B1A21] mx-auto rounded-full" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayPujas.map((p, idx) => (
              <article
                key={p.id}
                className={`group relative flex flex-col bg-gradient-to-b from-white to-[#FFFDF5] rounded-3xl overflow-hidden border-2 border-[#E5C16C] shadow-[0_8px_30px_rgba(84,8,15,0.07)] hover:shadow-[0_16px_50px_rgba(84,8,15,0.20)] hover:border-[#F5B800] transition-all duration-300 reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}
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
                    <span className="bg-gradient-to-r from-[#54080F] to-[#8B1A21] text-[#FFF5D6] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md border border-[#F5B800]/60 flex items-center gap-1.5">
                      <Crown className="h-3 w-3 text-[#F5B800]" /> VIP RITUAL
                    </span>
                    {p.badgeTag && (
                      <span className="bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#3D0408] text-[10px] font-black px-2.5 py-1 rounded-full shadow-md">
                        {p.badgeTag}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-[#54080F]/90 backdrop-blur-md border border-[#F5B800]/50 text-[#FFF3D6] text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex flex-col items-center shadow-md">
                      <Calendar className="w-3.5 h-3.5 text-[#F5B800] mb-0.5" />
                      Any Day
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A0306]/85 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FFF3D6]">
                      <MapPin className="w-3.5 h-3.5 text-[#F5B800]" />
                      <span className="line-clamp-1">{p.location || 'Holy Temple, India'}</span>
                    </div>
                  </div>
                </Link>

                {/* Card Body Content */}
                <div className="flex flex-col flex-grow p-6">
                  {p.categoryTag && (
                    <div className="mb-2">
                      <span className="text-[10px] font-black text-[#8B1A21] tracking-widest uppercase bg-[#FFF5D6] px-2.5 py-0.5 rounded-full border border-[#F5B800]/40">
                        {p.categoryTag}
                      </span>
                    </div>
                  )}
                  
                  <Link href={`/pujas/${p.slug}`} className="group-hover:text-[#8B1A21] transition-colors">
                    <h3 className="font-heading text-lg sm:text-xl font-extrabold text-[#2A050A] leading-snug mb-2 line-clamp-2">
                      {p.name}
                    </h3>
                  </Link>
                  
                  <p className="text-xs text-[#523B30] mb-6 line-clamp-2 leading-relaxed flex-grow font-medium">
                    {p.shortDesc}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 mb-6 pt-3 border-t border-[#F5E2B8]/60">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3D0408]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#8B1A21] shrink-0" />
                      <span>{p.priestsCount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#523B30]">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#F5B800] shrink-0" />
                      <span>{p.duration}</span>
                    </div>
                  </div>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-[#F5B800]/30">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#6B4E3B] font-bold uppercase tracking-wider">VIP Sankalp</span>
                      <span className="text-2xl font-black text-[#8B1A21]">
                        ₹{p.price?.toLocaleString('en-IN') || '21,000'}
                      </span>
                    </div>
                    <Link 
                      href={`/pujas/${p.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#8B1A21] via-[#A3232A] to-[#F5B800] text-white px-6 py-3 rounded-full text-xs font-black shadow-md shadow-[#8B1A21]/25 hover:shadow-xl hover:scale-[1.04] transition-all"
                    >
                      Book VIP <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── VIP Trust Guarantee Section */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-[#3D0408] via-[#54080F] to-[#2B0306] border-2 border-[#F5B800] text-white shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#F5B800] text-[#3D0408] font-black text-xs uppercase tracking-widest">
                👑 Royal Seva Commitment
              </div>
              <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-[#FFF3D6]">
                क्यों चुनें दिव्ययज्ञम् VIP महा अनुष्ठान?
              </h3>
              <p className="text-sm text-[#FFE89C] leading-relaxed font-medium">
                VIP अनुष्ठान केवल आपके परिवार के लिए विशेष रूप से संपन्न किए जाते हैं। इसमें 5 से 11 वरिष्ठ वेदाचार्यों द्वारा अखंड मंत्र जाप, विशेष हवन सामग्री, व्हाट्सएप पर लाइव वीडियो संकल्प एवं रजत-प्रसाद विशेष डिब्बे में भेजा जाता है।
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="https://wa.me/919587171984?text=Namaste!%20I%20want%20to%20book%20a%20VIP%20Anushthan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F5B800] via-[#FFD700] to-[#E5A100] text-[#3D0408] font-black text-sm shadow-xl hover:scale-105 transition-all"
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

'use client'

import Link from 'next/link'
import { SacredImageFrame } from '@/components/ui/safe-image'
import { MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck, Crown } from 'lucide-react'

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
    priestsCount: '5 अनुभवी वेदाचार्य (5 Senior Veda Acharyas)',
    price: 15100,
    categoryTag: 'Tantra & Victory Homa',
    badgeTag: 'Most Popular VIP',
    slug: 'mata-baglamukhi-mirchi-havan',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80'
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
    coverImage: 'https://images.unsplash.com/photo-1609345635867-03f565b9dfd1?auto=format&fit=crop&w=800&q=80'
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
    coverImage: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80'
  }
]

export function VipPujasSection({ dbPackages = [] }: { dbPackages?: VipPackageItem[] }) {
  const displayPujas = dbPackages.length > 0 ? dbPackages : defaultVipPackages

  return (
    <div className="bg-[#FFFBF5]">
      {/* ── Hero Banner (Light Nimbu Pila & Sanatani Gold Theme) */}
      <section className="relative bg-gradient-to-b from-[#FFF8EB] via-[#FFF3D6] to-[#FFFDF7] py-16 md:py-24 overflow-hidden border-b border-[#F5E2B8]">
        {/* Om watermark */}
        <div aria-hidden="true" className="absolute right-0 top-0 text-[30vw] font-serif text-[rgba(212,155,0,0.06)] leading-none pointer-events-none select-none overflow-hidden">ॐ</div>

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5D6] border border-[#F2C94C] shadow-xs mb-6">
            <Crown className="h-4 w-4 text-[#8B5A00]" />
            <span className="text-[#8B5A00] text-[11px] font-extrabold uppercase tracking-[0.14em]">VIP Sacred Rituals (विशिष्ट अनुष्ठान)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-[#2A1508] leading-[1.15] mb-4">
            Exclusive VIP Pujas &{' '}
            <span className="bg-gradient-to-r from-[#8B1A21] via-[#D49B00] to-[#8B1A21] bg-clip-text text-transparent">Maha Yagyas</span>
          </h1>

          <p className="text-base sm:text-lg text-[#4A2D1B] max-w-2xl mx-auto leading-relaxed font-medium">
            विशेष आचार्यों एवं वेदाचार्यों द्वारा व्यक्तिगत अनुष्ठान। संपूर्ण सिद्धि, विस्तृत जाप, एवं लाइव वीडियो संकल्प के साथ विशेष पूजा।
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {['Dedicated 3-5 Pandits (विशेष पंडित)', 'Extended Maha Yagya (दीर्घ महायज्ञ)', 'HD Live Video & Photos', 'Premium Prasad Box'].map((t) => (
              <span key={t} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-full border border-[#F0D695] text-xs font-bold text-[#2A1508] shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-[#8B1A21] shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIP Puja Cards Grid */}
      <section className="py-14 md:py-20">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayPujas.map((p, idx) => (
              <article
                key={p.id}
                className={`group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#F5E2B8] shadow-sm hover:shadow-xl hover:border-[#F2C94C] transition-all duration-300 reveal reveal-delay-${Math.min(idx % 3 + 1, 5)}`}
              >
                {/* Image */}
                <Link href={`/pujas/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden">
                  <SacredImageFrame 
                    src={p.coverImage || '/logo.jpg'} 
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-10">
                    <span className="bg-[#FFFBF5]/95 backdrop-blur-md border border-[#F2C94C] text-[#8B5A00] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Crown className="h-3 w-3" /> VIP Ritual
                    </span>
                    {p.badgeTag && (
                      <span className="bg-gradient-to-r from-[#8B1A21] to-[#D49B00] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                        {p.badgeTag}
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-[#FFFBF5]/95 backdrop-blur-md border border-[#F2C94C] text-[#2A1508] text-[10px] font-extrabold px-2 py-1 rounded-lg flex flex-col items-center shadow-sm">
                      <Calendar className="w-3.5 h-3.5 text-[#D49B00] mb-0.5" />
                      Any Day
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B05]/80 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-white">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span className="line-clamp-1 opacity-90">{p.location || 'Holy Temple, India'}</span>
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <div className="flex flex-col flex-grow p-5 sm:p-6">
                  {p.categoryTag && (
                    <div className="mb-2">
                      <span className="text-[10px] font-bold text-[#8B1A21] tracking-widest uppercase">{p.categoryTag}</span>
                    </div>
                  )}
                  
                  <Link href={`/pujas/${p.slug}`} className="group-hover:text-[#8B1A21] transition-colors">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2A1508] leading-snug mb-2 line-clamp-2">
                      {p.name}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-[#6B5A51] mb-5 line-clamp-2 leading-relaxed flex-grow">
                    {p.shortDesc}
                  </p>
                  
                  {/* Price & Action */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F5E2B8]">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#6B5A51] font-semibold uppercase tracking-wider">Starts From</span>
                      <span className="text-xl font-extrabold text-[#2A1508]">
                        ₹{p.price?.toLocaleString('en-IN') || '21,000'}
                      </span>
                    </div>
                    <Link 
                      href={`/pujas/${p.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#8B1A21] to-[#A3232A] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-[#8B1A21]/20 hover:shadow-lg hover:from-[#A3232A] hover:to-[#8B1A21] transition-all group-hover:scale-105"
                    >
                      Book VIP <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SacredImageFrame } from '@/components/ui/safe-image'
import { MapPin, Calendar, Sparkles, ArrowRight, ShieldCheck, Crown, Flame, Award, Video, CheckCircle2, Star, UserCheck, Clock } from 'lucide-react'

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
  benefits?: string[]
}

const defaultVipPackages: VipPackageItem[] = [
  {
    id: 'vip-1',
    name: 'माँ बगलामुखी मिर्ची हवन एवं सर्व कार्य सिद्धि महायज्ञ',
    nameHi: 'माँ बगलामुखी मिर्ची हवन एवं सर्व कार्य सिद्धि महायज्ञ',
    shortDesc: 'शत्रु बाधा, कानूनी विवाद में विजय, व्यापारिक बाधा निवारण एवं सर्व सुरक्षा हेतु सिद्ध पीठ में 5 वरिष्ठ आचार्यों द्वारा अनुष्ठान।',
    location: 'माँ बगलामुखी धाम, दतिया / जोधपुर',
    duration: 'पूर्ण दिवसीय महा अनुष्ठान',
    priestsCount: '5 वरिष्ठ विद्वान आचार्य',
    price: 15100,
    categoryTag: 'कार्य सिद्धि महायज्ञ',
    badgeTag: '👑 सर्वाधिक लोकप्रिय',
    slug: 'maa-bagalamukhi-mirchi-hawan',
    coverImage: '/bagalamukhi_mirchi_hawan_2.jpg'
  },
  {
    id: 'vip-2',
    name: 'काशी विश्वनाथ महामृत्युंजय सवा लाख मंत्र जाप एवं रुद्राभिषेक',
    nameHi: 'काशी विश्वनाथ महामृत्युंजय सवा लाख मंत्र जाप एवं रुद्राभिषेक',
    shortDesc: 'उत्तम स्वास्थ्य, दीर्घायु, ग्रह दोष शांति एवं परिवार की संपूर्ण रक्षा हेतु 5 दिवसीय अखंड वेदोक्त महा अनुष्ठान।',
    location: 'काशी विश्वनाथ ज्योतिर्लिंग, वाराणसी',
    duration: '5 दिवसीय अखंड अनुष्ठान',
    priestsCount: '5 वरिष्ठ विद्वान पंडित',
    price: 21000,
    categoryTag: 'स्वास्थ्य एवं रक्षा कवच',
    badgeTag: '🌟 विशेष महायज्ञ',
    slug: 'kashi-vishwanath-mahamrityunjaya',
    coverImage: '/mahamrityunjaya_hawan.webp'
  },
  {
    id: 'vip-3',
    name: 'महाकालेश्वर उज्जैन कालसर्प एवं राहु-केतु दोष निवारण महापूजा',
    nameHi: 'महाकालेश्वर उज्जैन कालसर्प एवं राहु-केतु दोष निवारण महापूजा',
    shortDesc: 'भस्म आरती धाम में 9 ग्रह शांति, कालसर्प दोष निवारण एवं जीवन में निरंतर आ रही बाधाओं की समाप्ति हेतु विशेष अनुष्ठान।',
    location: 'महाकालेश्वर मंदिर, उज्जैन',
    duration: 'पूर्ण दिवसीय विशेष पूजा',
    priestsCount: '4 वरिष्ठ आचार्य',
    price: 12500,
    categoryTag: 'दोष निवारण महापूजा',
    badgeTag: '⚡ शीघ्र फलदायी',
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
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen font-sans notranslate" translate="no">
      
      {/* ── ROYAL VIP HERO BANNER (Warm Ivory × Antique Gold × Royal Saffron) ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-14 md:py-20 overflow-hidden border-b border-[#E6D6BE]">
        {/* Subtle Om Watermark */}
        <div aria-hidden="true" className="absolute -right-8 -top-8 text-[32vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">
          ॐ
        </div>

        <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
          {/* VIP Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E6D6BE] bg-white text-[#E58A16] text-xs font-black uppercase tracking-wider mb-4 shadow-2xs">
            <Crown className="h-4 w-4 text-[#C99A3D]" />
            <span>👑 विशिष्ट सिद्ध महा अनुष्ठान (VIP LIVE SEVA)</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-4 tracking-tight">
            विशिष्ट वीआईपी अनुष्ठान एवं <span className="text-[#E58A16]">व्यक्तिगत महायज्ञ</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#4A403C] max-w-2xl mx-auto leading-relaxed font-medium">
            27+ वर्षों के अनुभवी सिद्ध आचार्यों द्वारा आपके परिवार के लिए विशेष नाम-गोत्र संकल्प, समर्पित ब्राह्मण दल एवं 1-on-1 व्हाट्सएप वीडियो स्ट्रीमिंग के साथ।
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3 justify-center mt-8 max-w-3xl mx-auto">
            {[
              { icon: <UserCheck className="h-4 w-4 text-[#E58A16]" />, label: '5 समर्पित वरिष्ठ आचार्य' },
              { icon: <Flame className="h-4 w-4 text-[#E58A16]" />, label: 'सवा लाख अखंड मंत्र जाप' },
              { icon: <Video className="h-4 w-4 text-[#E58A16]" />, label: '1-on-1 लाइव वीडियो प्रमाण' },
              { icon: <Award className="h-4 w-4 text-[#E58A16]" />, label: 'अभिमंत्रित पावन राजप्रसाद' }
            ].map((t) => (
              <div 
                key={t.label} 
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-[#E6D6BE] text-xs font-bold text-[#292321] shadow-2xs"
              >
                {t.icon}
                <span className="truncate">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIP PUJA CARDS GRID & FILTER ── */}
      <section className="py-12 md:py-16 bg-[#FFF9EF]">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          
          {/* Header & Category Filters */}
          <div className="flex flex-col items-center justify-between gap-5 mb-10 text-center">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E58A16] flex items-center justify-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> सिद्ध फलदायी अनुष्ठान
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#292321]">
                वीआईपी <span className="text-[#E58A16]">महा अनुष्ठान सूची</span>
              </h2>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-2 bg-white p-1.5 rounded-2xl border border-[#E6D6BE] shadow-2xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#E58A16] text-white shadow-xs'
                      : 'text-[#665E58] hover:text-[#292321] hover:bg-[#F7EBD7]'
                  }`}
                >
                  {cat === 'ALL' ? '🌟 सभी VIP अनुष्ठान' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPujas.map((p) => (
              <article
                key={p.id}
                className="group relative flex flex-col bg-white rounded-2xl border border-[#E6D6BE] hover:border-[#E58A16] transition-all duration-300 hover:-translate-y-1 shadow-2xs hover:shadow-xl overflow-hidden justify-between"
              >
                {/* Image & Overlay */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 shrink-0">
                  <Link href={`/pujas/${p.slug}`} className="block relative w-full h-full">
                    <SacredImageFrame 
                      src={p.coverImage || '/katyayani_yagya_hero.jpg'} 
                      alt={p.name}
                      aspectRatio="16/9"
                      fitMode="cover"
                      seoCategory="puja"
                      className="p-0 border-none rounded-none w-full h-full"
                      imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1 z-10">
                      <span className="inline-flex items-center gap-1 bg-[#6B2635] text-white text-[10px] font-black px-2.5 py-0.5 rounded-md shadow-xs border border-[#C99A3D]">
                        <Crown className="h-3 w-3 text-[#C99A3D]" /> VIP EXCLUSIVE
                      </span>
                      {p.badgeTag && (
                        <span className="bg-[#C99A3D] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                          {p.badgeTag}
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="bg-[#292321]/80 backdrop-blur-xs text-[#FFF9EF] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-white/10">
                        <Clock className="w-3 h-3 text-[#E58A16]" />
                        {p.duration || 'पूर्ण दिवसीय'}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#FFF9EF]">
                        <MapPin className="w-3.5 h-3.5 text-[#C99A3D] shrink-0" />
                        <span className="line-clamp-1">{p.location || 'सिद्ध शक्तिपीठ, भारत'}</span>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Card Body Content */}
                <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between gap-3 bg-white">
                  <div className="space-y-2">
                    {p.categoryTag && (
                      <div>
                        <span className="text-[10px] font-bold text-[#E58A16] uppercase bg-[#F7EBD7] px-2.5 py-0.5 rounded-md border border-[#E6D6BE]">
                          {p.categoryTag}
                        </span>
                      </div>
                    )}

                    <h3 className="font-bold text-base sm:text-lg text-[#292321] group-hover:text-[#E58A16] transition-colors leading-snug line-clamp-2">
                      <Link href={`/pujas/${p.slug}`}>{p.name}</Link>
                    </h3>

                    <p className="text-xs text-[#4A403C] leading-relaxed line-clamp-2 font-normal">
                      {p.shortDesc}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="py-2.5 border-y border-[#E6D6BE] space-y-1 text-xs text-[#665E58] font-medium">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#E58A16] shrink-0" />
                      <span className="truncate">{p.priestsCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">1-on-1 लाइव वीडियो व अभिमंत्रित प्रसाद</span>
                    </div>
                  </div>

                  {/* Pricing & CTA Button */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E6D6BE]">
                    <div>
                      <span className="text-[10px] text-[#665E58] block uppercase font-bold tracking-wide">न्यूनतम सहयोग:</span>
                      <span className="text-lg sm:text-xl font-black text-[#292321]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      href={`/pujas/${p.slug}`}
                      className="px-4 py-2.5 rounded-xl bg-[#E58A16] hover:bg-[#d4790e] text-white font-extrabold text-xs shadow-xs hover:shadow-md transition-all inline-flex items-center gap-1 shrink-0 active:scale-[0.98]"
                    >
                      <span>अनुष्ठान बुक करें</span>
                      <span>➔</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ── VIP Trust Guarantee Section ── */}
          <div className="mt-14 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-[#292321] via-[#3D302B] to-[#292321] text-white shadow-xl relative overflow-hidden text-center space-y-4 border border-[#C99A3D]/40">
            <div className="max-w-2xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E1917] border border-[#C99A3D]/50 text-[#FFF9EF] text-xs font-bold">
                👑 विशिष्ट सेवा संकल्प
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                क्यों चुनें दिव्ययज्ञम् VIP महा अनुष्ठान?
              </h3>
              <p className="text-xs sm:text-sm text-[#E6D6BE] leading-relaxed font-normal">
                VIP अनुष्ठान केवल आपके और आपके परिवार के लिए विशेष रूप से सिद्ध धामों में संपन्न किए जाते हैं। इसमें 27+ वर्षों के अनुभवी वरिष्ठ आचार्यों द्वारा विशेष नाम-गोत्र संकल्प, अखंड मंत्र जाप एवं 1-on-1 लाइव वीडियो प्रमाण के साथ सेवा दी जाती है।
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href="https://wa.me/919530401984?text=Namaste!%20I%20want%20to%20book%20a%20VIP%20Anushthan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>💬 मुख्य आचार्य से व्हाट्सएप पर बात करें ➔</span>
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}

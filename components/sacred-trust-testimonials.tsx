'use client'

import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Star, ShieldCheck, Tag, Lock, MessageCircle, Heart, Award, CheckCircle2 } from 'lucide-react'

export interface Testimonial {
  name: string
  location?: string | null
  rating: number
  message: string
  pujaName?: string
  avatar?: string | null
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Rajesh Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    message: "काशी विश्वनाथ रुद्राभिषेक का संकल्प वीडियो व्हाट्सएप पर मिला। नाम और गोत्र स्पष्ट रूप से उच्चारित किया गया। 4 दिन में प्रसाद भी घर आ गया। अत्यंत संतोषजनक अनुभव!",
    pujaName: "Kashi Vishwanath Rudrabhishekam"
  },
  {
    name: "Sunita Verma",
    location: "Delhi NCR",
    rating: 5,
    message: "महाकालेश्वर उज्जैन में कालसर्प दोष पूजा करवाई। ऑनलाइन व्यवस्था इतनी पारदर्शी थी कि घर बैठे ही पूरी संतुष्टि मिली। धन्यवाद DivyaYagyam टीम!",
    pujaName: "Mahakaleshwar Ujjain Puja"
  },
  {
    name: "Amit Joshi",
    location: "Bengaluru, Karnataka",
    rating: 5,
    message: "Living abroad in US, it was difficult to arrange authentic Vedic homa in India. DivyaYagyam arranged complete Vidhi with WhatsApp live update. Highly recommended!",
    pujaName: "Navgrah Shanti Yagya"
  }
]

export function SacredTrustTestimonials({ testimonials = defaultTestimonials }: { testimonials?: Testimonial[] }) {
  const displayReviews = testimonials.length > 0 ? testimonials.slice(0, 3) : defaultTestimonials

  return (
    <section className="w-full py-16 md:py-24 bg-[#FFFBF7] text-[#111827]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="kundli-badge-orange inline-flex">
            <Heart className="h-3.5 w-3.5 text-[#FF7A00] fill-[#FF7A00]" /> Devotee Trust & Blessings
          </div>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">
            भरोसा और आशीर्वाद <span className="text-[#FF7A00] font-bold">/ Trust & Blessings</span>
          </h2>
          <p className="text-sm md:text-base text-[#4B5563] font-medium">
            Read authentic experiences from 10,000+ devotee families across India & abroad who booked sacred rituals through DivyaYagyam.
          </p>
        </div>

        {/* 4 Trust Feature Pillars Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {[
            { icon: <ShieldCheck className="h-6 w-6 text-[#FF7A00]" />, title: 'Verified Priests', desc: 'Certified pandits from sacred Dham temples' },
            { icon: <Tag className="h-6 w-6 text-[#FF7A00]" />, title: 'Transparent Pricing', desc: 'All-inclusive pricing with Samagri & Prasad' },
            { icon: <Lock className="h-6 w-6 text-[#FF7A00]" />, title: 'Secure Payments', desc: 'UPI, Cards & Netbanking via Razorpay' },
            { icon: <MessageCircle className="h-6 w-6 text-[#FF7A00]" />, title: 'Live Support', desc: '24/7 dedicated WhatsApp devotee assistance' },
          ].map((f, idx) => (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-[#F3E8DE] shadow-sm flex flex-col items-center text-center space-y-2.5 hover:border-[#FF7A00]/40 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-2xl bg-[#FFF3E0] text-[#FF7A00] flex items-center justify-center font-bold">
                {f.icon}
              </div>
              <h4 className="font-bold text-sm md:text-base text-[#111827]">{f.title}</h4>
              <p className="text-xs text-[#4B5563] leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* 3-Card Testimonials Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayReviews.map((t, i) => (
            <Card key={i} className="border border-[#F3E8DE] rounded-2xl bg-white text-[#111827] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:border-[#FF7A00]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between reveal">
              <CardContent className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-[#FF7A00]">
                      {Array.from({ length: t.rating || 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-[#FF7A00] text-[#FF7A00]" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Verified Devotee
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed italic">
                    "{t.message}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F3E8DE] flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#FFF3E0] text-[#FF7A00] font-heading font-black text-sm flex items-center justify-center border border-orange-200">
                    {t.name ? t.name.charAt(0) : '🙏'}
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-sm text-[#111827]">{t.name}</h5>
                    <p className="text-[11px] text-[#4B5563]">{t.location || 'India'}</p>
                    {t.pujaName && (
                      <span className="inline-block text-[10px] text-[#FF7A00] font-semibold mt-0.5">
                        🪔 {t.pujaName}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section className="w-full py-16 md:py-24 bg-card border-t border-amber-100/60 dark:border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 shadow-xs">
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> Devotee Trust & Blessings
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            भरोसा और आशीर्वाद <span className="text-amber-600 dark:text-amber-400 font-normal">/ Trust & Blessings</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            Read authentic experiences from 10,000+ devotee families across India & abroad who booked sacred rituals through DivyaYagyam.
          </p>
        </div>

        {/* 4 Trust Feature Pillars Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800/80 dark:to-slate-900 rounded-2xl border border-amber-200/60 dark:border-slate-700/60 flex flex-col items-center text-center space-y-2.5 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">Verified Priests</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">Vedic certified pandits from sacred Dham temples</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800/80 dark:to-slate-900 rounded-2xl border border-amber-200/60 dark:border-slate-700/60 flex flex-col items-center text-center space-y-2.5 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Tag className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">Transparent Pricing</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">All-inclusive pricing with Samagri & Prasad</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800/80 dark:to-slate-900 rounded-2xl border border-amber-200/60 dark:border-slate-700/60 flex flex-col items-center text-center space-y-2.5 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Lock className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">Secure Payments</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">UPI, Cards & Netbanking via Razorpay</p>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-slate-800/80 dark:to-slate-900 rounded-2xl border border-amber-200/60 dark:border-slate-700/60 flex flex-col items-center text-center space-y-2.5 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">Live Support</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">24/7 dedicated WhatsApp devotee assistance</p>
          </div>
        </div>

        {/* 3-Card Testimonials Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {displayReviews.map((t, i) => (
            <Card key={i} className="border border-amber-200/70 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <CardContent className="p-6 md:p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: t.rating || 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" /> Verified Devotee
                    </span>
                  </div>

                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{t.message}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 mt-4">
                  <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-extrabold flex items-center justify-center text-sm shadow-xs shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">{t.name}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.location}</p>
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

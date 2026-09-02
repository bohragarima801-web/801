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
    message: "Received the sankalp video of Kashi Vishwanath Rudrabhishek on WhatsApp. Name and gotra were clearly recited. Prasad also arrived home in 4 days. Extremely satisfying experience!",
    pujaName: "Kashi Vishwanath Rudrabhishekam"
  },
  {
    name: "Sunita Verma",
    location: "Delhi NCR",
    rating: 5,
    message: "Had Kalsarp Dosh Puja performed at Mahakaleshwar Ujjain. The online process was so transparent that I felt complete satisfaction right from home. Thank you DivyaYagyam!",
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
    <section className="w-full py-14 md:py-20 bg-white text-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-zinc-200 text-xs font-bold text-amber-600">
            <span>✨</span>
            <span>Devotee Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900">
            Devotees' Trust & Sacred Experiences
          </h2>
          <p className="text-sm text-zinc-500">
            Unwavering trust of 50,000+ devotees across India and abroad in DivyaYagyam
          </p>
        </div>

        {/* 3-Card Testimonials Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((t, i) => (
            <Card key={i} className="border border-zinc-200 rounded-2xl bg-white text-zinc-900 shadow-[0_4px_20px_-2px_rgba(80,50,20,0.04)] hover:border-[#E58A16] hover:shadow-xl transition-all duration-300 flex flex-col justify-between reveal">
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-amber-500">
                      {Array.from({ length: t.rating || 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-[#C99A3D] text-amber-500" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6B2635] bg-amber-50 px-2 py-0.5 rounded-full border border-zinc-200">
                      <CheckCircle2 className="h-3 w-3 text-amber-600" /> Verified Devotee
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed italic">
                    "{t.message}"
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-200 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 font-bold text-sm flex items-center justify-center border border-zinc-200">
                    {t.name ? t.name.charAt(0) : '🙏'}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-zinc-900">{t.name}</h5>
                    <p className="text-[11px] text-zinc-500">{t.location || 'India'}</p>
                    {t.pujaName && (
                      <span className="inline-block text-[10px] text-amber-600 font-semibold mt-0.5">
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

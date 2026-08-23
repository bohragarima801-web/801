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
    message: "महाकालेश्वर उज्जैन में कालसर्प दोष पूजा करवाई। ऑनलाइन व्यवस्था इतनी पारदर्शी थी कि घर बैठे ही पूरी संतुष्टि मिली। धन्यवाद दिव्ययज्ञम् संस्थान!",
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
    <section className="w-full py-14 md:py-20 bg-[#FFF9EF] text-[#292321]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] text-xs font-bold text-[#E58A16]">
            <span>✨</span>
            <span>श्रद्धालुओं के अनुभव</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#292321]">
            भक्तों का विश्वास एवं पावन अनुभव
          </h2>
          <p className="text-sm text-[#665E58]">
            पवित्र सनातन वैदिक परंपरा एवं आचार्यों के सान्निध्य में संपन्न अनुष्ठानों पर श्रद्धालुओं का अटूट भरोसा
          </p>
        </div>

        {/* 3-Card Testimonials Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((t, i) => (
            <Card key={i} className="border border-[#E6D6BE] rounded-2xl bg-white text-[#292321] shadow-[0_4px_20px_-2px_rgba(80,50,20,0.04)] hover:border-[#E58A16] hover:shadow-xl transition-all duration-300 flex flex-col justify-between reveal">
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-[#C99A3D]">
                      {Array.from({ length: t.rating || 5 }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-[#C99A3D] text-[#C99A3D]" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6B2635] bg-[#F7EBD7] px-2 py-0.5 rounded-full border border-[#E6D6BE]">
                      <CheckCircle2 className="h-3 w-3 text-[#E58A16]" /> सत्यापित यजमान
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#665E58] leading-relaxed italic">
                    "{t.message}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6D6BE] flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#F7EBD7] text-[#E58A16] font-bold text-sm flex items-center justify-center border border-[#E6D6BE]">
                    {t.name ? t.name.charAt(0) : '🙏'}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-[#292321]">{t.name}</h5>
                    <p className="text-[11px] text-[#665E58]">{t.location || 'India'}</p>
                    {t.pujaName && (
                      <span className="inline-block text-[10px] text-[#E58A16] font-semibold mt-0.5">
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

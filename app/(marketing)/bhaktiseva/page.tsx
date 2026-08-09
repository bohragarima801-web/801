'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Video, Heart, Flame, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { getAutoSeoAlt } from '@/lib/seo-auto'

function getEmbedUrl(url: string) {
  if (!url) return ''
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }
  return url
}

const defaultOfferings = [
  {
    id: 'bs-1',
    name: 'काशी विश्वनाथ अन्नपूर्णा महाप्रसाद भोग सेवा',
    price: 1100,
    description: 'काशी विश्वनाथ मंदिर प्रांगण में साधु-संतों एवं भक्तों हेतु शुद्ध अन्नपूर्णा महाप्रसाद भोग अर्पण सेवा।',
    image: '/katyayani_yagya_hero.webp'
  },
  {
    id: 'bs-2',
    name: 'गौ सेवा एवं हरा चारा अर्पण (Kamdhenu Gau Seva)',
    price: 751,
    description: 'पवित्र गोशाला में नंदी एवं गोमाता हेतु शुद्ध हरा चारा, गुड़ एवं गुड़-चना सेवा आपके नाम से।',
    image: '/gau_seva.jpg'
  },
  {
    id: 'bs-3',
    name: 'गंगा आरती 108 दीप दान सेवा (Har Ki Pauri / Kashi)',
    price: 501,
    description: 'गंगा मैया के पावन तट पर आपके परिवार की सुख-समृद्धि एवं शांति हेतु 108 संकल्पित दीप दान।',
    image: '/deep_daan.jpg'
  },
  {
    id: 'bs-4',
    name: 'माँ बगलामुखी वस्त्र व पुष्प शृंगार सेवा',
    price: 2100,
    description: 'माता बगलामुखी शक्तिपीठ पर पीताम्बरी वस्त्र, पुष्पमाला एवं विशेष शृंगार सामग्री अर्पण।',
    image: '/bagalamukhi_kavach_yagya.webp'
  }
]

export default function Page() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [offerings, setOfferings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bhaktiseva')
      .then((r) => r.json())
      .then((j) => {
        const items = j.offerings || j.data || []
        setOfferings(items.length > 0 ? items : defaultOfferings)
      })
      .catch(() => {
        setOfferings(defaultOfferings)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-[#0c1017] text-[#f3f4f6] min-h-screen py-10 md:py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-10">
        
        {/* ── Page Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-[#d4af37]/20 text-[#fbbf24] border border-[#d4af37]/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            🌼 Sacred Devotional Offerings
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            दिव्य <span className="bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">भक्ति सेवा एवं दान</span>
          </h1>

          <p className="text-sm sm:text-base text-[#9ca3af] leading-relaxed font-medium">
            भारत के प्रमुख दिव्य धामों (काशी, उज्जैन, हरिद्वार, जोधपुर) में साधु-संतों, गोमाता एवं तीर्थ यात्रियों हेतु आपके एवं आपके परिवार के नाम से पवित्र अन्नदान, दीपदान व पुष्प सेवा।
          </p>
        </div>

        {/* ── Content Area */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-[#fbbf24]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
            {offerings.map((offering) => {
              const displayPrice = Number(offering.price || 501)
              const imgSrc = offering.image || '/katyayani_yagya_hero.webp'

              return (
                <div
                  key={offering.id}
                  className="bg-[#141b26] border border-[#d4af37]/20 hover:border-[#d4af37] rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_25px_rgba(212,175,55,0.18)] group"
                >
                  <div>
                    {/* Clean Frame (Image fix: object-cover & h-[180px]) */}
                    <div className="relative w-full h-[180px] rounded-xl overflow-hidden bg-[#1f293d] mb-4 border border-[#d4af37]/20 shadow-md">
                      <Image
                        src={imgSrc}
                        alt={getAutoSeoAlt(offering.name, 'bhaktiseva')}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      />

                      {offering.videoUrl && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md z-10">
                          <Video className="h-3 w-3" /> Live Video
                        </span>
                      )}
                    </div>

                    {/* Card Title & Pricing */}
                    <div className="space-y-1.5 mb-3">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#fbbf24] transition-colors leading-snug line-clamp-2">
                        {offering.name}
                      </h3>
                      <div className="text-xl font-heading font-black text-[#fbbf24]">
                        ₹{displayPrice.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#9ca3af] line-clamp-3 leading-relaxed mb-4 font-medium">
                      {offering.description || 'भारत के पावन धाम पर आपके नाम से संपन्न होने वाली पवित्र भक्ति सेवा।'}
                    </p>

                    {/* Embedded Video if present */}
                    {offering.isVideoEnabled && offering.videoUrl && (
                      <div className="aspect-video w-full rounded-xl overflow-hidden mb-4 border border-[#d4af37]/30 bg-black shadow-md">
                        <iframe
                          src={getEmbedUrl(offering.videoUrl)}
                          className="h-full w-full"
                          allowFullScreen
                          title={offering.name}
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Button (Preserves routing & addToCart logic) */}
                  <div className="pt-3 border-t border-[#d4af37]/15">
                    <button
                      type="button"
                      className="w-full text-center bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
                      onClick={() => {
                        const itemId = `addon-bhaktiSeva-${offering.id}`
                        addToCart({
                          id: itemId,
                          name: `BhaktiSeva: ${offering.name}`,
                          price: displayPrice,
                          image: imgSrc
                        })
                        toast.success(`Added ${offering.name} to cart!`)
                        router.push('/checkout')
                      }}
                    >
                      <span>Offer Seva Now (₹{displayPrice.toLocaleString('en-IN')})</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

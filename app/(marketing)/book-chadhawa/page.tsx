'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Sparkles, Heart, ShieldCheck, CheckCircle2, ArrowRight, Video, 
  MapPin, Clock, Award, Flame, Star, Gift, Check 
} from 'lucide-react'
import { toast } from 'sonner'

const temples = [
  {
    id: 'kashi',
    name: 'काशी विश्वनाथ ज्योतिर्लिंग धाम',
    city: 'वाराणसी (उत्तर प्रदेश)',
    image: '/temple_kashi.jpg',
    deity: 'भगवान शिव (महादेव)'
  },
  {
    id: 'mahakal',
    name: 'श्री महाकालेश्वर ज्योतिर्लिंग',
    city: 'उज्जैन (मध्य प्रदेश)',
    image: '/temple_ujjain.jpg',
    deity: 'महाकाल ज्योतिर्लिंग'
  },
  {
    id: 'katyayani',
    name: 'माँ कात्यायनी शक्ति पीठ धाम',
    city: 'जोधपुर (राजस्थान)',
    image: '/katyayani_yagya_hero.webp',
    deity: 'माँ कात्यायनी दुर्गा'
  },
  {
    id: 'bagalamukhi',
    name: 'माँ बगलामुखी सिद्ध शक्तिपीठ',
    city: 'दतिया / नलखेड़ा',
    image: '/bagalamukhi_mirchi_hawan_2.jpg',
    deity: 'माँ पीताम्बरी बगलामुखी'
  }
]

const chadhawaOfferings = [
  {
    id: 'ch-mala',
    title: 'पवित्र पुष्पमाला व अक्षत अर्पण',
    price: 101,
    desc: 'भगवान के पावन विग्रह पर ताजी पुष्पमाला, बेलपत्र/तुलसी एवं अक्षत का अर्पण।',
    icon: '🌸',
    popular: false,
  },
  {
    id: 'ch-nariyal',
    title: 'श्रीफल नारियल, सिंदूर व कलावा अर्पण',
    price: 251,
    desc: 'मनोकामना सिद्धि हेतु पावन श्रीफल नारियल, रक्षासूत्र एवं सिंदूर तिलक अर्पण।',
    icon: '🥥',
    popular: true,
  },
  {
    id: 'ch-panchamrit',
    title: 'पंचामृत अभिषेक एवं भोग अर्पण',
    price: 501,
    desc: 'शुद्ध दुग्ध, दधि, घृत, मधु व शर्करा से पावन पंचामृत अभिषेक एवं मिष्ठान भोग।',
    icon: '🍯',
    popular: false,
  },
  {
    id: 'ch-thali',
    title: 'विशेष महा आरती एवं दिव्य पूजा थाली',
    price: 1100,
    desc: 'संपूर्ण पावन थाली: वस्त्र, धूप, दीप, नैवेद्य, फल, दक्षिणा एवं आरती में आपके नाम का संकल्प।',
    icon: '🪔',
    popular: false,
  }
]

export default function BookChadhawaPage() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [selectedTemple, setSelectedTemple] = useState(temples[0].id)
  const [selectedOffering, setSelectedOffering] = useState(chadhawaOfferings[1].id)
  const [devoteeName, setDevoteeName] = useState('')
  const [devoteePhone, setDevoteePhone] = useState('')
  const [gotra, setGotra] = useState('Kashyap')

  const currentTemple = temples.find(t => t.id === selectedTemple) || temples[0]
  const currentOffering = chadhawaOfferings.find(o => o.id === selectedOffering) || chadhawaOfferings[1]

  const handleProceedToChadhawa = (e: React.FormEvent) => {
    e.preventDefault()
    if (!devoteeName.trim()) {
      toast.error('कृपया अपना नाम दर्ज करें।')
      return
    }
    if (!devoteePhone.trim() || devoteePhone.trim().replace(/\D/g, '').length < 10) {
      toast.error('कृपया 10 अंकों का वैध व्हाट्सएप नंबर दर्ज करें।')
      return
    }

    const sankalpData = {
      devoteeName: devoteeName.trim(),
      whatsappPhone: devoteePhone.trim(),
      gotra: gotra.trim() || 'Kashyap',
      purpose: `चढ़ावा सेवा: ${currentOffering.title} at ${currentTemple.name}`,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('dy_sankalp', JSON.stringify(sankalpData))
    }

    const itemId = `addon-chadhawa-${selectedOffering}-${selectedTemple}`
    addToCart({
      id: itemId,
      name: `🪔 चढ़ावा: ${currentOffering.title} (${currentTemple.name})`,
      price: currentOffering.price,
      image: currentTemple.image,
    })

    toast.success('चढ़ावा संकल्प दर्ज हो गया! बिलिंग पेज पर भेजा जा रहा है...')
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-[#FFF9EF] text-[#292321] py-10 md:py-16 notranslate" translate="no">
      <div className="container max-w-5xl mx-auto px-4 space-y-10">

        {/* ── Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7EBD7] border border-[#E6D6BE] shadow-2xs">
            <span className="text-[#C99A3D]">ॐ</span>
            <span className="text-[#E58A16] text-xs font-bold uppercase tracking-wider">
              पावन धाम चढ़ावा सेवा
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight">
            घर बैठे चढ़ाएं <span className="text-[#E58A16]">अपने आराध्य को चढ़ावा</span>
          </h1>

          <p className="text-xs sm:text-base text-[#665E58] font-medium leading-relaxed max-w-2xl mx-auto">
            काशी विश्वनाथ, महाकालेश्वर, माँ कात्यायनी शक्तिपीठ आदि पावन धामों में अपने नाम और गोत्र से पवित्र पुष्पमाला, नारियल, पंचामृत एवं भोग अर्पण कराएं। व्हाट्सएप पर लाइव वीडियो प्रमाण।
          </p>
        </div>

        {/* ── 4 Key Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "🕉️", title: "नाम-गोत्र संकल्प", desc: "प्रत्यक्ष अर्पण" },
            { icon: "📹", title: "व्हाट्सएप वीडियो", desc: "लाइव दर्शन प्रमाण" },
            { icon: "🏛️", title: "सिद्ध शक्तिपीठ", desc: "काशी, उज्जैन, जोधपुर" },
            { icon: "🔒", title: "100% सुरक्षित", desc: "Razorpay गेटवे" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-3.5 rounded-2xl border border-[#E6D6BE] text-center space-y-1 shadow-2xs">
              <span className="text-2xl">{item.icon}</span>
              <h4 className="text-xs font-bold text-[#292321]">{item.title}</h4>
              <p className="text-[10px] text-[#665E58]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Main Interactive Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Temple & Offering Selection */}
          <div className="lg:col-span-7 space-y-8">

            {/* Step 1: Select Temple */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-[#6B2635] text-white text-xs font-bold flex items-center justify-center">1</span>
                <h3 className="font-bold text-base text-[#292321]">पवित्र मंदिर / शक्तिपीठ चुनें</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {temples.map((temple) => {
                  const isSelected = selectedTemple === temple.id
                  return (
                    <div
                      key={temple.id}
                      onClick={() => setSelectedTemple(temple.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center gap-3.5 ${
                        isSelected
                          ? 'border-[#E58A16] bg-[#F7EBD7]/60 shadow-md ring-1 ring-[#E58A16]'
                          : 'border-[#E6D6BE] bg-white hover:border-[#E58A16]/50'
                      }`}
                    >
                      <div className="h-14 w-14 rounded-xl overflow-hidden bg-[#F7EBD7] shrink-0 border border-[#E6D6BE]">
                        <img src={temple.image} alt={temple.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h4 className="text-xs font-bold text-[#292321] truncate">{temple.name}</h4>
                        <p className="text-[11px] text-[#665E58] truncate">📍 {temple.city}</p>
                        <p className="text-[10px] text-[#E58A16] font-semibold">{temple.deity}</p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                        isSelected ? 'bg-[#E58A16] border-[#E58A16] text-white font-bold' : 'border-slate-300'
                      }`}>
                        {isSelected ? '✓' : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step 2: Select Chadhawa Offering */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-[#6B2635] text-white text-xs font-bold flex items-center justify-center">2</span>
                <h3 className="font-bold text-base text-[#292321]">चढ़ावे का प्रकार चुनें</h3>
              </div>

              <div className="space-y-3">
                {chadhawaOfferings.map((offering) => {
                  const isSelected = selectedOffering === offering.id
                  return (
                    <div
                      key={offering.id}
                      onClick={() => setSelectedOffering(offering.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-[#E58A16] bg-[#F7EBD7]/60 shadow-md ring-1 ring-[#E58A16]'
                          : 'border-[#E6D6BE] bg-white hover:border-[#E58A16]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-xl bg-[#F7EBD7] border border-[#E6D6BE] flex items-center justify-center text-2xl shrink-0">
                          {offering.icon}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#292321]">{offering.title}</h4>
                            {offering.popular && (
                              <Badge className="bg-[#6B2635] text-white text-[9px] px-2 py-0.2">
                                सर्वाधिक लोकप्रिय
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[#665E58] line-clamp-1">{offering.desc}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-[#E58A16]">₹{offering.price}</span>
                        <div className={`mt-1 h-5 w-5 ml-auto rounded-full border flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-[#E58A16] border-[#E58A16] text-white font-bold' : 'border-slate-300'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Devotee Details & Checkout Form */}
          <div className="lg:col-span-5">
            <Card className="border border-[#E6D6BE] rounded-3xl bg-white shadow-lg sticky top-20 overflow-hidden">
              <div className="bg-[#6B2635] text-white p-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C99A3D]">🌸 संकल्प पत्र</span>
                  <span className="text-xs text-white/80">चरण 3</span>
                </div>
                <h3 className="text-lg font-black text-white">यजमान विवरण भरें</h3>
              </div>

              <CardContent className="p-6 space-y-5">
                {/* Summary Box */}
                <div className="p-3.5 bg-[#F7EBD7]/60 rounded-2xl border border-[#E6D6BE] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#665E58]">चयनित मंदिर:</span>
                    <span className="font-bold text-[#292321]">{currentTemple.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#665E58]">चढ़ावा सेवा:</span>
                    <span className="font-bold text-[#292321]">{currentOffering.title}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[#E6D6BE] font-bold text-sm">
                    <span className="text-[#292321]">कुल दक्षिणा:</span>
                    <span className="text-[#E58A16] font-black text-base">₹{currentOffering.price}</span>
                  </div>
                </div>

                <form onSubmit={handleProceedToChadhawa} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#292321]">आपका पूरा नाम (Devotee Full Name) *</Label>
                    <Input
                      placeholder="उदा. रमेश बोहरा"
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      required
                      className="h-10 border-[#E6D6BE]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-[#292321]">WhatsApp मोबाइल नंबर *</Label>
                      <span className="text-[10px] text-emerald-700 font-semibold">✓ वीडियो प्रमाण हेतु</span>
                    </div>
                    <Input
                      placeholder="उदा. 9530401984"
                      type="tel"
                      value={devoteePhone}
                      onChange={(e) => setDevoteePhone(e.target.value)}
                      required
                      className="h-10 border-[#E6D6BE]"
                    />
                    <p className="text-[10px] text-[#665E58]">चढ़ावे का संकल्प वीडियो इसी नंबर पर व्हाट्सएप किया जाएगा।</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#292321]">गोत्र (Gotra) *</Label>
                    <Input
                      placeholder="Kashyap"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      className="h-10 border-[#E6D6BE]"
                    />
                    <p className="text-[10px] text-[#665E58]">यदि गोत्र ज्ञात न हो तो 'Kashyap' रहने दें।</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-sm font-black bg-[#E58A16] hover:bg-[#d4790e] text-white rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <span>चढ़ावा संकल्प पूरा करें (₹{currentOffering.price})</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>

                <div className="flex items-center justify-center gap-1 text-[11px] text-[#665E58] pt-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% सुरक्षित भुगतान • Razorpay अधिकृत</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  )
}

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
  },
  {
    id: 'ch-gauseva',
    title: 'गौ-सेवा तृण एवं पावन अन्नक्षेत्र भोग',
    price: 2100,
    desc: 'आश्रम की पावन गौशाला में गौ-माता को हरा चारा, गुड़-रोटी एवं साधु-संतों को अन्नदान भोग।',
    icon: '🐄',
    popular: false,
  }
]

export default function BookChadhawaPage() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [selectedOffering, setSelectedOffering] = useState(chadhawaOfferings[1].id)
  const [devoteeName, setDevoteeName] = useState('')
  const [devoteePhone, setDevoteePhone] = useState('')
  const [gotra, setGotra] = useState('Kashyap')

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
      purpose: `चढ़ावा सेवा: ${currentOffering.title} (श्री दिव्ययज्ञम् पावन सिद्ध पीठ)`,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('dy_sankalp', JSON.stringify(sankalpData))
    }

    const itemId = `addon-chadhawa-${selectedOffering}`
    addToCart({
      id: itemId,
      name: `🪔 चढ़ावा: ${currentOffering.title}`,
      price: currentOffering.price,
      image: '/katyayani_yagya_hero.webp',
    })

    toast.success('चढ़ावा संकल्प दर्ज हो गया! बिलिंग पेज पर भेजा जा रहा है...')
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1614] py-10 md:py-16 notranslate" translate="no">
      <div className="container max-w-5xl mx-auto px-4 space-y-10">

        {/* ── Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF3E8] border border-[#EFE4D6] shadow-2xs">
            <span className="text-[#D4AF37]">ॐ</span>
            <span className="text-[#FF6600] text-xs font-bold uppercase tracking-wider">
              पावन सिद्ध पीठ चढ़ावा सेवा
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1C1614] leading-tight">
            घर बैठे चढ़ाएं <span className="text-[#FF6600]">अपने आराध्य को पावन चढ़ावा</span>
          </h1>

          <p className="text-xs sm:text-base text-[#6B5E57] font-medium leading-relaxed max-w-2xl mx-auto">
            श्री दिव्ययज्ञम् पावन सिद्ध पीठ में पंडित मुकेश बोहरा जी के सान्निध्य में अपने नाम और गोत्र से पवित्र पुष्पमाला, नारियल, पंचामृत एवं भोग अर्पण कराएं। संकल्प के बाद व्हाट्सएप पर लाइव वीडियो प्रमाण प्राप्त करें।
          </p>
        </div>

        {/* ── 4 Key Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "🕉️", title: "नाम-गोत्र संकल्प", desc: "शास्त्रोक्त विधि से अर्पण" },
            { icon: "📹", title: "व्हाट्सएप वीडियो", desc: "लाइव दर्शन प्रमाण" },
            { icon: "🏛️", title: "पावन सिद्ध पीठ", desc: "प्रत्यक्ष आश्रम सेवा" },
            { icon: "🔒", title: "100% सुरक्षित", desc: "Razorpay गेटवे" },
          ].map((item, i) => (
            <div key={i} className="bg-white p-3.5 rounded-2xl border border-[#EFE4D6] text-center space-y-1 shadow-2xs">
              <span className="text-2xl">{item.icon}</span>
              <h4 className="text-xs font-bold text-[#1C1614]">{item.title}</h4>
              <p className="text-[10px] text-[#6B5E57]">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Main Interactive Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Local Ashram Details & Offering Selection */}
          <div className="lg:col-span-7 space-y-6">

            {/* Sacred Local Ashram Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EFE4D6] shadow-sm flex flex-col sm:flex-row items-center gap-4">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-[#FFF3E8] shrink-0 border-2 border-[#D4AF37]/40 shadow-xs">
                <img 
                  src="/katyayani_yagya_hero.webp" 
                  alt="श्री दिव्ययज्ञम् पावन सिद्ध पीठ" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF3E8] border border-[#FFD2B0] text-[11px] font-bold text-[#FF6600]">
                  <span>📍</span>
                  <span>पावन सिद्ध पीठ संस्थान (जोधपुर)</span>
                </div>
                <h3 className="text-base font-extrabold text-[#1C1614]">
                  श्री दिव्ययज्ञम् सिद्ध पीठ एवं यज्ञशाला
                </h3>
                <p className="text-xs text-[#6B5E57] leading-relaxed">
                  27+ वर्षों से प्रतिष्ठित वैदिक आश्रम — आपके नाम, गोत्र व मनोकामना के साथ विधिपूर्वक सामग्री अर्पण की जाती है।
                </p>
              </div>
            </div>

            {/* Choose Chadhawa Offering */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-[#7A1521] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="font-bold text-base text-[#1C1614]">चढ़ावे का प्रकार चुनें</h3>
                </div>
                <span className="text-xs text-[#6B5E57] font-medium">कोई एक चुनें</span>
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
                          ? 'border-[#FF6600] bg-[#FFF3E8]/70 shadow-md ring-2 ring-[#FF6600]'
                          : 'border-[#EFE4D6] bg-white hover:border-[#FF6600]/50 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-[#FFF3E8] border border-[#FFD2B0] flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                          {offering.icon}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-[#1C1614]">{offering.title}</h4>
                            {offering.popular && (
                              <Badge className="bg-[#7A1521] text-white text-[9px] px-2 py-0.5">
                                सर्वाधिक लोकप्रिय
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-[#6B5E57] leading-tight line-clamp-2">{offering.desc}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-[#FF6600]">₹{offering.price}</span>
                        <div className={`mt-1 h-5 w-5 ml-auto rounded-full border flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-[#FF6600] border-[#FF6600] text-white font-bold' : 'border-slate-300'
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
            <Card className="border border-[#EFE4D6] rounded-3xl bg-white shadow-lg sticky top-20 overflow-hidden">
              <div className="bg-[#7A1521] text-white p-5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">🌸 संकल्प पत्र</span>
                  <span className="text-xs text-white/80">चरण 2</span>
                </div>
                <h3 className="text-lg font-black text-white">यजमान विवरण भरें</h3>
              </div>

              <CardContent className="p-6 space-y-5">
                {/* Summary Box */}
                <div className="p-3.5 bg-[#FFF3E8]/60 rounded-2xl border border-[#EFE4D6] space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#6B5E57]">पावन स्थान:</span>
                    <span className="font-bold text-[#1C1614]">श्री दिव्ययज्ञम् सिद्ध पीठ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B5E57]">चढ़ावा सेवा:</span>
                    <span className="font-bold text-[#1C1614]">{currentOffering.title}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 border-t border-[#EFE4D6] font-bold text-sm">
                    <span className="text-[#1C1614]">कुल दक्षिणा:</span>
                    <span className="text-[#FF6600] font-black text-base">₹{currentOffering.price}</span>
                  </div>
                </div>

                <form onSubmit={handleProceedToChadhawa} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1614]">आपका पूरा नाम (Devotee Full Name) *</Label>
                    <Input
                      placeholder="उदा. रमेश बोहरा"
                      value={devoteeName}
                      onChange={(e) => setDevoteeName(e.target.value)}
                      required
                      className="h-10 border-[#EFE4D6]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-[#1C1614]">WhatsApp मोबाइल नंबर *</Label>
                      <span className="text-[10px] text-emerald-700 font-semibold">✓ वीडियो प्रमाण हेतु</span>
                    </div>
                    <Input
                      placeholder="उदा. 9530401984"
                      type="tel"
                      value={devoteePhone}
                      onChange={(e) => setDevoteePhone(e.target.value)}
                      required
                      className="h-10 border-[#EFE4D6]"
                    />
                    <p className="text-[10px] text-[#6B5E57]">चढ़ावे का संकल्प वीडियो इसी नंबर पर व्हाट्सएप किया जाएगा।</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#1C1614]">गोत्र (Gotra) *</Label>
                    <Input
                      placeholder="Kashyap"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      className="h-10 border-[#EFE4D6]"
                    />
                    <p className="text-[10px] text-[#6B5E57]">यदि गोत्र ज्ञात न हो तो 'Kashyap' रहने दें।</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 text-sm font-black bg-gradient-to-r from-[#FF6600] to-[#FF8500] hover:from-[#E65C00] hover:to-[#FF7700] text-white rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    <span>चढ़ावा संकल्प पूरा करें (₹{currentOffering.price})</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>

                <div className="flex items-center justify-center gap-1 text-[11px] text-[#6B5E57] pt-2">
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

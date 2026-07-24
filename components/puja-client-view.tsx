'use client'

import { useState } from 'react'
import Image from 'next/image';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Calendar, CheckCircle2, Video, Gift, Sparkles, ShieldCheck, HelpCircle, Star, ChevronRight, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { FadeIn } from '@/components/ui/fade-in'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export function PujaClientView({ puja }: { puja: any }) {
  const router = useRouter()
  const { addToCart } = useCart()
  const mockPackages = [
    { id: '1', name: '1 Member (1 सदस्य)', price: puja?.price || 0, desc: 'Pandit ji sankalp me aapka naam/gotra bolenge. Puja video WhatsApp/Email par milegi. Sacred Prasad ghar bheja jayega.' },
    { id: '2', name: '2 Members', price: Number(puja?.price || 0) * 1.5, desc: 'Up to 2 members naam/gotra sankalp. Puja video with name-gotra. Sacred Prasad home delivery.' },
    { id: '3', name: 'Family VIP', price: Number(puja?.price || 0) * 2.5, desc: 'Up to 4 Names & Gotras. Prasad delivery + Live Zoom joining.' }
  ]

  let packages = puja?.packages?.length ? [...puja.packages] : mockPackages
  if (puja?.packages?.length) {
    const hasOneMember = packages.some(p => p.name.includes('1') || p.name.toLowerCase().includes('one'))
    if (!hasOneMember) {
      packages.unshift({ ...mockPackages[0], id: 'base-1-member' })
    }
  }

  const [selectedPackage, setSelectedPackage] = useState<string>(packages[0]?.id || '1')
  
  if (!puja) return <div className="py-20 text-center">Puja Not Found</div>

  const fallbackImage = process.env.NEXT_PUBLIC_URL_4684 || ''
  const activeImage = puja?.coverImage || fallbackImage

  const handleBookNow = (overridePkgId?: string) => {
    const pkgId = overridePkgId || selectedPackage
    const pkg = packages.find((p: any) => p.id === pkgId)
    if (pkg) {
      addToCart({
        id: `puja-${puja.id}-${pkg.id}`,
        name: `${puja.name} - ${pkg.name}`,
        price: Number(pkg.price),
        image: activeImage
      })
      setTimeout(() => router.push('/checkout'), 50)
    }
  }

  const handleScrollToPackages = () => {
    const pkgSection = document.getElementById('package-section')
    if (pkgSection) {
      pkgSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="relative bg-[#fcfcfc] pb-24">
      {/* 1. Hero Section (Image + Title Overlay) */}
      <section className="relative w-full py-20 sm:py-28 lg:py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-slate-900">
        {/* Background Image with Overlay - Fixed Crop & Aspect Ratio */}
        <div className="absolute inset-0 z-0">
          <img src={activeImage} alt={puja.name} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        {/* Hero Content - Improved Typography & Spacing */}
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center mt-4">
          <Badge className="bg-[#ffb300] hover:bg-[#ffb300] text-black font-bold px-5 py-2 rounded-full mb-6 border-none shadow-lg text-sm sm:text-base tracking-wide uppercase">
            ⭐ {puja.isVip ? 'VIP Puja Special' : 'Special Puja'}
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FDB813]">
            {puja.name}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium max-w-3xl drop-shadow-md px-4 line-clamp-3 leading-relaxed">
            {puja.shortDescription || 'Protection from Negative Energies & Obstacles'}
          </p>
        </div>
      </section>

      {/* 2. Key Details Strip */}
      <section className="bg-white border shadow-md relative z-20 -mt-10 mx-4 sm:mx-8 lg:mx-auto max-w-4xl rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-around sm:gap-8 gap-5">
        <div className="flex items-center gap-4 text-slate-800 font-bold w-full sm:w-auto">
          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
            <MapPin className="h-6 w-6" />
          </div>
          <span className="text-base sm:text-lg text-left leading-tight">{puja.location || 'Any Holy Temple'}</span>
        </div>
        <div className="hidden sm:block w-px bg-slate-200"></div>
        <div className="block sm:hidden h-px w-full bg-slate-100"></div>
        <div className="flex items-center gap-4 text-slate-800 font-bold w-full sm:w-auto">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
            <Calendar className="h-6 w-6" />
          </div>
          <span className="text-base sm:text-lg text-left leading-tight">{puja.publishedAt ? new Date(puja.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Instant Booking Available'}</span>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-20">
        
        {/* About & Benefits */}
        <section className="space-y-6 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 text-center">Why Perform {puja.name}?</h2>
          <div className="w-24 h-1.5 bg-[var(--primary-color)] mx-auto rounded-full"></div>
          <div 
            className="prose prose-lg prose-slate mx-auto text-slate-600 leading-relaxed mt-6 whitespace-pre-wrap text-left md:text-justify" 
            dangerouslySetInnerHTML={{ __html: puja.longDescription || puja.description || puja.shortDescription || 'Participate in this sacred puja for peace, health, and spiritual growth.' }} 
          />
        </section>

        {/* 3. Package Selection Grid */}
        <section id="package-section" className="space-y-10 scroll-mt-24">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Select Puja Members</h2>
            <p className="text-lg text-slate-500 mt-3">Choose a package that fits your family needs</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg: any) => (
              <div 
                key={pkg.id} 
                onClick={() => setSelectedPackage(pkg.id)}
                className={cn(
                  "border-2 rounded-2xl p-6 sm:p-8 bg-white transition-all cursor-pointer flex flex-col relative group",
                  selectedPackage === pkg.id 
                    ? "border-[var(--primary-color)] shadow-2xl scale-[1.02]" 
                    : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
                )}
              >
                {selectedPackage === pkg.id && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--primary-color)] text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <CheckCircle2 className="h-4 w-4" /> SELECTED
                  </div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 text-center">{pkg.name}</h3>
                <div className="text-4xl font-black text-[#b45309] text-center my-6">₹{pkg.price.toLocaleString()}</div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {pkg.desc ? pkg.desc.split('. ').map((feat: string, i: number) => feat.trim() && (
                    <li key={i} className="flex gap-3 items-start text-base text-slate-700 font-medium">
                      <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 text-orange-600 font-black text-[10px]">ॐ</div>
                      <span className="leading-tight pt-0.5">{feat}</span>
                    </li>
                  )) : (
                    <li className="flex gap-3 items-start text-base text-slate-700 font-medium">
                      <Sparkles className="h-5 w-5 text-[var(--primary-color)] shrink-0" />
                      Standard benefits included
                    </li>
                  )}
                </ul>

                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPackage(pkg.id);
                    handleBookNow(pkg.id);
                  }}
                  className={cn(
                    "w-full font-bold h-14 text-lg rounded-xl shadow-md transition-all",
                    selectedPackage === pkg.id 
                      ? "bg-[var(--secondary-color)] hover:bg-green-700 text-white" 
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900 group-hover:bg-slate-200"
                  )}
                >
                  Book Puja For {pkg.name}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Step-by-Step Puja Process Workflow */}
        <section className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[2rem] p-8 sm:p-16 border border-orange-100 shadow-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">How It Works</h2>
            <p className="text-lg text-slate-500 mt-3">Simple 5-step process for a divine experience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-1 bg-orange-200 z-0 rounded-full"></div>
            
            {[
              { icon: User, title: 'Select Package' },
              { icon: ShieldCheck, title: 'Name & Gotra' },
              { icon: Gift, title: 'Secure Payment' },
              { icon: Video, title: 'WhatsApp Video' },
              { icon: MapPin, title: 'Prasad Delivery' }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-[var(--primary-color)] flex items-center justify-center shadow-lg">
                  <step.icon className="h-7 w-7 text-[var(--primary-color)]" />
                </div>
                <h4 className="font-bold text-base text-slate-800 px-2">{step.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Trust Signals & Media Integration */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border bg-white rounded-xl px-6 shadow-sm">
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-5">How will the Puja be performed?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-base pb-5">
                  The puja will be performed by expert pandits following strict Vedic rituals. Your name and gotra will be chanted during the sankalp.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border bg-white rounded-xl px-6 shadow-sm">
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-5">Will I get a video recording?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-base pb-5">
                  Yes, a personalized video snippet showing your name-gotra sankalp will be shared with you via WhatsApp/Email within 24-48 hours.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border bg-white rounded-xl px-6 shadow-sm">
                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline py-5">Is Prasad delivery included?</AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed text-base pb-5">
                  Yes, dry prasad (bhasma, rudraksha, or sweets) will be couriered to your address provided during checkout.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border shadow-xl shadow-slate-200/50 space-y-8">
            <div className="flex items-center gap-4 pb-6 border-b">
              <ShieldCheck className="h-14 w-14 text-green-600" />
              <div>
                <h3 className="font-black text-slate-900 text-2xl">100% Secure</h3>
                <p className="text-base text-slate-500 font-medium">Safe & Encrypted Payments</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="h-6 w-6 text-yellow-500 fill-current" />)}
              </div>
              <p className="text-slate-700 italic text-lg leading-relaxed">"The whole experience was divine. I felt connected despite being thousands of miles away. The video was clear and sankalp was exactly as requested."</p>
              <p className="text-base font-bold mt-4 text-slate-900">- Rajesh S., Mumbai</p>
            </div>
          </div>
        </section>

      </div>

      {/* 6. Dynamic Sticky Bottom Bar (Mobile/Desktop) */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-md border-t shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-lg font-black text-slate-900 truncate max-w-md">{puja.name}</p>
            <p className="text-sm text-slate-500 font-medium">
              {selectedPackage ? `Package selected. You can proceed to checkout.` : `Select a package to continue booking`}
            </p>
          </div>
          <Button 
            onClick={() => handleBookNow()}
            className="w-full sm:w-auto sm:min-w-[300px] bg-[var(--secondary-color)] hover:bg-green-700 text-white font-black h-14 text-lg rounded-xl shadow-lg shadow-green-600/20"
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  )
}


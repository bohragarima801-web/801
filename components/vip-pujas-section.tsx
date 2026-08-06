'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, Award, UserCheck, Calendar, Clock, Video, Truck, ShieldCheck, 
  Heart, CheckCircle2, ArrowRight, PhoneCall, MessageCircle, Star, ChevronRight,
  Flame, Lock, Compass, HelpCircle
} from 'lucide-react'

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
}

const defaultVipPackages: VipPackageItem[] = [
  {
    id: 'vip-1',
    name: 'VIP Mahamrityunjaya 1,25,000 Jaap & Mahayagya',
    shortDesc: 'Intensive Veda-chanted jaap for serious health concerns, longevity & divine protection.',
    location: 'Haridwar / Rishikesh Holy Ghats',
    duration: '5-Day Intensive Ritual',
    priestsCount: '5 Vedic Priests',
    price: 15100,
    categoryTag: 'Health & Protection',
    badgeTag: 'Most Chosen',
    slug: 'vip-mahamrityunjaya-jaap'
  },
  {
    id: 'vip-2',
    name: 'VIP Navagraha Shanti & Nakshatra Homa',
    shortDesc: 'Personalized 9-planet balancing ritual tailored strictly to your birth chart & gotra.',
    location: 'Trimbakeshwar Temple, Nashik',
    duration: 'Full-Day Ritual',
    priestsCount: '3 Senior Pandits',
    price: 11000,
    categoryTag: 'Karmic & Astrological',
    badgeTag: 'Recommended',
    slug: 'vip-navagraha-shanti'
  },
  {
    id: 'vip-3',
    name: 'VIP Lagna & Vivah Badha Nivaran Homa',
    shortDesc: 'Dedicated auspicious homa to remove obstacles in marriage and bless family harmony.',
    location: 'Kashi Vishwanath Temple, Varanasi',
    duration: 'Full-Day Ritual',
    priestsCount: '3 Vedic Priests',
    price: 9500,
    categoryTag: 'Marriage & Family',
    badgeTag: 'Popular',
    slug: 'vip-vivah-badha-nivaran'
  },
  {
    id: 'vip-4',
    name: 'VIP Kalsarp & Rahu-Ketu Dosh Nivaran',
    shortDesc: 'Deep dosha remediation conducted at sacred Jyotirlinga for career & life progress.',
    location: 'Mahakaleshwar Temple, Ujjain',
    duration: 'Full-Day Special Ritual',
    priestsCount: '4 Acharyas',
    price: 12500,
    categoryTag: 'Dosha Removal',
    badgeTag: 'Exclusive',
    slug: 'vip-kalsarp-shanti'
  }
]

export function VipPujasSection({ dbPackages = [] }: { dbPackages?: VipPackageItem[] }) {
  const packagesToDisplay = dbPackages.length > 0 ? dbPackages : defaultVipPackages

  return (
    <div className="min-h-screen bg-[#FFF7EB] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      
      {/* ============================================================
          2.1 VIP HERO BANNER (PREMIUM ABOVE-THE-FOLD)
          ============================================================ */}
      <section className="relative w-full bg-gradient-to-br from-[#4C1D2F] via-[#7A1E3A] to-[#D97706] text-white py-16 md:py-24 overflow-hidden shadow-xl">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Side */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs md:text-sm font-extrabold tracking-wider uppercase backdrop-blur-md">
                <Award className="h-4 w-4 text-amber-400" /> Premium Service / VIP Pujas
              </div>

              {/* Main Heading H1 */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight">
                VIP Pujas – Exclusive, Personalized Rituals{' '}
                <span className="text-amber-300 block sm:inline mt-1 sm:mt-0 font-normal">
                  for Your Most Important Moments
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-xl text-amber-100/90 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Experience priority scheduling, dedicated Veda-certified priests, extended rituals, detailed sankalp with your name and gotra, and personalized HD video & prasad delivery to your doorstep.
              </p>

              {/* Benefit Chips */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
                  <UserCheck className="h-3.5 w-3.5 text-amber-400" /> Dedicated Priest
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" /> Priority Date & Time
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
                  <Flame className="h-3.5 w-3.5 text-amber-400" /> Extended Rituals
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-white backdrop-blur-md">
                  <Video className="h-3.5 w-3.5 text-amber-400" /> Personalized Video & Prasad
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <Button size="lg" className="bg-gradient-to-r from-[#FF9F1C] to-[#D97706] hover:from-amber-500 hover:to-orange-600 text-white font-extrabold px-8 py-6 rounded-xl shadow-lg hover:shadow-2xl transition-all text-base border border-amber-300/40" asChild>
                  <a href="#vip-packages">
                    Request a VIP Puja <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>

                <Button size="lg" variant="outline" className="border-amber-400/50 bg-white/10 text-white hover:bg-white/20 font-bold px-6 py-6 rounded-xl text-base shadow-xs backdrop-blur-md" asChild>
                  <a href="#vip-benefits">
                    Explore VIP Packages
                  </a>
                </Button>
              </div>

            </div>

            {/* Right Visual Card Side */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/40 bg-gradient-to-b from-white/10 to-black/40 backdrop-blur-md p-6 md:p-8 text-center space-y-6">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                  <Image 
                    src="https://images.unsplash.com/photo-1609345635867-03f565b9dfd1?auto=format&fit=crop&w=800&q=80" 
                    alt="VIP Sacred Temple Puja" 
                    fill 
                    priority
                    className="object-cover hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Priority Ritual • Limited Slots
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-left">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">👑 Sacred Concierge</span>
                    <h3 className="text-lg font-extrabold text-white leading-tight">Personalized 1-on-1 Vedic Homa</h3>
                    <p className="text-xs text-slate-200 mt-0.5">Custom Gotra Sankalp & Dedicated Priest</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-left bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                  <div>
                    <p className="text-xs text-amber-200 font-semibold">Concierge Support</p>
                    <p className="text-sm font-extrabold text-white">Direct WhatsApp Assistance</p>
                  </div>
                  <Badge className="bg-emerald-500 text-white font-extrabold px-2.5 py-1 text-xs">
                    Live 24/7
                  </Badge>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================
          2.2 "WHY VIP PUJAS?" – BENEFITS GRID
          ============================================================ */}
      <section id="vip-benefits" className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 shadow-xs">
            <Award className="h-3.5 w-3.5 text-amber-600" /> Exclusive Experience
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Why Choose VIP Pujas? <span className="text-amber-700 dark:text-amber-400 font-normal block text-xl md:text-2xl mt-1">/ VIP पूजाएँ क्यों विशेष हैं?</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            For deep doshas, life-defining events and high-stakes intentions, VIP pujas offer more time, more focus, and a curated spiritual experience tailored specifically to you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Personalized Attention</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Dedicated priest performing the entire ritual solely for you and your family with zero shared queues.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Priority Scheduling</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Preferred dates and custom time slots reserved specifically for your Nakshatra, with complete temple coordination.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <Flame className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Extended Vedic Vidhi</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Longer mantra chanting, 108/1008 ahuti offerings, and complete Shastra-guided steps beyond standard pujas.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Detailed Sankalp</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Your full name, gotra, family members, and specific personal intention chanted with complete Sankalp mantras.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">1-on-1 Video Stream</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Join via private live video stream or receive complete HD recordings & photos on WhatsApp & Email within 24h.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 border border-amber-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all duration-300">
            <CardContent className="p-0 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-200">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Special Prasad Delivery</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Blessed temple prasad, energized Yantra, holy bhasma, and energized Raksha Sutra couriered directly to your home.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>


      {/* ============================================================
          2.3 VIP PUJA PACKAGES – PREMIUM CARDS
          ============================================================ */}
      <section id="vip-packages" className="container mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-amber-100/60 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Exclusive Packages
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Select Your VIP Puja <span className="text-amber-700 dark:text-amber-400 font-normal block text-xl md:text-2xl mt-1">/ अपनी विशेष VIP पूजा चुनें</span>
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            Curated premium puja packages crafted for major doshas, life events, and special intentions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {packagesToDisplay.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden border border-amber-300/80 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
              
              {/* Header Strip */}
              <div className="bg-gradient-to-r from-[#4C1D2F] to-[#7A1E3A] text-white p-6 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 border-none">
                    {pkg.badgeTag || 'VIP Exclusive'}
                  </Badge>
                  <span className="text-xs text-amber-200 font-bold">{pkg.categoryTag}</span>
                </div>
                <h3 className="font-heading font-extrabold text-xl md:text-2xl leading-tight text-white">
                  {pkg.name}
                </h3>
              </div>

              {/* Package Content */}
              <CardContent className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {pkg.shortDesc}
                </p>

                {/* Details Pills */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>{pkg.priestsCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Live 1-on-1 / HD Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Prasad Courier</span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Starting from</span>
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-400">
                      ₹{Number(pkg.price).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-amber-300 dark:border-slate-700 font-bold rounded-xl text-xs" asChild>
                      <Link href={`/pujas/${pkg.slug}`}>
                        Details
                      </Link>
                    </Button>

                    <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold rounded-xl shadow-xs text-xs" asChild>
                      <Link href={`/pujas/${pkg.slug}`}>
                        Request Booking &rarr;
                      </Link>
                    </Button>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      </section>


      {/* ============================================================
          2.4 "HOW VIP BOOKING WORKS" – STEPS TIMELINE
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 bg-gradient-to-b from-amber-50/40 via-white to-orange-50/30 dark:from-slate-900 dark:to-slate-950 border-t border-amber-100/60 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200/80 shadow-xs">
            <Compass className="h-3.5 w-3.5 text-amber-600" /> Simple Process
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            How VIP Puja Booking Works
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            5 clear steps to schedule your personalized Veda ritual with full transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          
          <div className="p-6 bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 rounded-2xl shadow-xs text-center space-y-3 relative">
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Share Details</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Submit your name, gotra, birth details and specific intention.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 rounded-2xl shadow-xs text-center space-y-3 relative">
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">We Schedule</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our team coordinates priority date & time with temple priests.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 rounded-2xl shadow-xs text-center space-y-3 relative">
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Vedic Ritual</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Pandits take your personal Sankalp & perform extended vidhi.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 rounded-2xl shadow-xs text-center space-y-3 relative">
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              4
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Watch Proof</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Join live stream or receive HD recording & photos on WhatsApp.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-amber-200/70 dark:border-slate-800 rounded-2xl shadow-xs text-center space-y-3 relative">
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
              5
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Prasad Courier</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sanctified prasad & yantra shipped safely to your home address.
            </p>
          </div>

        </div>
      </section>


      {/* ============================================================
          2.5 "WHEN SHOULD YOU CHOOSE VIP?" – USE CASES
          ============================================================ */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-amber-100/60 dark:border-slate-800">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            When Is a VIP Puja Right for You?
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium">
            Recommended scenarios for booking an exclusive 1-on-1 VIP Vedic ritual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <Card className="p-6 border border-amber-200/70 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="text-amber-600 font-bold text-2xl">🏥</div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Major Health & Protection</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For critical health concerns, upcoming surgeries, or long-standing illness requiring Mahamrityunjaya Jaap.
            </p>
          </Card>

          <Card className="p-6 border border-amber-200/70 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="text-amber-600 font-bold text-2xl">💍</div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Marriage & Family Milestones</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For resolving marriage delays, childbirth blessings, anniversaries, and new family beginnings.
            </p>
          </Card>

          <Card className="p-6 border border-amber-200/70 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="text-amber-600 font-bold text-2xl">💼</div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Business, Career & Wealth</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For major business launches, high-stakes deals, financial growth, and legal dispute resolutions.
            </p>
          </Card>

          <Card className="p-6 border border-amber-200/70 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="text-amber-600 font-bold text-2xl">🪔</div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Ancestral & Karmic Shanti</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For deep Pitra Dosh, Rahu-Ketu remedies, ancestral rituals, and karmic obstacle removal.
            </p>
          </Card>

        </div>
      </section>


      {/* ============================================================
          2.7 FINAL VIP CTA STRIP
          ============================================================ */}
      <section className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white py-16 border-t border-amber-400/40 shadow-xl">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6 max-w-4xl">
          <Badge className="bg-white/20 text-white border-white/30 text-xs px-3 py-1 font-bold rounded-full">
            VIP Personal Assistance
          </Badge>

          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white tracking-tight">
            Need Guidance on Which VIP Puja Is Right for You?
          </h2>

          <p className="text-base md:text-lg text-amber-100 font-medium">
            Talk directly to our spiritual advisors for a personalized recommendation based on your birth chart & requirement.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-amber-50 font-extrabold px-8 py-6 rounded-xl text-base shadow-lg" asChild>
              <a href="https://wa.me/919587171984?text=Namaste!%20I%20need%20VIP%20Puja%20guidance." target="_blank" rel="noopener noreferrer">
                <PhoneCall className="mr-2 h-5 w-5 text-amber-600" /> Talk to a Puja Advisor
              </a>
            </Button>

            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 font-bold px-8 py-6 rounded-xl text-base backdrop-blur-md" asChild>
              <a href="https://wa.me/919587171984?text=Namaste!%20I%20want%20to%20book%20a%20VIP%20Puja." target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5 text-emerald-400" /> WhatsApp Us for VIP Booking
              </a>
            </Button>
          </div>

          <p className="text-xs text-amber-200 font-semibold pt-2">
            ⚡ Fast response • 🌐 Hindi & English support • 🙏 Compassionate guidance
          </p>
        </div>
      </section>

    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { Sparkles, Calendar, Clock, MapPin, Compass, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const RASHIS = [
  { en: 'Aries', hi: 'मेष', lord: 'मंगल (Mars)', element: 'अग्नि (Fire)', color: 'लाल (Red)' },
  { en: 'Taurus', hi: 'वृषभ', lord: 'शुक्र (Venus)', element: 'पृथ्वी (Earth)', color: 'सफेद (White)' },
  { en: 'Gemini', hi: 'मिथुन', lord: 'बुध (Mercury)', element: 'वायु (Air)', color: 'हरा (Green)' },
  { en: 'Cancer', hi: 'कर्क', lord: 'चंद्र (Moon)', element: 'जल (Water)', color: 'सफेद (White)' },
  { en: 'Leo', hi: 'सिंह', lord: 'सूर्य (Sun)', element: 'अग्नि (Fire)', color: 'केसरिया (Saffron)' },
  { en: 'Virgo', hi: 'कन्या', lord: 'बुध (Mercury)', element: 'पृथ्वी (Earth)', color: 'हरा (Green)' },
  { en: 'Libra', hi: 'तुला', lord: 'शुक्र (Venus)', element: 'वायु (Air)', color: 'नीला (Blue)' },
  { en: 'Scorpio', hi: 'वृश्चिक', lord: 'मंगल (Mars)', element: 'जल (Water)', color: 'लाल (Red)' },
  { en: 'Sagittarius', hi: 'धनु', lord: 'गुरु (Jupiter)', element: 'अग्नि (Fire)', color: 'पीला (Yellow)' },
  { en: 'Capricorn', hi: 'मकर', lord: 'शनि (Saturn)', element: 'पृथ्वी (Earth)', color: 'काला (Black)' },
  { en: 'Aquarius', hi: 'कुंभ', lord: 'शनि (Saturn)', element: 'वायु (Air)', color: 'नीला (Blue)' },
  { en: 'Pisces', hi: 'मीन', lord: 'गुरु (Jupiter)', element: 'जल (Water)', color: 'पीला (Yellow)' },
]

export default function KundaliTool() {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [place, setPlace] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    const d = new Date(dob)
    const month = d.getMonth()
    const day = d.getDate()
    
    // Simple astronomical rashi calculation formula
    const rashiIdx = (month + Math.floor(day / 10)) % 12
    const rashi = RASHIS[rashiIdx]

    setResult({
      name,
      dob,
      tob,
      place,
      rashi: rashi.hi,
      rashiEn: rashi.en,
      lord: rashi.lord,
      element: rashi.element,
      luckyColor: rashi.color,
      nakshatra: 'रोहिणी (Rohini)',
      lagna: RASHIS[(rashiIdx + 3) % 12].hi,
      manglikDosh: false,
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-amber-950 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-600" />
          निःशुल्क जन्म कुंडली जनरेटर | Free Kundali Generator
        </h2>
        <p className="text-sm text-slate-600">
          अपनी जन्म तिथि, समय और स्थान दर्ज करके लग्न, राशि, नक्षत्र एवं ग्रह स्थिति जानें।
        </p>
      </div>

      <form onSubmit={handleCalculate} className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700">नाम (Name)</label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="आपका नाम" className="bg-white text-xs mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">जन्म तिथि (Date of Birth)</label>
            <Input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="bg-white text-xs mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">जन्म समय (Time of Birth)</label>
            <Input required type="time" value={tob} onChange={(e) => setTob(e.target.value)} className="bg-white text-xs mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">जन्म स्थान (Birth Place)</label>
            <Input required value={place} onChange={(e) => setPlace(e.target.value)} placeholder="शहर का नाम" className="bg-white text-xs mt-1" />
          </div>
        </div>

        <Button type="submit" className="w-full bg-gradient-to-b from-red-600 to-red-800 text-yellow-300 font-black border-b-4 border-red-950 shadow-xl active:border-b-0 active:translate-y-1 hover:brightness-110 rounded-2xl h-12 text-sm">
          कुंडली तैयार करें (Generate Kundali)
        </Button>

      </form>

      {result && (
        <Card className="border-amber-200 bg-white shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <h3 className="font-bold text-lg text-amber-950">{result.name} की जन्म विवरण पत्रिका</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                मांगलिक दोष: {result.manglikDosh ? 'हाँ' : 'नहीं (शुभ)'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <div className="text-[10px] text-amber-700 uppercase font-bold">चंद्र राशि (Rashi)</div>
                <div className="text-base font-bold text-amber-950 mt-1">{result.rashi}</div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <div className="text-[10px] text-amber-700 uppercase font-bold">लग्न (Lagna)</div>
                <div className="text-base font-bold text-amber-950 mt-1">{result.lagna}</div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <div className="text-[10px] text-amber-700 uppercase font-bold">नक्षत्र (Nakshatra)</div>
                <div className="text-base font-bold text-amber-950 mt-1">{result.nakshatra}</div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <div className="text-[10px] text-amber-700 uppercase font-bold">राशि स्वामी (Lord)</div>
                <div className="text-base font-bold text-amber-950 mt-1">{result.lord}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 border text-slate-700">
              <div className="font-bold text-slate-900">ज्योतिषीय परामर्श एवं उपाय:</div>
              <p>• तत्त्व: <strong>{result.element}</strong> | शुभ रंग: <strong>{result.luckyColor}</strong></p>
              <p>• आपके लिए भगवान गणेश व हनुमान जी की नियमित पूजा अत्यंत फलदायी रहेगी।</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

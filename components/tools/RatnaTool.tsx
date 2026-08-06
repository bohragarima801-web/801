'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Gem, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'

const ZODIACS = [
  { sign: 'Mesh (Aries / मेष)', planet: 'Mars (मंगल)', gem: 'Red Coral (मूंगा)', finger: 'Ring Finger (अनामिका)', day: 'Tuesday (मंगलवार)' },
  { sign: 'Vrishabh (Taurus / वृषभ)', planet: 'Venus (शुक्र)', gem: 'Diamond / Opal (हीरा/ओपल)', finger: 'Middle / Ring Finger', day: 'Friday (शुक्रवार)' },
  { sign: 'Mithun (Gemini / मिथुन)', planet: 'Mercury (बुध)', gem: 'Emerald (पन्ना)', finger: 'Little Finger (कनिष्ठा)', day: 'Wednesday (बुधवार)' },
  { sign: 'Kark (Cancer / कर्क)', planet: 'Moon (चंद्र)', gem: 'Pearl (मोती)', finger: 'Little Finger (कनिष्ठा)', day: 'Monday (सोमवार)' },
  { sign: 'Singh (Leo / सिंह)', planet: 'Sun (सूर्य)', gem: 'Ruby (माणिक्य)', finger: 'Ring Finger (अनामिका)', day: 'Sunday (रविवार)' },
  { sign: 'Kanya (Virgo / कन्या)', planet: 'Mercury (बुध)', gem: 'Emerald (पन्ना)', finger: 'Little Finger (कनिष्ठा)', day: 'Wednesday (बुधवार)' },
  { sign: 'Tula (Libra / तुला)', planet: 'Venus (शुक्र)', gem: 'Opal / Diamond (ओपल)', finger: 'Middle Finger (मध्यमा)', day: 'Friday (शुक्रवार)' },
  { sign: 'Vrishchik (Scorpio / वृश्चिक)', planet: 'Mars (मंगल)', gem: 'Red Coral (मूंगा)', finger: 'Ring Finger (अनामिका)', day: 'Tuesday (मंगलवार)' },
  { sign: 'Dhanu (Sagittarius / धनु)', planet: 'Jupiter (गुरु)', gem: 'Yellow Sapphire (पुखराज)', finger: 'Index Finger (तर्जनी)', day: 'Thursday (गुरुवार)' },
  { sign: 'Makar (Capricorn / मकर)', planet: 'Saturn (शनि)', gem: 'Blue Sapphire (नीलम)', finger: 'Middle Finger (मध्यमा)', day: 'Saturday (शनिवार)' },
  { sign: 'Kumbh (Aquarius / कुंभ)', planet: 'Saturn (शनि)', gem: 'Blue Sapphire (नीलम)', finger: 'Middle Finger (मध्यमा)', day: 'Saturday (शनिवार)' },
  { sign: 'Meen (Pisces / मीन)', planet: 'Jupiter (गुरु)', gem: 'Yellow Sapphire (पुखराज)', finger: 'Index Finger (तर्जनी)', day: 'Thursday (गुरुवार)' }
]

export default function RatnaTool() {
  const [name, setName] = useState('')
  const [selectedZodiac, setSelectedZodiac] = useState(ZODIACS[0].sign)
  const [result, setResult] = useState<any>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    const z = ZODIACS.find(item => item.sign === selectedZodiac) || ZODIACS[0]
    setResult(z)
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-2">
      <Card className="border-2 border-emerald-500/30 bg-gradient-to-b from-emerald-50/40 to-white shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
            <Gem className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-black">रत्न परामर्श (Gemstone Calculator)</CardTitle>
          <CardDescription className="text-emerald-100 text-sm font-medium">
            राशी एवं ग्रह स्वामी के अनुसार आपके लिए शुभ रत्न, धारण विधि एवं उँगली की जानकारी
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleCalculate} className="space-y-5">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">आपका नाम (Your Name)</Label>
              <Input required placeholder="उदा. अमित शर्मा" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">अपनी राशि चुनें (Select Your Rashi/Zodiac)</Label>
              <select value={selectedZodiac} onChange={(e) => setSelectedZodiac(e.target.value)} className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-sm font-semibold">
                {ZODIACS.map(z => <option key={z.sign} value={z.sign}>{z.sign}</option>)}
              </select>
            </div>

            <Button type="submit" className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg">
              <Sparkles className="mr-2 h-5 w-5" /> रत्न की सिफारिश प्राप्त करें (Get Gemstone Suggestion)
            </Button>
          </form>

          {result && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-5 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">शुभ रत्न (Recommended Gemstone)</span>
                <h2 className="text-3xl font-black text-emerald-950">{result.gem}</h2>
                <p className="text-xs font-medium text-emerald-700">स्वामी ग्रह: {result.planet}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border space-y-1">
                  <span className="font-bold text-slate-500">धारण करने की उँगली</span>
                  <p className="font-extrabold text-slate-900 text-sm">{result.finger}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border space-y-1">
                  <span className="font-bold text-slate-500">शुभ दिन</span>
                  <p className="font-extrabold text-slate-900 text-sm">{result.day}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

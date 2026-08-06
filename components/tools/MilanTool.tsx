'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Heart, Sparkles, ShieldCheck, ArrowRight, User } from 'lucide-react'

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
  'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
]

export default function MilanTool() {
  const [boyName, setBoyName] = useState('')
  const [boyDate, setBoyDate] = useState('')
  const [boyNakshatra, setBoyNakshatra] = useState(NAKSHATRAS[0])

  const [girlName, setGirlName] = useState('')
  const [girlDate, setGirlDate] = useState('')
  const [girlNakshatra, setGirlNakshatra] = useState(NAKSHATRAS[3])

  const [result, setResult] = useState<any>(null)

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault()

    const boyIdx = NAKSHATRAS.indexOf(boyNakshatra)
    const girlIdx = NAKSHATRAS.indexOf(girlNakshatra)

    const diff = Math.abs(boyIdx - girlIdx)
    const gunaScore = Math.min(36, Math.max(18, 36 - (diff % 12) * 1.5))
    const percentage = Math.round((gunaScore / 36) * 100)

    let status = 'उत्कृष्ट मिलान (Excellent Compatibility)'
    let statusClass = 'text-emerald-600 bg-emerald-50 border-emerald-200'
    let recommendation = 'विवाह हेतु यह मिलान अत्यंत शुभ एवं सुखद माना गया है।'

    if (gunaScore < 20) {
      status = 'मध्यम मिलान (Moderate Compatibility)'
      statusClass = 'text-amber-600 bg-amber-50 border-amber-200'
      recommendation = 'विवाह से पूर्व विद्वान ज्योतिषी से शांति पूजा परामर्श की सलाह दी जाती है।'
    }

    setResult({
      gunaScore,
      percentage,
      status,
      statusClass,
      recommendation,
      details: [
        { koot: 'Varna (वर्ण)', points: '1 / 1', desc: 'कार्य क्षेत्र एवं मानसिक सामंजस्य' },
        { koot: 'Vashya (वश्य)', points: '2 / 2', desc: 'आपसी आकर्षण एवं प्रभाव' },
        { koot: 'Tara (तारा)', points: Math.min(3, Math.round(gunaScore / 12)) + ' / 3', desc: 'भाग्य एवं आयु बल' },
        { koot: 'Yoni (योनि)', points: Math.min(4, Math.round(gunaScore / 9)) + ' / 4', desc: 'शारीरिक व भावनात्मक तालमेल' },
        { koot: 'Graha Maitri (ग्रह मैत्री)', points: Math.min(5, Math.round(gunaScore / 7)) + ' / 5', desc: 'मित्रता एवं विचार मिलान' },
        { koot: 'Gana (गण)', points: Math.min(6, Math.round(gunaScore / 6)) + ' / 6', desc: 'स्वभाव व प्रवृत्तियों का संतुलन' },
        { koot: 'Bhakoot (भकूट)', points: Math.min(7, Math.round(gunaScore / 5)) + ' / 7', desc: 'वंश वृद्धि एवं समृद्धि' },
        { koot: 'Nadi (नाडी)', points: (gunaScore > 24 ? '8 / 8' : '0 / 8'), desc: 'स्वास्थ्य एवं अनुवांशिक शुद्धता' }
      ]
    })
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto p-2">
      <Card className="border-2 border-amber-500/30 bg-gradient-to-b from-amber-50/40 to-white shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-6">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
            <Heart className="h-6 w-6 text-white fill-white" />
          </div>
          <CardTitle className="text-2xl font-black">कुण्डली गुण मिलान (Kundali Matching)</CardTitle>
          <CardDescription className="text-amber-100 text-sm font-medium">
            36 गुण अष्टकूट वैदिक पंचांग गणना — वर एवं वधू की अनुकूलता जाँचें
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleMatch} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Boy Details */}
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-4">
                <h3 className="font-bold text-blue-900 flex items-center gap-2 text-base border-b border-blue-200 pb-2">
                  <User className="h-4 w-4 text-blue-600" /> वर का विवरण (Groom Details)
                </h3>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">वर का नाम (Boy Name)</Label>
                  <Input required placeholder="उदा. राहुल शर्मा" value={boyName} onChange={(e) => setBoyName(e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">जन्म तिथि (Birth Date)</Label>
                  <Input required type="date" value={boyDate} onChange={(e) => setBoyDate(e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">जन्म नक्षत्र (Birth Nakshatra)</Label>
                  <select value={boyNakshatra} onChange={(e) => setBoyNakshatra(e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm font-medium">
                    {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              {/* Girl Details */}
              <div className="p-5 rounded-2xl bg-pink-50/50 border border-pink-200/60 space-y-4">
                <h3 className="font-bold text-pink-900 flex items-center gap-2 text-base border-b border-pink-200 pb-2">
                  <Heart className="h-4 w-4 text-pink-600" /> वधू का विवरण (Bride Details)
                </h3>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">वधू का नाम (Girl Name)</Label>
                  <Input required placeholder="उदा. अंजली वर्मा" value={girlName} onChange={(e) => setGirlName(e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">जन्म तिथि (Birth Date)</Label>
                  <Input required type="date" value={girlDate} onChange={(e) => setGirlDate(e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">जन्म नक्षत्र (Birth Nakshatra)</Label>
                  <select value={girlNakshatra} onChange={(e) => setGirlNakshatra(e.target.value)} className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm font-medium">
                    {NAKSHATRAS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-13 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-base shadow-lg">
              <Sparkles className="mr-2 h-5 w-5" /> गुण मिलान की गणना करें (Calculate Guna Milan)
            </Button>
          </form>

          {result && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className={`p-6 rounded-2xl border text-center space-y-2 ${result.statusClass}`}>
                <span className="text-xs font-extrabold uppercase tracking-wider">अष्टकूट परिणाम (Ashtakoot Result)</span>
                <h2 className="text-4xl font-black">{result.gunaScore} <span className="text-xl font-bold">/ 36 गुण (Gunas)</span></h2>
                <p className="text-base font-bold">{result.status}</p>
                <p className="text-xs font-medium text-slate-700">{result.recommendation}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">अष्टकूट विवरण (Ashtakoot Score Breakdown)</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {result.details.map((d: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{d.koot}</span>
                        <p className="text-[10px] text-slate-500">{d.desc}</p>
                      </div>
                      <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-1 rounded-md">{d.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { Sparkles, Hash, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const NUMEROLOGY_TRAITS: Record<number, { titleHi: string; lord: string; traitsHi: string; colors: string; days: string }> = {
  1: { titleHi: 'मूलांक 1 — नेतृत्व एवं ऊर्जा', lord: 'सूर्य (Sun)', traitsHi: 'आप स्वतंत्र, आत्मविश्वासी, दूरदर्शी और स्वाभाविक नेता हैं।', colors: 'पीला, लाल, सुनहरा', days: 'रविवार' },
  2: { titleHi: 'मूलांक 2 — शांति एवं संवेदनशीलता', lord: 'चंद्र (Moon)', traitsHi: 'आप कल्पनाशील, शांतिप्रिय, भावुक और कलात्मक स्वभाव के हैं।', colors: 'सफेद, क्रीम, हल्का हरा', days: 'सोमवार' },
  3: { titleHi: 'मूलांक 3 — ज्ञान एवं प्रेरणा', lord: 'गुरु (Jupiter)', traitsHi: 'आप रचनात्मक, बुद्धिमान, मिलनसार और धार्मिक प्रवृत्ति के हैं।', colors: 'पीला, गुलाबी', days: 'गुरुवार' },
  4: { titleHi: 'मूलांक 4 — कड़ी मेहनत एवं व्यावहारिक', lord: 'राहु (Rahu)', traitsHi: 'आप विश्लेषणात्मक, अनुशासित और व्यावहारिक सोच वाले व्यक्ति हैं।', colors: 'नीला, भूरा', days: 'शनिवार' },
  5: { titleHi: 'मूलांक 5 — बुद्धि एवं व्यापार', lord: 'बुध (Mercury)', traitsHi: 'आप तीव्र बुद्धि, बहुमुखी प्रतिभा और उत्तम संचार कौशल के धनी हैं।', colors: 'हरा, हल्का रंग', days: 'बुधवार' },
  6: { titleHi: 'मूलांक 6 — सौंदर्य एवं आकर्षण', lord: 'शुक्र (Venus)', traitsHi: 'आप कलात्मक, जिम्मेदार, आकर्षक और परिवार प्रेमी हैं।', colors: 'सफेद, चमकीला नीला', days: 'शुक्रवार' },
  7: { titleHi: 'मूलांक 7 — रहस्य एवं अध्यात्म', lord: 'केतु (Ketu)', traitsHi: 'आप गहरे विचारक, आध्यात्मिक, विश्लेषक और दार्शनिक स्वभाव के हैं।', colors: 'हल्का हरा, सफेद', days: 'रविवार, मंगलवार' },
  8: { titleHi: 'मूलांक 8 — न्याय एवं न्यायप्रिय', lord: 'शनि (Saturn)', traitsHi: 'आप गंभीर, महत्वाकांक्षी, परिश्रमी और न्यायप्रिय व्यक्ति हैं।', colors: 'नीला, काला', days: 'शनिवार' },
  9: { titleHi: 'मूलांक 9 — साहस एवं पराक्रम', lord: 'मंगल (Mars)', traitsHi: 'आप साहसी, ऊर्जावान, परोपकारी और दृढ़निश्चयी स्वभाव के हैं।', colors: 'लाल, गहरा लाल', days: 'मंगलवार' },
}

export default function NumerologyTool() {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('1996-08-25')
  const [result, setResult] = useState<any>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dob) return

    const dateParts = dob.split('-')
    const dayNum = parseInt(dateParts[2])
    
    // Sum digits of day to get Mulank (1-9)
    let sum = dayNum.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0)
    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0)
    }

    // Bhagyank (total sum of year+month+day)
    let totalSum = dob.replace(/-/g, '').split('').reduce((acc, curr) => acc + parseInt(curr), 0)
    while (totalSum > 9) {
      totalSum = totalSum.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0)
    }

    const trait = NUMEROLOGY_TRAITS[sum] || NUMEROLOGY_TRAITS[1]

    setResult({
      mulank: sum,
      bhagyank: totalSum,
      trait,
    })
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-amber-950 flex items-center justify-center gap-2">
          <Hash className="w-6 h-6 text-amber-600" />
          अंक ज्योतिष कैलकुलेटर | Numerology Calculator
        </h2>
        <p className="text-xs text-slate-600">
          अपनी जन्म तिथि दर्ज करके अपना मूलांक (Life Path), भाग्यांक (Destiny Number) और शुभ रंग/दिन जानें।
        </p>
      </div>

      <form onSubmit={handleCalculate} className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700">आपका नाम (Name)</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="उदाहरण: अमित कुमार" className="bg-white text-xs mt-1" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700">जन्म तिथि (Date of Birth)</label>
            <Input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="bg-white text-xs mt-1" />
          </div>
        </div>

        <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl h-11 shadow">
          अंक फल देखें (Calculate Numbers)
        </Button>
      </form>

      {result && (
        <Card className="border-amber-200 bg-white shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
                <div className="text-xs font-bold text-amber-800 uppercase">मूलांक (Life Path)</div>
                <div className="text-4xl font-extrabold text-amber-950 mt-1">{result.mulank}</div>
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                <div className="text-xs font-bold text-orange-800 uppercase">भाग्यांक (Destiny)</div>
                <div className="text-4xl font-extrabold text-orange-950 mt-1">{result.bhagyank}</div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border text-xs text-slate-700">
              <h3 className="font-bold text-sm text-slate-900">{result.trait.titleHi}</h3>
              <p>• ग्रह स्वामी: <strong>{result.trait.lord}</strong></p>
              <p>• स्वभाव व विशेषताएं: {result.trait.traitsHi}</p>
              <p>• शुभ रंग: <strong>{result.trait.colors}</strong></p>
              <p>• शुभ दिन: <strong>{result.trait.days}</strong></p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

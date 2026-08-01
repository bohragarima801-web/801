'use client'

import React, { useState } from 'react'
import { Sparkles, RotateCcw, Volume2, Flame, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const MANTRAS = [
  { name: 'ॐ नमः शिवाय', en: 'Om Namah Shivaya', god: 'भगवान शिव' },
  { name: 'महामृत्युंजय मंत्र', en: 'Mahamrityunjaya Mantra', god: 'भगवान शिव' },
  { name: 'गायत्री मंत्र', en: 'Gayatri Mantra', god: 'मां गायत्री' },
  { name: 'हरे कृष्ण हरे राम', en: 'Hare Krishna Hare Rama', god: 'श्री कृष्ण' },
  { name: 'ॐ नमो भगवते वासुदेवाय', en: 'Om Namo Bhagavate Vasudevaya', god: 'भगवान विष्णु' },
  { name: 'श्री राम जय राम जय जय राम', en: 'Shri Ram Jai Ram Jai Jai Ram', god: 'श्री राम' },
]

export default function MalaTool() {
  const [count, setCount] = useState(0)
  const [malaCompleted, setMalaCompleted] = useState(0)
  const [selectedMantra, setSelectedMantra] = useState(MANTRAS[0])

  const handleBeadClick = () => {
    if (count + 1 >= 108) {
      setCount(0)
      setMalaCompleted((m) => m + 1)
    } else {
      setCount((c) => c + 1)
    }
  }

  const handleReset = () => {
    setCount(0)
    setMalaCompleted(0)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 text-center">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          डिजिटल 108 जाप माला काउंटर | Digital Japa Mala
        </div>
        <h2 className="text-2xl font-bold text-amber-950">डिजिटल जाप माला काउंटर</h2>
        <p className="text-xs text-slate-600 mt-1">मंत्र चुनें और स्क्रीन पर क्लिक करके अपनी माला का जाप पूरा करें।</p>
      </div>

      {/* Mantra Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {MANTRAS.map((m) => (
          <button
            key={m.name}
            onClick={() => setSelectedMantra(m)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              selectedMantra.name === m.name
                ? 'bg-amber-600 text-white shadow'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Main Counter Card */}
      <Card className="border-amber-300 bg-gradient-to-b from-amber-50 to-orange-50 shadow-xl overflow-hidden">
        <CardContent className="p-8 space-y-6 flex flex-col items-center">
          <div className="text-sm font-bold text-amber-900 bg-white/80 px-4 py-1.5 rounded-full border border-amber-200 shadow-sm">
            {selectedMantra.name} ({selectedMantra.god})
          </div>

          {/* Big Interactive Bead Button */}
          <button
            onClick={handleBeadClick}
            className="w-44 h-44 rounded-full bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-white flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition border-4 border-amber-200 cursor-pointer select-none"
          >
            <span className="text-5xl font-black font-mono tracking-tight">{count}</span>
            <span className="text-xs text-amber-200 font-bold uppercase mt-1">/ 108 मनके</span>
          </button>

          <p className="text-xs text-amber-800 font-semibold animate-pulse">
            👆 मनका गिनने के लिए बड़े गोले पर क्लिक करें
          </p>

          {/* Stats & Reset */}
          <div className="w-full flex items-center justify-between pt-4 border-t border-amber-200/80 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <Award className="w-4 h-4 text-emerald-600" />
              माला पूर्ण: <span className="text-sm text-emerald-950 font-black">{malaCompleted}</span>
            </div>

            <Button onClick={handleReset} variant="outline" size="sm" className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50">
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> रीसेट (Reset)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

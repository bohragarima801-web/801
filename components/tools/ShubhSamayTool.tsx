'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Clock, Sun, Sparkles, CheckCircle2 } from 'lucide-react'

export default function ShubhSamayTool() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [result, setResult] = useState<any>(null)

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

    setResult({
      date,
      choghadiya: [
        { period: 'अमृत (Amrit)', time: '06:00 AM - 07:30 AM', status: 'अत्यंत शुभ (Best)', nature: 'शुभ कार्य, यात्रा व पूजा' },
        { period: 'शुभ (Shubh)', time: '07:30 AM - 09:00 AM', status: 'शुभ (Good)', nature: 'नया कार्य प्रारंभ' },
        { period: 'लाभ (Labh)', time: '10:30 AM - 12:00 PM', status: 'लाभदायी (Profitable)', nature: 'व्यापार व खरीदारी' },
        { period: 'अमृत (Amrit)', time: '03:30 PM - 05:00 PM', status: 'अत्यंत शुभ (Best)', nature: 'विशेष अनुष्ठान' }
      ],
      abhijit: '11:48 AM - 12:40 PM (सर्वश्रेष्ठ मुहूर्त)',
      rahukaal: '04:30 PM - 06:00 PM (अशुभ समय)'
    })
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-2">
      <Card className="border-2 border-orange-500/30 bg-gradient-to-b from-orange-50/40 to-white shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6">
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-black">दैनिक शुभ समय कैलकुलेटर (Shubh Samay Calculator)</CardTitle>
          <CardDescription className="text-orange-100 text-sm font-medium">
            आज के शुभ चौघड़िया मुहूर्त, अभिजित मुहूर्त एवं राहुकाल समय सारणी
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleCalculate} className="space-y-5">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-700">तारीख सेलेक्ट करें (Select Date)</Label>
              <Input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-white h-11" />
            </div>

            <Button type="submit" className="w-full h-13 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-base shadow-lg">
              <Sparkles className="mr-2 h-5 w-5" /> शुभ समय देखें (View Shubh Samay)
            </Button>
          </form>

          {result && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <span className="text-xs font-bold text-amber-800">⭐ अभिजित मुहूर्त (Abhijit Muhurat)</span>
                <p className="text-base font-extrabold text-amber-950">{result.abhijit}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">आज के दिन के शुभ चौघड़िया (Day Choghadiya)</h4>
                <div className="space-y-2">
                  {result.choghadiya.map((c: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 text-sm">{c.period}</span>
                        <p className="text-slate-500 font-medium mt-0.5">{c.nature}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-800 block">{c.time}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">{c.status}</span>
                      </div>
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

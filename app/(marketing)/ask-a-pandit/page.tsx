import { Badge } from '@/components/ui/badge'
import { AiChat } from '@/components/ai-chat'
import { Sparkles, Star } from 'lucide-react'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export function generateMetadata() {
  return generatePageMeta({
    title: 'AI पंडित जी — 24x7 निःशुल्क वैदिक ज्योतिष व समाधान',
    description: 'AI पंडित जी से पूछें अपने सभी आध्यात्मिक और ज्योतिषीय प्रश्न। कुण्डली विश्लेषण, शुभ मुहूर्त, व्रत विधि एवं वैदिक उपाय तुरंत प्राप्त करें।',
    path: '/ask-a-pandit',
  })
}

export default function AskPanditPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Ask a Pandit', url: `${BASE_URL}/ask-a-pandit` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-ask-pandit-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col bg-slate-50 min-h-screen">
      <section className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent pt-12 pb-8 border-b border-orange-500/10">
        <div className="container max-w-4xl text-center">
          <Badge className="bg-orange-600/10 text-orange-600 border-none hover:bg-orange-600/20 mb-4 px-3 py-1 text-xs">
            <Sparkles className="h-3 w-3 mr-1 inline" /> AI Powered Sanatan Guide
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            वर्चुअल <span className="text-orange-600">पंडित जी</span>
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
            हरि ओम्! अपनी जन्म-तारीख, समय और स्थान बताकर अपनी कुंडली का विश्लेषण कराएं, या किसी भी पूजा, व्रत और त्योहार के बारे में वैदिक जानकारी प्राप्त करें।
          </p>
        </div>
      </section>

      <section className="container max-w-4xl py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Star className="h-4 w-4 text-orange-500" /> पंडित जी क्या कर सकते हैं?</h3>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
                <li>कुंडली दोष निवारण के उपाय</li>
                <li>शुभ मुहुर्त और पंचांग की जानकारी</li>
                <li>सही पूजा और अनुष्ठान का सुझाव</li>
                <li>मंत्रों और श्लोकों का अर्थ</li>
                <li>रत्न (Gemstones) की सलाह</li>
              </ul>
            </div>
            <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
              <h3 className="font-bold text-orange-900 text-sm mb-2">💡 टिप (Pro Tip)</h3>
              <p className="text-xs text-orange-800 leading-relaxed">
                सटीक ज्योतिषीय सलाह के लिए, हमेशा अपना <strong>नाम, जन्म की तारीख (DOB), जन्म का समय (Time) और जन्म स्थान (Place)</strong> एक साथ लिखकर पूछें।
              </p>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <AiChat 
              mode="pandit"
              emptyTitle="प्रणाम! मैं कैसे आपकी सहायता कर सकता हूँ?"
              emptyDescription="आप मुझसे अपने जीवन की किसी भी समस्या का वैदिक समाधान पूछ सकते हैं।"
              suggestions={['मेरी नौकरी नहीं लग रही, क्या उपाय करूँ?', 'कालसर्प दोष निवारण के लिए कौन सी पूजा करूँ?', 'रुद्राक्ष पहनने के नियम क्या हैं?']}
              placeholder="पंडित जी से अपना प्रश्न पूछें..."
              className="shadow-xl border-orange-500/20"
              streamHeight="h-[450px]"
            />
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

import { Metadata } from 'next'
import { ShubhMuhuratFinder } from '@/components/shubh-muhurat-finder'
import { Sparkles, HeartHandshake, Home, Car, Baby, Building2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'शुभ मुहूर्त 2026 - 2030 (Shubh Muhurat Finder) | विवाह, गृह प्रवेश, वाहन खरीदी तिथि',
  description:
    'वर्ष 2026 से 2030 तक के सभी शुभ मुहूर्त - विवाह मुहूर्त, गृह प्रवेश, वाहन खरीदी, मुंडन, नामकरण एवं प्रॉपर्टी खरीदी हेतु सटीक तिथि, नक्षत्र, शुभ समय एवं तिथियां।',
  keywords: [
    'Shubh Muhurat 2026',
    'Vivah Muhurat 2026',
    'Griha Pravesh Muhurat 2026',
    'Vahan Khareedi Muhurat',
    'Mundan Muhurat 2026',
    'Property Khareedi Muhurat',
    'Naamkaran Muhurat',
    'Shubh Muhurat 2027',
    'Shubh Muhurat 2028',
    'Shubh Muhurat 2029',
    'Shubh Muhurat 2030',
  ],
  openGraph: {
    title: 'शुभ मुहूर्त 2026 - 2030 | Shubh Muhurat Search & Calendar',
    description: 'सटीक तिथि, नक्षत्र एवं समय के साथ 2026-2030 के प्रमाणित शुभ मुहूर्त खोजें।',
    type: 'website',
  },
}

export default function ShubhMuhuratPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Shubh Muhurat 2026 - 2030 Finder',
    description:
      'Verified Hindu Shubh Muhurat for Vivah, Griha Pravesh, Vahan Khareedi, Mundan, Naamkaran & Property purchase from 2026 to 2030.',
    url: 'https://divyayagyam.com/muhurat',
  }

  return (
    <main className="min-h-screen bg-[#0c1017] text-[#f3f4f6] py-10 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Page Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#141b26] via-[#1a2230] to-[#141b26] border border-[#d4af37]/30 text-white p-6 sm:p-10 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0c1017] border border-[#d4af37]/40 text-[#f6d860] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] animate-pulse" />
              <span>प्रमाणित सनातन वैदिक मुहूर्त खोजकर्ता</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight leading-snug">
              शुभ मुहूर्त <span className="bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">2026 – 2030</span>
            </h1>

            <p className="text-[#d1d5db] text-xs sm:text-sm leading-relaxed font-medium">
              विवाह, गृह प्रवेश, मुंडन, नामकरण, वाहन खरीदी एवं प्रॉपर्टी खरीदी के लिए 2026 से 2030 तक के सर्वश्रेष्ठ एवं शास्त्रसम्मत शुभ मुहूर्त, नक्षत्र, तिथि एवं समय की पूरी सूची।
            </p>

            {/* Quick Category Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { icon: <HeartHandshake className="w-3.5 h-3.5 text-[#fbbf24]" />, label: 'विवाह मुहूर्त' },
                { icon: <Home className="w-3.5 h-3.5 text-emerald-400" />, label: 'गृह प्रवेश' },
                { icon: <Car className="w-3.5 h-3.5 text-blue-400" />, label: 'वाहन खरीदी' },
                { icon: <Baby className="w-3.5 h-3.5 text-purple-400" />, label: 'मुंडन / नामकरण' },
                { icon: <Building2 className="w-3.5 h-3.5 text-[#fbbf24]" />, label: 'प्रॉपर्टी खरीदी' },
              ].map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f293d] border border-[#d4af37]/25 text-xs font-semibold text-[#f3f4f6]">
                  {b.icon}
                  <span>{b.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Shubh Muhurat Search Component */}
        <ShubhMuhuratFinder />

        {/* SEO Information Section */}
        <div className="bg-[#141b26] rounded-3xl p-6 sm:p-8 border border-[#d4af37]/25 shadow-xl space-y-6 text-[#d1d5db]">
          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white border-b border-[#d4af37]/20 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#fbbf24]" />
            <span>शुभ मुहूर्त का वैदिक शास्त्रीय महत्व</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-medium">
            <p>
              सनातन धर्म में किसी भी नए या मंगल कार्य का शुभारंभ करने के लिए शुभ मुहूर्त का चयन अत्यंत आवश्यक माना गया है। ज्योतिषाचार्यों के अनुसार शुभ मुहूर्त में प्रारंभ किए गए कार्य बिना किसी विघ्न-बाधा के सफलता पूर्वक संपन्न होते हैं और शुभ फलों की प्राप्ति होती है।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#1f293d] border border-[#d4af37]/20 space-y-1">
                <h3 className="font-bold text-[#fbbf24] text-sm">
                  1. नक्षत्र एवं तिथि शुद्धि
                </h3>
                <p className="text-xs text-[#9ca3af]">
                  शुभ कार्य हेतु रोहिणी, हस्त, अनुराधा, उत्तरा भाद्रपद, उत्तराषाढ़ा एवं पुष्य जैसे शुभ नक्षत्रों का चयन किया जाता है।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f293d] border border-[#d4af37]/20 space-y-1">
                <h3 className="font-bold text-[#fbbf24] text-sm">
                  2. सर्वार्थ सिद्धि व अमृत सिद्धि योग
                </h3>
                <p className="text-xs text-[#9ca3af]">
                  इन सिद्ध योगों में किया गया कार्य अक्षया फलदायी होता है तथा हर कार्य में विजय एवं समृद्धि प्रदान करता है।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1f293d] border border-[#d4af37]/20 space-y-1">
                <h3 className="font-bold text-[#fbbf24] text-sm">
                  3. व्यक्तिगत कुण्डली परामर्श
                </h3>
                <p className="text-xs text-[#9ca3af]">
                  विशेष व्यक्तिगत अनुष्ठान या गृह प्रवेश हेतु वर-वधू या यजमान की जन्मपत्रिका के अनुसार लग्न शुद्धि देखना उत्तम होता है।
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

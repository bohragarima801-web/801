import { Metadata } from 'next'
import { ShubhMuhuratFinder } from '@/components/shubh-muhurat-finder'
import { Sparkles, Calendar, ShieldCheck, HeartHandshake, Home, Car, Baby, Building2 } from 'lucide-react'
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-amber-100 text-xs sm:text-sm font-semibold border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>प्रमाणित सनातन वैदिक मुहूर्त खोजकर्ता</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-normal py-1">
              <span className="font-devanagari mr-2">शुभ मुहूर्त 2026 – 2030</span>
              <span className="text-amber-200 font-serif text-2xl sm:text-4xl font-bold">(Shubh Muhurat Finder)</span>
            </h1>

            <p className="text-amber-100 text-sm sm:text-base leading-relaxed">
              विवाह, गृह प्रवेश, मुंडन, नामकरण, वाहन खरीदी एवं प्रॉपर्टी खरीदी के लिए 2026 से 2030 तक के सर्वश्रेष्ठ एवं शास्त्रसम्मत शुभ मुहूर्त, नक्षत्र, तिथि एवं समय की पूरी सूची।
            </p>

            {/* Quick Category Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-xs font-semibold">
                <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
                विवाह मुहूर्त
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-xs font-semibold">
                <Home className="w-3.5 h-3.5 text-emerald-300" />
                गृह प्रवेश
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-xs font-semibold">
                <Car className="w-3.5 h-3.5 text-blue-300" />
                वाहन खरीदी
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-xs font-semibold">
                <Baby className="w-3.5 h-3.5 text-purple-300" />
                मुंडन / नामकरण
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-amber-300" />
                प्रॉपर्टी खरीदी
              </span>
            </div>
          </div>
        </div>

        {/* Shubh Muhurat Search Component */}
        <ShubhMuhuratFinder />

        {/* SEO Information Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-200 dark:border-amber-900/40 shadow-lg space-y-6 text-slate-700 dark:text-slate-300">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-amber-50 font-serif border-b border-amber-200 dark:border-amber-900/40 pb-3">
            शुभ मुहूर्त का वैदिक शास्त्रीय महत्व
          </h2>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
            <p>
              सनातन धर्म में किसी भी नए या मंगल कार्य का शुभारंभ करने के लिए शुभ मुहूर्त का चयन अत्यंत आवश्यक माना गया है। ज्योतिषाचार्यों के अनुसार शुभ मुहूर्त में प्रारंभ किए गए कार्य बिना किसी विघ्न-बाधा के सफलता पूर्वक संपन्न होते हैं और शुभ फलों की प्राप्ति होती है।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/60 dark:border-amber-800/40 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-amber-100 text-sm">
                  1. नक्षत्र एवं तिथि शुद्धि
                </h3>
                <p className="text-xs">
                  शुभ कार्य हेतु रोहिणी, हस्त, अनुराधा, उत्तरा भाद्रपद, उत्तराषाढ़ा एवं पुष्य जैसे शुभ नक्षत्रों का चयन किया जाता है।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/60 dark:border-amber-800/40 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-amber-100 text-sm">
                  2. सर्वार्थ सिद्धि व अमृत सिद्धि योग
                </h3>
                <p className="text-xs">
                  इन सिद्ध योगों में किया गया कार्य अक्षया फलदायी होता है तथा हर कार्य में विजय एवं समृद्धि प्रदान करता है।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-slate-800/60 border border-amber-200/60 dark:border-amber-800/40 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-amber-100 text-sm">
                  3. व्यक्तिगत कुण्डली परामर्श
                </h3>
                <p className="text-xs">
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

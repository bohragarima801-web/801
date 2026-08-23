import { Sparkles, BadgeCheck, Heart, Mail, Phone, MapPin, Globe, Award, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600

export function generateMetadata() {
  return generatePageMeta({
    title: 'हमारे बारे में — प्रामाणिक वैदिक परंपरा',
    description: 'दिव्य यज्ञम के बारे में जानें। पं. मुकेश बोहरा (27+ वर्ष अनुभव) के मार्गदर्शन में सनातन धर्म के प्रामाणिक वैदिक पूजा, अनुष्ठान और ज्योतिष परामर्श।',
    path: '/about',
  })
}

export default async function AboutPage() {
  const setting = await prisma.websiteSetting.findUnique({
    where: { key: 'cms.about' }
  })
  const customContent = setting?.value || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        name: 'About DivyaYagyam',
        description: 'Preserving and promoting the sacred traditions of Sanatan Dharma with complete authenticity and devotion.',
        url: `${BASE_URL}/about`,
      },
      {
        '@type': 'Person',
        name: 'Pandit Mukesh Bohra',
        jobTitle: 'Vedic Priest & Astrologer',
        description: 'Vedic Priest & Astrologer with over 27 years of experience in conducting Sanatan Vedic rituals and ceremonies.',
        worksFor: {
          '@type': 'Organization',
          name: 'DivyaYagyam',
          url: BASE_URL,
        },
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'About', url: `${BASE_URL}/about` },
      ]),
    ],
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-about-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-14 md:py-20 overflow-hidden border-b border-[#E6D6BE]">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        <div className="container max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E6D6BE] shadow-2xs mb-4">
            <span className="text-[#E58A16] text-xs font-black uppercase tracking-wider">🙏 हमारी पावन परंपरा (OUR SACRED STORY)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-3">
            हमारे <span className="text-[#E58A16]">बारे में</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A403C] max-w-xl mx-auto font-medium leading-relaxed">
            27+ वर्षों की प्रामाणिक वैदिक परंपरा — मुख्य वेदाचार्य पं. मुकेश बोहरा जी के पावन मार्गदर्शन में।
          </p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto space-y-8 px-4 py-10 sm:py-14">
        
        {customContent ? (
          <div className="bg-white p-6 md:p-10 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-6 text-xs sm:text-sm text-[#4A403C] leading-relaxed prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} children={customContent as string} />
          </div>
        ) : (
          <>
            {/* Introduction Section */}
            <section className="bg-white p-6 sm:p-8 md:p-10 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#292321] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#E58A16]" /> दिव्ययज्ञम् में आपका स्वागत है
              </h2>
              <p className="text-[#4A403C] text-xs sm:text-sm leading-relaxed">
                दिव्ययज्ञम् सनातन धर्म की पवित्र वैदिक परंपराओं, अनुष्ठानों, महायज्ञों एवं ज्योतिषीय परामर्श को पूर्ण प्रामाणिकता व पारदर्शिता के साथ भक्तों तक पहुँचाने के लिए समर्पित एक पावन मंच है। हमारा ध्येय भारत एवं विश्वभर के श्रद्धालुओं को सिद्ध शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे जोड़ना है।
              </p>
            </section>

            {/* Pandit Mukesh Bohra Profile */}
            <section className="bg-white p-6 sm:p-8 md:p-10 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-4 flex flex-col items-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-4 border-[#C99A3D]/40 shadow-lg bg-[#F7EBD7]">
                    <img
                      src="/pandit_mukesh_bohra.jpg"
                      alt="पं. मुकेश बोहरा - मुख्य वेदाचार्य"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-3 text-[11px] font-bold text-[#6B2635] bg-[#F7EBD7] px-3 py-1 rounded-full border border-[#E6D6BE]">
                    ✓ माँ कात्यायनी शक्ति पीठ पीठाधीश्वर
                  </span>
                </div>

                <div className="md:col-span-8 space-y-3">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-bold text-[#E58A16] tracking-wider">हमारे आध्यात्मिक मार्गदर्शक</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#292321]">पं. मुकेश बोहरा जी</h2>
                    <p className="text-xs sm:text-sm text-[#665E58] font-bold">मुख्य वेदाचार्य एवं कर्मकांड विशेषज्ञ • 27+ वर्ष अनुभव (1997 से)</p>
                  </div>

                  <p className="text-[#4A403C] text-xs sm:text-sm leading-relaxed">
                    <strong>पं. मुकेश बोहरा जी</strong> सनातन वैदिक कर्मकांड एवं धार्मिक अनुष्ठानों के क्षेत्र में <strong>1997 से (27 से अधिक वर्षों के अनुभव)</strong> से समृद्ध प्रतिष्ठित आचार्य हैं। उन्होंने तीन दशकों में हजारों यजमानों के लिए वेदोक्त विधि-विधान, संस्कृत मंत्रोच्चार एवं सिद्ध पीठों में महा अनुष्ठानों का संचालन किया है।
                  </p>

                  <p className="text-[#4A403C] text-xs sm:text-sm leading-relaxed">
                    "हमारा उद्देश्य किसी बड़े कॉरपोरेट या अनाम प्लेटफॉर्म की तरह काम करना नहीं, बल्कि हर यजमान को सीधा और प्रामाणिक आध्यात्मिक सान्निध्य देना है।"
                  </p>
                </div>
              </div>

              <div className="border-t border-[#E6D6BE] pt-4 space-y-3">
                <h3 className="font-bold text-[#292321] text-sm">मुख्य धार्मिक सेवाएं एवं महा अनुष्ठान:</h3>
                <div className="grid gap-2 sm:grid-cols-2 text-xs text-[#4A403C]">
                  {[
                    'वैदिक महायज्ञ एवं सर्व कार्य सिद्धि हवन', 'कालसर्प व नवग्रह दोष निवारण शांति',
                    'महामृत्युंजय सवा लाख अखंड जाप', 'रुद्राभिषेक एवं महारुद्र अनुष्ठान',
                    'माँ बगलामुखी मिर्ची हवन एवं विशेष विघ्न शांति', 'वास्तु शांति एवं पितृ दोष निवारण'
                  ].map((service) => (
                    <div key={service} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Values / Mission */}
            <section className="bg-white p-6 sm:p-8 md:p-10 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#292321] flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#E58A16]" /> हमारे चार आधार स्तंभ
              </h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-2xl bg-[#FFF9EF] border border-[#E6D6BE] space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[#292321]">1. 100% शास्त्रीय प्रामाणिकता</h4>
                  <p className="text-[11px] text-[#4A403C] leading-relaxed">केवल योग्य, संस्कृत पाठशाला शिक्षित विद्वान आचार्यों द्वारा ही पूजा संपन्न।</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF9EF] border border-[#E6D6BE] space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[#292321]">2. व्यक्तिगत नाम-गोत्र संकल्प</h4>
                  <p className="text-[11px] text-[#4A403C] leading-relaxed">प्रत्येक यजमान के नाम, गोत्र व मनोकामना का स्पष्ट वेदोक्त संकल्प।</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF9EF] border border-[#E6D6BE] space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[#292321]">3. व्हाट्सएप वीडियो प्रमाण</h4>
                  <p className="text-[11px] text-[#4A403C] leading-relaxed">पूजा संपन्न होने के उपरांत संकल्प व आहुति का वीडियो सीधे आपके फोन पर।</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FFF9EF] border border-[#E6D6BE] space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-[#292321]">4. अभिमंत्रित पावन प्रसाद</h4>
                  <p className="text-[11px] text-[#4A403C] leading-relaxed">सिद्ध भस्म, रक्षासूत्र एवं प्रसाद की सुरक्षित घर डिलीवरी।</p>
                </div>
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  )
}

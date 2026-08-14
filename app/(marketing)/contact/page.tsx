import Script from 'next/script'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600

export function generateMetadata() {
  return generatePageMeta({
    title: 'संपर्क केंद्र — मार्गदर्शन एवं सहायता',
    description: 'DivyaYagyam संपर्क केंद्र। ऑनलाइन पूजा बुकिंग, नाम-गोत्र संकल्प या ज्योतिष परामर्श हेतु संपर्क करें। WhatsApp: +91-95304-01984, Email: Seva@divyayagyam.com.',
    path: '/contact',
  })
}

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: 'Contact DivyaYagyam',
        description: 'Get in touch with DivyaYagyam for online puja booking, spiritual guidance, and support.',
        url: `${BASE_URL}/contact`,
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Contact Us', url: `${BASE_URL}/contact` },
      ]),
    ],
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-contact-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-14 md:py-20 overflow-hidden border-b border-[#E6D6BE]">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        <div className="container max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E6D6BE] shadow-2xs mb-4">
            <span className="text-[#E58A16] text-xs font-black uppercase tracking-wider">📞 सेवा एवं सहायता केंद्र (SUPPORT DESK)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-3">
            दिव्ययज्ञम् से <span className="text-[#E58A16]">संपर्क करें</span>
          </h1>
          <p className="text-sm sm:text-base text-[#4A403C] max-w-xl mx-auto font-medium leading-relaxed">
            ऑनलाइन पूजा बुकिंग, नाम-गोत्र संकल्प, प्रसाद डिलीवरी अथवा ज्योतिष परामर्श हेतु हमारे आचार्य दल से सीधे संपर्क करें।
          </p>
        </div>
      </section>

      <div className="container max-w-4xl mx-auto space-y-8 px-4 py-10 sm:py-14">
        
        {/* Main Contact Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Direct Contact Channels */}
          <div className="bg-white p-6 sm:p-8 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-5">
            <h2 className="text-lg sm:text-xl font-bold text-[#292321] flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#E58A16]" /> सीधे संपर्क माध्यम
            </h2>
            
            <div className="space-y-4 text-xs sm:text-sm text-[#4A403C]">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#E58A16] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#292321]">व्हाट्सएप एवं हेल्पलाइन नंबर</p>
                  <p className="text-[11px] text-[#665E58]">पूजा वीडियो अपडेट एवं तुरंत बुकिंग सहायता हेतु:</p>
                  <a href="https://wa.me/919530401984" target="_blank" rel="noopener noreferrer" className="font-black text-[#E58A16] hover:underline mt-0.5 inline-block text-sm">
                    +91-95304-01984
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-[#E58A16] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#292321]">आधिकारिक सेवा ईमेल</p>
                  <p className="text-[11px] text-[#665E58]">सामान्य पूछताछ, रसीद पुष्टि एवं प्रतिक्रिया हेतु:</p>
                  <a href="mailto:Seva@divyayagyam.com" className="font-black text-[#E58A16] hover:underline mt-0.5 inline-block text-sm">
                    Seva@divyayagyam.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#E58A16] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#292321]">सेवा समय (Operating Hours)</p>
                  <p className="text-[11px] text-[#665E58]">सोमवार से रविवार: प्रातः 7:00 बजे से रात्रि 9:00 बजे तक</p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-0.5">पूजा दिवस पर व्हाट्सएप लाइव सेवा 24/7 सक्रिय रहती है।</p>
                </div>
              </div>
            </div>
          </div>

          {/* Spiritual Guidance & Office */}
          <div className="bg-white p-6 sm:p-8 border border-[#E6D6BE] rounded-3xl shadow-2xs space-y-5">
            <h2 className="text-lg sm:text-xl font-bold text-[#292321] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#E58A16]" /> मुख्य कार्यालय एवं धाम
            </h2>
            
            <div className="space-y-4 text-xs sm:text-sm text-[#4A403C]">
              <div>
                <p className="font-bold text-[#292321]">पंजीकृत कार्यालय पता:</p>
                <p className="text-[#4A403C] mt-0.5">जोधपुर, राजस्थान, भारत (342001)</p>
                <p className="text-[11px] text-[#665E58] mt-1">
                  दिव्ययज्ञम् सीधे काशी (वाराणसी), उज्जैन, दतिया, सोमनाथ, हरिद्वार एवं कामाख्या के सिद्ध मंदिरों से अनुष्ठान संचालित करता है।
                </p>
              </div>

              <div className="border-t border-[#E6D6BE] pt-3 space-y-1.5">
                <p className="font-bold text-[#292321] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#E58A16]" /> मुख्य आचार्य मार्गदर्शन
                </p>
                <p className="text-[11px] text-[#4A403C] leading-relaxed">
                  <strong>पं. मुकेश बोहरा जी</strong> (27+ वर्ष वैदिक अनुभव) के मार्गदर्शन में सभी संकल्प एवं संस्कृत मंत्रोच्चार वेदोक्त विधि से सम्पादित किए जाते हैं।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Fast CTA Box */}
        <div className="p-6 rounded-3xl bg-white border border-[#E6D6BE] text-center space-y-3 shadow-2xs">
          <h3 className="text-lg sm:text-xl font-bold text-[#292321]">
            सीधे व्हाट्सएप पर बात करें
          </h3>
          <p className="text-xs text-[#4A403C] max-w-md mx-auto">
            किसी भी विशेष पूजा, मुहूर्त परामर्श या सामग्री की जानकारी हेतु मुख्य आचार्य से 1-on-1 चैट करें।
          </p>
          <div>
            <a
              href="https://wa.me/919530401984?text=Namaste!%20I%20have%20a%20question%20about%20DivyaYagyam%20Puja"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <span>💬 व्हाट्सएप पर संदेश भेजें ➔</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}

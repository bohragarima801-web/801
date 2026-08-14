import Link from 'next/link'
import Script from 'next/script'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'
import { Sparkles, Star, Compass, Moon, Sun, ShieldCheck, Phone, CheckCircle2, ArrowRight, BookOpen, Clock, HeartHandshake } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function generateMetadata() {
  return generatePageMeta({
    title: 'वैदिक ज्योतिष परामर्श (Vedic Astrology) — कुण्डली फलादेश',
    description: 'विद्वान आचार्यों द्वारा प्रामाणिक वैदिक ज्योतिष परामर्श। सम्पूर्ण जन्म कुण्डली विश्लेषण, सटीक ग्रह दशा फलादेश, गुण मिलान, एवं वैदिक उपाय।',
    path: '/astro',
  })
}

export const revalidate = 3600

export default function AstroPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Vedic Astrology Consultation & Kundali Analysis',
        description: 'Authentic Vedic astrology consultation, horoscope reading, and planetary remedy solutions by senior Sanskrit scholars.',
        url: `${BASE_URL}/astro`,
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Astrology', url: `${BASE_URL}/astro` },
      ]),
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'वैदिक ज्योतिष परामर्श कैसे प्राप्त करें?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'आप अपनी जन्म तिथि, समय एवं जन्म स्थान प्रदान करके हमारे वरिष्ठ आचार्यों से सीधे व्हाट्सएप या फोन कॉल पर व्यक्तिगत कुण्डली परामर्श प्राप्त कर सकते हैं।'
            }
          },
          {
            '@type': 'Question',
            name: 'कुण्डली मिलान और गुण मिलान में क्या अंतर है?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'अष्टकूट गुण मिलान (36 गुण) के साथ-साथ ग्रहों की स्थिति, मांगलिक दोष, नाड़ी दोष और सप्तम भाव का सूक्ष्म विश्लेषण ही प्रामाणिक वैदिक मिलान कहलाता है।'
            }
          }
        ]
      }
    ],
  }

  return (
    <div className="bg-[#FFF9EF] text-[#292321] min-h-screen notranslate" translate="no">
      <Script
        id="schema-astro-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-b from-[#FFF9EF] via-[#F7EBD7]/60 to-[#FFF9EF] py-14 md:py-20 overflow-hidden border-b border-[#E6D6BE]">
        <div aria-hidden="true" className="absolute right-0 top-0 text-[28vw] font-serif text-[#C99A3D]/5 leading-none pointer-events-none select-none overflow-hidden">ॐ</div>
        
        <div className="container max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E6D6BE] shadow-2xs mb-4">
            <Sparkles className="h-4 w-4 text-[#E58A16]" />
            <span className="text-[#E58A16] text-xs font-black uppercase tracking-wider">प्रामाणिक वैदिक ज्योतिष परामर्श एवं मार्गदर्शन</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#292321] leading-tight mb-4">
            वैदिक ज्योतिष एवं <span className="text-[#E58A16]">कुण्डली फलादेश</span>
          </h1>

          <p className="text-sm sm:text-base text-[#4A403C] max-w-2xl mx-auto font-medium leading-relaxed">
            27+ वर्षों के अनुभव से युक्त पराशर एवं जैमिनी पद्धति पर आधारित सटीक जन्मपत्रिका विश्लेषण, ग्रह दोष निवारण, विवाह गुण मिलान एवं वैदिक उपाय।
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button asChild className="bg-[#E58A16] hover:bg-[#c9740e] text-white font-bold h-11 px-6 rounded-xl shadow-md">
              <a href="https://wa.me/919530401984?text=Namaste!%20I%20want%20astrology%20consultation" target="_blank" rel="noopener noreferrer">
                <Phone className="mr-2 h-4 w-4" /> आचार्य जी से बात करें
              </a>
            </Button>
            <Button asChild variant="outline" className="border-[#C99A3D] text-[#292321] hover:bg-[#FFF9EF] font-bold h-11 px-6 rounded-xl">
              <Link href="/tools">
                <Compass className="mr-2 h-4 w-4 text-[#E58A16]" /> मुफ्त कुण्डली टूल्स देखें
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <div className="container max-w-5xl mx-auto py-12 px-4 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#292321]">
            प्रमुख ज्योतिषीय सेवाएं (Astrology Services)
          </h2>
          <p className="text-xs sm:text-sm text-[#544C47] max-w-xl mx-auto">
            व्यक्तिगत जीवन, करियर, व्यापार, स्वास्थ्य एवं वैवाहिक सुख हेतु वेदोक्त समाधान।
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Star className="h-6 w-6 text-[#E58A16]" />,
              title: 'सम्पूर्ण जन्म कुण्डली विश्लेषण',
              desc: 'लग्न कुण्डली, नवमांश, महादशा, अंतर्दशा एवं गोचर ग्रहों का विस्तृत विवेचन। शुभ-अशुभ कालखंड की सटीक गणना।'
            },
            {
              icon: <HeartHandshake className="h-6 w-6 text-[#E58A16]" />,
              title: 'विवाह गुण मिलान व कुण्डली मिलान',
              desc: 'अष्टकूट 36 गुण मिलान, मांगलिक दोष विचार, नाड़ी दोष निवारण एवं वैवाहिक सामंजस्य का गहरा शास्त्रीय अध्ययन।'
            },
            {
              icon: <Moon className="h-6 w-6 text-[#E58A16]" />,
              title: 'कालसर्प एवं पितृ दोष निवारण',
              desc: 'राहु-केतु जनित कालसर्प दोष, ग्रहण योग, पितृ ऋण व शनि साढ़ेसाती की पहचान एवं शास्त्रसम्मत शांति उपाय।'
            },
            {
              icon: <Sun className="h-6 w-6 text-[#E58A16]" />,
              title: 'करियर, व्यापार व धन लाभ मार्गदर्शन',
              desc: 'दशम भाव एवं एकादश भाव का विश्लेषण, व्यवसाय चयन, पदोन्नति के योग एवं धन वृद्धि हेतु सटीक रत्न व रुद्राक्ष परामर्श।'
            },
            {
              icon: <Compass className="h-6 w-6 text-[#E58A16]" />,
              title: 'शुभ मुहूर्त एवं गृह प्रवेश विचार',
              desc: 'विवाह, नवीन व्यापार आरंभ, भूमि पूजन, गृह प्रवेश, वाहन क्रय एवं नामकरण संस्कार हेतु सर्वोत्कृष्ट मुहूर्त निर्धारण।'
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-[#E58A16]" />,
              title: 'वैदिक शांति पूजा एवं अनुष्ठान',
              desc: 'पीड़ित ग्रहों की शांति हेतु महामृत्युंजय जाप, नवग्रह हवन, बगलामुखी अनुष्ठान एवं सिद्ध मंत्र जाप संकल्प।'
            }
          ].map((srv, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#EADBC8] shadow-xs space-y-3 hover:shadow-md transition-all">
              <div className="h-12 w-12 rounded-xl bg-[#FFF3E0] border border-[#E58A16]/30 flex items-center justify-center">
                {srv.icon}
              </div>
              <h3 className="text-base font-bold text-[#1F1A18]">{srv.title}</h3>
              <p className="text-xs text-[#544C47] leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>

        {/* ── Informational Guide ── */}
        <div className="bg-white p-6 sm:p-10 border border-[#EADBC8] rounded-3xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1A18]">
            वैदिक ज्योतिष का महत्व एवं सिद्धांत
          </h2>
          <p className="text-xs sm:text-sm text-[#2D2523] leading-relaxed">
            सनातन वैदिक परंपरा में ज्योतिष शास्त्र को 'वेदों का नेत्र' (Eye of Vedas) कहा गया है। यह केवल भविष्य कथन नहीं, बल्कि कर्म सिद्धांत, ब्रह्मांडीय ऊर्जा और व्यक्ति के प्रारब्ध का आध्यात्मिक विज्ञान है। प्रत्येक जातक का जन्म काल, अक्षांश और देशांतर उसके जीवन चक्र की रूपरेखा तय करते हैं।
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="p-4 rounded-xl bg-[#FFFBF7] border border-[#EADBC8] space-y-1.5">
              <h4 className="text-sm font-bold text-[#1F1A18] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#E58A16]" /> पारदर्शी एवं निःस्वार्थ परामर्श
              </h4>
              <p className="text-xs text-[#544C47] leading-relaxed">
                हम अंधविश्वास अथवा अनावश्यक भय दिखाए बिना केवल शास्त्रीय ग्रन्थों (बृहत्पाराशर होराशास्त्र, फलदीपिका) के आधार पर मार्गदर्शन करते हैं।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFBF7] border border-[#EADBC8] space-y-1.5">
              <h4 className="text-sm font-bold text-[#1F1A18] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#E58A16]" /> सात्विक एवं सरल वैदिक उपाय
              </h4>
              <p className="text-xs text-[#544C47] leading-relaxed">
                जप, दान, स्तोत्र पाठ, व्रत, अभिमंत्रित रुद्राक्ष धारण और वैदिक पूजा द्वारा ग्रहों की अनुकूलता प्राप्त करने का मार्ग प्रशस्त किया जाता है।
              </p>
            </div>
          </div>
        </div>

        {/* ── FAQs ── */}
        <div className="bg-white p-6 sm:p-8 border border-[#EADBC8] rounded-3xl space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#1F1A18] flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#E58A16]" /> अक्सर पूछे जाने वाले प्रश्न (FAQ)
          </h2>
          
          <div className="space-y-3 pt-2 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[#FFFBF7] border border-[#EADBC8] space-y-1">
              <p className="font-bold text-[#1F1A18]">प्र. ज्योतिष परामर्श के लिए मुझे क्या जानकारी देनी होगी?</p>
              <p className="text-[#544C47] leading-relaxed">उ. आपको अपना पूरा नाम, जन्म तिथि (Date of Birth), जन्म का सटीक समय (Time of Birth) एवं जन्म स्थान (City/State) देना आवश्यक है।</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFBF7] border border-[#EADBC8] space-y-1">
              <p className="font-bold text-[#1F1A18]">प्र. यदि मेरे पास जन्म का सटीक समय न हो तो क्या करें?</p>
              <p className="text-[#544C47] leading-relaxed">उ. ऐसी स्थिति में हमारे विद्वान आचार्य प्रश्न कुण्डली (Prashna Kundali) एवं हस्तरेखा विश्लेषण द्वारा समस्या का समाधान सुझाते हैं।</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

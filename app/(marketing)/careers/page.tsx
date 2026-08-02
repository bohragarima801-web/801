import Script from 'next/script'
import Link from 'next/link'
import { Briefcase, Heart, Sparkles, CheckCircle2, Mail, Users } from 'lucide-react'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600 // ISR: Revalidate every 3600s

export function generateMetadata() {
  return generatePageMeta({
    title: 'करियर (Careers) — Join Our Sanatan Seva Mission',
    description: 'DivyaYagyam में करियर के अवसर। सनातन वैदिक संस्कृति के प्रसार और तकनीकी विकास हेतु हमारी टीम से जुड़ें।',
    path: '/careers',
  })
}

export default function CareersPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Careers at DivyaYagyam',
        description: 'Join our team dedicated to serving devotees worldwide with authentic Vedic rituals.',
        url: `${BASE_URL}/careers`,
      },
      generateBreadcrumbSchema([
        { name: 'Home', url: BASE_URL },
        { name: 'Careers', url: `${BASE_URL}/careers` },
      ]),
    ],
  }

  return (
    <>
      <Script
        id="schema-careers-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50/50 min-h-screen py-12">
        <div className="container max-w-4xl mx-auto space-y-10 px-4">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--primary-color)]">💼 Join Our Team</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800">Careers at DivyaYagyam</h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We are on a mission to bring authentic Vedic pujas, sacred temple rituals, and spiritual guidance into the digital era with full transparency and devotion. Join a team passionate about Sanatan Dharma and modern technology.
            </p>
          </div>

          {/* Company Culture & Mission */}
          <div className="bg-white p-6 md:p-10 border rounded-3xl shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Heart className="h-6 w-6 text-[var(--primary-color)]" /> Why Work With Us?
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At DivyaYagyam, we blend ancient Vedic heritage with cutting-edge digital platforms. Working with us means contributing directly to preserving cultural traditions, supporting temple communities across India, and ensuring thousands of devotee families receive divine blessings seamlessly.
            </p>
            
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {[
                { title: 'Meaningful Work', desc: 'Serve millions of devotees and preserve sacred Sanatan rituals with authenticity.' },
                { title: 'Growth & Learning', desc: 'Collaborate with experienced Vedic scholars, tech leaders, and creative thinkers.' },
                { title: 'Flexible Environment', desc: 'Remote and hybrid opportunities with supportive culture and team values.' },
                { title: 'Transparent Service', desc: 'Be part of an ethical platform dedicated to genuine devotion and customer trust.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border space-y-1">
                  <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--primary-color)]" /> {item.title}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Open Roles */}
          <div className="bg-white p-6 md:p-10 border rounded-3xl shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-[var(--primary-color)]" /> Current Openings
            </h2>

            <div className="space-y-4">
              <div className="p-5 border rounded-2xl bg-slate-50/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-800 text-base">Verified Vedic Acharya / Pandit</h3>
                  <span className="text-xs font-semibold bg-orange-100 text-orange-800 px-3 py-1 rounded-full">Varanasi / Ujjain / Remote</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We invite knowledgeable Sanskrit acharyas with experience in conducting Rudrabhishek, Mahamrityunjay Jaap, and Grah Shanti pujas according to traditional Vedic karmakand.
                </p>
              </div>

              <div className="p-5 border rounded-2xl bg-slate-50/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-800 text-base">Devotee Support Specialist (WhatsApp / Call)</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Full Time / Remote</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Help devotees submit Gotra details, track prasad shipping, and receive video proof updates with empathy and clear communication in Hindi and English.
                </p>
              </div>

              <div className="p-5 border rounded-2xl bg-slate-50/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-800 text-base">Sanatan Content & Media Specialist</h3>
                  <span className="text-xs font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">Full Time / Remote</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Create respectful educational content about temple histories, festival muhurats, and Vedic astrology for our blog and social channels.
                </p>
              </div>
            </div>
          </div>

          {/* How to Apply */}
          <div className="bg-white p-6 md:p-8 border rounded-3xl shadow-sm text-center space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-[var(--primary-color)]" /> Apply Now
            </h2>
            <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              If you are passionate about serving in Sanatan Dharma, send your resume and brief introduction to{' '}
              <a href="mailto:Seva@divyayagyam.com" className="font-bold text-[var(--primary-color)] hover:underline">
                Seva@divyayagyam.com
              </a>{' '}
              with the subject line "Career Application — [Your Preferred Role]".
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

import Script from 'next/script'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react'
import { generatePageMeta, generateBreadcrumbSchema, BASE_URL } from '@/lib/seo'

export const revalidate = 3600 // ISR: Revalidate every 3600s

export function generateMetadata() {
  return generatePageMeta({
    title: 'Contact Us – Guidance & Support Desk | DivyaYagyam',
    description: 'DivyaYagyam संपर्क केंद्र। ऑनलाइन पूजा बुकिंग, नाम-गोत्र संकल्प या ज्योतिष परामर्श हेतु संपर्क करें। WhatsApp: +91-95871-71984, Email: Seva@divyayagyam.com.',
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
    <>
      <Script
        id="schema-contact-page"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-slate-50/50 min-h-screen py-12">
        <div className="container max-w-4xl mx-auto space-y-10 px-4">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-wider font-bold text-[var(--primary-color)]">📞 Support Center</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800">Get in Touch with DivyaYagyam</h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We are dedicated to guiding your spiritual journey. Whether you have questions about online puja bookings, custom Sankalp rituals, prasad delivery, or astrological consultations, our team is here to assist you with complete devotion and transparency.
            </p>
          </div>

          {/* Main Contact Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Direct Contact Channels */}
            <div className="bg-white p-6 md:p-8 border rounded-3xl shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[var(--primary-color)]" /> Direct Channels
              </h2>
              
              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">WhatsApp & Phone Support</p>
                    <p className="text-xs text-slate-500">Fastest response for puja video updates and booking assistance.</p>
                    <p className="font-medium text-slate-700 mt-1">+91-95871-71984, +91-95304-01984</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Official Seva Email</p>
                    <p className="text-xs text-slate-500">For general inquiries, receipt confirmation, and feedback.</p>
                    <a href="mailto:Seva@divyayagyam.com" className="font-medium text-[var(--primary-color)] hover:underline mt-1 inline-block">
                      Seva@divyayagyam.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[var(--primary-color)] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Operational Hours</p>
                    <p className="text-xs text-slate-500">Monday to Sunday: 7:00 AM – 9:00 PM IST</p>
                    <p className="text-xs text-slate-500">Puja resolution & WhatsApp updates available 24/7 on ritual dates.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office & Spiritual Guidance */}
            <div className="bg-white p-6 md:p-8 border rounded-3xl shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--primary-color)]" /> Spiritual Headquarters
              </h2>
              
              <div className="space-y-4 text-sm text-slate-600">
                <div>
                  <p className="font-bold text-slate-800">Head Office Location</p>
                  <p className="text-slate-600 mt-1">Jodhpur, Rajasthan, India</p>
                  <p className="text-xs text-slate-500 mt-1">
                    DivyaYagyam operates directly with verified priests across sacred temple hubs including Varanasi (Kashi), Ujjain, Somnath, and Haridwar.
                  </p>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-[var(--primary-color)]" /> Spiritual Guidance & Pandit Support
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Under the sacred guidance of <strong>Pandit Mukesh Bohra</strong> (35+ years of Vedic experience), our learned acharyas verify every Sankalp and ensure pure Sanskrit recitations for your ceremony.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Guidance & FAQ Banner */}
          <div className="bg-white p-6 md:p-8 border rounded-3xl shadow-sm text-slate-700 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[var(--primary-color)]" /> Frequently Asked Inquiries
            </h2>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600">
              Need immediate answers regarding how video proof is recorded, when sacred prasad will be shipped, or how to submit your Gotra? You can also browse our detailed <Link href="/faq" className="text-[var(--primary-color)] font-bold hover:underline">FAQ section</Link> or submit a support ticket via our <Link href="/support" className="text-[var(--primary-color)] font-bold hover:underline">Support Desk</Link>.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}

import Link from 'next/link'
import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { Button } from '@/components/ui/button'
import { Home, Sparkles, Flame, ShoppingBag, Calendar, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Page Not Found (404) | DivyaYagyam',
  description: 'The requested page is no longer available. Explore authentic Vedic pujas, sacred store, and daily panchang at DivyaYagyam.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9EF] text-[#292321]">
      <Navbar user={null} />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto py-16">
        <div className="w-full space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-100 border border-orange-200 text-[#E58A16] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> 404 — Page Moved or Unavailable
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#292321] tracking-tight">
            Looking for a Sacred Ritual or Product?
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto font-medium leading-relaxed">
            The page you requested may have been relocated, concluded, or updated. Please choose one of our active services below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
            <Link
              href="/pujas"
              className="p-3.5 rounded-2xl bg-white border border-[#E6D6BE] hover:border-[#E58A16] shadow-2xs hover:shadow-md transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#F7EBD7] text-[#E58A16] flex items-center justify-center font-bold">
                  <Flame className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#292321] group-hover:text-[#E58A16] transition-colors">
                    Online Vedic Pujas
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Browse 100+ rituals</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#E58A16] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/products"
              className="p-3.5 rounded-2xl bg-white border border-[#E6D6BE] hover:border-[#E58A16] shadow-2xs hover:shadow-md transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#F7EBD7] text-[#E58A16] flex items-center justify-center font-bold">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#292321] group-hover:text-[#E58A16] transition-colors">
                    Sacred Store
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Energized Rudraksha & Kits</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#E58A16] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/panchang"
              className="p-3.5 rounded-2xl bg-white border border-[#E6D6BE] hover:border-[#E58A16] shadow-2xs hover:shadow-md transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#F7EBD7] text-[#E58A16] flex items-center justify-center font-bold">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#292321] group-hover:text-[#E58A16] transition-colors">
                    Daily Panchang
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Tithi, Muhurat & Choghadiya</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#E58A16] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/ask-a-pandit"
              className="p-3.5 rounded-2xl bg-white border border-[#E6D6BE] hover:border-[#E58A16] shadow-2xs hover:shadow-md transition-all flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#F7EBD7] text-[#E58A16] flex items-center justify-center font-bold">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#292321] group-hover:text-[#E58A16] transition-colors">
                    AI Pandit Ji
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">Free Vedic AI Consultation</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-[#E58A16] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="pt-4">
            <Button asChild className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#E58A16] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Return to Homepage
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


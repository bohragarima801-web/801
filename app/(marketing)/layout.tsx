import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { MobileBottomNav } from '@/components/layouts/mobile-bottom-nav'
import { PwaInstallBanner } from '@/components/pwa-install-banner'
import { GargiChatbot } from '@/components/gargi-chatbot'
import { ScrollReveal } from '@/components/scroll-reveal'
import prisma from '@/lib/prisma'
import { getDynamicSiteConfig, getSetting } from '@/lib/settings'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const siteData = await getDynamicSiteConfig()
  const mapSetting = await prisma.websiteSetting.findFirst({
    where: { key: 'contact.google_map_url' }
  }).catch(() => null)

  const mapUrl = (mapSetting?.value as string) || ''

  const activeCoupon = await prisma.coupon.findFirst({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  }).catch(() => null)

  const maintenanceMode = await getSetting('maintenance.enabled')
  const maintenanceMsg = await getSetting('maintenance.message') || 'We’ll be back soon…'
  const isMaintenance = maintenanceMode === 'true'

  if (isMaintenance) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-orange-50/80 p-4 text-center w-full">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md border border-orange-100">
          <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">ॐ</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">We'll be right back!</h1>
          <p className="text-slate-600">{maintenanceMsg}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <PwaInstallBanner />
      {activeCoupon && (
        <div className="bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white py-2 px-4 text-center text-xs md:text-sm font-semibold flex flex-wrap justify-center items-center gap-1.5 shadow-md relative z-50 border-b border-orange-600">
          <span className="animate-pulse mr-1">⚡</span>
          <span>
            Special Offer: Use code{' '}
            <span className="bg-white/20 text-white border border-white/30 px-2 py-0.5 rounded-md tracking-wider mx-1 font-extrabold inline-block text-xs">
              {activeCoupon.code}
            </span>{' '}
            for {activeCoupon.discountType === 'PERCENTAGE' ? `${activeCoupon.discountValue}% OFF` : `₹${activeCoupon.discountValue} OFF`}!
          </span>
          {activeCoupon.description && <span className="hidden md:inline font-normal opacity-90"> — {activeCoupon.description}</span>}
        </div>
      )}
      <Navbar siteData={siteData} />
      <ScrollReveal />
      <main className="flex-1">{children}</main>
      <GargiChatbot />
      <Footer mapUrl={mapUrl} siteData={siteData} />
      <MobileBottomNav />
    </div>
  )
}


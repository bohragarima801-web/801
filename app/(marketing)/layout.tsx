import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { MobileBottomNav } from '@/components/layouts/mobile-bottom-nav'
import { PwaInstallBanner } from '@/components/pwa-install-banner'
import { GargiChatbot } from '@/components/gargi-chatbot'
import { ScrollReveal } from '@/components/scroll-reveal'
import prisma from '@/lib/prisma'
import { getDynamicSiteConfig, getSetting } from '@/lib/settings'

export const revalidate = 3600 // ISR: Cache marketing shell at Edge CDN

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
        <div className="bg-gradient-to-r from-[#8B1A21] via-[#B84430] to-[#8B1A21] text-amber-100 py-1.5 px-3 text-center text-xs font-medium flex flex-wrap justify-center items-center gap-2 shadow-sm relative z-50 border-b border-[#FFD700]/30">
          <span className="animate-pulse text-[#FFD700]">⚡</span>
          <span>
            विशेष ऑफर: Use code{' '}
            <span className="bg-black/25 text-[#FFD700] border border-[#FFD700]/40 px-2 py-0.5 rounded-full font-bold tracking-wider mx-1 inline-block text-[11px]">
              {activeCoupon.code}
            </span>{' '}
            for <strong className="text-white font-extrabold">{activeCoupon.discountType === 'PERCENTAGE' ? `${activeCoupon.discountValue}% OFF` : `₹${activeCoupon.discountValue} OFF`}</strong>!
          </span>
          {activeCoupon.description && <span className="hidden md:inline font-normal opacity-85 text-[11px]"> — {activeCoupon.description}</span>}
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


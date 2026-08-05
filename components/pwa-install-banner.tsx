'use client'

import { useEffect, useState } from 'react'
import { Download, X, Smartphone, Sparkles, Share } from 'lucide-react'

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [showIosTip, setShowIosTip] = useState(false)

  useEffect(() => {
    // Check if already dismissed in this session
    const isDismissed = sessionStorage.getItem('dy_pwa_dismissed')
    if (isDismissed) return

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase()
    const isIosDevice = /iphone|ipad|ipod/.test(ua)
    setIsIos(isIosDevice)

    // Check if running in standalone mode (already installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
    if (isStandalone) return

    // Listen for beforeinstallprompt event (Android / Chrome / Edge / Brave)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    const handleAppInstalled = () => {
      setShowBanner(false)
      setDeferredPrompt(null)
      sessionStorage.setItem('dy_pwa_dismissed', 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // For iOS Safari or Android browsers where prompt fires early
    if (isIosDevice && !isStandalone) {
      setShowBanner(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])


  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosTip(true)
      return
    }

    if (!deferredPrompt) {
      // Fallback: If prompt not captured, show tip
      alert('ऐप इंस्टॉल करने के लिए अपने ब्राउज़र मेनू (3 डॉट्स) में "Add to Home Screen" या "Install App" चुनें।')
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    setShowIosTip(false)
    sessionStorage.setItem('dy_pwa_dismissed', 'true')
  }

  if (!showBanner) return null

  return (
    <>
      {/* Smart Top Install Banner */}
      <div className="relative z-[60] bg-gradient-to-r from-amber-950 via-orange-900 to-amber-900 text-white border-b border-amber-500/40 px-3 py-2.5 shadow-xl transition-all duration-500">
        <div className="container max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* App Icon + Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-white p-0.5 shadow-md shrink-0 flex items-center justify-center overflow-hidden border border-amber-400/50">
              <img src="/logo.jpg" alt="DivyaYagyam Logo" className="h-full w-full object-contain rounded-lg" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs sm:text-sm leading-tight text-amber-300 truncate">
                  DivyaYagyam App
                </h4>
                <span className="bg-amber-400/20 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                  FREE
                </span>
              </div>
              <p className="text-[11px] text-amber-100/90 truncate leading-tight mt-0.5">
                तेज़ एवं आसान अनुभव के लिए ऐप इंस्टॉल करें
              </p>
            </div>
          </div>

          {/* Action Button & Close */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 active:scale-95 transition-all duration-300 border border-amber-300/50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>इंस्टॉल करें</span>
            </button>

            <button
              onClick={handleDismiss}
              className="text-amber-200/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Safari Tip Popup */}
      {showIosTip && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 text-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-base text-amber-300">iPhone में ऐप इंस्टॉल करें</h3>
              </div>
              <button onClick={() => setShowIosTip(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <ol className="space-y-3 text-xs text-slate-200 list-decimal pl-4 leading-relaxed font-medium">
              <li>सफारी (Safari) में सबसे नीचे <Share className="inline h-4 w-4 text-blue-400 mx-1" /> <strong>Share</strong> बटन पर क्लिक करें।</li>
              <li>नीचे स्क्रॉल करें और <strong>"Add to Home Screen"</strong> (होम स्क्रीन में जोड़ें) चुनें।</li>
              <li>ऊपर <strong>"Add"</strong> पर क्लिक करें। अब DivyaYagyam आपके मोबाइल में ऐप बन जाएगी!</li>
            </ol>

            <button
              onClick={() => setShowIosTip(false)}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition-colors"
            >
              समझ गया (Got It)
            </button>
          </div>
        </div>
      )}
    </>
  )
}

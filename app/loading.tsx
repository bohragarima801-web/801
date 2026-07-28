export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/80 via-background to-background relative overflow-hidden">
      {/* Background Divine Rays Aura */}
      <div className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-amber-400/20 via-orange-500/20 to-red-500/20 blur-3xl animate-pulse pointer-events-none" />

      <div className="relative flex flex-col items-center gap-6 z-10">
        {/* Glowing Sacred Om Badge */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-24 w-24 rounded-full bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 animate-spin blur-md opacity-75" style={{ animationDuration: '4s' }} />
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-red-600 flex items-center justify-center text-white shadow-2xl shadow-orange-500/40 relative z-10 border border-amber-300/40">
            <span className="text-4xl font-black drop-shadow-md" style={{ fontFamily: 'Cinzel, serif' }}>ॐ</span>
          </div>
        </div>

        {/* Brand Title & Subtitle */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl font-black sacred-gradient-text tracking-wide" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
            दिव्ययज्ञम् (DivyaYagyam)
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 animate-pulse">
            Sanatan Seva • पवित्र अनुष्ठान लोड हो रहा है...
          </p>
        </div>

        {/* Sleek Golden Progress Indicator Bar */}
        <div className="w-48 h-1.5 bg-amber-100 rounded-full overflow-hidden shadow-inner border border-amber-200/50 mt-2">
          <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-950/20 via-background to-background relative overflow-hidden select-none">
      {/* Dynamic Background Divine Agni Flame Rays & Aura */}
      <div className="absolute h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-red-600/30 via-amber-500/25 to-yellow-400/20 blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute h-80 w-80 rounded-full bg-orange-500/20 blur-2xl animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />

      <div className="relative flex flex-col items-center gap-7 z-10 px-4">
        {/* Sacred Logo Container with AGNI (Sacred Fire) Aura Effect */}
        <div className="relative flex items-center justify-center p-6">
          {/* Flame Layer 1: Fiery Spinning Halo */}
          <div 
            className="absolute h-44 w-44 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-300 blur-xl opacity-80 animate-spin"
            style={{ animationDuration: '6s' }}
          />

          {/* Flame Layer 2: Flickering Inner Agni Rays */}
          <div 
            className="absolute h-40 w-40 rounded-full bg-gradient-to-tr from-amber-400 via-orange-600 to-red-700 blur-md opacity-90 animate-pulse"
            style={{ animationDuration: '1.2s' }}
          />

          {/* Flame Layer 3: Outer Glow Ring with Intense Heat Shadow */}
          <div className="absolute h-36 w-36 rounded-full border-2 border-amber-400/60 shadow-[0_0_60px_rgba(255,100,0,0.85)] animate-ping" style={{ animationDuration: '2.5s' }} />

          {/* Logo Card with Arched Border matching Logo aesthetic */}
          <div className="relative z-10 h-32 w-32 sm:h-36 sm:w-36 rounded-2xl bg-white/95 dark:bg-slate-950 p-2 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)] border-2 border-amber-400/80 transition-transform duration-500 hover:scale-105">
            <img 
              src="/logo.jpg" 
              alt="Divyayagyam Sanatan Seva" 
              className="h-full w-full object-contain drop-shadow-md rounded-xl"
            />
          </div>
        </div>

        {/* Sacred Brand Title & Subtitle */}
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-3xl font-black sacred-gradient-text tracking-wide drop-shadow-sm" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
            दिव्ययज्ञम्
          </h2>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
            Sanatan Seva • पवित्र अनुष्ठान
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-ping" />
          </p>
        </div>

        {/* Agni Flame Progress Indicator Bar */}
        <div className="w-56 h-2 bg-amber-950/10 dark:bg-amber-950/40 rounded-full overflow-hidden p-0.5 border border-amber-500/30 shadow-inner">
          <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 rounded-full animate-pulse w-4/5 shadow-[0_0_12px_rgba(245,158,11,0.9)]" />
        </div>
      </div>
    </div>
  )
}

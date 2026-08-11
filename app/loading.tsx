export default function Loading() {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center min-h-[50vh] bg-transparent text-center select-none">
      <div className="relative flex items-center justify-center p-4">
        {/* Subtle Agni Glow Ring */}
        <div className="absolute h-20 w-20 rounded-full bg-gradient-to-tr from-red-600/30 via-amber-500/20 to-yellow-400/10 blur-xl animate-pulse pointer-events-none" />
        
        <div className="relative z-10 h-16 w-16 rounded-2xl bg-white dark:bg-slate-950 p-2 flex items-center justify-center shadow-lg border border-amber-400/50 animate-pulse">
          <img 
            src="/logo.jpg" 
            alt="Divyayagyam - Aastha Ki Nai Pehchan" 
            className="h-full w-full object-contain rounded-xl"
          />
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
          Loading Sacred Seva…
        </span>
      </div>
    </div>
  )
}

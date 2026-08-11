'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { cn } from '@/lib/utils'

import { siteConfig } from '@/lib/site-config'

export function Logo({ className, showText = true, size = "md" }: { className?: string; showText?: boolean; size?: "sm" | "md" | "lg" }) {
  const [logoUrl, setLogoUrl] = useState('/logo.jpg')
  const [siteName, setSiteName] = useState(siteConfig.name || 'DivyaYagyam')

  useEffect(() => {
    fetch('/api/customizer', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok && j.data?.theme) {
          if (j.data.theme['site.logo']) setLogoUrl(j.data.theme['site.logo'])
          if (j.data.theme['site.name']) setSiteName(j.data.theme['site.name'])
        }
      })
      .catch(() => {})
  }, [])

  const sizeClasses = {
    sm: 'h-10 w-10 min-w-[40px]',
    md: 'h-12 w-12 min-w-[48px]',
    lg: 'h-16 w-16 min-w-[64px]',
  }[size]

  return (
    <Link href="/" className={cn('flex items-center gap-3 group shrink-0', className)}>
      <div className={cn("relative flex items-center justify-center overflow-hidden rounded-xl bg-amber-950/20 p-0.5 group-hover:scale-105 transition-transform shrink-0 shadow-md border-2 border-[#D49B00]/40 ring-1 ring-amber-300/30", sizeClasses)}>
        <img 
          src={logoUrl || '/logo.jpg'} 
          alt="DivyaYagyam Logo" 
          className="h-full w-full object-contain object-center rounded-lg drop-shadow-sm"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.jpg'
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span className="text-[18px] sm:text-[21px] font-black sacred-gradient-text tracking-wide leading-none py-0.5" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
            {siteName}
          </span>
          <span className="text-[9px] sm:text-[10px] text-[#8B5A00] dark:text-amber-400 font-extrabold tracking-[0.14em] uppercase mt-[1px]">
            AASTHA KI NAI PEHCHAN
          </span>
        </div>
      )}
    </Link>
  )
}

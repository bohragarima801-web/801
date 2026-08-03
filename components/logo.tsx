'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, showText = true, size = "md" }: { className?: string; showText?: boolean; size?: "sm" | "md" | "lg" }) {
  const [logoUrl, setLogoUrl] = useState('/logo.jpg')
  const [siteName, setSiteName] = useState('दिव्ययज्ञम्')

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
    sm: 'h-8 w-auto min-w-[32px]',
    md: 'h-11 w-auto min-w-[40px]',
    lg: 'h-14 w-auto min-w-[50px]',
  }[size]

  return (
    <Link href="/" className={cn('flex items-center gap-2.5 group shrink-0', className)}>
      <div className={cn("relative flex items-center justify-center overflow-hidden rounded-xl bg-transparent group-hover:scale-105 transition-transform shrink-0 shadow-sm border border-amber-500/10", sizeClasses)}>
        <img 
          src={logoUrl || '/logo.jpg'} 
          alt="DivyaYagyam Logo" 
          className="h-full w-full object-contain object-center rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.jpg'
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span className="text-[17px] sm:text-[19px] font-black sacred-gradient-text tracking-wide leading-tight py-0.5" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
            {siteName}
          </span>
          <span className="text-[8.5px] sm:text-[9.5px] text-amber-700/80 dark:text-amber-400/80 font-bold tracking-widest uppercase mt-[-2px]">
            SANATAN SEVA
          </span>
        </div>
      )}
    </Link>
  )
}

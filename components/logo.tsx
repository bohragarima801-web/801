'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/site-config'

export function Logo({ className, showText = true, size = "md" }: { className?: string; showText?: boolean; size?: "sm" | "md" | "lg" }) {
  const [logoUrl, setLogoUrl] = useState('/logo.webp')
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

  const containerSize = {
    sm: 'h-8 sm:h-10 w-auto',
    md: 'h-9 sm:h-12 w-auto',
    lg: 'h-12 sm:h-16 w-auto',
  }[size]

  return (
    <Link href="/" aria-label="DivyaYagyam Home" className={cn('flex items-center gap-2 sm:gap-2.5 group shrink-0', className)}>
      <div className={cn("relative flex items-center justify-center group-hover:scale-[1.03] transition-transform shrink-0 drop-shadow-sm", containerSize)}>
        <img 
          src={logoUrl || '/logo.webp'} 
          alt="DivyaYagyam Logo" 
          className="h-full w-auto max-w-full object-contain rounded-lg sm:rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logo.jpg'
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center notranslate leading-tight" translate="no">
          <span className="text-[15px] sm:text-[20px] font-black sacred-gradient-text tracking-wide leading-none py-0.5" style={{ fontFamily: "'Cinzel', 'Georgia', serif" }}>
            {siteName}
          </span>
          <span className="text-[7.5px] sm:text-[9.5px] text-[#8B5A00] dark:text-amber-400 font-extrabold tracking-[0.1em] uppercase mt-[1px]">
            दिव्ययज्ञम् — आस्था की नई पहचान
          </span>
        </div>
      )}
    </Link>
  )
}

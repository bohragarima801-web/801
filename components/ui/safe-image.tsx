'use client'

import React from 'react'
import { getAutoSeoAlt } from '@/lib/seo-auto'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  hideOnError?: boolean
  seoCategory?: 'puja' | 'product' | 'bhaktiseva' | 'temple' | 'general'
}

export function SafeImage({ fallbackSrc, hideOnError = true, onError, alt, title, seoCategory = 'general', ...props }: SafeImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc) {
      e.currentTarget.src = fallbackSrc
    } else if (hideOnError) {
      e.currentTarget.style.display = 'none'
    }
    if (onError) {
      onError(e)
    }
  }

  const finalAlt = alt && alt.trim().length > 0 ? alt : getAutoSeoAlt(title || (props as any).name || 'DivyaYagyam', seoCategory)

  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} alt={finalAlt} title={title || finalAlt} onError={handleError} />
}


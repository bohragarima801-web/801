'use client'

import React, { useState } from 'react'
import { getAutoSeoAlt } from '@/lib/seo-auto'
import { cn } from '@/lib/utils'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  hideOnError?: boolean
  seoCategory?: 'puja' | 'product' | 'bhaktiseva' | 'temple' | 'general'
  priority?: boolean
}

export function SafeImage({
  fallbackSrc = '/package-1.jpg',
  hideOnError = false,
  onError,
  alt,
  title,
  seoCategory = 'general',
  src,
  className,
  priority = false,
  loading,
  decoding,
  ...props
}: SafeImageProps) {
  // Convert local .jpg/.png to .webp if it's a local public asset
  const getOptimizedSrc = (inputSrc?: string) => {
    if (!inputSrc) return fallbackSrc
    if (typeof inputSrc === 'string' && (inputSrc.startsWith('/') || inputSrc.startsWith('http')) && !inputSrc.endsWith('.webp') && !inputSrc.endsWith('.gif') && !inputSrc.endsWith('.svg')) {
      // Check if it's local public asset
      if (inputSrc.startsWith('/') && !inputSrc.startsWith('/uploads/')) {
        return inputSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      }
    }
    return inputSrc
  }

  const [imgSrc, setImgSrc] = useState<string | undefined>(getOptimizedSrc(src as string))
  const [hasError, setHasError] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If .webp failed, fall back to original src first, then fallbackSrc
    if (!hasError && imgSrc && imgSrc.endsWith('.webp') && typeof src === 'string' && src !== imgSrc) {
      setImgSrc(src)
    } else if (!hasError && fallbackSrc) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    } else if (hideOnError) {
      e.currentTarget.style.display = 'none'
    }
    if (onError) {
      onError(e)
    }
  }

  const finalAlt = alt && alt.trim().length > 0 ? alt : getAutoSeoAlt(title || 'DivyaYagyam', seoCategory)

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      {...props}
      src={imgSrc || fallbackSrc}
      alt={finalAlt}
      title={title || finalAlt}
      loading={priority ? 'eager' : (loading || 'lazy')}
      decoding={decoding || 'async'}
      onError={handleError}
      className={className}
    />
  )
}

interface SacredImageFrameProps {
  src: string | null | undefined
  alt: string
  aspectRatio?: '4/3' | '16/10' | '16/9' | 'square' | 'auto'
  className?: string
  imageClassName?: string
  fallbackSrc?: string
  seoCategory?: 'puja' | 'product' | 'bhaktiseva' | 'temple' | 'general'
}

export function SacredImageFrame({
  src,
  alt,
  aspectRatio = '16/10',
  className = '',
  imageClassName = '',
  fallbackSrc = '/package-1.jpg',
  seoCategory = 'puja',
}: SacredImageFrameProps) {
  const displaySrc = src || fallbackSrc

  const aspectClass =
    aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16/9'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'auto'
      ? 'h-auto min-h-[160px]'
      : 'aspect-[16/10]'

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-gradient-to-b from-[#1E0C07]/90 to-[#0A0302] rounded-xl flex items-center justify-center p-1 group shadow-inner',
        aspectClass,
        className
      )}
    >
      {/* Ambient Blur Fill Background (No Ugly White Bars & No Image Cropping) */}
      <img
        src={displaySrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover filter blur-lg opacity-40 scale-110 pointer-events-none transition-opacity duration-500 group-hover:opacity-55"
        onError={(e) => {
          e.currentTarget.src = fallbackSrc
        }}
      />

      {/* Main Full Non-Cropped Centered Image */}
      <SafeImage
        src={displaySrc}
        alt={alt}
        fallbackSrc={fallbackSrc}
        seoCategory={seoCategory}
        className={cn(
          'relative z-10 max-h-full max-w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:scale-[1.03]',
          imageClassName
        )}
      />
    </div>
  )
}

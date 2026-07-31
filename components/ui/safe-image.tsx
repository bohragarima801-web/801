'use client'

import React from 'react'

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string
  hideOnError?: boolean
}

export function SafeImage({ fallbackSrc, hideOnError = true, onError, ...props }: SafeImageProps) {
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

  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} onError={handleError} />
}

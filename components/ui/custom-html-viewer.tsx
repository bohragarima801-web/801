'use client'

import React, { useEffect, useRef } from 'react'

interface CustomHtmlViewerProps {
  html: string | null | undefined
  className?: string
}

export function CustomHtmlViewer({ html, className = '' }: CustomHtmlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !html) return

    // Inject HTML
    containerRef.current.innerHTML = html

    // Re-execute any embedded <script> tags for dynamic widgets/forms/countdown timers
    const scripts = containerRef.current.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })
      if (oldScript.innerHTML) {
        newScript.innerHTML = oldScript.innerHTML
      }
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [html])

  if (!html || !html.trim()) return null

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-auto leading-relaxed text-slate-800 ${className}`}
    />
  )
}

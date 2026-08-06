'use client'

import React, { useEffect, useRef } from 'react'

interface CustomHtmlViewerProps {
  html: string | null | undefined
  className?: string
}

export function CustomHtmlViewer({ html, className = '' }: CustomHtmlViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Extract clean HTML content if passed as JSON string or raw HTML
  const cleanHtml = React.useMemo(() => {
    if (!html || typeof html !== 'string' || !html.trim()) return ''
    const trimmed = html.trim()
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed)
        // If it's pure assignedPandit metadata without custom HTML, return empty
        if (parsed.assignedPandit && Object.keys(parsed).length === 1) {
          return ''
        }
        return parsed.customHtml || parsed.html || parsed.customCode || parsed.code || parsed.embed || ''
      } catch {
        return trimmed
      }
    }
    return trimmed
  }, [html])

  useEffect(() => {
    if (!containerRef.current || !cleanHtml) return

    // Inject HTML into container
    containerRef.current.innerHTML = cleanHtml

    // Make any iframes responsive
    const iframes = containerRef.current.querySelectorAll('iframe')
    iframes.forEach((iframe) => {
      iframe.classList.add('w-full', 'max-w-full', 'rounded-xl')
      if (!iframe.getAttribute('loading')) {
        iframe.setAttribute('loading', 'lazy')
      }
    })

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
  }, [cleanHtml])

  if (!cleanHtml || !cleanHtml.trim()) return null

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-x-auto leading-relaxed text-slate-800 ${className}`}
    />
  )
}

'use client'

import { useEffect, useRef } from 'react'

interface BlogViewTrackerProps {
  blogId: string
  slug: string
}

export function BlogViewTracker({ blogId, slug }: BlogViewTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    // Prevent double tracking in React 18 Strict Mode in development
    if (tracked.current) return
    tracked.current = true

    const trackView = async () => {
      try {
        const response = await fetch('/api/blog/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blogId, slug }),
        })

        if (!response.ok) return

        const data = await response.json()
        
        // Push the custom GA4 event ONLY when the server confirms a unique view was counted
        if (data && data.counted) {
          if (typeof window !== 'undefined') {
            const win = window as any
            if (win.gtag) {
              win.gtag('event', 'blog_view_counted', {
                blog_id: blogId,
                blog_slug: slug
              })
            } else if (win.dataLayer) {
              win.dataLayer.push({
                event: 'blog_view_counted',
                blog_id: blogId,
                blog_slug: slug
              })
            }
          }
        }
      } catch (err) {
        // Silent catch in production
      }
    }

    trackView()
  }, [blogId, slug])

  return null
}

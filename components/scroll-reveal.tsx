'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * ScrollReveal — Global scroll-triggered animation handler.
 * Adds 'revealed' class to any element with class 'reveal', 'reveal-left', or 'reveal-right'
 * when it enters the viewport or when route changes.
 */
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    let observer: IntersectionObserver | null = null

    const initReveal = () => {
      const revealEls = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right')
      if (!revealEls.length) return

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.01, rootMargin: '100px 0px 100px 0px' }
      )

      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // If element is already within or near the visible viewport, reveal immediately
        if (rect.top < window.innerHeight + 150 && rect.bottom > -150) {
          el.classList.add('revealed')
        } else {
          observer?.observe(el)
        }
      })
    }

    // Run immediately and also after a short tick for dynamic DOM hydration
    initReveal()
    const timer = setTimeout(initReveal, 100)

    return () => {
      clearTimeout(timer)
      observer?.disconnect()
    }
  }, [pathname])

  return null
}

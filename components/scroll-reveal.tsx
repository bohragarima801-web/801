'use client'

import { useEffect } from 'react'

/**
 * ScrollReveal — Global scroll-triggered animation handler.
 * Adds 'revealed' class to any element with class 'reveal', 'reveal-left', or 'reveal-right'
 * when it enters the viewport. Works across all pages without per-page setup.
 */
export function ScrollReveal() {
  useEffect(() => {
    const revealEls = document.querySelectorAll<HTMLElement>('.reveal, .reveal-left, .reveal-right')

    if (!revealEls.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target) // once revealed, stop watching
          }
        })
      },
      { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
    )

    revealEls.forEach((el) => observer.observe(el))

    // Re-run on route changes (dynamic content)
    return () => observer.disconnect()
  }, [])

  return null
}

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function TranslationProvider() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // PATCH: Prevent React from crashing when Google Translate modifies the DOM
    if (typeof Node === 'function' && Node.prototype) {
      const originalRemoveChild = Node.prototype.removeChild;
      Node.prototype.removeChild = function <T extends Node>(child: T): T {
        if (child.parentNode !== this) {
          return child;
        }
        return originalRemoveChild.call(this, child) as T;
      };

      const originalInsertBefore = Node.prototype.insertBefore;
      Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
        if (referenceNode && referenceNode.parentNode !== this) {
          return newNode;
        }
        return originalInsertBefore.call(this, newNode, referenceNode) as T;
      };
    }

    if (pathname?.startsWith('/admin')) return

    // 1. Read language from localStorage
    const lang = localStorage.getItem('lang')

    // 2. Clear auto-translate cookie for Hindi and English to preserve 100% authentic typography
    if (!lang || lang === 'hi' || lang === 'en' || lang === 'default') {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname
      return
    } else {
      document.cookie = `googtrans=/hi/${lang}; path=/`
      document.cookie = `googtrans=/hi/${lang}; path=/; domain=.${window.location.hostname}`
    }


    // 3. Inject Google Translate CSS to hide UI frames
    let style = document.getElementById('__google_translate_css')
    if (!style) {
      style = document.createElement('style')
      style.id = '__google_translate_css'
      style.textContent = `
        .skiptranslate, iframe.skiptranslate, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame,
        .goog-te-spinner-pos, .goog-te-spinner-animation, #goog-te-spinner, .goog-tooltip, .goog-tooltip:hover {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          box-shadow: none !important;
        }
        body {
          top: 0 !important;
        }
      `
      document.head.appendChild(style)
    }

    // 4. Inject Google Translate element placeholder container (hidden)
    let container = document.getElementById('google_translate_element')
    if (!container) {
      container = document.createElement('div')
      container.id = 'google_translate_element'
      container.style.display = 'none'
      document.body.appendChild(container)
    }

    // 5. Initialize Translate callback
    ;(window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,ta,te,kn,gu,mr,bn',
        autoDisplay: false
      }, 'google_translate_element')
    }

    // 6. Load Translate script
    const scriptId = '__google_translate_script'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return null
}

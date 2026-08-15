'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Sparkles, Maximize2, Minimize2, RotateCcw, Share2, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type ToolComponentProps = {
  tool: any
  isPremiumUnlocked: boolean
}

import KundaliTool from './KundaliTool'
import MalaTool from './MalaTool'
import NumerologyTool from './NumerologyTool'
import MilanTool from './MilanTool'
import RatnaTool from './RatnaTool'
import ShubhSamayTool from './ShubhSamayTool'

// MAP SLUGS TO BUILT-IN REACT COMPONENTS (Fallback if no custom HTML in DB)
const TOOL_REGISTRY: Record<string, React.FC<ToolComponentProps>> = {
  kundali: KundaliTool,
  'free-kundali': KundaliTool,
  mala: MalaTool,
  'japa-mala-counter': MalaTool,
  numerology: NumerologyTool,
  'numerology-calculator': NumerologyTool,
  milan: MilanTool,
  'kundali-milan': MilanTool,
  ratna: RatnaTool,
  'gemstone-suggestion': RatnaTool,
  'dainik-shubh-samay-calculator': ShubhSamayTool,
  'shubh-samay': ShubhSamayTool,
}

export function ToolMapper({ tool, isPremiumUnlocked }: { tool: any; isPremiumUnlocked: boolean }) {
  const slug = (tool?.slug || '').toLowerCase().trim()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeHeight, setIframeHeight] = useState<number>(720)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [copied, setCopied] = useState<boolean>(false)
  const [iframeKey, setIframeKey] = useState<number>(1)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  // Listen for dynamic auto-resizing messages from the iframe child document
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'DIVYA_TOOL_RESIZE' && typeof event.data.height === 'number') {
        const rawH = Math.ceil(event.data.height)
        if (rawH >= 250 && rawH <= 5000) {
          setIframeHeight((prev) => {
            // Only update if difference is more than 16px to prevent infinite expanding feedback loop
            if (Math.abs(prev - rawH) > 16) {
              return rawH
            }
            return prev
          })
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleReload = useCallback(() => {
    setIsLoaded(false)
    setIframeKey((prev) => prev + 1)
    toast.success('टूल रीलोड किया गया (Tool reloaded)')
  }, [])

  const handleShare = useCallback(() => {
    if (typeof window !== 'undefined') {
      const url = window.location.href
      navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('लिंक कॉपी हो गया! (Tool link copied to clipboard)')
      setTimeout(() => setCopied(false), 2500)
    }
  }, [])

  // 1. Check if custom HTML/JS/CSS code is provided
  const rawHtml = (tool.htmlCode || '').trim()
  const rawCss = (tool.cssCode || '').trim()
  const rawJs = (tool.jsCode || '').trim()
  const hasCustomCode = (rawHtml.length > 0 && rawHtml !== '<p></p>') || rawCss.length > 0 || rawJs.length > 0

  if (hasCustomCode) {
    const isFullDocument = rawHtml.toLowerCase().includes('<!doctype html') || rawHtml.toLowerCase().includes('<html')

    // Rock-solid Lifecycle Hook & Auto-Resizer Preamble Script (Without infinite expansion feedback loops)
    const lifecyclePreamble = `
      <style id="divya-height-resizer-reset">
        html, body {
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
        }
      </style>
      <script>
        (function() {
          // 1. Hook window.onload & Event Listeners so they ALWAYS execute inside srcDoc iframe
          var originalOnload = null;
          try {
            Object.defineProperty(window, 'onload', {
              get: function() { return originalOnload; },
              set: function(fn) {
                originalOnload = fn;
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                  setTimeout(function() {
                    try { if (typeof fn === 'function') fn.call(window, new Event('load')); } catch(e) { console.error('Error in window.onload:', e); }
                  }, 50);
                }
              },
              configurable: true
            });
          } catch(e) {}

          var origAddEventListener = window.addEventListener;
          window.addEventListener = function(type, listener, options) {
            origAddEventListener.call(window, type, listener, options);
            if ((type === 'load' || type === 'DOMContentLoaded') && (document.readyState === 'complete' || document.readyState === 'interactive')) {
              setTimeout(function() {
                try {
                  if (typeof listener === 'function') listener.call(window, new Event(type));
                  else if (listener && typeof listener.handleEvent === 'function') listener.handleEvent(new Event(type));
                } catch(e) { console.error('Error in listener:', e); }
              }, 50);
            }
          };

          var origDocAddEventListener = document.addEventListener;
          document.addEventListener = function(type, listener, options) {
            origDocAddEventListener.call(document, type, listener, options);
            if (type === 'DOMContentLoaded' && (document.readyState === 'complete' || document.readyState === 'interactive')) {
              setTimeout(function() {
                try {
                  if (typeof listener === 'function') listener.call(document, new Event(type));
                  else if (listener && typeof listener.handleEvent === 'function') listener.handleEvent(new Event(type));
                } catch(e) { console.error('Error in doc listener:', e); }
              }, 50);
            }
          };

          // 2. High-precision dynamic Height Notifier (measuring ACTUAL content, not window viewport)
          var lastReportedHeight = 0;
          var debounceTimer = null;

          function measureContentHeight() {
            try {
              var container = document.getElementById('tool-root') || 
                              document.querySelector('.wrap') || 
                              document.querySelector('.container') || 
                              document.querySelector('.main-card') || 
                              document.body;
              
              var contentHeight = 0;
              if (container) {
                var rect = container.getBoundingClientRect();
                contentHeight = Math.max(container.scrollHeight, Math.ceil(rect.height));
              }

              // Scan bottom edge of all direct children
              var children = document.body ? document.body.children : [];
              var maxBottom = 0;
              for (var i = 0; i < children.length; i++) {
                var el = children[i];
                if (el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && el.id !== 'divya-height-resizer-reset') {
                  var r = el.getBoundingClientRect();
                  var b = (window.pageYOffset || document.documentElement.scrollTop || 0) + r.bottom;
                  if (b > maxBottom) maxBottom = Math.ceil(b);
                }
              }

              var measured = Math.max(contentHeight, maxBottom);
              if (measured > 250) {
                var targetHeight = measured + 15;
                if (Math.abs(targetHeight - lastReportedHeight) > 16) {
                  lastReportedHeight = targetHeight;
                  window.parent.postMessage({ type: 'DIVYA_TOOL_RESIZE', height: targetHeight }, '*');
                }
              }
            } catch(e) {}
          }

          function notifyHeight() {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(measureContentHeight, 60);
          }

          window.addEventListener('load', function() {
            notifyHeight();
            if (typeof originalOnload === 'function') {
              try { originalOnload.call(window, new Event('load')); } catch(e) {}
            }
          });
          window.addEventListener('resize', notifyHeight);
          document.addEventListener('click', function() { setTimeout(notifyHeight, 100); setTimeout(notifyHeight, 350); });
          document.addEventListener('input', function() { setTimeout(notifyHeight, 50); });
          document.addEventListener('change', function() { setTimeout(notifyHeight, 50); });

          if (window.ResizeObserver) {
            var targetEl = document.getElementById('tool-root') || document.querySelector('.wrap') || document.querySelector('.container') || document.body;
            if (targetEl) {
              var ro = new ResizeObserver(function() { notifyHeight(); });
              ro.observe(targetEl);
            }
          }

          // 3. Universal Vedic Prashnavali Dynamic Randomizer Engine
          // Ensures ANY Prashnavali tool (existing or newly added) always gives a dynamic random answer on each click
          (function setupUniversalPrashnavaliRandomizer() {
            var lastPickedKey = null;

            function getRandomItem(collection) {
              if (!collection) return null;
              var keys = Object.keys(collection).filter(function(k) {
                return k !== '__isRandomizedProxy' && typeof collection[k] !== 'function';
              });
              if (keys.length === 0) return null;
              var filtered = keys.filter(function(k) { return k !== lastPickedKey; });
              if (filtered.length === 0) filtered = keys;
              var chosenKey = filtered[Math.floor(Math.random() * filtered.length)];
              lastPickedKey = chosenKey;
              return { key: chosenKey, value: collection[chosenKey] };
            }

            function patchGlobalData() {
              try {
                var oracleObjNames = ['divineData', 'answersData', 'answers', 'answersList', 'prashnavaliData', 'oracleAnswers', 'oracleData', 'ramShalakaData'];
                oracleObjNames.forEach(function(varName) {
                  if (window[varName] && typeof window[varName] === 'object' && !window[varName].__isRandomizedProxy) {
                    var target = window[varName];
                    var keys = Object.keys(target);
                    if (keys.length > 1) {
                      try {
                        window[varName] = new Proxy(target, {
                          get: function(t, prop, receiver) {
                            if (prop === '__isRandomizedProxy') return true;
                            if (prop === 'length' || prop === 'slice' || prop === 'forEach' || prop === 'map' || prop === 'filter' || prop === 'includes' || prop === 'find' || prop === 'indexOf') {
                              return Reflect.get(t, prop, receiver);
                            }
                            if (typeof prop === 'symbol' || prop === 'constructor' || prop === 'prototype' || prop === 'toString' || prop === 'valueOf') {
                              return Reflect.get(t, prop, receiver);
                            }
                            // If user accesses an ank or key
                            if (prop in t || (!isNaN(Number(prop)) && keys.length > 0)) {
                              var res = getRandomItem(t);
                              return res ? res.value : t[prop];
                            }
                            return Reflect.get(t, prop, receiver);
                          }
                        });
                      } catch(e) {}
                    }
                  }
                });
              } catch(e) {}
            }

            window.addEventListener('DOMContentLoaded', patchGlobalData);
            window.addEventListener('load', patchGlobalData);
            document.addEventListener('click', function() { setTimeout(patchGlobalData, 10); }, true);
            setTimeout(patchGlobalData, 100);
            setTimeout(patchGlobalData, 400);
            setTimeout(patchGlobalData, 1200);
          })();

          // Trigger on load
          setTimeout(notifyHeight, 200);
          setTimeout(notifyHeight, 800);
        })();
      </script>
    `

    let srcDoc = ''

    if (isFullDocument) {
      srcDoc = rawHtml

      // Inject preamble at the start of <head> or at very beginning
      if (srcDoc.includes('<head>')) {
        srcDoc = srcDoc.replace('<head>', `<head>${lifecyclePreamble}`)
      } else if (srcDoc.includes('<head ')) {
        srcDoc = srcDoc.replace(/<head[^>]*>/, `$&${lifecyclePreamble}`)
      } else if (srcDoc.includes('<html>')) {
        srcDoc = srcDoc.replace('<html>', `<html><head>${lifecyclePreamble}</head>`)
      } else {
        srcDoc = lifecyclePreamble + srcDoc
      }

      // Inject custom CSS if present
      if (rawCss) {
        if (srcDoc.includes('</head>')) {
          srcDoc = srcDoc.replace('</head>', `<style>${rawCss}</style></head>`)
        } else {
          srcDoc = `<style>${rawCss}</style>` + srcDoc
        }
      }

      // Inject custom JS if present
      if (rawJs) {
        if (srcDoc.includes('</body>')) {
          srcDoc = srcDoc.replace('</body>', `<script>${rawJs}</script></body>`)
        } else {
          srcDoc = srcDoc + `<script>${rawJs}</script>`
        }
      }
    } else {
      // Partial snippet mode: wrap with rich UI defaults
      srcDoc = `<!DOCTYPE html>
      <html lang="hi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${tool.name || 'Spiritual Tool'}</title>
        ${lifecyclePreamble}
        <!-- Tailwind CSS & FontAwesome CDNs -->
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Yantramanav:wght@400;500;700;900&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: 'Plus Jakarta Sans', 'Yantramanav', system-ui, -apple-system, sans-serif; 
            padding: 24px; 
            background: #ffffff; 
            color: #0f172a;
            line-height: 1.6;
            margin: 0;
          }
          h1, h2, h3, h4, h5 { font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 0.75rem; }
          h1 { font-size: 1.75rem; }
          h2 { font-size: 1.5rem; }
          h3 { font-size: 1.25rem; }
          p { color: #475569; margin-top: 0; margin-bottom: 1rem; }
          label { display: block; font-size: 0.875rem; font-weight: 600; color: #334155; margin-bottom: 0.375rem; }
          input, select, textarea {
            width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 0.75rem;
            background-color: #fff; color: #0f172a; font-size: 0.875rem; margin-bottom: 1.25rem;
            box-sizing: border-box; transition: all 0.2s; font-family: inherit; outline: none;
          }
          input:focus, select:focus, textarea:focus { border-color: #ea580c; box-shadow: 0 0 0 3px #ffedd5; }
          button, .btn {
            display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem;
            font-size: 0.95rem; font-weight: 700; border-radius: 0.75rem; border: none;
            background-color: #ea580c; color: white; cursor: pointer; transition: all 0.2s;
            box-sizing: border-box; width: 100%; font-family: inherit; box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
          }
          button:hover, .btn:hover { background-color: #c2410c; transform: translateY(-1px); }
          .card { border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.75rem; background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
          th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
          th { background-color: #f8fafc; font-weight: 600; color: #475569; font-size: 0.875rem; }
          
          /* Custom User CSS */
          ${rawCss}
        </style>
      </head>
      <body>
        <div id="tool-root">
          ${rawHtml}
        </div>
        <script>
          try {
            ${rawJs}
          } catch(e) {
            console.error("Tool Script Error:", e);
          }
        </script>
      </body>
      </html>`
    }

    return (
      <div className={`w-full transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-center items-center overflow-y-auto' : 'relative'}`}>
        <div className={`w-full bg-white border border-[#F3E8DE] rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${isFullscreen ? 'max-w-5xl max-h-[90vh] shadow-2xl my-auto' : ''}`}>
          
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#FFFBF7] to-white border-b border-[#F3E8DE] text-xs font-semibold text-slate-700 select-none">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-[#FF7A00] flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> {tool.name || 'Live Vedic Tool'}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReload}
                className="h-8 px-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-xs"
                title="रीलोड करें (Reset & Reload)"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Reload</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="h-8 px-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-xs"
                title="शेयर करें (Copy Link)"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 mr-1" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 px-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg text-xs"
                title={isFullscreen ? 'सामान्य दृश्य (Exit Fullscreen)' : 'फुल स्क्रीन (Fullscreen Mode)'}
              >
                {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 mr-1" /> : <Maximize2 className="h-3.5 w-3.5 mr-1" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              </Button>
            </div>
          </div>

          {/* Iframe Viewport with loading indicator */}
          <div className="relative w-full overflow-hidden bg-white">
            {!isLoaded && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-semibold text-slate-500">वैदिक टूल लोड हो रहा है...</span>
                </div>
              </div>
            )}

            <iframe
              key={iframeKey}
              ref={iframeRef}
              srcDoc={srcDoc}
              onLoad={() => setIsLoaded(true)}
              style={{ height: isFullscreen ? '78vh' : `${iframeHeight}px`, width: '100%' }}
              className="w-full border-0 transition-all duration-300 block"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals allow-downloads"
              title={tool.name || 'Spiritual Tool'}
            />
          </div>

        </div>
      </div>
    )
  }

  // 2. Specific Direct Redirects for built-in portal pages
  if (slug === 'panchang') {
    if (typeof window !== 'undefined') {
      window.location.href = '/panchang'
    }
    return (
      <div className="p-8 text-center bg-yellow-50 border border-amber-300 rounded-3xl text-amber-950 font-bold">
        <p className="text-lg">Redirecting to Vedic Panchang...</p>
        <a href="/panchang" className="inline-block mt-4 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all">
          Open Panchang Page Now ➔
        </a>
      </div>
    )
  }

  if (slug === 'festivals' || slug === 'festival-calendar') {
    if (typeof window !== 'undefined') {
      window.location.href = '/festivals'
    }
    return (
      <div className="p-8 text-center bg-yellow-50 border border-amber-300 rounded-3xl text-amber-950 font-bold">
        <p className="text-lg">Redirecting to Festival Calendar...</p>
        <a href="/festivals" className="inline-block mt-4 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all">
          Open Festival Calendar Now ➔
        </a>
      </div>
    )
  }

  if (slug === 'muhurat' || slug === 'shubh-muhurat') {
    if (typeof window !== 'undefined') {
      window.location.href = '/muhurat'
    }
    return (
      <div className="p-8 text-center bg-yellow-50 border border-amber-300 rounded-3xl text-amber-950 font-bold">
        <p className="text-lg">Redirecting to Shubh Muhurat Finder...</p>
        <a href="/muhurat" className="inline-block mt-4 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all">
          Open Shubh Muhurat Finder Now ➔
        </a>
      </div>
    )
  }

  // 3. Fallback to Pre-built React Components if slug matches
  const Component = TOOL_REGISTRY[tool.slug]
  if (Component) {
    return <Component tool={tool} isPremiumUnlocked={isPremiumUnlocked} />
  }

  // 4. Default Empty State
  return (
    <div className="w-full bg-white border border-[#F3E8DE] rounded-2xl p-12 text-center shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 mb-2">{tool.name}</h3>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        {tool.description || 'Tool content will render here once configured from the admin panel.'}
      </p>
    </div>
  )
}

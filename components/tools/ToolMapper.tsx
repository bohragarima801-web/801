'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Define the signature of a Tool Component
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

// MAP SLUGS TO BUILT-IN REACT COMPONENTS (Used as fallback if no custom HTML is provided)
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

export function ToolMapper({ tool, isPremiumUnlocked }: { tool: any, isPremiumUnlocked: boolean }) {
  const slug = (tool?.slug || '').toLowerCase().trim()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [iframeHeight, setIframeHeight] = useState<number>(680)

  // Listen for dynamic iframe resizing from the child document
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'DIVYA_TOOL_RESIZE' && typeof event.data.height === 'number') {
        setIframeHeight(Math.max(500, event.data.height + 40))
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // 1. Check if custom HTML/JS code has been provided in the Admin Panel
  const rawHtml = (tool.htmlCode || '').trim()
  const hasCustomCode = rawHtml.length > 0 && rawHtml !== '<p></p>'

  // If custom code is entered in backend, render it with full runtime environment
  if (hasCustomCode) {
    const isFullDocument = rawHtml.toLowerCase().includes('<!doctype html') || rawHtml.toLowerCase().includes('<html')
    
    // Injected auto-resizer and bridge script
    const autoResizeScript = `
      <script>
        (function() {
          function notifyHeight() {
            try {
              var height = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight
              );
              window.parent.postMessage({ type: 'DIVYA_TOOL_RESIZE', height: height }, '*');
            } catch(e) {}
          }
          window.addEventListener('load', notifyHeight);
          window.addEventListener('resize', notifyHeight);
          if (window.ResizeObserver) {
            var ro = new ResizeObserver(notifyHeight);
            ro.observe(document.body);
          }
          setInterval(notifyHeight, 1000);
        })();
      </script>
    `

    let srcDoc = ''

    if (isFullDocument) {
      srcDoc = rawHtml
      if (tool.cssCode) {
        if (srcDoc.includes('</head>')) {
          srcDoc = srcDoc.replace('</head>', `<style>${tool.cssCode}</style></head>`)
        } else {
          srcDoc = `<style>${tool.cssCode}</style>` + srcDoc
        }
      }
      if (tool.jsCode) {
        if (srcDoc.includes('</body>')) {
          srcDoc = srcDoc.replace('</body>', `<script>${tool.jsCode}</script>${autoResizeScript}</body>`)
        } else {
          srcDoc = srcDoc + `<script>${tool.jsCode}</script>${autoResizeScript}`
        }
      } else {
        if (srcDoc.includes('</body>')) {
          srcDoc = srcDoc.replace('</body>', `${autoResizeScript}</body>`)
        } else {
          srcDoc = srcDoc + autoResizeScript
        }
      }
    } else {
      srcDoc = `<!DOCTYPE html>
      <html lang="hi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${tool.name || 'Spiritual Tool'}</title>
        <!-- Tailwind CSS & Lucide / FontAwesome CDNs -->
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Yantramanav:wght@400;500;700;900&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; }
          body { 
            font-family: 'Plus Jakarta Sans', 'Yantramanav', system-ui, -apple-system, sans-serif; 
            padding: 20px; 
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
          
          /* User's custom CSS below */
          ${tool.cssCode || ''}
        </style>
      </head>
      <body>
        <div id="tool-root">
          ${tool.htmlCode || ''}
        </div>
        <script>
          try {
            ${tool.jsCode || ''}
          } catch(e) {
            console.error("Tool Script Error:", e);
          }
        </script>
        ${autoResizeScript}
      </body>
      </html>`
    }

    return (
      <div className="w-full bg-white border border-[#F3E8DE] rounded-2xl shadow-sm overflow-hidden relative transition-all duration-300">
        <iframe 
          ref={iframeRef}
          srcDoc={srcDoc}
          style={{ height: `${iframeHeight}px`, width: '100%' }}
          className="w-full border-0 transition-all duration-300"
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
          title={tool.name || 'Spiritual Tool'}
        />
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


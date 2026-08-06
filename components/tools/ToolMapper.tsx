'use client'

import React from 'react'
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

// 2. MAP SLUGS TO COMPONENTS
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

  if (slug === 'panchang') {
    if (typeof window !== 'undefined') {
      window.location.href = '/panchang'
    }
    return (
      <div className="p-8 text-center bg-yellow-100 border-4 border-amber-400 rounded-3xl text-red-950 font-black">
        <p className="text-lg">Redirecting to Vedic Panchang...</p>
        <a href="/panchang" className="inline-block mt-4 px-6 py-3 bg-red-600 text-yellow-300 rounded-2xl font-black border-b-4 border-red-900">
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
      <div className="p-8 text-center bg-yellow-100 border-4 border-amber-400 rounded-3xl text-red-950 font-black">
        <p className="text-lg">Redirecting to Festival Calendar...</p>
        <a href="/festivals" className="inline-block mt-4 px-6 py-3 bg-red-600 text-yellow-300 rounded-2xl font-black border-b-4 border-red-900">
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
      <div className="p-8 text-center bg-yellow-100 border-4 border-amber-400 rounded-3xl text-red-950 font-black">
        <p className="text-lg">Redirecting to Shubh Muhurat Finder...</p>
        <a href="/muhurat" className="inline-block mt-4 px-6 py-3 bg-red-600 text-yellow-300 rounded-2xl font-black border-b-4 border-red-900">
          Open Shubh Muhurat Finder Now ➔
        </a>
      </div>
    )
  }


  const Component = TOOL_REGISTRY[tool.slug]


  if (Component) {
    return <Component tool={tool} isPremiumUnlocked={isPremiumUnlocked} />
  }

  const rawHtml = (tool.htmlCode || '').trim()
  const isFullDocument = rawHtml.toLowerCase().includes('<!doctype html') || rawHtml.toLowerCase().includes('<html')

  let srcDoc = ''

  if (isFullDocument) {
    srcDoc = rawHtml
    if (tool.cssCode) {
      srcDoc = srcDoc.replace('</head>', `<style>${tool.cssCode}</style></head>`)
    }
    if (tool.jsCode) {
      srcDoc = srcDoc.replace('</body>', `<script>${tool.jsCode}</script></body>`)
    }
  } else {
    srcDoc = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${tool.name || 'Spiritual Tool'}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        body { 
          font-family: 'Inter', system-ui, -apple-system, sans-serif; 
          padding: 24px; 
          background: #ffffff; 
          color: #0f172a;
          line-height: 1.6;
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
      ${tool.htmlCode || '<div class="text-center p-12 text-slate-500 font-medium">Tool interface initialized. Content will render here.</div>'}
      <script>
        try {
          ${tool.jsCode || ''}
        } catch(e) {
          console.error("Tool Script Error:", e);
        }
      </script>
    </body>
    </html>`
  }

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[650px] overflow-hidden relative">
      <iframe 
        srcDoc={srcDoc}
        className="w-full h-full min-h-[650px] border-0"
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
        title={tool.name || 'Spiritual Tool'}
      />
    </div>
  )
}

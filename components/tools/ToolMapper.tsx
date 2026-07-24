'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Define the signature of a Tool Component
type ToolComponentProps = {
  tool: any
  isPremiumUnlocked: boolean
}

// 1. IMPORT YOUR CUSTOM REACT TOOLS HERE
// import KundliMilanTool from './kundli-milan'

// 2. MAP SLUGS TO COMPONENTS
const TOOL_REGISTRY: Record<string, React.FC<ToolComponentProps>> = {
  // 'kundli-milan': KundliMilanTool,
}

export function ToolMapper({ tool, isPremiumUnlocked }: { tool: any, isPremiumUnlocked: boolean }) {
  const Component = TOOL_REGISTRY[tool.slug]

  if (Component) {
    return <Component tool={tool} isPremiumUnlocked={isPremiumUnlocked} />
  }

  // FALLBACK: Load the HTML/JS from database in an iframe
  const srcDoc = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${tool.name}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: system-ui, sans-serif; padding: 20px; background: transparent; }
        ${tool.cssCode || ''}
      </style>
    </head>
    <body>
      ${tool.htmlCode || '<div class="text-center p-10 text-gray-500">No UI configured for this tool yet.</div>'}
      <script>
        ${tool.jsCode || ''}
      </script>
    </body>
    </html>`

  return (
    <div className="w-full bg-white border rounded-xl shadow-sm min-h-[600px] overflow-hidden relative">
      <iframe 
        srcDoc={srcDoc}
        className="w-full h-full min-h-[600px] border-0"
        sandbox="allow-scripts allow-forms allow-same-origin"
        title={tool.name}
      />
    </div>
  )
}

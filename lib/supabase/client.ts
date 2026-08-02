'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co').replace(/^"|"$/g, '')
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://placeholder.supabase.co'
  }
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder').replace(/^"|"$/g, '')
  return createBrowserClient(url, key)
}


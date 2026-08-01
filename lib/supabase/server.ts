import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSetting } from '@/lib/settings'

export async function createClient() {
  const cookieStore = await cookies()
  
  let sbUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/^"|"$/g, '')
  let sbKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^"|"$/g, '')

  if (!sbUrl || !sbUrl.startsWith('http') || !sbKey) {
    const dbUrl = await getSetting('secret.supabase_url').catch(() => '')
    const dbKey = await getSetting('secret.supabase_anon_key').catch(() => '')
    if (dbUrl && (dbUrl.startsWith('http://') || dbUrl.startsWith('https://'))) sbUrl = dbUrl
    if (dbKey) sbKey = dbKey
  }

  const finalUrl = (sbUrl && (sbUrl.startsWith('http://') || sbUrl.startsWith('https://'))) ? sbUrl : 'https://placeholder.supabase.co'
  const finalKey = sbKey || 'placeholder'

  return createServerClient(
    finalUrl,
    finalKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component cannot set cookies; middleware handles refresh
          }
        },
      },
    }
  )
}


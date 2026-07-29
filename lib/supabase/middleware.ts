import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Clone request headers so we can add x-pathname for server components
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })

  try {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/^"|"$/g, '')
    const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/^"|"$/g, '')

    if (!supabaseUrl || !supabaseAnonKey) {
      // Safely skip if env vars are not set yet
      return supabaseResponse
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const pathname = request.nextUrl.pathname

    // Protected route groups
    const isProtected =
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/orders') ||
      pathname.startsWith('/profile')

    const isAuthPage =
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/forgot-password')

    const hasAuthCookie = request.cookies.getAll().some(c => c.name.includes('sb-') || c.name.includes('supabase'))

    // Fast path for public pages: skip network call if not visiting auth/protected routes and no auth cookie present
    if (!isProtected && !isAuthPage && !hasAuthCookie) {
      return supabaseResponse
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && isProtected) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    if (user && isAuthPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  } catch (e) {
// console.error('[Middleware] Supabase session update error:', e) (removed for production)
  }

  return supabaseResponse
}

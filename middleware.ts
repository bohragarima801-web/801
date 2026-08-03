import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ---- Legacy/Corrupted Blog URL Redirect Guard ----
  if (pathname.startsWith('/blog/')) {
    const rawSlug = pathname.replace(/^\/blog\//, '')
    if (rawSlug.includes('divyayagyam.com') || rawSlug.includes('/') || rawSlug.includes('http') || rawSlug.includes('%2F')) {
      const decodedSlug = decodeURIComponent(rawSlug)
      const cleanSlug = decodedSlug
        .replace(/^https?:\/\//i, '')
        .replace(/^(?:[a-z0-9-]+\.)+[a-z]{2,}(?::\d+)?\/?/i, '')
        .replace(/^\/?blog\//i, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase()

      if (cleanSlug && `/blog/${cleanSlug}` !== pathname) {
        const url = request.nextUrl.clone()
        url.pathname = `/blog/${cleanSlug}`
        return NextResponse.redirect(url, 301)
      }
    }
  }

  // ---- Admin auth guard ----
  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login' || pathname.startsWith('/admin/login/')

  if (isAdminRoute && !isAdminLogin) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    const session = await verifyAdminToken(token)
    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  // If logged-in admin visits /admin/login, redirect to /admin
  if (isAdminLogin) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (await verifyAdminToken(token)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  const response = await updateSession(request)
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

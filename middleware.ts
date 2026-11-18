import { NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-session'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // ── CRITICAL SEO FIX: www → non-www 301 redirect ──
  // Resolves "Duplicate, Google chose different canonical" issue
  if (hostname.startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host = hostname.replace(/^www\./, '')
    url.protocol = 'https:'
    return NextResponse.redirect(url, { status: 301 })
  }

  // ── Permanently Discontinued Ghost Pujas (HTTP 410 Gone) ──
  // Prevents Soft-404 penalties on Google Search Console by explicitly signaling discontinued rituals
  const discontinuedGhostPujas = new Set([
    '/pujas/kalsarp-dosh-shanti-puja',
    '/pujas/kaal-sarp-dosh-nivaran-puja-jodhpur',
    '/pujas/durga-saptashati-108-samagri-mahayagya',
    '/pujas/durga-saptashati-hawan-puja',
    '/pujas/shani-saadesati-dhaiya-dosh-nivaran-yagya',
    '/pujas/navgrah-shanti-sarva-graha-dosh-nivaran-puja',
    '/pujas/maa-bagalamukhi-kavach-haldi-abhishek-puja',
    '/pujas/maa-bagalamukhi-kavach-puja',
    '/pujas/maa-pratyangira-tantrok-hawan-bali-yagya',
    '/pujas/maa-pratyangira-hawan-yagya',
    '/pujas/maa-varahi-land-property-dispute-yagya',
    '/pujas/maa-varahi-puja-yagya',
    '/pujas/maa-ashta-lakshmi-16-day-karz-mukti-mahayagya',
    '/pujas/maa-ashta-lakshmi-karz-mukti-puja',
    '/pujas/vastu-dosh-nivaran-puja-yagya',
    '/pujas/premium-tantrik-hawan-108-vishesh-samagri-se',
    '/pujas/vip-pitra-shanti-gita-path-shwet-til-hawan',
    '/pujas/pitra-gita-path-shwet-til-puja',
    '/pujas/pitra-shanti-vishesh-sarva-pitra-tarpan-puja',
    '/pujas/maa-bagalamukhi-',
    '/pujas/maa-baglamukhi-mirchi-hawan',
    '/pujas/maa-bagalamukhi-mirchi-hawan',
    '/pujas/mata-baglamukhi-mirchi-havan-sarva-karya-siddhi-mahayagya',
    '/pujas/maa-baglamukhi-mahayagya-mirchi-havan',
    '/pujas/rudrabhishek',
    '/pujas/rudrabhishek-mahapuja',
    '/pujas/maha-mrityunjay-jaap',
    '/pujas/mahamrityujaya-jaap-rudrabhishekam',
    '/pujas/11000-mahamrityunjaya-jaap-maharudrabhishekam',
    '/pujas/11000-maha-mrityunjay-mantra-jaap-panchamrit',
    '/pujas/maha-shiv-rudra-abhishek-pooja-21-brahmins',
    '/pujas/mahamrityunjaya-jaap-rudrabhishekam',
    '/products/siddha-pure-copper-naag-naagin-pair-rahu-shanti'
  ])

  if (discontinuedGhostPujas.has(pathname)) {
    return new NextResponse(
      '<!DOCTYPE html><html lang="hi"><head><meta charset="utf-8"/><title>410 Gone — अनुष्ठान उपलब्ध नहीं है | DivyaYagyam</title><meta name="robots" content="noindex, nofollow"/></head><body style="font-family:sans-serif;text-align:center;padding:60px 20px;background:#FAF8F5;color:#1C1614;"><div style="max-width:540px;margin:0 auto;background:#fff;padding:40px;border-radius:20px;border:1px solid #EFE4D6;box-shadow:0 4px 20px rgba(0,0,0,0.05);"><h1 style="color:#C2410C;font-size:24px;margin-bottom:12px;">410 — अनुष्ठान समाप्त या अनुपलब्ध</h1><p style="color:#64748B;font-size:14px;line-height:1.6;margin-bottom:24px;">यह पूजा/अनुष्ठान पृष्ठ वर्तमान में उपलब्ध नहीं है। आप दिव्ययज्ञम् पर उपलब्ध अन्य सक्रिय वैदिक पूजाएं एवं सेवाएं देख सकते हैं।</p><a href="/pujas" style="display:inline-block;background:#FF6600;color:#fff;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:bold;font-size:14px;">सक्रिय पूजाएं देखें ➔</a></div></body></html>',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow'
        }
      }
    )
  }

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

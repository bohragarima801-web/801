/**
 * lib/api-security.ts
 * Shared security utilities: CORS + Rate Limiting for API routes
 */
import { NextRequest, NextResponse } from 'next/server'

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://divyayagyam.com',
  'https://www.divyayagyam.com',
  'http://localhost:3000',
  'http://localhost:3001',
]

/**
 * Adds strict CORS headers — only allows trusted origins.
 * For payment and order endpoints, NEVER use wildcard CORS.
 */
export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get('origin') || ''
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'true'
    headers['Vary'] = 'Origin'
  }
  // No wildcard fallback for security

  return headers
}

/**
 * Applies CORS headers to an existing NextResponse
 */
export function withCors(req: NextRequest, res: NextResponse): NextResponse {
  const headers = corsHeaders(req)
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v))
  return res
}

/**
 * Creates an OPTIONS response for CORS preflight
 */
export function corsPreflightResponse(req: NextRequest): NextResponse {
  const headers = corsHeaders(req)
  headers['Access-Control-Max-Age'] = '86400' // 24h cache
  return new NextResponse(null, { status: 204, headers })
}

// ─── In-Memory Rate Limiter ─────────────────────────────────────────────────
// Serverless-compatible: works without Redis.
// NOTE: In serverless each function instance has its own memory,
// so this prevents abuse per-instance. For stricter limits, use Upstash Redis.

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes to prevent memory leaks
let lastCleanup = Date.now()
function cleanupIfNeeded() {
  const now = Date.now()
  if (now - lastCleanup < 5 * 60 * 1000) return
  lastCleanup = now
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) rateLimitStore.delete(key)
  }
}

export type RateLimitOptions = {
  /** Max requests per window */
  limit: number
  /** Window duration in ms (default: 60000 = 1 minute) */
  windowMs?: number
  /** Key prefix to namespace different rate limits */
  prefix?: string
}

/**
 * Checks rate limit for an IP. Returns null if OK, or a 429 NextResponse if exceeded.
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  cleanupIfNeeded()

  const { limit, windowMs = 60_000, prefix = 'rl' } = options

  const forwarded = req.headers.get('x-forwarded-for') || ''
  const ip = forwarded.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
  const key = `${prefix}:${ip}`
  const now = Date.now()

  const entry = rateLimitStore.get(key)
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  entry.count++
  if (entry.count > limit) {
    const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000)
    return NextResponse.json(
      {
        ok: false,
        error: 'बहुत अधिक requests आई हैं। कृपया थोड़ी देर बाद प्रयास करें।',
        retryAfterSeconds: retryAfterSec,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    )
  }

  return null
}

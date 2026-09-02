import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

const ALLOWED_ORIGINS = ['https://divyayagyam.com', 'https://www.divyayagyam.com', 'http://localhost:3000']

function corsHeaders(req: NextRequest) {
  const origin = req.headers.get('origin') || ''
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Vary'] = 'Origin'
  }
  return headers
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const checks: Record<string, { status: 'ok' | 'error'; latencyMs?: number; message?: string }> = {}

  // ── 1. Database Health Check ──────────────────────────────────────────────
  const dbStart = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = { status: 'ok', latencyMs: Date.now() - dbStart }
  } catch (err: any) {
    checks.database = { status: 'error', latencyMs: Date.now() - dbStart, message: err?.message || 'DB unreachable' }
  }

  // ── 2. Razorpay Keys Check ────────────────────────────────────────────────
  try {
    const keyId = await getSetting('secret.razorpay_key_id', 'RAZORPAY_KEY_ID')
    const keySecret = await getSetting('secret.razorpay_key_secret', 'RAZORPAY_KEY_SECRET')
    checks.razorpay = {
      status: keyId && keySecret ? 'ok' : 'error',
      message: keyId && keySecret ? 'Keys configured' : `Missing: ${!keyId ? 'KEY_ID ' : ''}${!keySecret ? 'KEY_SECRET' : ''}`.trim()
    }
  } catch (err: any) {
    checks.razorpay = { status: 'error', message: err?.message }
  }

  // ── 3. Webhook Secret Check ───────────────────────────────────────────────
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ||
      await getSetting('secret.razorpay_webhook_secret', 'RAZORPAY_WEBHOOK_SECRET')
    checks.webhookSecret = {
      status: webhookSecret ? 'ok' : 'error',
      message: webhookSecret ? 'Configured' : 'RAZORPAY_WEBHOOK_SECRET not set'
    }
  } catch {
    checks.webhookSecret = { status: 'error', message: 'Could not check' }
  }

  // ── 4. Cron Secret Check ──────────────────────────────────────────────────
  checks.cronSecret = {
    status: process.env.CRON_SECRET ? 'ok' : 'error',
    message: process.env.CRON_SECRET ? 'Configured' : 'CRON_SECRET not set — daily backup cron will fail'
  }

  // ── Determine overall status ──────────────────────────────────────────────
  const hasError = Object.values(checks).some(c => c.status === 'error')
  const overallStatus = hasError ? 'degraded' : 'healthy'
  const totalLatencyMs = Date.now() - startTime

  const responseBody = {
    ok: !hasError,
    status: overallStatus,
    service: 'Divyayagyam API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    latencyMs: totalLatencyMs,
    checks,
  }

  return new NextResponse(JSON.stringify(responseBody), {
    status: hasError ? 503 : 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
      ...corsHeaders(request),
    },
  })
}

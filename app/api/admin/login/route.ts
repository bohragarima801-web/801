import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_TTL_MS, signAdminToken } from '@/lib/admin-session'

import { initSecrets } from '@/lib/secrets'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

import { withSafeApi } from '@/lib/safe-api'

export const POST = withSafeApi(async (req: NextRequest) => {
  const { email, password } = await req.json()
  await initSecrets()

  const adminEmail = (process.env.ADMIN_EMAIL || 'infosecredsecet@gmail.com').trim().toLowerCase()
  const adminPass = process.env.ADMIN_PASSWORD || '!@#$Admin@1234@'

  if (!email || !password) {
    return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 });
  }

  const inputEmail = email.trim().toLowerCase()
  let isValid = false
  let loginEmail = inputEmail

  // 1. Strict Super Admin Validation (Strict Env Only)
  if (inputEmail === adminEmail && password === adminPass) {
    isValid = true
    loginEmail = adminEmail
  } else {
    // 2. Check Database for Admin User
    const dbUser = await prisma.user.findFirst({
      where: { email: { equals: inputEmail, mode: 'insensitive' } },
      include: { role: true }
    });

    if (dbUser && dbUser.passwordHash) {
      const isMatch = await bcrypt.compare(password, dbUser.passwordHash);
      if (isMatch) {
        if (dbUser.role && dbUser.status === 'ACTIVE') {
          isValid = true;
          loginEmail = inputEmail;
        } else {
          return NextResponse.json({ ok: false, error: 'Account inactive or missing admin privileges' }, { status: 403 });
        }
      }
    }
  }

  if (!isValid) {
    await new Promise((r) => setTimeout(r, 600))
    return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 });
  }

  const token = await signAdminToken(loginEmail)
  const res = NextResponse.json({ ok: true, redirect: '/admin' })
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
  })
  return res
})

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import type { RoleSlug } from '@/lib/rbac'

export type AuthUser = {
  id: string
  email: string
  fullName: string | null
  avatar: string | null
  role: RoleSlug | null
  supabaseId: string
}

export async function getSession() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  return data.user
}

import { getAdminSession } from '@/lib/admin-session'

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // 1. Check for local Admin JWT session (used by admin dashboard)
    const adminSession = await getAdminSession().catch((err) => {
// console.error('[getCurrentUser] getAdminSession error:', err) (removed for production)
      return null
    })
    if (adminSession) {
      const sessionEmail = adminSession.email.trim().toLowerCase()
      let dbAdmin = await prisma.user.findFirst({
        where: { 
          email: { equals: sessionEmail, mode: 'insensitive' }
        },
        include: { role: true }
      }).catch((err) => {
        return null
      })
      
      if (dbAdmin) {
        if (dbAdmin.status === 'SUSPENDED') {
          return null // Force session invalidation
        }
        
        return {
          id: dbAdmin.id,
          email: dbAdmin.email,
          fullName: dbAdmin.fullName,
          avatar: dbAdmin.avatar,
          role: (dbAdmin.role?.slug as RoleSlug) ?? 'staff',
          supabaseId: dbAdmin.supabaseId || dbAdmin.id,
        }
      }
      
      // Fallback: ONLY the configured environment Super Admin email gets system admin access if DB record missing
      const envAdminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : null
      if (envAdminEmail && sessionEmail === envAdminEmail) {
        return {
          id: 'admin-system-id',
          email: sessionEmail,
          fullName: 'System Administrator',
          avatar: null,
          role: 'super_admin' as RoleSlug,
          supabaseId: 'admin-system-id',
        }
      }

      return null
    }

    const supaUser = await getSession()
    if (!supaUser) return null

    // Try to find local user record; if not found, create one on the fly.
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: supaUser.id },
      include: { role: true },
    })

    if (!dbUser && supaUser.email) {
      const defaultRole = await prisma.role.findUnique({ where: { slug: 'devotee' } })
      dbUser = await prisma.user.create({
        data: {
          supabaseId: supaUser.id,
          email: supaUser.email,
          emailVerified: !!supaUser.email_confirmed_at,
          fullName: (supaUser.user_metadata?.full_name as string) || null,
          phone: (supaUser.user_metadata?.phone as string) || null,
          avatar: (supaUser.user_metadata?.avatar_url as string) || null,
          roleId: defaultRole?.id ?? null,
        },
        include: { role: true },
      })
    }

    if (!dbUser) return null

    return {
      id: dbUser.id,
      email: dbUser.email,
      fullName: dbUser.fullName,
      avatar: dbUser.avatar,
      role: (dbUser.role?.slug as RoleSlug) ?? 'devotee',
      supabaseId: dbUser.supabaseId!,
    }
  } catch (err) {
// console.error('[getCurrentUser] outer catch error:', err) (removed for production)
    // If DB is unreachable (e.g. dev env), fall back to Supabase user only.
    const supaUser = await getSession().catch((e) => {
// console.error('[getCurrentUser] getSession error in outer catch:', e) (removed for production)
      return null
    })
    if (!supaUser) return null
    return {
      id: supaUser.id,
      email: supaUser.email ?? '',
      fullName: (supaUser.user_metadata?.full_name as string) ?? null,
      avatar: (supaUser.user_metadata?.avatar_url as string) ?? null,
      role: 'devotee',
      supabaseId: supaUser.id,
    }
  }
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error('UNAUTHORIZED')
  return user
}

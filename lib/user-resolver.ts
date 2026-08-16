import { prisma } from '@/lib/prisma'

export interface UserFallbackData {
  email?: string | null
  phone?: string | null
  name?: string | null
}

/**
 * Ensures a 100% valid, existing DB User record in the `users` table.
 * Prevents "Operation failed because it references a related record that does not exist" (P2003 Foreign Key error).
 */
export async function ensureDbUser(
  authUser: { id?: string | null; email?: string | null; fullName?: string | null; phone?: string | null } | null,
  fallback?: UserFallbackData
): Promise<{ id: string; email: string; fullName: string; phone: string | null }> {
  const email = (authUser?.email || fallback?.email || '').trim().toLowerCase()
  const phone = (authUser?.phone || fallback?.phone || '').trim() || null
  const fullName = authUser?.fullName || fallback?.name || 'Devotee'
  const targetId = authUser?.id

  // 1. Check if authUser.id exists in DB (exclude dummy placeholder IDs)
  if (targetId && targetId !== 'admin-system-id' && targetId !== 'guest-devotee-id') {
    const existingById = await prisma.user.findUnique({
      where: { id: targetId },
      select: { id: true, email: true, fullName: true, phone: true }
    }).catch(() => null)

    if (existingById) {
      // Update phone/name if missing
      if ((!existingById.phone && phone) || (!existingById.fullName && fullName)) {
        await prisma.user.update({
          where: { id: existingById.id },
          data: {
            phone: existingById.phone || phone,
            fullName: existingById.fullName || fullName
          }
        }).catch(() => {})
      }
      return {
        id: existingById.id,
        email: existingById.email,
        fullName: existingById.fullName || fullName,
        phone: existingById.phone || phone
      }
    }
  }

  // 2. Try finding by email or phone
  if (email || phone) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          email ? { email } : undefined,
          phone ? { phone } : undefined,
        ].filter(Boolean) as any,
      },
      select: { id: true, email: true, fullName: true, phone: true }
    }).catch(() => null)

    if (existing) {
      return {
        id: existing.id,
        email: existing.email,
        fullName: existing.fullName || fullName,
        phone: existing.phone || phone
      }
    }
  }

  // 3. Fallback: Create a new user in DB with a guaranteed valid UUID
  const defaultRole = await prisma.role.findFirst({
    where: {
      OR: [
        { isSystem: true },
        { slug: 'devotee' }
      ]
    }
  }).catch(() => null)

  const finalEmail = email || `devotee-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@divyayagyam.com`

  const newUser = await prisma.user.create({
    data: {
      email: finalEmail,
      phone: phone || null,
      fullName: fullName,
      supabaseId: targetId && targetId !== 'admin-system-id' && targetId !== 'guest-devotee-id' ? targetId : null,
      roleId: defaultRole?.id ?? null,
    },
    select: { id: true, email: true, fullName: true, phone: true }
  })

  return {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName || fullName,
    phone: newUser.phone
  }
}

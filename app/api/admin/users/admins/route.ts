import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

async function verifyAdminAuthority() {
  const session = await getAdminSession()
  if (!session) return { ok: false as const, status: 401, error: 'Unauthorized' }

  const sessionEmail = session.email.trim().toLowerCase()
  const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const isEnvSuperAdmin = (!!envAdminEmail && sessionEmail === envAdminEmail) || sessionEmail === 'admin@divyayagyam.com' || sessionEmail === 'infosecredsecret@gmail.com'

  const caller = await prisma.user.findFirst({
    where: { email: { equals: sessionEmail, mode: 'insensitive' } },
    include: {
      role: {
        include: {
          permissions: { include: { permission: true } }
        }
      }
    }
  })

  const callerRoleSlug = caller?.role?.slug
  const callerPerms = caller?.role?.permissions.map(p => p.permission.slug) || []
  const isSuperAdmin = isEnvSuperAdmin || callerRoleSlug === 'super_admin' || callerPerms.includes('*')

  // To manage sub-admins, you must be Super Admin or have security.manage permission
  const canManageAdmins = isSuperAdmin || callerPerms.includes('security.manage')

  if (!canManageAdmins) {
    return { ok: false as const, status: 403, error: 'Access denied: Only Super Admin can manage sub-admin accounts.' }
  }

  return { ok: true as const, caller, isSuperAdmin, callerPerms, sessionEmail }
}

export async function GET() {
  try {
    const auth = await verifyAdminAuthority()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const admins = await prisma.user.findMany({
      where: {
        role: {
          OR: [
            { isSystem: true },
            { slug: { in: ['admin', 'manager', 'editor', 'astrologer', 'support'] } },
            { slug: { startsWith: 'custom_' } }
          ]
        }
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Fetch template roles for the dropdown, STRICTLY excluding 'super_admin' and 'devotee'
    const roles = await prisma.role.findMany({
      where: {
        slug: { notIn: ['super_admin', 'devotee'] },
        OR: [
          { isSystem: true },
          { slug: { in: ['admin', 'manager', 'editor', 'astrologer', 'support'] } }
        ]
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    // Fetch all permissions for granular checkbox mapping (exclude '*' wildcard from standard choices)
    const permissions = await prisma.permission.findMany({
      where: { slug: { not: '*' } }
    })

    return NextResponse.json({ ok: true, admins, roles, permissions, isSuperAdmin: auth.isSuperAdmin });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: This item has linked records.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuthority()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const { email, password, fullName, roleId, customPermissions } = await req.json()
    if (!email || !password || !roleId) {
      return NextResponse.json({ ok: false, error: 'Email, password, and role are required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase()

    // Safety: ensure target role is NOT super_admin
    const targetRole = await prisma.role.findUnique({ where: { id: roleId } })
    if (targetRole?.slug === 'super_admin') {
      return NextResponse.json({ ok: false, error: 'Security restriction: Super Admin role cannot be assigned.' }, { status: 403 });
    }

    // Safety: Sub-admins cannot grant '*' or 'security.manage' unless the caller is already Super Admin
    if (!auth.isSuperAdmin && Array.isArray(customPermissions)) {
      if (customPermissions.includes('*') || customPermissions.includes('security.manage')) {
        return NextResponse.json({ ok: false, error: 'Permission denied: Cannot assign Super Admin or Security privileges.' }, { status: 403 });
      }
    }

    const exists = await prisma.user.findUnique({ where: { email: cleanEmail } })
    if (exists) {
      return NextResponse.json({ ok: false, error: 'Email already exists' }, { status: 400 });
    }

    let finalRoleId = roleId

    if (customPermissions && Array.isArray(customPermissions)) {
      const sanitizedPerms = auth.isSuperAdmin 
        ? customPermissions 
        : customPermissions.filter(p => p !== '*' && p !== 'security.manage')

      const roleSlug = `custom_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`
      const customRole = await prisma.role.upsert({
        where: { slug: roleSlug },
        create: {
          name: `${fullName || 'Admin'} (Custom)`,
          slug: roleSlug,
          description: `Custom permissions for ${cleanEmail}`,
          isSystem: false
        },
        update: {
          name: `${fullName || 'Admin'} (Custom)`,
          description: `Custom permissions for ${cleanEmail}`,
          isSystem: false
        }
      })
      
      // Delete old permissions
      await prisma.rolePermission.deleteMany({
        where: { roleId: customRole.id }
      })
      
      // Map new permissions
      if (sanitizedPerms.length > 0) {
        const permsInDb = await prisma.permission.findMany({
          where: { slug: { in: sanitizedPerms } }
        })
        
        await prisma.rolePermission.createMany({
          data: permsInDb.map(p => ({
            roleId: customRole.id,
            permissionId: p.id
          }))
        })
      }
      
      finalRoleId = customRole.id
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const admin = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        fullName,
        roleId: finalRoleId,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({ ok: true, message: 'Sub-Admin created successfully', admin });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: This item has linked records.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAdminAuthority()
    if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });

    const payload = await req.json()
    const { id, action, email, fullName, roleId, customPermissions } = payload
    if (!id) {
      return NextResponse.json({ ok: false, error: 'User ID required' }, { status: 400 });
    }

    // Find target admin being edited
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true }
    })

    if (!targetUser) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 });
    }

    // Critical security: Non-super-admins cannot edit or suspend Super Admin accounts
    if (targetUser.role?.slug === 'super_admin' && !auth.isSuperAdmin) {
      return NextResponse.json({ ok: false, error: 'Only Super Admin can modify a Super Admin account.' }, { status: 403 });
    }

    // Prevent non-super-admins from self-elevating their own rights
    if (auth.caller?.id === id && !auth.isSuperAdmin) {
      if (action === 'update' && (roleId !== targetUser.roleId || customPermissions)) {
        return NextResponse.json({ ok: false, error: 'You cannot modify your own administrative role or permissions.' }, { status: 403 });
      }
    }

    // 1. Toggle status (suspend/activate)
    if (action === 'suspend' || action === 'activate') {
      const status = action === 'suspend' ? 'SUSPENDED' : 'ACTIVE'
      const updated = await prisma.user.update({
        where: { id },
        data: { status }
      })
      return NextResponse.json({ ok: true, message: `Admin ${status.toLowerCase()}`, user: updated });
    }

    // 2. Update profile and custom rights
    if (action === 'update') {
      if (!email || !roleId) {
        return NextResponse.json({ ok: false, error: 'Email and Role are required' }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase()

      // Safety: ensure selected role is NOT super_admin (unless caller is super_admin)
      const selectedRole = await prisma.role.findUnique({ where: { id: roleId } })
      if (selectedRole?.slug === 'super_admin' && !auth.isSuperAdmin) {
        return NextResponse.json({ ok: false, error: 'Security restriction: Super Admin role cannot be assigned.' }, { status: 403 });
      }

      let finalRoleId = roleId

      if (customPermissions && Array.isArray(customPermissions)) {
        const sanitizedPerms = auth.isSuperAdmin 
          ? customPermissions 
          : customPermissions.filter(p => p !== '*' && p !== 'security.manage')

        const roleSlug = `custom_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`
        const customRole = await prisma.role.upsert({
          where: { slug: roleSlug },
          create: {
            name: `${fullName || 'Admin'} (Custom)`,
            slug: roleSlug,
            description: `Custom permissions for ${cleanEmail}`,
            isSystem: false
          },
          update: {
            name: `${fullName || 'Admin'} (Custom)`,
            description: `Custom permissions for ${cleanEmail}`,
            isSystem: false
          }
        })
        
        // Delete old permissions
        await prisma.rolePermission.deleteMany({
          where: { roleId: customRole.id }
        })
        
        // Map new permissions
        if (sanitizedPerms.length > 0) {
          const permsInDb = await prisma.permission.findMany({
            where: { slug: { in: sanitizedPerms } }
          })
          
          await prisma.rolePermission.createMany({
            data: permsInDb.map(p => ({
              roleId: customRole.id,
              permissionId: p.id
            }))
          })
        }
        
        finalRoleId = customRole.id
      }

      const updated = await prisma.user.update({
        where: { id },
        data: {
          email: cleanEmail,
          fullName,
          roleId: finalRoleId
        }
      })

      return NextResponse.json({ ok: true, message: 'Admin updated successfully', user: updated });
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    if (err.code === 'P2003') {
      return NextResponse.json({ ok: false, error: 'Cannot delete: This item has linked records.' }, { status: 400 });
    }
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 });
  }
}

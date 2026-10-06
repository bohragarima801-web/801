import { prisma } from '@/lib/prisma'

/**
 * Safely and permanently deletes a user or administrator without failing on foreign key constraints (P2003).
 * Reassigns financial/booking history to primary admin if needed and cleans up custom roles and sessions.
 */
export async function safelyDeleteUser(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true }
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Absolute protection for primary Super Admin
  if (user.email.toLowerCase() === 'admin@divyayagyam.com') {
    throw new Error('Primary Super Admin account (admin@divyayagyam.com) cannot be deleted.')
  }

  const roleId = user.roleId
  const isCustomRole = user.role?.slug?.startsWith('custom_')

  // Find primary admin to inherit orphaned business records (so customer orders/bookings aren't broken)
  const primaryAdmin = await prisma.user.findUnique({
    where: { email: 'admin@divyayagyam.com' },
    select: { id: true }
  })
  const fallbackAdminId = primaryAdmin?.id || null

  await prisma.$transaction(async (tx) => {
    // 1. Unlink author on blogs
    await tx.blog.updateMany({
      where: { authorId: userId },
      data: { authorId: null }
    }).catch(() => {})

    // 2. Clean up media, logs, support tickets & interactions
    await tx.mediaLibrary.deleteMany({ where: { userId } }).catch(() => {})
    await tx.auditLog.deleteMany({ where: { userId } }).catch(() => {})
    await tx.ticketMessage.deleteMany({ where: { userId } }).catch(() => {})
    await tx.supportTicket.deleteMany({ where: { userId } }).catch(() => {})
    await tx.eventRegistration.deleteMany({ where: { userId } }).catch(() => {})
    await tx.blogComment.deleteMany({ where: { userId } }).catch(() => {})
    await tx.communityLike.deleteMany({ where: { userId } }).catch(() => {})
    await tx.communityComment.deleteMany({ where: { userId } }).catch(() => {})
    await tx.communityPost.deleteMany({ where: { userId } }).catch(() => {})
    await tx.review.deleteMany({ where: { userId } }).catch(() => {})
    await tx.astroReport.deleteMany({ where: { userId } }).catch(() => {})
    await tx.pandit.deleteMany({ where: { userId } }).catch(() => {})
    await tx.session.deleteMany({ where: { userId } }).catch(() => {})
    await tx.notification.deleteMany({ where: { userId } }).catch(() => {})
    await tx.wishlist.deleteMany({ where: { userId } }).catch(() => {})
    await tx.cart.deleteMany({ where: { userId } }).catch(() => {})
    await tx.address.deleteMany({ where: { userId } }).catch(() => {})
    await tx.customerProfile.deleteMany({ where: { userId } }).catch(() => {})

    // 3. Reassign critical bookings, orders, payments, donations to primary admin
    if (fallbackAdminId) {
      await tx.booking.updateMany({ where: { userId }, data: { userId: fallbackAdminId } }).catch(() => {})
      await tx.order.updateMany({ where: { userId }, data: { userId: fallbackAdminId } }).catch(() => {})
      await tx.payment.updateMany({ where: { userId }, data: { userId: fallbackAdminId } }).catch(() => {})
      await tx.donation.updateMany({ where: { userId }, data: { userId: fallbackAdminId } }).catch(() => {})
      await tx.bhaktiSeva.updateMany({ where: { userId }, data: { userId: fallbackAdminId } }).catch(() => {})
    }

    // 4. Delete the User record
    await tx.user.delete({
      where: { id: userId }
    })

    // 5. If this user had a custom role (e.g. custom_email_com), clean it up
    if (isCustomRole && roleId) {
      await tx.rolePermission.deleteMany({ where: { roleId } }).catch(() => {})
      await tx.role.delete({ where: { id: roleId } }).catch(() => {})
    }
  })

  return true
}

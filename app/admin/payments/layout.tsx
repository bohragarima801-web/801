import { getAdminUser } from '@/lib/admin-session'
import { isSuperAdminAccount } from '@/lib/rbac'
import { redirect } from 'next/navigation'

export default async function AdminPaymentsLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser()
  if (!user) redirect('/admin/login')

  if (!isSuperAdminAccount(user)) {
    redirect('/admin?error=unauthorized_payments')
  }

  return <>{children}</>
}

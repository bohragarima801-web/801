'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { CheckCheck, Check } from 'lucide-react'

export function NotificationActions({ id, markAll }: { id?: string; markAll?: boolean }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function markRead() {
    setLoading(true)
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(markAll ? { all: true } : { id })
      })
      router.refresh()
    } catch { toast.error('Failed') }
    finally { setLoading(false) }
  }

  if (markAll) {
    return (
      <button onClick={markRead} disabled={loading}
        className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
        <CheckCheck className="h-3.5 w-3.5" />
        Mark All Read
      </button>
    )
  }

  return (
    <button onClick={markRead} disabled={loading}
      className="text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors">
      Mark read
    </button>
  )
}

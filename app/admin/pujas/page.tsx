'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flame, Star, CalendarClock, Video, Edit2, Trash2, Loader2, Plus, Calendar, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Puja {
  id: string
  name: string
  category?: { name: string }
  temple?: { name: string }
  price: number
  vipPrice?: number | null
  status: string
  isVip: boolean
  isOnline: boolean
  isFeatured: boolean
}

function PujasManager() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'all'

  const [pujas, setPujas] = useState<Puja[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const loadPujas = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/pujas')
      const data = await res.json()
      if (data.ok) {
        setPujas(data.pujas || [])
      } else {
        toast.error(data.error || 'Failed to load pujas')
      }
    } catch {
      toast.error('Network error loading pujas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPujas()
  }, [])

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    const isActivating = newStatus === 'PUBLISHED'

    try {
      setTogglingId(id)
      // Optimistic update
      setPujas((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      )

      const res = await fetch('/api/admin/pujas', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })

      const data = await res.json()
      if (data.ok) {
        if (isActivating) {
          toast.success('Puja ACTIVE ho gayi hai! Ab frontend me dikhegi.')
        } else {
          toast.info('Puja INACTIVE ho gayi hai! Frontend se hat gayi hai.')
        }
      } else {
        // Revert optimistic update
        setPujas((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: currentStatus } : p))
        )
        toast.error(data.error || 'Failed to update puja status')
      }
    } catch {
      // Revert optimistic update
      setPujas((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: currentStatus } : p))
      )
      toast.error('Network error updating puja status')
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this puja?')) return

    try {
      const res = await fetch(`/api/admin/pujas?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Puja deleted successfully')
        loadPujas()
      } else {
        toast.error(data.error || 'Failed to delete puja')
      }
    } catch {
      toast.error('Network error deleting puja')
    }
  }

  // Filter pujas based on active tab
  const filteredPujas = pujas.filter((p) => {
    if (activeTab === 'active') return p.status === 'PUBLISHED'
    if (activeTab === 'inactive') return p.status !== 'PUBLISHED'
    if (activeTab === 'featured') return p.isFeatured
    if (activeTab === 'vip') return p.isVip
    if (activeTab === 'live') return p.isOnline
    if (activeTab === 'upcoming') return p.status === 'PUBLISHED' && !p.isOnline
    return true
  })

  const tabs = [
    { label: 'All Pujas', value: 'all' },
    { label: '🟢 Active (Live Frontend)', value: 'active' },
    { label: '⚪ Inactive (Hidden)', value: 'inactive' },
    { label: '👑 VIP Pujas', value: 'vip' },
    { label: '🎥 Online Pujas', value: 'live' }
  ]

  const changeTab = (val: string) => {
    router.push(`/admin/pujas?tab=${val}`)
  }

  const activeCount = pujas.filter(p => p.status === 'PUBLISHED').length
  const inactiveCount = pujas.filter(p => p.status !== 'PUBLISHED').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Puja Management"
          description="Manage all pujas, active/inactive visibility, VIP rituals, slots, media & pricing."
          breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Pujas' }]}
        />

        <div className="flex flex-wrap gap-2 shrink-0">
          <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold shadow-md rounded-xl" asChild>
            <Link href="/admin/pujas/new?isVip=true">
              👑 Add VIP Puja (VIP पूजा बनाएँ)
            </Link>
          </Button>

          <Button size="sm" variant="outline" className="border-slate-300 font-bold rounded-xl" asChild>
            <Link href="/admin/pujas/new">
              <Plus className="mr-1 h-4 w-4" /> Add Normal Puja
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Pujas" value={pujas.length.toString()} icon={Flame} />
        <KpiCard title="Active (Frontend Live)" value={activeCount.toString()} icon={CheckCircle2} iconClass="text-emerald-500" />
        <KpiCard title="Inactive (Hidden)" value={inactiveCount.toString()} icon={XCircle} iconClass="text-slate-400" />
        <KpiCard title="VIP Pujas" value={pujas.filter(p => p.isVip).length.toString()} icon={Star} iconClass="text-yellow-500" />
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => changeTab(t.value)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${activeTab === t.value ? 'border-orange-500 text-orange-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            { key: 'name', label: 'Puja Name' },
            {
              key: 'category',
              label: 'Category',
              render: (r) => <span>{r.category?.name || '—'}</span>
            },
            {
              key: 'temple',
              label: 'Temple',
              render: (r) => <span>{r.temple?.name || '—'}</span>
            },
            {
              key: 'price',
              label: 'Base Price',
              render: (r) => <span className="font-bold">₹{r.price}</span>
            },
            {
              key: 'vipPrice',
              label: 'VIP Price',
              render: (r) => <span>{r.vipPrice ? `₹${r.vipPrice}` : '—'}</span>
            },
            {
              key: 'status',
              label: 'Status / Visibility',
              render: (r) => {
                const isActive = r.status === 'PUBLISHED'
                const isToggling = togglingId === r.id
                return (
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => handleToggleStatus(r.id, r.status)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-all border shadow-2xs ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}
                    title={isActive ? 'Click to deactivate (hide from frontend)' : 'Click to activate (show on frontend)'}
                  >
                    {isToggling ? (
                      <Loader2 className="h-3 w-3 animate-spin text-orange-600" />
                    ) : isActive ? (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                    )}
                    {isActive ? 'Active (Live)' : 'Inactive (Hidden)'}
                  </button>
                )
              }
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (r) => {
                const isActive = r.status === 'PUBLISHED'
                const isToggling = togglingId === r.id
                return (
                  <div className="flex items-center justify-end gap-2">
                    {/* Active / Inactive Toggle Button */}
                    <Button
                      size="sm"
                      variant={isActive ? "outline" : "default"}
                      disabled={isToggling}
                      onClick={() => handleToggleStatus(r.id, r.status)}
                      className={`h-8 px-2.5 text-xs font-extrabold rounded-lg transition-all ${
                        isActive
                          ? 'border-emerald-500 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 bg-emerald-50/50'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      }`}
                      title={isActive ? "Click to Deactivate Puja (Hide from frontend)" : "Click to Activate Puja (Show on frontend)"}
                    >
                      {isToggling ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : isActive ? (
                        <>
                          <Eye className="mr-1 h-3.5 w-3.5 text-emerald-600" /> Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-1 h-3.5 w-3.5 text-white" /> Activate
                        </>
                      )}
                    </Button>

                    {/* Edit Button */}
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" asChild>
                      <Link href={`/admin/pujas/new?id=${r.id}`} title="Edit Puja">
                        <Edit2 className="h-4 w-4" />
                      </Link>
                    </Button>

                    {/* Delete Button */}
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(r.id)} title="Delete Puja">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              },
              className: "text-right"
            }
          ]}
          rows={filteredPujas}
          searchPlaceholder="Search pujas by name..."
        />
      )}
    </div>
  )
}

export default function PujasPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    }>
      <PujasManager />
    </Suspense>
  )
}


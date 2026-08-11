'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import {
  MessageSquare, Phone, Plus, Edit2, Trash2, Star, CheckCircle2,
  ExternalLink, Loader2, Users, ShieldCheck, Sparkles, UserPlus
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'

interface TeamMember {
  id: string
  name: string
  phone: string
  role: string
  message: string
  isPrimary: boolean
  isActive: boolean
}

export default function WhatsAppManagementPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [widgetEnabled, setWidgetEnabled] = useState(true)
  const [widgetTitle, setWidgetTitle] = useState('DivyaYagyam WhatsApp Seva (व्हाट्सएप सहायता)')
  const [defaultPhone, setDefaultPhone] = useState('919530401984')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Dialog state for Add/Edit
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [memberName, setMemberName] = useState('')
  const [memberPhone, setMemberPhone] = useState('')
  const [memberRole, setMemberRole] = useState('')
  const [memberMessage, setMemberMessage] = useState('')
  const [memberIsPrimary, setMemberIsPrimary] = useState(false)
  const [memberIsActive, setMemberIsActive] = useState(true)

  async function loadData() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/whatsapp')
      const data = await res.json()
      if (data.ok) {
        setTeamMembers(data.data.teamMembers || [])
        setWidgetEnabled(data.data.widgetEnabled !== false)
        setWidgetTitle(data.data.widgetTitle || 'DivyaYagyam WhatsApp Seva')
        setDefaultPhone(data.data.defaultPhone || '919530401984')
      } else {
        toast.error(data.error || 'Failed to load WhatsApp configuration')
      }
    } catch {
      toast.error('Network error loading WhatsApp data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function openAddDialog() {
    setEditingId(null)
    setMemberName('')
    setMemberPhone('')
    setMemberRole('Puja & Sankalp Booking')
    setMemberMessage('जय श्री राम! मुझे पूजा एवं संकल्प बुकिंग के बारे में जानकारी चाहिए।')
    setMemberIsPrimary(teamMembers.length === 0)
    setMemberIsActive(true)
    setDialogOpen(true)
  }

  function openEditDialog(member: TeamMember) {
    setEditingId(member.id)
    setMemberName(member.name)
    setMemberPhone(member.phone)
    setMemberRole(member.role)
    setMemberMessage(member.message)
    setMemberIsPrimary(member.isPrimary)
    setMemberIsActive(member.isActive)
    setDialogOpen(true)
  }

  function handleSaveMember(e: React.FormEvent) {
    e.preventDefault()
    if (!memberName.trim()) {
      toast.error('Member name is required')
      return
    }
    if (!memberPhone.trim()) {
      toast.error('WhatsApp phone number is required')
      return
    }

    let cleanPhone = memberPhone.replace(/[^\d]/g, '')
    if (cleanPhone.length === 10) cleanPhone = `91${cleanPhone}`

    let updatedList: TeamMember[] = []

    if (editingId) {
      // Edit existing
      updatedList = teamMembers.map((m) => {
        if (m.id === editingId) {
          return {
            ...m,
            name: memberName.trim(),
            phone: cleanPhone,
            role: memberRole.trim(),
            message: memberMessage.trim(),
            isPrimary: memberIsPrimary,
            isActive: memberIsActive,
          }
        }
        return memberIsPrimary ? { ...m, isPrimary: false } : m
      })
    } else {
      // Add new
      const newMember: TeamMember = {
        id: `wa_${Date.now()}`,
        name: memberName.trim(),
        phone: cleanPhone,
        role: memberRole.trim(),
        message: memberMessage.trim(),
        isPrimary: memberIsPrimary || teamMembers.length === 0,
        isActive: memberIsActive,
      }
      updatedList = memberIsPrimary
        ? teamMembers.map((m) => ({ ...m, isPrimary: false })).concat(newMember)
        : [...teamMembers, newMember]
    }

    setTeamMembers(updatedList)
    setDialogOpen(false)
    saveAllToBackend(updatedList, widgetEnabled, widgetTitle)
  }

  function handleDeleteMember(id: string) {
    if (!confirm('Are you sure you want to remove this WhatsApp team member?')) return
    const updated = teamMembers.filter((m) => m.id !== id)
    if (updated.length > 0 && !updated.some((m) => m.isPrimary)) {
      updated[0].isPrimary = true
    }
    setTeamMembers(updated)
    saveAllToBackend(updated, widgetEnabled, widgetTitle)
  }

  function handleMakePrimary(id: string) {
    const updated = teamMembers.map((m) => ({
      ...m,
      isPrimary: m.id === id,
    }))
    setTeamMembers(updated)
    saveAllToBackend(updated, widgetEnabled, widgetTitle)
  }

  function handleToggleActive(id: string) {
    const updated = teamMembers.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    setTeamMembers(updated)
    saveAllToBackend(updated, widgetEnabled, widgetTitle)
  }

  async function saveAllToBackend(
    membersList = teamMembers,
    enabled = widgetEnabled,
    title = widgetTitle
  ) {
    setSaving(true)
    try {
      const primary = membersList.find((m) => m.isPrimary) || membersList[0]
      const res = await fetch('/api/admin/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamMembers: membersList,
          widgetEnabled: enabled,
          widgetTitle: title,
          defaultPhone: primary ? primary.phone : '919530401984',
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message || 'WhatsApp configuration saved live!')
      } else {
        toast.error(data.error || 'Failed to save configuration')
      }
    } catch {
      toast.error('Network error saving WhatsApp configuration')
    } finally {
      setSaving(false)
    }
  }

  const activeCount = teamMembers.filter((m) => m.isActive).length
  const primaryMember = teamMembers.find((m) => m.isPrimary) || teamMembers[0]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PageHeader
        title="WhatsApp Seva & Team Management"
        description="Add multiple team WhatsApp numbers to connect devotees directly to WhatsApp Business."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'WhatsApp Management' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Team WhatsApp Lines"
          value={teamMembers.length}
          changeLabel="Configured"
          icon={Users}
        />
        <KpiCard
          title="Active WhatsApp Lines"
          value={activeCount}
          changeLabel="Live on Site"
          icon={CheckCircle2}
        />
        <KpiCard
          title="Primary Helpline"
          value={primaryMember ? `+${primaryMember.phone}` : 'Not Set'}
          changeLabel={primaryMember ? primaryMember.name : ''}
          icon={Phone}
        />
        <KpiCard
          title="Floating Chat Widget"
          value={widgetEnabled ? 'ACTIVE ✅' : 'DISABLED ❌'}
          changeLabel="Real-time Status"
          icon={MessageSquare}
        />
      </div>

      {/* Global Widget Control */}
      <Card className="rounded-3xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" /> Floating WhatsApp Widget Settings
            </span>
            {saving && <span className="text-xs text-emerald-600 flex items-center gap-1 font-normal"><Loader2 className="h-3 w-3 animate-spin" /> Syncing live...</span>}
          </CardTitle>
          <CardDescription className="text-xs">
            Control the floating WhatsApp chat widget that appears at the bottom-right of the website for all devotees.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
            <div>
              <Label htmlFor="widgetSwitch" className="font-bold text-sm text-slate-800 cursor-pointer">
                Enable Floating WhatsApp Chat Widget
              </Label>
              <p className="text-xs text-slate-500 mt-0.5">
                Displays WhatsApp icon with team member selection modal on every page.
              </p>
            </div>
            <Switch
              id="widgetSwitch"
              checked={widgetEnabled}
              onCheckedChange={(checked) => {
                setWidgetEnabled(checked)
                saveAllToBackend(teamMembers, checked, widgetTitle)
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wTitle" className="text-xs font-bold text-slate-700">Widget Modal Header Title</Label>
            <Input
              id="wTitle"
              placeholder="e.g. DivyaYagyam WhatsApp Seva (व्हाट्सएप सहायता)"
              value={widgetTitle}
              onChange={(e) => setWidgetTitle(e.target.value)}
              onBlur={() => saveAllToBackend(teamMembers, widgetEnabled, widgetTitle)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Team WhatsApp Numbers Section */}
      <Card className="rounded-3xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" /> Team WhatsApp Business Numbers
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Add multiple numbers for different departments (Booking, Prasad, Astrology, Admin).
            </CardDescription>
          </div>
          <Button onClick={openAddDialog} className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-sm">
            <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 opacity-50" />
              <span>Loading WhatsApp team members...</span>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed rounded-2xl space-y-3">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">No Team Numbers Added Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your team WhatsApp numbers so devotees can connect with your business WhatsApp.
              </p>
              <Button onClick={openAddDialog} variant="outline" className="border-emerald-500 text-emerald-700">
                <Plus className="mr-2 h-4 w-4" /> Add First WhatsApp Number
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member) => {
                const waUrl = `https://wa.me/${member.phone}?text=${encodeURIComponent(member.message)}`
                return (
                  <div
                    key={member.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                      member.isPrimary
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{member.name}</h4>
                          {member.isPrimary && (
                            <Badge className="bg-emerald-600 text-white font-bold text-[10px] uppercase">
                              ★ Primary
                            </Badge>
                          )}
                          {!member.isActive && (
                            <Badge variant="secondary" className="text-[10px]">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-emerald-700">{member.role}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(member)}
                          title="Edit Member"
                          className="h-8 w-8 text-slate-600 hover:text-slate-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteMember(member.id)}
                          title="Delete Member"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <p className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-emerald-600" /> +{member.phone}
                      </p>
                      <p className="line-clamp-2 italic text-slate-500 bg-slate-100/70 p-2 rounded-lg mt-1">
                        "{member.message}"
                      </p>
                    </div>

                    <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={member.isActive}
                          onCheckedChange={() => handleToggleActive(member.id)}
                        />
                        <span className="text-xs text-slate-500">
                          {member.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!member.isPrimary && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMakePrimary(member.id)}
                            className="text-xs text-amber-700 hover:text-amber-900 font-semibold"
                          >
                            <Star className="h-3.5 w-3.5 mr-1 text-amber-500" /> Make Primary
                          </Button>
                        )}

                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Test Link
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Member Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
              {editingId ? 'Edit WhatsApp Team Member' : 'Add New WhatsApp Team Member'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Enter the WhatsApp number and default message for this team member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveMember} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="mName" className="text-xs font-bold">Member / Desk Name *</Label>
              <Input
                id="mName"
                placeholder="e.g. Pandit Seva Desk"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mPhone" className="text-xs font-bold">WhatsApp Business Number (with 91) *</Label>
              <Input
                id="mPhone"
                placeholder="e.g. 919530401984 or 9530401984"
                value={memberPhone}
                onChange={(e) => setMemberPhone(e.target.value)}
                required
              />
              <p className="text-[11px] text-slate-500">Include country code 91 for India.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mRole" className="text-xs font-bold">Role / Department</Label>
              <Input
                id="mRole"
                placeholder="e.g. Online Puja & Sankalp Booking"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mMsg" className="text-xs font-bold">Default Pre-filled WhatsApp Message</Label>
              <Textarea
                id="mMsg"
                placeholder="e.g. जय श्री राम! मुझे पूजा बुकिंग के बारे में जानकारी चाहिए।"
                value={memberMessage}
                onChange={(e) => setMemberMessage(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
              <div>
                <Label htmlFor="mPrimary" className="text-xs font-bold cursor-pointer">Set as Primary Helpline</Label>
                <p className="text-[11px] text-slate-500">Will be used for default website WhatsApp buttons.</p>
              </div>
              <Switch
                id="mPrimary"
                checked={memberIsPrimary}
                onCheckedChange={setMemberIsPrimary}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                {editingId ? 'Update Member' : 'Save Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

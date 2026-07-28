'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { MapPin, Plus, X, Loader2, Star, Trash2, Home, Building2, Package } from 'lucide-react'

const ADDRESS_TYPES = ['HOME', 'WORK', 'OTHER']
const TYPE_ICONS: Record<string, any> = { HOME: Home, WORK: Building2, OTHER: Package }

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [form, setForm] = useState({
    fullName: '', phone: '', line1: '', line2: '',
    landmark: '', city: '', state: '', pincode: '',
    country: 'India', type: 'HOME', isDefault: false
  })

  useEffect(() => { fetchAddresses() }, [])

  async function fetchAddresses() {
    try {
      const res = await fetch('/api/profile/addresses')
      const data = await res.json()
      if (data.ok) setAddresses(data.data)
    } catch { toast.error('Failed to load addresses') }
    finally { setLoading(false) }
  }

  async function addAddress(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/profile/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Address saved!')
      setShowForm(false)
      setForm({ fullName: '', phone: '', line1: '', line2: '', landmark: '', city: '', state: '', pincode: '', country: 'India', type: 'HOME', isDefault: false })
      fetchAddresses()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  async function deleteAddress(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/profile/addresses?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Address deleted')
      setAddresses(prev => prev.filter(a => a.id !== id))
    } catch (err: any) { toast.error(err.message) }
    finally { setDeletingId(null) }
  }

  async function setDefault(id: string) {
    try {
      const res = await fetch('/api/profile/addresses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDefault: true })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Default address updated')
      fetchAddresses()
    } catch (err: any) { toast.error(err.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved Addresses</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your delivery addresses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Address'}
        </button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-5 text-slate-800">📍 New Address</h2>
          <form onSubmit={addAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
              <input required value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                placeholder="Recipient name" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Phone *</label>
              <input required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="10-digit mobile number" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Address Line 1 *</label>
              <input required value={form.line1} onChange={e => setForm(p => ({ ...p, line1: e.target.value }))}
                placeholder="House/Flat No., Street, Colony" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Address Line 2</label>
              <input value={form.line2} onChange={e => setForm(p => ({ ...p, line2: e.target.value }))}
                placeholder="Area, Locality (Optional)" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">City *</label>
              <input required value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                placeholder="City" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">State *</label>
              <input required value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                placeholder="State" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pincode *</label>
              <input required value={form.pincode} onChange={e => setForm(p => ({ ...p, pincode: e.target.value }))}
                placeholder="6-digit pincode" maxLength={6} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                {ADDRESS_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm(p => ({ ...p, isDefault: e.target.checked }))}
                className="h-4 w-4 text-orange-600 rounded" />
              <label htmlFor="isDefault" className="text-sm font-medium text-slate-700">Set as default delivery address</label>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                Save Address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
      ) : addresses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 text-lg">No Addresses Saved</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Add your delivery addresses for faster checkout.</p>
          <button onClick={() => setShowForm(true)}
            className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-700 transition-colors">
            Add First Address
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map(addr => {
            const TypeIcon = TYPE_ICONS[addr.type] || Home
            return (
              <div key={addr.id} className={`bg-white border-2 rounded-2xl p-5 relative transition-all ${addr.isDefault ? 'border-orange-400 shadow-md shadow-orange-100' : 'border-slate-200 hover:border-slate-300'}`}>
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                    <Star className="h-3 w-3 fill-orange-500" /> Default
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <TypeIcon className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{addr.type}</span>
                </div>
                <p className="font-bold text-slate-800 text-sm">{addr.fullName}</p>
                <p className="text-sm text-slate-600 mt-0.5">{addr.phone}</p>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                  {addr.city}, {addr.state} - {addr.pincode}<br />
                  {addr.country}
                </p>
                <div className="flex gap-2 mt-4">
                  {!addr.isDefault && (
                    <button onClick={() => setDefault(addr.id)}
                      className="flex-1 text-xs font-bold text-orange-600 border border-orange-300 hover:bg-orange-50 py-2 rounded-lg transition-colors">
                      Set Default
                    </button>
                  )}
                  <button onClick={() => deleteAddress(addr.id)} disabled={deletingId === addr.id}
                    className="flex items-center gap-1.5 text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:opacity-50">
                    {deletingId === addr.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

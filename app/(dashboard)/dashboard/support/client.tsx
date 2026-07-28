'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Loader2, Send, MessageSquare, Plus, X, ChevronDown, ChevronUp, User, Shield } from 'lucide-react'

const CATEGORIES = [
  'Order Issue', 'Booking Issue', 'Payment Issue',
  'Product Question', 'Refund Request', 'General Inquiry', 'Other'
]

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  OPEN:        { label: '🟡 Open',        color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  IN_PROGRESS: { label: '🔵 In Progress', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  RESOLVED:    { label: '✅ Resolved',    color: 'bg-green-100 text-green-800 border-green-300' },
  CLOSED:      { label: '⚫ Closed',      color: 'bg-gray-100 text-gray-600 border-gray-300' },
}

export default function SupportClient() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [replying, setReplying] = useState<string | null>(null)

  // New ticket form
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Order Issue')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchTickets() }, [])

  async function fetchTickets() {
    setLoading(true)
    try {
      const res = await fetch('/api/support')
      const data = await res.json()
      if (data.ok) setTickets(data.data)
    } catch { toast.error('Failed to load tickets') }
    finally { setLoading(false) }
  }

  async function submitTicket(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, description, category })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('✅ Ticket submitted! We\'ll respond within 24 hours.')
      setSubject(''); setDescription(''); setCategory('Order Issue')
      setShowForm(false)
      fetchTickets()
    } catch (err: any) { toast.error(err.message) }
    finally { setSubmitting(false) }
  }

  async function sendReply(ticketId: string) {
    const msg = replyText[ticketId]?.trim()
    if (!msg) return
    setReplying(ticketId)
    try {
      const res = await fetch(`/api/support/${ticketId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success('Reply sent!')
      setReplyText(prev => ({ ...prev, [ticketId]: '' }))
      // Update ticket messages in local state
      setTickets(prev => prev.map(t =>
        t.id === ticketId
          ? { ...t, messages: [...(t.messages || []), data.data] }
          : t
      ))
    } catch (err: any) { toast.error(err.message) }
    finally { setReplying(null) }
  }

  const fmtDate = (d: string) => new Date(d).toLocaleString('hi-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="space-y-6">
      {/* Header + New Ticket Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Support</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Raise a complaint or track your tickets</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-md"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'New Ticket'}
        </button>
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <div className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-slate-800">📝 Submit New Ticket</h2>
          <form onSubmit={submitTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Order #ORD-123 not received"
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your issue in detail..."
                rows={4}
                required
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit Ticket
            </button>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-700 text-lg">No Support Tickets Yet</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">Need help? Click "New Ticket" to reach our support team.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-700 transition-colors"
          >
            Raise a Complaint
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => {
            const isOpen = expandedId === ticket.id
            const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN
            return (
              <div key={ticket.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Ticket Header */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : ticket.id)}
                  className="w-full text-left p-5 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      {ticket.category && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          {ticket.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">{ticket.subject}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      #{ticket.ticketNumber} · {fmtDate(ticket.createdAt)}
                      {ticket.messages?.length > 0 && ` · ${ticket.messages.length} message${ticket.messages.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="shrink-0 text-slate-400">
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </button>

                {/* Expanded: Conversation Thread */}
                {isOpen && (
                  <div className="border-t border-slate-100">
                    {/* Original message */}
                    <div className="px-5 pt-4 pb-3">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-orange-600" />
                        </div>
                        <div className="flex-1 bg-orange-50 border border-orange-100 rounded-xl p-3">
                          <p className="text-xs font-semibold text-orange-700 mb-1">You</p>
                          <p className="text-sm text-slate-700 leading-relaxed">{ticket.description}</p>
                          <p className="text-xs text-slate-400 mt-2">{fmtDate(ticket.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages thread */}
                    {(ticket.messages || []).map((msg: any) => {
                      const isAdmin = msg.isInternal === false && msg.userId !== ticket.userId
                      return (
                        <div key={msg.id} className={`px-5 pb-3 flex gap-3 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-blue-100' : 'bg-orange-100'}`}>
                            {isAdmin
                              ? <Shield className="h-4 w-4 text-blue-600" />
                              : <User className="h-4 w-4 text-orange-600" />
                            }
                          </div>
                          <div className={`flex-1 rounded-xl p-3 border ${isAdmin ? 'bg-blue-50 border-blue-100' : 'bg-orange-50 border-orange-100'}`}>
                            <p className={`text-xs font-semibold mb-1 ${isAdmin ? 'text-blue-700' : 'text-orange-700'}`}>
                              {isAdmin ? '🛡️ Support Team' : 'You'}
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed">{msg.message}</p>
                            <p className="text-xs text-slate-400 mt-2">{fmtDate(msg.createdAt)}</p>
                          </div>
                        </div>
                      )
                    })}

                    {/* Reply Box */}
                    {ticket.status !== 'CLOSED' && (
                      <div className="px-5 pb-5 border-t border-slate-100 pt-4">
                        <p className="text-xs font-semibold text-slate-500 mb-2">Reply to this ticket:</p>
                        <div className="flex gap-2">
                          <textarea
                            rows={2}
                            value={replyText[ticket.id] || ''}
                            onChange={e => setReplyText(prev => ({ ...prev, [ticket.id]: e.target.value }))}
                            placeholder="Type your reply..."
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                          />
                          <button
                            onClick={() => sendReply(ticket.id)}
                            disabled={replying === ticket.id || !replyText[ticket.id]?.trim()}
                            className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors self-end"
                          >
                            {replying === ticket.id
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Send className="h-4 w-4" />
                            }
                          </button>
                        </div>
                      </div>
                    )}
                    {ticket.status === 'CLOSED' && (
                      <div className="px-5 pb-4">
                        <p className="text-xs text-slate-400 text-center bg-slate-50 py-2 rounded-lg">
                          This ticket is closed. Open a new ticket if you need further assistance.
                        </p>
                      </div>
                    )}
                    <div ref={bottomRef} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Code, ShieldAlert, Star, ExternalLink, Search, Sparkles, Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function ToolsListPage() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'custom' | 'react' | 'free' | 'paid'>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/admin/tools')
      const data = await res.json()
      if (data.ok) setTools(data.data || [])
    } catch (err) {
      toast.error('Failed to load tools')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTools()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`क्या आप वाकई "${name}" टूल को डिलीट करना चाहते हैं?`)) return
    try {
      const res = await fetch(`/api/admin/tools?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.ok) {
        toast.success('Tool deleted successfully')
        fetchTools()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch (err) {
      toast.error('Network error')
    }
  }

  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/tools/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    toast.success('Direct URL copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()))

    if (!matchesSearch) return false

    const hasCustomHtml = tool.htmlCode && tool.htmlCode.trim().length > 0 && tool.htmlCode !== '<p></p>'
    if (filterType === 'custom') return hasCustomHtml
    if (filterType === 'react') return !hasCustomHtml
    if (filterType === 'free') return tool.isFree
    if (filterType === 'paid') return !tool.isFree

    return true
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      <PageHeader
        title="Vedic & Spiritual Tools"
        description="Manage your interactive HTML/JS calculators, custom oracles, and pre-built Vedic algorithms."
        action={{ label: 'Add New Tool', href: '/admin/tools/new' }}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search tools by name, slug or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Tools' },
            { id: 'custom', label: 'Custom HTML/JS' },
            { id: 'react', label: 'React Mapped' },
            { id: 'free', label: 'Free' },
            { id: 'paid', label: 'Premium' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === f.id ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 font-bold text-slate-500">Loading Vedic tools...</div>
      ) : filteredTools.length === 0 ? (
        <Card className="text-center py-20 border-dashed rounded-3xl">
          <CardContent className="space-y-4">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-slate-800">No tools match your criteria</h3>
              <p className="text-sm text-slate-500">Try changing the search keyword or filter options.</p>
            </div>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 font-bold rounded-xl">
              <Link href="/admin/tools/new">Create New Tool</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const hasCustomHtml = tool.htmlCode && tool.htmlCode.trim().length > 0 && tool.htmlCode !== '<p></p>'
            return (
              <Card
                key={tool.id}
                className="relative overflow-hidden group hover:border-orange-300 hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between"
              >
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="h-11 w-11 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center font-bold">
                      <Code className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyLink(tool.slug, tool.id)}
                        className="h-8 w-8 text-slate-400 hover:text-slate-700"
                        title="Copy direct live URL"
                      >
                        {copiedId === tool.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-orange-600">
                        <Link href={`/tools/${tool.slug}`} target="_blank" title="View in frontend">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-400 hover:text-blue-600">
                        <Link href={`/admin/tools/new?id=${tool.id}`} title="Edit tool">
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tool.id, tool.name)}
                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete tool"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2">{tool.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">/tools/{tool.slug}</p>
                    {tool.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 mt-1">{tool.description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <Badge variant={tool.isActive ? 'default' : 'secondary'} className="text-[10px]">
                      {tool.isActive ? 'Active' : 'Draft'}
                    </Badge>
                    {tool.isFree ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        Free
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 text-[10px] flex items-center gap-1">
                        <Star className="h-2.5 w-2.5" /> ₹{Number(tool.price)}
                      </Badge>
                    )}
                    {hasCustomHtml ? (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">
                        Custom HTML/JS
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                        React Mapped
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Updated: {new Date(tool.createdAt).toLocaleDateString('hi-IN')}</span>
                  <Link
                    href={`/admin/tools/new?id=${tool.id}`}
                    className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    Edit & Preview ➔
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

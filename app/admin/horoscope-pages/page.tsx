'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText, Plus, ExternalLink, Copy, Check, Trash2, Edit,
  Eye, Code2, Sparkles, Layout, MessageCircle, ShieldCheck,
  RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { HoroscopeLandingViewer } from '@/components/horoscope-landing-viewer'
import type { HoroscopeCustomPage } from '@/lib/horoscope-pages'

const CODE_TEMPLATES = {
  vedicCard: `<div style="text-align: center; max-width: 700px; margin: 0 auto; padding: 20px;">
  <span style="display: inline-block; padding: 4px 14px; background: #FAF6ED; color: #7A1F2B; border-radius: 999px; font-weight: bold; font-size: 13px; border: 1px solid #E8DDD0;">
    ॐ पावन जन्मकुंडली विश्लेषण
  </span>
  <h2 style="font-size: 26px; font-weight: 800; color: #241A18; margin: 16px 0 10px;">
    आपकी जन्मकुंडली में ग्रहों की दशा व सटीक मार्गदर्शन
  </h2>
  <p style="font-size: 15px; color: #6F625D; line-height: 1.6;">
    27+ वर्षों के अनुभवी वैदिक आचार्यों द्वारा जन्म-समय व स्थान के आधार पर विस्तृत फलादेश तैयार किया जाता है।
  </p>
  <div style="margin-top: 24px;">
    <a href="https://wa.me/919530401984?text=नमस्ते%20पंडित%20जी,%20मुझे%20कुंडली%20परामर्श%20चाहिए" target="_blank" style="display: inline-block; padding: 12px 28px; background: #7A1F2B; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 14px rgba(122,31,43,0.3);">
      सीधे व्हाट्सएप पर परामर्श लें ➔
    </a>
  </div>
</div>`,

  bookingBox: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 24px 0;">
  <div style="background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
    <h3 style="font-size: 18px; font-weight: bold; color: #241A18; margin-bottom: 8px;">🌟 1 वर्ष विस्तृत भविष्यफल</h3>
    <p style="font-size: 13px; color: #6F625D; margin-bottom: 16px;">करियर, स्वास्थ्य, विवाह व धन संबंधित संपूर्ण गणना।</p>
    <div style="font-size: 24px; font-weight: 900; color: #7A1F2B; margin-bottom: 16px;">₹501 <span style="font-size: 14px; color: #999; text-decoration: line-through;">₹1,500</span></div>
    <a href="https://wa.me/919530401984?text=1%20Year%20Horoscope%20Booking" target="_blank" style="display: block; text-align: center; padding: 10px; background: #7A1F2B; color: #fff; border-radius: 10px; font-weight: bold; text-decoration: none;">बुक करें ➔</a>
  </div>
  <div style="background: #FAF6ED; border: 1px solid #C89B3C; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(200,155,60,0.15);">
    <span style="background: #C89B3C; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">सर्वाधिक लोकप्रिय</span>
    <h3 style="font-size: 18px; font-weight: bold; color: #241A18; margin: 8px 0;">🔮 सम्पूर्ण जीवन महादशा फलादेश</h3>
    <p style="font-size: 13px; color: #6F625D; margin-bottom: 16px;">विमशोत्तरी दशा, कालसर्प-मांगलिक दोष जांच व शास्त्रोक्त उपाय।</p>
    <div style="font-size: 24px; font-weight: 900; color: #7A1F2B; margin-bottom: 16px;">₹1,100 <span style="font-size: 14px; color: #999; text-decoration: line-through;">₹2,500</span></div>
    <a href="https://wa.me/919530401984?text=Complete%20Life%20Horoscope%20Booking" target="_blank" style="display: block; text-align: center; padding: 10px; background: #C89B3C; color: #fff; border-radius: 10px; font-weight: bold; text-decoration: none;">अभी बुक करें ➔</a>
  </div>
</div>`,

  responsiveIframe: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin: 20px 0; border: 1px solid #E8DDD0;">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe>
</div>`
}

export default function AdminHoroscopePagesPage() {
  const [pages, setPages] = useState<HoroscopeCustomPage[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    slug: string
    subtitle: string
    customCode: string
    layout: 'container' | 'fullwidth' | 'clean'
    headerBanner: boolean
    showBookingBar: boolean
    whatsappNumber: string
    status: 'PUBLISHED' | 'DRAFT'
  }>({
    title: '',
    slug: '',
    subtitle: '',
    customCode: '',
    layout: 'container',
    headerBanner: true,
    showBookingBar: true,
    whatsappNumber: '919530401984',
    status: 'PUBLISHED'
  })

  const loadPages = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/horoscope-pages')
      const json = await res.json()
      if (json?.ok) {
        setPages(json.data || [])
      }
    } catch {
      toast.error('Failed to load horoscope landing pages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPages()
  }, [])

  const handleOpenCreate = () => {
    setEditingId(null)
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      customCode: CODE_TEMPLATES.vedicCard,
      layout: 'container',
      headerBanner: true,
      showBookingBar: true,
      whatsappNumber: '919530401984',
      status: 'PUBLISHED'
    })
    setActiveTab('editor')
    setModalOpen(true)
  }

  const handleOpenEdit = (page: HoroscopeCustomPage) => {
    setEditingId(page.id)
    setFormData({
      title: page.title,
      slug: page.slug,
      subtitle: page.subtitle || '',
      customCode: page.customCode,
      layout: page.layout || 'container',
      headerBanner: page.headerBanner,
      showBookingBar: page.showBookingBar,
      whatsappNumber: page.whatsappNumber || '919530401984',
      status: page.status
    })
    setActiveTab('editor')
    setModalOpen(true)
  }

  const handleTitleChange = (val: string) => {
    setFormData(prev => {
      // If creating new page and slug wasn't manually customized, auto-generate slug
      const autoSlug = !editingId
        ? val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug
      return { ...prev, title: val, slug: autoSlug }
    })
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a Page Title')
      return
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const payload = editingId ? { ...formData, id: editingId } : formData
      const res = await fetch('/api/admin/horoscope-pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (json?.ok) {
        toast.success(editingId ? 'Page updated successfully!' : 'New Landing Page created!')
        setModalOpen(false)
        loadPages()
      } else {
        toast.error(json?.error || 'Failed to save page')
      }
    } catch {
      toast.error('Network error saving page')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom landing page?')) return
    try {
      const res = await fetch(`/api/admin/horoscope-pages?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json?.ok) {
        toast.success('Page deleted')
        loadPages()
      } else {
        toast.error('Failed to delete')
      }
    } catch {
      toast.error('Network error deleting')
    }
  }

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/horoscope/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    toast.success('Landing page link copied to clipboard!')
    setTimeout(() => setCopiedSlug(null), 2000)
  }

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DDD0] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF6ED] border border-[#E8DDD0] text-[#7A1F2B] text-xs font-bold mb-1">
            <Sparkles className="h-3.5 w-3.5 text-[#C89B3C]" />
            <span>Horoscope Landing Page Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#241A18] tracking-tight">
            🔮 Custom Horoscope Pages & Code Embed
          </h1>
          <p className="text-xs sm:text-sm text-[#6F625D] mt-1">
            यहाँ कोई भी HTML, Embed या कस्टम कोड पेस्ट करके सीधा नया लैंडिंग पेज बनाएं। लेआउट व मार्जिन अपने आप सुरक्षित रहेंगे।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={loadPages}
            variant="outline"
            size="sm"
            className="rounded-xl border-[#E8DDD0] text-[#241A18] hover:bg-[#FAF6ED]"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            onClick={handleOpenCreate}
            className="rounded-xl bg-[#7A1F2B] hover:bg-[#631822] text-white font-bold gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Landing Page</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-[#E8DDD0] bg-white shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6F625D]">Total Pages</p>
              <p className="text-2xl font-black text-[#241A18] mt-1">{pages.length}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-[#FAF6ED] text-[#7A1F2B] flex items-center justify-center font-bold">
              <FileText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#E8DDD0] bg-white shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6F625D]">Published & Active</p>
              <p className="text-2xl font-black text-emerald-700 mt-1">
                {pages.filter(p => p.status === 'PUBLISHED').length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-[#E8DDD0] bg-white shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#6F625D]">Drafts</p>
              <p className="text-2xl font-black text-amber-700 mt-1">
                {pages.filter(p => p.status === 'DRAFT').length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages Table */}
      <Card className="rounded-2xl border-[#E8DDD0] bg-white shadow-2xs overflow-hidden">
        <CardHeader className="border-b border-[#E8DDD0] bg-[#FFF9F1]/50 px-6 py-4">
          <CardTitle className="text-base font-bold text-[#241A18] flex items-center gap-2">
            <Layout className="h-4 w-4 text-[#7A1F2B]" />
            <span>Active Horoscope Landing Pages</span>
          </CardTitle>
          <CardDescription className="text-xs text-[#6F625D]">
            सभी पृष्ठ <code>/horoscope/[slug]</code> पर लाइव उपलब्ध होते हैं।
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {loading && pages.length === 0 ? (
            <div className="p-12 text-center text-[#6F625D]">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-[#7A1F2B]" />
              <p className="text-xs font-semibold">Loading landing pages...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-[#FAF6ED] text-[#7A1F2B] flex items-center justify-center mx-auto">
                <Code2 className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-[#241A18]">No custom landing pages created yet</h3>
              <p className="text-xs text-[#6F625D] max-w-md mx-auto">
                "New Landing Page" पर क्लिक करके कोई भी कोड पेस्ट करें और तुरंत लाइव पेज बनाएं।
              </p>
              <Button
                onClick={handleOpenCreate}
                className="rounded-xl bg-[#7A1F2B] hover:bg-[#631822] text-white font-bold text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Create First Page
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8DDD0] bg-[#FAF6ED]/40 text-[#6F625D] font-bold">
                    <th className="py-3.5 px-4">Title & URL</th>
                    <th className="py-3.5 px-4">Layout Mode</th>
                    <th className="py-3.5 px-4">Header / Booking</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]">
                  {pages.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF6ED]/20 transition-colors">
                      <td className="py-4 px-4 space-y-1">
                        <div className="font-bold text-[#241A18] text-sm">{p.title}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#6F625D]">
                          <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-700">
                            /horoscope/{p.slug}
                          </span>
                          <button
                            onClick={() => handleCopyLink(p.slug)}
                            className="text-[#7A1F2B] hover:text-[#52131D] ml-1 p-0.5 rounded"
                            title="Copy Live Link"
                          >
                            {copiedSlug === p.slug ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wide border-[#E8DDD0] bg-white">
                          {p.layout === 'container' ? '🛡️ Vedic Card' : p.layout === 'fullwidth' ? '↔️ Full Width' : '🎨 Clean'}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 space-y-0.5 text-[11px] text-[#6F625D]">
                        <div>Header: {p.headerBanner ? '✅ On' : '❌ Off'}</div>
                        <div>Sticky Bar: {p.showBookingBar ? '✅ WhatsApp' : '❌ Off'}</div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                        }`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            asChild
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-[#7A1F2B] hover:bg-[#FAF6ED] rounded-lg"
                          >
                            <Link href={`/horoscope/${p.slug}`} target="_blank" title="View Live Page">
                              <ExternalLink className="h-3.5 w-3.5 mr-1" /> Live
                            </Link>
                          </Button>

                          <Button
                            onClick={() => handleOpenEdit(p)}
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 rounded-lg border-[#E8DDD0] hover:bg-[#FAF6ED]"
                            title="Edit Code"
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                          </Button>

                          <Button
                            onClick={() => handleDelete(p.id)}
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor & Live Preview Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-[#E8DDD0] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#241A18] flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#C89B3C]" />
              <span>{editingId ? 'Edit Horoscope Landing Page' : 'Create New Horoscope Landing Page'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6F625D]">
              यहाँ अपना HTML, आईफ्रेम या विजेट कोड पेस्ट करें। लेआउट कंटेनर आपके पेज को रिस्पॉन्सिव और सुंदर बनाए रखेगा।
            </DialogDescription>
          </DialogHeader>

          {/* Form Fields */}
          <div className="space-y-4 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#241A18]">Page Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. वर्ष 2026 संपूर्ण जन्मकुंडली व फलादेश"
                  className="rounded-xl border-[#E8DDD0]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#241A18]">URL Slug *</Label>
                <div className="flex items-center rounded-xl border border-[#E8DDD0] bg-zinc-50 px-3 h-10 text-xs">
                  <span className="text-[#6F625D] shrink-0 font-mono">/horoscope/</span>
                  <input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                    placeholder="kundali-analysis"
                    className="bg-transparent border-none outline-none font-mono text-zinc-900 w-full pl-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#241A18]">Subtitle / Description (Optional)</Label>
              <Input
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="संक्षिप्त विवरण जो हेडर में दिखेगा..."
                className="rounded-xl border-[#E8DDD0]"
              />
            </div>

            {/* Layout Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#FAF6ED]/50 rounded-2xl border border-[#E8DDD0]">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#241A18]">Layout Protection Mode</Label>
                <select
                  value={formData.layout}
                  onChange={(e) => setFormData({ ...formData, layout: e.target.value as any })}
                  className="w-full text-xs font-semibold rounded-xl border border-[#E8DDD0] bg-white h-9 px-2"
                >
                  <option value="container">🛡️ Vedic Card (Recommended - Max 1024px)</option>
                  <option value="fullwidth">↔️ Full Width (Max 1280px)</option>
                  <option value="clean">🎨 Clean Canvas (100% Fluid)</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#241A18]">Header & Top Banner</Label>
                <select
                  value={formData.headerBanner ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, headerBanner: e.target.value === 'true' })}
                  className="w-full text-xs font-semibold rounded-xl border border-[#E8DDD0] bg-white h-9 px-2"
                >
                  <option value="true">Show Vedic Title Header (ॐ)</option>
                  <option value="false">Hide Header (Custom Header Only)</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#241A18]">Sticky WhatsApp Bar</Label>
                <select
                  value={formData.showBookingBar ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, showBookingBar: e.target.value === 'true' })}
                  className="w-full text-xs font-semibold rounded-xl border border-[#E8DDD0] bg-white h-9 px-2"
                >
                  <option value="true">Enable Floating WhatsApp Bar</option>
                  <option value="false">Disable Floating Bar</option>
                </select>
              </div>
            </div>

            {/* Code Insertion Fast Templates */}
            <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-[#6F625D]">Quick Insert Templates:</span>
              <div className="flex gap-1.5 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, customCode: prev.customCode + '\n\n' + CODE_TEMPLATES.vedicCard }))}
                  className="h-7 text-[10px] rounded-lg border-[#E8DDD0]"
                >
                  + Vedic Card
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, customCode: prev.customCode + '\n\n' + CODE_TEMPLATES.bookingBox }))}
                  className="h-7 text-[10px] rounded-lg border-[#E8DDD0]"
                >
                  + Pricing Cards
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, customCode: prev.customCode + '\n\n' + CODE_TEMPLATES.responsiveIframe }))}
                  className="h-7 text-[10px] rounded-lg border-[#E8DDD0]"
                >
                  + Responsive Video/Iframe
                </Button>
              </div>
            </div>

            {/* Tab Switcher: Editor vs Live Preview */}
            <div className="flex border-b border-[#E8DDD0] space-x-4">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'editor'
                    ? 'border-[#7A1F2B] text-[#7A1F2B]'
                    : 'border-transparent text-[#6F625D] hover:text-[#241A18]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-4 w-4" /> Code Editor (Paste Code Here)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-2 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'preview'
                    ? 'border-[#7A1F2B] text-[#7A1F2B]'
                    : 'border-transparent text-[#6F625D] hover:text-[#241A18]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" /> Live Preview
                </span>
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'editor' ? (
              <div className="space-y-1">
                <textarea
                  value={formData.customCode}
                  onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
                  placeholder="Paste your HTML, iframe, CSS, Tailwind or JavaScript embed code here..."
                  rows={14}
                  className="w-full font-mono text-xs p-3.5 bg-zinc-900 text-emerald-400 rounded-2xl border border-zinc-800 outline-none focus:ring-2 focus:ring-[#7A1F2B] resize-y leading-relaxed"
                />
                <p className="text-[10px] text-[#6F625D]">
                  💡 <b>Pro-Tip:</b> आप सीधे Typeform, Tally, Google Forms, YouTube, Razorpay Button, या कस्टम HTML/CSS पेस्ट कर सकते हैं। हमारा सिस्टम मार्जिन व रिस्पॉन्सिवनेस खुद संभाल लेगा।
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#E8DDD0] overflow-hidden max-h-[420px] overflow-y-auto bg-[#FFF9F1]">
                <HoroscopeLandingViewer
                  page={{
                    id: 'preview',
                    title: formData.title || 'Preview Title',
                    slug: formData.slug || 'preview',
                    subtitle: formData.subtitle,
                    customCode: formData.customCode,
                    layout: formData.layout,
                    headerBanner: formData.headerBanner,
                    showBookingBar: formData.showBookingBar,
                    whatsappNumber: formData.whatsappNumber,
                    status: 'PUBLISHED',
                    createdAt: '',
                    updatedAt: ''
                  }}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border-[#E8DDD0]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-[#7A1F2B] hover:bg-[#631822] text-white font-bold"
            >
              {editingId ? 'Save Changes' : 'Publish Landing Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

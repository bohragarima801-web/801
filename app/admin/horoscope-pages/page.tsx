'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  FileText, Plus, ExternalLink, Copy, Check, Trash2, Edit,
  Eye, Code2, Sparkles, Layout, MessageCircle, ShieldCheck,
  RefreshCw, CheckCircle2, AlertCircle, Upload, CreditCard,
  Image as ImageIcon, Video, Play, Link2, Loader2, ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { HoroscopeLandingViewer } from '@/components/horoscope-landing-viewer'
import type { HoroscopeCustomPage, HoroscopeMediaItem, HoroscopeRazorpayConfig } from '@/lib/horoscope-pages'

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
    <button data-razorpay-amount="501" data-purpose="कुंडली विश्लेषण दक्षिणा" class="razorpay-pay-btn" style="display: inline-block; padding: 12px 28px; background: #7A1F2B; color: #ffffff; border: none; border-radius: 12px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 14px rgba(122,31,43,0.3); cursor: pointer;">
      💳 दक्षिणा भुगतान करें (₹501) ➔
    </button>
  </div>
</div>`,

  bookingBox: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 24px 0;">
  <div style="background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
    <h3 style="font-size: 18px; font-weight: bold; color: #241A18; margin-bottom: 8px;">🌟 1 वर्ष विस्तृत भविष्यफल</h3>
    <p style="font-size: 13px; color: #6F625D; margin-bottom: 16px;">करियर, स्वास्थ्य, विवाह व धन संबंधित संपूर्ण गणना।</p>
    <div style="font-size: 24px; font-weight: 900; color: #7A1F2B; margin-bottom: 16px;">₹501 <span style="font-size: 14px; color: #999; text-decoration: line-through;">₹1,500</span></div>
    <button data-razorpay-amount="501" data-purpose="1 Year Horoscope" class="razorpay-pay-btn" style="display: block; width: 100%; text-align: center; padding: 10px; background: #7A1F2B; color: #fff; border-radius: 10px; font-weight: bold; border: none; cursor: pointer;">सुरक्षित भुगतान (₹501) ➔</button>
  </div>
  <div style="background: #FAF6ED; border: 1px solid #C89B3C; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(200,155,60,0.15);">
    <span style="background: #C89B3C; color: #fff; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px;">सर्वाधिक लोकप्रिय</span>
    <h3 style="font-size: 18px; font-weight: bold; color: #241A18; margin: 8px 0;">🔮 सम्पूर्ण जीवन महादशा फलादेश</h3>
    <p style="font-size: 13px; color: #6F625D; margin-bottom: 16px;">विमशोत्तरी दशा, कालसर्प-मांगलिक दोष जांच व शास्त्रोक्त उपाय।</p>
    <div style="font-size: 24px; font-weight: 900; color: #7A1F2B; margin-bottom: 16px;">₹1,100 <span style="font-size: 14px; color: #999; text-decoration: line-through;">₹2,500</span></div>
    <button data-razorpay-amount="1100" data-purpose="Complete Life Horoscope" class="razorpay-pay-btn" style="display: block; width: 100%; text-align: center; padding: 10px; background: #C89B3C; color: #fff; border-radius: 10px; font-weight: bold; border: none; cursor: pointer;">सुरक्षित भुगतान (₹1,100) ➔</button>
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
  const [activeTab, setActiveTab] = useState<'editor' | 'razorpay' | 'images' | 'videos' | 'preview'>('editor')
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [uploadingMedia, setUploadingMedia] = useState(false)

  const htmlFileInputRef = useRef<HTMLInputElement>(null)
  const imageUploadInputRef = useRef<HTMLInputElement>(null)
  const videoUploadInputRef = useRef<HTMLInputElement>(null)

  // Quick inputs for media
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newImageTitle, setNewImageTitle] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')

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
    images: HoroscopeMediaItem[]
    videos: HoroscopeMediaItem[]
    razorpay: HoroscopeRazorpayConfig
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
    images: [],
    videos: [],
    razorpay: {
      enabled: false,
      amount: 501,
      paymentLink: '',
      buttonText: 'सुरक्षित दक्षिणा / भुगतान करें (₹501)'
    },
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
      images: [],
      videos: [],
      razorpay: {
        enabled: false,
        amount: 501,
        paymentLink: '',
        buttonText: 'सुरक्षित दक्षिणा / भुगतान करें (₹501)'
      },
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
      images: page.images || [],
      videos: page.videos || [],
      razorpay: page.razorpay || {
        enabled: false,
        amount: 501,
        paymentLink: '',
        buttonText: 'सुरक्षित दक्षिणा / भुगतान करें (₹501)'
      },
      status: page.status
    })
    setActiveTab('editor')
    setModalOpen(true)
  }

  const handleTitleChange = (val: string) => {
    setFormData(prev => {
      const autoSlug = !editingId
        ? val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : prev.slug
      return { ...prev, title: val, slug: autoSlug }
    })
  }

  // HTML File Upload handler
  const handleHtmlFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      toast.error('Please select an .html or .htm file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        setFormData(prev => ({
          ...prev,
          customCode: content,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')
        }))
        toast.success(`${file.name} loaded into editor!`)
      }
    }
    reader.onerror = () => {
      toast.error('Failed to read HTML file')
    }
    reader.readAsText(file)
    // reset input
    if (htmlFileInputRef.current) htmlFileInputRef.current.value = ''
  }

  // Media file upload handler (Image or Video)
  const handleMediaUpload = async (file: File, type: 'image' | 'video') => {
    try {
      setUploadingMedia(true)
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/admin/horoscope-media', {
        method: 'POST',
        body: data
      })
      const json = await res.json()
      if (json?.ok && json.url) {
        const newItem: HoroscopeMediaItem = {
          id: `med_${Date.now()}`,
          url: json.url,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type
        }
        if (type === 'image') {
          setFormData(prev => ({ ...prev, images: [...prev.images, newItem] }))
        } else {
          setFormData(prev => ({ ...prev, videos: [...prev.videos, newItem] }))
        }
        toast.success(`${file.name} uploaded successfully!`)
      } else {
        toast.error(json?.error || 'Upload failed')
      }
    } catch {
      toast.error('Upload error')
    } finally {
      setUploadingMedia(false)
    }
  }

  // Add Image via URL
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }
    const newItem: HoroscopeMediaItem = {
      id: `img_${Date.now()}`,
      url: newImageUrl.trim(),
      title: newImageTitle.trim() || undefined,
      type: 'image'
    }
    setFormData(prev => ({ ...prev, images: [...prev.images, newItem] }))
    setNewImageUrl('')
    setNewImageTitle('')
    toast.success('Image link added!')
  }

  // Add Video via URL
  const handleAddVideoUrl = () => {
    if (!newVideoUrl.trim()) {
      toast.error('Please enter a video URL')
      return
    }
    const newItem: HoroscopeMediaItem = {
      id: `vid_${Date.now()}`,
      url: newVideoUrl.trim(),
      title: newVideoTitle.trim() || undefined,
      type: 'video'
    }
    setFormData(prev => ({ ...prev, videos: [...prev.videos, newItem] }))
    setNewVideoUrl('')
    setNewVideoTitle('')
    toast.success('Video link added!')
  }

  // Remove Image
  const handleRemoveImage = async (id: string, url: string) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter(img => img.id !== id) }))
    // If it was an uploaded file, delete from server
    if (url.includes('/uploads/horoscope/')) {
      const filename = url.split('/uploads/horoscope/')[1]
      await fetch(`/api/admin/horoscope-media?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' }).catch(() => null)
    }
    toast.info('Image removed')
  }

  // Remove Video
  const handleRemoveVideo = async (id: string, url: string) => {
    setFormData(prev => ({ ...prev, videos: prev.videos.filter(vid => vid.id !== id) }))
    if (url.includes('/uploads/horoscope/')) {
      const filename = url.split('/uploads/horoscope/')[1]
      await fetch(`/api/admin/horoscope-media?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' }).catch(() => null)
    }
    toast.info('Video removed')
  }

  // Insert Image into HTML
  const insertImageIntoHtml = (url: string, title?: string) => {
    const imgSnippet = `\n<div style="text-align: center; margin: 20px 0;"><img src="${url}" alt="${title || ''}" style="max-width: 100%; height: auto; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.06);" /></div>\n`
    setFormData(prev => ({ ...prev, customCode: prev.customCode + imgSnippet }))
    toast.success('Image HTML snippet inserted into Code Editor!')
  }

  // Insert Video into HTML
  const insertVideoIntoHtml = (url: string) => {
    let vidSnippet = ''
    if (url.endsWith('.mp4') || url.endsWith('.webm')) {
      vidSnippet = `\n<div style="margin: 20px 0; border-radius: 16px; overflow: hidden;"><video src="${url}" controls style="width: 100%; border-radius: 16px;"></video></div>\n`
    } else {
      let embed = url
      if (url.includes('watch?v=')) embed = `https://www.youtube.com/embed/${url.split('watch?v=')[1]?.split('&')[0]}`
      if (url.includes('youtu.be/')) embed = `https://www.youtube.com/embed/${url.split('youtu.be/')[1]?.split('?')[0]}`
      vidSnippet = `\n<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin: 20px 0; border: 1px solid #E8DDD0;"><iframe src="${embed}" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe></div>\n`
    }
    setFormData(prev => ({ ...prev, customCode: prev.customCode + vidSnippet }))
    toast.success('Video embed inserted into Code Editor!')
  }

  // Insert Razorpay Button into HTML
  const insertRazorpayButton = () => {
    const amt = formData.razorpay.amount || 501
    const text = formData.razorpay.buttonText || `सुरक्षित दक्षिणा / भुगतान करें (₹${amt})`
    const btnSnippet = `\n<div style="text-align: center; margin: 24px 0;">
  <button data-razorpay-amount="${amt}" data-purpose="${formData.title || 'Horoscope Booking'}" class="razorpay-pay-btn" style="padding: 14px 32px; background: #7A1F2B; color: #ffffff; border: none; border-radius: 12px; font-weight: 800; font-size: 15px; cursor: pointer; box-shadow: 0 4px 18px rgba(122,31,43,0.35); transition: all 0.2s;">
    💳 ${text} ➔
  </button>
</div>\n`
    setFormData(prev => ({ ...prev, customCode: prev.customCode + btnSnippet }))
    toast.success('Razorpay Pay Button inserted into HTML!')
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
            <span>Horoscope Landing Page & Code Embed Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#241A18] tracking-tight">
            🔮 Custom Horoscope Pages, File Upload & Razorpay
          </h1>
          <p className="text-xs sm:text-sm text-[#6F625D] mt-1">
            HTML फ़ाइल अपलोड करें या कोड पेस्ट करें, Razorpay पेमेंट लिंक लगाएं/हटाएं, और इमेज/वीडियो आसानी से जोड़ें।
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
              <p className="text-xs font-semibold text-[#6F625D]">Razorpay Enabled Pages</p>
              <p className="text-2xl font-black text-[#7A1F2B] mt-1">
                {pages.filter(p => p.razorpay?.enabled).length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <CreditCard className="h-5 w-5" />
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
                "New Landing Page" पर क्लिक करके कोई भी HTML फाइल अपलोड करें या कोड पेस्ट करें और तुरंत लाइव पेज बनाएं।
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
                    <th className="py-3.5 px-4">Razorpay</th>
                    <th className="py-3.5 px-4">Media</th>
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

                      <td className="py-4 px-4">
                        {p.razorpay?.enabled ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CreditCard className="h-3 w-3 text-emerald-600" /> ₹{p.razorpay.amount || 501}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#6F625D]">Disabled</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-[11px] text-[#6F625D] space-y-0.5">
                        <div>🖼️ {(p.images || []).length} images</div>
                        <div>🎥 {(p.videos || []).length} videos</div>
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
                            title="Edit Code & Settings"
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

      {/* Editor & Studio Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto border-[#E8DDD0] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#241A18] flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#C89B3C]" />
                <span>{editingId ? 'Edit Horoscope Landing Page' : 'Create New Horoscope Landing Page'}</span>
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6F625D]">
              HTML फ़ाइल अपलोड करें या कोड पेस्ट करें, Razorpay पेमेंट ऑन/ऑफ करें, और मीडिया जोड़ें।
            </DialogDescription>
          </DialogHeader>

          {/* Form Top Fields */}
          <div className="space-y-4 py-2">
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
                <Label className="text-[11px] font-bold text-[#241A18]">Header Banner</Label>
                <select
                  value={formData.headerBanner ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, headerBanner: e.target.value === 'true' })}
                  className="w-full text-xs font-semibold rounded-xl border border-[#E8DDD0] bg-white h-9 px-2"
                >
                  <option value="true">Show Vedic Title Header (ॐ)</option>
                  <option value="false">Hide Header (Custom Only)</option>
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-[#241A18]">Sticky Action Bar</Label>
                <select
                  value={formData.showBookingBar ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, showBookingBar: e.target.value === 'true' })}
                  className="w-full text-xs font-semibold rounded-xl border border-[#E8DDD0] bg-white h-9 px-2"
                >
                  <option value="true">Enable Floating Bar</option>
                  <option value="false">Disable Floating Bar</option>
                </select>
              </div>
            </div>

            {/* Studio Tabs */}
            <div className="flex border-b border-[#E8DDD0] space-x-1 sm:space-x-3 overflow-x-auto pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`py-2 px-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'editor'
                    ? 'border-[#7A1F2B] text-[#7A1F2B]'
                    : 'border-transparent text-[#6F625D] hover:text-[#241A18]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Code2 className="h-4 w-4" /> Code & HTML File
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('razorpay')}
                className={`py-2 px-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'razorpay'
                    ? 'border-[#7A1F2B] text-[#7A1F2B]'
                    : 'border-transparent text-[#6F625D] hover:text-[#241A18]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" /> Razorpay Settings
                  {formData.razorpay.enabled && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className={`py-2 px-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'images'
                    ? 'border-[#7A1F2B] text-[#7A1F2B]'
                    : 'border-transparent text-[#6F625D] hover:text-[#241A18]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4" /> Images ({formData.images.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('videos')}
                className={`py-2 px-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'videos'
                    ? 'border-[#7A1F2B] text-[#7A1F2B]'
                    : 'border-transparent text-[#6F625D] hover:text-[#241A18]'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Video className="h-4 w-4" /> Videos ({formData.videos.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
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

            {/* TAB 1: CODE & HTML FILE UPLOAD */}
            {activeTab === 'editor' && (
              <div className="space-y-3">
                {/* HTML Upload Bar & Quick Templates */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-50 rounded-xl border border-[#E8DDD0]">
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={htmlFileInputRef}
                      onChange={handleHtmlFileUpload}
                      accept=".html,.htm"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => htmlFileInputRef.current?.click()}
                      className="rounded-xl border-[#7A1F2B] text-[#7A1F2B] hover:bg-[#FAF6ED] font-bold text-xs"
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" /> 📁 Upload .HTML File
                    </Button>
                    <span className="text-[11px] text-[#6F625D]">सीधे कंप्यूटर से फाइल लोड करें</span>
                  </div>

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
                  </div>
                </div>

                <textarea
                  value={formData.customCode}
                  onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
                  placeholder="Paste your HTML, iframe, CSS, Tailwind or JavaScript embed code here..."
                  rows={13}
                  className="w-full font-mono text-xs p-3.5 bg-zinc-900 text-emerald-400 rounded-2xl border border-zinc-800 outline-none focus:ring-2 focus:ring-[#7A1F2B] resize-y leading-relaxed"
                />
              </div>
            )}

            {/* TAB 2: RAZORPAY SETTINGS ("Laga saku / Hata saku") */}
            {activeTab === 'razorpay' && (
              <div className="space-y-4 p-4 bg-white rounded-2xl border border-[#E8DDD0]">
                <div className="flex items-center justify-between border-b border-[#E8DDD0] pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#241A18] flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-[#7A1F2B]" />
                      <span>Razorpay Payment Gateway Integration</span>
                    </h4>
                    <p className="text-xs text-[#6F625D]">
                      पेमेंट सक्षम करने पर पेज पर सीधे पेमेंट विंडो या बटन सक्रिय हो जाएगा।
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#241A18]">
                      {formData.razorpay.enabled ? 'सक्रिय (Enabled)' : 'निष्क्रिय (Disabled)'}
                    </span>
                    <input
                      type="checkbox"
                      checked={formData.razorpay.enabled}
                      onChange={(e) => setFormData({
                        ...formData,
                        razorpay: { ...formData.razorpay, enabled: e.target.checked }
                      })}
                      className="h-5 w-5 accent-[#7A1F2B] cursor-pointer"
                    />
                  </div>
                </div>

                {formData.razorpay.enabled ? (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-[#241A18]">Amount in ₹ (दक्षिणा / शुल्क)</Label>
                        <Input
                          type="number"
                          value={formData.razorpay.amount || 501}
                          onChange={(e) => setFormData({
                            ...formData,
                            razorpay: { ...formData.razorpay, amount: Number(e.target.value) }
                          })}
                          placeholder="501"
                          className="rounded-xl border-[#E8DDD0]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-[#241A18]">Button Text</Label>
                        <Input
                          value={formData.razorpay.buttonText || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            razorpay: { ...formData.razorpay, buttonText: e.target.value }
                          })}
                          placeholder="सुरक्षित दक्षिणा / भुगतान करें (₹501)"
                          className="rounded-xl border-[#E8DDD0]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#241A18]">
                        Custom Razorpay Payment Link (Optional)
                      </Label>
                      <Input
                        value={formData.razorpay.paymentLink || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          razorpay: { ...formData.razorpay, paymentLink: e.target.value }
                        })}
                        placeholder="e.g. https://rzp.io/l/your-link (अगर खाली छोड़ेंगे तो इन-पेज पॉपअप खुलेगा)"
                        className="rounded-xl border-[#E8DDD0]"
                      />
                    </div>

                    <div className="p-3 bg-[#FAF6ED] rounded-xl border border-[#C89B3C]/30 flex items-center justify-between gap-3 flex-wrap">
                      <div className="text-xs text-[#241A18]">
                        <p className="font-bold">💡 कोड में पेमेंट बटन जोड़ना चाहते हैं?</p>
                        <p className="text-[#6F625D]">इस बटन को दबाएं, आपके HTML में Razorpay बटन कोड जुड़ जाएगा।</p>
                      </div>
                      <Button
                        type="button"
                        onClick={insertRazorpayButton}
                        className="bg-[#7A1F2B] hover:bg-[#631822] text-white text-xs font-bold rounded-xl"
                      >
                        + Insert Pay Button into HTML
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-[#6F625D] bg-zinc-50 rounded-xl">
                    <p className="text-xs font-semibold">Razorpay वर्तमान में बंद (Disabled) है।</p>
                    <p className="text-[11px] mt-1">चालू करने के लिए ऊपर दिए गए चेकबॉक्स को टिक करें।</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: IMAGES MANAGER (Add / Upload / Remove) */}
            {activeTab === 'images' && (
              <div className="space-y-4 p-4 bg-white rounded-2xl border border-[#E8DDD0]">
                {/* Image Upload & Add Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-zinc-50 rounded-xl border border-[#E8DDD0]">
                  <div className="sm:col-span-6 space-y-1">
                    <Label className="text-[11px] font-bold text-[#241A18]">Image URL or Link</Label>
                    <Input
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="rounded-xl border-[#E8DDD0] h-9 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-[11px] font-bold text-[#241A18]">Caption / Title</Label>
                    <Input
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                      placeholder="e.g. माँ बगलामुखी यंत्र"
                      className="rounded-xl border-[#E8DDD0] h-9 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3 flex items-end gap-2">
                    <Button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="h-9 rounded-xl bg-[#7A1F2B] hover:bg-[#631822] text-white text-xs font-bold flex-1"
                    >
                      + Add Link
                    </Button>
                    <input
                      type="file"
                      ref={imageUploadInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleMediaUpload(file, 'image')
                      }}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingMedia}
                      onClick={() => imageUploadInputRef.current?.click()}
                      className="h-9 px-3 rounded-xl border-[#E8DDD0] text-xs font-bold"
                      title="Upload Image File"
                    >
                      {uploadingMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Images List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#241A18]">Images Added to this Page ({formData.images.length})</h4>
                  {formData.images.length === 0 ? (
                    <p className="text-xs text-[#6F625D] p-6 text-center bg-zinc-50 rounded-xl">
                      No images added yet. Upload or add a link above.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto">
                      {formData.images.map((img) => (
                        <div key={img.id} className="p-2 bg-[#FAF6ED] rounded-xl border border-[#E8DDD0] flex items-center gap-3">
                          <img src={img.url} alt={img.title || ''} className="h-12 w-12 rounded-lg object-cover border border-[#E8DDD0] shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#241A18] truncate">{img.title || 'Image'}</p>
                            <p className="text-[10px] text-[#6F625D] truncate">{img.url}</p>
                            <button
                              type="button"
                              onClick={() => insertImageIntoHtml(img.url, img.title)}
                              className="text-[10px] text-[#7A1F2B] font-bold hover:underline"
                            >
                              + Insert into HTML
                            </button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveImage(img.id, img.url)}
                            className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                            title="Remove Image"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: VIDEOS MANAGER (Add / Upload / Remove) */}
            {activeTab === 'videos' && (
              <div className="space-y-4 p-4 bg-white rounded-2xl border border-[#E8DDD0]">
                {/* Video Add Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-zinc-50 rounded-xl border border-[#E8DDD0]">
                  <div className="sm:col-span-6 space-y-1">
                    <Label className="text-[11px] font-bold text-[#241A18]">YouTube / Video Link</Label>
                    <Input
                      value={newVideoUrl}
                      onChange={(e) => setNewVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or .mp4"
                      className="rounded-xl border-[#E8DDD0] h-9 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <Label className="text-[11px] font-bold text-[#241A18]">Video Title</Label>
                    <Input
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="e.g. महादशा संपूर्ण मार्गदर्शन"
                      className="rounded-xl border-[#E8DDD0] h-9 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3 flex items-end gap-2">
                    <Button
                      type="button"
                      onClick={handleAddVideoUrl}
                      className="h-9 rounded-xl bg-[#7A1F2B] hover:bg-[#631822] text-white text-xs font-bold flex-1"
                    >
                      + Add Video
                    </Button>
                    <input
                      type="file"
                      ref={videoUploadInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleMediaUpload(file, 'video')
                      }}
                      accept="video/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={uploadingMedia}
                      onClick={() => videoUploadInputRef.current?.click()}
                      className="h-9 px-3 rounded-xl border-[#E8DDD0] text-xs font-bold"
                      title="Upload MP4 Video"
                    >
                      {uploadingMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Videos List */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#241A18]">Videos Added to this Page ({formData.videos.length})</h4>
                  {formData.videos.length === 0 ? (
                    <p className="text-xs text-[#6F625D] p-6 text-center bg-zinc-50 rounded-xl">
                      No videos added yet. Paste a YouTube link or upload an MP4 above.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto">
                      {formData.videos.map((vid) => (
                        <div key={vid.id} className="p-3 bg-[#FAF6ED] rounded-xl border border-[#E8DDD0] flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-[#241A18] truncate flex items-center gap-1.5">
                              <Play className="h-3.5 w-3.5 text-[#7A1F2B]" />
                              <span>{vid.title || 'Video Embed'}</span>
                            </p>
                            <p className="text-[10px] text-[#6F625D] truncate">{vid.url}</p>
                            <button
                              type="button"
                              onClick={() => insertVideoIntoHtml(vid.url)}
                              className="text-[10px] text-[#7A1F2B] font-bold hover:underline mt-1"
                            >
                              + Insert Embed into HTML
                            </button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVideo(vid.id, vid.url)}
                            className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                            title="Remove Video"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: LIVE PREVIEW */}
            {activeTab === 'preview' && (
              <div className="rounded-2xl border border-[#E8DDD0] overflow-hidden max-h-[460px] overflow-y-auto bg-[#FFF9F1]">
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
                    images: formData.images,
                    videos: formData.videos,
                    razorpay: formData.razorpay,
                    status: 'PUBLISHED',
                    createdAt: '',
                    updatedAt: ''
                  }}
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-[#E8DDD0]">
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

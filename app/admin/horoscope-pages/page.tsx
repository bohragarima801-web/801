'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  FileText, Plus, ExternalLink, Copy, Check, Trash2, Edit,
  Eye, Code2, Sparkles, Layout, MessageCircle, ShieldCheck,
  RefreshCw, CheckCircle2, AlertCircle, Upload, CreditCard,
  Image as ImageIcon, Video, Play, Link2, Loader2, ArrowRight,
  Tag, IndianRupee, Layers, CheckSquare, Square, Info
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

const ALL_AVAILABLE_CATEGORIES = ['Life', 'Career', 'Marriage', 'Finance', 'Health']

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
    <button data-razorpay-amount="501" data-purpose="कुंडली विश्लेषण दक्षिणा" class="razorpay-pay-btn" style="display: inline-block; padding: 12px 28px; background: #7A1F2B; color: #ffffff; border: none; border-radius: 12px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 14px rgba(122,31,43,0.25); cursor: pointer;">
      अभी दक्षिणा देकर बुक करें (₹501) ➔
    </button>
  </div>
</div>`,

  dualPricingCards: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 24px 0;">
  <div style="background: #FFFFFF; border: 1px solid #E8DDD0; border-radius: 16px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
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
  const [activeTab, setActiveTab] = useState<'details' | 'editor' | 'razorpay' | 'media' | 'preview'>('details')
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')

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
    description: string
    price: number
    originalPrice: number
    pages: number
    categories: string[]
    badge: string
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
    description: '',
    price: 199,
    originalPrice: 499,
    pages: 24,
    categories: ['All', 'Life'],
    badge: '',
    customCode: '',
    layout: 'container',
    headerBanner: true,
    showBookingBar: true,
    whatsappNumber: '919530401984',
    images: [],
    videos: [],
    razorpay: {
      enabled: true,
      amount: 199,
      paymentLink: '',
      buttonText: 'सुरक्षित दक्षिणा / भुगतान करें (₹199)'
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
      toast.error('Failed to load horoscope reports')
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
      description: '',
      price: 199,
      originalPrice: 499,
      pages: 24,
      categories: ['All', 'Life'],
      badge: '',
      customCode: '',
      layout: 'container',
      headerBanner: true,
      showBookingBar: true,
      whatsappNumber: '919530401984',
      images: [],
      videos: [],
      razorpay: {
        enabled: true,
        amount: 199,
        paymentLink: '',
        buttonText: 'सुरक्षित दक्षिणा / भुगतान करें (₹199)'
      },
      status: 'PUBLISHED'
    })
    setActiveTab('details')
    setModalOpen(true)
  }

  const handleOpenEdit = (page: HoroscopeCustomPage) => {
    setEditingId(page.id)
    setFormData({
      title: page.title,
      slug: page.slug,
      subtitle: page.subtitle || '',
      description: page.description || page.subtitle || '',
      price: page.price !== undefined ? page.price : 199,
      originalPrice: page.originalPrice !== undefined ? page.originalPrice : 499,
      pages: page.pages !== undefined ? page.pages : 24,
      categories: page.categories?.length ? page.categories : ['All', 'Life'],
      badge: page.badge || '',
      customCode: page.customCode || '',
      layout: page.layout || 'container',
      headerBanner: page.headerBanner ?? true,
      showBookingBar: page.showBookingBar ?? true,
      whatsappNumber: page.whatsappNumber || '919530401984',
      images: page.images || [],
      videos: page.videos || [],
      razorpay: page.razorpay || {
        enabled: true,
        amount: page.price || 199,
        paymentLink: '',
        buttonText: `सुरक्षित दक्षिणा / भुगतान करें (₹${page.price || 199})`
      },
      status: page.status || 'PUBLISHED'
    })
    setActiveTab('details')
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

  const toggleCategory = (cat: string) => {
    setFormData(prev => {
      const current = prev.categories || ['All']
      if (current.includes(cat)) {
        const next = current.filter(c => c !== cat)
        return { ...prev, categories: next.length > 0 ? next : ['All'] }
      } else {
        return { ...prev, categories: [...current, cat] }
      }
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
    if (htmlFileInputRef.current) htmlFileInputRef.current.value = ''
  }

  // Media file upload handler (Images or Videos)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingMedia(true)
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/admin/horoscope-media', {
        method: 'POST',
        body: data
      })
      const json = await res.json()

      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Upload failed')
      }

      const newItem: HoroscopeMediaItem = {
        id: `med_${Date.now()}`,
        url: json.url,
        title: file.name,
        type: mediaType
      }

      if (mediaType === 'image') {
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), newItem] }))
      } else {
        setFormData(prev => ({ ...prev, videos: [...(prev.videos || []), newItem] }))
      }

      toast.success(`${file.name} uploaded successfully!`)
    } catch (err: any) {
      toast.error(err.message || 'File upload error')
    } finally {
      setUploadingMedia(false)
      if (mediaType === 'image' && imageUploadInputRef.current) imageUploadInputRef.current.value = ''
      if (mediaType === 'video' && videoUploadInputRef.current) videoUploadInputRef.current.value = ''
    }
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return
    const newItem: HoroscopeMediaItem = {
      id: `img_${Date.now()}`,
      url: newImageUrl.trim(),
      title: newImageTitle.trim() || 'Image',
      type: 'image'
    }
    setFormData(prev => ({ ...prev, images: [...(prev.images || []), newItem] }))
    setNewImageUrl('')
    setNewImageTitle('')
    toast.success('Image link added!')
  }

  const handleAddVideoUrl = () => {
    if (!newVideoUrl.trim()) return
    const newItem: HoroscopeMediaItem = {
      id: `vid_${Date.now()}`,
      url: newVideoUrl.trim(),
      title: newVideoTitle.trim() || 'Video',
      type: 'video'
    }
    setFormData(prev => ({ ...prev, videos: [...(prev.videos || []), newItem] }))
    setNewVideoUrl('')
    setNewVideoTitle('')
    toast.success('Video link added!')
  }

  const handleRemoveImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }))
  }

  const handleRemoveVideo = (id: string) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter(vid => vid.id !== id)
    }))
  }

  const insertRazorpayButton = () => {
    const amount = formData.razorpay.amount || 501
    const text = formData.razorpay.buttonText || `सुरक्षित दक्षिणा / भुगतान करें (₹${amount})`
    const snippet = `\n<div style="text-align: center; margin: 24px 0;">
  <button data-razorpay-amount="${amount}" data-purpose="${formData.title || 'Horoscope दक्षिणा'}" class="razorpay-pay-btn" style="display: inline-block; padding: 14px 32px; background: #7A1F2B; color: #ffffff; border: none; border-radius: 12px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 14px rgba(122,31,43,0.3);">
    ${text} ➔
  </button>
</div>\n`
    setFormData(prev => ({
      ...prev,
      customCode: (prev.customCode || '') + snippet,
      razorpay: { ...prev.razorpay, enabled: true }
    }))
    setActiveTab('editor')
    toast.success('Razorpay button code inserted into HTML editor!')
  }

  const insertImageSnippet = (img: HoroscopeMediaItem) => {
    const snippet = `\n<div style="text-align: center; margin: 20px 0;">
  <img src="${img.url}" alt="${img.title || 'Horoscope Image'}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); display: inline-block;" />
  ${img.title ? `<p style="font-size: 13px; color: #6F625D; margin-top: 6px;">${img.title}</p>` : ''}
</div>\n`
    setFormData(prev => ({ ...prev, customCode: (prev.customCode || '') + snippet }))
    setActiveTab('editor')
    toast.success('Image snippet added to HTML editor!')
  }

  const insertVideoSnippet = (vid: HoroscopeMediaItem) => {
    let snippet = ''
    if (vid.url.includes('youtube.com') || vid.url.includes('youtu.be')) {
      let embedUrl = vid.url
      if (vid.url.includes('watch?v=')) {
        embedUrl = vid.url.replace('watch?v=', 'embed/')
      } else if (vid.url.includes('youtu.be/')) {
        embedUrl = vid.url.replace('youtu.be/', 'www.youtube.com/embed/')
      }
      snippet = `\n<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; margin: 20px 0; border: 1px solid #E8DDD0;">
  <iframe src="${embedUrl}" style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen></iframe>
</div>\n`
    } else {
      snippet = `\n<div style="text-align: center; margin: 20px 0;">
  <video src="${vid.url}" controls style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);"></video>
</div>\n`
    }
    setFormData(prev => ({ ...prev, customCode: (prev.customCode || '') + snippet }))
    setActiveTab('editor')
    toast.success('Video snippet added to HTML editor!')
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Page Title is required')
      return
    }

    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        subtitle: formData.subtitle.trim(),
        description: formData.description.trim() || formData.subtitle.trim(),
        price: Number(formData.price) || 199,
        originalPrice: Number(formData.originalPrice) || 499,
        pages: Number(formData.pages) || 24,
        categories: formData.categories,
        badge: formData.badge.trim(),
        customCode: formData.customCode,
        layout: formData.layout,
        headerBanner: formData.headerBanner,
        showBookingBar: formData.showBookingBar,
        whatsappNumber: formData.whatsappNumber || '919530401984',
        images: formData.images,
        videos: formData.videos,
        razorpay: formData.razorpay,
        status: formData.status
      }

      const res = await fetch('/api/admin/horoscope-pages', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const json = await res.json()
      if (!res.ok || !json.ok) {
        throw new Error(json.error || 'Failed to save')
      }

      toast.success(editingId ? 'Horoscope report updated!' : 'Horoscope report created!')
      setModalOpen(false)
      loadPages()
    } catch (err: any) {
      toast.error(err.message || 'Error saving report')
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}"? It will disappear from the frontend.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/horoscope-pages?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || 'Delete failed')
      toast.success('Report removed successfully!')
      loadPages()
    } catch (err: any) {
      toast.error(err.message || 'Error deleting report')
    }
  }

  const copyUrl = (slug: string) => {
    const url = `${window.location.origin}/horoscope/${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    toast.success('Public URL copied to clipboard!')
    setTimeout(() => setCopiedSlug(null), 2500)
  }

  // Filtered reports in table
  const filteredPages = pages.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCat = filterCategory === 'All' || (p.categories || []).includes(filterCategory)
    return matchesSearch && matchesCat
  })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 notranslate" translate="no">

      {/* ── HEADER & ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 font-heading">
              Horoscope Reports & Landing Pages
            </h1>
            <Badge variant="outline" className="bg-[#FAF6ED] text-[#7A1F2B] border-[#E8DDD0]">
              Full Frontend Control
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            कंट्रोल सेंटर: यहाँ से आप फ्रंटएंड पर दिखने वाली किसी भी रिपोर्ट को <strong>Add</strong>, <strong>Remove</strong> या <strong>Edit</strong> कर सकते हैं, उसकी कीमत बदल सकते हैं और उसका अपना <strong>कस्टम लैंडिंग पेज HTML कोड</strong> डाल सकते हैं।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={loadPages} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>रिफ्रेश</span>
          </Button>

          <Button onClick={handleOpenCreate} className="bg-[#7A1F2B] hover:bg-[#962837] text-white gap-2 shadow-sm font-bold">
            <Plus className="h-4 w-4" />
            <span>+ नई रिपोर्ट / लैंडिंग पेज जोड़ें</span>
          </Button>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Input
            placeholder="रिपोर्ट खोजें (नाम या slug)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500">Category:</span>
          {['All', ...ALL_AVAILABLE_CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                filterCategory === cat
                  ? 'bg-[#151311] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── REPORTS LIST TABLE ── */}
      <Card className="shadow-xs border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">कुल रिपोर्ट्स ({filteredPages.length})</CardTitle>
              <CardDescription>
                ये सभी रिपोर्ट्स फ्रंटएंड पर /horoscope पेज पर लाइव दिखती हैं
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin text-[#7A1F2B]" />
              <span className="text-sm font-bold">लोड हो रहा है...</span>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <FileText className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-base font-bold text-slate-700">कोई रिपोर्ट नहीं मिली</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                ऊपर दिए गए "+ नई रिपोर्ट जोड़ें" बटन से नया फलादेश या लैंडिंग पेज बनाएं।
              </p>
              <Button onClick={handleOpenCreate} className="bg-[#7A1F2B] text-white font-bold">
                + नई रिपोर्ट जोड़ें
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF6ED] text-[#241A18] text-xs font-bold uppercase border-y border-[#E8DDD0]">
                  <tr>
                    <th className="py-3.5 px-4">रिपोर्ट नाम व विवरण</th>
                    <th className="py-3.5 px-4">कैटेगरी व बैज</th>
                    <th className="py-3.5 px-4">मूल्य (दक्षिणा)</th>
                    <th className="py-3.5 px-4">पेज प्रकार</th>
                    <th className="py-3.5 px-4">स्थिति</th>
                    <th className="py-3.5 px-4 text-right">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPages.map((page) => {
                    const hasCustomCode = Boolean(page.customCode && page.customCode.trim().length > 0)
                    return (
                      <tr key={page.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {page.title}
                            </span>
                            {page.badge && (
                              <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-[10px] font-black">
                                {page.badge}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                              /horoscope/{page.slug}
                            </span>
                            <button
                              onClick={() => copyUrl(page.slug)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
                              title="Copy URL"
                            >
                              {copiedSlug === page.slug ? (
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                          {page.subtitle && (
                            <p className="text-xs text-slate-500 line-clamp-1 max-w-md">
                              {page.subtitle}
                            </p>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {(page.categories || ['Life']).map(cat => (
                              <span key={cat} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-600">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <span className="font-black text-slate-900 text-sm">
                              ₹{page.price ?? 199}
                            </span>
                            {page.originalPrice && (
                              <span className="text-[11px] text-slate-400 line-through block">
                                ₹{page.originalPrice}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          {hasCustomCode ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <Code2 className="h-3 w-3" /> कस्टम लैंडिंग कोड
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                              <Sparkles className="h-3 w-3" /> वैदिक रिपोर्ट फॉर्म
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <Badge
                            variant="outline"
                            className={page.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                              : 'bg-amber-50 text-amber-700 border-amber-300 font-bold'
                            }
                          >
                            {page.status}
                          </Badge>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/horoscope/${page.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                              title="फ्रंटएंड पर देखें"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEdit(page)}
                              className="h-8 px-2 text-[#7A1F2B] hover:text-[#7A1F2B] hover:bg-[#FAF6ED]"
                              title="एडिट करें व कोड बदलें"
                            >
                              <Edit className="h-4 w-4 mr-1" /> एडिट
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(page.id, page.title)}
                              className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              title="हटाएं"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── CREATE / EDIT MODAL ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900">
              {editingId ? 'एडिट करें: ' + formData.title : 'नई रिपोर्ट / लैंडिंग पेज बनाएं'}
            </DialogTitle>
            <DialogDescription>
              मूल्य, नाम, कस्टम HTML कोड, रेज़रपे बटन व मीडिया का पूर्ण नियंत्रण
            </DialogDescription>
          </DialogHeader>

          {/* TAB NAVIGATION */}
          <div className="flex items-center gap-1.5 border-b pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'details'
                  ? 'bg-[#7A1F2B] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              1. सामान्य विवरण व मूल्य
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-[#7A1F2B] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" /> 2. कस्टम लैंडिंग कोड (HTML)
            </button>
            <button
              onClick={() => setActiveTab('razorpay')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'razorpay'
                  ? 'bg-[#7A1F2B] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="h-3.5 w-3.5" /> 3. Razorpay बटन
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'media'
                  ? 'bg-[#7A1F2B] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" /> 4. फ़ोटो व वीडियो
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-[#7A1F2B] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> 5. लाइव प्रीव्यू
            </button>
          </div>

          {/* ── TAB 1: BASIC DETAILS & PRICING ── */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">रिपोर्ट का नाम (Title) *</Label>
                  <Input
                    placeholder="जैसे: Love chart या सम्पूर्ण जन्मकुंडली"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">URL Slug *</Label>
                  <Input
                    placeholder="love-chart"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <span className="text-[11px] text-slate-500 font-mono">
                    URL: /horoscope/{formData.slug || 'slug'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">उप-शीर्षक / विवरण (Subtitle)</Label>
                <Input
                  placeholder="एक पंक्ति में इस रिपोर्ट का मुख्य लाभ लिखें..."
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">मूल्य (₹ दक्षिणा) *</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">पुराना मूल्य (₹ Strikethrough)</Label>
                  <Input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">अनुमानित पेज संख्या</Label>
                  <Input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">कैटेगरी चुनें (Category Tags)</Label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {ALL_AVAILABLE_CATEGORIES.map(cat => {
                    const isSelected = (formData.categories || []).includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#7A1F2B] text-white border-[#7A1F2B]'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                        <span>{cat}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">बैज (वैकल्पिक, जैसे: BESTSELLER)</Label>
                  <Input
                    placeholder="जैसे: POPULAR, NEW, REMEDY-FOCUSED"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">प्रकाशन स्थिति (Status)</Label>
                  <select
                    value={formData.status}
                    onChange={(e: any) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 text-sm bg-white font-medium"
                  >
                    <option value="PUBLISHED">PUBLISHED (वेबसाइट पर लाइव दिखेगा)</option>
                    <option value="DRAFT">DRAFT (छुपा रहेगा)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">लेआउट सुरक्षा मोड</Label>
                  <select
                    value={formData.layout}
                    onChange={(e: any) => setFormData({ ...formData, layout: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 text-sm bg-white"
                  >
                    <option value="container">वैदिक बॉक्स कंटेनर (सुरक्षित मार्जिन)</option>
                    <option value="fullwidth">100% फुल-विड्थ (Fluid)</option>
                    <option value="clean">क्लीन स्टैंडअलोन (Minimal)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">हेडर बैनर</Label>
                  <select
                    value={formData.headerBanner ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, headerBanner: e.target.value === 'yes' })}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 text-sm bg-white"
                  >
                    <option value="yes">दिखाएं</option>
                    <option value="no">छिपाएं</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">नीचे की व्हाट्सएप बार</Label>
                  <select
                    value={formData.showBookingBar ? 'yes' : 'no'}
                    onChange={(e) => setFormData({ ...formData, showBookingBar: e.target.value === 'yes' })}
                    className="w-full h-10 px-3 rounded-md border border-slate-300 text-sm bg-white"
                  >
                    <option value="yes">दिखाएं</option>
                    <option value="no">छिपाएं</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: CUSTOM LANDING PAGE CODE (HTML) ── */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-amber-700 shrink-0" />
                  <p className="text-xs text-amber-900 leading-snug font-medium">
                    <strong>सुझाव:</strong> यदि आप कस्टम कोड खाली रखेंगे, तो यह रिपोर्ट मानक वैदिक जन्म विवरण फॉर्म और अध्यायों के साथ खुलेगी। यदि आप नीचे HTML कोड डालेंगे, तो वही कस्टम लैंडिंग पेज दिखेगा।
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="file"
                    ref={htmlFileInputRef}
                    accept=".html,.htm"
                    className="hidden"
                    onChange={handleHtmlFileUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => htmlFileInputRef.current?.click()}
                    className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 gap-1.5 text-xs font-bold"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>HTML फ़ाइल अपलोड करें</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-bold text-slate-700">
                  HTML / Landing Page Source Code
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">टेम्पलेट्स:</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, customCode: CODE_TEMPLATES.vedicCard }))}
                    className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-medium"
                  >
                    कार्ड 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, customCode: CODE_TEMPLATES.dualPricingCards }))}
                    className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-medium"
                  >
                    दो कार्ड्स
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, customCode: '' }))}
                    className="text-[11px] text-rose-600 hover:text-rose-800 bg-rose-50 px-2 py-0.5 rounded font-medium"
                  >
                    खाली करें
                  </button>
                </div>
              </div>

              <textarea
                value={formData.customCode}
                onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
                rows={14}
                className="w-full font-mono text-xs p-3 rounded-lg border border-slate-300 bg-slate-900 text-emerald-400 focus:outline-hidden focus:ring-2 focus:ring-[#7A1F2B]"
                placeholder="<!-- यहाँ अपना कस्टम HTML, CSS या जावास्क्रिप्ट पेस्ट करें -->"
              />
            </div>
          )}

          {/* ── TAB 3: RAZORPAY PAYMENT ── */}
          {activeTab === 'razorpay' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">Razorpay Payment Integration</h4>
                  <p className="text-xs text-emerald-700">
                    लैंडिंग पेज पर ऑटोमैटिक सुरक्षित पेमेंट बटन सक्षम करें
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.razorpay.enabled}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    razorpay: { ...prev.razorpay, enabled: e.target.checked }
                  }))}
                  className="w-5 h-5 accent-[#7A1F2B] cursor-pointer"
                />
              </div>

              {formData.razorpay.enabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-xl bg-slate-50/50">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Amount in ₹ (दक्षिणा / शुल्क)</Label>
                    <Input
                      type="number"
                      value={formData.razorpay.amount || 501}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        razorpay: { ...prev.razorpay, amount: Number(e.target.value) }
                      }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Button Text</Label>
                    <Input
                      value={formData.razorpay.buttonText || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        razorpay: { ...prev.razorpay, buttonText: e.target.value }
                      }))}
                      placeholder="सुरक्षित दक्षिणा / भुगतान करें"
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <Button
                      type="button"
                      onClick={insertRazorpayButton}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white gap-2 text-xs font-bold"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>HTML कोड में पेमेंट बटन जोड़ें (Insert Razorpay Button)</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: MEDIA (IMAGES & VIDEOS) ── */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* IMAGES SECTION */}
              <div className="space-y-3 p-4 border rounded-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#7A1F2B]" /> फ़ोटो / इमेजेज
                  </h4>
                  <div>
                    <input
                      type="file"
                      ref={imageUploadInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'image')}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => imageUploadInputRef.current?.click()}
                      disabled={uploadingMedia}
                      className="gap-1.5 text-xs font-bold"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>फ़ोटो अपलोड करें</span>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="या इमेज लिंक पेस्ट करें (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button type="button" size="sm" onClick={handleAddImageUrl} className="bg-slate-800 text-white text-xs">
                    जोड़ें
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formData.images.map((img) => (
                      <div key={img.id} className="relative group border rounded-lg overflow-hidden bg-slate-50">
                        <img src={img.url} alt={img.title || ''} className="w-full h-24 object-cover" />
                        <div className="p-1.5 text-[11px] truncate">{img.title || 'Image'}</div>
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => insertImageSnippet(img)}
                            className="bg-white text-slate-900 px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Insert
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(img.id)}
                            className="bg-rose-600 text-white p-1 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* VIDEOS SECTION */}
              <div className="space-y-3 p-4 border rounded-xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Video className="h-4 w-4 text-[#7A1F2B]" /> वीडियो / YouTube
                  </h4>
                  <div>
                    <input
                      type="file"
                      ref={videoUploadInputRef}
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'video')}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => videoUploadInputRef.current?.click()}
                      disabled={uploadingMedia}
                      className="gap-1.5 text-xs font-bold"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>वीडियो अपलोड करें</span>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="YouTube या MP4 लिंक पेस्ट करें (https://...)"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button type="button" size="sm" onClick={handleAddVideoUrl} className="bg-slate-800 text-white text-xs">
                    जोड़ें
                  </Button>
                </div>

                {formData.videos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {formData.videos.map((vid) => (
                      <div key={vid.id} className="border rounded-lg p-2 flex items-center justify-between bg-slate-50 gap-2">
                        <div className="truncate text-xs font-mono">
                          {vid.title || vid.url}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => insertVideoSnippet(vid)}
                            className="bg-slate-800 text-white px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Insert
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(vid.id)}
                            className="bg-rose-600 text-white p-1 rounded"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 5: LIVE PREVIEW ── */}
          {activeTab === 'preview' && (
            <div className="border rounded-2xl p-4 bg-slate-100 max-h-[500px] overflow-y-auto">
              <div className="bg-white rounded-xl shadow-xs p-4 min-h-[350px]">
                {formData.customCode ? (
                  <HoroscopeLandingViewer
                    page={{
                      id: 'preview',
                      title: formData.title || 'Untitled Report',
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
                      status: formData.status,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    }}
                  />
                ) : (
                  <div className="text-center py-14 text-slate-400 space-y-2">
                    <Sparkles className="h-8 w-8 mx-auto text-[#7A1F2B]" />
                    <p className="text-sm font-bold text-slate-700">मानक वैदिक रिपोर्ट फॉर्म सक्रिय है</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      कस्टम HTML कोड खाली होने पर यह रिपोर्ट विमशोत्तरी दशा, 12 भावों के विश्लेषण और कुंडली फॉर्म के साथ खुलेगी।
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-4 flex sm:justify-between items-center">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              रद्द करें
            </Button>
            <Button onClick={handleSave} className="bg-[#7A1F2B] hover:bg-[#962837] text-white font-bold">
              {editingId ? 'बदलाव सुरक्षित करें' : 'नई रिपोर्ट प्रकाशित करें'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

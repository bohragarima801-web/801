'use client'

import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Video, Search, Cloud, Upload, Plus, Trash2, Link as LinkIcon, Sparkles } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { convertGoogleDriveUrl, compressImage } from '@/lib/utils'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })


function BlogForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [loadingData, setLoadingData] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  const [categoryId, setCategoryId] = useState('')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [publishedAt, setPublishedAt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [coverImageAlt, setCoverImageAlt] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [driveUrl, setDriveUrl] = useState('')
  const [faqs, setFaqs] = useState<{ question: string, answer: string }[]>([])

  // Quick Link System state
  const [pujas, setPujas] = useState<{ id: string; title: string; slug: string }[]>([])
  const [products, setProducts] = useState<{ id: string; name: string; slug: string }[]>([])
  const [linkText, setLinkText] = useState('')
  const [linkType, setLinkType] = useState<'puja' | 'product' | 'page' | 'custom'>('puja')
  const [selectedPujaSlug, setSelectedPujaSlug] = useState('')
  const [selectedProductSlug, setSelectedProductSlug] = useState('')
  const [selectedPageUrl, setSelectedPageUrl] = useState('/pujas')
  const [customUrl, setCustomUrl] = useState('')

  // Image SEO Alt Text state
  const [seoImageUrl, setSeoImageUrl] = useState('')
  const [seoImageAlt, setSeoImageAlt] = useState('')

  const [isMounted, setIsMounted] = useState(false)

  function generateAutoAltText() {
    const baseTitle = title || 'Vedic Rituals & Spiritual Puja'
    const categoryName = categories.find(c => c.id === categoryId)?.name || 'Spirituality'
    const keyWordsText = seoKeywords ? ` - ${seoKeywords}` : ''
    const generated = `${baseTitle} - ${categoryName}${keyWordsText} | Online Puja Booking DivyaYagyam`
    setSeoImageAlt(generated)
    toast.success('Generated SEO Alt Text!')
  }

  function handleInsertSeoImage() {
    if (!seoImageUrl) {
      toast.error('Please enter an image URL')
      return
    }
    const altText = seoImageAlt.trim() || (title ? `${title} - DivyaYagyam` : 'Blog Image DivyaYagyam')
    const markdownImg = `\n\n![${altText}](${seoImageUrl})\n\n`
    setContent(prev => (prev ? `${prev}${markdownImg}` : markdownImg))
    toast.success(`Inserted SEO optimized image into blog!`)
    setSeoImageUrl('')
  }

  useEffect(() => {
    setIsMounted(true)

    // Fetch Pujas for Quick Link tool
    fetch('/api/admin/pujas')
      .then(res => res.json())
      .then(data => {
        if (data.ok && Array.isArray(data.pujas)) {
          setPujas(data.pujas)
          if (data.pujas.length > 0) setSelectedPujaSlug(data.pujas[0].slug)
        }
      })
      .catch(() => {})

    // Fetch Products for Quick Link tool
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => {
        const prodList = data.ok && Array.isArray(data.data) ? data.data : (Array.isArray(data.products) ? data.products : [])
        if (prodList.length > 0) {
          setProducts(prodList)
          setSelectedProductSlug(prodList[0].slug)
        }
      })
      .catch(() => {})
  }, [])

  function getFormattedLinkUrl() {
    if (linkType === 'puja') {
      return `/pujas/${selectedPujaSlug || ''}`
    } else if (linkType === 'product') {
      return `/products/${selectedProductSlug || ''}`
    } else if (linkType === 'page') {
      return selectedPageUrl
    } else {
      return customUrl || '/'
    }
  }

  function getFormattedLinkMarkdown() {
    const text = linkText.trim() || 'online puja booking'
    const url = getFormattedLinkUrl()
    return `[${text}](${url})`
  }

  function handleInsertLink() {
    const markdownLink = getFormattedLinkMarkdown()
    setContent(prev => (prev ? `${prev}\n\n${markdownLink}` : markdownLink))
    toast.success(`Inserted link "${markdownLink}" into blog!`)
  }

  useEffect(() => {
    if (editId) {
      setLoadingData(true)
      Promise.all([
        fetch(`/api/admin/blog?id=${editId}`).then(res => res.json()),
        fetch('/api/admin/blog/categories').then(res => res.json())
      ])
        .then(([postData, catData]) => {
          if (catData.ok) setCategories(catData.data || [])
          
          if (postData.ok && postData.data) {
            const post = postData.data
            setTitle(post.title)
            setSlug(post.slug)
            setExcerpt(post.excerpt || '')
            setContent(post.content || '')
            setSeoTitle(post.seoTitle || '')
            setSeoDescription(post.seoDescription || '')
            setSeoKeywords(post.seoKeywords || '')
            setIsPublished(post.status === 'PUBLISHED')
            setPublishedAt(post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '')
            setCoverImage(post.coverImage || '')
            setCoverImageAlt(post.coverImageAlt || '')
            setVideoUrl(post.videoUrl || '')
            setIsVideoEnabled(post.isVideoEnabled !== undefined ? !!post.isVideoEnabled : true)
            setCategoryId(post.categoryId || '')
            if (post.faqs && Array.isArray(post.faqs)) {
              setFaqs(post.faqs)
            }
          } else {
            toast.error('Could not load blog post')
          }
        })
        .catch(() => toast.error('Network error loading post data'))
        .finally(() => setLoadingData(false))
    } else {
      fetch('/api/admin/blog/categories').then(res => res.json()).then(data => {
        if (data.ok && data.data.length > 0) {
          setCategories(data.data)
          setCategoryId(data.data[0].id)
        }
      })
    }
  }, [editId])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const compressedFile = await compressImage(file)

      const formData = new FormData()
      formData.append('file', compressedFile)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      if (data.ok) {
        setCoverImage(data.url)
        toast.success('Cover image uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch (error) {
      toast.error('Network error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  function handleDriveAdd() {
    if (!driveUrl) return
    const convertedUrl = convertGoogleDriveUrl(driveUrl)
    setCoverImage(convertedUrl)
    setDriveUrl('')
    toast.success('Drive link applied as cover!')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !slug || !content || !categoryId) {
      toast.error('Title, Slug, Category, and Content are required')
      return
    }

    setLoading(true)
    try {
      const cleanCoverImage = convertGoogleDriveUrl(coverImage)
      const cleanContent = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, altText, src) => {
        return `![${altText}](${convertGoogleDriveUrl(src)})`
      })

      const res = await fetch(`/api/admin/blog${editId ? `?id=${editId}` : ''}`, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content: cleanContent,
          categoryId,
          seoTitle,
          seoDescription,
          seoKeywords,
          coverImage: cleanCoverImage,
          coverImageAlt: coverImageAlt.trim() || (title ? `${title} - Online Puja Booking & Spiritual Guide DivyaYagyam` : ''),
          videoUrl,
          isVideoEnabled,
          faqs,
          status: (isPublished || (publishedAt && new Date(publishedAt) > new Date())) ? 'PUBLISHED' : 'DRAFT',
          publishedAt: publishedAt ? new Date(publishedAt).toISOString() : (isPublished ? new Date().toISOString() : null)
        })
      })


      const data = await res.json()
      if (data.ok) {
        toast.success(editId ? 'Blog post updated successfully!' : 'Blog post saved successfully!')
        router.push('/admin/blog')
      } else {
        toast.error(data.error || 'Failed to save blog post')
      }
    } catch (err) {
      toast.error('Network error saving post')
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted || loadingData) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{editId ? 'Edit Blog Post' : 'New Blog Post'}</CardTitle>
            <CardDescription>Write your content using Markdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                placeholder="Post title…" 
                value={title} 
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!editId && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
                  }
                }} 
                required 
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input placeholder="post-slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
            </div>
            {/* Quick Keyword Link Inserter Tool */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      Keyword Direct Link Tool <Sparkles className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
                    </h4>
                    <p className="text-xs text-slate-600">
                      ब्लॉग पोस्ट में किसी भी शब्द (जैसे "online puja booking") पर डायरेक्ट लिंक लगाने का आसान टूल।
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">1. Link Word/Text (शब्द)</Label>
                  <Input 
                    placeholder="e.g. online puja booking" 
                    value={linkText} 
                    onChange={(e) => setLinkText(e.target.value)}
                    className="bg-white text-xs h-9 rounded-xl border-amber-200"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">2. Type</Label>
                  <Select value={linkType} onValueChange={(val: any) => setLinkType(val)}>
                    <SelectTrigger className="bg-white text-xs h-9 rounded-xl border-amber-200"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="puja">Puja Page</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="page">Main Section / Page</SelectItem>
                      <SelectItem value="custom">Custom URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 sm:col-span-2 lg:col-span-2">
                  <Label className="text-xs font-bold text-slate-700">3. Destination Page (कहाँ लिंक खुले)</Label>
                  {linkType === 'puja' && (
                    <Select value={selectedPujaSlug} onValueChange={setSelectedPujaSlug}>
                      <SelectTrigger className="bg-white text-xs h-9 rounded-xl border-amber-200"><SelectValue placeholder="Select Puja" /></SelectTrigger>
                      <SelectContent>
                        {pujas.map((p) => (
                          <SelectItem key={p.id} value={p.slug}>
                            {p.title} (/pujas/{p.slug})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {linkType === 'product' && (
                    <Select value={selectedProductSlug} onValueChange={setSelectedProductSlug}>
                      <SelectTrigger className="bg-white text-xs h-9 rounded-xl border-amber-200"><SelectValue placeholder="Select Product" /></SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.slug}>
                            {p.name} (/products/{p.slug})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {linkType === 'page' && (
                    <Select value={selectedPageUrl} onValueChange={setSelectedPageUrl}>
                      <SelectTrigger className="bg-white text-xs h-9 rounded-xl border-amber-200"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="/pujas">Online Puja Booking (/pujas)</SelectItem>
                        <SelectItem value="/products">Pooja Samagri Store (/products)</SelectItem>
                        <SelectItem value="/bhaktiseva">Bhakti Seva (/bhaktiseva)</SelectItem>
                        <SelectItem value="/ask-a-pandit">Ask a Pandit (/ask-a-pandit)</SelectItem>
                        <SelectItem value="/astro">Astrology Services (/astro)</SelectItem>
                        <SelectItem value="/events">Upcoming Events (/events)</SelectItem>
                        <SelectItem value="/contact">Contact Us (/contact)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  {linkType === 'custom' && (
                    <Input 
                      placeholder="https://... or /path" 
                      value={customUrl} 
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="bg-white text-xs h-9 rounded-xl border-amber-200"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60">
                <div className="text-xs text-slate-600 font-medium">
                  Generated code: <code className="bg-white px-2 py-0.5 rounded-lg text-amber-800 font-mono border border-amber-200 text-xs">{getFormattedLinkMarkdown()}</code>
                </div>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleInsertLink} 
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-8 text-xs rounded-xl shadow-sm gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Insert Link into Blog Content
                </Button>
              </div>
            </div>

            {/* Image SEO & Alt Text Tool */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm">
                    <Upload className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      Image SEO & Alt Text Tool (गूगल इमेज सर्च के लिए) <Sparkles className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
                    </h4>
                    <p className="text-xs text-slate-600">
                      गूगल इमेज सर्च पर रैंक करने के लिए हर इमेज का कीवर्ड-रिच Descriptive Alt Text बनाएं और ब्लॉग में जोड़ें।
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-1">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-700">Image URL (इमेज लिंक)</Label>
                  <Input 
                    placeholder="https://... image url" 
                    value={seoImageUrl} 
                    onChange={(e) => setSeoImageUrl(e.target.value)}
                    className="bg-white text-xs h-9 rounded-xl border-blue-200"
                  />
                </div>

                <div className="space-y-1 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-700">Image Descriptive Alt Text (गूगल के लिए ऑल्ट टेक्स्ट)</Label>
                    <button
                      type="button"
                      onClick={generateAutoAltText}
                      className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" /> Auto-Generate Alt Text
                    </button>
                  </div>
                  <Input 
                    placeholder="e.g. Maha Mrityunjaya Puja Vidhi - Online Puja Booking DivyaYagyam" 
                    value={seoImageAlt} 
                    onChange={(e) => setSeoImageAlt(e.target.value)}
                    className="bg-white text-xs h-9 rounded-xl border-blue-200"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-200/60">
                <div className="text-xs text-slate-600 font-medium">
                  SEO Tag: <code className="bg-white px-2 py-0.5 rounded-lg text-blue-900 font-mono border border-blue-200 text-xs">![{seoImageAlt || 'Alt Text'}]({seoImageUrl || 'Image URL'})</code>
                </div>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleInsertSeoImage} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 text-xs rounded-xl shadow-sm gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Insert SEO Image into Blog Content
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content (Rich Text)</Label>
              <div data-color-mode="light" className="bg-white text-slate-900 rounded-md">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || '')}
                  height={400}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>FAQs</CardTitle>
              <CardDescription>Add Frequently Asked Questions for this post</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}>
              <Plus className="h-4 w-4 mr-2" /> Add FAQ
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No FAQs added yet.</p>
            ) : (
              faqs.map((faq, idx) => (
                <div key={idx} className="space-y-3 p-4 border rounded-xl bg-slate-50 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-1">
                    <Label>Question</Label>
                    <Input 
                      value={faq.question}
                      onChange={e => {
                        const newFaqs = [...faqs]
                        newFaqs[idx].question = e.target.value
                        setFaqs(newFaqs)
                      }}
                      placeholder="e.g. How to book a puja?"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Answer</Label>
                    <Textarea 
                      rows={2}
                      value={faq.answer}
                      onChange={e => {
                        const newFaqs = [...faqs]
                        newFaqs[idx].answer = e.target.value
                        setFaqs(newFaqs)
                      }}
                      placeholder="Answer..."
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" /> SEO Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>SEO Meta Title</Label><Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Title for Search Engines" /></div>
            <div className="space-y-2"><Label>SEO Meta Description</Label><Textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Description for Search Engines" /></div>
            <div className="space-y-2"><Label>SEO Keywords</Label><Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="e.g. puja, havan, astrology (comma separated)" /></div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50/50 pb-3">
            <CardTitle className="text-base flex items-center justify-between text-slate-900">
              <span>Publishing & Real-Time Schedule</span>
              {publishedAt && new Date(publishedAt) > new Date() && (
                <Badge className="bg-amber-600 text-white text-[10px]">⏰ Scheduled</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
              <div>
                <Label className="text-xs font-bold block">Publish Status</Label>
                <p className="text-[10px] text-slate-500">Toggle ON to enable live site visibility</p>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            <div className="space-y-1.5 p-3 rounded-lg border border-amber-200 bg-amber-50/40">
              <Label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                ⏰ Real-Time Schedule Date & Time (शेड्यूल समय)
              </Label>
              <Input 
                type="datetime-local" 
                value={publishedAt} 
                onChange={(e) => {
                  setPublishedAt(e.target.value)
                  if (e.target.value) setIsPublished(true)
                }} 
                className="text-xs bg-white border-amber-300"
              />
              <p className="text-[10px] text-amber-800">
                तारीख व समय सेट करें। पोस्ट उसी समय रीयल-टाइम में लाइव होगी। खाली छोड़ने पर तुरंत लाइव होगी।
              </p>
              {publishedAt && (
                <button 
                  type="button" 
                  onClick={() => setPublishedAt('')}
                  className="text-[10px] text-red-600 hover:underline font-semibold block pt-1"
                >
                  Clear Schedule (शेड्यूल हटाएं)
                </button>
              )}
            </div>

            <Button className="w-full font-bold" type="submit" disabled={loading || uploadingImage}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editId ? 'Update Blog Post' : (publishedAt && new Date(publishedAt) > new Date() ? '⏰ Schedule Post for Future' : (isPublished ? '🚀 Publish Live Now' : '💾 Save as Draft'))}
            </Button>
          </CardContent>
        </Card>

        
        <Card>
          <CardHeader><CardTitle className="text-base">Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Image</Label>
              {coverImage && (
                <div className="aspect-video relative rounded-md overflow-hidden border bg-slate-100 flex items-center justify-center">
                  <img src={coverImage} alt="Cover Preview" className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium gap-2 w-full select-none">
                  {uploadingImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploadingImage ? 'Uploading…' : 'Upload Cover Image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>

                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Or paste Google Drive link"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button type="button" size="sm" onClick={handleDriveAdd} disabled={!driveUrl} className="bg-blue-600 hover:bg-blue-700">
                    <Cloud className="h-4 w-4 mr-1" /> Use
                  </Button>
                </div>

                {/* Dedicated Cover Image Alt Text Field */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-slate-800">Cover Image Alt Text (गूगल ऑल्ट टैग)</Label>
                    <button
                      type="button"
                      onClick={() => {
                        const catName = categories.find(c => c.id === categoryId)?.name || 'Spirituality'
                        const autoText = title ? `${title} - ${catName} | Online Puja Booking DivyaYagyam` : 'Online Puja Booking DivyaYagyam'
                        setCoverImageAlt(autoText)
                        toast.success('Generated Cover Image Alt Text!')
                      }}
                      className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="h-3 w-3 text-blue-600 fill-blue-600" /> Auto-Generate
                    </button>
                  </div>
                  <Input
                    placeholder="e.g. Maha Mrityunjaya Puja Vidhi & Benefits - DivyaYagyam"
                    value={coverImageAlt}
                    onChange={(e) => setCoverImageAlt(e.target.value)}
                    className="text-xs h-9 bg-slate-50 border-blue-200 rounded-xl"
                  />
                  <p className="text-[10px] text-slate-500">Google Image Search और Live Page पर दिखने वाला ऑल्ट टेक्स्ट।</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label className="flex items-center gap-2">
                <Video className="h-4 w-4" /> YouTube Video URL
              </Label>
              <Input 
                placeholder={process.env.NEXT_PUBLIC_URL_4556 || ''} 
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)} 
              />
              <p className="text-[10px] text-muted-foreground">If provided, this video will be embedded at the top of the blog post.</p>
              
              <div className="flex items-center justify-between pt-2">
                <Label>Enable Video</Label>
                <Switch checked={isVideoEnabled} onCheckedChange={setIsVideoEnabled} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Blog Editor" description="Write and publish SEO optimized articles."
        breadcrumbs={[{ label: 'Blog', href: '/admin/blog' }, { label: 'Editor' }]} />
      <Suspense fallback={<div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
        <BlogForm />
      </Suspense>
    </div>
  )
}

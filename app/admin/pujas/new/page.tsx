'use client'
import React from 'react';

import { useEffect, useState } from 'react'
import Image from 'next/image';
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Cloud, Upload, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { convertGoogleDriveUrl, compressImage, getSafeImageUrl, generateShortSlug } from '@/lib/utils'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

interface ItemRef {
  id: string
  name: string
}

const DEFAULT_PACKAGE_IMAGES = ['/package-1.jpg', '/package-2.jpg', '/package-4.jpg', '/package-6.jpg']

const DEFAULT_PACKAGES = [
  {
    id: 'default-1',
    name: "1 Member",
    price: "991",
    description: "एक व्यक्ति के नाम और गोत्र से संकल्प एवं पूजा अर्चन की जाएगी।",
    image: "/package-1.jpg"
  },
  {
    id: 'default-2',
    name: "2 Member",
    price: "1501",
    description: "दो व्यक्तियों (पति-पत्नी या परिवार के सदस्य) के नाम और गोत्र से संकल्प एवं पूजा।",
    image: "/package-2.jpg"
  },
  {
    id: 'default-4',
    name: "4 Member",
    price: "2499",
    description: "पूरे परिवार (अधिकतम 4 सदस्य) के नाम और गोत्र से विशेष महासंकल्प एवं पूजन।",
    image: "/package-4.jpg"
  },
  {
    id: 'default-6',
    name: "6 Member",
    price: "3499",
    description: "पूरे परिवार (अधिकतम 6 सदस्य) के नाम और गोत्र से विशेष महासंकल्प एवं पूजन।",
    image: "/package-6.jpg"
  }
]


function checkIsVideo(u: string) {
  if (!u) return false
  const lower = u.toLowerCase()
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.mkv') ||
    lower.endsWith('.m3u8') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com') ||
    lower.startsWith('data:video/')
  )
}

function NewPujaPage_Content() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [categories, setCategories] = useState<ItemRef[]>([])
  const [loadingRefs, setLoadingRefs] = useState(true)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [location, setLocation] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [benefits, setBenefits] = useState('')
  const [price, setPrice] = useState('1100')
  const [vipPrice, setVipPrice] = useState('5100')
  const [duration, setDuration] = useState('60')
  const [maxMembers, setMaxMembers] = useState('5')
  const [isVip, setIsVip] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isEvergreen, setIsEvergreen] = useState(false)
  const [isFestival, setIsFestival] = useState(false)
  const [status, setStatus] = useState('DRAFT')
  const [pujaDate, setPujaDate] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const [customHtml, setCustomHtml] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [packages, setPackages] = useState<any[]>(DEFAULT_PACKAGES)
  const [saving, setSaving] = useState(false)
  const [loadingPuja, setLoadingPuja] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [driveUrl, setDriveUrl] = useState('')
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [uploadingGallery, setUploadingGallery] = useState(false)

  // Fetch references
  useEffect(() => {
    const fetchRefs = async () => {
      try {
        setLoadingRefs(true)
        const [catRes] = await Promise.all([
          fetch('/api/admin/puja-categories')
        ])

        const [catData] = await Promise.all([
          catRes.json()
        ])

        if (catData.ok) setCategories(catData.data || [])
      } catch {
        toast.error('Failed to load categories references')
      } finally {
        setLoadingRefs(false)
      }
    }

    fetchRefs()
  }, [])

  // Auto slugify name with clean SEO short slug generator
  useEffect(() => {
    if (!editId && name.trim()) {
      setSlug(generateShortSlug(name))
    }
  }, [name, editId])

  // Fetch details if edit mode
  useEffect(() => {
    if (!editId) return
    const fetchPuja = async () => {
      try {
        setLoadingPuja(true)
        const res = await fetch(`/api/admin/pujas?id=${editId}`)
        const data = await res.json()
        if (data.ok && data.puja) {
          const p = data.puja
          setName(p.name || '')
          setSlug(p.slug || '')
          setCategoryId(p.categoryId || '')
          setLocation(p.location || '')
          setShortDescription(p.shortDescription || '')
          setDescription(p.description || '')
          setBenefits(p.benefits || '')
          setPrice(String(p.price || '0'))
          setVipPrice(String(p.vipPrice || ''))
          setDuration(String(p.duration || '60'))
          setMaxMembers(String(p.maxMembers || '1'))
          setIsVip(!!p.isVip)
          setIsOnline(!!p.isOnline)
          setIsFeatured(!!p.isFeatured)
          setIsEvergreen(!!p.isEvergreen)
          setIsFestival(!!p.isFestival)
          setStatus(p.status || 'DRAFT')
          setPujaDate(p.pujaDate ? new Date(p.pujaDate).toISOString().slice(0, 16) : '')
          setPublishedAt(p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 16) : '')
          setSeoTitle(p.seoTitle || '')
          setSeoDescription(p.seoDescription || '')
          setSeoKeywords(p.seoKeywords || '')
          setCustomHtml(p.customHtml || '')
          setCoverImage(p.coverImage || '')
          if (p.images && Array.isArray(p.images)) {
            const allUrls = p.images.map((img: any) => typeof img === 'string' ? img : img.url).filter(Boolean)
            const photos = allUrls.filter((u: string) => !checkIsVideo(u))
            const vid = allUrls.find((u: string) => checkIsVideo(u))
            setGalleryImages(photos)
            if (vid) setVideoUrl(vid)
          }
          setPackages(
            p.packages && p.packages.length > 0 
              ? p.packages.map((pkg: any, idx: number) => ({ ...pkg, image: pkg.image || DEFAULT_PACKAGE_IMAGES[idx % DEFAULT_PACKAGE_IMAGES.length] })) 
              : DEFAULT_PACKAGES
          )

        } else {
          toast.error('Failed to find puja details')
        }
      } catch {
        toast.error('Error fetching puja details')
      } finally {
        setLoadingPuja(false)
      }
    }
    fetchPuja()
  }, [editId])

  // Handle image upload fallback
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    // Auto compress image
    file = await compressImage(file)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.ok && data.url) {
        setCoverImage(data.url)
        toast.success('Puja file uploaded successfully!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Network error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingGallery(true)
    const newUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = await compressImage(files[i])
      const formData = new FormData()
      formData.append('file', file)
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        if (data.ok && data.url) {
          newUrls.push(data.url)
        }
      } catch {
        toast.error(`Failed to upload ${file.name}`)
      }
    }

    if (newUrls.length > 0) {
      setGalleryImages(prev => [...prev, ...newUrls])
      toast.success(`${newUrls.length} image(s) added to gallery!`)
    }
    setUploadingGallery(false)
    e.target.value = ''
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingVideo(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.ok && data.url) {
        setVideoUrl(data.url)
        toast.success('Puja video uploaded successfully!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Error uploading video file')
    } finally {
      setUploadingVideo(false)
    }
  }



  function handleDriveAdd() {
    if (!driveUrl) return
    const convertedUrl = convertGoogleDriveUrl(driveUrl)
    setCoverImage(convertedUrl)
    setDriveUrl('')
    toast.success('Drive link applied as cover!')
  }

  const handleAddPackage = () => {
    const defaultImg = DEFAULT_PACKAGE_IMAGES[packages.length % DEFAULT_PACKAGE_IMAGES.length]
    setPackages([
      ...packages, 
      { 
        id: Date.now().toString(), 
        name: '', 
        price: '', 
        description: '',
        image: defaultImg
      }
    ])
  }


  const handleRemovePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index))
  }

  const handlePackageChange = (index: number, field: string, value: string) => {
    const newPkgs = [...packages]
    newPkgs[index] = { ...newPkgs[index], [field]: value }
    setPackages(newPkgs)
  }

  const handlePackageImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0]
    if (!file) return

    toast.loading('Compressing & uploading package image...', { id: `pkg-upload-${index}` })
    
    try {
      const compressedFile = await compressImage(file)
      const formData = new FormData()
      formData.append('file', compressedFile)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.ok && data.url) {
        handlePackageChange(index, 'image', data.url)
        toast.success('Package image uploaded successfully!', { id: `pkg-upload-${index}` })
      } else {
        // Fallback: Read as base64 data URL so image is saved cleanly
        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            handlePackageChange(index, 'image', event.target.result as string)
            toast.success('Package image saved!', { id: `pkg-upload-${index}` })
          }
        }
        reader.readAsDataURL(compressedFile)
      }
    } catch (error) {
      // Fallback to reader on network error
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          handlePackageChange(index, 'image', event.target.result as string)
          toast.success('Package image saved!', { id: `pkg-upload-${index}` })
        }
      }
      reader.readAsDataURL(file)
    } finally {
      e.target.value = ''
    }
  }


  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Puja Name is required')
      return
    }
    if (!categoryId) {
      toast.error('Please select a Category')
      return
    }

    try {
      setSaving(true)
      const payload = {
        id: editId || undefined,
        name,
        slug,
        categoryId,
        location,
        shortDescription,
        description,
        benefits,
        price: Number(price) || 0,
        vipPrice: vipPrice ? Number(vipPrice) : null,
        duration: Number(duration) || 60,
        maxMembers: Number(maxMembers) || 1,
        isVip,
        isOnline,
        isFeatured,
        isEvergreen,
        isFestival,
        status,
        pujaDate: pujaDate ? new Date(pujaDate).toISOString() : null,
        publishedAt: status === 'PUBLISHED' && publishedAt ? new Date(publishedAt).toISOString() : null,
        seoTitle,
        seoDescription,
        seoKeywords,
        customHtml,
        coverImage,
        packages,
        images: [
          ...galleryImages.filter(u => u && u.trim()),
          ...(videoUrl.trim() ? [videoUrl.trim()] : [])
        ]
      }

      const res = await fetch('/api/admin/pujas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.ok) {
        toast.success(editId ? 'Puja updated successfully!' : 'Puja created successfully!')
        router.push('/admin/pujas')
      } else {
        toast.error(data.error || 'Failed to save puja')
      }
    } catch {
      toast.error('Network error saving puja')
    } finally {
      setSaving(false)
    }
  }

  const isVideoFile = (url: string) => {
    if (!url) return false
    return (
      url.endsWith('.mp4') ||
      url.endsWith('.webm') ||
      url.endsWith('.ogg') ||
      url.startsWith('data:video/')
    )
  }

  if (loadingPuja) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={editId ? 'Edit Puja' : 'Add Puja'}
        description="Create or edit a puja with pricing, samagri, and booking configurations."
        breadcrumbs={[{ label: 'Pujas', href: '/admin/pujas' }, { label: editId ? 'Edit' : 'New' }]}
      />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Details (विवरण)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Puja Name (पूजा का नाम)</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maha Rudrabhishek" />
              </div>
              <div className="space-y-2">
                <Label>Slug (यूआरएल स्लॉग)</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. maha-rudrabhishek" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category (श्रेणी)</Label>
                  {loadingRefs ? (
                    <div className="text-xs text-muted-foreground animate-pulse">Loading categories...</div>
                  ) : (
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Location (स्थान)</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Ujjain, Kashi..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description (संक्षिप्त विवरण)</Label>
                <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Full Description (विस्तृत विवरण)</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
              </div>
              <div className="space-y-2">
                <Label>Benefits (लाभ)</Label>
                <Textarea value={benefits} onChange={(e) => setBenefits(e.target.value)} rows={3} placeholder="e.g. removes obstacles, brings prosperity…" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">SEO Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>SEO Meta Title</Label><Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Title for Search Engines" /></div>
              <div className="space-y-2"><Label>SEO Meta Description</Label><Textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Description for Search Engines" /></div>
              <div className="space-y-2"><Label>SEO Keywords</Label><Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="e.g. puja, havan, shanti (comma separated)" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Pricing & Slots (मूल्य निर्धारण)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label>Base Price (₹)</Label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>VIP Price (₹)</Label>
                  <Input type="number" value={vipPrice} onChange={(e) => setVipPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Max Members</Label>
                  <Input type="number" value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base font-bold">Custom Packages</Label>
                    <p className="text-xs text-muted-foreground">Add specific packages like Basic, Premium, etc.</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddPackage}>
                    <Plus className="h-4 w-4 mr-1" /> Add Package
                  </Button>
                </div>
                
                {packages.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic text-center py-4 border rounded bg-slate-50">No custom packages added. Base/VIP prices will be used.</p>
                ) : (
                  <div className="space-y-4">
                    {packages.map((pkg, i) => (
                      <div key={pkg.id || i} className="p-3 border rounded-lg bg-slate-50 relative space-y-3">
                        <div className="grid sm:grid-cols-12 gap-3">
                          <div className="sm:col-span-4 space-y-1">
                            <Label className="text-xs font-bold">Package Name (1 सदस्य / 2 सदस्य आदि)</Label>
                            <Input value={pkg.name} onChange={(e) => handlePackageChange(i, 'name', e.target.value)} placeholder="e.g. 1 Member Puja Pack" required />
                          </div>
                          <div className="sm:col-span-3 space-y-1">
                            <Label className="text-xs font-bold">Price (₹)</Label>
                            <Input type="number" value={pkg.price} onChange={(e) => handlePackageChange(i, 'price', e.target.value)} placeholder="e.g. 1100" required />
                          </div>
                          <div className="sm:col-span-4 space-y-1">
                            <Label className="text-xs font-bold">Description</Label>
                            <Input value={pkg.description || ''} onChange={(e) => handlePackageChange(i, 'description', e.target.value)} placeholder="Package benefits..." />
                          </div>
                          <div className="sm:col-span-1 flex items-end justify-end">
                            <Button type="button" variant="destructive" size="icon" onClick={() => handleRemovePackage(i)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Permanent Package Image Upload System */}
                        <div className="pt-3 border-t border-slate-200">
                          <Label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                            📸 पैकेज फ़ोटो अपलोड (Package Photo Upload)
                          </Label>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-200 bg-white shadow-2xs">
                            <div className="flex items-center gap-3">
                              {pkg.image ? (
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border border-slate-300 bg-slate-100 shrink-0 shadow-xs group">
                                  <img 
                                    src={getSafeImageUrl(pkg.image)} 
                                    alt={pkg.name || `Package ${i + 1}`} 
                                    className="h-full w-full object-contain p-0.5 bg-slate-50 transition-transform group-hover:scale-105" 

                                    onError={(e) => {
                                      e.currentTarget.src = '/package-1.jpg';
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handlePackageChange(i, 'image', '')}
                                    className="absolute top-1 right-1 bg-red-600 text-white text-[10px] p-1 rounded-full shadow-md hover:bg-red-700 transition-colors"
                                    title="फ़ोटो हटाएं (Remove Photo)"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="h-16 w-16 rounded-md border-2 border-dashed border-orange-300 bg-orange-50/50 flex flex-col items-center justify-center text-orange-600 shrink-0">
                                  <Upload className="h-5 w-5 mb-0.5" />
                                  <span className="text-[9px] font-bold">No Photo</span>
                                </div>
                              )}
                              <div className="space-y-0.5">
                                <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${pkg.image ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {pkg.image ? '✓ फ़ोटो अपलोड है' : '⚠️ फ़ोटो चुनना बाकी है'}
                                </span>
                                <p className="text-xs text-slate-600 font-medium">
                                  {pkg.image ? 'Custom package image active' : 'Click upload button to choose file from device'}
                                </p>
                                <p className="text-[10px] text-slate-400">Supported: JPG, PNG, WebP (Auto WebP Compressed)</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {pkg.image && (
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handlePackageChange(i, 'image', '')}
                                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                >
                                  Hataen (Remove)
                                </Button>
                              )}
                              <label className="cursor-pointer inline-flex items-center justify-center rounded-md bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs gap-1.5 transition-all active:scale-95">
                                <Upload className="h-3.5 w-3.5" />
                                {pkg.image ? 'फ़ोटो बदलें (Change Image)' : 'फ़ोटो अपलोड करें (Upload Image)'}
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handlePackageImageUpload(i, e)} 
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </CardContent>
          </Card>

          {/* ⚡ CUSTOM HTML / JS / EMBED CODE CARD */}
          <Card className="border-indigo-200">
            <CardHeader className="bg-indigo-50/50 pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-indigo-950">
                ⚡ Custom HTML / JS / Embed Code (कस्टम कोड आउटपुट)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              <Label className="text-xs font-bold text-slate-700">Paste Custom HTML, Widget Code, iFrame or JS Snippet</Label>
              <Textarea 
                rows={4} 
                value={customHtml} 
                onChange={(e) => setCustomHtml(e.target.value)} 
                placeholder="e.g. <iframe src='...'></iframe> or <div class='custom-widget'>...</div>" 
                className="font-mono text-xs bg-slate-950 text-emerald-400 placeholder:text-slate-600"
              />
              <p className="text-[10px] text-slate-500">
                यह कोड बिना किसी एरर या डिले के पूजा विवरण पेज पर स्पष्ट रूप से आउटपुट के रूप में रेंडर होगा।
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Publishing (प्रकाशन)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-orange-50/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-800">VIP Puja</Label>
                  <p className="text-xs text-slate-500">Enable to mark this as a VIP Puja.</p>
                </div>
                <Switch checked={isVip} onCheckedChange={setIsVip} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-800">Monthly/Evergreen</Label>
                  <p className="text-xs text-slate-500">Enable for pujas that always stay on the homepage.</p>
                </div>
                <Switch checked={isEvergreen} onCheckedChange={setIsEvergreen} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold text-slate-800">Festival Special</Label>
                  <p className="text-xs text-slate-500">Enable to highlight this during festivals.</p>
                </div>
                <Switch checked={isFestival} onCheckedChange={setIsFestival} />
              </div>
              
              <div className="space-y-2">
                <Label>Date of the Puja (Ceremony Date)</Label>
                <Input type="datetime-local" value={pujaDate} onChange={(e) => setPujaDate(e.target.value)} />
                <p className="text-[10px] text-muted-foreground">Used for Today / Upcoming logic on the homepage.</p>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft (Hidden)</SelectItem>
                    <SelectItem value="PUBLISHED">Published (Live)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : (editId ? 'Update Puja' : 'Save Puja')}
              </Button>
            </CardContent>
          </Card>

          {/* 🖼️ PUJA PHOTO & GALLERY MANAGEMENT */}
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50/50 pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-slate-900">
                🖼️ Puja Cover Photo & Gallery (पूजा फ़ोटो प्रबंधन)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Main Puja Cover Image (मुख्य फ़ोटो)</Label>
                {coverImage && (
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border bg-slate-100 flex items-center justify-center shadow-xs">
                    <img 
                      src={getSafeImageUrl(coverImage)} 
                      className="h-full w-full object-cover" 
                      alt="Cover Preview" 
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800';
                      }}
                    />
                  </div>
                )}
                
                <label className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium gap-2 w-full select-none">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? 'Uploading…' : 'Upload Cover Photo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
                </label>

                <div className="flex gap-2 pt-1">
                  <Input type="text" value={driveUrl} onChange={(e) => setDriveUrl(e.target.value)} placeholder="Google Drive Image link" className="text-xs" />
                  <Button type="button" size="sm" onClick={handleDriveAdd} disabled={!driveUrl} className="bg-blue-600 hover:bg-blue-700 shrink-0">
                    <Cloud className="h-4 w-4 mr-1" /> Use
                  </Button>
                </div>
                <Input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Or paste image URL" className="text-xs" />
              </div>

              <div className="pt-3 border-t space-y-2">
                <Label className="text-xs font-bold text-slate-700">Puja Gallery Photos (अतिरिक्त फ़ोटो)</Label>
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-slate-50 group shadow-xs">
                        <img 
                          src={getSafeImageUrl(imgUrl)} 
                          className="h-full w-full object-cover" 
                          alt={`Gallery ${idx + 1}`} 
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800';
                          }}
                        />
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold shadow"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <label className="cursor-pointer inline-flex items-center justify-center rounded-xl border border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-100/50 px-4 py-2 text-xs font-bold text-orange-800 gap-2 w-full select-none transition-colors">
                  {uploadingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploadingGallery ? 'Uploading images…' : 'Upload Gallery Photos'}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* 🎥 PUJA SACRED VIDEO MANAGEMENT (PASTE LINK + FILE UPLOAD + REMOVE SYSTEM) */}
          <Card className="border-blue-200 shadow-xs">
            <CardHeader className="bg-blue-50/60 pb-3 border-b border-blue-100">
              <CardTitle className="text-base flex items-center justify-between text-blue-950">
                <span className="flex items-center gap-2">
                  🎥 Sacred Ritual Video & Live Stream (पूजा वीडियो एडिट/अपलोड)
                </span>
                <Badge variant={videoUrl ? "default" : "outline"} className={videoUrl ? "bg-emerald-600 text-white" : "text-slate-500"}>
                  {videoUrl ? '✓ Video Active' : 'No Video'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              
              {/* Option A: Paste Video Link */}
              <div className="space-y-1.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <Label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>1️⃣ Paste Video Link (YouTube / MP4 / Drive / Vimeo Link)</span>
                  {videoUrl && (
                    <button 
                      type="button" 
                      onClick={() => { setVideoUrl(''); toast.info('Video link cleared'); }}
                      className="text-[11px] text-red-600 hover:underline font-semibold"
                    >
                      Clear Link (लिंक हटाएं)
                    </button>
                  )}
                </Label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    value={videoUrl} 
                    onChange={(e) => setVideoUrl(e.target.value)} 
                    placeholder="e.g. https://www.youtube.com/watch?v=... or https://site.com/video.mp4" 
                    className="text-xs bg-white"
                  />
                  {videoUrl && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setVideoUrl('')}
                      className="text-xs text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">
                  YouTube links, Vimeo, or direct MP4 video URLs paste कर सकते हैं।
                </p>
              </div>

              {/* Option B: Upload Video File */}
              <div className="space-y-1.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                <Label className="text-xs font-bold text-slate-800 block">
                  2️⃣ Upload Video File directly from device (डिवाइस से वीडियो फ़ाइल अपलोड करें)
                </Label>
                <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-900 px-4 py-2.5 text-xs font-bold gap-2 w-full select-none transition-all active:scale-[0.99]">
                  {uploadingVideo ? <Loader2 className="h-4 w-4 animate-spin text-blue-700" /> : <Upload className="h-4 w-4 text-blue-700" />}
                  {uploadingVideo ? 'Uploading Video File to Server…' : '📁 Choose Video File (MP4 / WebM / MOV)'}
                  <input 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    onChange={handleVideoUpload} 
                    disabled={uploadingVideo} 
                  />
                </label>
              </div>

              {/* Video Live Preview & Permanent Removal */}
              {videoUrl ? (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Live Video Preview Player (संलग्न वीडियो प्रीव्यू):
                    </Label>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        setVideoUrl('')
                        toast.success('Video removed from puja')
                      }} 
                      className="text-xs h-7 px-2.5 font-bold shadow-2xs"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Video Hataen (Remove Video)
                    </Button>
                  </div>

                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-300 bg-black relative shadow-md">
                    {getYouTubeEmbedUrl(videoUrl) ? (
                      <iframe 
                        src={getYouTubeEmbedUrl(videoUrl)!} 
                        className="w-full h-full" 
                        title="YouTube Puja Video Preview" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen 
                      />
                    ) : (
                      <video src={getYouTubeEmbedUrl(videoUrl) || videoUrl} controls className="w-full h-full object-contain" />
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 border border-dashed rounded-lg bg-slate-50 text-slate-400 space-y-1">
                  <Video className="h-6 w-6 mx-auto text-slate-300" />
                  <p className="text-xs font-medium text-slate-500">कोई वीडियो संलग्न नहीं है (No video attached)</p>
                  <p className="text-[10px] text-slate-400">ऊपर दिए लिंक इनपुट या फाइल अपलोड से वीडियो जोड़ें।</p>
                </div>
              )}

            </CardContent>
          </Card>

        </div>
      </form>
    </div>
  )
}


export default function NewPujaPage() {
  return (
    <React.Suspense fallback={<div className="flex h-96 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#FF8C21]"></div></div>}>
      <NewPujaPage_Content />
    </React.Suspense>
  )
}

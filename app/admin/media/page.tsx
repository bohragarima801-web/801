'use client'

import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Copy, Trash2, Upload, Link as LinkIcon, Image as ImageIcon, Video as VideoIcon, Flame, Edit2, Search, Sparkles } from 'lucide-react'
import { compressImage } from '@/lib/utils'

function MediaLibraryManager() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Section mode: 'IMAGE' or 'VIDEO'
  const sectionMode = searchParams.get('mode') || 'IMAGE'
  const activeFolder = searchParams.get('folder') || 'all'

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Form states
  const [filename, setFilename] = useState('')
  const [altText, setAltText] = useState('')
  const [folderTag, setFolderTag] = useState('General')
  const [videoUrlInput, setVideoUrlInput] = useState('')

  // Edit dialog state
  const [editingMedia, setEditingMedia] = useState<any | null>(null)
  const [editFilename, setEditFilename] = useState('')
  const [editAltText, setEditAltText] = useState('')
  const [editFolder, setEditFolder] = useState('')

  async function loadItems() {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/media?folder=${activeFolder}&type=${sectionMode}`)
      const data = await res.json()
      if (data.ok) {
        setItems(data.data || [])
      }
    } catch {
      toast.error('Failed to load media library items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [sectionMode, activeFolder])

  const setMode = (mode: 'IMAGE' | 'VIDEO') => {
    router.push(`/admin/media?mode=${mode}&folder=${activeFolder}`)
  }

  const setFolder = (folder: string) => {
    router.push(`/admin/media?mode=${sectionMode}&folder=${folder}`)
  }

  async function handleAddVideoUrl() {
    if (!videoUrlInput) {
      toast.error('Please enter a YouTube or Video URL')
      return
    }
    setUploading(true)
    try {
      const saveRes = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: videoUrlInput,
          filename: filename || 'Divine Video',
          mimeType: 'video/mp4',
          type: 'VIDEO',
          folder: folderTag,
        }),
      })
      const saveData = await saveRes.json()
      if (!saveData.ok) throw new Error(saveData.error || 'Failed to save video URL')

      toast.success('Video URL successfully added!')
      setVideoUrlInput('')
      setFilename('')
      loadItems()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save video')
    } finally {
      setUploading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      let fileToUpload = file
      let isVid = file.type.startsWith('video/') || sectionMode === 'VIDEO'

      if (!isVid) {
        // Auto compress image to WebP
        fileToUpload = await compressImage(file)
      }

      const formData = new FormData()
      formData.append('file', fileToUpload)

      // 1. Upload to /api/upload
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      let uploadData: any
      const contentType = uploadRes.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        uploadData = await uploadRes.json()
      } else {
        const text = await uploadRes.text()
        if (uploadRes.status === 413 || text.toLowerCase().includes('too large')) {
          throw new Error('File size too large. Please upload files under 4.5MB.')
        }
        throw new Error('Upload failed')
      }

      if (!uploadData.ok) throw new Error(uploadData.error || 'Upload failed')

      // 2. Save in database
      const saveRes = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadData.url,
          filename: filename || file.name,
          altText: altText || filename || file.name,
          size: file.size,
          mimeType: file.type,
          type: isVid ? 'VIDEO' : 'IMAGE',
          folder: folderTag,
        }),
      })
      const saveData = await saveRes.json()
      if (!saveData.ok) throw new Error(saveData.error || 'Failed to save record')

      toast.success(isVid ? 'Video uploaded successfully!' : 'Photo uploaded with SEO Alt Text!')
      setFilename('')
      setAltText('')
      loadItems()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to complete upload')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Asset deleted successfully')
        loadItems()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Network error deleting asset')
    }
  }

  function openEditModal(media: any) {
    setEditingMedia(media)
    setEditFilename(media.filename || '')
    setEditAltText(media.altText || media.filename || '')
    setEditFolder(media.folder || 'General')
  }

  async function handleSaveEdit() {
    if (!editingMedia) return
    try {
      const res = await fetch('/api/admin/media', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMedia.id,
          filename: editFilename,
          altText: editAltText,
          folder: editFolder,
        })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Media details updated successfully!')
        setEditingMedia(null)
        loadItems()
      } else {
        toast.error(data.error || 'Update failed')
      }
    } catch {
      toast.error('Network error updating media')
    }
  }

  function getYouTubeId(url: string) {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  function getMediaThumbnail(media: any) {
    if (!media?.url) return ''
    const ytId = getYouTubeId(media.url)
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    }
    return media.url
  }

  function copyToClipboard(url: string) {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    toast.success('Link copied to clipboard!')
  }

  const categoryFolders = [
    { label: 'All Folders', value: 'all' },
    { label: 'Live Darshan (लाइव दर्शन)', value: 'Live Darshan' },
    { label: 'Past Pujas (बीती हुई पूजा)', value: 'Past Puja' },
    { label: 'Aarti & Bhajan (आरती व भजन)', value: 'Aarti & Bhajan' },
    { label: 'Customer Reviews (श्रद्धालु रिव्यु)', value: 'Customer Review' },
    { label: 'Home Assets (होम पेज)', value: 'Home Video' },
    { label: 'General / Others', value: 'General' }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="🖼️ Media Management (इमेज एवं वीडियो अलग-अलग)"
        description="Isolated Image & Video management. Manage SEO Alt texts for photos, and YouTube/MP4 video clips."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Media' }]}
      />

      {/* Main Section Mode Switcher (Images vs Videos) */}
      <div className="flex gap-4 p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border w-fit">
        <button
          onClick={() => setMode('IMAGE')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            sectionMode === 'IMAGE'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <ImageIcon className="h-4 w-4" /> 🖼️ Photo & Image Library (फ़ोटो प्रबंधन)
        </button>

        <button
          onClick={() => setMode('VIDEO')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
            sectionMode === 'VIDEO'
              ? 'bg-orange-600 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          <VideoIcon className="h-4 w-4" /> 🎥 Sacred Videos (वीडियो प्रबंधन)
        </button>
      </div>

      {/* Uploader Panel */}
      <Card className="rounded-3xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            {sectionMode === 'IMAGE' ? (
              <>
                <ImageIcon className="h-5 w-5 text-amber-600" /> Upload New Photo with SEO Alt Text
              </>
            ) : (
              <>
                <VideoIcon className="h-5 w-5 text-orange-600" /> Add New Video Clip or YouTube Link
              </>
            )}
          </CardTitle>
          <CardDescription className="text-xs">
            {sectionMode === 'IMAGE'
              ? 'Upload local image files. Compression is automatic and SEO Alt text gets attached for Google Search.'
              : 'Upload MP4 video files or paste YouTube video links.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="grid gap-4 md:grid-cols-3 items-end border-b pb-6">
            <div className="space-y-2">
              <Label htmlFor="mediaName">Asset Title (शीर्षक)</Label>
              <Input
                id="mediaName"
                placeholder={sectionMode === 'IMAGE' ? "e.g. Kashi Temple Ritual Image" : "e.g. Kashi Live Aarti"}
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>

            {sectionMode === 'IMAGE' && (
              <div className="space-y-2">
                <Label htmlFor="seoAlt">🔍 SEO Alt Text (गूगल खोज हेतु)</Label>
                <Input
                  id="seoAlt"
                  placeholder="e.g. Kashi Vishwanath Temple Abhishek Puja Mandir"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="border-amber-300 focus:border-amber-500"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Category Tag</Label>
              <Select value={folderTag} onValueChange={setFolderTag}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General / Others</SelectItem>
                  <SelectItem value="Live Darshan">Live Darshan (🎥 लाइव दर्शन)</SelectItem>
                  <SelectItem value="Past Puja">Past Puja (🕉️ बीती हुई पूजा)</SelectItem>
                  <SelectItem value="Aarti & Bhajan">Aarti & Bhajan (🎵 आरती)</SelectItem>
                  <SelectItem value="Customer Review">Customer Review (⭐ रिव्यु)</SelectItem>
                  <SelectItem value="Home Video">Home Video (होम पेज)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 text-sm font-semibold transition-all gap-2 w-full h-10 shadow-sm">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? 'Uploading…' : sectionMode === 'IMAGE' ? 'Upload Local Photo' : 'Upload Local MP4 File'}
                <input
                  type="file"
                  accept={sectionMode === 'IMAGE' ? "image/*" : "video/*"}
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {/* YouTube Video Link Input (only shown in Video mode) */}
          {sectionMode === 'VIDEO' && (
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <Label className="font-bold text-slate-800 text-sm">Add YouTube Video Link Directly</Label>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="https://www.youtube.com/watch?v=... or shorts URL"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  className="bg-white border-slate-300 flex-1"
                />
                <Button 
                  onClick={handleAddVideoUrl}
                  disabled={uploading || !videoUrlInput}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 shrink-0 h-10 rounded-xl"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Video Link
                </Button>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Category Folder Filter Tabs */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        {categoryFolders.map((t) => (
          <button
            key={t.value}
            onClick={() => setFolder(t.value)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeFolder === t.value
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
          <h3 className="font-semibold text-sm">No {sectionMode === 'IMAGE' ? 'Photos' : 'Videos'} Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Upload new {sectionMode === 'IMAGE' ? 'photos' : 'videos'} to see them listed here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {items.map((media) => {
            const thumbUrl = getMediaThumbnail(media)
            return (
              <Card key={media.id} className="overflow-hidden border group relative rounded-2xl shadow-sm bg-white flex flex-col justify-between">
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  {sectionMode === 'IMAGE' ? (
                    <img 
                      src={media.url} 
                      alt={media.altText || media.filename || 'Sacred Photo'} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : thumbUrl ? (
                    <img 
                      src={thumbUrl} 
                      alt={media.filename || 'Video Thumbnail'} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" 
                    />
                  ) : (
                    <video src={`${media.url}#t=0.5`} className="h-full w-full object-cover" muted playsInline />
                  )}
                  
                  <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                    <Badge className="bg-amber-600 text-white font-bold text-[9px] border-none">
                      {media.folder || 'General'}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex flex-col">
                    <span className="font-bold text-xs truncate text-slate-800" title={media.filename}>
                      {media.filename || 'Unnamed Asset'}
                    </span>
                    {media.altText && (
                      <span className="text-[10px] text-amber-700 truncate font-medium" title={media.altText}>
                        SEO Alt: {media.altText}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px] gap-1 rounded-lg" onClick={() => copyToClipboard(media.url)}>
                      <Copy className="h-3 w-3" /> Link
                    </Button>
                    <Button size="icon" variant="secondary" className="h-7 w-7 rounded-lg shrink-0" onClick={() => openEditModal(media)} title="Edit Asset & Alt Text">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-7 w-7 rounded-lg shrink-0" onClick={() => handleDelete(media.id)} title="Delete Asset">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Modal Dialog */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-800">Edit Asset & SEO Alt Text</h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Asset Title</Label>
                <Input value={editFilename} onChange={(e) => setEditFilename(e.target.value)} />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">SEO Alt Text (For Google Search)</Label>
                <Input value={editAltText} onChange={(e) => setEditAltText(e.target.value)} placeholder="e.g. Kashi Vishwanath Mahapuja Ritual" />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Category Tag</Label>
                <Select value={editFolder} onValueChange={setEditFolder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Live Darshan">Live Darshan</SelectItem>
                    <SelectItem value="Past Puja">Past Puja</SelectItem>
                    <SelectItem value="Aarti & Bhajan">Aarti & Bhajan</SelectItem>
                    <SelectItem value="Customer Review">Customer Review</SelectItem>
                    <SelectItem value="Home Video">Home Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setEditingMedia(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">Save Changes</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MediaLibraryPage() {
  return (
    <Suspense fallback={
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    }>
      <MediaLibraryManager />
    </Suspense>
  )
}

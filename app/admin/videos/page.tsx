'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Copy, Trash2, Upload, Link as LinkIcon, Video, Edit2, Check, X, Sparkles, Youtube } from 'lucide-react'
import { convertGoogleDriveUrl } from '@/lib/utils'
import { getYouTubeEmbedUrl } from '@/lib/youtube'

export default function AdminVideosPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  
  // Form states
  const [title, setTitle] = useState('')
  const [videoUrlInput, setVideoUrlInput] = useState('')

  // Edit modal state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingUrl, setEditingUrl] = useState('')
  const [editingUploading, setEditingUploading] = useState(false)

  async function loadVideos() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/videos')
      const data = await res.json()
      if (data.ok) {
        setItems(data.data || [])
      }
    } catch {
      toast.error('Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVideos()
  }, [])

  // Upload MP4 video file
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      toast.error('Please select a valid video file (.mp4, .webm, .mov)')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
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
          throw new Error('Video file size is too large for direct upload. Please use a YouTube link or CDN URL.')
        }
        throw new Error('Video upload failed')
      }

      if (!uploadData.ok) throw new Error(uploadData.error || 'Upload failed')

      const saveRes = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadData.url,
          filename: title || file.name.replace(/\.[^/.]+$/, ""),
          folder: 'Home Video',
          mimeType: file.type || 'video/mp4',
        }),
      })

      const saveData = await saveRes.json()
      if (!saveData.ok) throw new Error(saveData.error || 'Failed to save video record')

      toast.success('🎉 Video uploaded and published successfully!')
      setTitle('')
      loadVideos()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to complete video upload')
    } finally {
      setUploading(false)
    }
  }

  // Add YouTube / External Video Link
  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault()

    if (!videoUrlInput.trim()) {
      toast.error('Please enter a YouTube video or MP4 URL')
      return
    }

    let formattedUrl = convertGoogleDriveUrl(videoUrlInput.trim())

    try {
      setUploading(true)
      const saveRes = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formattedUrl,
          filename: title || 'Sacred Video Link',
          folder: 'Home Video',
          mimeType: formattedUrl.includes('youtube') || formattedUrl.includes('youtu.be') ? 'video/youtube' : 'video/mp4',
        }),
      })

      const saveData = await saveRes.json()
      if (!saveData.ok) throw new Error(saveData.error || 'Failed to add video link')

      toast.success('🎉 Video link added successfully!')
      setTitle('')
      setVideoUrlInput('')
      loadVideos()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add video link')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this video?')) return
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.ok) {
        toast.success('Video deleted successfully')
        loadVideos()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Error deleting video')
    }
  }

  async function handleSaveEdit(id: string) {
    if (!editingUrl.trim()) {
      toast.error('Video URL cannot be empty')
      return
    }

    const formattedUrl = convertGoogleDriveUrl(editingUrl.trim())

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          filename: editingTitle,
          url: formattedUrl,
          folder: 'Home Video',
          mimeType: formattedUrl.includes('youtube') || formattedUrl.includes('youtu.be') ? 'video/youtube' : 'video/mp4'
        })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Video updated successfully')
        setEditingId(null)
        loadVideos()
      } else {
        toast.error(data.error || 'Update failed')
      }
    } catch {
      toast.error('Error updating video')
    }
  }

  async function handleEditFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setEditingUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()
      if (uploadData.ok && uploadData.url) {
        setEditingUrl(uploadData.url)
        toast.success('New video file uploaded! Click Save to apply.')
      } else {
        toast.error(uploadData.error || 'Upload failed')
      }
    } catch {
      toast.error('Failed to upload replacement video')
    } finally {
      setEditingUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="🎥 Divya Darshan & Puja Videos Manager"
        description="Add, edit, or delete videos for the homepage & Puja section. Supports YouTube, YouTube Shorts, Google Drive, and MP4 uploads."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Videos' }]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Add Video via Link (YouTube / MP4 URL) */}
        <Card className="shadow-sm border-amber-200/60 bg-gradient-to-br from-amber-50/30 via-background to-orange-50/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
              <Youtube className="h-5 w-5 text-red-600" /> Paste Video Link (YouTube / MP4 URL)
            </CardTitle>
            <CardDescription>
              Supports YouTube Videos, YouTube Shorts, Google Drive Video Links, or direct MP4 URLs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddLink} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="vidTitle">Video Personal Heading (वीडियो हेडिंग)</Label>
                <Input
                  id="vidTitle"
                  placeholder="e.g. Puja Performance, Devotee Review, Mahakaleshwar Aarti..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={uploading}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vidUrl">Video URL (लिंक)</Label>
                <Input
                  id="vidUrl"
                  placeholder="https://www.youtube.com/watch?v=... or shorts URL"
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  disabled={uploading}
                />
              </div>

              <Button type="submit" disabled={uploading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LinkIcon className="h-4 w-4 mr-2" />}
                Add Video to List ({items.length} Videos Total)
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Card 2: Upload MP4 File */}
        <Card className="shadow-sm border-orange-200/60 bg-gradient-to-br from-orange-50/30 via-background to-amber-50/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-orange-900">
              <Upload className="h-5 w-5 text-orange-600" /> Upload Local MP4 / WebM File
            </CardTitle>
            <CardDescription>
              Directly upload video files from your computer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="uploadVidTitle">Video Personal Heading (वीडियो हेडिंग)</Label>
              <Input
                id="uploadVidTitle"
                placeholder="e.g. Puja Performance, Devotee Review..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
              />
            </div>

            <div className="relative border-2 border-dashed border-orange-300 rounded-xl p-6 text-center transition-colors bg-background hover:bg-orange-50/50 cursor-pointer">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                {uploading ? (
                  <>
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                    <p className="text-sm font-semibold text-orange-800">Uploading Video File… Please wait</p>
                  </>
                ) : (
                  <>
                    <Video className="h-8 w-8 text-orange-600" />
                    <p className="text-sm font-semibold text-slate-800">Click to select MP4 video from device</p>
                    <p className="text-xs text-muted-foreground">Supports MP4, WebM, MOV files</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Grid Section */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Published Videos ({items.length})
            </CardTitle>
            <CardDescription>All video items currently active on the site.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadVideos}>Refresh List</Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600 mr-3" /> Loading videos…
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-xl bg-slate-50 text-muted-foreground">
              No videos uploaded yet. Add videos using the forms above!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item) => {
                const embedUrl = getYouTubeEmbedUrl(item.url)
                const isEditing = editingId === item.id

                return (
                  <div key={item.id} className="rounded-2xl border border-border/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between bg-card group">
                    
                    {/* Player Preview Header */}
                    <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          className="w-full h-full border-none pointer-events-auto"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="w-full h-full object-contain"
                          controls
                          preload="metadata"
                        />
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      {isEditing ? (
                        <div className="space-y-3 bg-amber-50/50 p-3 rounded-xl border border-amber-200">
                          <div className="space-y-1">
                            <Label className="text-xs font-bold text-amber-900">Heading (वीडियो शीर्षक)</Label>
                            <Input
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              placeholder="Video Heading"
                              className="text-xs bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs font-bold text-amber-900">Video Link (YouTube / MP4 URL)</Label>
                            <Input
                              value={editingUrl}
                              onChange={(e) => setEditingUrl(e.target.value)}
                              placeholder="Video URL"
                              className="text-xs bg-white"
                            />
                          </div>

                          <div className="pt-1">
                            <label className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-amber-300 bg-white hover:bg-amber-100 px-3 py-1.5 text-xs font-medium gap-1.5 w-full select-none">
                              {editingUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5 text-amber-700" />}
                              {editingUploading ? 'Uploading file…' : 'Replace with MP4 File'}
                              <input type="file" accept="video/*" className="hidden" onChange={handleEditFileUpload} disabled={editingUploading} />
                            </label>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-amber-200">
                            <Button size="sm" variant="default" className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white font-bold" onClick={() => handleSaveEdit(item.id)}>
                              <Check className="h-3.5 w-3.5 mr-1" /> Save Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => setEditingId(null)}>
                              <X className="h-3.5 w-3.5 mr-1" /> Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[10px] text-muted-foreground block mb-1 font-medium">
                            Added: {new Date(item.createdAt).toLocaleDateString('en-IN')}
                          </span>
                          <h4 className="font-bold text-sm line-clamp-2 leading-snug text-foreground">
                            {item.filename || 'Divya Darshan Video'}
                          </h4>
                          <p className="text-[11px] text-muted-foreground truncate mt-1">
                            {item.url}
                          </p>
                        </div>
                      )}

                      {/* Action buttons */}
                      {!isEditing && (
                        <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              navigator.clipboard.writeText(item.url)
                              toast.success('Video link copied!')
                            }}
                          >
                            <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                          </Button>

                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                              onClick={() => {
                                setEditingId(item.id)
                                setEditingTitle(item.filename || '')
                                setEditingUrl(item.url || '')
                              }}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


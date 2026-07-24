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
import { Loader2, Video, Search, Cloud, Upload } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { convertGoogleDriveUrl, compressImage } from '@/lib/utils'

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
  const [isPublished, setIsPublished] = useState(true)
  const [publishedAt, setPublishedAt] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [driveUrl, setDriveUrl] = useState('')

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
            setIsPublished(post.status === 'PUBLISHED')
            setPublishedAt(post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '')
            setCoverImage(post.coverImage || '')
            setVideoUrl(post.videoUrl || '')
            setIsVideoEnabled(post.isVideoEnabled !== undefined ? !!post.isVideoEnabled : true)
            setCategoryId(post.categoryId || '')
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
      const res = await fetch(`/api/admin/blog${editId ? `?id=${editId}` : ''}`, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          categoryId,
          seoTitle,
          seoDescription,
          coverImage,
          videoUrl,
          isVideoEnabled,
          status: isPublished ? 'PUBLISHED' : 'DRAFT',
          publishedAt: isPublished && publishedAt ? new Date(publishedAt).toISOString() : null
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

  if (loadingData) {
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
            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <Textarea rows={14} placeholder="# Heading\n\nWrite your post here…" value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
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
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
              <Label>Publish (Live)</Label>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
            {isPublished && (
              <div className="space-y-2">
                <Label>Schedule Publish Date/Time</Label>
                <Input type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
                <p className="text-[10px] text-muted-foreground">Leave blank to publish immediately.</p>
              </div>
            )}
            <Button className="w-full" type="submit" disabled={loading || uploadingImage}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editId ? 'Update Post' : (isPublished ? (publishedAt && new Date(publishedAt) > new Date() ? 'Schedule Post' : 'Publish Now') : 'Save Draft')}
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

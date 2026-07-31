'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  Loader2, Send, Calendar, Video, Image as ImageIcon, Trash2, Plus, Sparkles,
  Facebook, Instagram, Youtube, Twitter, Linkedin, Send as TelegramIcon, Globe,
  CheckCircle2, XCircle, RefreshCw, Key, Play, Clock
} from 'lucide-react'

function SocialSchedulerHub() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'composer'

  const [posts, setPosts] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [generatingAi, setGeneratingAi] = useState(false)

  // Composer Form
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [mediaUrl, setMediaUrl] = useState('')
  const [platforms, setPlatforms] = useState<string[]>(['telegram', 'facebook', 'instagram'])
  const [postNow, setPostNow] = useState(true)
  const [scheduledAt, setScheduledAt] = useState('')

  // Account Credentials Form (for Accounts tab)
  const [accountPlatform, setAccountPlatform] = useState('TELEGRAM')
  const [accountName, setAccountName] = useState('')
  const [accountId, setAccountId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [savingAccount, setSavingAccount] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const [postsRes, accRes] = await Promise.all([
        fetch('/api/admin/social/posts'),
        fetch('/api/admin/social/accounts'),
      ])
      const postsData = await postsRes.json()
      const accData = await accRes.json()

      if (postsData.ok) setPosts(postsData.data || [])
      if (accData.ok) setAccounts(accData.data || [])
    } catch (err) {
      toast.error('Failed to load social hub data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function setTab(tab: string) {
    router.push(`/admin/social?tab=${tab}`)
  }

  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const { compressImage } = await import('@/lib/utils')
    const compressedFile = await compressImage(file)
    const formData = new FormData()
    formData.append('file', compressedFile)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.ok) {
        setMediaUrl(data.url)
        toast.success('Media file uploaded successfully!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Network error uploading file')
    } finally {
      setUploading(false)
    }
  }

  async function handleAiSeoGenerate() {
    if (!title && !caption) {
      toast.error('Please enter a post topic or title first!')
      return
    }

    setGeneratingAi(true)
    try {
      const res = await fetch('/api/admin/social/ai-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: title || caption,
          targetPlatform: platforms.join(', '),
        }),
      })
      const data = await res.json()
      if (data.ok && data.data) {
        if (data.data.title && !title) setTitle(data.data.title)
        if (data.data.caption) setCaption(data.data.caption)
        if (data.data.hashtags) setHashtags(data.data.hashtags)
        toast.success('✨ AI SEO Caption & Hashtags generated!')
      } else {
        toast.error(data.error || 'AI Generation failed')
      }
    } catch {
      toast.error('Network error generating AI SEO copy')
    } finally {
      setGeneratingAi(false)
    }
  }

  function togglePlatform(p: string) {
    if (platforms.includes(p)) {
      setPlatforms(platforms.filter((x) => x !== p))
    } else {
      setPlatforms([...platforms, p])
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    if (!caption && !title) {
      toast.error('Post title or caption is required.')
      return
    }
    if (platforms.length === 0) {
      toast.error('Select at least one social media platform.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          caption,
          hashtags,
          mediaUrl,
          platforms,
          postNow,
          scheduledAt,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message)
        setTitle('')
        setCaption('')
        setHashtags('')
        setMediaUrl('')
        setScheduledAt('')
        setPostNow(true)
        loadData()
      } else {
        toast.error(data.error || 'Post creation failed')
      }
    } catch {
      toast.error('Network error creating post')
    } finally {
      setSaving(false)
    }
  }

  async function handlePublishNow(postId: string) {
    toast.info('Publishing post real-time...')
    try {
      const res = await fetch(`/api/admin/social/posts/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PUBLISH_NOW' }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Post broadcast completed!')
        loadData()
      } else {
        toast.error(data.error || 'Publish failed')
      }
    } catch {
      toast.error('Network error publishing post')
    }
  }

  async function handleDeletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this scheduled post?')) return
    try {
      const res = await fetch(`/api/admin/social/posts/${postId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.ok) {
        toast.success('Scheduled post deleted!')
        loadData()
      } else {
        toast.error(data.error || 'Delete failed')
      }
    } catch {
      toast.error('Network error deleting post')
    }
  }

  async function handleSaveAccount(e: React.FormEvent) {
    e.preventDefault()
    if (!accountPlatform || !accountName) return

    setSavingAccount(true)
    try {
      const res = await fetch('/api/admin/social/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: accountPlatform,
          accountName,
          accountId,
          accessToken,
          apiSecret,
          webhookUrl,
          isActive: true,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Account credentials saved successfully!')
        setAccountName('')
        setAccountId('')
        setAccessToken('')
        setApiSecret('')
        setWebhookUrl('')
        loadData()
      } else {
        toast.error(data.error || 'Failed to save account')
      }
    } catch {
      toast.error('Network error saving account')
    } finally {
      setSavingAccount(false)
    }
  }

  async function handleTriggerCron() {
    toast.info('Triggering scheduler cron engine...')
    try {
      const res = await fetch('/api/cron/social-scheduler')
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message)
        loadData()
      } else {
        toast.error(data.error || 'Cron engine failed')
      }
    } catch {
      toast.error('Network error triggering cron engine')
    }
  }

  const platformIcons: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    x: Twitter,
    linkedin: Linkedin,
    telegram: TelegramIcon,
    webhook: Globe,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="📱 Social Media Hub & Scheduler"
        description="Manage multi-platform image/video posts, AI SEO captions, and real-time accurate publishing across Telegram, Facebook, Instagram, YouTube, Twitter, and Webhooks."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Social Hub' }]}
        action={
          <Button onClick={handleTriggerCron} variant="outline" className="border-orange-500 text-orange-600 font-bold gap-2">
            <RefreshCw className="h-4 w-4" /> Trigger Scheduler Cron Engine
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[650px]">
          <TabsTrigger value="composer">✍️ Create & Schedule</TabsTrigger>
          <TabsTrigger value="queue">📅 Queue & Calendar</TabsTrigger>
          <TabsTrigger value="accounts">🔐 Accounts & API Keys</TabsTrigger>
          <TabsTrigger value="logs">📊 Audit Logs</TabsTrigger>
        </TabsList>

        {/* COMPOSER TAB */}
        <TabsContent value="composer" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2 rounded-3xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
                  <span>Create Social Post & Broadcast</span>
                  <Button type="button" variant="outline" size="sm" onClick={handleAiSeoGenerate} disabled={generatingAi} className="border-amber-500 text-amber-700 bg-amber-50 hover:bg-amber-100 font-bold gap-1.5 text-xs">
                    {generatingAi ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    {generatingAi ? 'Generating…' : '✨ AI SEO Assistant'}
                  </Button>
                </CardTitle>
                <CardDescription className="text-xs">Attach photos or videos, generate SEO copy, select target platforms, and set schedule.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Post Title / Topic</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Sawan Somwar Maha Rudrabhishek Special Live Seva 🌸"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caption">Post Caption (Main Content Body)</Label>
                    <Textarea
                      id="caption"
                      placeholder="Write your engaging post copy here..."
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      required
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hashtags">Hashtags & Keywords</Label>
                    <Input
                      id="hashtags"
                      placeholder="#DivyaYagyam #SanatanSeva #PujaOnline #HarHarMahadev"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                    />
                  </div>

                  {/* Media Attachment */}
                  <div className="space-y-2">
                    <Label>Attached Photo / Video</Label>
                    <div className="flex items-center gap-4 border p-3 rounded-2xl bg-slate-50">
                      <div className="h-16 w-16 bg-slate-200 border rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                        {mediaUrl ? (
                          /\.(mp4|mov|avi|webm)/i.test(mediaUrl) ? (
                            <Video className="h-6 w-6 text-orange-600" />
                          ) : (
                            <img src={mediaUrl} alt="Media" className="h-full w-full object-cover" />
                          )
                        ) : (
                          <ImageIcon className="h-6 w-6 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <Input value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Paste media URL or upload file" className="text-xs" />
                        <label className="cursor-pointer inline-flex items-center justify-center rounded-xl bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-all gap-1 shrink-0">
                          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                          {uploading ? 'Uploading…' : 'Upload File'}
                          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaUpload} disabled={uploading} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Immediate vs Schedule Switch */}
                  <div className="flex items-center justify-between p-3.5 bg-orange-50/60 border border-orange-200 rounded-2xl">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-xs text-orange-950">Publish Immediately (Real-time Broadcast)</span>
                      <span className="text-[10px] text-orange-800">Uncheck to set accurate date and time for future publishing</span>
                    </div>
                    <Switch checked={postNow} onCheckedChange={setPostNow} />
                  </div>

                  {!postNow && (
                    <div className="space-y-2">
                      <Label htmlFor="schDate">Schedule Date & Time</Label>
                      <Input
                        id="schDate"
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        required={!postNow}
                      />
                    </div>
                  )}

                  <Button type="submit" disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl h-11 text-sm font-bold">
                    {saving ? (
                      <span className="flex items-center justify-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Post…</span>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> {postNow ? 'Publish Now to Selected Platforms' : 'Schedule Post Broadcast'}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Target Platforms Checklist */}
            <Card className="rounded-3xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800">Target Platforms</CardTitle>
                <CardDescription className="text-xs">Post will broadcast to checked social accounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: 'telegram', name: 'Telegram Bot / Channel', icon: TelegramIcon, color: 'text-sky-500' },
                  { id: 'facebook', name: 'Facebook Page', icon: Facebook, color: 'text-blue-600' },
                  { id: 'instagram', name: 'Instagram Graph', icon: Instagram, color: 'text-pink-600' },
                  { id: 'youtube', name: 'YouTube Channel', icon: Youtube, color: 'text-red-600' },
                  { id: 'twitter', name: 'Twitter / X', icon: Twitter, color: 'text-slate-900' },
                  { id: 'linkedin', name: 'LinkedIn Company', icon: Linkedin, color: 'text-blue-700' },
                  { id: 'webhook', name: 'Universal Webhook', icon: Globe, color: 'text-emerald-600' },
                ].map((p) => {
                  const Icon = p.icon
                  const isChecked = platforms.includes(p.id)
                  const acc = accounts.find((a) => a.platform.toLowerCase() === p.id)
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 border rounded-2xl bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-5 w-5 ${p.color}`} />
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-slate-800">{p.name}</span>
                          <span className="text-[9px] text-slate-500">{acc ? `Connected: ${acc.accountName}` : 'Configured via Settings / Keys'}</span>
                        </div>
                      </div>
                      <Switch checked={isChecked} onCheckedChange={() => togglePlatform(p.id)} />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* QUEUE TAB */}
        <TabsContent value="queue" className="space-y-6">
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800">Scheduled Posts & Queue</CardTitle>
              <CardDescription className="text-xs">All scheduled, published, and draft social media posts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>
              ) : posts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-xs">No posts found in queue.</div>
              ) : (
                <div className="border rounded-2xl divide-y bg-slate-50">
                  {posts.map((post) => (
                    <div key={post.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                      <div className="flex gap-3">
                        {post.mediaUrls && post.mediaUrls[0] && (
                          /\.(mp4|mov|avi|webm)/i.test(post.mediaUrls[0]) ? (
                            <div className="h-14 w-14 bg-orange-100 border rounded-xl flex items-center justify-center shrink-0">
                              <Video className="h-6 w-6 text-orange-600" />
                            </div>
                          ) : (
                            <img src={post.mediaUrls[0]} alt={post.title} className="h-14 w-14 rounded-xl object-cover border shrink-0" />
                          )
                        )}
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 text-sm block">{post.title || 'Untitled Social Post'}</span>
                          <p className="text-xs text-slate-600 max-w-xl line-clamp-2">{post.caption}</p>
                          {post.hashtags && <p className="text-[10px] text-orange-700 font-mono">{post.hashtags}</p>}
                          <div className="flex gap-1 pt-1">
                            {post.platforms.map((p: string) => (
                              <Badge key={p} variant="outline" className="text-[9px] uppercase font-bold">
                                {p}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Badge
                          variant={post.status === 'PUBLISHED' ? 'success' : post.status === 'FAILED' ? 'destructive' : 'secondary'}
                          className="font-bold text-[10px]"
                        >
                          {post.status}
                        </Badge>
                        <span className="text-[10px] text-slate-500">
                          {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString('en-IN') : 'Instant'}
                        </span>
                        <div className="flex gap-1 pt-1">
                          {post.status !== 'PUBLISHED' && (
                            <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold text-orange-600 border-orange-500 gap-1" onClick={() => handlePublishNow(post.id)}>
                              <Play className="h-3 w-3" /> Publish Now
                            </Button>
                          )}
                          <Button size="icon" variant="destructive" className="h-7 w-7 rounded-lg" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACCOUNTS TAB */}
        <TabsContent value="accounts" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="rounded-3xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800">Add / Configure Social Account</CardTitle>
                <CardDescription className="text-xs">Configure platform Access Tokens, Page IDs, Bot Tokens & Webhooks.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <select
                      className="w-full border rounded-xl h-10 px-3 text-xs bg-background"
                      value={accountPlatform}
                      onChange={(e) => setAccountPlatform(e.target.value)}
                    >
                      <option value="TELEGRAM">Telegram Bot</option>
                      <option value="FACEBOOK">Facebook Page</option>
                      <option value="INSTAGRAM">Instagram Graph</option>
                      <option value="YOUTUBE">YouTube Channel</option>
                      <option value="TWITTER">Twitter / X</option>
                      <option value="LINKEDIN">LinkedIn Company</option>
                      <option value="WEBHOOK">Universal Webhook</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Account / Channel Name</Label>
                    <Input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g. DivyaYagyam Official" required />
                  </div>

                  <div className="space-y-2">
                    <Label>Page ID / Channel ID / Chat ID</Label>
                    <Input value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="e.g. @divyayagyam_channel or 12345678" />
                  </div>

                  <div className="space-y-2">
                    <Label>Access Token / Bot Token</Label>
                    <Input type="password" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} placeholder="Paste API Access Token or Bot Token" />
                  </div>

                  <div className="space-y-2">
                    <Label>API Secret Key (Optional)</Label>
                    <Input type="password" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} placeholder="Paste Client Secret if applicable" />
                  </div>

                  <div className="space-y-2">
                    <Label>Webhook Endpoint URL (Optional)</Label>
                    <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://n8n.example.com/webhook/..." />
                  </div>

                  <Button type="submit" disabled={savingAccount} className="w-full bg-orange-600 hover:bg-orange-700 rounded-xl font-bold">
                    {savingAccount && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save Account Credentials
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-slate-800">Configured Accounts</CardTitle>
                <CardDescription className="text-xs">Active connected accounts for broadcast execution.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {accounts.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-xs">No specific accounts added yet. (System fallbacks will be used).</div>
                ) : (
                  accounts.map((acc) => {
                    const Icon = platformIcons[acc.platform.toLowerCase()] || Globe
                    return (
                      <div key={acc.id} className="p-3 border rounded-2xl bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-white border rounded-xl flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <span className="font-bold text-xs text-slate-800 block">{acc.accountName}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-mono">{acc.platform} {acc.accountId ? `(${acc.accountId})` : ''}</span>
                          </div>
                        </div>
                        <Badge variant="success" className="text-[9px]">ACTIVE</Badge>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* LOGS TAB */}
        <TabsContent value="logs" className="space-y-6">
          <Card className="rounded-3xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold text-slate-800">Publish Execution Audit Logs</CardTitle>
              <CardDescription className="text-xs">Detailed platform response payload and real-time execution results.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 border-b font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Post Title</th>
                      <th className="p-3">Platform</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Error / Response</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {posts.flatMap((p) => p.logs || []).length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-center text-slate-500">No execution logs recorded yet.</td></tr>
                    ) : (
                      posts.flatMap((p) => (p.logs || []).map((l: any) => ({ ...l, postTitle: p.title || p.caption }))).map((log: any) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-3 font-semibold max-w-xs truncate">{log.postTitle}</td>
                          <td className="p-3 uppercase font-mono font-bold">{log.platform}</td>
                          <td className="p-3">
                            <Badge variant={log.status === 'SUCCESS' ? 'success' : 'destructive'} className="text-[9px]">
                              {log.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-[10px] text-slate-500">{new Date(log.postedAt).toLocaleString('en-IN')}</td>
                          <td className="p-3 max-w-md truncate text-[10px] text-slate-600 font-mono">
                            {log.errorMessage || JSON.stringify(log.response || {})}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function SocialPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-orange-600" /></div>}>
      <SocialSchedulerHub />
    </Suspense>
  )
}

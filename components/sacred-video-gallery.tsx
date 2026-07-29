'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Play, Sparkles, Video, Flame, Calendar, ArrowRight, ShieldCheck, Star } from 'lucide-react'

export interface VideoItem {
  id: string
  url: string
  filename?: string | null
  folder?: string | null
  type?: string
  createdAt?: Date | string
}

interface SacredVideoGalleryProps {
  videos?: VideoItem[]
}

const fallbackVideos: VideoItem[] = [
  {
    id: 'fb-1',
    url: 'https://www.youtube.com/watch?v=1V_y_J1bO7M',
    filename: 'काशी विश्वनाथ महाआरती एवं भव्य दर्शन (Kashi Vishwanath Live)',
    folder: 'Live Darshan',
  },
  {
    id: 'fb-2',
    url: 'https://www.youtube.com/watch?v=0k5G6o9-nVs',
    filename: 'श्री महाकालेश्वर भस्म आरती उज्जैन (Mahakaleshwar Bhasma Aarti)',
    folder: 'Past Puja',
  },
  {
    id: 'fb-3',
    url: 'https://www.youtube.com/watch?v=A32m12yX-8s',
    filename: 'श्री केदारनाथ धाम आरती एवं पावन दर्शन (Kedarnath Dham Aarti)',
    folder: 'Aarti & Bhajan',
  },
  {
    id: 'fb-4',
    url: 'https://www.youtube.com/watch?v=uK1X_aJ-nVs',
    filename: 'भक्तों का दिव्य अनुभव एवं संतोष (Devotee Review Highlight)',
    folder: 'Customer Review',
  },
]

export function SacredVideoGallery({ videos = [] }: SacredVideoGalleryProps) {
  // Deduplicate and prioritize uploaded admin videos over fallback samples
  const allCombined = [...(videos || []), ...fallbackVideos]
  const uniqueMap = new Map()
  allCombined.forEach(v => {
    if (v.url && !uniqueMap.has(v.url)) {
      uniqueMap.set(v.url, v)
    }
  })
  const displayVideos = Array.from(uniqueMap.values())

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  const categories = [
    { id: 'ALL', label: 'सभी वीडियो (All)' },
    { id: 'Live Darshan', label: '🎥 लाइव दर्शन' },
    { id: 'Past Puja', label: '🕉️ बीती हुई पूजा' },
    { id: 'Aarti & Bhajan', label: '🎵 आरती व भजन' },
    { id: 'Customer Review', label: '⭐ भक्तों का अनुभव' },
  ]

  const categoryLabelMap: Record<string, string> = {
    'Live Darshan': '🎥 लाइव दर्शन',
    'Past Puja': '🕉️ बीती हुई पूजा',
    'Aarti & Bhajan': '🎵 आरती व भजन',
    'Customer Review': '⭐ भक्तों का अनुभव',
    'Home Video': '🎥 दिव्य दर्शन',
    'General': '🎥 वीडियो',
  }

  const getCategoryDisplayLabel = (folder?: string | null) => {
    if (!folder) return '🎥 लाइव दर्शन'
    return categoryLabelMap[folder] || folder
  }

  const filteredVideos = selectedCategory === 'ALL'
    ? displayVideos
    : displayVideos.filter(v => {
        const folder = (v.folder || '').toLowerCase().trim()
        const targetCat = selectedCategory.toLowerCase().trim()
        if (!folder) return selectedCategory === 'Live Darshan' || selectedCategory === 'ALL'
        return folder === targetCat || folder.includes(targetCat) || targetCat.includes(folder)
      })

  function getYouTubeId(url: string) {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  function getYouTubeEmbedUrl(url: string) {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null
  }

  function getThumbnail(video: VideoItem) {
    const ytId = getYouTubeId(video.url)
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    }
    return null
  }

  return (
    <section className="container py-16 md:py-24 border-t border-border/40">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <span className="sacred-subtitle text-primary inline-flex items-center gap-1.5 font-bold">
            <Sparkles className="h-4 w-4 text-amber-500" /> Divine Visuals & Reels
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
            🎥 दिव्य दर्शन <span className="sacred-gradient-text">एवं पूजा वीडियो</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl font-medium">
            प्रसिद्ध मंदिरों के लाइव दर्शन, संपन्न हुई महापूजाओं की झलकियां, आरती एवं भक्तों के अनुभव देखें।
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                  : 'bg-card text-muted-foreground border-border/80 hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVideos.map((video) => {
          const ytId = getYouTubeId(video.url)
          const thumb = getThumbnail(video)

          return (
            <Card
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group relative cursor-pointer overflow-hidden border border-amber-200/50 dark:border-border/60 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-card flex flex-col justify-between"
            >
              {/* Media Aspect Ratio Container */}
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                {/* Thumbnail Image */}
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={video.filename || 'Sacred Video'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <video
                    src={video.url}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    muted
                    preload="metadata"
                  />
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-amber-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-600 transition-all duration-300 ring-4 ring-white/30 backdrop-blur-sm">
                    <Play className="h-6 w-6 fill-white ml-1" />
                  </div>
                </div>

                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-amber-300 font-bold border border-amber-400/30 rounded-md px-2.5 py-1 text-[10px] tracking-wide">
                  {getCategoryDisplayLabel(video.folder)}
                </Badge>
              </div>

              {/* Card Footer Info */}
              <CardContent className="p-4 space-y-2">
                <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                  {video.filename || 'पावन पूजा एवं लाइव दर्शन'}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                  <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>DivyaYagyam Verified Media</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Video Modal Player */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-950 border-amber-500/30 text-white rounded-2xl">
          <DialogHeader className="p-4 bg-slate-900 border-b border-slate-800 flex flex-row items-center justify-between">
            <DialogTitle className="text-base md:text-lg font-bold text-amber-400 line-clamp-1 pr-6">
              {activeVideo?.filename || 'पावन दर्शन वीडियो'}
            </DialogTitle>
          </DialogHeader>

          <div className="relative aspect-video w-full bg-black">
            {activeVideo && getYouTubeEmbedUrl(activeVideo.url) ? (
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.url)!}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : activeVideo ? (
              <video
                src={activeVideo.url}
                className="w-full h-full"
                controls
                autoPlay
              />
            ) : null}
          </div>

          <div className="p-5 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider block">
                {activeVideo?.folder || 'Divine Media'}
              </span>
              <p className="text-xs text-slate-300 mt-1">
                घर बैठे भगवान के पावन दर्शन करें एवं विशेष पूजा सेवा में भाग लें।
              </p>
            </div>

            <Button size="lg" className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 shrink-0 shadow-lg" asChild>
              <Link href="/pujas" onClick={() => setActiveVideo(null)}>
                पूजा में भाग लें (Book Puja) <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

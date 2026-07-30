'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Play, Sparkles, Flame, ArrowRight } from 'lucide-react'

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

export function SacredVideoGallery({ videos = [] }: SacredVideoGalleryProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  // Take up to 5 uploaded videos only
  const displayVideos = (videos || []).slice(0, 5)

  if (displayVideos.length === 0) {
    return null
  }

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
      return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    }
    return null
  }

  return (
    <section className="container py-16 md:py-24 border-t border-border/40">
      {/* Title Header */}
      <div className="space-y-3 mb-10 text-center md:text-left">
        <span className="sacred-subtitle text-primary inline-flex items-center gap-1.5 font-bold">
          <Sparkles className="h-4 w-4 text-amber-500" /> Divine Visuals & Reels
        </span>
        <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-foreground tracking-tight">
          🎥 दिव्य दर्शन एवं पूजा वीडियो
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl font-medium">
          प्रसिद्ध मंदिरों के लाइव दर्शन, संपन्न हुई महापूजाओं की झलकियां एवं पावन वीडियो देखें।
        </p>
      </div>

      {/* Video Grid - Max 5 Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayVideos.map((video) => {
          const thumb = getThumbnail(video)

          return (
            <Card
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group relative cursor-pointer overflow-hidden border border-amber-200/50 dark:border-border/60 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-card flex flex-col justify-between"
            >
              {/* Media Aspect Ratio Container */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                {/* Thumbnail Image */}
                {thumb ? (
                  <img
                    src={thumb}
                    alt={video.filename || 'Divya Darshan Video'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={video.url.includes('#') ? video.url : `${video.url}#t=0.5`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    muted
                    playsInline
                    preload="metadata"
                  />
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-amber-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-600 transition-all duration-300 ring-4 ring-white/30 backdrop-blur-sm">
                    <Play className="h-5 w-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Footer Info */}
              <CardContent className="p-3.5 space-y-1.5">
                <h3 className="font-heading font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {video.filename || 'पावन दर्शन वीडियो'}
                </h3>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Flame className="h-3 w-3 text-amber-500 shrink-0" />
                  <span>DivyaYagyam Verified</span>
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
              <p className="text-xs text-slate-300">
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

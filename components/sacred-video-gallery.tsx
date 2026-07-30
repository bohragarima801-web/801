'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Play, Sparkles, Flame, ArrowRight, Video as VideoIcon } from 'lucide-react'

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

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  const match = url.match(regExp)
  return match && match[1] ? match[1] : null
}

export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null
}

export function getYouTubeThumbnail(url: string | null | undefined): string | null {
  const id = getYouTubeId(url)
  if (!id) return null
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export function SacredVideoGallery({ videos = [] }: SacredVideoGalleryProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  // Take up to 5 uploaded videos only
  const displayVideos = (videos || []).slice(0, 5)

  if (displayVideos.length === 0) {
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
          संपन्न हुई महापूजाओं की पावन झलकियां एवं दिव्य दर्शन वीडियो देखें।
        </p>
      </div>

      {/* Video Grid - Max 5 Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayVideos.map((video) => {
          const ytId = getYouTubeId(video.url)
          const thumb = getYouTubeThumbnail(video.url)

          return (
            <Card
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group relative cursor-pointer overflow-hidden border border-amber-200/50 dark:border-border/60 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-card flex flex-col justify-between"
            >
              {/* Media Aspect Ratio Container */}
              <div className="relative aspect-[4/3] sm:aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                {/* Fallback Background Gradient with Sacred Icon */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950/90 via-slate-900 to-orange-950/90 flex flex-col items-center justify-center p-3 text-center">
                  <VideoIcon className="h-8 w-8 text-amber-500/40 animate-pulse mb-1" />
                  <span className="text-[10px] text-amber-300/50 font-semibold line-clamp-1">{video.filename || 'Divya Darshan'}</span>
                </div>

                {/* Thumbnail Image */}
                {thumb ? (
                  <img
                    src={thumb}
                    alt={video.filename || 'Divya Darshan Video'}
                    className="relative z-10 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (ytId && !target.src.includes('mqdefault')) {
                        target.src = `https://i.ytimg.com/vi/${ytId}/mqdefault.jpg`
                      } else {
                        target.style.display = 'none'
                      }
                    }}
                  />
                ) : video.url ? (
                  <video
                    src={video.url.includes('#') ? video.url : `${video.url}#t=0.5`}
                    className="relative z-10 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                    muted
                    playsInline
                    preload="metadata"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement
                      target.style.display = 'none'
                    }}
                  />
                ) : null}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-30">
                  <div className="h-12 w-12 rounded-full bg-amber-500/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-600 transition-all duration-300 ring-4 ring-white/30 backdrop-blur-sm">
                    <Play className="h-5 w-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Video Badge */}
                <div className="absolute top-2.5 left-2.5 z-30">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/60 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                    {ytId ? 'Shorts' : 'Video'}
                  </span>
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

          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
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

'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Play, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

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

function checkIsVideo(url?: string, type?: string) {
  if (type === 'VIDEO') return true
  if (type === 'IMAGE' || type === 'PHOTO') return false
  if (!url) return false
  const lower = url.toLowerCase()
  return (
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.includes('youtube.com') ||
    lower.includes('youtu.be') ||
    lower.includes('vimeo.com')
  )
}

export function SacredVideoGallery({ videos = [] }: SacredVideoGalleryProps) {
  const displayVideos = videos || []
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

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
    const isVid = checkIsVideo(video.url, video.type)
    if (isVid) {
      const ytId = getYouTubeId(video.url)
      if (ytId) {
        return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
      }
      return null
    }
    return video.url
  }

  return (
    <section className="container py-16 md:py-24 border-t border-[#F3E8DE]">
      {/* DevPunya Style Ultra-Attractive Clean Header */}
      <div className="space-y-2 mb-10 text-left">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100/80 text-[#FF7A00] font-extrabold text-xs tracking-wider uppercase">
          <Sparkles className="h-3.5 w-3.5" /> Authentic Proof & Live Darshan
        </div>
        <h2 className="text-3xl md:text-5xl font-heading font-black text-[#111827] tracking-tight">
          Real Pujas Performed
        </h2>
        <p className="text-sm md:text-base text-[#6B7280] font-medium max-w-2xl">
          Real pujas performed at sacred temples with video proofs & genuine devotee experiences.
        </p>
      </div>

      {/* Media Grid - DevPunya Vertical Portrait Cards */}
      {displayVideos.length === 0 ? (
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-[#F3E8DE] space-y-4 max-w-2xl mx-auto shadow-xs">
          <div className="h-14 w-14 mx-auto rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center text-2xl">🎥</div>
          <h3 className="text-xl md:text-2xl font-heading font-bold text-[#111827]">Real Pujas Videos & Media</h3>
          <p className="text-xs md:text-sm text-[#4B5563]">Videos & photos of real pujas performed at sacred temples will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayVideos.slice(0, 8).map((video) => {
            const isVid = checkIsVideo(video.url, video.type)
            const thumb = getThumbnail(video)

            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-black flex flex-col justify-between"
              >
                {/* Vertical Aspect Ratio Frame */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-900">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={video.filename || 'Real Puja Performed'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : isVid ? (
                    <video
                      src={video.url.includes('#') ? video.url : `${video.url}#t=0.5`}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={video.url}
                      alt={video.filename || 'Real Puja Performed'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* DevPunya Style Play Button */}
                  {isVid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/90 group-hover:bg-[#FF7A00] text-[#111827] group-hover:text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 backdrop-blur-md">
                        <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Title & Verified Tag at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 space-y-1">
                    <h3 className="font-sans font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug drop-shadow-md">
                      {video.filename || 'Real Puja Performed'}
                    </h3>
                    <p className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" /> Verified Seva
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Media Modal Player / Lightbox */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-950 border-orange-500/30 text-white rounded-3xl">
          <DialogHeader className="p-4 bg-slate-900 border-b border-slate-800 flex flex-row items-center justify-between">
            <DialogTitle className="text-base md:text-lg font-bold text-[#FF7A00] line-clamp-1 pr-6">
              {activeVideo?.filename || 'Real Puja Performed'}
            </DialogTitle>
          </DialogHeader>

          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            {activeVideo && checkIsVideo(activeVideo.url, activeVideo.type) ? (
              getYouTubeEmbedUrl(activeVideo.url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.url)!}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={activeVideo.url}
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              )
            ) : activeVideo ? (
              <img
                src={activeVideo.url}
                alt={activeVideo.filename || 'Sacred Photo'}
                className="max-h-full max-w-full object-contain"
              />
            ) : null}
          </div>

          <div className="p-5 bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#FF7A00] font-semibold uppercase tracking-wider block">
                DivyaYagyam Verified Proof
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Real puja performed by Vedic Priests. Book your puja online with live video proof.
              </p>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold px-6 shrink-0 shadow-lg rounded-full" asChild>
              <Link href="/pujas" onClick={() => setActiveVideo(null)}>
                पूजा बुक करें (Book Puja) <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

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
    <section className="container mx-auto px-4 md:px-6 py-12 md:py-20 border-t border-[#E6D6BE] notranslate" translate="no">
      {/* DevPunya Style Ultra-Attractive Clean Header */}
      <div className="space-y-2.5 mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7EBD7] text-[#E58A16] font-bold text-xs border border-[#E6D6BE]">
          <Sparkles className="h-3.5 w-3.5" /> पावन दर्शन व प्रमाण
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#292321] tracking-tight">
          पवित्र पूजा दर्शन एवं लाइव वीडियो
        </h2>
        <p className="text-xs sm:text-sm text-[#665E58] font-medium max-w-xl mx-auto">
          विभिन्न सिद्ध शक्तिपीठों में यजमानों के नाम-गोत्र से संपन्न पूजाओं का प्रामाणिक वीडियो एवं दर्शन।
        </p>
      </div>

      {/* Media Grid - Vertical Portrait Cards */}
      {displayVideos.length === 0 ? (
        <div className="text-center py-12 px-6 bg-white rounded-2xl border border-[#E6D6BE] space-y-3 max-w-xl mx-auto shadow-xs">
          <div className="h-12 w-12 mx-auto rounded-full bg-[#F7EBD7] text-[#E58A16] flex items-center justify-center text-2xl">🎥</div>
          <h3 className="text-lg font-bold text-[#292321]">पावन पूजा वीडियो एवं दर्शन</h3>
          <p className="text-xs text-[#665E58]">सिद्ध धामों के पावन अनुष्ठानों के वीडियो शीघ्र यहाँ उपलब्ध होंगे।</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayVideos.slice(0, 8).map((video) => {
            const isVid = checkIsVideo(video.url, video.type)
            const thumb = getThumbnail(video)

            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#E6D6BE] shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-slate-900 flex flex-col justify-between"
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

                  {/* Play Button */}
                  {isVid && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/90 group-hover:bg-[#E58A16] text-[#292321] group-hover:text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 backdrop-blur-md">
                        <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Title & Verified Tag at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 z-10 space-y-0.5">
                    <h3 className="font-sans font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug drop-shadow-md">
                      {video.filename || 'पावन अनुष्ठान दर्शन'}
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
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-950 border-[#E58A16]/30 text-white rounded-3xl">
          <DialogHeader className="p-4 bg-slate-900 border-b border-slate-800 flex flex-row items-center justify-between">
            <DialogTitle className="text-base md:text-lg font-bold text-[#E58A16] line-clamp-1 pr-6">
              {activeVideo?.filename || 'पावन पूजा दर्शन'}
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

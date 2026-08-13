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

export function SacredVideoGallery({ videos = [] }: SacredVideoGalleryProps) {
  const displayVideos = videos || []

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
      return `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
    }
    return null
  }

  return (
    <section className="container py-16 md:py-24 border-t border-[#F3E8DE]">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-3">
          <span className="kundli-badge-orange inline-flex items-center gap-1.5 font-bold">
            <Sparkles className="h-4 w-4 text-[#FF7A00]" /> Divine Visuals & Reels
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">
            🎥 दिव्य दर्शन <span className="text-[#FF7A00] font-bold">एवं पूजा वीडियो</span>
          </h2>
          <p className="text-sm md:text-base text-[#4B5563] max-w-2xl font-medium">
            प्रसिद्ध मंदिरों के लाइव दर्शन, संपन्न हुई महापूजाओं की झलकियां, आरती एवं भक्तों के अनुभव देखें।
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white border-transparent shadow-sm'
                  : 'bg-white text-[#4B5563] border-[#F3E8DE] hover:bg-orange-50 hover:text-[#FF7A00]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 px-6 bg-white rounded-3xl border border-[#F3E8DE] space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="h-14 w-14 mx-auto rounded-full bg-orange-50 text-[#FF7A00] flex items-center justify-center text-2xl">🎥</div>
          <h3 className="text-xl md:text-2xl font-heading font-bold text-[#111827]">शीघ्र आ रहे हैं नए पावन दर्शन वीडियो</h3>
          <p className="text-xs md:text-sm text-[#4B5563]">संस्थान के यूट्यूब एवं दिव्य दर्शन वीडियो शीघ्र यहाँ लाइव उपलब्ध कराए जाएंगे।</p>
          <a
            href="https://wa.me/919530401984?text=Namaste!%20I%20want%20to%20get%20live%20video%20updates"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF7A00] to-[#FF6B00] text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-md"
          >
            💬 WhatsApp पर वीडियो अपडेट पाएं →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVideos.map((video) => {
          const ytId = getYouTubeId(video.url)
          const thumb = getThumbnail(video)

          return (
            <Card
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group relative cursor-pointer overflow-hidden border border-[#F3E8DE] rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-white flex flex-col justify-between reveal"
            >
              {/* Media Aspect Ratio Container */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                {/* Thumbnail Image */}
                {thumb ? (
                  <img
                    src={thumb}
                    alt={video.filename || 'Sacred Video'}
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
                  <div className="h-14 w-14 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#FF6B00] transition-all duration-300 ring-4 ring-white/30 backdrop-blur-sm">
                    <Play className="h-6 w-6 fill-white ml-1" />
                  </div>
                </div>

                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white font-bold border border-white/20 rounded-md px-2.5 py-1 text-[10px] tracking-wide">
                  {getCategoryDisplayLabel(video.folder)}
                </Badge>
              </div>

              {/* Card Footer Info */}
              <CardContent className="p-4 space-y-2">
                <h3 className="font-heading font-bold text-base text-[#111827] group-hover:text-[#FF7A00] transition-colors line-clamp-2 leading-tight">
                  {video.filename || 'पावन पूजा एवं लाइव दर्शन'}
                </h3>
                <p className="text-xs text-[#4B5563] flex items-center gap-1 font-medium">
                  <Flame className="h-3.5 w-3.5 text-[#FF7A00] shrink-0" />
                  <span>DivyaYagyam Verified Media</span>
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      )}

      {/* Video Modal Player */}
      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-slate-950 border-orange-500/30 text-white rounded-2xl">
          <DialogHeader className="p-4 bg-slate-900 border-b border-slate-800 flex flex-row items-center justify-between">
            <DialogTitle className="text-base md:text-lg font-bold text-[#FF7A00] line-clamp-1 pr-6">
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
              <span className="text-xs text-[#FF7A00] font-semibold uppercase tracking-wider block">
                {activeVideo?.folder || 'Divine Media'}
              </span>
              <p className="text-xs text-slate-300 mt-1">
                घर बैठे भगवान के पावन दर्शन करें एवं विशेष पूजा सेवा बुक करें।
              </p>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold px-6 shrink-0 shadow-lg" asChild>
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

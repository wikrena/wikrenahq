"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  url:   string
  title: string
}

// Convert any YouTube URL format to a privacy-enhanced embed URL
// that hides YouTube branding, ads, related videos
function toEmbedUrl(url: string): string {
  if (!url) return ""

  // Already an embed URL
  if (url.includes("youtube-nocookie.com/embed") || url.includes("youtube.com/embed")) {
    const base = url.split("?")[0].replace("youtube.com", "youtube-nocookie.com")
    return `${base}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=white&disablekb=0`
  }

  // youtu.be short link
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/)
  if (shortMatch) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=white`
  }

  // youtube.com/watch?v=
  const watchMatch = url.match(/[?&]v=([^?&]+)/)
  if (watchMatch) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&color=white`
  }

  // Mux stream URL — return as-is
  if (url.includes("stream.mux.com") || url.includes("mux.com")) {
    return url
  }

  // Cloudflare stream
  if (url.includes("cloudflarestream.com") || url.includes("iframe.videodelivery.net")) {
    return url
  }

  // Loom
  const loomMatch = url.match(/loom\.com\/share\/([^?&]+)/)
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`
  }

  // Return as-is for any other URL (Vimeo, custom CDN etc)
  return url
}

export function VideoPlayer({ url, title }: Props) {
  const [hasStarted, setHasStarted] = useState(false)
  const embedUrl = toEmbedUrl(url)

  if (!url) {
    return (
      <div className="w-full bg-[#0d1117] flex items-center justify-center" style={{ aspectRatio: "16/9" }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center mx-auto mb-3">
            <Play className="w-8 h-8 text-teal-400 ml-1" />
          </div>
          <p className="text-white/40 text-sm font-code">No video added yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-black relative" style={{ aspectRatio: "16/9" }}>
      {/* Custom thumbnail / play screen shown before the video starts */}
      {!hasStarted && (
        <button
          onClick={() => setHasStarted(true)}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0d1117] group z-10"
        >
          {/* Wikrena branded play button — no YouTube logo visible */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-teal-500 group-hover:bg-teal-400 flex items-center justify-center transition-all shadow-lg">
              <Play className="w-9 h-9 text-white ml-1.5" fill="white" />
            </div>
            <span className="text-white/60 text-sm font-medium max-w-xs text-center px-4">
              {title}
            </span>
          </div>
        </button>
      )}

      {/* iframe — only renders after play is clicked to avoid autoplay issues */}
      {hasStarted && (
        <iframe
          src={`${embedUrl}&autoplay=1`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title={title}
        />
      )}
    </div>
  )
}

"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Maximize2, Play } from "lucide-react"
import { useState } from "react"
import { VideoModal } from "@/components/video-modal"

interface VideoCardProps {
  title: string
  description: string
  duration: string
  resolution: string
  thumbnail: string
  videoSrc?: string
  youtubeId?: string
}

export function VideoCard({
  title,
  description,
  duration,
  resolution,
  thumbnail,
  videoSrc,
  youtubeId,
}: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card
        className="overflow-hidden transition-all hover:shadow-md cursor-pointer group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-video">
          <Image
            src={thumbnail || "/placeholder.svg?height=400&width=600"}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="rounded-full bg-primary/90 p-3 transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-3">{description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize2 size={14} />
              <span>{resolution}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        videoSrc={videoSrc}
        youtubeId={youtubeId}
      />
    </>
  )
}


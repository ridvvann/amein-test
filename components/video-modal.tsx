"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  videoSrc?: string
  youtubeId?: string
}

export function VideoModal({ isOpen, onClose, title, videoSrc, youtubeId }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)

  // Reset video when modal closes
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setVideoError(false)
    }
  }, [isOpen])

  const handleVideoError = () => {
    console.error("Video failed to load:", videoSrc)
    setVideoError(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-background">
        <DialogHeader className="p-4 flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="relative aspect-video w-full">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : videoSrc ? (
            videoError ? (
              <div className="flex items-center justify-center h-full bg-muted flex-col">
                <p className="text-red-500 mb-2">Error loading video</p>
                <p className="text-sm text-muted-foreground">The video file could not be loaded</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={videoSrc}
                controls
                className="w-full h-full"
                preload="metadata"
                onError={handleVideoError}
                controlsList="nodownload"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            )
          ) : (
            <div className="flex items-center justify-center h-full bg-muted">
              <p>No video available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


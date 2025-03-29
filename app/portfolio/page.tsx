"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { VideoCard } from "@/components/video-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import type { VideoData } from "../api/videos/route"

// Local storage key for videos
const VIDEOS_STORAGE_KEY = "portfolio_videos"

export default function PortfolioPage() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVideosFromStorage()
  }, [])

  // Load videos from localStorage
  const loadVideosFromStorage = () => {
    try {
      setLoading(true)
      const storedVideos = localStorage.getItem(VIDEOS_STORAGE_KEY)
      if (storedVideos) {
        setVideos(JSON.parse(storedVideos))
      } else {
        setVideos([])
      }
    } catch (error) {
      console.error("Error loading videos from storage:", error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  // Filter videos by category
  const allVideos = videos
  const youtubeVideos = videos.filter((video) => video.category === "youtube")
  const commercialVideos = videos.filter((video) => video.category === "commercial")
  const documentaryVideos = videos.filter((video) => video.category === "documentary")

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-16">
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">My Work</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Browse through my collection of videos, films, and creative projects
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading videos...</span>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full mb-12">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="youtube">YouTube</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
              <TabsTrigger value="documentary">Documentary</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allVideos.length > 0 ? (
              allVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  description={video.description}
                  duration={video.duration}
                  resolution={video.resolution}
                  thumbnail={video.thumbnail}
                  videoSrc={video.videoUrl}
                  youtubeId={video.youtubeId}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  No videos available yet. Add your own videos through the admin dashboard.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="youtube" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youtubeVideos.length > 0 ? (
              youtubeVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  description={video.description}
                  duration={video.duration}
                  resolution={video.resolution}
                  thumbnail={video.thumbnail}
                  videoSrc={video.videoUrl}
                  youtubeId={video.youtubeId}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No YouTube videos available yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="commercial" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commercialVideos.length > 0 ? (
              commercialVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  description={video.description}
                  duration={video.duration}
                  resolution={video.resolution}
                  thumbnail={video.thumbnail}
                  videoSrc={video.videoUrl}
                  youtubeId={video.youtubeId}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No commercial videos available yet.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="documentary" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentaryVideos.length > 0 ? (
              documentaryVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  title={video.title}
                  description={video.description}
                  duration={video.duration}
                  resolution={video.resolution}
                  thumbnail={video.thumbnail}
                  videoSrc={video.videoUrl}
                  youtubeId={video.youtubeId}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No documentary videos available yet.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      <div className="text-center">
        <Button asChild>
          <Link href="/admin">Add Your Videos</Link>
        </Button>
      </div>
    </div>
  )
}


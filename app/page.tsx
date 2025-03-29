"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VideoCard } from "@/components/video-card"
import { SkillCard } from "@/components/skill-card"
import { ContactForm } from "@/components/contact-form"
import { Play, Camera, Edit, Layers, Mail, Phone, MapPin, Loader2 } from "lucide-react"
import type { VideoData } from "./api/videos/route"

// Local storage key for videos
const VIDEOS_STORAGE_KEY = "portfolio_videos"

export default function Home() {
  const [featuredVideos, setFeaturedVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [heroImage, setHeroImage] = useState<string | null>(null)
  const [aboutImage, setAboutImage] = useState<string | null>(null)

  useEffect(() => {
    loadFeaturedVideos()

    // Load profile images from localStorage
    const storedHeroImage = localStorage.getItem("profile_hero_image")
    const storedAboutImage = localStorage.getItem("profile_about_image")

    if (storedHeroImage) {
      setHeroImage(storedHeroImage)
    }

    if (storedAboutImage) {
      setAboutImage(storedAboutImage)
    }
  }, [])

  // Load featured videos from localStorage
  const loadFeaturedVideos = () => {
    try {
      setLoading(true)
      const storedVideos = localStorage.getItem(VIDEOS_STORAGE_KEY)
      if (storedVideos) {
        const videos = JSON.parse(storedVideos)
        // Get the 3 most recent videos
        const featured = videos
          .sort((a: VideoData, b: VideoData) => {
            // Sort by dateAdded if available, otherwise keep original order
            if (a.dateAdded && b.dateAdded) {
              return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
            }
            return 0
          })
          .slice(0, 3)
        setFeaturedVideos(featured)
      } else {
        setFeaturedVideos([])
      }
    } catch (error) {
      console.error("Error loading featured videos:", error)
      setFeaturedVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section id="home" className="container mx-auto py-20 px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            Videographer & YouTuber
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold">Amein Mouse</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            Crafting compelling visual stories through the lens of creativity and technical excellence.
          </p>
          <div className="flex gap-4 pt-4">
            <Button asChild>
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://wa.me/2520633916396" target="_blank" rel="noopener noreferrer">
                Contact Me
              </a>
            </Button>
          </div>
        </div>
        <div className="flex-1 relative aspect-square max-w-md rounded-xl overflow-hidden border shadow-lg">
          <Image
            src={heroImage || "/placeholder.svg?height=600&width=600"}
            alt="Amein Mouse"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Latest Projects */}
      <section id="projects" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Latest Work</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              A selection of my recent videography and YouTube content
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading videos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVideos.length > 0 ? (
                featuredVideos.map((video) => (
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
                  <div className="mt-6">
                    <Button asChild>
                      <Link href="/admin">Add Videos</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {featuredVideos.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/portfolio">
                  View All Projects
                  <Play size={16} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Rest of the page content remains the same */}
      {/* About Section */}
      <section id="about" className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">About Me</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who I Am</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            I'm a passionate videographer and content creator with over 5 years of experience in creating compelling
            visual stories.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="md:col-span-2 overflow-hidden">
            <CardContent className="p-0 h-full">
              <div className="relative aspect-video w-full h-full">
                <Image
                  src={aboutImage || "/placeholder.svg?height=400&width=800"}
                  alt="About Amein Mouse"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <h3 className="text-2xl font-bold mb-4">My Journey</h3>
              <p className="text-muted-foreground">
                From amateur filmmaker to professional videographer, my passion for visual storytelling has driven me to
                constantly improve and innovate.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <SkillCard
            icon={<Camera className="h-8 w-8 text-primary" />}
            title="Cinematography"
            description="Expert in camera techniques, lighting, and composition"
          />
          <SkillCard
            icon={<Edit className="h-8 w-8 text-primary" />}
            title="Video Editing"
            description="Proficient in Adobe Premiere Pro and DaVinci Resolve"
          />
          <SkillCard
            icon={<Layers className="h-8 w-8 text-primary" />}
            title="Visual Effects"
            description="Creating stunning VFX with After Effects and Blender"
          />
          <SkillCard
            icon={<Play className="h-8 w-8 text-primary" />}
            title="Content Creation"
            description="Strategic approach to engaging YouTube content"
          />
        </div>

        <div className="text-center">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/portfolio">See My Work</Link>
          </Button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">Get In Touch</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Me</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Have a project in mind? Let's discuss how I can help bring your vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-8">
              <h3 className="text-2xl font-bold">Let's Connect</h3>
              <p className="text-muted-foreground">
                Feel free to reach out with any questions or project inquiries. I'm always open to discussing new
                opportunities and collaborations.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">WhatsApp</h4>
                    <a
                      href="https://wa.me/2520633916396"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      +252 063 3916396
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <a
                      href="mailto:ameinmouse@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      ameinmouse@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <address className="text-muted-foreground not-italic">Mogadishu, Somalia</address>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="font-medium mb-2">Working Hours</h4>
                <p className="text-muted-foreground">Monday - Friday: 9am - 6pm</p>
                <p className="text-muted-foreground">Weekend: By appointment</p>
              </div>
            </div>

            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


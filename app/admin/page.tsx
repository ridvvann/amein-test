"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, Pencil, Trash2, Plus, Youtube } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { LogoutButton } from "@/components/logout-button"
import type { VideoData } from "../api/videos/route"
import Link from "next/link"

// Local storage key for videos
const VIDEOS_STORAGE_KEY = "portfolio_videos"

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export default function AdminPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    duration: "",
    resolution: "",
    category: "youtube",
    youtubeId: "",
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState<VideoData | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [videoToDelete, setVideoToDelete] = useState<VideoData | null>(null)
  const [activeTab, setActiveTab] = useState("upload")

  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const editThumbnailInputRef = useRef<HTMLInputElement>(null)
  const editVideoInputRef = useRef<HTMLInputElement>(null)

  // Load videos from localStorage on component mount
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
        // Initialize with empty array if no videos in storage
        setVideos([])
        // Save empty array to localStorage
        localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify([]))
      }
    } catch (error) {
      console.error("Error loading videos from storage:", error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  // Save videos to localStorage
  const saveVideosToStorage = (updatedVideos: VideoData[]) => {
    try {
      localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(updatedVideos))
    } catch (error) {
      console.error("Error saving videos to storage:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setVideoData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditingVideo((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSelectChange = (name: string, value: string) => {
    setVideoData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSelectChange = (name: string, value: string) => {
    setEditingVideo((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)

      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Create a preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (editingVideo) {
          setEditingVideo({
            ...editingVideo,
            newThumbnailFile: file,
            thumbnailPreview: e.target?.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleEditVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (editingVideo) {
        setEditingVideo({
          ...editingVideo,
          newVideoFile: file,
        })
      }
    }
  }

  const resetForm = () => {
    setVideoData({
      title: "",
      description: "",
      duration: "",
      resolution: "",
      category: "youtube",
      youtubeId: "",
    })
    setThumbnailFile(null)
    setVideoFile(null)
    setThumbnailPreview(null)
    if (videoInputRef.current) videoInputRef.current.value = ""
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    setUploadProgress(0)
    setMessage(null)

    try {
      // Validate required fields
      if (!videoData.title || !videoData.description || !videoData.duration || !videoData.resolution) {
        throw new Error("Please fill out all required fields")
      }

      // For YouTube videos, require YouTube ID
      if (videoData.category === "youtube" && !videoData.youtubeId) {
        throw new Error("Please provide a YouTube video ID for YouTube videos")
      }

      // For non-YouTube videos, require video file
      if (videoData.category !== "youtube" && !videoFile) {
        throw new Error("Please select a video file to upload")
      }

      if (!thumbnailFile) {
        throw new Error("Please select a thumbnail image")
      }

      // Simulate upload progress
      setUploadProgress(10)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Convert thumbnail to base64 for persistent storage
      let thumbnailBase64 = ""
      if (thumbnailFile) {
        thumbnailBase64 = await fileToBase64(thumbnailFile)
        setUploadProgress(40)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      let videoBase64 = ""
      // Convert video to base64 for persistent storage (only for small videos)
      if (videoFile && videoFile.size < 5 * 1024 * 1024) {
        // Limit to 5MB for base64 storage
        videoBase64 = await fileToBase64(videoFile)
        setUploadProgress(80)
        await new Promise((resolve) => setTimeout(resolve, 500))
      } else if (videoFile) {
        // For larger videos, just store a placeholder
        videoBase64 = "video-too-large-for-storage"
      }

      // Create new video object
      const newVideo: VideoData = {
        id: Date.now().toString(), // Simple ID generation
        title: videoData.title,
        description: videoData.description,
        duration: videoData.duration,
        resolution: videoData.resolution,
        category: videoData.category,
        thumbnail: thumbnailBase64,
        dateAdded: new Date().toISOString(),
      }

      if (videoBase64) {
        newVideo.videoUrl = videoBase64 !== "video-too-large-for-storage" ? videoBase64 : undefined
      }

      if (videoData.youtubeId) {
        newVideo.youtubeId = videoData.youtubeId
      }

      setUploadProgress(100)

      // Add to videos array
      const updatedVideos = [...videos, newVideo]
      setVideos(updatedVideos)

      // Save to localStorage
      saveVideosToStorage(updatedVideos)

      // Show success message
      setMessage({
        type: "success",
        text: "Video uploaded successfully! It will now appear in your portfolio.",
      })

      // Reset form
      resetForm()
    } catch (error) {
      console.error("Error:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (video: VideoData) => {
    setEditingVideo({
      ...video,
      thumbnailPreview: null,
      newThumbnailFile: null,
      newVideoFile: null,
    })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (video: VideoData) => {
    setVideoToDelete(video)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!videoToDelete) return

    try {
      setUploading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Filter out the video to delete
      const updatedVideos = videos.filter((video) => video.id !== videoToDelete.id)
      setVideos(updatedVideos)

      // Save to localStorage
      saveVideosToStorage(updatedVideos)

      setMessage({
        type: "success",
        text: "Video deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting video:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred while deleting the video.",
      })
    } finally {
      setUploading(false)
      setIsDeleteDialogOpen(false)
      setVideoToDelete(null)
    }
  }

  const saveEditedVideo = async () => {
    if (!editingVideo) return

    try {
      setUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      await new Promise((resolve) => setTimeout(resolve, 500))
      setUploadProgress(30)

      let thumbnailData = editingVideo.thumbnail
      // If there's a new thumbnail file, convert to base64
      if (editingVideo.newThumbnailFile) {
        thumbnailData = await fileToBase64(editingVideo.newThumbnailFile)
        setUploadProgress(60)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      let videoData = editingVideo.videoUrl
      // If there's a new video file, convert to base64 (only for small videos)
      if (editingVideo.newVideoFile) {
        if (editingVideo.newVideoFile.size < 5 * 1024 * 1024) {
          // Limit to 5MB
          videoData = await fileToBase64(editingVideo.newVideoFile)
        } else {
          // For larger videos, just store a placeholder
          videoData = "video-too-large-for-storage"
        }
        setUploadProgress(90)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Create updated video object
      const updatedVideo: VideoData = {
        ...editingVideo,
        thumbnail: thumbnailData,
        videoUrl: videoData !== "video-too-large-for-storage" ? videoData : undefined,
      }

      // Remove temporary properties
      delete updatedVideo.newThumbnailFile
      delete updatedVideo.thumbnailPreview
      delete updatedVideo.newVideoFile

      // Update the videos array
      const updatedVideos = videos.map((video) => (video.id === updatedVideo.id ? updatedVideo : video))

      setVideos(updatedVideos)

      // Save to localStorage
      saveVideosToStorage(updatedVideos)

      setUploadProgress(100)

      // Show success message
      setMessage({
        type: "success",
        text: "Video updated successfully!",
      })

      // Close the dialog
      setIsEditDialogOpen(false)
      setEditingVideo(null)
    } catch (error) {
      console.error("Error updating video:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Video Management Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile-images">Manage Profile Images</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upload">Upload New Video</TabsTrigger>
            <TabsTrigger value="manage">Manage Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload New Video</CardTitle>
                <CardDescription>Upload your video files and they'll be available across all devices.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Video Title
                    </label>
                    <Input id="title" name="title" value={videoData.title} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="w-full p-2 rounded-md border bg-background min-h-[100px]"
                      value={videoData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="duration" className="text-sm font-medium">
                        Duration
                      </label>
                      <Input
                        id="duration"
                        name="duration"
                        placeholder="e.g. 12:45"
                        value={videoData.duration}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="resolution" className="text-sm font-medium">
                        Resolution
                      </label>
                      <Input
                        id="resolution"
                        name="resolution"
                        placeholder="e.g. 4K"
                        value={videoData.resolution}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select value={videoData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="documentary">Documentary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {videoData.category === "youtube" && (
                    <div className="space-y-2">
                      <label htmlFor="youtubeId" className="text-sm font-medium">
                        YouTube Video ID
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="youtubeId"
                          name="youtubeId"
                          placeholder="e.g. dQw4w9WgXcQ"
                          value={videoData.youtubeId}
                          onChange={handleChange}
                          required={videoData.category === "youtube"}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => window.open("https://www.youtube.com", "_blank")}
                          title="Open YouTube"
                        >
                          <Youtube size={18} />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        The ID is the part after "v=" in a YouTube URL (e.g., youtube.com/watch?v=dQw4w9WgXcQ)
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="thumbnail" className="text-sm font-medium">
                      Thumbnail Image
                    </label>
                    <div className="flex flex-col gap-4">
                      <Input
                        id="thumbnail"
                        name="thumbnail"
                        type="file"
                        accept="image/*"
                        ref={thumbnailInputRef}
                        onChange={handleThumbnailChange}
                        required
                      />

                      {thumbnailPreview && (
                        <div className="relative aspect-video w-full max-w-md mx-auto border rounded-md overflow-hidden">
                          <img
                            src={thumbnailPreview || "/placeholder.svg"}
                            alt="Thumbnail preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload a thumbnail image for your video (16:9 aspect ratio recommended)
                    </p>
                  </div>

                  {videoData.category !== "youtube" && (
                    <div className="space-y-2">
                      <label htmlFor="video" className="text-sm font-medium">
                        Video File
                      </label>
                      <Input
                        id="video"
                        name="video"
                        type="file"
                        accept="video/*"
                        ref={videoInputRef}
                        onChange={handleVideoChange}
                        required={videoData.category !== "youtube"}
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload your video file (MP4 format recommended for best compatibility)
                      </p>
                      <p className="text-xs text-amber-500">
                        Note: Videos larger than 5MB will be displayed as thumbnails only due to browser storage
                        limitations.
                      </p>
                    </div>
                  )}

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  <Button type="submit" disabled={uploading} className="w-full">
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </form>

                {message && (
                  <div
                    className={`mt-6 p-4 rounded-md ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="mt-8 p-4 border rounded-md bg-amber-50 dark:bg-amber-900/20">
                  <h3 className="font-bold mb-2">How to Upload Videos</h3>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Fill out the video details (title, description, etc.)</li>
                    <li>Select a category for your video</li>
                    <li>For YouTube videos, provide the YouTube video ID</li>
                    <li>For local videos, upload your video file</li>
                    <li>Upload a thumbnail image (16:9 aspect ratio recommended)</li>
                    <li>Click "Upload Video" and wait for the upload to complete</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Manage Existing Videos</CardTitle>
                <CardDescription>Edit or delete your uploaded videos.</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading videos...</span>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No videos found. Upload your first video!</p>
                    <Button onClick={() => setActiveTab("upload")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {videos.map((video) => (
                      <div key={video.id} className="border rounded-lg overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="relative aspect-video">
                            <img
                              src={video.thumbnail || "/placeholder.svg?height=400&width=600"}
                              alt={video.title}
                              className="object-cover w-full h-full"
                            />
                            <Badge className="absolute top-2 right-2">{video.category}</Badge>
                          </div>
                          <div className="p-4 md:col-span-2">
                            <h3 className="text-lg font-bold mb-2">{video.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                              <span>Duration: {video.duration}</span>
                              <span>Resolution: {video.resolution}</span>
                              <span>Added: {new Date(video.dateAdded).toLocaleDateString()}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(video)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(video)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {message && (
                  <div
                    className={`mt-6 p-4 rounded-md ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Video Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          {editingVideo && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-title" className="text-sm font-medium">
                  Video Title
                </label>
                <Input id="edit-title" name="title" value={editingVideo.title} onChange={handleEditChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  className="w-full p-2 rounded-md border bg-background min-h-[100px]"
                  value={editingVideo.description}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-duration" className="text-sm font-medium">
                    Duration
                  </label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    value={editingVideo.duration}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-resolution" className="text-sm font-medium">
                    Resolution
                  </label>
                  <Input
                    id="edit-resolution"
                    name="resolution"
                    value={editingVideo.resolution}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={editingVideo.category}
                  onValueChange={(value) => handleEditSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editingVideo.category === "youtube" && (
                <div className="space-y-2">
                  <label htmlFor="edit-youtubeId" className="text-sm font-medium">
                    YouTube Video ID
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-youtubeId"
                      name="youtubeId"
                      placeholder="e.g. dQw4w9WgXcQ"
                      value={editingVideo.youtubeId || ""}
                      onChange={handleEditChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => window.open("https://www.youtube.com", "_blank")}
                      title="Open YouTube"
                    >
                      <Youtube size={18} />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">The ID is the part after "v=" in a YouTube URL</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="edit-thumbnail" className="text-sm font-medium">
                  Thumbnail Image
                </label>
                <div className="flex flex-col gap-4">
                  <Input
                    id="edit-thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/*"
                    ref={editThumbnailInputRef}
                    onChange={handleEditThumbnailChange}
                  />

                  <div className="relative aspect-video w-full max-w-md mx-auto border rounded-md overflow-hidden">
                    <img
                      src={editingVideo.thumbnailPreview || editingVideo.thumbnail || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload a new thumbnail image only if you want to change it
                </p>
              </div>

              {editingVideo.category !== "youtube" && (
                <div className="space-y-2">
                  <label htmlFor="edit-video" className="text-sm font-medium">
                    Video File
                  </label>
                  <Input
                    id="edit-video"
                    name="video"
                    type="file"
                    accept="video/*"
                    ref={editVideoInputRef}
                    onChange={handleEditVideoChange}
                  />
                  <p className="text-xs text-muted-foreground">Upload a new video file only if you want to change it</p>
                  <p className="text-xs text-amber-500">
                    Note: Videos larger than 5MB will be displayed as thumbnails only due to browser storage
                    limitations.
                  </p>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={uploading}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={saveEditedVideo} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the video "{videoToDelete?.title}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// Define the video data structure
export interface VideoData {
  id: string
  title: string
  description: string
  duration: string
  resolution: string
  thumbnail: string
  videoUrl?: string
  youtubeId?: string
  category: string
  dateAdded: string
  newThumbnailFile?: File
  thumbnailPreview?: string
  newVideoFile?: File
}

// Sample initial data (this will be replaced by localStorage in the client)
const initialVideos: VideoData[] = []

// GET handler to retrieve all videos
export async function GET() {
  // In a real production app, you would fetch from a database here
  return NextResponse.json(initialVideos)
}

// POST handler to add a new video
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract video data from form
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const duration = formData.get("duration") as string
    const resolution = formData.get("resolution") as string
    const category = formData.get("category") as string
    const thumbnailPath = formData.get("thumbnailPath") as string
    const videoPath = formData.get("videoPath") as string
    const youtubeId = formData.get("youtubeId") as string

    // Generate a unique ID for the video
    const id = uuidv4()

    // Create the video data object
    const newVideo: VideoData = {
      id,
      title,
      description,
      duration,
      resolution,
      thumbnail: thumbnailPath || "/placeholder.svg?height=400&width=600",
      category,
      dateAdded: new Date().toISOString(),
    }

    // Add videoUrl if provided
    if (videoPath) {
      newVideo.videoUrl = videoPath
    }

    // Add youtubeId if provided
    if (youtubeId) {
      newVideo.youtubeId = youtubeId
    }

    // In a real app, you would save to a database here
    // For now, we'll just return the new video and handle storage on the client
    return NextResponse.json({ success: true, video: newVideo })
  } catch (error) {
    console.error("Error adding video:", error)
    return NextResponse.json(
      { error: "Failed to add video: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}


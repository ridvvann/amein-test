import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
// Import the helper function
import { ensureDataDirectory } from "../ensure-data-dir"

// Update the GET handler
export async function GET() {
  try {
    // Ensure the data directory and file exist
    await ensureDataDirectory()

    const dataDir = path.join(process.cwd(), "data")
    const dataFilePath = path.join(dataDir, "videos.json")

    try {
      const data = await fs.readFile(dataFilePath, "utf8")
      const videos = JSON.parse(data)

      // Get the 3 most recent videos
      const featuredVideos = videos
        .sort((a: any, b: any) => {
          // Sort by dateAdded if available, otherwise keep original order
          if (a.dateAdded && b.dateAdded) {
            return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
          }
          return 0
        })
        .slice(0, 3)

      return NextResponse.json(featuredVideos)
    } catch (error) {
      console.error("Error processing videos data:", error)
      return NextResponse.json([])
    }
  } catch (error) {
    console.error("Error fetching featured videos:", error)
    return NextResponse.json([])
  }
}


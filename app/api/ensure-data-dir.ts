import { promises as fs } from "fs"
import path from "path"

export async function ensureDataDirectory() {
  try {
    const dataDir = path.join(process.cwd(), "data")

    try {
      await fs.access(dataDir)
    } catch (error) {
      // Directory doesn't exist, create it
      await fs.mkdir(dataDir, { recursive: true })
      console.log("Created data directory:", dataDir)
    }

    const dataFilePath = path.join(dataDir, "videos.json")

    try {
      await fs.access(dataFilePath)
    } catch (error) {
      // File doesn't exist, create an empty array
      await fs.writeFile(dataFilePath, "[]", "utf8")
      console.log("Created empty videos.json file")
    }

    return true
  } catch (error) {
    console.error("Error ensuring data directory:", error)
    return false
  }
}

// Helper function to check if a file exists
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}


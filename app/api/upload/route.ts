import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join, dirname } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Get the file from the form data
    const file = formData.get("file") as File
    const fileType = formData.get("fileType") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Read the file as an ArrayBuffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate a unique filename
    const uniqueId = uuidv4()
    const originalName = file.name
    const extension = originalName.split(".").pop()
    const fileName = `${uniqueId}.${extension}`

    // Determine the directory based on file type
    let directory = "public"
    if (fileType === "video") {
      directory = join(directory, "videos")
    } else if (fileType === "thumbnail") {
      directory = join(directory, "thumbnails")
    }

    // Create the full path
    const filePath = join(process.cwd(), directory, fileName)

    // Ensure the directory exists
    await mkdir(dirname(filePath), { recursive: true })

    // Write the file to the filesystem
    await writeFile(filePath, buffer)

    // Return the path to the file (relative to the public directory)
    const relativePath = `/${fileType === "video" ? "videos" : "thumbnails"}/${fileName}`

    return NextResponse.json({
      success: true,
      filePath: relativePath,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}


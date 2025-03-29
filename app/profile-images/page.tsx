"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import Image from "next/image"

export default function ProfileImagesPage() {
  const [heroImage, setHeroImage] = useState<string | null>(localStorage.getItem("profile_hero_image"))
  const [aboutImage, setAboutImage] = useState<string | null>(localStorage.getItem("profile_about_image"))
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const heroInputRef = useRef<HTMLInputElement>(null)
  const aboutInputRef = useRef<HTMLInputElement>(null)

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploading(true)
        const file = e.target.files[0]
        const base64 = await fileToBase64(file)
        localStorage.setItem("profile_hero_image", base64)
        setHeroImage(base64)
        setMessage({ type: "success", text: "Hero image updated successfully!" })
      } catch (error) {
        console.error("Error uploading hero image:", error)
        setMessage({ type: "error", text: "Failed to upload hero image." })
      } finally {
        setUploading(false)
      }
    }
  }

  const handleAboutImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploading(true)
        const file = e.target.files[0]
        const base64 = await fileToBase64(file)
        localStorage.setItem("profile_about_image", base64)
        setAboutImage(base64)
        setMessage({ type: "success", text: "About image updated successfully!" })
      } catch (error) {
        console.error("Error uploading about image:", error)
        setMessage({ type: "error", text: "Failed to upload about image." })
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Profile Images</h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hero Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Image</CardTitle>
              <CardDescription>This image appears on the home page hero section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full relative mb-4 border rounded-md overflow-hidden">
                {heroImage ? (
                  <Image src={heroImage || "/placeholder.svg"} alt="Hero preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">No image uploaded</p>
                  </div>
                )}
              </div>
              <Input
                id="hero-image"
                type="file"
                accept="image/*"
                ref={heroInputRef}
                onChange={handleHeroImageChange}
                disabled={uploading}
              />
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Recommended size: 600x600 pixels (square)</p>
            </CardFooter>
          </Card>

          {/* About Image Card */}
          <Card>
            <CardHeader>
              <CardTitle>About Image</CardTitle>
              <CardDescription>This image appears in the About section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full relative mb-4 border rounded-md overflow-hidden">
                {aboutImage ? (
                  <Image src={aboutImage || "/placeholder.svg"} alt="About preview" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <p className="text-muted-foreground">No image uploaded</p>
                  </div>
                )}
              </div>
              <Input
                id="about-image"
                type="file"
                accept="image/*"
                ref={aboutInputRef}
                onChange={handleAboutImageChange}
                disabled={uploading}
              />
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Recommended size: 1280x720 pixels (16:9 aspect ratio)</p>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button asChild>
            <a href="/">Go to Home Page</a>
          </Button>
        </div>
      </div>
    </div>
  )
}


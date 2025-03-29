"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { setCookie } from "cookies-next"
import Link from "next/link"

export default function DirectAdminPage() {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("Preparing admin access...")

  useEffect(() => {
    const setupAuth = async () => {
      try {
        // Force set authentication in both localStorage and cookies
        localStorage.setItem("authenticated", "true")
        setCookie("auth", "true", { maxAge: 60 * 60 * 24 }) // 24 hours

        // Wait to ensure storage is updated
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setMessage("Authentication set successfully! You can now access the admin page.")
        setLoading(false)
      } catch (error) {
        console.error("Setup error:", error)
        setMessage("An error occurred. Please try the button below.")
        setLoading(false)
      }
    }

    setupAuth()
  }, [])

  const handleForceAccess = () => {
    // Force set authentication again
    localStorage.setItem("authenticated", "true")
    setCookie("auth", "true", { maxAge: 60 * 60 * 24 }) // 24 hours

    // Direct navigation to admin page
    window.location.href = "/admin-content"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Direct Admin Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            {message}
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full" disabled={loading}>
              <Link href="/admin">Go to Admin Page</Link>
            </Button>

            <Button onClick={handleForceAccess} variant="outline" className="w-full">
              Force Access (Alternative Route)
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


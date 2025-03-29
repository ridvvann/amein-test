"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { setCookie } from "cookies-next"

export default function AdminBypassPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleBypass = async () => {
    setLoading(true)
    setMessage("Setting authentication...")

    try {
      // Set authentication in localStorage and cookies
      localStorage.setItem("authenticated", "true")
      setCookie("auth", "true", { maxAge: 60 * 60 * 24 }) // 24 hours

      setMessage("Authentication set successfully! Redirecting to admin page...")

      // Wait a moment to ensure storage is updated
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to admin page
      window.location.href = "/admin"
    } catch (error) {
      console.error("Bypass error:", error)
      setMessage("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Bypass</CardTitle>
          <CardDescription className="text-center">
            Use this page to bypass the login page if you're stuck in a redirect loop
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <div className="p-3 rounded-md bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 text-sm">
              {message}
            </div>
          )}

          <Button onClick={handleBypass} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Bypass Login & Go to Admin"
            )}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-muted-foreground mt-4">
            This page sets the authentication cookie and localStorage values directly. Use this only if you're having
            trouble with the normal login page.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


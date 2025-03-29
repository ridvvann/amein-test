"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lock, User } from "lucide-react"
import { setCookie } from "cookies-next"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/admin"

  // Check if already authenticated - but don't redirect automatically
  // This prevents the redirect loop
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Just check authentication status without redirecting
    const authStatus = localStorage.getItem("authenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simple hardcoded authentication
      if (username === "Amein2025" && password === "Amein2030") {
        // Set authentication in localStorage and cookies
        localStorage.setItem("authenticated", "true")
        setCookie("auth", "true", { maxAge: 60 * 60 * 24 }) // 24 hours

        // Wait a moment to ensure storage is updated
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Redirect to admin page
        window.location.href = from // Use direct navigation instead of router
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
          {isAuthenticated && (
            <div className="p-3 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 text-sm">
              You appear to be already logged in.
              <Button
                variant="link"
                className="p-0 h-auto text-amber-800 dark:text-amber-300 underline ml-1"
                onClick={() => (window.location.href = from)}
              >
                Go to admin
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-muted-foreground mt-4">
            This is a protected area. Only authorized personnel should attempt to login.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}


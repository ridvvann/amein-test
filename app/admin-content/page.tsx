"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminContentPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const authStatus = localStorage.getItem("authenticated") === "true"
    setIsAuthenticated(authStatus)
    setLoading(false)

    // If not authenticated, redirect to login
    if (!authStatus) {
      router.push("/login")
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    )
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

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="info">Admin Info</TabsTrigger>
            <TabsTrigger value="links">Quick Links</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>You have successfully accessed the admin area!</p>
                  <p>This is an alternative admin page that bypasses the middleware protection.</p>
                  <Button asChild>
                    <Link href="/admin">Go to Main Admin Page</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-auto py-4 justify-start">
                    <Link href="/admin">
                      <div className="text-left">
                        <div className="font-bold">Main Admin</div>
                        <div className="text-sm text-muted-foreground">Manage videos and content</div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto py-4 justify-start">
                    <Link href="/profile-images">
                      <div className="text-left">
                        <div className="font-bold">Profile Images</div>
                        <div className="text-sm text-muted-foreground">Manage profile photos</div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto py-4 justify-start">
                    <Link href="/">
                      <div className="text-left">
                        <div className="font-bold">Home Page</div>
                        <div className="text-sm text-muted-foreground">View your website</div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto py-4 justify-start">
                    <Link href="/portfolio">
                      <div className="text-left">
                        <div className="font-bold">Portfolio</div>
                        <div className="text-sm text-muted-foreground">View your portfolio</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


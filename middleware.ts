import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Skip middleware for direct-admin and admin-content routes
  if (request.nextUrl.pathname.startsWith("/direct-admin") || request.nextUrl.pathname.startsWith("/admin-content")) {
    return NextResponse.next()
  }

  // Check if the request is for the admin page
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Check if the user is authenticated via cookie
    const isAuthenticated = request.cookies.get("auth")?.value === "true"

    // If not authenticated, redirect to the login page
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Continue with the request
  return NextResponse.next()
}

// Configure the paths that should be checked by this middleware
export const config = {
  matcher: ["/admin/:path*"],
}


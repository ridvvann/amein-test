"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteCookie } from "cookies-next"

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    // Clear authentication from all possible storage locations
    localStorage.removeItem("authenticated")
    sessionStorage.removeItem("authenticated")
    deleteCookie("auth")

    // Force a page reload to clear any in-memory state
    window.location.href = "/login"
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}


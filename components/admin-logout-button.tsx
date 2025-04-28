"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AdminLogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      const supabase = createClientComponentClient()

      // Perform logout directly using the client
      await supabase.auth.signOut()

      // Force navigation to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
      setIsLoading(false)
      // If there's an error, still try to redirect
      window.location.href = "/"
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoading} className="flex items-center gap-2">
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      <span>Выйти</span>
    </Button>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { LogOut } from "lucide-react"

interface AdminLogoutButtonProps {
  className?: string
}

export function AdminLogoutButton({ className }: AdminLogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const supabase = createClientComponentClient()
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <button onClick={handleLogout} className={className}>
      <LogOut className="h-5 w-5" />
      <span className="ml-3">Выйти</span>
    </button>
  )
}

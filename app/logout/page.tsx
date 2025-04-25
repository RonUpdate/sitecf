"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function LogoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Use direct Supabase client for client-side logout
        const supabase = createClientComponentClient()
        await supabase.auth.signOut()

        // Redirect after logout
        router.push("/")
        router.refresh()
      } catch (err: any) {
        console.error("Logout error:", err)
        setError("An error occurred during logout")
        setIsLoading(false)
      }
    }

    handleLogout()
  }, [router])

  return <div>Logout</div>
}

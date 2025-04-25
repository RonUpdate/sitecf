"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export default function LoginPage() {
  const [loading, setLoading] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "/admin"
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession()
        console.log("Session data:", data) // Add this line

        if (data.session) {
          setHasSession(true)
          // Only redirect if not coming from middleware
          if (!searchParams.has("from")) {
            router.replace("/admin")
          }
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setLoading(false)
      }
    }

    checkSession()
  }, [router, supabase.auth, searchParams])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Loading...</h2>
        </div>
      </div>
    )
  }

  if (hasSession) {
    return null
  }

  return <div>Login</div>
}

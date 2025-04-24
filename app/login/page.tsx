"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { ServerLoginForm } from "@/components/server-login-form"

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

        if (data.session) {
          setHasSession(true)
          router.replace("/admin")
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setLoading(false)
      }
    }

    checkSession()
  }, [router, supabase.auth])

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Вход в систему</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ServerLoginForm from={from} />
        </div>
      </div>
    </div>
  )
}

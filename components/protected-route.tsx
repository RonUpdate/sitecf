"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode
  requireAdmin?: boolean
}) {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          router.push("/error?message=session_error")
          return
        }

        if (!session) {
          router.push("/unauthorized")
          return
        }

        if (requireAdmin) {
          try {
            const { data: adminUser, error: adminError } = await supabase
              .from("admin_users")
              .select("*")
              .eq("email", session.user.email)
              .single()

            if (adminError) {
              console.error("Admin check error:", adminError)
              router.push("/error?message=admin_check_error")
              return
            }

            if (!adminUser) {
              router.push("/forbidden")
              return
            }
          } catch (adminCheckError) {
            console.error("Exception in admin check:", adminCheckError)
            router.push("/error?message=admin_check_exception")
            return
          }
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Auth check exception:", error)
        setError("Failed to verify authentication")
        router.push("/error?message=auth_check_exception")
      }
    }

    checkAuth()
  }, [router, supabase, requireAdmin])

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Authentication Error</h2>
        <p className="mt-2">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}

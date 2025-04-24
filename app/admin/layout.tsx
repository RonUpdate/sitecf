"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { NavigationProgress } from "@/components/navigation-progress"
import { PageTransition } from "@/components/page-transition"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { SessionRefreshProvider } from "@/providers/session-refresh-provider"
import { AutoSessionRefresh } from "@/components/auto-session-refresh"
import { SessionExpiryNotification } from "@/components/session-expiry-notification"

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function checkAuth() {
      try {
        // Check session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          router.replace("/login")
          return
        }

        // Check if user is admin
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (adminError || !adminUser) {
          router.replace("/forbidden?reason=not_admin")
          return
        }

        setLoading(false)
      } catch (error) {
        console.error("Error in admin layout:", error)
        router.replace("/error?message=admin_layout_error")
      }
    }

    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold">Loading...</h2>
          <p className="text-gray-500">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  return (
    <SessionRefreshProvider>
      <div className="flex min-h-screen">
        <NavigationProgress />
        <AdminSidebar />
        <div className="flex-1 p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </div>
        <AutoSessionRefresh />
        <SessionExpiryNotification />
      </div>
    </SessionRefreshProvider>
  )
}

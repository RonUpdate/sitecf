"use client"

import { useEffect, type ReactNode } from "react"
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

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/unauthorized")
        return
      }

      if (requireAdmin) {
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (!adminUser) {
          router.push("/forbidden")
        }
      }
    }

    checkAuth()
  }, [router, supabase, requireAdmin])

  return <>{children}</>
}

"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"

// Client-side auth utilities
export function useRequireAuth() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/login")
        return null
      }

      return session
    } catch (error) {
      console.error("Auth error:", error)
      router.replace("/error")
      return null
    }
  }

  return { checkAuth }
}

export function useRequireAdmin() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const checkAdmin = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace("/login")
        return null
      }

      // Check if user is admin
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", session.user.email)
        .single()

      if (error || !adminUser) {
        console.error("Admin check failed:", error)
        router.replace("/forbidden")
        return null
      }

      return { session, adminUser }
    } catch (error) {
      console.error("Admin check error:", error)
      router.replace("/error")
      return null
    }
  }

  return { checkAdmin }
}

export async function isAdminClient(email: string): Promise<boolean> {
  try {
    const supabase = createClientComponentClient<Database>()
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", email).single()

    return !!adminUser
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

export const getClientSession = async () => {
  try {
    const supabase = createClientComponentClient()
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error("Error getting client session:", error)
    return null
  }
}

export const getClientUser = async () => {
  try {
    const supabase = createClientComponentClient()
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

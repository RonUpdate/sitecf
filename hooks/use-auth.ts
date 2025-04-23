"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.push("/")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signOut }
}

export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    if (!loading && !user && !redirected) {
      setRedirected(true)
      router.push("/unauthorized")
    }
  }, [user, loading, router, redirected])

  return { user, loading }
}

export function useAdminStatus() {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false)
        return
      }

      try {
        const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).single()

        setIsAdmin(!!adminUser)
      } catch (error) {
        setIsAdmin(false)
      } finally {
        setCheckingAdmin(false)
      }
    }

    if (!loading) {
      checkAdminStatus()
    }
  }, [user, loading, supabase])

  useEffect(() => {
    if (!loading && !checkingAdmin && !isAdmin && !redirected) {
      setRedirected(true)
      router.push("/forbidden")
    }
  }, [isAdmin, loading, checkingAdmin, router, redirected])

  return { user, isAdmin, loading: loading || checkingAdmin }
}

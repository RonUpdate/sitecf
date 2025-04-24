"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import useSWR from "swr"
import logger from "@/lib/logger"

// Create a singleton Supabase client
const getSupabaseClient = (() => {
  let client: ReturnType<typeof createClientComponentClient<Database>> | null = null
  return () => {
    if (!client) {
      client = createClientComponentClient<Database>()
    }
    return client
  }
})()

// Fetcher for user data
const userFetcher = async () => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) throw error
    return data.user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

// Fetcher for admin status
const adminFetcher = async (user: any) => {
  if (!user) return false

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.from("admin_users").select("*").eq("email", user.email).single()

    if (error) throw error
    return !!data
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

export function useAuthSWR() {
  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR("auth-user", userFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000, // 10 seconds
    errorRetryCount: 3,
  })

  const { data: isAdmin, isLoading: isCheckingAdmin } = useSWR(
    () => (user ? ["admin-status", user.email] : null),
    () => adminFetcher(user),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    },
  )

  const supabase = getSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        mutate()
      } else if (event === "SIGNED_OUT") {
        mutate(null, false)
        // Используем абсолютный URL для перенаправления
        const baseUrl = window.location.origin
        window.location.replace(baseUrl + "/")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [mutate, router, supabase])

  const signOut = async () => {
    try {
      logger.auth.info("Начало процесса выхода из системы через useAuthSWR")

      // Выполняем выход на клиенте
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      logger.auth.info("Успешный выход на клиенте, перенаправление на главную страницу")

      // Обновляем состояние SWR
      mutate(null, false)

      // Используем абсолютный URL для перенаправления
      const baseUrl = window.location.origin
      window.location.replace(baseUrl + "/")
    } catch (error: any) {
      logger.auth.error("Ошибка при выходе из системы", { error: error.message })
      console.error("Ошибка при выходе из системы:", error)
    }
  }

  return {
    user,
    isAdmin,
    isLoading: isLoading || isCheckingAdmin,
    error,
    signOut,
  }
}

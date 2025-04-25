"use client"

import { useEffect } from "react"
import { useSessionRefresh } from "@/hooks/use-session-refresh"

export function AutoSessionRefresh() {
  const { checkSession, refreshSession } = useSessionRefresh()

  useEffect(() => {
    // Проверяем сессию при монтировании компонента
    let isMounted = true

    const initSession = async () => {
      if (!isMounted) return

      try {
        await checkSession()
      } catch (error) {
        console.error("Error checking session:", error)
      }
    }

    initSession()

    return () => {
      isMounted = false
    }
  }, [checkSession])

  return null
}

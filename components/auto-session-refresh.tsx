"use client"

import { useEffect, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import logger from "@/lib/logger"

export function AutoSessionRefresh() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const refreshAttemptRef = useRef(false)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkAndRefreshSession = async () => {
      try {
        logger.debug("[AutoSessionRefresh] Checking session status")

        // Получаем текущую сессию
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          logger.auth.error("Error getting session for refresh", sessionError)
          return
        }

        if (!session) {
          logger.auth.event("No active session found during refresh check")
          return
        }

        // Вычисляем, когда истекает сессия
        const expiresAt = session.expires_at
        const now = Math.floor(Date.now() / 1000)
        const timeUntilExpiry = expiresAt - now

        logger.auth.event("Session expiry check", {
          expiresAt,
          now,
          timeUntilExpiry,
          sessionId: session.user?.id,
        })

        // Если до истечения сессии осталось меньше 5 минут, обновляем её
        if (timeUntilExpiry < 300 && !refreshAttemptRef.current) {
          refreshAttemptRef.current = true

          logger.auth.event("Attempting to refresh session", {
            timeUntilExpiry,
            userId: session.user?.id,
          })

          const { error: refreshError } = await supabase.auth.refreshSession()

          if (refreshError) {
            logger.auth.error("Failed to refresh session", refreshError, {
              userId: session.user?.id,
            })

            // Если не удалось обновить сессию, перенаправляем на страницу входа
            if (refreshError.message.includes("expired")) {
              logger.auth.event("Session expired, redirecting to login", {
                userId: session.user?.id,
              })
              router.push("/login?expired=true")
            }
          } else {
            logger.auth.event("Session refreshed successfully", {
              userId: session.user?.id,
            })
            router.refresh()
          }

          refreshAttemptRef.current = false
        } else if (timeUntilExpiry >= 300) {
          // Планируем следующую проверку за 5 минут до истечения сессии
          const nextCheckTime = Math.max(1, timeUntilExpiry - 300) * 1000

          logger.debug("[AutoSessionRefresh] Scheduling next check", {
            nextCheckTime,
            timeUntilExpiry,
          })

          if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current)
          }

          refreshTimeoutRef.current = setTimeout(checkAndRefreshSession, nextCheckTime)
        }
      } catch (error) {
        logger.auth.error("Unexpected error in session refresh", error)
        refreshAttemptRef.current = false
      }
    }

    // Запускаем первую проверку
    checkAndRefreshSession()

    // Проверяем сессию при возвращении на вкладку
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        logger.debug("[AutoSessionRefresh] Tab became visible, checking session")
        checkAndRefreshSession()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [supabase, router])

  return null
}

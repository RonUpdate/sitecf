"use client"

import { useState, useEffect } from "react"
import { useSessionRefresh } from "@/hooks/use-session-refresh"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function SessionExpiryNotification() {
  const { sessionExpiry, isRefreshing, refreshSession } = useSessionRefresh()
  const [showNotification, setShowNotification] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string | null>(null)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    // Функция для обновления времени до истечения сессии
    const updateTimeLeft = () => {
      if (!sessionExpiry) {
        setTimeLeft(null)
        setShowNotification(false)
        return
      }

      const now = new Date()
      const expiryTime = sessionExpiry.getTime()
      const timeUntilExpiry = expiryTime - now.getTime()

      // Показываем уведомление за 10 минут до истечения сессии
      const shouldShowNotification = timeUntilExpiry <= 10 * 60 * 1000 && timeUntilExpiry > 0

      setShowNotification(shouldShowNotification)

      if (timeUntilExpiry <= 0) {
        setTimeLeft("Сессия истекла")
        return
      }

      // Форматируем оставшееся время
      const minutes = Math.floor(timeUntilExpiry / 60000)
      const seconds = Math.floor((timeUntilExpiry % 60000) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    // Обновляем время каждую секунду
    if (sessionExpiry) {
      updateTimeLeft()
      intervalId = setInterval(updateTimeLeft, 1000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [sessionExpiry])

  // Если не нужно показывать уведомление, не рендерим ничего
  if (!showNotification) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Сессия скоро истечет</AlertTitle>
        <AlertDescription className="text-amber-700">
          <div className="flex flex-col gap-2">
            <p>
              Ваша сессия истечет через <strong>{timeLeft}</strong>. Обновите сессию, чтобы продолжить работу.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="bg-white border-amber-300 hover:bg-amber-100 w-full"
              onClick={() => refreshSession()}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Обновление...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Обновить сессию
                </>
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}

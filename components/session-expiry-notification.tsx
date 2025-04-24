"use client"

import { useEffect, useState } from "react"
import { useSessionRefreshContext } from "@/providers/session-refresh-provider"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function SessionExpiryNotification() {
  const { sessionExpiry, isRefreshing, refreshSession } = useSessionRefreshContext()
  const [showNotification, setShowNotification] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!sessionExpiry) return

    const checkExpiryInterval = setInterval(() => {
      const now = new Date()
      const timeUntilExpiry = sessionExpiry.getTime() - now.getTime()

      // Показываем уведомление, если до истечения осталось менее 5 минут
      if (timeUntilExpiry <= 5 * 60 * 1000 && !showNotification) {
        setShowNotification(true)

        // Форматируем оставшееся время
        const minutes = Math.floor(timeUntilExpiry / 60000)
        const seconds = Math.floor((timeUntilExpiry % 60000) / 1000)
        const timeLeft = `${minutes} мин ${seconds} сек`

        // Показываем toast с кнопкой продления
        toast({
          title: "Сессия скоро истечет",
          description: `Ваша сессия истечет через ${timeLeft}`,
          duration: 0, // Не скрывать автоматически
          action: (
            <Button
              size="sm"
              onClick={() => {
                refreshSession().then(() => {
                  setShowNotification(false)
                  toast({
                    title: "Сессия продлена",
                    description: "Ваша сессия была успешно продлена",
                    duration: 3000,
                  })
                })
              }}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Продление...
                </>
              ) : (
                "Продлить"
              )}
            </Button>
          ),
        })
      }
    }, 1000)

    return () => clearInterval(checkExpiryInterval)
  }, [sessionExpiry, showNotification, isRefreshing])

  return null // Этот компонент не рендерит UI, только показывает toast
}

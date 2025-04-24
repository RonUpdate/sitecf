"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"

export function SessionStatus() {
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)
  const [isLongSession, setIsLongSession] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true)
        const { data } = await supabase.auth.getSession()

        if (data.session) {
          const expiresAt = new Date(data.session.expires_at * 1000)
          setSessionExpiry(expiresAt)

          // Проверяем, является ли сессия долгосрочной (больше 24 часов)
          const now = new Date()
          const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000)
          setIsLongSession(expiresAt > oneDayLater)
        } else {
          setSessionExpiry(null)
        }
      } catch (err) {
        console.error("Ошибка при проверке сессии:", err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Обновляем информацию о сессии каждую минуту
    const intervalId = setInterval(checkSession, 60000)

    return () => clearInterval(intervalId)
  }, [])

  // Функция для форматирования даты и времени
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  // Функция для расчета оставшегося времени
  const getTimeRemaining = (expiryDate: Date) => {
    const now = new Date()
    const diffMs = expiryDate.getTime() - now.getTime()

    if (diffMs <= 0) return "Сессия истекла"

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    let result = ""

    if (diffDays > 0) {
      result += `${diffDays} д. `
    }

    if (diffHours > 0 || diffDays > 0) {
      result += `${diffHours} ч. `
    }

    result += `${diffMinutes} мин.`

    return result
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Статус сессии
          {isLongSession ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Долгосрочная
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Стандартная
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Информация о текущей сессии</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sessionExpiry ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Истекает:</span>
              <span className="text-sm">{formatDateTime(sessionExpiry)}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Осталось:</span>
              <span className="text-sm">{getTimeRemaining(sessionExpiry)}</span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              <span className="text-sm font-medium text-muted-foreground">Автопродление:</span>
              <span className="text-sm">Включено</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Сессия не найдена</p>
        )}
      </CardContent>
    </Card>
  )
}

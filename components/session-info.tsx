"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SessionInfo() {
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)
  const [isLongSession, setIsLongSession] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        const expiresAt = new Date(data.session.expires_at * 1000)
        setSessionExpiry(expiresAt)

        // Проверяем, является ли сессия долгосрочной (больше 1 дня)
        const now = new Date()
        const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        setIsLongSession(expiresAt > oneDayLater)
      }
    }

    checkSession()
  }, [supabase.auth])

  if (!sessionExpiry) {
    return null
  }

  // Форматируем дату и время
  const formattedExpiry = new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(sessionExpiry)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Информация о сессии</CardTitle>
        <CardDescription>Данные о текущей сессии администратора</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Сессия истекает:</span>
            <span className="font-medium">{formattedExpiry}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Тип сессии:</span>
            <Badge variant={isLongSession ? "default" : "outline"}>
              {isLongSession ? "Долгосрочная" : "Стандартная"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

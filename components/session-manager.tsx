"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export function SessionManager() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true")
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleRefreshSession = async () => {
    setLoading(true)
    setError("")

    try {
      // Устанавливаем срок действия сессии в зависимости от выбора "Запомнить меня"
      const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 // 30 дней или 1 час

      const { error } = await supabase.auth.refreshSession({
        options: {
          expiresIn,
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      // Сохраняем предпочтение "Запомнить меня" в localStorage
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
      } else {
        localStorage.removeItem("rememberMe")
      }

      // Обновляем страницу для применения изменений
      window.location.reload()
    } catch (err: any) {
      console.error("Ошибка обновления сессии:", err)
      setError(err.message || "Произошла ошибка при обновлении сессии")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    setError("")

    try {
      // Перенаправляем на страницу выхода
      router.push("/logout")
    } catch (err: any) {
      console.error("Ошибка при выходе из системы:", err)
      setError(err.message || "Произошла ошибка при выходе из системы")
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление сессией</CardTitle>
        <CardDescription>Обновите или завершите текущую сессию</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            id="session-remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
            disabled={loading}
          />
          <Label
            htmlFor="session-remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Запомнить меня (продлить сессию на 30 дней)
          </Label>
        </div>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleSignOut} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Выход...
            </>
          ) : (
            "Выйти"
          )}
        </Button>
        <Button onClick={handleRefreshSession} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обновление...
            </>
          ) : (
            "Обновить сессию"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

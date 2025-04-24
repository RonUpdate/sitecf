"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { refreshSession } from "@/lib/session-utils"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function SessionManager() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true")
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleRefreshSession = async () => {
    setLoading(true)
    setError("")

    try {
      const { error } = await refreshSession(rememberMe)

      if (error) {
        throw error
      }

      // Сохраняем предпочтение "Запомнить меня" в localStorage
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
      } else {
        localStorage.removeItem("rememberMe")
      }

      // Обновляем страницу для применения изменений
      router.refresh()
    } catch (err: any) {
      console.error("Ошибка обновления сессии:", err)
      setError(err.message || "Произошла ошибка при обновлении сессии")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)

    try {
      await supabase.auth.signOut()
      router.push("/login")
      router.refresh()
    } catch (err) {
      console.error("Ошибка выхода:", err)
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
          Выйти
        </Button>
        <Button onClick={handleRefreshSession} disabled={loading}>
          {loading ? "Обновление..." : "Обновить сессию"}
        </Button>
      </CardFooter>
    </Card>
  )
}

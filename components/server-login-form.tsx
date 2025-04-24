"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Checkbox } from "@/components/ui/checkbox"

export function ServerLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Восстанавливаем предпочтение "Запомнить меня" при загрузке компонента
  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true"
    setRememberMe(remembered)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Используем серверный API-маршрут для входа
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ошибка входа")
      }

      // Сохраняем предпочтение "Запомнить меня" в localStorage
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
      } else {
        localStorage.removeItem("rememberMe")
      }

      // Принудительно обновляем сессию
      await supabase.auth.getSession()

      // Обновляем состояние маршрутизатора
      router.refresh()

      // Переходим в админку
      router.push(data.redirectUrl || "/admin")
    } catch (err: any) {
      console.error("Ошибка входа:", err)
      setError(err.message || "Произошла непредвиденная ошибка")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="server-email">Email</Label>
        <Input id="server-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="server-password">Пароль</Label>
        <Input
          id="server-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="server-remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
        />
        <Label
          htmlFor="server-remember-me"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Запомнить меня
        </Label>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Вход..." : "Войти через сервер"}
      </Button>
    </form>
  )
}

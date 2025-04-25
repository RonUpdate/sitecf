"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function ServerLoginForm({ from = "/admin" }: { from?: string }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [supabaseInitialized, setSupabaseInitialized] = useState(true)
  const router = useRouter()

  // Инициализируем Supabase клиент только один раз
  const supabase = createClientComponentClient()

  const validateInputs = () => {
    if (!email || !email.includes("@")) {
      setError("Пожалуйста, введите корректный email")
      return false
    }

    if (!password || password.length < 6) {
      setError("Пароль должен содержать не менее 6 символов")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!supabaseInitialized) {
      setError("Система аутентификации не инициализирована. Пожалуйста, обновите страницу.")
      return
    }

    if (!validateInputs()) {
      return
    }

    setLoading(true)

    try {
      console.log("Login attempt", { email, rememberMe })

      // Определяем срок действия сессии в зависимости от выбора "Запомнить меня"
      const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 // 30 дней или 1 час

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          expiresIn,
        },
      })

      if (error) {
        console.error("Login failed", { errorMessage: error.message, errorCode: error.code, email })

        // Обработка конкретных ошибок
        if (error.message.includes("Invalid login credentials")) {
          setError("Неверный email или пароль")
        } else if (error.message.includes("Email not confirmed")) {
          setError("Email не подтвержден. Пожалуйста, проверьте вашу почту.")
        } else {
          setError(`Ошибка входа: ${error.message}`)
        }

        setLoading(false)
        return
      }

      if (!data || !data.session) {
        console.error("No session data returned", { email })
        setError("Не удалось создать сессию. Пожалуйста, попробуйте еще раз.")
        setLoading(false)
        return
      }

      console.log("Login successful", {
        email,
        rememberMe,
        expiresIn,
        redirectTo: from,
        userId: data.session.user.id,
      })

      // Проверяем права администратора
      const { data: adminUser, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", email)
        .single()

      if (adminError || !adminUser) {
        console.error("Not an admin user", { email, adminError })

        // Выходим из системы, так как пользователь не админ
        await supabase.auth.signOut()

        setError("У вас нет прав администратора")
        setLoading(false)
        return
      }

      // Перенаправляем на страницу, с которой пришли, или на админку
      router.replace(from)
    } catch (err: any) {
      console.error("Unexpected login error", {
        error: err.message || "Unknown error",
        stack: err.stack,
        email,
      })
      setError("Произошла неожиданная ошибка при входе. Пожалуйста, попробуйте позже.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="sonyakern605@gmail.com"
          disabled={loading || !supabaseInitialized}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading || !supabaseInitialized}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked === true)}
          disabled={loading || !supabaseInitialized}
        />
        <Label htmlFor="remember-me" className="text-sm cursor-pointer">
          Запомнить меня (30 дней)
        </Label>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}

      <Button type="submit" className="w-full" disabled={loading || !supabaseInitialized}>
        {loading ? "Вход..." : "Войти"}
      </Button>
    </form>
  )
}

"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Palette } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServerLoginForm } from "@/components/server-login-form"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Устанавливаем срок действия сессии в зависимости от выбора "Запомнить меня"
      // По умолчанию: 3600 секунд (1 час)
      // С "Запомнить меня": 2592000 секунд (30 дней)
      const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 // 30 дней или 1 час

      // 1. Выполняем вход с указанием срока действия сессии
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          expiresIn,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.session) {
        // 2. Проверяем права администратора
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", email)
          .single()

        if (adminError || !adminUser) {
          // Если пользователь не админ, выходим из системы
          await supabase.auth.signOut()
          setError("У вас нет прав администратора")
          setLoading(false)
          return
        }

        // Сохраняем предпочтение "Запомнить меня" в localStorage
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true")
        } else {
          localStorage.removeItem("rememberMe")
        }

        // 3. Важно! Принудительно обновляем сессию перед переходом
        await supabase.auth.getSession()

        // 4. Обновляем состояние маршрутизатора
        router.refresh()

        // 5. Переходим в админку
        router.push("/admin")
      } else {
        setError("Вход выполнен успешно, но сессия не создана")
        setLoading(false)
      }
    } catch (err) {
      console.error("Ошибка входа:", err)
      setError("Произошла непредвиденная ошибка")
      setLoading(false)
    }
  }

  // Восстанавливаем предпочтение "Запомнить меня" при загрузке компонента
  React.useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true"
    setRememberMe(remembered)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Palette className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Art Market Admin</CardTitle>
          <CardDescription>Войдите, чтобы получить доступ к панели администратора</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="client">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="client">Клиентский вход</TabsTrigger>
              <TabsTrigger value="server">Серверный вход</TabsTrigger>
            </TabsList>
            <TabsContent value="client">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Запомнить меня
                    </Label>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Вход..." : "Войти"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="server">
              <ServerLoginForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    getUser()
  }, [supabase])

  const handleSignIn = async () => {
    // Для тестирования используем фиксированные учетные данные
    // В реальном приложении вы бы использовали форму
    const { error } = await supabase.auth.signInWithPassword({
      email: "admin@example.com",
      password: "password123",
    })

    if (error) {
      console.error("Error signing in:", error)
      alert("Ошибка входа: " + error.message)
    } else {
      router.push("/admin")
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Тестирование аутентификации</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div>
              <p className="mb-4">Вы вошли как: {user.email}</p>
              <div className="flex gap-2">
                <Button onClick={handleSignOut}>Выйти</Button>
                <Link href="/admin">
                  <Button variant="outline">Перейти в админку</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4">Вы не вошли в систему</p>
              <div className="flex gap-2">
                <Button onClick={handleSignIn}>Тестовый вход</Button>
                <Link href="/login">
                  <Button variant="outline">Перейти на страницу входа</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

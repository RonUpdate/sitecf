"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function AdminLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      // Используем Supabase клиент для выхода
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      // Перенаправляем на главную страницу после небольшой задержки
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 100)
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <Button variant="ghost" className="w-full justify-start" onClick={handleLogout} disabled={isLoggingOut}>
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isLoggingOut ? "Выход..." : "Выйти"}</span>
    </Button>
  )
}

"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        const supabase = createClientComponentClient()
        const { error } = await supabase.auth.signOut()

        if (error) {
          throw new Error(error.message)
        }

        // Добавляем небольшую задержку перед перенаправлением
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 100)
      } catch (err: any) {
        console.error("Ошибка при выходе:", err)
        setError(err.message || "Произошла ошибка при выходе из системы")
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ошибка при выходе</h1>
          <p className="mb-4">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">
            Вернуться на главную
          </a>
        </div>
      ) : (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Выход из системы</h1>
          <p>Пожалуйста, подождите...</p>
        </div>
      )}
    </div>
  )
}

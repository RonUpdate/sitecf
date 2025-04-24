"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleLogout = async () => {
      try {
        setIsLoading(true)
        const supabase = createClientComponentClient()

        // Perform logout
        const { error } = await supabase.auth.signOut()

        if (error) {
          throw new Error(error.message)
        }

        // Redirect after a short delay to ensure cookies are cleared
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 500)
      } catch (err: any) {
        setError(err.message || "An error occurred during logout")
        setIsLoading(false)
      }
    }

    handleLogout()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <h1 className="text-xl font-semibold">Выполняется выход из системы...</h1>
          <p className="text-muted-foreground mt-2">Пожалуйста, подождите.</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-500">Ошибка при выходе из системы</h1>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Вернуться на главную
          </Button>
        </div>
      ) : null}
    </div>
  )
}

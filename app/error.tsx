"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Что-то пошло не так</h1>
      <p className="text-lg text-gray-600 mb-8">
        Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте снова.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} variant="default">
          Попробовать снова
        </Button>
        <Button onClick={() => router.push("/")} variant="outline">
          Вернуться на главную
        </Button>
        <Button onClick={() => router.refresh()} variant="secondary">
          Обновить страницу
        </Button>
      </div>
    </div>
  )
}

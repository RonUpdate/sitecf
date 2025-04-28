"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Safely log the error to console for debugging
    console.error("Ошибка в приложении:", error)
  }, [error])

  // Extract error message safely regardless of error format
  const getErrorMessage = () => {
    if (typeof error === "string") return error
    if (error instanceof Error) return error.message
    if (error && typeof error === "object") {
      if ("message" in error) return String(error.message)
      return JSON.stringify(error)
    }
    return "Неизвестная ошибка"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-red-50 to-white">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <AlertTriangle size={48} className="text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Что-то пошло не так!</h1>
        <p className="text-gray-500 mb-8">
          Произошла ошибка при обработке вашего запроса. Мы уже работаем над её устранением.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="outline" className="flex items-center gap-2">
            <RefreshCw size={16} />
            Попробовать снова
          </Button>
          <Link href="/">
            <Button className="flex items-center gap-2 w-full">
              <Home size={16} />
              Вернуться на главную
            </Button>
          </Link>
        </div>

        {error && error.digest && (
          <div className="mt-8 text-sm text-gray-400">
            <p>Код ошибки: {error.digest}</p>
          </div>
        )}

        {/* Отображаем сообщение об ошибке только в режиме разработки */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md text-left">
            <p className="font-mono text-sm text-red-600">{getErrorMessage()}</p>
          </div>
        )}
      </div>
    </div>
  )
}

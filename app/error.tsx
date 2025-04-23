"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">Что-то пошло не так!</h1>
      <p className="text-gray-500 mb-8">Произошла ошибка при обработке вашего запроса.</p>
      <div className="flex gap-4">
        <Button onClick={reset}>Попробовать снова</Button>
        <Link href="/">
          <Button variant="outline">Вернуться на главную</Button>
        </Link>
      </div>
    </div>
  )
}

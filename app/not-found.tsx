"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-purple-50 to-white">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Страница не найдена</h2>
        <p className="text-gray-500 mb-8">Запрашиваемая страница не существует или была перемещена.</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.history.back()} variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Вернуться назад
          </Button>

          <Link href="/">
            <Button className="flex items-center gap-2 w-full">
              <Home size={16} />
              На главную
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>URL: {typeof window !== "undefined" ? window.location.href : ""}</p>
        </div>
      </div>
    </div>
  )
}

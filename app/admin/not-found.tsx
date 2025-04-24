"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Страница админ-панели не найдена</h1>
      <p className="text-lg mb-8">Запрашиваемая страница админ-панели не существует или была перемещена.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Вернуться назад
        </Button>
        <Button asChild>
          <Link href="/admin">В админ-панель</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/">Вернуться на главную сайта</Link>
        </Button>
      </div>
    </div>
  )
}

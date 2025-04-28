import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Страница не найдена</h2>
      <p className="text-gray-500 mb-8 max-w-md">Запрашиваемая страница не существует или была перемещена.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link href="javascript:history.back()">Вернуться назад</Link>
        </Button>
        <Button asChild>
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  )
}

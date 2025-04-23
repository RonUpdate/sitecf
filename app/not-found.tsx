import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-4">404 - Страница не найдена</h1>
      <p className="text-gray-500 mb-8">Запрашиваемая страница не существует.</p>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-400">URL: {typeof window !== "undefined" ? window.location.href : ""}</p>
        <Link href="/">
          <Button>Вернуться на главную</Button>
        </Link>
      </div>
    </div>
  )
}

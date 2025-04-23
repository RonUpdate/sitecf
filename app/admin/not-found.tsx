import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-4">404 - Страница не найдена</h1>
      <p className="text-gray-500 mb-8">Запрашиваемая страница не существует в админ-панели.</p>
      <Link href="/admin">
        <Button>Вернуться на главную</Button>
      </Link>
    </div>
  )
}

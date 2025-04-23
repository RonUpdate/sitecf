import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-yellow-600" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Требуется авторизация</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">Для доступа к этой странице необходимо войти в систему.</p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button>Войти</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Вернуться на главную</Button>
        </Link>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Произошла ошибка</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Что-то пошло не так при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button>Вернуться на главную</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Войти снова</Button>
        </Link>
      </div>
    </div>
  )
}

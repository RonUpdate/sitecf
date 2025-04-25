import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Произошла ошибка</h1>
      <p className="text-lg text-gray-600 mb-8">
        Извините, произошла ошибка при обработке вашего запроса. Наша команда уже работает над решением проблемы.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">Вернуться на главную</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/login">Войти снова</Link>
        </Button>
      </div>
    </div>
  )
}

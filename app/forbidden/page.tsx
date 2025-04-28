import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8 text-red-600" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Доступ запрещен</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">У вас нет прав для доступа к этой странице.</p>
      <Link href="/">
        <Button>Вернуться на главную</Button>
      </Link>
    </div>
  )
}

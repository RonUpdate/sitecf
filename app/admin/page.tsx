import { UnifiedDashboardStats } from "@/components/unified-dashboard-stats"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  // Проверяем, является ли пользователь администратором
  const { session } = await requireAdmin()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Панель управления</h1>

      <UnifiedDashboardStats />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Быстрые ссылки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/products">
            <Button variant="outline" className="w-full justify-start">
              Управление товарами
            </Button>
          </Link>
          <Link href="/admin/coloring-pages">
            <Button variant="outline" className="w-full justify-start">
              Управление раскрасками
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="outline" className="w-full justify-start">
              Управление категориями
            </Button>
          </Link>
          <Link href="/admin/blog">
            <Button variant="outline" className="w-full justify-start">
              Управление блогом
            </Button>
          </Link>
          <Link href="/admin/profile">
            <Button variant="outline" className="w-full justify-start">
              Настройки профиля
            </Button>
          </Link>
          <Link href="/admin/debug">
            <Button variant="outline" className="w-full justify-start">
              Отладочные маршруты
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

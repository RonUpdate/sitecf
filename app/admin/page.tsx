import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, FileImage, Download } from "lucide-react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })

    // Проверяем сессию
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return (
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Требуется авторизация</h1>
          <p className="mb-4">Для доступа к админ-панели необходимо войти в систему.</p>
          <Link href="/login">
            <Button>Войти</Button>
          </Link>
        </div>
      )
    }

    // Проверяем, является ли пользователь администратором
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

    if (!adminUser) {
      return (
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Доступ запрещен</h1>
          <p className="mb-4">У вас нет прав для доступа к админ-панели.</p>
          <Link href="/">
            <Button>Вернуться на главную</Button>
          </Link>
        </div>
      )
    }

    // Получаем статистику
    const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact", head: true })
    const { count: coloringPagesCount } = await supabase
      .from("coloring_pages")
      .select("*", { count: "exact", head: true })
    const { data: downloadData } = await supabase.from("coloring_pages").select("download_count")
    const totalDownloads = downloadData?.reduce((sum, item) => sum + (item.download_count || 0), 0) || 0

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Панель управления</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Всего категорий</CardTitle>
              <Layers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoryCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Страницы раскраски</CardTitle>
              <FileImage className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coloringPagesCount || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Всего загрузок</CardTitle>
              <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDownloads}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Отладочные ссылки</h2>
          <div className="space-y-2">
            <Link href="/admin/coloring-pages/new">
              <Button variant="outline">Новая страница раскраски (прямая ссылка)</Button>
            </Link>
            <Link href="/admin/debug">
              <Button variant="outline" className="ml-2">
                Отладочные маршруты
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Произошла ошибка</h1>
        <p className="mb-4">Не удалось загрузить панель управления. Пожалуйста, попробуйте позже.</p>
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
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, FileImage, Download } from "lucide-react"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Database } from "@/types/supabase"
import logger from "@/lib/logger"
import LogoutButton from "@/components/logout-button"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

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
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    if (adminError) {
      logger.error("Error checking admin status", { error: adminError, email: session.user.email })
      throw new Error("Failed to verify admin status")
    }

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

    // Получаем статистику с обработкой ошибок для каждого запроса
    let categoryCount = 0
    let coloringPagesCount = 0
    let totalDownloads = 0

    try {
      const { count: catCount, error: catError } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true })

      if (!catError) categoryCount = catCount || 0
    } catch (error) {
      logger.error("Error fetching category count", { error })
    }

    try {
      const { count: pagesCount, error: pagesError } = await supabase
        .from("coloring_pages")
        .select("*", { count: "exact", head: true })

      if (!pagesError) coloringPagesCount = pagesCount || 0
    } catch (error) {
      logger.error("Error fetching coloring pages count", { error })
    }

    try {
      const { data: downloadData, error: downloadError } = await supabase
        .from("coloring_pages")
        .select("download_count")

      if (!downloadError && downloadData) {
        totalDownloads = downloadData.reduce((sum, item) => sum + (item.download_count || 0), 0)
      }
    } catch (error) {
      logger.error("Error calculating total downloads", { error })
    }

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Панель управления</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Всего категорий</CardTitle>
              <Layers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categoryCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Страницы раскраски</CardTitle>
              <FileImage className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coloringPagesCount}</div>
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

        <ul className="space-y-4 mb-8">
          <li>
            <Link href="/admin/products" className="text-blue-600 hover:underline">
              Управление товарами
            </Link>
          </li>
          <li>
            <Link href="/admin/products/new" className="text-blue-600 hover:underline">
              Добавить новый товар
            </Link>
          </li>
          <li>
            <Link href="/admin/coloring-pages/new" className="text-blue-600 hover:underline">
              Новая страница раскраски (прямая ссылка)
            </Link>
          </li>
          <li>
            <Link href="/admin/debug" className="text-blue-600 hover:underline">
              Отладочные маршруты
            </Link>
          </li>
        </ul>

        <LogoutButton />
      </div>
    )
  } catch (error) {
    logger.error("Admin dashboard error:", { error })
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
        {process.env.NODE_ENV === "development" && error instanceof Error && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-red-600 font-mono text-sm">{error.message}</p>
          </div>
        )}
      </div>
    )
  }
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Package, ShoppingCart, Users } from "lucide-react"

export function AdminStatsCards() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const supabase = createClientComponentClient()

        // Вместо запроса к несуществующей таблице admin_stats
        // получаем данные из существующих таблиц
        const { count: productsCount } = await supabase.from("products").select("*", { count: "exact", head: true })

        const { count: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

        const { count: coloringPagesCount } = await supabase
          .from("coloring_pages")
          .select("*", { count: "exact", head: true })

        // Создаем объект с данными
        setStats({
          total_products: productsCount || 0,
          total_categories: categoriesCount || 0,
          total_orders: 0, // Заглушка, если нет таблицы заказов
          total_users: 0, // Заглушка, если нет таблицы пользователей
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
        // Устанавливаем заглушку при ошибке
        setStats({
          total_products: 0,
          total_categories: 0,
          total_orders: 0,
          total_users: 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Fallback data if stats is null
  const data = stats || {
    total_products: 0,
    total_categories: 0,
    total_orders: 0,
    total_users: 0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Товары</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_products || 0}</div>
          <p className="text-xs text-muted-foreground">Всего товаров в каталоге</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Категории</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_categories || 0}</div>
          <p className="text-xs text-muted-foreground">Всего категорий товаров</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Заказы</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_orders || 0}</div>
          <p className="text-xs text-muted-foreground">Всего заказов в системе</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_users || 0}</div>
          <p className="text-xs text-muted-foreground">Зарегистрированных пользователей</p>
        </CardContent>
      </Card>
    </div>
  )
}

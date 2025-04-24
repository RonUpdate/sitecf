"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "@/components/ui/chart"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"

export function AdminStatsCards() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalColoringPages: 0,
    recentProducts: [],
    recentColoringPages: [],
    categoryDistribution: [],
    salesByMonth: [],
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      const supabase = getSupabaseClient()

      try {
        // Fetch product count
        const { count: productsCount, error: productsError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        if (productsError) throw productsError

        // Fetch category count
        const { count: categoriesCount, error: categoriesError } = await supabase
          .from("categories")
          .select("*", { count: "exact", head: true })

        if (categoriesError) throw categoriesError

        // Fetch coloring pages count
        const { count: coloringPagesCount, error: coloringPagesError } = await supabase
          .from("coloring_pages")
          .select("*", { count: "exact", head: true })

        if (coloringPagesError) throw coloringPagesError

        // Fetch category distribution
        const { data: categoryData, error: categoryDistError } = await supabase.from("categories").select("id, name")

        if (categoryDistError) throw categoryDistError

        // Generate mock data for demonstration
        const mockCategoryDistribution =
          categoryData?.map((category) => ({
            name: category.name,
            value: Math.floor(Math.random() * 100),
          })) || []

        const mockSalesByMonth = [
          { name: "Янв", value: Math.floor(Math.random() * 1000) },
          { name: "Фев", value: Math.floor(Math.random() * 1000) },
          { name: "Мар", value: Math.floor(Math.random() * 1000) },
          { name: "Апр", value: Math.floor(Math.random() * 1000) },
          { name: "Май", value: Math.floor(Math.random() * 1000) },
          { name: "Июн", value: Math.floor(Math.random() * 1000) },
          { name: "Июл", value: Math.floor(Math.random() * 1000) },
          { name: "Авг", value: Math.floor(Math.random() * 1000) },
          { name: "Сен", value: Math.floor(Math.random() * 1000) },
          { name: "Окт", value: Math.floor(Math.random() * 1000) },
          { name: "Ноя", value: Math.floor(Math.random() * 1000) },
          { name: "Дек", value: Math.floor(Math.random() * 1000) },
        ]

        setStats({
          totalProducts: productsCount || 0,
          totalCategories: categoriesCount || 0,
          totalColoringPages: coloringPagesCount || 0,
          recentProducts: [],
          recentColoringPages: [],
          categoryDistribution: mockCategoryDistribution,
          salesByMonth: mockSalesByMonth,
        })
      } catch (error: any) {
        console.error("Error fetching admin stats:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        <p className="font-bold">Error fetching admin stats</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего товаров</CardTitle>
            <CardDescription>Общее количество товаров в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего категорий</CardTitle>
            <CardDescription>Общее количество категорий в системе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего раскрасок</CardTitle>
            <CardDescription>Общее количество страниц раскраски</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalColoringPages}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="categories">Категории</TabsTrigger>
          <TabsTrigger value="sales">Продажи</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Обзор системы</CardTitle>
              <CardDescription>Общая статистика по всем разделам</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={[
                    { name: "Товары", value: stats.totalProducts },
                    { name: "Категории", value: stats.totalCategories },
                    { name: "Раскраски", value: stats.totalColoringPages },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Распределение по категориям</CardTitle>
              <CardDescription>Количество товаров в каждой категории</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <PieChart data={stats.categoryDistribution} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Продажи по месяцам</CardTitle>
              <CardDescription>Динамика продаж за последний год</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart data={stats.salesByMonth} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

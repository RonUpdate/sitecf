"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Layers, Package, FileImage, Download, Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"

export function UnifiedDashboardStats() {
  const [stats, setStats] = useState({
    categoryCount: 0,
    productCount: 0,
    coloringPagesCount: 0,
    totalDownloads: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get category count
        const { count: categoryCount, error: categoryError } = await supabase
          .from("categories")
          .select("*", { count: "exact", head: true })

        if (categoryError) throw categoryError

        // Get product count
        const { count: productCount, error: productError } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })

        if (productError && !productError.message.includes("does not exist")) throw productError

        // Get coloring pages count
        const { count: coloringPagesCount, error: coloringError } = await supabase
          .from("coloring_pages")
          .select("*", { count: "exact", head: true })

        if (coloringError && !coloringError.message.includes("does not exist")) throw coloringError

        // Get total downloads
        const { data: downloadData, error: downloadError } = await supabase
          .from("coloring_pages")
          .select("download_count")

        if (downloadError && !downloadError.message.includes("does not exist")) throw downloadError

        const totalDownloads = downloadData?.reduce((sum, item) => sum + (item.download_count || 0), 0) || 0

        setStats({
          categoryCount: categoryCount || 0,
          productCount: productCount || 0,
          coloringPagesCount: coloringPagesCount || 0,
          totalDownloads,
        })
      } catch (error: any) {
        console.error("Error fetching dashboard stats:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Загрузка...</CardTitle>
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        <p className="font-bold">Ошибка при загрузке статистики</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего категорий</CardTitle>
          <Layers className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.categoryCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Товары</CardTitle>
          <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.productCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Страницы раскраски</CardTitle>
          <FileImage className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.coloringPagesCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего загрузок</CardTitle>
          <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDownloads}</div>
        </CardContent>
      </Card>
    </div>
  )
}

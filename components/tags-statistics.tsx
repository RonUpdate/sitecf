"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"

type TagStatistics = {
  tag_id: string
  tag_name: string
  post_count: number
}

interface TagsStatisticsProps {
  tagsStats: TagStatistics[]
}

export function TagsStatistics({ tagsStats: initialTagsStats }: TagsStatisticsProps) {
  const [tagsStats, setTagsStats] = useState<TagStatistics[]>(initialTagsStats)
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseClient()

  // Цвета для графика
  const colors = [
    "#8884d8",
    "#83a6ed",
    "#8dd1e1",
    "#82ca9d",
    "#a4de6c",
    "#d0ed57",
    "#ffc658",
    "#ff8042",
    "#ff6361",
    "#bc5090",
  ]

  // Сортируем теги по количеству постов (по убыванию)
  const sortedStats = [...tagsStats].sort((a, b) => b.post_count - a.post_count)

  // Берем топ-10 тегов для отображения на графике
  const topTags = sortedStats.slice(0, 10)

  const refreshStats = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase.rpc("get_tags_usage_statistics").returns<Array<TagStatistics>>()

      if (error) throw error

      setTagsStats(data || [])
    } catch (error) {
      console.error("Error refreshing tags statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    // Подготавливаем данные для CSV
    const csvContent = [
      ["ID тега", "Название тега", "Количество постов"],
      ...sortedStats.map((tag) => [tag.tag_id, tag.tag_name, tag.post_count.toString()]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    // Создаем и скачиваем файл
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `tags-statistics-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Статистика использования тегов</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refreshStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Обновить
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Экспорт CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Топ-10 популярных тегов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topTags} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tag_name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} постов`, "Количество"]}
                    labelFormatter={(label) => `Тег: ${label}`}
                  />
                  <Bar dataKey="post_count" name="Количество постов">
                    {topTags.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Детальная статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="text-left py-2">Тег</th>
                    <th className="text-right py-2">Постов</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStats.map((tag) => (
                    <tr key={tag.tag_id} className="border-b">
                      <td className="py-2">{tag.tag_name}</td>
                      <td className="text-right py-2">{tag.post_count}</td>
                    </tr>
                  ))}
                  {sortedStats.length === 0 && (
                    <tr>
                      <td colSpan={2} className="text-center py-4 text-gray-500">
                        Нет данных о тегах
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

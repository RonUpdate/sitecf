import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export const dynamic = "force-dynamic"

export default async function RLSHistoryPage() {
  const supabase = await createServerSupabaseClient()

  // Получаем уникальные даты проверок
  const { data: checkDates, error: datesError } = await supabase
    .from("rls_check_results")
    .select("check_time")
    .order("check_time", { ascending: false })

  // Группируем проверки по дате
  const groupedDates = checkDates
    ? Array.from(
        checkDates.reduce((acc, item) => {
          const date = format(new Date(item.check_time), "yyyy-MM-dd")
          if (!acc.has(date)) {
            acc.set(date, [])
          }
          acc.get(date)?.push(item.check_time)
          return acc
        }, new Map<string, string[]>()),
      )
    : []

  // Получаем статистику по каждой дате
  const dateStats = await Promise.all(
    groupedDates.map(async ([date, times]) => {
      const latestTime = times[0]

      // Получаем результаты для последней проверки в этот день
      const { data: results, error } = await supabase.from("rls_check_results").select("*").eq("check_time", latestTime)

      // Считаем статистику
      const errorCount = results?.filter((r) => r.status === "error").length || 0
      const warningCount = results?.filter((r) => r.status === "warning").length || 0
      const okCount = results?.filter((r) => r.status === "ok" || r.status === "info").length || 0
      const totalCount = results?.length || 0

      return {
        date,
        formattedDate: format(new Date(date), "d MMMM yyyy", { locale: ru }),
        latestTime,
        formattedTime: format(new Date(latestTime), "HH:mm:ss", { locale: ru }),
        checkCount: times.length,
        errorCount,
        warningCount,
        okCount,
        totalCount,
      }
    }),
  )

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">История проверок RLS</h1>

      <Card>
        <CardHeader>
          <CardTitle>История проверок по дням</CardTitle>
          <CardDescription>История проверок RLS с группировкой по дням</CardDescription>
        </CardHeader>
        <CardContent>
          {datesError ? (
            <p className="text-red-500">Ошибка при получении истории: {datesError.message}</p>
          ) : dateStats.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Время последней проверки</TableHead>
                  <TableHead>Проверок за день</TableHead>
                  <TableHead>Статистика</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dateStats.map((stat) => (
                  <TableRow key={stat.date}>
                    <TableCell className="font-medium">{stat.formattedDate}</TableCell>
                    <TableCell>{stat.formattedTime}</TableCell>
                    <TableCell>{stat.checkCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Badge variant="destructive" className="py-1">
                          {stat.errorCount} ошибок
                        </Badge>
                        <Badge variant="outline" className="py-1">
                          {stat.warningCount} предупр.
                        </Badge>
                        <Badge variant="secondary" className="py-1">
                          {stat.okCount} ОК
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/rls-history/${stat.date}`}>
                        <Button variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>Нет данных о проверках RLS.</p>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-between">
        <Link href="/admin/rls-monitor">
          <Button variant="outline">Назад к мониторингу</Button>
        </Link>
        <Link href="/admin/fix-rls">
          <Button variant="default">Исправить проблемы RLS</Button>
        </Link>
      </div>
    </div>
  )
}

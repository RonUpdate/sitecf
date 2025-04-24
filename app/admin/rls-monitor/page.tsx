import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { RLSCheckScheduler } from "@/components/rls-check-scheduler"
import { RLSCheckRunner } from "@/components/rls-check-runner"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

export const dynamic = "force-dynamic"

export default async function RLSMonitorPage() {
  const supabase = await createServerSupabaseClient()

  // Получаем последние результаты проверки RLS
  const { data: results, error } = await supabase.rpc("get_latest_rls_check_results")

  // Получаем историю проверок
  const { data: checkHistory, error: historyError } = await supabase
    .from("rls_check_results")
    .select("check_time")
    .order("check_time", { ascending: false })
    .limit(10)

  // Группируем проверки по дате
  const checkDates = checkHistory
    ? Array.from(new Set(checkHistory.map((item) => format(new Date(item.check_time), "yyyy-MM-dd"))))
    : []

  // Считаем количество проблем
  const errorCount = results?.filter((r) => r.status === "error").length || 0
  const warningCount = results?.filter((r) => r.status === "warning").length || 0
  const infoCount = results?.filter((r) => r.status === "info").length || 0

  // Форматируем дату последней проверки
  const lastCheckTime =
    results && results.length > 0
      ? format(new Date(results[0].check_time), "d MMMM yyyy, HH:mm:ss", { locale: ru })
      : "Нет данных"

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Мониторинг настроек RLS</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Последняя проверка</CardTitle>
            <CardDescription>Время последней проверки RLS</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{lastCheckTime}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Статус проверки</CardTitle>
            <CardDescription>Сводка по результатам проверки</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Badge variant="destructive" className="text-lg py-1 px-3">
                {errorCount} ошибок
              </Badge>
              <Badge variant="outline" className="text-lg py-1 px-3">
                {warningCount} предупреждений
              </Badge>
              <Badge variant="secondary" className="text-lg py-1 px-3">
                {infoCount} информационных
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Запуск проверки</CardTitle>
            <CardDescription>Запустить проверку вручную</CardDescription>
          </CardHeader>
          <CardContent>
            <RLSCheckRunner />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Результаты проверки RLS</CardTitle>
            <CardDescription>Таблицы с потенциальными проблемами RLS выделены цветом</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500">Ошибка при получении результатов: {error.message}</p>
            ) : results && results.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Таблица</TableHead>
                    <TableHead>RLS</TableHead>
                    <TableHead>Политики</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow
                      key={result.tablename}
                      className={
                        result.status === "error" ? "bg-red-50" : result.status === "warning" ? "bg-yellow-50" : ""
                      }
                    >
                      <TableCell className="font-medium">{result.tablename}</TableCell>
                      <TableCell>
                        <Badge variant={result.has_rls ? "default" : "outline"}>
                          {result.has_rls ? "Включен" : "Отключен"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {result.has_policies ? (
                          <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">
                            {result.policies_count} политик
                          </Badge>
                        ) : (
                          <Badge variant={result.has_rls ? "destructive" : "outline"}>Нет политик</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            result.status === "error"
                              ? "destructive"
                              : result.status === "warning"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {result.status === "error"
                            ? "Ошибка"
                            : result.status === "warning"
                              ? "Предупреждение"
                              : result.status === "info"
                                ? "Информация"
                                : "ОК"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/fix-rls?table=${result.tablename}`}>
                          <Button variant="outline" size="sm">
                            Исправить
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Нет данных о проверках RLS. Запустите проверку, нажав кнопку "Запустить проверку".</p>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/admin/fix-rls">
              <Button variant="default">Перейти к исправлению RLS</Button>
            </Link>
            <Link href="/admin/rls-history">
              <Button variant="outline">История проверок</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Настройка расписания проверок</CardTitle>
            <CardDescription>Настройте регулярные проверки RLS</CardDescription>
          </CardHeader>
          <CardContent>
            <RLSCheckScheduler />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

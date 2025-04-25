import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import logger from "@/lib/logger"

export default async function CheckRlsPage() {
  const supabase = await createServerSupabaseClient()

  // Получаем список всех таблиц с информацией о RLS
  const { data: tables, error: tablesError } = await supabase
    .from("pg_tables")
    .select("tablename, rowsecurity")
    .eq("schemaname", "public")

  if (tablesError) {
    logger.error("Ошибка при получении списка таблиц", { error: tablesError.message })
  }

  // Получаем список всех политик RLS
  const { data: policies, error: policiesError } = await supabase.from("pg_policies").select("*")

  if (policiesError) {
    logger.error("Ошибка при получении списка политик RLS", { error: policiesError.message })
  }

  // Создаем словарь таблиц с политиками
  const tablesPolicies: Record<string, any[]> = {}

  if (policies) {
    policies.forEach((policy: any) => {
      if (!tablesPolicies[policy.tablename]) {
        tablesPolicies[policy.tablename] = []
      }
      tablesPolicies[policy.tablename].push(policy)
    })
  }

  // Находим таблицы с включенным RLS, но без политик
  const tablesWithIssues =
    tables?.filter(
      (table) =>
        table.rowsecurity && (!tablesPolicies[table.tablename] || tablesPolicies[table.tablename].length === 0),
    ) || []

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Проверка настроек RLS</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Таблицы с проблемами RLS</CardTitle>
            <CardDescription>Таблицы с включенным RLS, но без определенных политик доступа</CardDescription>
          </CardHeader>
          <CardContent>
            {tablesError ? (
              <p className="text-red-500">Ошибка при получении списка таблиц: {tablesError.message}</p>
            ) : tablesWithIssues.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Таблица</TableHead>
                    <TableHead>RLS</TableHead>
                    <TableHead>Политики</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tablesWithIssues.map((table) => (
                    <TableRow key={table.tablename}>
                      <TableCell className="font-medium">{table.tablename}</TableCell>
                      <TableCell>
                        <span className={table.rowsecurity ? "text-green-500" : "text-gray-500"}>
                          {table.rowsecurity ? "Включено" : "Отключено"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-500">Нет политик</span>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/fix-rls?table=${table.tablename}`}>
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
              <p className="text-green-500">Все таблицы с включенным RLS имеют определенные политики доступа.</p>
            )}
          </CardContent>
          <CardFooter>
            <Link href="/admin/fix-rls">
              <Button variant="default">Перейти к исправлению RLS</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Все таблицы</CardTitle>
            <CardDescription>Информация о настройках RLS для всех таблиц</CardDescription>
          </CardHeader>
          <CardContent>
            {tablesError ? (
              <p className="text-red-500">Ошибка при получении списка таблиц: {tablesError.message}</p>
            ) : tables && tables.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Таблица</TableHead>
                    <TableHead>RLS</TableHead>
                    <TableHead>Политики</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.tablename}>
                      <TableCell className="font-medium">{table.tablename}</TableCell>
                      <TableCell>
                        <span className={table.rowsecurity ? "text-green-500" : "text-gray-500"}>
                          {table.rowsecurity ? "Включено" : "Отключено"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {tablesPolicies[table.tablename] && tablesPolicies[table.tablename].length > 0 ? (
                          <span className="text-green-500">{tablesPolicies[table.tablename].length} политик</span>
                        ) : (
                          <span className={table.rowsecurity ? "text-red-500" : "text-gray-500"}>
                            {table.rowsecurity ? "Нет политик (проблема)" : "Нет политик"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Нет доступных таблиц.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

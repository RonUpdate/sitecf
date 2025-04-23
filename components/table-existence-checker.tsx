"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export function TableExistenceChecker() {
  const [loading, setLoading] = useState(true)
  const [tables, setTables] = useState<Record<string, boolean>>({
    categories: false,
    coloring_pages: false,
    admin_users: false,
  })
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function checkTables() {
      try {
        setLoading(true)
        setError(null)

        const tableResults: Record<string, boolean> = {
          categories: false,
          coloring_pages: false,
          admin_users: false,
        }

        // Проверяем каждую таблицу отдельно
        for (const tableName of Object.keys(tableResults)) {
          try {
            // Пытаемся выполнить запрос к таблице
            const { count } = await supabase.from(tableName).select("*", { count: "exact", head: true })

            // Если запрос выполнен успешно, таблица существует
            tableResults[tableName] = true
          } catch (err) {
            // Ошибка означает, что таблица не существует или есть другая проблема
            // Оставляем значение false
          }
        }

        setTables(tableResults)
      } catch (err: any) {
        console.error("Error checking tables:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkTables()
  }, [supabase])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Ошибка при проверке таблиц: {error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Статус таблиц в базе данных</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {Object.entries(tables).map(([tableName, exists]) => (
            <li key={tableName} className="flex items-center">
              {exists ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <span className="font-mono">{tableName}</span>
              <span className="ml-2">
                {exists ? (
                  <span className="text-green-600">Существует</span>
                ) : (
                  <span className="text-red-600">Не существует</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

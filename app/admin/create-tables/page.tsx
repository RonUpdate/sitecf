"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase-client"
import Link from "next/link"
import { Loader2 } from "lucide-react"
// Удаляем импорт generateMetadata или Metadata, если они есть

export default function CreateTablesPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const supabase = getSupabaseClient()

  const createTables = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    setLog(["Начало создания таблиц..."])

    try {
      // Создаем таблицу categories, если она не существует
      setLog((prev) => [...prev, "Создание таблицы categories..."])
      const { error: categoriesError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            image_url TEXT,
            slug TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (categoriesError) {
        // Если функция exec_sql не существует, попробуем выполнить SQL напрямую
        if (categoriesError.message.includes("exec_sql")) {
          setLog((prev) => [...prev, "Функция exec_sql не найдена, пропускаем создание таблиц..."])
          setLog((prev) => [...prev, "⚠️ Для создания таблиц необходимо выполнить SQL-запросы вручную"])
          throw new Error("Функция exec_sql не найдена. Пожалуйста, выполните SQL-запросы вручную.")
        } else {
          throw new Error(`Ошибка при создании таблицы categories: ${categoriesError.message}`)
        }
      }
      setLog((prev) => [...prev, "✅ Таблица categories создана или уже существует"])

      // Создаем таблицу coloring_pages, если она не существует
      setLog((prev) => [...prev, "Создание таблицы coloring_pages..."])
      const { error: coloringPagesError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS coloring_pages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL DEFAULT 0,
            image_url TEXT,
            thumbnail_url TEXT,
            category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
            slug TEXT UNIQUE NOT NULL,
            difficulty_level TEXT DEFAULT 'medium',
            age_group TEXT DEFAULT 'all',
            is_featured BOOLEAN DEFAULT false,
            download_count INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (coloringPagesError) {
        throw new Error(`Ошибка при создании таблицы coloring_pages: ${coloringPagesError.message}`)
      }
      setLog((prev) => [...prev, "✅ Таблица coloring_pages создана или уже существует"])

      // Создаем таблицу admin_users, если она не существует
      setLog((prev) => [...prev, "Создание таблицы admin_users..."])
      const { error: adminUsersError } = await supabase.rpc("exec_sql", {
        sql_query: `
          CREATE TABLE IF NOT EXISTS admin_users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      })

      if (adminUsersError) {
        throw new Error(`Ошибка при создании таблицы admin_users: ${adminUsersError.message}`)
      }
      setLog((prev) => [...prev, "✅ Таблица admin_users создана или уже существует"])

      // Добавляем администратора
      setLog((prev) => [...prev, "Добавление администратора..."])
      const { error: adminError } = await supabase.rpc("exec_sql", {
        sql_query: `
          INSERT INTO admin_users (email)
          VALUES ('admin@example.com')
          ON CONFLICT (email) DO NOTHING;
        `,
      })

      if (adminError) {
        throw new Error(`Ошибка при добавлении администратора: ${adminError.message}`)
      }
      setLog((prev) => [...prev, "✅ Администратор добавлен или уже существует"])

      setSuccess(true)
      setLog((prev) => [...prev, "🎉 Все таблицы успешно созданы!"])
    } catch (err: any) {
      console.error("Error creating tables:", err)
      setError(err.message)
      setLog((prev) => [...prev, `❌ Ошибка: ${err.message}`])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Создание таблиц</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Инициализация базы данных</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Эта страница поможет создать необходимые таблицы в базе данных, если они еще не существуют.
          </p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>Таблицы успешно созданы!</AlertDescription>
            </Alert>
          )}

          <Button onClick={createTables} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Создание таблиц..." : "Создать таблицы"}
          </Button>
        </CardContent>
      </Card>

      {log.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Лог выполнения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md font-mono text-sm max-h-80 overflow-y-auto">
              {log.map((line, index) => (
                <div key={index} className="mb-1">
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 flex gap-4">
        <Link href="/admin">
          <Button variant="outline">Вернуться в админ-панель</Button>
        </Link>
        {success && (
          <Link href="/admin/coloring-pages">
            <Button>Перейти к страницам раскраски</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

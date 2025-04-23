import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

export default async function CheckColoringPagesPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Проверяем существование таблицы coloring_pages
  const { data: tableExists, error: tableError } = await supabase
    .rpc("check_table_exists", {
      table_name: "coloring_pages",
    })
    .single()

  // Если таблица существует, проверяем наличие записей
  let coloringPages = null
  let coloringPagesError = null
  let coloringPagesCount = 0

  if (tableExists) {
    const { data, error, count } = await supabase.from("coloring_pages").select("*", { count: "exact" }).limit(5)

    coloringPages = data
    coloringPagesError = error
    coloringPagesCount = count || 0
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Проверка таблицы страниц раскраски</h1>

      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Таблица coloring_pages</h2>
          {tableError ? (
            <p className="text-red-600">❌ Ошибка при проверке таблицы: {tableError.message}</p>
          ) : tableExists ? (
            <p className="text-green-600">✅ Таблица существует</p>
          ) : (
            <p className="text-red-600">❌ Таблица не существует</p>
          )}
        </div>

        {tableExists && (
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-2">Записи в coloring_pages</h2>
            {coloringPagesError ? (
              <p className="text-red-600">❌ Ошибка при получении записей: {coloringPagesError.message}</p>
            ) : coloringPages && coloringPages.length > 0 ? (
              <div>
                <p className="text-green-600 mb-2">✅ Найдено {coloringPagesCount} записей (показаны первые 5)</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border">
                    <thead>
                      <tr>
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Название</th>
                        <th className="border p-2">Slug</th>
                        <th className="border p-2">Категория</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coloringPages.map((page) => (
                        <tr key={page.id}>
                          <td className="border p-2">{page.id}</td>
                          <td className="border p-2">{page.title}</td>
                          <td className="border p-2">{page.slug}</td>
                          <td className="border p-2">{page.category_id || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-yellow-600">⚠️ Записи не найдены</p>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <Link href="/admin">
            <Button>Вернуться в админ-панель</Button>
          </Link>
          <Link href="/admin/coloring-pages">
            <Button variant="outline">Перейти к страницам раскраски</Button>
          </Link>
          {!tableExists && (
            <Link href="/admin/create-tables">
              <Button variant="outline">Создать таблицы</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

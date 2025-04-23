import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Database } from "@/types/supabase"

export const dynamic = "force-dynamic"

export default async function CheckDbPage() {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Проверяем существование таблицы admin_users
  const { data: tableExists, error: tableError } = await supabase
    .rpc("check_table_exists", {
      table_name: "admin_users",
    })
    .single()

  // Проверяем сессию
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Если таблица существует, проверяем наличие записей
  let adminUsers = null
  let adminUsersError = null

  if (tableExists) {
    const { data, error } = await supabase.from("admin_users").select("*")
    adminUsers = data
    adminUsersError = error
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Проверка базы данных</h1>

      <div className="space-y-6">
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Статус сессии</h2>
          {session ? (
            <div>
              <p className="text-green-600 mb-2">✅ Пользователь авторизован</p>
              <p>Email: {session.user.email}</p>
              <p>ID: {session.user.id}</p>
            </div>
          ) : (
            <p className="text-red-600">❌ Пользователь не авторизован</p>
          )}
        </div>

        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Таблица admin_users</h2>
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
            <h2 className="text-xl font-bold mb-2">Записи в admin_users</h2>
            {adminUsersError ? (
              <p className="text-red-600">❌ Ошибка при получении записей: {adminUsersError.message}</p>
            ) : adminUsers && adminUsers.length > 0 ? (
              <div>
                <p className="text-green-600 mb-2">✅ Найдено {adminUsers.length} записей</p>
                <ul className="list-disc pl-5">
                  {adminUsers.map((user) => (
                    <li key={user.id}>
                      {user.email} (ID: {user.id})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-red-600">❌ Записи не найдены</p>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <Link href="/admin">
            <Button>Вернуться в админ-панель</Button>
          </Link>
          <Link href="/admin/debug">
            <Button variant="outline">Отладочные маршруты</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

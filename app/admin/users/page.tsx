import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function AdminUsersPage() {
  const supabase = createServerComponentClient({ cookies })

  // Try to fetch users safely
  let users = []
  try {
    const { data, error } = await supabase.from("users").select("*")
    if (!error) {
      users = data
    }
  } catch (error) {
    console.error("Error fetching users:", error)
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Пользователи</h1>
      </div>

      {users && users.length > 0 ? (
        <ul className="space-y-4">
          {users.map((user) => (
            <li key={user.id} className="p-4 border rounded">
              <div className="font-bold">{user.email || user.username || "Пользователь"}</div>
              <div className="text-sm text-gray-500">ID: {user.id}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет пользователей или нет доступа к таблице пользователей.</p>
      )}
    </div>
  )
}

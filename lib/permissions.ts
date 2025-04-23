import { cookies } from "next/headers"
import { forbidden, unauthorized } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { ROLE_PERMISSIONS, type UserRole } from "@/types/auth"
import type { Database } from "@/types/supabase"

// Получение роли пользователя
export async function getUserRole(): Promise<UserRole> {
  const supabase = createServerComponentClient<Database>({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    unauthorized()
  }

  // Проверяем, является ли пользователь администратором
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

  if (adminUser) {
    return "admin"
  }

  // Проверяем роль в таблице user_roles
  const { data: userRole } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single()

  return (userRole?.role as UserRole) || "user"
}

// Проверка разрешения
export async function checkPermission(permission: keyof typeof ROLE_PERMISSIONS.admin) {
  const role = await getUserRole()
  const permissions = ROLE_PERMISSIONS[role]

  if (!permissions[permission]) {
    forbidden()
  }

  return true
}

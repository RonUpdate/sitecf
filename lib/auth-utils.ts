import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Проверка аутентификации пользователя
export async function requireAuth() {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      // Вместо вызова unauthorized(), используем redirect
      redirect("/unauthorized")
    }

    return session
  } catch (error) {
    console.error("Auth error:", error)
    redirect("/unauthorized")
  }
}

// Проверка администратора
export async function requireAdmin() {
  try {
    const supabase = createServerComponentClient<Database>({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/unauthorized")
    }

    // Проверяем, является ли пользователь администратором
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    if (error || !adminUser) {
      redirect("/forbidden")
    }

    return { session, adminUser }
  } catch (error) {
    console.error("Admin check error:", error)
    redirect("/error")
  }
}

// Проверка роли пользователя
export async function requireRole(allowedRoles: string[]) {
  try {
    const session = await requireAuth()

    // Получаем роль пользователя из Supabase
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: userRole, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (error || !userRole || !allowedRoles.includes(userRole.role)) {
      redirect("/forbidden")
    }

    return { session, role: userRole.role }
  } catch (error) {
    console.error("Role check error:", error)
    redirect("/error")
  }
}

// Проверка владельца ресурса
export async function requireResourceOwner(resourceTable: string, resourceId: string) {
  try {
    const session = await requireAuth()

    const supabase = createServerComponentClient<Database>({ cookies })
    const { data: resource, error } = await supabase.from(resourceTable).select("user_id").eq("id", resourceId).single()

    if (error || !resource || resource.user_id !== session.user.id) {
      redirect("/forbidden")
    }

    return { session, resource }
  } catch (error) {
    console.error("Resource owner check error:", error)
    redirect("/error")
  }
}

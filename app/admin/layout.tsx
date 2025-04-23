import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import AdminAuthCheck from "@/components/admin-auth-check"

export const dynamic = "force_dynamic"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createServerComponentClient<Database>({ cookies })

  // Проверяем сессию
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Если нет сессии, вернем компонент, который выполнит клиентское перенаправление
  if (!session) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen"></div>
        <div className="flex-1 p-6 lg:p-8">
          <AdminAuthCheck isAuthenticated={false} />
        </div>
      </div>
    )
  }

  // Проверяем, является ли пользователь администратором
  const { data: adminUser, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", session.user.email)
    .single()

  // Если пользователь не админ, вернем компонент, который выполнит клиентское перенаправление
  if (error || !adminUser) {
    return (
      <div className="flex min-h-screen">
        <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 dark:border-gray-800 h-screen"></div>
        <div className="flex-1 p-6 lg:p-8">
          <AdminAuthCheck isAuthenticated={true} isAdmin={false} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8">{children}</div>
    </div>
  )
}

import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { NavigationProgress } from "@/components/navigation-progress"
import { PageTransition } from "@/components/page-transition"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = cookies()

  try {
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

    // Проверяем сессию
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Если нет сессии, перенаправляем на страницу входа
    if (!session) {
      redirect("/login")
    }

    // Проверяем, является ли пользователь администратором
    const { data: adminUser, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", session.user.email)
      .single()

    // Если пользователь не админ, перенаправляем на страницу с ошибкой доступа
    if (error || !adminUser) {
      redirect("/forbidden")
    }

    return (
      <div className="flex min-h-screen">
        <NavigationProgress />
        <AdminSidebar />
        <div className="flex-1 p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in admin layout:", error)
    redirect("/login?error=session")
  }
}

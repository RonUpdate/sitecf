import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { NavigationProgress } from "@/components/navigation-progress"
import { PageTransition } from "@/components/page-transition"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { SessionRefreshProvider } from "@/providers/session-refresh-provider"
import { AutoSessionRefresh } from "@/components/auto-session-refresh"
import { SessionExpiryNotification } from "@/components/session-expiry-notification"
import { AuthRedirect } from "@/components/auth-redirect"
import logger from "@/lib/logger"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

  // Проверяем сессию
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    logger.auth.error("Session error in admin layout", { error: sessionError })
    // Вместо редиректа возвращаем компонент с клиентским редиректом
    return <AuthRedirect to="/error?message=session_error" reason="Session error" />
  }

  // Если нет сессии, возвращаем компонент с клиентским редиректом
  if (!session) {
    logger.auth.warn("No session in admin layout", { path: "/admin" })
    return <AuthRedirect to="/login" reason="No session" />
  }

  // Проверяем, является ли пользователь администратором
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", session.user.email)
    .single()

  // Если произошла ошибка при проверке или пользователь не админ
  if (adminError || !adminUser) {
    logger.auth.warn("Not an admin user", {
      email: session.user.email,
      error: adminError ? adminError.message : "User not found",
    })
    return <AuthRedirect to="/forbidden?reason=not_admin" reason="Not admin" />
  }

  // Если все проверки пройдены, отображаем админ-панель
  return (
    <SessionRefreshProvider>
      <div className="flex min-h-screen">
        <NavigationProgress />
        <AdminSidebar />
        <div className="flex-1 p-6 lg:p-8">
          <PageTransition>{children}</PageTransition>
        </div>
        <AutoSessionRefresh />
        <SessionExpiryNotification />
      </div>
    </SessionRefreshProvider>
  )
}

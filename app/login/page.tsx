import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"
import { ServerLoginForm } from "@/components/server-login-form"
import logger from "@/lib/logger"
import { AuthRedirect } from "@/components/auth-redirect"

export const dynamic = "force-dynamic"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore })

  // Получаем сессию пользователя
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Логируем информацию о сессии
  logger.auth.info("Login page accessed", {
    hasSession: !!session,
    searchParams,
  })

  // Если пользователь уже авторизован, перенаправляем на админ-панель
  // Используем клиентский редирект вместо серверного
  if (session) {
    return <AuthRedirect to="/admin" reason="Already authenticated" />
  }

  // Получаем параметр from из URL
  const from = typeof searchParams.from === "string" ? searchParams.from : "/admin"

  // Если пользователь не авторизован, отображаем форму входа
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Вход в систему
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ServerLoginForm from={from} />
        </div>
      </div>
    </div>
  )
}

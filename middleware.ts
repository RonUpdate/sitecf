import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Получаем текущий путь
  const path = req.nextUrl.pathname

  // Проверяем, относится ли путь к админке
  const isLoginPath = path === "/login"
  const isErrorPath = path === "/unauthorized" || path === "/forbidden" || path === "/error"

  // Если это путь ошибки, пропускаем проверку
  if (isErrorPath) {
    return res
  }

  // Получаем сессию пользователя
  const { data } = await supabase.auth.getUser()
  const hasSession = !!data.user

  // Если уже авторизованы и пытаемся получить доступ к странице входа
  if (isLoginPath && hasSession) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return res
}

export const config = {
  matcher: ["/login", "/unauthorized", "/forbidden", "/error"],
}

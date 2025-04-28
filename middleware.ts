import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Получаем текущий путь
  const path = req.nextUrl.pathname

  // Проверяем, относится ли путь к админке
  const isAdminPath = path.startsWith("/admin")
  const isLoginPath = path === "/login"
  const isErrorPath = path === "/unauthorized" || path === "/forbidden" || path === "/error"

  // Если это путь ошибки, пропускаем проверку
  if (isErrorPath) {
    return res
  }

  try {
    // Получаем сессию пользователя
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Если пытаемся получить доступ к админке без сессии
    if (isAdminPath && !session) {
      const redirectUrl = new URL("/login", req.url)
      redirectUrl.searchParams.set("from", path)
      return NextResponse.redirect(redirectUrl)
    }

    // Если уже авторизованы и пытаемся получить доступ к странице входа
    if (isLoginPath && session) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
  } catch (error) {
    console.error("Middleware error:", error)
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/unauthorized", "/forbidden", "/error"],
}

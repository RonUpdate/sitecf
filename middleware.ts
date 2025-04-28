import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
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

    // Получаем сессию пользователя
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Middleware session error:", sessionError)
      // Redirect to error page if there's a session error
      if (isAdminPath) {
        return NextResponse.redirect(new URL("/error?message=session_error", req.url))
      }
      return res
    }

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
    // For admin paths, redirect to error page on exception
    if (req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/error?message=middleware_error", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/unauthorized", "/forbidden", "/error"],
}

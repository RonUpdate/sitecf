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
    // Получаем сессию пользователя с таймаутом
    const sessionPromise = supabase.auth.getSession()

    // Добавляем таймаут для предотвращения зависания
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Session check timed out")), 3000)
    })

    const {
      data: { session },
    } = (await Promise.race([sessionPromise, timeoutPromise.then(() => ({ data: { session: null } }))])) as {
      data: { session: any }
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

    // В случае ошибки, пропускаем запрос, чтобы избежать зацикливания
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/error", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/unauthorized", "/forbidden", "/error"],
}

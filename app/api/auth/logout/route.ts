import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/types/supabase"
import logger from "@/lib/logger"

// Обработка POST запросов (для программного вызова)
export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Выход из системы
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.auth.error("Ошибка при выходе из системы", { error: error.message })
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    logger.auth.info("Пользователь успешно вышел из системы")

    // Возвращаем JSON с информацией об успешном выходе
    return NextResponse.json({
      success: true,
      message: "Успешный выход из системы",
      redirectTo: "/",
    })
  } catch (error: any) {
    logger.auth.error("Непредвиденная ошибка при выходе из системы", { error: error.message })
    return NextResponse.json({ success: false, error: "Произошла ошибка при выходе из системы" }, { status: 500 })
  }
}

// Обработка GET запросов (для прямого доступа через браузер)
export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Выход из системы
    await supabase.auth.signOut()

    // Для GET запросов перенаправляем на главную страницу
    return NextResponse.redirect(new URL("/", request.url))
  } catch (error: any) {
    logger.auth.error("Ошибка при выходе из системы через GET", { error: error.message })
    // В случае ошибки все равно перенаправляем на главную
    return NextResponse.redirect(new URL("/", request.url))
  }
}

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"
import { isAdmin } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized", message: "Вы должны войти в систему" }, { status: 401 })
    }

    // Проверяем, является ли пользователь администратором
    const isUserAdmin = await isAdmin(session.user.email)
    if (!isUserAdmin) {
      return NextResponse.json({ error: "Forbidden", message: "Требуются права администратора" }, { status: 403 })
    }

    // Получаем параметры запроса
    const { apiKey } = await req.json()

    // Если указан API-ключ, проверяем его (для внешних вызовов)
    const expectedApiKey = process.env.RLS_CHECK_API_KEY
    if (expectedApiKey && apiKey !== expectedApiKey) {
      logger.security.warn("Неверный API-ключ при попытке запуска проверки RLS", {
        user: session.user.email,
        ip: req.headers.get("x-forwarded-for") || "unknown",
      })
      return NextResponse.json({ error: "Forbidden", message: "Неверный API-ключ" }, { status: 403 })
    }

    // Запускаем проверку RLS
    const { data, error } = await supabase.rpc("check_all_tables_rls")

    if (error) {
      logger.error("Ошибка при запуске проверки RLS", { error: error.message })
      return NextResponse.json({ error: "Database Error", message: error.message }, { status: 500 })
    }

    // Логируем успешное выполнение
    logger.info("Проверка RLS успешно выполнена", {
      user: session.user.email,
      tablesChecked: data?.length || 0,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Проверка RLS успешно выполнена",
      results: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error("Непредвиденная ошибка при проверке RLS", {
      error: error instanceof Error ? error.message : String(error),
    })
    return NextResponse.json({ error: "Server Error", message: "Произошла непредвиденная ошибка" }, { status: 500 })
  }
}

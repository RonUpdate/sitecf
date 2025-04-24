import { type NextRequest, NextResponse } from "next/server"
import logger from "@/lib/logger"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { LogLevel } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    // Проверяем авторизацию
    const supabase = createServerComponentClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Проверяем, является ли пользователь администратором
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

    if (!adminUser) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    // Получаем параметры запроса
    const searchParams = request.nextUrl.searchParams
    const format = searchParams.get("format") as "json" | "csv"
    const type = searchParams.get("type") as LogLevel | "all"

    if (!format || (format !== "json" && format !== "csv")) {
      return new NextResponse("Invalid format parameter", { status: 400 })
    }

    // Экспортируем логи в нужном формате
    let data: string
    let contentType: string

    if (format === "json") {
      data = logger.export.toJSON(type === "all" ? undefined : (type as LogLevel))
      contentType = "application/json"
    } else {
      data = logger.export.toCSV(type === "all" ? undefined : (type as LogLevel))
      contentType = "text/csv"
    }

    // Возвращаем результат
    return new NextResponse(data, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename=auth-logs-${type}-${new Date().toISOString().split("T")[0]}.${format}`,
      },
    })
  } catch (error) {
    console.error("Error exporting logs:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

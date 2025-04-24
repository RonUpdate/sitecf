import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { isAdmin } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // Проверяем, авторизован ли пользователь
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Проверяем, является ли пользователь администратором
    const isUserAdmin = await isAdmin(session.user.id)

    if (!isUserAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Создаем SQL-запрос для получения статистики использования тегов
    const { data, error } = await supabase.rpc("get_tags_usage_statistics")

    if (error) {
      console.error("Error fetching tags statistics:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Error in tags statistics API:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

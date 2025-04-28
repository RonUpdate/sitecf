import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { checkPermission } from "@/lib/permissions"
import type { Database } from "@/types/supabase"

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    // Проверяем разрешение на создание категории
    await checkPermission("canCreateCategory")

    const supabase = createRouteHandlerClient<Database>({ cookies })
    const body = await request.json()

    const { data, error } = await supabase.from("categories").insert(body).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    // Ошибки unauthorized() и forbidden() будут автоматически обработаны
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

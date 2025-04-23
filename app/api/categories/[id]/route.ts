import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { checkPermission } from "@/lib/permissions"
import type { Database } from "@/types/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient<Database>({ cookies })

  const { data, error } = await supabase.from("categories").select("*").eq("id", params.id).single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: "Категория не найдена" }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Проверяем разрешение на редактирование категории
    await checkPermission("canEditCategory")

    const supabase = createRouteHandlerClient<Database>({ cookies })
    const body = await request.json()

    const { data, error } = await supabase.from("categories").update(body).eq("id", params.id).select().single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    // Ошибки unauthorized() и forbidden() будут автоматически обработаны
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Проверяем разрешение на удаление категории
    await checkPermission("canDeleteCategory")

    const supabase = createRouteHandlerClient<Database>({ cookies })

    const { error } = await supabase.from("categories").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    // Ошибки unauthorized() и forbidden() будут автоматически обработаны
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

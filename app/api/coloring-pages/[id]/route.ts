import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Получаем данные страницы раскраски
    const { data: coloringPage, error } = await supabase.from("coloring_pages").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching coloring page:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!coloringPage) {
      return NextResponse.json({ error: "Страница не найдена" }, { status: 404 })
    }

    return NextResponse.json(coloringPage)
  } catch (error: any) {
    console.error("Error in GET coloring page:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Проверяем сессию
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase.from("coloring_pages").update(body).eq("id", params.id).select().single()

    if (error) {
      console.error("Error updating coloring page:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in PUT coloring page:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Проверяем сессию
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("coloring_pages").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting coloring page:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error in DELETE coloring page:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { checkPermission } from "@/lib/permissions"
import type { Database } from "@/types/supabase"

export async function POST(request: NextRequest) {
  console.log("POST /api/products called") // Add this line
  try {
    // Проверяем разрешение на создание товара
    await checkPermission("canCreateProduct")

    const supabase = createRouteHandlerClient<Database>({ cookies })
    const body = await request.json()
    console.log("Received body:", body) // Add this line

    const { data, error } = await supabase.from("products").insert(body).select().single()

    if (error) {
      console.error("Supabase error:", error) // Add this line
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("Product created successfully:", data) // Add this line
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error in POST /api/products:", error) // Add this line
    // Ошибки unauthorized() и forbidden() будут автоматически обработаны
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

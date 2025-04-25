import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      throw error
    }

    // Convert array to object with key-value pairs
    const settings = data.reduce(
      (acc, item) => {
        acc[item.key] = item.value
        return acc
      },
      {} as Record<string, string>,
    )

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { key, value } = await request.json()

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { error } = await supabase.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, key, value })
  } catch (error) {
    console.error("Error updating setting:", error)
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
  }
}

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // First check if the user is authenticated and is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Use service role for admin operations to bypass RLS
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

    // First check if the user is authenticated and is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if the setting already exists
    const { data: existingSetting } = await supabase.from("site_settings").select("*").eq("key", key).single()

    let result

    if (existingSetting) {
      // Update existing setting
      result = await supabase
        .from("site_settings")
        .update({ value, updated_at: new Date().toISOString() })
        .eq("key", key)
    } else {
      // Insert new setting
      result = await supabase.from("site_settings").insert({ key, value, updated_at: new Date().toISOString() })
    }

    if (result.error) {
      throw result.error
    }

    return NextResponse.json({ success: true, key, value })
  } catch (error) {
    console.error("Error updating setting:", error)
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
  }
}

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import logger from "@/lib/logger"

export async function POST() {
  try {
    // Create a new supabase server client with the cookies
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.auth.error("Server logout error", { error: error.message })
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    // Clear cookies
    cookieStore.getAll().forEach((cookie) => {
      if (cookie.name.includes("supabase") || cookie.name.includes("sb-")) {
        cookieStore.delete(cookie.name)
      }
    })

    logger.auth.info("User logged out successfully via server route")
    return NextResponse.json({ success: true, message: "Logged out successfully" })
  } catch (error: any) {
    logger.auth.error("Unexpected server logout error", error)
    return NextResponse.json({ success: false, message: "An error occurred during logout" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed. Use POST instead." }, { status: 405 })
}

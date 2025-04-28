import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/types/supabase"
import logger from "@/lib/logger"

// This is a simple API route that handles logout
export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Sign out the user
    const { error } = await supabase.auth.signOut()

    if (error) {
      logger.auth.error("Logout error", { error: error.message })
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    logger.auth.info("User logged out successfully")
    return NextResponse.json({ success: true, message: "Logged out successfully" })
  } catch (error: any) {
    logger.auth.error("Unexpected logout error", { error: error.message })
    return NextResponse.json({ success: false, error: "An error occurred during logout" }, { status: 500 })
  }
}

// Handle direct access to the API route
export async function GET() {
  return new Response("This endpoint only accepts POST requests", { status: 405 })
}

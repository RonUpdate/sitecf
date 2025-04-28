import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export function createServerClient() {
  try {
    // Используем правильный способ передачи cookies в Next.js 13+
    const cookieStore = cookies()
    return createServerComponentClient<Database>({ cookies: () => cookieStore })
  } catch (error) {
    console.error("Error creating server client:", error)
    throw new Error("Failed to initialize database client")
  }
}

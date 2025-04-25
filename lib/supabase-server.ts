// Этот файл должен использоваться только в серверных компонентах!
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

export async function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Add a non-cached version for routes that need fresh data
export const createFreshServerSupabaseClient = async () => {
  try {
    const cookieStore = cookies()
    return createServerComponentClient({ cookies: () => cookieStore })
  } catch (error) {
    console.error("Error creating fresh Supabase client:", error)
    throw error
  }
}

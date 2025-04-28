import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"

export const createServerSupabaseClient = cache(async () => {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    return supabase
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    // Return a minimal client that won't throw errors
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => ({ data: null, error: null }),
            order: () => ({ data: [], error: null }),
            limit: () => ({ data: [], error: null }),
          }),
          order: () => ({ data: [], error: null }),
          limit: () => ({ data: [], error: null }),
          neq: () => ({ data: [], error: null }),
          or: () => ({ data: [], error: null }),
        }),
      }),
    } as any
  }
})

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

export const createServerClient = createServerSupabaseClient

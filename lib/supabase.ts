import { createClient } from "@supabase/supabase-js"

// For client-side usage
let supabaseClient: ReturnType<typeof createClient> | undefined = undefined

export const getSupabaseClient = () => {
  if (!supabaseClient && typeof window !== "undefined") {
    supabaseClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  }
  return supabaseClient
}

// For server-side usage
export const createServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a single supabase client for the entire client-side application
export function getSupabaseClient() {
  return createClientComponentClient<Database>()
}

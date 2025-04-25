"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

export function getSupabaseClient() {
  return createClientComponentClient<Database>()
}

export async function createClientSupabase() {
  return createClientComponentClient<Database>()
}

export async function fetchCategories() {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from("categories").select("*").order("name")
  return data || []
}

export async function fetchProducts() {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from("products")
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .order("created_at", { ascending: false })
  return data || []
}

export async function fetchColoringPages() {
  const supabase = getSupabaseClient()
  const { data } = await supabase
    .from("coloring_pages")
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .order("created_at", { ascending: false })
  return data || []
}

export async function fetchAdminStats() {
  const supabase = getSupabaseClient()
  const { data } = await supabase.from("admin_stats").select("*").single()
  return data
}

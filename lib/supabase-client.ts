"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createClientComponentClient> | null = null

export function getSupabaseClient() {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient()
  }
  return supabaseClient
}

// Helper functions for common data operations
export async function fetchCategories() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    throw error
  }

  return data
}

export async function fetchBlogPosts(limit = 10, offset = 0, filters = {}) {
  const supabase = getSupabaseClient()
  let query = supabase.from("blog_posts").select("*")

  // Apply filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query = query.eq(key, value)
    }
  })

  const { data, error } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

  if (error) {
    console.error("Error fetching blog posts:", error)
    throw error
  }

  return data
}

export async function fetchBlogCategories() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("blog_categories").select("*").order("name")

  if (error) {
    console.error("Error fetching blog categories:", error)
    throw error
  }

  return data
}

export async function fetchBlogTags() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.from("blog_tags").select("*").order("name")

  if (error) {
    console.error("Error fetching blog tags:", error)
    throw error
  }

  return data
}

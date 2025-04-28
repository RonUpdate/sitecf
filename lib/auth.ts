import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"

// Server-side function to get the session
export const getServerSession = cache(async () => {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
})

// Client-side function to get the session
export const getClientSession = async () => {
  try {
    const supabase = createClientComponentClient()
    const { data } = await supabase.auth.getSession()
    return data.session
  } catch (error) {
    console.error("Error getting client session:", error)
    return null
  }
}

// Server-side function to check if the user is authenticated
export const requireAuth = cache(async () => {
  const session = await getServerSession()
  return !!session
})

// Server-side function to get the current user
export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
})

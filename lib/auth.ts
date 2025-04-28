import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { cache } from "react"

// Server-side function to get the session
export const getServerSession = cache(async () => {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting server session:", error)
      return null
    }

    return data.session
  } catch (error) {
    console.error("Exception getting server session:", error)
    return null
  }
})

// Client-side function to get the session
export const getClientSession = async () => {
  try {
    const supabase = createClientComponentClient()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting client session:", error)
      return null
    }

    return data.session
  } catch (error) {
    console.error("Exception getting client session:", error)
    return null
  }
  \
}
)

// Server-side function to check if the user is authenticated
export const requireAuth = cache(async () => {
  try {
    const session = await getServerSession()
    return !!session
  } catch (error) {
    console.error("Error in requireAuth:", error)
    return false
  }
})

// Server-side function to get the current user
export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting current user:", error)
      return null
    }

    return data.user
  } catch (error) {
    console.error("Exception getting current user:", error)
    return null
  }
})

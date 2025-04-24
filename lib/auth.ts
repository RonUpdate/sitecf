"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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

// Client-side function to check if the user is authenticated
export const requireClientAuth = async () => {
  const session = await getClientSession()
  return !!session
}

// Client-side function to get the current user
export const getClientUser = async () => {
  try {
    const supabase = createClientComponentClient()
    const { data } = await supabase.auth.getUser()
    return data.user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

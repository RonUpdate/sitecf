"use client"

import useSWR, { type SWRConfiguration, type SWRResponse } from "swr"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Create a singleton Supabase client
const getSupabaseClient = (() => {
  let client: ReturnType<typeof createClientComponentClient<Database>> | null = null
  return () => {
    if (!client) {
      client = createClientComponentClient<Database>()
    }
    return client
  }
})()

// Custom fetcher that handles authentication
const fetcher = async (url: string) => {
  try {
    const supabase = getSupabaseClient()

    // Check if session exists before making authenticated requests
    const { data: sessionData } = await supabase.auth.getSession()

    if (!sessionData.session) {
      // Return empty data instead of throwing if no session
      console.warn("No auth session found, returning empty data")
      return { data: null, error: null }
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important for cookies
    })

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error in fetcher:", error)
    throw error
  }
}

// Custom SWR hook with authentication handling
export function useAuthenticatedSWR<T>(url: string | null, config?: SWRConfiguration): SWRResponse<T, Error> {
  return useSWR<T, Error>(url, fetcher, {
    onError: (error) => {
      console.error("SWR error:", error)
    },
    ...config,
  })
}

// Direct Supabase query hook with SWR
export function useSupabaseQuery<T>(
  queryFn: (supabase: ReturnType<typeof getSupabaseClient>) => Promise<{ data: T | null; error: any }>,
  key: string | Array<any>,
  config?: SWRConfiguration,
) {
  return useSWR<T, Error>(
    key,
    async () => {
      try {
        const supabase = getSupabaseClient()

        // Check if session exists
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          console.warn("No auth session found, returning empty data")
          return null as T
        }

        const { data, error } = await queryFn(supabase)

        if (error) {
          throw error
        }

        return data as T
      } catch (error) {
        console.error("Error in Supabase query:", error)
        throw error
      }
    },
    {
      onError: (error) => {
        console.error("Supabase query error:", error)
      },
      ...config,
    },
  )
}

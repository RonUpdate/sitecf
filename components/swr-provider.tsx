"use client"

import { SWRConfig } from "swr"
import type { ReactNode } from "react"

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        errorRetryCount: 3,
        dedupingInterval: 5000,
        onError: (error) => {
          console.error("Global SWR error:", error)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
}

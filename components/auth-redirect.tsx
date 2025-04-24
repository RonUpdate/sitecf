"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthRedirectProps {
  to: string
  reason?: string
}

export function AuthRedirect({ to, reason }: AuthRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    console.log(`Redirecting to ${to}${reason ? ` (Reason: ${reason})` : ""}`)
    router.replace(to)
  }, [to, reason, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Redirecting...</h2>
        <p className="text-gray-500">You are being redirected to another page.</p>
      </div>
    </div>
  )
}

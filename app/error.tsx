"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  // Check if it's a redirect error
  const isRedirectError =
    error.message === "NEXT_REDIRECT" || error.message.includes("redirect") || error.message.includes("Redirect")

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="text-lg text-gray-600 mb-8">
        {isRedirectError
          ? "There was an authentication error. Please try logging in again."
          : "An error occurred while loading the page. Please try again."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button onClick={() => router.push("/")} variant="outline">
          Return to home
        </Button>
        {isRedirectError && (
          <Button onClick={() => router.push("/login")} variant="secondary">
            Go to login
          </Button>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationProgress() {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Reset navigation state when component mounts
  useEffect(() => {
    setIsNavigating(false)
  }, [])

  // Track navigation changes
  useEffect(() => {
    // When path or search params change, briefly show loading state
    setIsNavigating(true)

    // Clear loading state after a short delay
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (!isNavigating) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
      <div className="h-full bg-primary w-1/3 animate-[progress_1s_ease-in-out_infinite]"></div>
    </div>
  )
}

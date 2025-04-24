"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Reset state when the component mounts
    setIsNavigating(false)
    setProgress(0)

    // Clean up any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    // Start progress when navigation begins
    setIsNavigating(true)
    setProgress(20)

    const id1 = setTimeout(() => setProgress(60), 100)
    const id2 = setTimeout(() => {
      setProgress(100)
      const id3 = setTimeout(() => {
        setIsNavigating(false)
        setProgress(0)
      }, 200)
      setTimeoutId(id3)
    }, 300)

    setTimeoutId(id2)

    return () => {
      clearTimeout(id1)
      clearTimeout(id2)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [pathname, searchParams])

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 h-1 bg-primary z-50 transition-all duration-300 ease-in-out",
        isNavigating ? "opacity-100" : "opacity-0",
      )}
      style={{ width: `${progress}%` }}
    />
  )
}

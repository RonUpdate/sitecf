"use client"

import { useEffect, useState, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)
  const timeoutRef = useRef<{
    progress1?: NodeJS.Timeout
    progress2?: NodeJS.Timeout
    reset?: NodeJS.Timeout
  }>({})

  // Track previous path to avoid unnecessary animations
  const prevPathRef = useRef<string>("")
  const currentPath = pathname + searchParams.toString()

  useEffect(() => {
    // Clean up function to clear all timeouts
    return () => {
      if (timeoutRef.current.progress1) clearTimeout(timeoutRef.current.progress1)
      if (timeoutRef.current.progress2) clearTimeout(timeoutRef.current.progress2)
      if (timeoutRef.current.reset) clearTimeout(timeoutRef.current.reset)
    }
  }, [])

  useEffect(() => {
    // Skip animation on initial render
    if (prevPathRef.current === "") {
      prevPathRef.current = currentPath
      return
    }

    // Skip if path hasn't changed
    if (prevPathRef.current === currentPath) {
      return
    }

    // Update previous path
    prevPathRef.current = currentPath

    // Clear any existing timeouts
    if (timeoutRef.current.progress1) clearTimeout(timeoutRef.current.progress1)
    if (timeoutRef.current.progress2) clearTimeout(timeoutRef.current.progress2)
    if (timeoutRef.current.reset) clearTimeout(timeoutRef.current.reset)

    // Start progress animation
    setIsNavigating(true)
    setProgress(20)

    timeoutRef.current.progress1 = setTimeout(() => {
      setProgress(60)
    }, 100)

    timeoutRef.current.progress2 = setTimeout(() => {
      setProgress(100)

      timeoutRef.current.reset = setTimeout(() => {
        setIsNavigating(false)
        setProgress(0)
      }, 200)
    }, 300)
  }, [pathname, searchParams, currentPath])

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

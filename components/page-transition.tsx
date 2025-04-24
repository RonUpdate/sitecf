"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)

  useEffect(() => {
    // When the pathname changes, start the transition
    setIsTransitioning(true)

    // After a short delay, update the displayed children
    const timer = setTimeout(() => {
      setDisplayChildren(children)
      setIsTransitioning(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return (
    <div className={cn("transition-opacity duration-200 ease-in-out", isTransitioning ? "opacity-0" : "opacity-100")}>
      {displayChildren}
    </div>
  )
}

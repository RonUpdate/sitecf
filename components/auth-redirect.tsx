"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import logger from "@/lib/logger"

interface AuthRedirectProps {
  to: string
  reason?: string
}

export function AuthRedirect({ to, reason = "Unauthorized" }: AuthRedirectProps) {
  const router = useRouter()

  useEffect(() => {
    logger.auth.info(`Client-side redirect to ${to}`, { reason })
    router.replace(to)
  }, [to, router, reason])

  // Возвращаем пустой div вместо null, чтобы избежать проблем с рендерингом
  return <div className="hidden"></div>
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AdminAuthCheckProps {
  isAuthenticated: boolean
  isAdmin?: boolean
}

export default function AdminAuthCheck({ isAuthenticated, isAdmin = true }: AdminAuthCheckProps) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    } else if (!isAdmin) {
      router.push("/forbidden")
    }
  }, [isAuthenticated, isAdmin, router])

  // Показываем загрузку пока происходит перенаправление
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
        <p className="text-lg">Проверка прав доступа...</p>
      </div>
    </div>
  )
}

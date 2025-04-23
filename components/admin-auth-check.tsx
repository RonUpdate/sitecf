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
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Проверка прав доступа...</p>
    </div>
  )
}

"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useSessionRefresh } from "@/hooks/use-session-refresh"

// Создаем контекст для обновления сессии
type SessionRefreshContextType = ReturnType<typeof useSessionRefresh>

const SessionRefreshContext = createContext<SessionRefreshContextType | null>(null)

// Провайдер для обновления сессии
export function SessionRefreshProvider({ children }: { children: ReactNode }) {
  const sessionRefresh = useSessionRefresh()

  return <SessionRefreshContext.Provider value={sessionRefresh}>{children}</SessionRefreshContext.Provider>
}

// Хук для использования контекста обновления сессии
export function useSessionRefreshContext() {
  const context = useContext(SessionRefreshContext)

  if (!context) {
    throw new Error("useSessionRefreshContext должен использоваться внутри SessionRefreshProvider")
  }

  return context
}

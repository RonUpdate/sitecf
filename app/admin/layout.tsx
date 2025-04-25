import type React from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { NavigationProgress } from "@/components/navigation-progress"
import { AutoSessionRefresh } from "@/components/auto-session-refresh"
import { SessionExpiryNotification } from "@/components/session-expiry-notification"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <NavigationProgress />
        <main className="flex-1">
          <AutoSessionRefresh />
          <SessionExpiryNotification />
          {children}
        </main>
      </div>
    </div>
  )
}

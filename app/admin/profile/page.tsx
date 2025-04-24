import { SessionManager } from "@/components/session-manager"
import { SessionStatus } from "@/components/session-status"

export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Профиль администратора</h1>
        <p className="text-muted-foreground mt-2">Управление вашим профилем и настройками сессии</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SessionStatus />
        <SessionManager />
      </div>
    </div>
  )
}

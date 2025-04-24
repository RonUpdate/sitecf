import { SessionInfo } from "@/components/session-info"
import { SessionManager } from "@/components/session-manager"

export default function AdminProfilePage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Профиль администратора</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <SessionInfo />
          <SessionManager />
        </div>
        <div>{/* Здесь можно добавить другие компоненты профиля */}</div>
      </div>
    </div>
  )
}

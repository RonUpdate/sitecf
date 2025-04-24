import { redirect } from "next/navigation"

// Простая страница перенаправления для случая, если кто-то попытается открыть /api/auth/logout напрямую
export default function LogoutPage() {
  redirect("/")
}

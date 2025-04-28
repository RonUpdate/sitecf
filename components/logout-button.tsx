"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Ошибка выхода:", error.message)
        alert("Ошибка выхода: " + error.message)
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (e) {
      console.error("Ошибка при выходе:", e)
      alert("Произошла ошибка при выходе из системы")
    }
  }

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
      Выйти из админки
    </button>
  )
}

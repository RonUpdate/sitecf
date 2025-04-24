"use server"

import logger from "@/lib/logger"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function clearLogs() {
  // Проверяем авторизацию
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Проверяем, является ли пользователь администратором
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", session.user.email).single()

  if (!adminUser) {
    redirect("/unauthorized")
  }

  // Очищаем логи
  logger.clearLogs()
}

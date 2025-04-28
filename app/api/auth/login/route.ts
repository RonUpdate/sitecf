import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.json()
  const email = formData.email
  const password = formData.password
  const rememberMe = formData.rememberMe || false
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Устанавливаем срок действия сессии в зависимости от выбора "Запомнить меня"
  const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 // 30 дней или 1 час

  // Выполняем вход с указанием срока действия сессии
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: {
      expiresIn,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  // Проверяем права администратора
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .single()

  if (adminError || !adminUser) {
    // Если пользователь не админ, выходим из системы
    await supabase.auth.signOut()
    return NextResponse.json({ error: "У вас нет прав администратора" }, { status: 403 })
  }

  return NextResponse.json(
    {
      success: true,
      redirectUrl: requestUrl.origin + "/admin",
      sessionDuration: expiresIn,
    },
    { status: 200 },
  )
}

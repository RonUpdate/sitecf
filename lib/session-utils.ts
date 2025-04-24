import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Функция для проверки, является ли сессия долгосрочной
export async function isLongSession() {
  const supabase = createClientComponentClient()
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    const expiresAt = new Date(data.session.expires_at * 1000)
    const now = new Date()
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    return expiresAt > oneDayLater
  }

  return false
}

// Функция для получения времени истечения сессии
export async function getSessionExpiry() {
  const supabase = createClientComponentClient()
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    return new Date(data.session.expires_at * 1000)
  }

  return null
}

// Функция для обновления сессии
export async function refreshSession(rememberMe = false) {
  const supabase = createClientComponentClient()

  // Устанавливаем срок действия сессии в зависимости от выбора "Запомнить меня"
  const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 // 30 дней или 1 час

  const { data, error } = await supabase.auth.refreshSession({
    options: {
      expiresIn,
    },
  })

  return { data, error }
}

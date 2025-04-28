"use client"

import { useEffect, useState, useRef } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

// Время в миллисекундах до истечения сессии, когда нужно начать обновление
// По умолчанию: 5 минут (300000 мс)
const REFRESH_THRESHOLD = 5 * 60 * 1000

// Минимальный интервал между проверками состояния сессии
// По умолчанию: 1 минута (60000 мс)
const CHECK_INTERVAL = 60 * 1000

export function useSessionRefresh() {
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLongSession, setIsLongSession] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Функция для получения текущей сессии и времени её истечения
  const checkSession = async () => {
    try {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        const expiresAt = new Date(data.session.expires_at * 1000)
        setSessionExpiry(expiresAt)

        // Проверяем, является ли сессия долгосрочной (больше 24 часов)
        const now = new Date()
        const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000)
        setIsLongSession(expiresAt > oneDayLater)

        return expiresAt
      } else {
        setSessionExpiry(null)
        return null
      }
    } catch (err) {
      console.error("Ошибка при проверке сессии:", err)
      setError("Не удалось проверить состояние сессии")
      return null
    }
  }

  // Функция для обновления сессии
  const refreshSession = async () => {
    if (isRefreshing) return

    try {
      setIsRefreshing(true)
      setError(null)

      // Получаем информацию о текущих настройках "Запомнить меня"
      const rememberMe = localStorage.getItem("rememberMe") === "true"

      // Устанавливаем срок действия сессии в зависимости от настройки
      const expiresIn = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 // 30 дней или 1 час

      const { data, error } = await supabase.auth.refreshSession({
        options: {
          expiresIn,
        },
      })

      if (error) throw error

      if (data.session) {
        const newExpiresAt = new Date(data.session.expires_at * 1000)
        setSessionExpiry(newExpiresAt)
        console.log("Сессия успешно обновлена до", newExpiresAt.toLocaleString())

        // Обновляем состояние маршрутизатора для применения изменений
        router.refresh()

        return true
      }
    } catch (err) {
      console.error("Ошибка при обновлении сессии:", err)
      setError("Не удалось обновить сессию")
      return false
    } finally {
      setIsRefreshing(false)
    }
  }

  // Функция для настройки таймера обновления сессии
  const setupRefreshTimer = (expiryDate: Date) => {
    // Очищаем предыдущий таймер, если он существует
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    const now = new Date()
    const timeUntilExpiry = expiryDate.getTime() - now.getTime()

    // Если до истечения сессии осталось меньше порогового значения, обновляем сейчас
    if (timeUntilExpiry <= REFRESH_THRESHOLD) {
      refreshSession()
      return
    }

    // Иначе устанавливаем таймер на обновление за REFRESH_THRESHOLD до истечения
    const timeUntilRefresh = timeUntilExpiry - REFRESH_THRESHOLD
    console.log(`Сессия будет обновлена через ${Math.round(timeUntilRefresh / 60000)} минут`)

    timerRef.current = setTimeout(() => {
      refreshSession()
    }, timeUntilRefresh)
  }

  // Эффект для инициализации проверки сессии и настройки таймера
  useEffect(() => {
    const initSession = async () => {
      const expiryDate = await checkSession()
      if (expiryDate) {
        setupRefreshTimer(expiryDate)
      }
    }

    initSession()

    // Настраиваем интервал для периодической проверки состояния сессии
    const intervalId = setInterval(async () => {
      const expiryDate = await checkSession()
      if (expiryDate) {
        setupRefreshTimer(expiryDate)
      }
    }, CHECK_INTERVAL)

    // Обработчик события фокуса окна для проверки сессии при возвращении на вкладку
    const handleFocus = () => {
      checkSession().then((expiryDate) => {
        if (expiryDate) {
          setupRefreshTimer(expiryDate)
        }
      })
    }

    window.addEventListener("focus", handleFocus)

    // Очистка при размонтировании
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      clearInterval(intervalId)
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  return {
    sessionExpiry,
    isRefreshing,
    error,
    isLongSession,
    refreshSession,
    checkSession,
  }
}

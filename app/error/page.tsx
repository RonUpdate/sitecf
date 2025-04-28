import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import logger from "@/lib/logger"

export const dynamic = "force-dynamic"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const source = (searchParams.source as string) || "unknown"
  const path = (searchParams.path as string) || ""
  const message = (searchParams.message as string) || "Произошла неизвестная ошибка"

  // Логируем ошибку
  logger.error(`Error page accessed`, { source, path, message, searchParams })

  // Получаем информацию о сессии для отображения
  let sessionInfo = "Нет активной сессии"
  let userId = null

  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      userId = session.user.id
      sessionInfo = `Активная сессия: ${session.user.email}`

      // Логируем дополнительную информацию о пользователе
      logger.auth.event("User with active session accessed error page", {
        userId: session.user.id,
        email: session.user.email,
        source,
        path,
      })
    }
  } catch (error) {
    logger.error("Failed to get session info for error page", { error })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Ошибка</CardTitle>
          <CardDescription>Произошла ошибка при обработке вашего запроса</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              <p>
                <strong>Сообщение:</strong> {message}
              </p>
              <p>
                <strong>Источник:</strong> {source}
              </p>
              {path && (
                <p>
                  <strong>Путь:</strong> {path}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">{sessionInfo}</p>
              {userId && <p className="text-xs text-gray-500">ID пользователя: {userId}</p>}
            </div>
          </div>

          <div className="text-sm">
            <p>Технические детали этой ошибки были записаны в журнал для анализа.</p>
            <p className="mt-2">Вы можете попробовать следующие действия:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Обновить страницу</li>
              <li>Очистить кэш и куки браузера</li>
              <li>Выйти из системы и войти снова</li>
              <li>Вернуться на главную страницу</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">На главную</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Войти снова</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

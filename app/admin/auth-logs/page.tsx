import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import logger from "@/lib/logger"
import { LogExport } from "@/components/log-export"
import { LogRefresh } from "@/components/log-refresh"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { clearLogs } from "./actions"

export const dynamic = "force-dynamic"

export default async function AuthLogsPage() {
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

  // Получаем логи
  const allLogs = logger.getLogs()
  const debugLogs = logger.getLogs("debug")
  const infoLogs = logger.getLogs("info")
  const warnLogs = logger.getLogs("warn")
  const errorLogs = logger.getLogs("error")

  // Функция для форматирования времени
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Логи аутентификации</h1>
        <div className="flex gap-2">
          <LogRefresh />
          <form action={clearLogs}>
            <Button type="submit" variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Очистить логи
            </Button>
          </form>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Все логи ({allLogs.length})</TabsTrigger>
          <TabsTrigger value="debug">Debug ({debugLogs.length})</TabsTrigger>
          <TabsTrigger value="info">Info ({infoLogs.length})</TabsTrigger>
          <TabsTrigger value="warn">Warnings ({warnLogs.length})</TabsTrigger>
          <TabsTrigger value="error">Errors ({errorLogs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Все логи</h2>
            <LogExport logType="all" count={allLogs.length} />
          </div>
          <LogsList logs={allLogs} formatTime={formatTime} />
        </TabsContent>

        <TabsContent value="debug">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Отладочные логи</h2>
            <LogExport logType="debug" count={debugLogs.length} />
          </div>
          <LogsList logs={debugLogs} formatTime={formatTime} />
        </TabsContent>

        <TabsContent value="info">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Информационные логи</h2>
            <LogExport logType="info" count={infoLogs.length} />
          </div>
          <LogsList logs={infoLogs} formatTime={formatTime} />
        </TabsContent>

        <TabsContent value="warn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Предупреждения</h2>
            <LogExport logType="warn" count={warnLogs.length} />
          </div>
          <LogsList logs={warnLogs} formatTime={formatTime} />
        </TabsContent>

        <TabsContent value="error">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Ошибки</h2>
            <LogExport logType="error" count={errorLogs.length} />
          </div>
          <LogsList logs={errorLogs} formatTime={formatTime} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LogsList({ logs, formatTime }) {
  if (logs.length === 0) {
    return <p className="text-muted-foreground py-4">Нет логов для отображения</p>
  }

  return (
    <div className="space-y-4">
      {logs.map((log, index) => (
        <Card key={index} className={getCardClassByLevel(log.level)}>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex justify-between">
              <span>{formatTime(log.timestamp)}</span>
              <span className="uppercase">{log.level}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="font-mono text-sm">{log.message}</p>
            {log.context && (
              <pre className="mt-2 bg-muted p-2 rounded text-xs overflow-auto">
                {JSON.stringify(log.context, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getCardClassByLevel(level) {
  switch (level) {
    case "error":
      return "border-red-500 bg-red-50 dark:bg-red-950/20"
    case "warn":
      return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
    case "info":
      return "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
    case "debug":
      return "border-gray-500 bg-gray-50 dark:bg-gray-950/20"
    default:
      return ""
  }
}

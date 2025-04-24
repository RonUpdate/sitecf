"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function RLSCheckScheduler() {
  const [activeTab, setActiveTab] = useState("vercel")
  const [vercelProjectId, setVercelProjectId] = useState("")
  const [vercelToken, setVercelToken] = useState("")
  const [cronExpression, setCronExpression] = useState("0 0 * * *") // Ежедневно в полночь
  const [isLoading, setIsLoading] = useState(false)
  const [notifyOnError, setNotifyOnError] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState("")
  const { toast } = useToast()

  const handleSaveVercelCron = async () => {
    setIsLoading(true)
    try {
      // Здесь был бы код для настройки Vercel Cron Job через API
      // В реальном приложении это требует интеграции с Vercel API

      toast({
        title: "Настройка сохранена",
        description: "Инструкции по настройке Vercel Cron Job отправлены на вашу почту",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при сохранении настроек",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveCustomCron = async () => {
    setIsLoading(true)
    try {
      // Здесь был бы код для сохранения настроек пользовательского cron

      toast({
        title: "Настройка сохранена",
        description: "Инструкции по настройке внешнего cron-сервиса отправлены на вашу почту",
      })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при сохранении настроек",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Информация</AlertTitle>
        <AlertDescription>
          Для работы регулярных проверок необходимо настроить внешний сервис, который будет вызывать API-маршрут
          проверки RLS по расписанию.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="vercel" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vercel">Vercel Cron Jobs</TabsTrigger>
          <TabsTrigger value="custom">Внешний cron-сервис</TabsTrigger>
        </TabsList>

        <TabsContent value="vercel">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vercel-project-id">ID проекта Vercel</Label>
                  <Input
                    id="vercel-project-id"
                    value={vercelProjectId}
                    onChange={(e) => setVercelProjectId(e.target.value)}
                    placeholder="prj_xxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vercel-token">Токен Vercel</Label>
                  <Input
                    id="vercel-token"
                    type="password"
                    value={vercelToken}
                    onChange={(e) => setVercelToken(e.target.value)}
                    placeholder="Токен с правами на управление cron-задачами"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cron-expression">Расписание (Cron-выражение)</Label>
                  <Select value={cronExpression} onValueChange={setCronExpression}>
                    <SelectTrigger id="cron-expression">
                      <SelectValue placeholder="Выберите расписание" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0 0 * * *">Ежедневно в полночь</SelectItem>
                      <SelectItem value="0 0 * * 1">Еженедельно (понедельник)</SelectItem>
                      <SelectItem value="0 0 1 * *">Ежемесячно (1-е число)</SelectItem>
                      <SelectItem value="0 */6 * * *">Каждые 6 часов</SelectItem>
                      <SelectItem value="0 9 * * 1-5">По будням в 9:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="notify-on-error" checked={notifyOnError} onCheckedChange={setNotifyOnError} />
                  <Label htmlFor="notify-on-error">Уведомлять об ошибках</Label>
                </div>

                {notifyOnError && (
                  <div className="space-y-2">
                    <Label htmlFor="notify-email">Email для уведомлений</Label>
                    <Input
                      id="notify-email"
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>
                )}

                <Button
                  onClick={handleSaveVercelCron}
                  disabled={isLoading || !vercelProjectId || !vercelToken}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Сохранить настройки"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Важно</AlertTitle>
                  <AlertDescription>
                    Для настройки внешнего cron-сервиса вам потребуется API-ключ и URL для вызова.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>URL для вызова</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      readOnly
                      value={`${process.env.NEXT_PUBLIC_APP_URL || "https://your-app.com"}/api/admin/rls-check`}
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${process.env.NEXT_PUBLIC_APP_URL || "https://your-app.com"}/api/admin/rls-check`,
                        )
                        toast({ title: "Скопировано", description: "URL скопирован в буфер обмена" })
                      }}
                    >
                      Копировать
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API-ключ</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="api-key" type="password" readOnly value="••••••••••••••••••••••••••••••" />
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast({ title: "Генерация ключа", description: "Новый API-ключ будет отправлен на вашу почту" })
                      }}
                    >
                      Сгенерировать
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-cron">Рекомендуемое cron-выражение</Label>
                  <Input
                    id="custom-cron"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    placeholder="0 0 * * *"
                  />
                  <p className="text-sm text-gray-500">Используйте это выражение при настройке вашего cron-сервиса</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="notify-on-error-custom" checked={notifyOnError} onCheckedChange={setNotifyOnError} />
                  <Label htmlFor="notify-on-error-custom">Уведомлять об ошибках</Label>
                </div>

                {notifyOnError && (
                  <div className="space-y-2">
                    <Label htmlFor="notify-email-custom">Email для уведомлений</Label>
                    <Input
                      id="notify-email-custom"
                      type="email"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="admin@example.com"
                    />
                  </div>
                )}

                <Button onClick={handleSaveCustomCron} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    "Сохранить настройки"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

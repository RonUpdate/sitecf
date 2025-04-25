import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { RLSCheckScheduler } from "@/components/rls-check-scheduler"
import { RLSCheckRunner } from "@/components/rls-check-runner"

export const dynamic = "force-dynamic"

export default function RlsMonitorPage() {
  // Код страницы...
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Мониторинг настроек RLS</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Последняя проверка</CardTitle>
            <CardDescription>Время последней проверки RLS</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">Нет данных</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Статус проверки</CardTitle>
            <CardDescription>Сводка по результатам проверки</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Badge variant="destructive" className="text-lg py-1 px-3">
                0 ошибок
              </Badge>
              <Badge variant="outline" className="text-lg py-1 px-3">
                0 предупреждений
              </Badge>
              <Badge variant="secondary" className="text-lg py-1 px-3">
                0 информационных
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Запуск проверки</CardTitle>
            <CardDescription>Запустить проверку вручную</CardDescription>
          </CardHeader>
          <CardContent>
            <RLSCheckRunner />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Результаты проверки RLS</CardTitle>
            <CardDescription>Таблицы с потенциальными проблемами RLS выделены цветом</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Нет данных о проверках RLS. Запустите проверку, нажав кнопку "Запустить проверку".</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/admin/fix-rls">
              <Button variant="default">Перейти к исправлению RLS</Button>
            </Link>
            <Link href="/admin/rls-history">
              <Button variant="outline">История проверок</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Настройка расписания проверок</CardTitle>
            <CardDescription>Настройте регулярные проверки RLS</CardDescription>
          </CardHeader>
          <CardContent>
            <RLSCheckScheduler />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

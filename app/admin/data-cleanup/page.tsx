import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { deleteTestProducts } from "./actions"

export default async function DataCleanupPage() {
  const supabase = await createServerSupabaseClient()

  // Получаем количество продуктов
  const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Очистка тестовых данных</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Продукты</CardTitle>
            <CardDescription>Управление тестовыми продуктами в базе данных</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Текущее количество продуктов в базе данных: <strong>{productCount}</strong>
            </p>
            <p className="text-yellow-600 dark:text-yellow-400">
              Внимание: Удаление тестовых продуктов - необратимая операция. Все продукты будут удалены из базы данных.
            </p>
          </CardContent>
          <CardFooter>
            <form action={deleteTestProducts}>
              <Button type="submit" variant="destructive">
                Удалить все продукты
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

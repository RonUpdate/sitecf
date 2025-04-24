import { deleteTestProducts } from "./actions"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DataCleanupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Очистка данных</h1>
      </div>

      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Внимание!</AlertTitle>
        <AlertDescription>
          Действия на этой странице необратимы и могут привести к потере данных. Используйте с осторожностью.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Удаление всех товаров</CardTitle>
            <CardDescription>
              Удаляет все товары из базы данных. Это действие необратимо и удалит все данные о товарах.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Используйте эту функцию для очистки тестовых данных или перед импортом новых товаров.
            </p>
          </CardContent>
          <CardFooter>
            <form action={deleteTestProducts}>
              <Button type="submit" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить все товары
              </Button>
            </form>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Удаление всех раскрасок</CardTitle>
            <CardDescription>Удаляет все страницы раскрасок из базы данных. Это действие необратимо.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Используйте эту функцию для очистки тестовых данных или перед импортом новых страниц раскрасок.
            </p>
          </CardContent>
          <CardFooter>
            <form action={deleteTestProducts}>
              <Button type="submit" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить все раскраски
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Инструкции по использованию</h2>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Перед удалением данных убедитесь, что у вас есть резервная копия, если это необходимо.</li>
          <li>Удаление всех товаров также удалит связанные с ними данные, такие как отзывы и рейтинги.</li>
          <li>После удаления данных обновите страницу, чтобы увидеть изменения.</li>
          <li>Если вы хотите удалить только определенные товары, используйте страницу управления товарами.</li>
        </ol>
      </div>
    </div>
  )
}

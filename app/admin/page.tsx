import { AdminStatsCards } from "@/components/admin-stats-cards"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, Package, Plus, Tag } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Панель управления</h1>
      </div>

      <AdminStatsCards />

      <h2 className="text-xl font-bold mt-8">Быстрые действия</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Добавить товар</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Создать новый товар в каталоге</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/products/new" className="w-full">
              <Button className="w-full">
                <Package className="mr-2 h-4 w-4" />
                Создать товар
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Добавить категорию</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Создать новую категорию товаров</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/categories/new" className="w-full">
              <Button className="w-full">
                <Tag className="mr-2 h-4 w-4" />
                Создать категорию
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Добавить раскраску</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Загрузить новую страницу раскраски</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/coloring-pages/new" className="w-full">
              <Button className="w-full">
                <ImageIcon className="mr-2 h-4 w-4" />
                Создать раскраску
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Управление блогом</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">Создать и редактировать записи блога</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/blog" className="w-full">
              <Button className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Перейти в блог
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, ImageIcon, ListTodo, Package, Plus, ShoppingCart, Tag, Trash2 } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function AdminDashboard() {
  const supabase = await createServerSupabaseClient()

  // Fetch counts for dashboard - handle potential errors properly
  let productsCount = 0
  let categoriesCount = 0
  let coloringPagesCount = 0

  // Get category count
  const categoryResult = await supabase.from("categories").select("*", { count: "exact", head: true })
  if (!categoryResult.error) {
    categoriesCount = categoryResult.count || 0
  }

  // Get product count - handle case where table might not exist
  const productResult = await supabase.from("products").select("*", { count: "exact", head: true })
  if (!productResult.error) {
    productsCount = productResult.count || 0
  }

  // Get coloring pages count - handle case where table might not exist
  const coloringResult = await supabase.from("coloring_pages").select("*", { count: "exact", head: true })
  if (!coloringResult.error) {
    coloringPagesCount = coloringResult.count || 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Панель управления</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товары</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
            <p className="text-xs text-muted-foreground">Всего товаров в системе</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/products" className="w-full">
              <Button variant="outline" className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Управление товарами
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Категории</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoriesCount}</div>
            <p className="text-xs text-muted-foreground">Всего категорий в системе</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/categories" className="w-full">
              <Button variant="outline" className="w-full">
                <ListTodo className="mr-2 h-4 w-4" />
                Управление категориями
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Раскраски</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coloringPagesCount}</div>
            <p className="text-xs text-muted-foreground">Всего раскрасок в системе</p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/coloring-pages" className="w-full">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Управление раскрасками
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="quick-actions">
        <TabsList>
          <TabsTrigger value="quick-actions">Быстрые действия</TabsTrigger>
          <TabsTrigger value="recent">Недавние действия</TabsTrigger>
        </TabsList>
        <TabsContent value="quick-actions" className="space-y-4">
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
                  <Button className="w-full">Создать товар</Button>
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
                  <Button className="w-full">Создать категорию</Button>
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
                  <Button className="w-full">Создать раскраску</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium">Очистка данных</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">Удалить тестовые данные из системы</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/data-cleanup" className="w-full">
                  <Button variant="outline" className="w-full">
                    Очистить данные
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Недавние действия</CardTitle>
              <CardDescription>История последних действий в административной панели</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Управление товарами</p>
                    <p className="text-sm text-muted-foreground">Просмотр и редактирование товаров в каталоге</p>
                  </div>
                  <Link href="/admin/products">
                    <Button variant="ghost" size="sm">
                      Перейти
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Управление категориями</p>
                    <p className="text-sm text-muted-foreground">Просмотр и редактирование категорий</p>
                  </div>
                  <Link href="/admin/categories">
                    <Button variant="ghost" size="sm">
                      Перейти
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Управление раскрасками</p>
                    <p className="text-sm text-muted-foreground">Просмотр и редактирование раскрасок</p>
                  </div>
                  <Link href="/admin/coloring-pages">
                    <Button variant="ghost" size="sm">
                      Перейти
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Обзор системы</CardTitle>
            <CardDescription>Общая информация о состоянии системы и последних изменениях</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Статус системы</p>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <p className="text-sm text-muted-foreground">Работает нормально</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Последнее обновление</p>
                  <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Быстрый доступ</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/admin/products">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      Товары
                    </Button>
                  </Link>
                  <Link href="/admin/categories">
                    <Button variant="outline" className="w-full justify-start">
                      <Tag className="mr-2 h-4 w-4" />
                      Категории
                    </Button>
                  </Link>
                  <Link href="/admin/coloring-pages">
                    <Button variant="outline" className="w-full justify-start">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Раскраски
                    </Button>
                  </Link>
                  <Link href="/admin/data-cleanup">
                    <Button variant="outline" className="w-full justify-start">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Очистка
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Полезные ссылки</CardTitle>
            <CardDescription>Быстрый доступ к важным ресурсам</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Документация</h3>
                <p className="text-sm text-muted-foreground mb-4">Доступ к руководствам и справочным материалам</p>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Открыть документацию
                </Button>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Просмотр сайта</h3>
                <p className="text-sm text-muted-foreground mb-4">Перейти на главную страницу сайта</p>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Перейти на сайт
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

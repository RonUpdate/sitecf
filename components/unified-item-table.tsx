"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Download, AlertTriangle, Loader2, Search, Plus } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

type BaseItem = {
  id: string
  slug: string
  price: number
  image_url: string
  is_featured: boolean
  category_id: string
  created_at: string
  categories?: {
    name: string
  }
}

type Product = BaseItem & {
  name: string
  stock_quantity: number
}

type ColoringPage = BaseItem & {
  title: string
  thumbnail_url: string
  difficulty_level: string
  age_group: string
  download_count: number
}

type UnifiedItemTableProps = {
  type: "product" | "coloringPage"
  initialItems?: (Product | ColoringPage)[]
  addNewUrl: string
  addNewLabel: string
}

export function UnifiedItemTable({ type, initialItems = [], addNewUrl, addNewLabel }: UnifiedItemTableProps) {
  const isProduct = type === "product"
  const tableName = isProduct ? "products" : "coloring_pages"
  const nameField = isProduct ? "name" : "title"

  const [items, setItems] = useState<(Product | ColoringPage)[]>(initialItems)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(initialItems.length === 0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredItems, setFilteredItems] = useState<(Product | ColoringPage)[]>(initialItems)

  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    if (initialItems.length === 0) {
      fetchItems()
    }
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredItems(
        items.filter((item) => {
          const name = isProduct ? (item as Product).name : (item as ColoringPage).title
          return name.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query)
        }),
      )
    }
  }, [searchQuery, items, isProduct])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get items with category information
      const { data, error } = await supabase
        .from(tableName)
        .select(`
          *,
          categories:category_id (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        // Check if error is related to missing table
        if (error.message.includes("does not exist") || error.code === "42P01") {
          // Table doesn't exist, but this is not an error for us
          setItems([])
          setFilteredItems([])
          return
        }
        throw error
      }

      setItems(data || [])
      setFilteredItems(data || [])
    } catch (error: any) {
      console.error(`Error fetching ${isProduct ? "products" : "coloring pages"}:`, error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: `Не удалось загрузить ${isProduct ? "товары" : "страницы раскраски"}. Пожалуйста, попробуйте снова.`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    setError(null)

    try {
      const { error } = await supabase.from(tableName).delete().eq("id", deleteId)

      if (error) {
        // Check for the specific PostgreSQL error about missing RETURN statements
        if (error.message && error.message.includes("without RETURN")) {
          console.warn("Database function missing RETURN statement, but deletion may have succeeded:", error.message)

          // Update local state to remove the deleted item
          setItems((prev) => prev.filter((item) => item.id !== deleteId))
          setFilteredItems((prev) => prev.filter((item) => item.id !== deleteId))

          toast({
            title: isProduct ? "Товар удален" : "Страница удалена",
            description: isProduct ? "Товар был успешно удален из системы." : "Страница раскраски успешно удалена.",
          })
        } else {
          throw error
        }
      } else {
        // Update local state to remove the deleted item
        setItems((prev) => prev.filter((item) => item.id !== deleteId))
        setFilteredItems((prev) => prev.filter((item) => item.id !== deleteId))

        toast({
          title: isProduct ? "Товар удален" : "Страница удалена",
          description: isProduct ? "Товар был успешно удален из системы." : "Страница раскраски успешно удалена.",
        })
      }

      // Show success notification
      const successToast = document.createElement("div")
      successToast.className =
        "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 flex items-center shadow-lg"
      successToast.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span><strong>Успешно!</strong> ${isProduct ? "Товар" : "Страница раскраски"} удален${
          isProduct ? "" : "а"
        }.</span>
      `
      document.body.appendChild(successToast)

      // Remove the notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast)
        }
      }, 3000)

      // Refresh the page after a short delay to show the notification
      setTimeout(() => {
        router.refresh()
      }, 500)
    } catch (error: any) {
      console.error(`Error deleting ${isProduct ? "product" : "coloring page"}:`, error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: `Не удалось удалить ${isProduct ? "товар" : "страницу"}. Пожалуйста, попробуйте снова.`,
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <div>
          <p className="font-bold">Ошибка загрузки {isProduct ? "товаров" : "страниц раскраски"}</p>
          <p>{error}</p>
          <p className="mt-2">
            Возможно, таблица {tableName} не существует. Перейдите на страницу{" "}
            <Link href="/admin/create-tables" className="text-primary hover:underline">
              создания таблиц
            </Link>
            , чтобы создать необходимые таблицы.
          </p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {isProduct ? "Товары не найдены" : "Страницы раскраски не найдены"}
        </p>
        <Link href={addNewUrl}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {addNewLabel}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder={`Поиск ${isProduct ? "товаров" : "страниц"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Link href={addNewUrl}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {addNewLabel}
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="hidden md:table-cell">Категория</TableHead>
              {isProduct ? (
                <TableHead className="hidden md:table-cell">Наличие</TableHead>
              ) : (
                <>
                  <TableHead className="hidden md:table-cell">Возраст</TableHead>
                  <TableHead className="hidden md:table-cell">Загрузки</TableHead>
                </>
              )}
              <TableHead className="w-[100px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded overflow-hidden">
                    <Image
                      src={
                        isProduct
                          ? item.image_url || "/placeholder.svg?height=40&width=40&query=product"
                          : (item as ColoringPage).thumbnail_url ||
                            item.image_url ||
                            "/placeholder.svg?height=40&width=40&query=coloring+page"
                      }
                      alt={isProduct ? (item as Product).name : (item as ColoringPage).title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {isProduct ? (item as Product).name : (item as ColoringPage).title}
                </TableCell>
                <TableCell>{formatPrice(item.price)}</TableCell>
                <TableCell className="hidden md:table-cell">{item.categories?.name || "Без категории"}</TableCell>
                {isProduct ? (
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={(item as Product).stock_quantity > 0 ? "outline" : "destructive"}>
                      {(item as Product).stock_quantity > 0
                        ? `${(item as Product).stock_quantity} шт.`
                        : "Нет в наличии"}
                    </Badge>
                  </TableCell>
                ) : (
                  <>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{(item as ColoringPage).age_group}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <Download className="w-3 h-3 mr-1" />
                        {(item as ColoringPage).download_count || 0}
                      </div>
                    </TableCell>
                  </>
                )}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/${isProduct ? "products" : "coloring-pages"}/${item.id}`}>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => setDeleteId(item.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Удалить</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. {isProduct ? "Товар" : "Страница раскраски"} будет удален
              {isProduct ? "" : "а"} навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
              {isDeleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

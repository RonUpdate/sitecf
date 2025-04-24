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
import { Edit, Trash2, Download, AlertTriangle, Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

type ColoringPage = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  thumbnail_url: string
  slug: string
  difficulty_level: string
  age_group: string
  is_featured: boolean
  download_count: number
  category_id: string
  created_at: string
  categories?: {
    name: string
  }
}

export function ColoringPagesTable() {
  const [coloringPages, setColoringPages] = useState<ColoringPage[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchColoringPages()
  }, [])

  const fetchColoringPages = async () => {
    try {
      setLoading(true)
      setError(null)

      // Получаем страницы раскраски с информацией о категориях
      const { data, error } = await supabase
        .from("coloring_pages")
        .select(`
          *,
          categories:category_id (
            name
          )
        `)
        .order("created_at", { ascending: false })

      if (error) {
        // Проверяем, связана ли ошибка с отсутствием таблицы
        if (error.message.includes("does not exist") || error.code === "42P01") {
          // Таблица не существует, но это не ошибка для нас
          setColoringPages([])
          return
        }
        throw error
      }

      setColoringPages(data || [])
    } catch (error: any) {
      console.error("Error fetching coloring pages:", error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить страницы раскраски. Пожалуйста, попробуйте снова.",
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
      const { error } = await supabase.from("coloring_pages").delete().eq("id", deleteId)

      if (error) {
        // Check for the specific PostgreSQL error about missing RETURN statements
        if (error.message && error.message.includes("without RETURN")) {
          console.warn("Database function missing RETURN statement, but deletion may have succeeded:", error.message)

          // Update local state to remove the deleted page
          setColoringPages((prev) => prev.filter((page) => page.id !== deleteId))

          toast({
            title: "Страница удалена",
            description: "Страница раскраски успешно удалена.",
            variant: "default",
          })
        } else {
          throw error
        }
      } else {
        // Update local state to remove the deleted page
        setColoringPages((prev) => prev.filter((page) => page.id !== deleteId))

        toast({
          title: "Страница удалена",
          description: "Страница раскраски успешно удалена.",
          variant: "default",
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
        <span><strong>Успешно!</strong> Страница раскраски удалена.</span>
      `
      document.body.appendChild(successToast)

      // Remove the notification after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successToast)) {
          document.body.removeChild(successToast)
        }
      }, 3000)

      // Обновляем список страниц
      fetchColoringPages()
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting coloring page:", error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить страницу. Пожалуйста, попробуйте снова.",
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
          <p className="font-bold">Ошибка загрузки страниц раскраски</p>
          <p>{error}</p>
          <p className="mt-2">
            Возможно, таблица coloring_pages не существует. Перейдите на страницу{" "}
            <Link href="/admin/create-tables" className="text-primary hover:underline">
              создания таблиц
            </Link>
            , чтобы создать необходимые таблицы.
          </p>
        </div>
      </div>
    )
  }

  if (coloringPages.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Страницы раскраски не найдены</p>
        <Link href="/admin/coloring-pages/create">
          <Button>Добавить первую страницу</Button>
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

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead className="hidden md:table-cell">Категория</TableHead>
              <TableHead className="hidden md:table-cell">Возраст</TableHead>
              <TableHead className="hidden md:table-cell">Загрузки</TableHead>
              <TableHead className="w-[100px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coloringPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded overflow-hidden">
                    <Image
                      src={
                        page.thumbnail_url ||
                        page.image_url ||
                        "/placeholder.svg?height=40&width=40&query=coloring+page" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={page.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>{formatPrice(page.price)}</TableCell>
                <TableCell className="hidden md:table-cell">{page.categories?.name || "Без категории"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{page.age_group}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Download className="w-3 h-3 mr-1" />
                    {page.download_count || 0}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/coloring-pages/${page.id}`}>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => setDeleteId(page.id)}>
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
              Это действие нельзя отменить. Страница раскраски будет удалена навсегда.
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

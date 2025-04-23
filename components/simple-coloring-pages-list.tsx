"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Loader2, Edit, Trash2, AlertTriangle } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function SimpleColoringPagesList() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = getSupabaseClient()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchPages()
  }, [supabase])

  async function fetchPages() {
    try {
      setLoading(true)
      setError(null)

      // Напрямую запрашиваем данные из таблицы coloring_pages
      // Если таблица не существует, Supabase вернет ошибку
      const { data, error } = await supabase
        .from("coloring_pages")
        .select("id, title, slug")
        .order("created_at", { ascending: false })

      if (error) {
        // Проверяем, связана ли ошибка с отсутствием таблицы
        if (error.message.includes("does not exist") || error.code === "42P01") {
          // Таблица не существует, но это не ошибка для нас
          setPages([])
          return
        }

        // Другая ошибка
        throw error
      }

      setPages(data || [])
    } catch (err: any) {
      console.error("Error fetching coloring pages:", err)
      setError(err.message)
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
        throw error
      }

      toast({
        title: "Страница удалена",
        description: "Страница раскраски успешно удалена.",
      })

      // Обновляем список страниц
      fetchPages()
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500 mb-4">Ошибка: {error}</div>
          <p>
            Возможно, таблица coloring_pages не существует. Перейдите на страницу{" "}
            <Link href="/admin/create-tables" className="text-primary hover:underline">
              создания таблиц
            </Link>
            , чтобы создать необходимые таблицы.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (pages.length === 0) {
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

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Список страниц раскраски</h2>
          <ul className="space-y-2">
            {pages.map((page) => (
              <li key={page.id} className="p-3 border rounded hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <span>{page.title}</span>
                  <div className="flex gap-2">
                    <Link href={`/admin/coloring-pages/${page.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Редактировать
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(page.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

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

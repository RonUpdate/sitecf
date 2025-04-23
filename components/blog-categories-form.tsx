"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Edit, Trash2, Plus, Loader2, AlertTriangle } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import type { BlogCategory } from "@/types/blog"

export function BlogCategoriesForm() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setFetchingCategories(true)
      setError(null)

      const { data, error } = await supabase.from("blog_categories").select("*").order("name", { ascending: true })

      if (error) {
        // Проверяем, связана ли ошибка с отсутствием таблицы
        if (error.message.includes("does not exist") || error.code === "42P01") {
          // Таблица не существует, но это не ошибка для нас
          setCategories([])
          return
        }
        throw error
      }

      setCategories(data || [])
    } catch (error: any) {
      console.error("Error fetching blog categories:", error)
      setError(error.message)
    } finally {
      setFetchingCategories(false)
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "") // Trim - from end of text
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (!editingId) {
      setSlug(generateSlug(newName))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (editingId) {
        // Обновляем категорию
        const { error } = await supabase.from("blog_categories").update({ name, slug }).eq("id", editingId)

        if (error) throw error

        toast({
          title: "Категория обновлена",
          description: "Категория блога успешно обновлена.",
        })
      } else {
        // Создаем новую категорию
        const { error } = await supabase.from("blog_categories").insert({ name, slug })

        if (error) throw error

        toast({
          title: "Категория создана",
          description: "Категория блога успешно создана.",
        })
      }

      // Сбрасываем форму и обновляем список категорий
      setName("")
      setSlug("")
      setEditingId(null)
      fetchCategories()
      router.refresh()
    } catch (error: any) {
      console.error("Error saving blog category:", error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить категорию. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: BlogCategory) => {
    setName(category.name)
    setSlug(category.slug)
    setEditingId(category.id)
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.from("blog_categories").delete().eq("id", deleteId)

      if (error) throw error

      toast({
        title: "Категория удалена",
        description: "Категория блога успешно удалена.",
      })

      fetchCategories()
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting blog category:", error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить категорию. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setDeleteId(null)
    }
  }

  const handleCancel = () => {
    setName("")
    setSlug("")
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Редактировать категорию" : "Добавить категорию"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" value={name} onChange={handleNameChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                <Button type="button" variant="outline" onClick={() => setSlug(generateSlug(name))}>
                  Сгенерировать
                </Button>
              </div>
              <p className="text-xs text-gray-500">Используется в URL, например, /blog/category/your-slug</p>
            </div>

            <div className="flex justify-end gap-2">
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Отмена
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Сохранение..." : editingId ? "Обновить" : "Добавить"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Категории блога</CardTitle>
        </CardHeader>
        <CardContent>
          {fetchingCategories ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-[100px] text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(category)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Редактировать</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Удалить</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Категории не найдены</p>
              <Button onClick={() => setName("Новая категория")}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить первую категорию
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Категория блога будет удалена навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={loading}>
              {loading ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

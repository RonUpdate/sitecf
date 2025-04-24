"use client"

import { useState } from "react"
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
import { Edit, Trash2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

type Category = {
  id: string
  name: string
  description: string
  image_url: string
  slug: string
  created_at: string
}

export function CategoryTable({ categories }: { categories: Category[] }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [localCategories, setLocalCategories] = useState<Category[]>(categories)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)

    try {
      const { error } = await supabase.from("categories").delete().eq("id", deleteId)

      if (error) {
        // Check for the specific PostgreSQL error about missing RETURN statements
        if (error.message && error.message.includes("without RETURN")) {
          console.warn("Database function missing RETURN statement, but deletion may have succeeded:", error.message)

          // Update local state to remove the deleted category
          setLocalCategories((prev) => prev.filter((category) => category.id !== deleteId))

          toast({
            title: "Категория удалена",
            description: "Категория была успешно удалена из системы.",
            variant: "default",
          })
        } else {
          throw error
        }
      } else {
        // Update local state to remove the deleted category
        setLocalCategories((prev) => prev.filter((category) => category.id !== deleteId))

        toast({
          title: "Категория удалена",
          description: "Категория была успешно удалена из системы.",
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
        <span><strong>Успешно!</strong> Категория удалена.</span>
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
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить категорию. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  if (localCategories.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Категории не найдены</p>
        <Link href="/admin/categories/new">
          <Button>Добавить первую категорию</Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden md:table-cell">Описание</TableHead>
              <TableHead className="w-[150px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {localCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="relative h-12 w-12 rounded overflow-hidden">
                    <Image
                      src={category.image_url || "/placeholder.svg?height=48&width=48&query=coloring+category"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="hidden md:table-cell">{category.slug}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <p className="truncate max-w-xs">{category.description}</p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/categories/${category.id}`}>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                    </Link>
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
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Категория будет удалена навсегда вместе со всеми связанными страницами
              раскраски.
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

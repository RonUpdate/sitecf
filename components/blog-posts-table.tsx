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
import { Edit, Trash2, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import type { BlogPost } from "@/types/blog"

export function BlogPostsTable() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

      if (error) {
        // Проверяем, связана ли ошибка с отсутствием таблицы
        if (error.message.includes("does not exist") || error.code === "42P01") {
          // Таблица не существует, но это не ошибка для нас
          setPosts([])
          return
        }
        throw error
      }

      setPosts(data || [])
    } catch (error: any) {
      console.error("Error fetching blog posts:", error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить статьи блога. Пожалуйста, попробуйте снова.",
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
      const { error } = await supabase.from("blog_posts").delete().eq("id", deleteId)

      if (error) {
        throw error
      }

      toast({
        title: "Статья удалена",
        description: "Статья блога успешно удалена.",
      })

      // Обновляем список статей
      fetchPosts()
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting blog post:", error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: "Не удалось удалить статью. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const togglePublishStatus = async (post: BlogPost) => {
    try {
      const now = new Date().toISOString()
      const { error } = await supabase
        .from("blog_posts")
        .update({
          published: !post.published,
          published_at: !post.published ? now : null,
          updated_at: now,
        })
        .eq("id", post.id)

      if (error) {
        throw error
      }

      toast({
        title: post.published ? "Статья скрыта" : "Статья опубликована",
        description: post.published ? "Статья блога успешно скрыта." : "Статья блога успешно опубликована.",
      })

      // Обновляем список статей
      fetchPosts()
    } catch (error: any) {
      console.error("Error toggling publish status:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус публикации. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
          <p className="font-bold">Ошибка загрузки статей блога</p>
          <p>{error}</p>
          <p className="mt-2">
            Возможно, таблица blog_posts не существует. Пожалуйста, проверьте структуру базы данных.
          </p>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Статьи блога не найдены</p>
        <Link href="/admin/blog/new">
          <Button>Добавить первую статью</Button>
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
              <TableHead>Заголовок</TableHead>
              <TableHead className="hidden md:table-cell">Автор</TableHead>
              <TableHead className="hidden md:table-cell">Дата публикации</TableHead>
              <TableHead className="hidden md:table-cell">Статус</TableHead>
              <TableHead className="w-[150px] text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <div className="relative h-10 w-10 rounded overflow-hidden">
                    <Image
                      src={post.featured_image || "/placeholder.svg?height=40&width=40&query=blog"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="hidden md:table-cell">{post.author || "—"}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(post.published_at)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {post.published ? (
                    <Badge variant="default">Опубликовано</Badge>
                  ) : (
                    <Badge variant="outline">Черновик</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => togglePublishStatus(post)}
                      title={post.published ? "Скрыть" : "Опубликовать"}
                    >
                      {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{post.published ? "Скрыть" : "Опубликовать"}</span>
                    </Button>
                    <Link href={`/admin/blog/${post.id}`}>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => setDeleteId(post.id)}>
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
              Это действие нельзя отменить. Статья блога будет удалена навсегда.
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

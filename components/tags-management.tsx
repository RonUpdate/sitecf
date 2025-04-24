"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Tag, CheckCircle2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

type BlogTag = {
  id: string
  name: string
  slug: string
  created_at: string
}

interface TagsManagementProps {
  initialTags: BlogTag[]
}

export function TagsManagement({ initialTags }: TagsManagementProps) {
  const [tags, setTags] = useState<BlogTag[]>(initialTags)
  const [filteredTags, setFilteredTags] = useState<BlogTag[]>(initialTags)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false)
  const [currentTag, setCurrentTag] = useState<BlogTag | null>(null)
  const [tagName, setTagName] = useState("")
  const [tagSlug, setTagSlug] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = getSupabaseClient()
  const { toast } = useToast()

  // Фильтрация тегов при изменении поискового запроса
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTags(tags)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredTags(
        tags.filter((tag) => tag.name.toLowerCase().includes(query) || tag.slug.toLowerCase().includes(query)),
      )
    }
  }, [searchQuery, tags])

  // Генерация slug из названия тега
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  }

  // Открытие диалога создания/редактирования тега
  const openTagDialog = (tag?: BlogTag) => {
    if (tag) {
      setCurrentTag(tag)
      setTagName(tag.name)
      setTagSlug(tag.slug)
    } else {
      setCurrentTag(null)
      setTagName("")
      setTagSlug("")
    }
    setIsTagDialogOpen(true)
  }

  // Открытие диалога удаления тега
  const openDeleteDialog = (tag: BlogTag) => {
    setCurrentTag(tag)
    setIsDeleteDialogOpen(true)
  }

  // Обработка изменения названия тега
  const handleNameChange = (value: string) => {
    setTagName(value)
    if (!currentTag) {
      setTagSlug(generateSlug(value))
    }
  }

  // Сохранение тега
  const saveTag = async () => {
    try {
      setLoading(true)

      if (!tagName.trim()) {
        toast({
          title: "Ошибка",
          description: "Название тега не может быть пустым",
          variant: "destructive",
        })
        return
      }

      if (!tagSlug.trim()) {
        toast({
          title: "Ошибка",
          description: "Slug тега не может быть пустым",
          variant: "destructive",
        })
        return
      }

      // Проверяем уникальность slug
      const { data: existingTag, error: checkError } = await supabase
        .from("blog_tags")
        .select("id")
        .eq("slug", tagSlug)
        .maybeSingle()

      if (checkError) throw checkError

      if (existingTag && (!currentTag || existingTag.id !== currentTag.id)) {
        toast({
          title: "Ошибка",
          description: "Тег с таким slug уже существует",
          variant: "destructive",
        })
        return
      }

      if (currentTag) {
        // Обновляем существующий тег
        const { error } = await supabase
          .from("blog_tags")
          .update({ name: tagName, slug: tagSlug })
          .eq("id", currentTag.id)

        if (error) throw error

        setTags(tags.map((tag) => (tag.id === currentTag.id ? { ...tag, name: tagName, slug: tagSlug } : tag)))

        toast({
          title: "Успех",
          description: "Тег успешно обновлен",
        })
      } else {
        // Создаем новый тег
        const { data, error } = await supabase
          .from("blog_tags")
          .insert({ name: tagName, slug: tagSlug })
          .select()
          .single()

        if (error) throw error

        setTags([...tags, data])

        toast({
          title: "Успех",
          description: "Тег успешно создан",
        })
      }

      setIsTagDialogOpen(false)
    } catch (error: any) {
      console.error("Error saving tag:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить тег",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Удаление тега
  const deleteTag = async () => {
    if (!currentTag) return

    try {
      setLoading(true)

      // Сначала удаляем связи с постами
      const { error: relationError } = await supabase.from("blog_posts_tags").delete().eq("tag_id", currentTag.id)

      if (relationError) throw relationError

      // Затем удаляем сам тег
      const { error } = await supabase.from("blog_tags").delete().eq("id", currentTag.id)

      if (error) throw error

      setTags(tags.filter((tag) => tag.id !== currentTag.id))
      setSelectedTags(selectedTags.filter((id) => id !== currentTag.id))

      toast({
        title: "Успех",
        description: "Тег успешно удален",
      })

      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      console.error("Error deleting tag:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить тег",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Массовое удаление тегов
  const bulkDeleteTags = async () => {
    if (selectedTags.length === 0) return

    try {
      setLoading(true)

      // Сначала удаляем связи с постами
      const { error: relationError } = await supabase.from("blog_posts_tags").delete().in("tag_id", selectedTags)

      if (relationError) throw relationError

      // Затем удаляем сами теги
      const { error } = await supabase.from("blog_tags").delete().in("id", selectedTags)

      if (error) throw error

      setTags(tags.filter((tag) => !selectedTags.includes(tag.id)))
      setSelectedTags([])

      toast({
        title: "Успех",
        description: `Успешно удалено ${selectedTags.length} тегов`,
      })

      setIsBulkDeleteDialogOpen(false)
    } catch (error: any) {
      console.error("Error bulk deleting tags:", error)
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось удалить теги",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Обработка выбора всех тегов
  const toggleSelectAll = () => {
    if (selectedTags.length === filteredTags.length) {
      setSelectedTags([])
    } else {
      setSelectedTags(filteredTags.map((tag) => tag.id))
    }
  }

  // Обработка выбора отдельного тега
  const toggleSelectTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Управление тегами</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Поиск тегов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              <Button onClick={() => openTagDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Новый тег
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedTags.length > 0 && (
            <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-md">
              <div className="flex items-center">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                <span>Выбрано {selectedTags.length} тегов</span>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setIsBulkDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Удалить выбранные
              </Button>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedTags.length === filteredTags.length && filteredTags.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Выбрать все теги"
                    />
                  </TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Создан</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTags.length > 0 ? (
                  filteredTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={() => toggleSelectTag(tag.id)}
                          aria-label={`Выбрать тег ${tag.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-gray-500" />
                          {tag.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {tag.slug}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(tag.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openTagDialog(tag)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Редактировать</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => openDeleteDialog(tag)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Удалить</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      {searchQuery
                        ? "Теги не найдены. Попробуйте изменить поисковый запрос."
                        : "Теги не найдены. Создайте первый тег."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Диалог создания/редактирования тега */}
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentTag ? "Редактировать тег" : "Создать новый тег"}</DialogTitle>
            <DialogDescription>
              {currentTag ? "Измените информацию о теге и нажмите Сохранить." : "Заполните информацию о новом теге."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tag-name">Название</Label>
              <Input
                id="tag-name"
                value={tagName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Например: Технологии"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="tag-slug"
                  value={tagSlug}
                  onChange={(e) => setTagSlug(e.target.value)}
                  placeholder="Например: tehnologii"
                />
                <Button variant="outline" onClick={() => setTagSlug(generateSlug(tagName))} type="button">
                  Генерировать
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Используется в URL: /blog/tag/<span className="font-mono">{tagSlug || "slug"}</span>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)} disabled={loading}>
              Отмена
            </Button>
            <Button onClick={saveTag} disabled={loading}>
              {loading ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления тега */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы собираетесь удалить тег "{currentTag?.name}". Это действие нельзя отменить. Все связи этого тега с
              постами также будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteTag}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Диалог массового удаления тегов */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Массовое удаление тегов</AlertDialogTitle>
            <AlertDialogDescription>
              Вы собираетесь удалить {selectedTags.length} тегов. Это действие нельзя отменить. Все связи этих тегов с
              постами также будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={bulkDeleteTags}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Удаление..." : `Удалить ${selectedTags.length} тегов`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

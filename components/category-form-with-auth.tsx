"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCategory, updateCategory } from "@/app/admin/categories/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/types/supabase"

export function CategoryFormWithAuth({ category }: { category?: Category }) {
  const isEditing = !!category
  const [name, setName] = useState(category?.name || "")
  const [description, setDescription] = useState(category?.description || "")
  const [slug, setSlug] = useState(category?.slug || "")
  const [imageUrl, setImageUrl] = useState(category?.image_url || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("slug", slug)
    formData.append("image_url", imageUrl)

    if (isEditing) {
      formData.append("id", category.id)
      const result = await updateCategory(formData)

      if (result.error) {
        if (result.error.includes("unauthorized") || result.error.includes("forbidden")) {
          // Обработка ошибок авторизации
          router.push(result.error.includes("unauthorized") ? "/unauthorized" : "/forbidden")
          return
        }

        setError(result.error)
        setLoading(false)
        return
      }

      toast({
        title: "Категория обновлена",
        description: "Категория успешно обновлена.",
      })
    } else {
      const result = await createCategory(formData)

      if (result.error) {
        if (result.error.includes("unauthorized") || result.error.includes("forbidden")) {
          // Обработка ошибок авторизации
          router.push(result.error.includes("unauthorized") ? "/unauthorized" : "/forbidden")
          return
        }

        setError(result.error)
        setLoading(false)
        return
      }

      toast({
        title: "Категория создана",
        description: "Категория успешно создана.",
      })
    }

    router.push("/admin/categories")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL изображения</Label>
              <Input
                id="image_url"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Сохранение..." : isEditing ? "Обновить категорию" : "Создать категорию"}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

export function CategoryForm({ category = null }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const [formData, setFormData] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
  })

  const generateSlug = (text) => {
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

  const handleNameChange = (e) => {
    const name = e.target.value
    setFormData({
      ...formData,
      name,
      // Only auto-update slug if it hasn't been manually edited
      ...(slugManuallyEdited ? {} : { slug: generateSlug(name) }),
    })
  }

  const handleSlugChange = (e) => {
    setSlugManuallyEdited(true)
    setFormData({
      ...formData,
      slug: e.target.value,
    })
  }

  const regenerateSlug = () => {
    setFormData({
      ...formData,
      slug: generateSlug(formData.name),
    })
    setSlugManuallyEdited(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { name, slug, description } = formData

      if (!name || !slug) {
        toast.error("Название и URL обязательны")
        setLoading(false)
        return
      }

      // Check if slug already exists (for new categories)
      if (!category) {
        const { data: existingCategory } = await supabase.from("categories").select("slug").eq("slug", slug).single()

        if (existingCategory) {
          toast.error("Категория с таким URL уже существует")
          setLoading(false)
          return
        }
      }

      if (category) {
        // Update existing category
        const { error } = await supabase.from("categories").update({ name, slug, description }).eq("id", category.id)

        if (error) throw error
        toast.success("Категория обновлена")
      } else {
        // Create new category
        const { error } = await supabase.from("categories").insert([{ name, slug, description }])

        if (error) throw error
        toast.success("Категория создана")
      }

      router.push("/admin/categories")
      router.refresh()
    } catch (error) {
      console.error("Error saving category:", error)
      toast.error("Ошибка при сохранении категории")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Название</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Введите название категории"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="slug">URL (slug)</Label>
          <Button type="button" variant="outline" size="sm" onClick={regenerateSlug} disabled={!formData.name}>
            Сгенерировать
          </Button>
        </div>
        <Input id="slug" value={formData.slug} onChange={handleSlugChange} placeholder="url-категории" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Введите описание категории"
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/categories")}>
          Отмена
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Сохранение..." : category ? "Обновить категорию" : "Создать категорию"}
        </Button>
      </div>
    </form>
  )
}

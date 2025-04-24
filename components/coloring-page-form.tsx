"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { generateSlug } from "@/lib/transliteration"

type Category = {
  id: string
  name: string
}

type ColoringPage = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  thumbnail_url: string
  category_id: string
  slug: string
  difficulty_level: string
  age_group: string
  is_featured: boolean
  download_count: number
}

export function ColoringPageForm({ coloringPage }: { coloringPage?: ColoringPage }) {
  const isEditing = !!coloringPage
  const [title, setTitle] = useState(coloringPage?.title || "")
  const [description, setDescription] = useState(coloringPage?.description || "")
  const [price, setPrice] = useState(coloringPage?.price?.toString() || "")
  const [slug, setSlug] = useState(coloringPage?.slug || "")
  const [difficultyLevel, setDifficultyLevel] = useState(coloringPage?.difficulty_level || "medium")
  const [ageGroup, setAgeGroup] = useState(coloringPage?.age_group || "all")
  const [isFeatured, setIsFeatured] = useState(coloringPage?.is_featured || false)
  const [categoryId, setCategoryId] = useState(coloringPage?.category_id || "")
  const [imageUrl, setImageUrl] = useState(coloringPage?.image_url || "")
  const [thumbnailUrl, setThumbnailUrl] = useState(coloringPage?.thumbnail_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(coloringPage?.image_url || null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(coloringPage?.thumbnail_url || null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  // Add a state variable to track if the slug has been manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchingCategories(true)
        setError(null)

        const { data, error } = await supabase.from("categories").select("id, name").order("name", { ascending: true })

        if (error) {
          // Если таблица не существует, просто устанавливаем пустой массив
          if (error.message.includes("does not exist") || error.code === "42P01") {
            setCategories([])
            return
          }
          throw error
        }

        setCategories(data || [])
      } catch (error: any) {
        console.error("Error fetching categories:", error)
        setError("Не удалось загрузить категории: " + error.message)
      } finally {
        setFetchingCategories(false)
      }
    }

    fetchCategories()
  }, [supabase])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setThumbnailFile(file)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Remove this function:
  // const generateSlug = (text: string) => {
  //   return text
  //     .toString()
  //     .toLowerCase()
  //     .trim()
  //     .replace(/\s+/g, "-") // Replace spaces with -
  //     .replace(/[^\w-]+/g, "") // Remove all non-word chars
  //     .replace(/--+/g, "-") // Replace multiple - with single -
  // }

  // Replace the existing handleTitleChange function with this improved version
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Only auto-generate the slug if it hasn't been manually edited
    // or if we're creating a new coloring page (not editing)
    if (!slugManuallyEdited && (!isEditing || !coloringPage?.slug)) {
      setSlug(generateSlug(newTitle))
    }
  }

  // Add a new function to handle slug changes
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true)
    setSlug(e.target.value)
  }

  // Update the Generate button click handler
  const regenerateSlug = () => {
    setSlug(generateSlug(title))
    setSlugManuallyEdited(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let finalImageUrl = imageUrl
      let finalThumbnailUrl = thumbnailUrl

      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `coloring-pages/${fileName}`

        const { error: uploadError } = await supabase.storage.from("category-images").upload(filePath, imageFile)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("category-images").getPublicUrl(filePath)

        finalImageUrl = publicUrl
      }

      // Upload thumbnail if a new one was selected
      if (thumbnailFile) {
        const fileExt = thumbnailFile.name.split(".").pop()
        const fileName = `thumbnails/${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `coloring-pages/${fileName}`

        const { error: uploadError } = await supabase.storage.from("category-images").upload(filePath, thumbnailFile)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("category-images").getPublicUrl(filePath)

        finalThumbnailUrl = publicUrl
      }

      // Проверяем, существует ли таблица coloring_pages
      try {
        // Пробуем выполнить запрос к таблице
        await supabase.from("coloring_pages").select("id", { count: "exact", head: true })
      } catch (err: any) {
        // Если таблица не существует, показываем сообщение об ошибке
        if (err.message.includes("does not exist") || err.code === "42P01") {
          throw new Error(
            "Таблица coloring_pages не существует. Пожалуйста, создайте таблицы перед добавлением страниц.",
          )
        }
        throw err
      }

      const coloringPageData = {
        title,
        description,
        price: Number.parseFloat(price) || 0,
        slug,
        difficulty_level: difficultyLevel,
        age_group: ageGroup,
        is_featured: isFeatured,
        category_id: categoryId || null,
        image_url: finalImageUrl,
        thumbnail_url: finalThumbnailUrl || finalImageUrl, // Use image URL as thumbnail if no thumbnail
      }

      // Create or update the coloring page
      if (isEditing) {
        const { error } = await supabase.from("coloring_pages").update(coloringPageData).eq("id", coloringPage.id)

        if (error) throw error

        toast({
          title: "Страница обновлена",
          description: "Страница раскраски успешно обновлена.",
        })
      } else {
        const { error } = await supabase.from("coloring_pages").insert(coloringPageData)

        if (error) throw error

        toast({
          title: "Страница создана",
          description: "Страница раскраски успешно создана.",
        })
      }

      router.push("/admin/coloring-pages")
      router.refresh()
    } catch (error: any) {
      console.error("Error saving coloring page:", error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить страницу. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/admin/coloring-pages" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к страницам раскраски
      </Link>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название</Label>
                  <Input id="title" value={title} onChange={handleTitleChange} required />
                </div>

                {/* In the JSX, update the slug input and button */}
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={slug}
                      onChange={handleSlugChange}
                      required
                      placeholder="url-friendly-name"
                    />
                    <Button type="button" variant="outline" onClick={regenerateSlug}>
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Используется в URL, например, /coloring-page/your-slug</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Цена</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Уровень сложности</Label>
                  <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите уровень сложности" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Легкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="hard">Сложный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Возрастная группа</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите возрастную группу" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Дети</SelectItem>
                      <SelectItem value="adults">Взрослые</SelectItem>
                      <SelectItem value="all">Все возрасты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} disabled={fetchingCategories}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Без категории</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                  />
                  <Label htmlFor="featured">Избранная страница</Label>
                </div>
              </div>

              <div className="space-y-4">
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
                  <Label htmlFor="image">Полноразмерное изображение</Label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative h-32 w-32 rounded overflow-hidden border">
                        <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Загрузить изображение
                      </Button>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <p className="text-xs text-gray-500 mt-2">Изображение страницы раскраски высокого разрешения</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Миниатюра (опционально)</Label>
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <div className="relative h-32 w-32 rounded overflow-hidden border">
                        <Image
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("thumbnail-upload")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Загрузить миниатюру
                      </Button>
                      <Input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Меньшее изображение для предпросмотра (если отличается от основного)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Или использовать URL изображения</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">Или использовать URL миниатюры</Label>
                  <Input
                    id="thumbnail_url"
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/coloring-pages">
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : isEditing ? "Обновить страницу" : "Создать страницу"}
          </Button>
        </div>
      </form>
    </div>
  )
}

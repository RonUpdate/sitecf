"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "@/next/image"
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

type ProductBase = {
  id: string
  name?: string
  description: string
  price: number
  image_url: string | null
  category_id: string | null
  slug: string
  is_featured: boolean
}

type Product = ProductBase & {
  name: string
  stock_quantity: number
}

type ColoringPage = ProductBase & {
  title: string
  thumbnail_url: string
  difficulty_level: string
  age_group: string
  download_count: number
}

type ProductFormProps = {
  item?: Product | ColoringPage
  type: "product" | "coloringPage"
  backUrl: string
  backLabel: string
  successUrl: string
}

export function UnifiedProductForm({ item, type, backUrl, backLabel, successUrl }: ProductFormProps) {
  const isEditing = !!item
  const isProduct = type === "product"

  // Common fields
  const [name, setName] = useState(isProduct ? (item as Product)?.name || "" : (item as ColoringPage)?.title || "")
  const [description, setDescription] = useState(item?.description || "")
  const [price, setPrice] = useState(item?.price?.toString() || "")
  const [slug, setSlug] = useState(item?.slug || "")
  const [isFeatured, setIsFeatured] = useState(item?.is_featured || false)
  const [categoryId, setCategoryId] = useState(item?.category_id || "")
  const [imageUrl, setImageUrl] = useState(item?.image_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url || null)

  // Product-specific fields
  const [stockQuantity, setStockQuantity] = useState(
    isProduct ? (item as Product)?.stock_quantity?.toString() || "0" : "0",
  )

  // Coloring page-specific fields
  const [difficultyLevel, setDifficultyLevel] = useState(
    !isProduct ? (item as ColoringPage)?.difficulty_level || "medium" : "medium",
  )
  const [ageGroup, setAgeGroup] = useState(!isProduct ? (item as ColoringPage)?.age_group || "all" : "all")
  const [thumbnailUrl, setThumbnailUrl] = useState(!isProduct ? (item as ColoringPage)?.thumbnail_url || "" : "")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    !isProduct ? (item as ColoringPage)?.thumbnail_url || null : null,
  )

  // Common state
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchingCategories(true)
        setError(null)

        const { data, error } = await supabase.from("categories").select("id, name").order("name", { ascending: true })

        if (error) {
          // If table doesn't exist, just set empty array
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)

    // Only auto-generate the slug if it hasn't been manually edited
    // or if we're creating a new item (not editing)
    if (!slugManuallyEdited && (!isEditing || !item?.slug)) {
      setSlug(generateSlug(newName))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true)
    setSlug(e.target.value)
  }

  const regenerateSlug = () => {
    setSlug(generateSlug(name))
    setSlugManuallyEdited(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("handleSubmit called") // Add this line

    // Prevent multiple submissions
    if (formSubmitted || loading) {
      return
    }

    setFormSubmitted(true)
    setLoading(true)
    setError(null)

    try {
      let finalImageUrl = imageUrl
      let finalThumbnailUrl = thumbnailUrl

      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${isProduct ? "products" : "coloring-pages"}/${fileName}`

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

      // Upload thumbnail if a new one was selected (coloring pages only)
      if (!isProduct && thumbnailFile) {
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

      // Prepare data based on item type
      let itemData: any = {}

      if (isProduct) {
        itemData = {
          name,
          description,
          price: price ? Number.parseFloat(price) : 0,
          slug,
          stock_quantity: stockQuantity ? Number.parseInt(stockQuantity) : 0,
          is_featured: isFeatured,
          category_id: categoryId || null,
          image_url: finalImageUrl || null, // Ensure it's null if empty
        }
      } else {
        itemData = {
          title: name,
          description,
          price: Number.parseFloat(price) || 0,
          slug,
          difficulty_level: difficultyLevel,
          age_group: ageGroup,
          is_featured: isFeatured,
          category_id: categoryId || null,
          image_url: finalImageUrl || null, // Ensure it's null if empty
          thumbnail_url: finalThumbnailUrl || finalImageUrl || null, // Use image URL as thumbnail if no thumbnail
        }
      }

      // Create or update the item
      const tableName = isProduct ? "products" : "coloring_pages"

      if (isEditing && item) {
        const { error } = await supabase.from(tableName).update(itemData).eq("id", item.id)

        if (error) throw error

        toast({
          title: isProduct ? "Товар обновлен" : "Страница обновлена",
          description: isProduct ? "Товар был успешно обновлен." : "Страница раскраски успешно обновлена.",
        })
      } else {
        const { error } = await supabase.from(tableName).insert(itemData)

        if (error) throw error

        toast({
          title: isProduct ? "Товар создан" : "Страница создана",
          description: isProduct ? "Товар был успешно создан." : "Страница раскраски успешно создана.",
        })
      }

      // Redirect after successful submission
      console.log("Redirecting to:", successUrl) // Add this line
      router.push(successUrl)
      router.refresh()
    } catch (error: any) {
      console.error(`Error saving ${isProduct ? "product" : "coloring page"}:`, error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: `Не удалось сохранить ${isProduct ? "товар" : "страницу"}. ${error.message}`,
        variant: "destructive",
      })
      setFormSubmitted(false) // Allow resubmission after error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Сохранение...</p>
            <p className="text-sm text-muted-foreground mt-2">Пожалуйста, не закрывайте страницу</p>
          </div>
        </div>
      )}

      <Link href={backUrl} className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {backLabel}
      </Link>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{isProduct ? "Название товара" : "Название страницы"}</Label>
                  <Input id="name" value={name} onChange={handleNameChange} required />
                </div>

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
                      Сгенерировать
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Используется в URL, например, /{isProduct ? "product" : "coloring-page"}/your-slug
                  </p>
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
                  />
                </div>

                {isProduct ? (
                  <div className="space-y-2">
                    <Label htmlFor="stock">Количество на складе</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
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
                  </>
                )}

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
                  <Label htmlFor="featured">{isProduct ? "Рекомендуемый товар" : "Избранная страница"}</Label>
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
                  <Label htmlFor="image">{isProduct ? "Изображение товара" : "Полноразмерное изображение"}</Label>
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
                      <p className="text-xs text-gray-500 mt-2">
                        {isProduct
                          ? "Рекомендуемый размер: 800x800px"
                          : "Изображение страницы раскраски высокого разрешения"}
                      </p>
                    </div>
                  </div>
                </div>

                {!isProduct && (
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
                )}

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

                {!isProduct && (
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
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href={backUrl}>
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
          <Button type="submit" disabled={loading || formSubmitted}>
            {loading
              ? "Сохранение..."
              : isEditing
                ? isProduct
                  ? "Обновить товар"
                  : "Обновить страницу"
                : isProduct
                  ? "Создать товар"
                  : "Создать страницу"}
          </Button>
        </div>
      </form>
    </div>
  )
}

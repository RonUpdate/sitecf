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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"

type Category = {
  id: string
  name: string
}

type Product = {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  slug: string
  stock_quantity: number
  is_featured: boolean
}

export function ProductForm({ product }: { product?: Product }) {
  const isEditing = !!product
  const [name, setName] = useState(product?.name || "")
  const [description, setDescription] = useState(product?.description || "")
  const [price, setPrice] = useState(product?.price?.toString() || "")
  const [slug, setSlug] = useState(product?.slug || "")
  const [stockQuantity, setStockQuantity] = useState(product?.stock_quantity?.toString() || "0")
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false)
  const [categoryId, setCategoryId] = useState(product?.category_id || "")
  const [imageUrl, setImageUrl] = useState(product?.image_url || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Add a state variable to track if the slug has been manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from("categories").select("id, name").order("name", { ascending: true })

        if (error) {
          throw error
        }

        setCategories(data || [])
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast({
          title: "Error",
          description: "Failed to load categories. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setFetchingCategories(false)
      }
    }

    fetchCategories()
  }, [supabase, toast])

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

  const generateSlug = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
  }

  // Replace the existing handleNameChange function with this improved version
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)

    // Only auto-generate the slug if it hasn't been manually edited
    // or if we're creating a new product (not editing)
    if (!slugManuallyEdited && (!isEditing || !product?.slug)) {
      setSlug(generateSlug(newName))
    }
  }

  // Add a new function to handle slug changes
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true)
    setSlug(e.target.value)
  }

  // Update the Generate button click handler
  const regenerateSlug = () => {
    setSlug(generateSlug(name))
    setSlugManuallyEdited(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      // Validate required fields
      if (!name) throw new Error("Название товара обязательно")
      if (!slug) throw new Error("URL-slug обязателен")
      if (!price || isNaN(Number(price))) throw new Error("Укажите корректную цену")

      let finalImageUrl = imageUrl

      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `products/${fileName}`

        const { error: uploadError, data } = await supabase.storage.from("category-images").upload(filePath, imageFile)

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("category-images").getPublicUrl(filePath)

        finalImageUrl = publicUrl
      }

      // If no image was uploaded and no URL was provided, use a placeholder
      if (!finalImageUrl) {
        finalImageUrl = `/placeholder.svg?height=400&width=400&query=product`
      }

      const productData = {
        name,
        description,
        price: Number.parseFloat(price),
        slug,
        stock_quantity: Number.parseInt(stockQuantity || "0"),
        is_featured: isFeatured,
        category_id: categoryId || null,
        image_url: finalImageUrl,
      }

      console.log("Sending product data:", productData)

      // Create or update the product
      if (isEditing) {
        const { error } = await supabase.from("products").update(productData).eq("id", product.id)

        if (error) throw error

        setMessage("Товар успешно обновлен!")
        toast({
          title: "Товар обновлен",
          description: "Товар успешно обновлен.",
        })
      } else {
        const { error, data } = await supabase.from("products").insert(productData).select()

        if (error) throw error

        setMessage("Товар успешно создан!")
        toast({
          title: "Товар создан",
          description: "Товар успешно создан.",
        })
      }

      // Wait a moment before redirecting
      setTimeout(() => {
        router.push("/admin/products")
        router.refresh()
      }, 1500)
    } catch (err: any) {
      console.error("Error saving product:", err)
      setError(err.message || "Произошла ошибка при сохранении товара")
      toast({
        title: "Ошибка",
        description: err.message || "Не удалось сохранить товар. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Link href="/admin/products" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к товарам
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название товара</Label>
                  <Input id="name" name="name" value={name} onChange={handleNameChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL-slug</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      name="slug"
                      value={slug}
                      onChange={handleSlugChange}
                      required
                      placeholder="url-friendly-name"
                    />
                    <Button type="button" variant="outline" onClick={regenerateSlug}>
                      Создать
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Используется в URL, например, /product/your-slug</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Цена</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Количество на складе</Label>
                  <Input
                    id="stock"
                    name="stock_quantity"
                    type="number"
                    min="0"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Категория</Label>
                  <Select value={categoryId || "none"} onValueChange={setCategoryId} disabled={fetchingCategories}>
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
                  <Label htmlFor="featured">Рекомендуемый товар</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Изображение товара</Label>
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
                      <p className="text-xs text-gray-500 mt-2">Рекомендуемый размер: 800x800px</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">Или использовать URL изображения</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : isEditing ? "Обновить товар" : "Создать товар"}
          </Button>
        </div>

        {error && <div className="p-3 rounded-md bg-red-100 text-red-700 text-center">{error}</div>}

        {message && <div className="p-3 rounded-md bg-green-100 text-green-700 text-center">{message}</div>}
      </form>
    </div>
  )
}

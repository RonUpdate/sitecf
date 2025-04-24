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
import { getSupabaseClient } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import type { BlogPost, BlogCategory, BlogTag } from "@/types/blog"
import { generateSlug } from "@/lib/transliteration"

type BlogPostFormProps = {
  post?: BlogPost
}

export function BlogPostForm({ post }: BlogPostFormProps) {
  const isEditing = !!post
  const [title, setTitle] = useState(post?.title || "")
  const [slug, setSlug] = useState(post?.slug || "")
  const [content, setContent] = useState(post?.content || "")
  const [excerpt, setExcerpt] = useState(post?.excerpt || "")
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "")
  const [published, setPublished] = useState(post?.published || false)
  const [author, setAuthor] = useState(post?.author || "")
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(post?.featured_image || null)
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Add a state variable to track if the slug has been manually edited
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const router = useRouter()
  const supabase = getSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchingData(true)
        setError(null)

        // Получаем категории
        const { data: categoriesData, error: categoriesError } = await supabase
          .from("blog_categories")
          .select("*")
          .order("name", { ascending: true })

        if (categoriesError) throw categoriesError
        setCategories(categoriesData || [])

        // Получаем теги
        const { data: tagsData, error: tagsError } = await supabase
          .from("blog_tags")
          .select("*")
          .order("name", { ascending: true })

        if (tagsError) throw tagsError
        setTags(tagsData || [])

        // Если редактируем пост, получаем его категории и теги
        if (isEditing && post?.id) {
          // Получаем категории поста
          const { data: postCategories, error: postCategoriesError } = await supabase
            .from("blog_posts_categories")
            .select("blog_category_id")
            .eq("blog_post_id", post.id)

          if (postCategoriesError) throw postCategoriesError
          setSelectedCategories(postCategories.map((item) => item.blog_category_id))

          // Получаем теги поста
          const { data: postTags, error: postTagsError } = await supabase
            .from("blog_posts_tags")
            .select("tag_id")
            .eq("post_id", post.id)

          if (postTagsError) throw postTagsError
          setSelectedTags(postTags.map((item) => item.tag_id))
        }
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setFetchingData(false)
      }
    }

    fetchData()
  }, [supabase, isEditing, post])

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

  // Remove this function:
  // const generateSlug = (text: string) => {
  //   return text
  //     .toString()
  //     .toLowerCase()
  //     .trim()
  //     .replace(/\s+/g, "-") // Replace spaces with -
  //     .replace(/[^\w-]+/g, "") // Remove all non-word chars
  //     .replace(/--+/g, "-") // Replace multiple - with single -
  //     .replace(/^-+/, "") // Trim - from start of text
  //     .replace(/-+$/, "") // Trim - from end of text
  // }

  // Replace the existing handleTitleChange function with this improved version
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)

    // Only auto-generate the slug if it hasn't been manually edited
    // or if we're creating a new blog post (not editing)
    if (!slugManuallyEdited && (!isEditing || !post?.slug)) {
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
      let finalImageUrl = featuredImage

      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `blog/${fileName}`

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

      const now = new Date().toISOString()
      const postData = {
        title,
        slug,
        content,
        excerpt,
        featured_image: finalImageUrl,
        published,
        author,
        updated_at: now,
        published_at: published ? post?.published_at || now : null,
      }

      let postId = post?.id

      // Create or update the post
      if (isEditing) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", post.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from("blog_posts")
          .insert({ ...postData, created_at: now })
          .select()

        if (error) throw error
        postId = data[0].id
      }

      if (postId) {
        // Обновляем категории
        if (isEditing) {
          // Удаляем существующие связи
          await supabase.from("blog_posts_categories").delete().eq("blog_post_id", postId)
        }

        // Добавляем новые связи с категориями
        if (selectedCategories.length > 0) {
          const categoryLinks = selectedCategories.map((categoryId) => ({
            blog_post_id: postId,
            blog_category_id: categoryId,
          }))

          const { error: categoriesError } = await supabase.from("blog_posts_categories").insert(categoryLinks)

          if (categoriesError) throw categoriesError
        }

        // Обновляем теги
        if (isEditing) {
          // Удаляем существующие связи
          await supabase.from("blog_posts_tags").delete().eq("post_id", postId)
        }

        // Добавляем новые связи с тегами
        if (selectedTags.length > 0) {
          const tagLinks = selectedTags.map((tagId) => ({
            post_id: postId,
            tag_id: tagId,
          }))

          const { error: tagsError } = await supabase.from("blog_posts_tags").insert(tagLinks)

          if (tagsError) throw tagsError
        }
      }

      toast({
        title: isEditing ? "Статья обновлена" : "Статья создана",
        description: isEditing ? "Статья блога успешно обновлена." : "Статья блога успешно создана.",
      })

      router.push("/admin/blog")
      router.refresh()
    } catch (error: any) {
      console.error("Error saving blog post:", error)
      setError(error.message)
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить статью. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <div>
      <Link href="/admin/blog" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к списку статей
      </Link>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Заголовок</Label>
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
                      Сгенерировать
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Используется в URL, например, /blog/your-slug</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Краткое описание</Label>
                  <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Автор</Label>
                  <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="published"
                    checked={published}
                    onCheckedChange={(checked) => setPublished(checked as boolean)}
                  />
                  <Label htmlFor="published">Опубликовано</Label>
                </div>

                <div className="space-y-2">
                  <Label>Категории</Label>
                  <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                    {fetchingData ? (
                      <p>Загрузка категорий...</p>
                    ) : categories.length > 0 ? (
                      categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                          <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                        </div>
                      ))
                    ) : (
                      <p>Нет доступных категорий</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Теги</Label>
                  <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                    {fetchingData ? (
                      <p>Загрузка тегов...</p>
                    ) : tags.length > 0 ? (
                      tags.map((tag) => (
                        <div key={tag.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag.id}`}
                            checked={selectedTags.includes(tag.id)}
                            onCheckedChange={() => toggleTag(tag.id)}
                          />
                          <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
                        </div>
                      ))
                    ) : (
                      <p>Нет доступных тегов</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Содержание</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Изображение</Label>
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
                      <p className="text-xs text-gray-500 mt-2">Рекомендуемый размер: 1200x630px</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="featured_image">Или использовать URL изображения</Label>
                  <Input
                    id="featured_image"
                    type="url"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/blog">
            <Button type="button" variant="outline">
              Отмена
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : isEditing ? "Обновить статью" : "Создать статью"}
          </Button>
        </div>
      </form>
    </div>
  )
}

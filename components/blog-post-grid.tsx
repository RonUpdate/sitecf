"use client"

import { useState, useEffect } from "react"
import { BlogPostCard } from "@/components/blog-post-card"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import { Pagination } from "@/components/pagination"
import type { BlogPost } from "@/types/blog"

interface BlogPostGridProps {
  limit?: number
  categoryId?: string
  tagId?: string
  searchQuery?: string
  page?: number
  basePath?: string
  showPagination?: boolean
}

export function BlogPostGrid({
  limit = 0,
  categoryId,
  tagId,
  searchQuery,
  page = 1,
  basePath = "/blog",
  showPagination = true,
}: BlogPostGridProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const postsPerPage = limit || 9 // Если лимит не указан, показываем 9 постов на странице
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true)
        setError(null)

        // Базовый запрос для подсчета общего количества постов
        let countQuery = supabase.from("blog_posts").select("id", { count: "exact" }).eq("published", true)

        // Базовый запрос для получения постов
        let query = supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false })

        // Если указана категория, фильтруем по ней
        if (categoryId) {
          const { data: postIds } = await supabase
            .from("blog_posts_categories")
            .select("blog_post_id")
            .eq("blog_category_id", categoryId)

          if (postIds && postIds.length > 0) {
            const ids = postIds.map((item) => item.blog_post_id)
            countQuery = countQuery.in("id", ids)
            query = query.in("id", ids)
          } else {
            // Если нет постов в этой категории, возвращаем пустой массив
            setPosts([])
            setTotalPosts(0)
            setTotalPages(1)
            setLoading(false)
            return
          }
        }

        // Если указан тег, фильтруем по нему
        if (tagId) {
          const { data: postIds } = await supabase.from("blog_posts_tags").select("post_id").eq("tag_id", tagId)

          if (postIds && postIds.length > 0) {
            const ids = postIds.map((item) => item.post_id)
            countQuery = countQuery.in("id", ids)
            query = query.in("id", ids)
          } else {
            // Если нет постов с этим тегом, возвращаем пустой массив
            setPosts([])
            setTotalPosts(0)
            setTotalPages(1)
            setLoading(false)
            return
          }
        }

        // Если указан поисковый запрос, фильтруем по нему
        if (searchQuery) {
          const searchFilter = `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`
          countQuery = countQuery.or(searchFilter)
          query = query.or(searchFilter)
        }

        // Получаем общее количество постов
        const { count, error: countError } = await countQuery

        if (countError) throw countError

        setTotalPosts(count || 0)
        setTotalPages(Math.ceil((count || 0) / postsPerPage))

        // Применяем пагинацию
        if (postsPerPage > 0) {
          const from = (page - 1) * postsPerPage
          const to = from + postsPerPage - 1
          query = query.range(from, to)
        }

        // Выполняем запрос
        const { data, error } = await query

        if (error) throw error

        setPosts(data || [])
      } catch (error: any) {
        console.error("Error fetching blog posts:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [supabase, limit, categoryId, tagId, searchQuery, page, postsPerPage])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(postsPerPage)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        <span>{error}</span>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          {searchQuery ? `Статьи по запросу "${searchQuery}" не найдены.` : "Статьи не найдены."}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import type { BlogPost } from "@/types/blog"

export function PopularBlogPosts({ limit = 4 }: { limit?: number }) {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchPopularPosts() {
      try {
        setLoading(true)
        setError(null)

        // Получаем популярные статьи (в данном случае, просто последние опубликованные)
        // В реальном приложении здесь можно было бы использовать какой-то счетчик просмотров
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(limit)

        if (error) throw error

        setPosts(data || [])
      } catch (error: any) {
        console.error("Error fetching popular blog posts:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularPosts()
  }, [supabase, limit])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-32 w-full" />
            <CardContent className="p-3">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
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
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
            <div className="relative h-32 w-full">
              <Image
                src={post.featured_image || "/placeholder.svg?height=128&width=256&query=blog"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">{post.title}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

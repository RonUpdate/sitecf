"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  published_at: string | null
  author: string | null
}

export function LatestBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const supabase = createClientComponentClient()

        // Используем простой запрос без сложных соединений
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, featured_image, published_at, author")
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(3)

        if (error) {
          console.error("Error fetching blog posts:", error)
          setError("Не удалось загрузить последние статьи")
          setLoading(false)
          return
        }

        setPosts(data || [])
      } catch (err) {
        console.error("Error fetching blog posts:", err)
        setError("Произошла ошибка при загрузке статей")
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPosts()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
            <div className="bg-gray-200 h-6 rounded w-3/4 mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2 mb-2"></div>
            <div className="bg-gray-200 h-20 rounded mb-2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (posts.length === 0) {
    return <div className="text-center py-8">Статьи пока не добавлены</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <Link href={`/blog/${post.slug}`} key={post.id} className="group">
          <div className="overflow-hidden rounded-lg mb-3 h-48 relative">
            <Image
              src={post.featured_image || "/placeholder.svg?height=400&width=600&query=blog"}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{post.title}</h3>
          {post.published_at && (
            <p className="text-sm text-gray-500 mb-2">
              {formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ru })}
              {post.author && ` · ${post.author}`}
            </p>
          )}
          <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
        </Link>
      ))}
    </div>
  )
}

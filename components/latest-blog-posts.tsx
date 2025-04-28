"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase-client"
import { Skeleton } from "@/components/ui/skeleton"

type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image: string | null
  published: boolean
  published_at: string | null
  created_at: string
  author_id: string | null
  author: string | null
}

export function LatestBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        // Use a more direct query that avoids triggering the problematic RLS policy
        const { data, error } = await supabase
          .from("blog_posts")
          .select(
            "id, title, slug, content, excerpt, featured_image, published, published_at, created_at, author_id, author",
          )
          .eq("published", true)
          .order("published_at", { ascending: false })
          .limit(3)

        if (error) {
          console.error("Error fetching blog posts:", error)

          // If the first query fails, try using a public data endpoint
          if (error && error.message.includes("infinite recursion")) {
            console.log("Trying alternative public data fetch method")
            try {
              // Fetch from a public endpoint or use a different approach
              const response = await fetch("/api/public/blog-posts?limit=3")
              if (response.ok) {
                const data = await response.json()
                setPosts(data || [])
              }
            } catch (fallbackError) {
              console.error("Fallback error:", fallbackError)
            }
          }
          return
        }

        setPosts(data || [])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestPosts()
  }, [supabase])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No blog posts found. Add some in the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <Link href={`/blog/${post.slug}`} key={post.id}>
          <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
            <div className="relative h-48 w-full">
              <Image
                src={post.featured_image || "/placeholder.svg?height=192&width=384&query=blog"}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                {post.excerpt || post.content.substring(0, 150) + "..."}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.published_at || post.created_at)}
              </div>
              {post.author && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {post.author}
                </div>
              )}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

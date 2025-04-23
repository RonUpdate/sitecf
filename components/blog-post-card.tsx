import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Calendar, User } from "lucide-react"
import type { BlogPost } from "@/types/blog"

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
        <div className="relative h-40 sm:h-48 w-full">
          <Image
            src={post.featured_image || "/placeholder.svg?height=192&width=384&query=blog"}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg sm:text-xl mb-2">{post.title}</h3>
          <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 text-sm sm:text-base">
            {post.excerpt || post.content.substring(0, 150) + "..."}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-xs sm:text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            {formatDate(post.published_at)}
          </div>
          {post.author && (
            <div className="flex items-center">
              <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {post.author}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}

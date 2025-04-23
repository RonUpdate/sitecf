import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  // Получаем статью
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single()

  if (error || !post) {
    notFound()
  }

  // Получаем категории статьи
  const { data: categoryLinks } = await supabase
    .from("blog_posts_categories")
    .select("blog_category_id")
    .eq("blog_post_id", post.id)

  let categories = []
  if (categoryLinks && categoryLinks.length > 0) {
    const categoryIds = categoryLinks.map((link) => link.blog_category_id)
    const { data: categoriesData } = await supabase.from("blog_categories").select("*").in("id", categoryIds)
    categories = categoriesData || []
  }

  // Получаем теги статьи
  const { data: tagLinks } = await supabase.from("blog_posts_tags").select("tag_id").eq("post_id", post.id)

  let tags = []
  if (tagLinks && tagLinks.length > 0) {
    const tagIds = tagLinks.map((link) => link.tag_id)
    const { data: tagsData } = await supabase.from("blog_tags").select("*").in("id", tagIds)
    tags = tagsData || []
  }

  // Получаем похожие статьи (из тех же категорий)
  let relatedPosts = []
  if (categoryLinks && categoryLinks.length > 0) {
    const categoryIds = categoryLinks.map((link) => link.blog_category_id)

    // Получаем ID статей из тех же категорий
    const { data: relatedPostIds } = await supabase
      .from("blog_posts_categories")
      .select("blog_post_id")
      .in("blog_category_id", categoryIds)
      .neq("blog_post_id", post.id)

    if (relatedPostIds && relatedPostIds.length > 0) {
      const postIds = [...new Set(relatedPostIds.map((item) => item.blog_post_id))].slice(0, 3)

      const { data: relatedPostsData } = await supabase
        .from("blog_posts")
        .select("*")
        .in("id", postIds)
        .eq("published", true)
        .limit(3)

      relatedPosts = relatedPostsData || []
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <div className="container px-4 py-8 md:py-12 md:px-6">
      <Link href="/blog" className="flex items-center text-sm mb-4 md:mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к блогу
      </Link>

      <article className="max-w-4xl mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            {post.published_at && (
              <div className="flex items-center">
                <Calendar className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                {formatDate(post.published_at)}
              </div>
            )}
            {post.author && (
              <div className="flex items-center">
                <User className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                {post.author}
              </div>
            )}
          </div>

          {post.featured_image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6 md:mb-8">
              <Image
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
              <span className="text-xs md:text-sm font-medium">Категории:</span>
              {categories.map((category) => (
                <Link key={category.id} href={`/blog/category/${category.slug}`}>
                  <Badge variant="outline">{category.name}</Badge>
                </Link>
              ))}
            </div>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs md:text-sm font-medium">Теги:</span>
              {tags.map((tag) => (
                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                  <Badge variant="outline">{tag.name}</Badge>
                </Link>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <div className="max-w-4xl mx-auto mt-10 md:mt-16">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Похожие статьи</h2>
          <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                <div className="border rounded-lg overflow-hidden transition-all group-hover:shadow-md">
                  {relatedPost.featured_image && (
                    <div className="relative h-32 md:h-40 w-full">
                      <Image
                        src={relatedPost.featured_image || "/placeholder.svg"}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-3 md:p-4">
                    <h3 className="font-semibold text-sm md:text-base group-hover:text-primary">{relatedPost.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">
                      {formatDate(relatedPost.published_at)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

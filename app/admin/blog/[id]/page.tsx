import { notFound } from "next/navigation"
import { BlogPostForm } from "@/components/blog-post-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    const supabase = createServerComponentClient({ cookies })

    // Проверяем, что id является валидным UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(params.id)) {
      console.error("Invalid UUID format:", params.id)
      notFound()
    }

    const { data: post, error } = await supabase.from("blog_posts").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching blog post:", error)
      notFound()
    }

    if (!post) {
      notFound()
    }

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Редактировать статью</h1>
        <BlogPostForm post={post} />
      </div>
    )
  } catch (error) {
    console.error("Error in EditBlogPostPage:", error)
    notFound()
  }
}

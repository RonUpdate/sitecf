import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BlogPostGrid } from "@/components/blog-post-grid"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function BlogTagPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const supabase = createServerComponentClient({ cookies })

  // Получаем тег
  const { data: tag, error } = await supabase.from("blog_tags").select("*").eq("slug", params.slug).single()

  if (error || !tag) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/blog" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к блогу
      </Link>

      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Тег: {tag.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">Статьи с тегом {tag.name}</p>
      </div>

      <BlogPostGrid tagId={tag.id} page={page} basePath={`/blog/tag/${params.slug}`} />
    </div>
  )
}

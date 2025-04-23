import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BlogPostGrid } from "@/components/blog-post-grid"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const supabase = createServerComponentClient({ cookies })

  // Получаем категорию
  const { data: category, error } = await supabase.from("blog_categories").select("*").eq("slug", params.slug).single()

  if (error || !category) {
    notFound()
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/blog" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к блогу
      </Link>

      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Категория: {category.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">Статьи в категории {category.name}</p>
      </div>

      <BlogPostGrid categoryId={category.id} page={page} basePath={`/blog/category/${params.slug}`} />
    </div>
  )
}

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BlogPostGrid } from "@/components/blog-post-grid"
import { BlogSearchForm } from "@/components/blog-search-form"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const supabase = createServerComponentClient({ cookies })

  // Получаем категории
  const { data: categories } = await supabase.from("blog_categories").select("*").order("name", { ascending: true })

  // Получаем теги
  const { data: tags } = await supabase.from("blog_tags").select("*").order("name", { ascending: true })

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад на главную
      </Link>

      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Блог</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px] mb-6">
          Последние новости, советы и обзоры
        </p>
        <BlogSearchForm className="max-w-md" />
      </div>

      {categories && categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Категории</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/blog">
              <Badge variant="outline" className="hover:bg-primary/10">
                Все
              </Badge>
            </Link>
            {categories.map((category) => (
              <Link key={category.id} href={`/blog/category/${category.slug}`}>
                <Badge variant="outline" className="hover:bg-primary/10">
                  {category.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {tags && tags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Теги</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                <Badge variant="outline" className="hover:bg-primary/10">
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <BlogPostGrid page={page} basePath="/blog" />
    </div>
  )
}

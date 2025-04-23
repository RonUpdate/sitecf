import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { BlogPostGrid } from "@/components/blog-post-grid"
import { BlogSearchForm } from "@/components/blog-search-form"

export const dynamic = "force-dynamic"

export default function BlogSearchPage({
  searchParams,
}: {
  searchParams: { q: string; page?: string }
}) {
  const query = searchParams.q || ""
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/blog" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к блогу
      </Link>

      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Поиск по блогу</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px] mb-6">
          {query ? `Результаты поиска по запросу "${query}"` : "Введите поисковый запрос"}
        </p>
        <BlogSearchForm className="max-w-md" />
      </div>

      {query && (
        <BlogPostGrid searchQuery={query} page={page} basePath={`/blog/search?q=${encodeURIComponent(query)}`} />
      )}
    </div>
  )
}

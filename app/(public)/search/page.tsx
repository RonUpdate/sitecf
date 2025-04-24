import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { UnifiedSearch } from "@/components/unified-search"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string; type?: string }
}) {
  const query = searchParams.q || ""
  const type = searchParams.type || "coloringPage" // Default to coloring pages
  const isProduct = type === "product"
  const tableName = isProduct ? "products" : "coloring_pages"
  const nameField = isProduct ? "name" : "title"

  const supabase = await createServerSupabaseClient()

  const { data: searchResults } = await supabase
    .from(tableName)
    .select(`
      *,
      categories:category_id (
        name,
        slug
      )
    `)
    .or(`${nameField}.ilike.%${query}%,description.ilike.%${query}%,slug.ilike.%${query}%`)
    .order("is_featured", { ascending: false })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price)
  }

  return (
    <div className="container px-4 py-12 md:px-6 md:py-16">
      <Link href="/" className="flex items-center text-sm mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад на главную
      </Link>

      <div className="flex flex-col items-center justify-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter mb-4">Результаты поиска</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px] mb-6">
          {query ? `Показаны результаты для "${query}"` : `Поиск ${isProduct ? "товаров" : "раскрасок"}`}
        </p>
        <div className="flex gap-4 mb-6">
          <Link href={`/search?type=product&q=${query}`}>
            <Button variant={isProduct ? "default" : "outline"}>Товары</Button>
          </Link>
          <Link href={`/search?type=coloringPage&q=${query}`}>
            <Button variant={!isProduct ? "default" : "outline"}>Раскраски</Button>
          </Link>
        </div>
        <UnifiedSearch type={isProduct ? "product" : "coloringPage"} className="max-w-md" />
      </div>

      {searchResults && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((item) => (
            <Link href={`/${isProduct ? "product" : "coloring-page"}/${item.slug}`} key={item.id}>
              <div className="group border rounded-lg overflow-hidden transition-all hover:shadow-lg">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={
                      isProduct
                        ? item.image_url || "/placeholder.svg?height=256&width=256&query=product"
                        : item.thumbnail_url ||
                          item.image_url ||
                          "/placeholder.svg?height=256&width=256&query=coloring+page"
                    }
                    alt={isProduct ? item.name : item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  {item.is_featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary">Рекомендуемый</Badge>
                    </div>
                  )}
                  {item.categories && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-white/80 text-black">
                        {item.categories.name}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{isProduct ? item.name : item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm mt-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    {isProduct ? (
                      <Badge variant={item.stock_quantity > 0 ? "outline" : "destructive"}>
                        {item.stock_quantity > 0 ? `${item.stock_quantity} шт.` : "Нет в наличии"}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{item.difficulty_level}</Badge>
                    )}
                    <span className="font-bold text-primary">{formatPrice(item.price)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            {query
              ? `${isProduct ? "Товары" : "Раскраски"} по запросу "${query}" не найдены.`
              : `Введите поисковый запрос для поиска ${isProduct ? "товаров" : "раскрасок"}.`}
          </p>
        </div>
      )}
    </div>
  )
}

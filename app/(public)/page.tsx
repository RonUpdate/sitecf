import { Palette } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import { CategoryList } from "@/components/category-list"

export const dynamic = "force-dynamic"

export default async function Home() {
  const supabase = await createServerSupabaseClient()

  // Получаем категории
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  // Получаем избранные раскраски
  const { data: featuredPages } = await supabase
    .from("coloring_pages")
    .select(`
      *,
      categories:category_id (
        name,
        slug
      )
    `)
    .eq("is_featured", true)
    .order("download_count", { ascending: false })
    .limit(6)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <>
      <section className="py-12 md:py-20 bg-gradient-to-b from-accent to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
              <Palette className="w-8 h-8 md:w-10 md:h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Beautiful Coloring Pages for Everyone
            </h1>
          </div>
        </div>
      </section>

      {/* Секция с категориями */}
      <section className="py-8 bg-background border-b">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <h2 className="text-2xl font-bold tracking-tighter mb-4">Categories</h2>
          </div>
          <CategoryList categories={categories || []} />
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Coloring Pages</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-[700px]">
              Our hand-picked selection of the most beautiful and popular coloring pages
            </p>
          </div>

          {featuredPages && featuredPages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPages.map((page) => (
                <Link href={`/coloring-page/${page.slug}`} key={page.id}>
                  <div className="group border rounded-lg overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={
                          page.thumbnail_url ||
                          page.image_url ||
                          "/placeholder.svg?height=256&width=256&query=coloring+page" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
                        }
                        alt={page.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary">Featured</Badge>
                      </div>
                      {page.categories && (
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="outline" className="bg-white/80 text-black">
                            {page.categories.name}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg">{page.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm mt-1">{page.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline">{page.difficulty_level}</Badge>
                        <span className="font-bold text-primary">{formatPrice(page.price)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No coloring pages found.</p>
            </div>
          )}

          {featuredPages && featuredPages.length > 0 && (
            <div className="flex justify-center mt-12">
              <Link href="/featured">
                <Button variant="outline" size="lg">
                  View All Coloring Pages
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

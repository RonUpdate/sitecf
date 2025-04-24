import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { UnifiedItemDetail } from "@/components/unified-item-detail"

export default async function ColoringPagePage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerSupabaseClient()

  const { data: coloringPage, error } = await supabase
    .from("coloring_pages")
    .select(`
      *,
      categories:category_id (
        name,
        slug
      )
    `)
    .eq("slug", params.slug)
    .single()

  if (error || !coloringPage) {
    notFound()
  }

  // Get related coloring pages from the same category
  const { data: relatedPages } = await supabase
    .from("coloring_pages")
    .select("id, title, thumbnail_url, slug")
    .eq("category_id", coloringPage.category_id)
    .neq("id", coloringPage.id)
    .limit(4)

  return (
    <div>
      <UnifiedItemDetail item={coloringPage} type="coloringPage" />

      {relatedPages && relatedPages.length > 0 && (
        <div className="container px-4 pb-12 md:px-6">
          <h2 className="text-2xl font-bold mb-6">Вам также может понравиться</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {relatedPages.map((page) => (
              <Link href={`/coloring-page/${page.slug}`} key={page.id}>
                <div className="group">
                  <div className="relative aspect-square overflow-hidden rounded-lg border">
                    <Image
                      src={page.thumbnail_url || "/placeholder.svg?height=200&width=200&query=coloring+page"}
                      alt={page.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-medium truncate">{page.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

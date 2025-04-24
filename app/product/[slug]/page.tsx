import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { UnifiedItemDetail } from "@/components/unified-item-detail"

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  const { data: product, error } = await supabase
    .from("products")
    .select(`
      *,
      categories:category_id (
        name,
        slug
      )
    `)
    .eq("slug", params.slug)
    .single()

  if (error || !product) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b dark:bg-gray-950 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="text-xl font-bold">
            Креатив Фабрика
          </Link>
          <Link href="/admin">
            <Button variant="outline">Админ-панель</Button>
          </Link>
        </div>
      </header>
      <main>
        <UnifiedItemDetail item={product} type="product" />
      </main>
    </div>
  )
}

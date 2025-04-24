import { UnifiedItemTable } from "@/components/unified-item-table"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient()

  // Get products with category information
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories:category_id (
        name
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Товары</h1>
      </div>

      <UnifiedItemTable
        type="product"
        initialItems={products || []}
        addNewUrl="/admin/products/new"
        addNewLabel="Добавить товар"
      />
    </div>
  )
}

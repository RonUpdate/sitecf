import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductTable } from "@/components/product-table"
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
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductTable products={products || []} />
    </div>
  )
}

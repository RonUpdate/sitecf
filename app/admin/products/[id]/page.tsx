import { notFound } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createServerSupabaseClient()

  const { data: product, error } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}

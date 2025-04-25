import { notFound } from "next/navigation"
import { UnifiedProductForm } from "@/components/unified-product-form"
import { createServerSupabaseClient } from "@/lib/supabase-server"
// Удаляем импорт generateMetadata или Metadata, если они есть

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerSupabaseClient()

  const { data: product, error } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (error || !product) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Редактировать товар</h1>
      <UnifiedProductForm
        item={product}
        type="product"
        backUrl="/admin/products"
        backLabel="Назад к товарам"
        successUrl="/admin/products"
      />
    </div>
  )
}
